import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabaseAdmin } from '@/lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

// Helper function to safely convert Unix timestamp to ISO string
function toISOStringFromTimestamp(timestamp: number | null | undefined): string | null {
  if (!timestamp || timestamp === 0 || isNaN(timestamp)) {
    return null
  }
  try {
    const date = new Date(timestamp * 1000)
    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.warn('Invalid timestamp value:', timestamp)
      return null
    }
    return date.toISOString()
  } catch (error) {
    console.warn('Error converting timestamp to ISO string:', timestamp, error)
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')!

    console.log('🔔 WEBHOOK RECEIVED - Raw body length:', body.length)
    console.log('🔔 WEBHOOK RECEIVED - Signature:', signature ? 'Present' : 'Missing')

    let event: Stripe.Event

    try {
      // Handle manual triggers (for testing)
      if (signature === 'manual_trigger') {
        console.log('Manual webhook trigger detected')
        const eventData = JSON.parse(body)
        event = eventData as Stripe.Event
      } else {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
      }
    } catch (err) {
      console.error('❌ Webhook signature verification failed:', err)
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      )
    }

    console.log('🔔 Received Stripe webhook:', event.type)
    console.log('🔔 Event ID:', event.id)

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session)
        break

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice)
        break

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('❌ Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log('🛒 Checkout session completed:', session.id)
  console.log('Session metadata:', session.metadata)
  console.log('Session payment status:', session.payment_status)
  console.log('Session mode:', session.mode)

  const { userId, type, planId, planName, fromPlan, isUpgrade } = session.metadata || {}
  
  console.log('Extracted metadata:', { userId, type, planId, planName, fromPlan, isUpgrade })

  // Handle upgrade-specific checkout sessions
  if (type === 'upgrade' && isUpgrade === 'true' && userId && planId && planName) {
    console.log('Processing subscription upgrade...')
    console.log('User ID:', userId)
    console.log('From plan:', fromPlan)
    console.log('To plan:', planName)

    try {
      // Get user's current subscription
      const { data: currentSubscription, error: subscriptionError } = await supabaseAdmin
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .single()

      if (subscriptionError || !currentSubscription) {
        console.error('Error fetching current subscription:', subscriptionError)
        return
      }

      // Get user's Stripe customer ID
      const { data: userProfile, error: profileError } = await supabaseAdmin
        .from('user_profiles')
        .select('stripe_customer_id')
        .eq('user_id', userId)
        .single()

      if (profileError || !userProfile?.stripe_customer_id) {
        console.error('Error fetching user profile:', profileError)
        return
      }

      // Get the current Stripe subscription
      const stripeSubscription = await stripe.subscriptions.retrieve(currentSubscription.stripe_subscription_id)
      
      // Define the new plan price ID
      const SUBSCRIPTION_PLANS = {
        foundation: process.env.STRIPE_FOUNDATION_MONTHLY_PRICE_ID,
        growth: process.env.STRIPE_GROWTH_MONTHLY_PRICE_ID,
        elite: process.env.STRIPE_ELITE_MONTHLY_PRICE_ID,
      }

      const newPriceId = SUBSCRIPTION_PLANS[planId as keyof typeof SUBSCRIPTION_PLANS]
      
      if (!newPriceId) {
        console.error('Invalid plan ID:', planId)
        return
      }

      // Update the Stripe subscription to the new plan
      const updatedSubscription = await stripe.subscriptions.update(stripeSubscription.id, {
        items: [{
          id: stripeSubscription.items.data[0].id,
          price: newPriceId,
        }],
        proration_behavior: 'none', // We already handled proration in the checkout
      })

      console.log('✅ Stripe subscription updated successfully')
      console.log('New subscription ID:', updatedSubscription.id)

      // Update the subscription in our database
      const { error: updateError } = await supabaseAdmin
        .from('user_subscriptions')
        .update({
          plan_name: planName,
          plan_id: planId,
          current_period_start: toISOStringFromTimestamp(updatedSubscription.current_period_start),
          current_period_end: toISOStringFromTimestamp(updatedSubscription.current_period_end),
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId)

      if (updateError) {
        console.error('Error updating subscription in database:', updateError)
        return
      }

      console.log('✅ Database subscription updated successfully')

    } catch (error) {
      console.error('Error processing subscription upgrade:', error)
    }
    
    return // Exit early for upgrade processing
  }
  
  // Handle regular subscription checkout sessions
  if (session.mode === 'subscription' && session.subscription) {
    const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
    await handleSubscriptionCreated(subscription)
    return
  }
  
  // Handle payment mode checkout (for products like MF Roller)
  if (session.mode === 'payment' && session.payment_status === 'paid') {
    console.log('💰 Payment checkout completed successfully')
    
    // Check if an Elite coupon was used
    const { elite_coupon_code, elite_coupon_id } = session.metadata || {}
    
    if (elite_coupon_code && elite_coupon_id) {
      console.log('🎁 Elite coupon detected in checkout:', elite_coupon_code)
      
      try {
        // Mark the Elite coupon as used
        const { error: updateError } = await supabaseAdmin
          .from('elite_coupons')
          .update({
            is_used: true,
            used_at: new Date().toISOString(),
            used_in_session_id: session.id
          })
          .eq('id', parseInt(elite_coupon_id))
          .eq('coupon_code', elite_coupon_code)
        
        if (updateError) {
          console.error('❌ Error marking Elite coupon as used:', updateError)
        } else {
          console.log('✅ Elite coupon marked as used:', elite_coupon_code)
        }
      } catch (error) {
        console.error('❌ Error updating Elite coupon:', error)
      }
    }
    
    // Check if a promotion code was used in the checkout
    if (session.total_details?.amount_discount && session.total_details.amount_discount > 0) {
      console.log('🎟️ Promotion code was applied - discount amount:', session.total_details.amount_discount)
      
      // Try to get the promotion code from the checkout session
      try {
        // Retrieve the checkout session with expanded promotion code
        const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
          expand: ['total_details.breakdown.discounts']
        })
        
        if (fullSession.total_details?.breakdown?.discounts?.[0]?.discount?.coupon) {
          const couponId = fullSession.total_details.breakdown.discounts[0].discount.coupon
          const coupon = typeof couponId === 'string' 
            ? await stripe.coupons.retrieve(couponId)
            : couponId
          
          // Check if this is an Elite coupon via metadata
          if (coupon.metadata?.elite_coupon_code && coupon.metadata?.elite_coupon_id) {
            console.log('🎁 Elite coupon promotion code was used:', coupon.metadata.elite_coupon_code)
            
            // Mark the Elite coupon as used
            const { error: updateError } = await supabaseAdmin
              .from('elite_coupons')
              .update({
                is_used: true,
                used_at: new Date().toISOString(),
                used_in_session_id: session.id
              })
              .eq('id', parseInt(coupon.metadata.elite_coupon_id))
              .eq('coupon_code', coupon.metadata.elite_coupon_code)
            
            if (updateError) {
              console.error('❌ Error marking Elite coupon as used:', updateError)
            } else {
              console.log('✅ Elite coupon marked as used:', coupon.metadata.elite_coupon_code)
            }
          }
        }
      } catch (error) {
        console.error('❌ Error checking promotion code:', error)
      }
    }
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  try {
    console.log('📝 Subscription created:', subscription.id)
    console.log('📝 Subscription metadata:', JSON.stringify(subscription.metadata))
    
    const userId = subscription.metadata?.userId
    if (!userId) {
      console.error('❌ No userId in subscription metadata')
      console.error('❌ Full subscription object:', JSON.stringify(subscription, null, 2))
      throw new Error('No userId in subscription metadata')
    }

    const planId = subscription.metadata?.planId
    const planName = subscription.metadata?.planName || 'Unknown Plan'
    const billingPeriod = subscription.metadata?.billingPeriod || 'monthly'

    console.log('📝 Processing subscription for user:', userId)
    console.log('📝 Plan:', planName, '/', planId)

    // Get customer details
    const customer = await stripe.customers.retrieve(subscription.customer as string)
    const customerId = typeof customer === 'string' ? customer : customer.id
    console.log('📝 Customer ID:', customerId)

    // Get period dates - in newer Stripe API versions, these might be in subscription items
    let currentPeriodStart = subscription.current_period_start
    let currentPeriodEnd = subscription.current_period_end
    
    // If not at subscription level, get from first subscription item
    if (!currentPeriodStart || !currentPeriodEnd) {
      if (subscription.items?.data?.[0]) {
        currentPeriodStart = subscription.items.data[0].current_period_start
        currentPeriodEnd = subscription.items.data[0].current_period_end
        console.log('📝 Using period dates from subscription item')
      }
    }
    
    console.log('📝 Period dates:', {
      start: currentPeriodStart,
      end: currentPeriodEnd
    })

    // Create or update subscription record
    const subscriptionData: any = {
      user_id: userId,
      stripe_customer_id: customerId,
      stripe_subscription_id: subscription.id,
      plan_id: planId,
      plan_name: planName,
      status: subscription.status,
      cancel_at_period_end: subscription.cancel_at_period_end,
    }

    // Add date fields using helper function for safe conversion
    const periodStart = toISOStringFromTimestamp(currentPeriodStart)
    const periodEnd = toISOStringFromTimestamp(currentPeriodEnd)
    
    if (!periodStart || !periodEnd) {
      console.error('❌ Invalid period dates in subscription:', {
        currentPeriodStart,
        currentPeriodEnd,
        periodStart,
        periodEnd
      })
      throw new Error('Invalid subscription period dates')
    }
    
    subscriptionData.current_period_start = periodStart
    subscriptionData.current_period_end = periodEnd

    // Add optional date fields only if they exist and are valid
    const canceledAt = toISOStringFromTimestamp(subscription.canceled_at)
    if (canceledAt) {
      subscriptionData.canceled_at = canceledAt
    }
    
    const trialStart = toISOStringFromTimestamp(subscription.trial_start)
    if (trialStart) {
      subscriptionData.trial_start = trialStart
    }
    
    const trialEnd = toISOStringFromTimestamp(subscription.trial_end)
    if (trialEnd) {
      subscriptionData.trial_end = trialEnd
    }

    console.log('📝 Saving subscription data:', JSON.stringify(subscriptionData, null, 2))

    // First, check if a subscription already exists for this customer or subscription ID
    const { data: existingSubscription, error: checkError } = await supabaseAdmin
      .from('user_subscriptions')
      .select('stripe_subscription_id, stripe_customer_id')
      .or(`stripe_subscription_id.eq.${subscription.id},stripe_customer_id.eq.${customerId}`)
      .maybeSingle()

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('❌ Error checking existing subscription:', checkError)
      throw checkError
    }

    let error: any = null
    
    if (existingSubscription) {
      // Update existing subscription
      console.log('📝 Updating existing subscription:', existingSubscription.stripe_subscription_id)
      const { error: updateError } = await supabaseAdmin
        .from('user_subscriptions')
        .update(subscriptionData)
        .or(`stripe_subscription_id.eq.${subscription.id},stripe_customer_id.eq.${customerId}`)
      
      error = updateError
    } else {
      // Insert new subscription
      console.log('📝 Inserting new subscription')
      const { error: insertError } = await supabaseAdmin
        .from('user_subscriptions')
        .insert(subscriptionData)
      
      error = insertError
    }

    if (error) {
      console.error('❌ Error saving subscription:', error)
      console.error('❌ Error code:', error.code)
      console.error('❌ Error message:', error.message)
      console.error('❌ Error details:', JSON.stringify(error, null, 2))
      
      // If it's a duplicate key error on stripe_customer_id, try to update instead
      if (error.code === '23505' && error.message.includes('stripe_customer_id')) {
        console.log('🔄 Duplicate customer ID detected, attempting update instead')
        const { error: updateError } = await supabaseAdmin
          .from('user_subscriptions')
          .update(subscriptionData)
          .eq('stripe_customer_id', customerId)
        
        if (updateError) {
          console.error('❌ Error updating subscription:', updateError)
          throw updateError
        } else {
          console.log('✅ Subscription updated successfully after duplicate key error')
        }
      } else {
        throw error
      }
    } else {
      console.log('✅ Subscription saved successfully')
    }

    // Check if user profile exists, if not create it
    const { data: existingProfile, error: profileCheckError } = await supabaseAdmin
      .from('user_profiles')
      .select('id, role')
      .eq('user_id', userId)
      .single()

    if (profileCheckError && profileCheckError.code === 'PGRST116') {
      // Profile doesn't exist, create it
      const { error: createError } = await supabaseAdmin
        .from('user_profiles')
        .insert([{
          user_id: userId,
          role: 'client',
          current_plan: planId,
          subscription_status: subscription.status,
          stripe_customer_id: customerId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])

      if (createError) {
        console.error('❌ Error creating user profile:', createError)
      } else {
        console.log('✅ Created new user profile with role: client')
      }
    } else if (profileCheckError) {
      console.error('❌ Error checking user profile:', profileCheckError)
    } else {
      // Profile exists, update it
      const { error: profileError } = await supabaseAdmin
        .from('user_profiles')
        .update({
          current_plan: planId,
          subscription_status: subscription.status,
          stripe_customer_id: customerId,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)

      if (profileError) {
        console.error('❌ Error updating user profile:', profileError)
      } else {
        console.log('✅ Updated existing user profile')
      }
    }

    // Create Elite coupon if this is an Elite plan
    let eliteCouponCode = null
    if (planName === 'Elite') {
      try {
        const customerEmail = typeof customer !== 'string' && customer.email ? customer.email : null
        
        if (customerEmail && userId) {
          console.log('🎁 Creating Elite MF Roller coupon for Elite subscriber')
          
          const couponResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/create-elite-coupon`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: userId,
              customerEmail: customerEmail,
              planName: planName
            })
          })
          
          if (couponResponse.ok) {
            const couponData = await couponResponse.json()
            eliteCouponCode = couponData.coupon.code
            console.log('✅ Elite coupon created successfully:', eliteCouponCode)
          } else {
            console.error('❌ Failed to create Elite coupon')
          }
        } else {
          console.log('⚠️ No customer email or user ID found, skipping Elite coupon creation')
        }
      } catch (couponError) {
        console.error('❌ Error creating Elite coupon:', couponError)
        // Don't fail the webhook if coupon creation fails
      }
    }

    // Send confirmation email
    try {
      const customerEmail = typeof customer !== 'string' && customer.email ? customer.email : null
      
      if (customerEmail) {
        // Get plan price from subscription
        const planPrice = subscription.items.data[0]?.price.unit_amount 
          ? (subscription.items.data[0].price.unit_amount / 100).toString()
          : '0'
        
        console.log('📧 Sending subscription confirmation email to:', customerEmail)
        
        const emailResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/send-subscription-confirmation`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: customerEmail,
            planName: planName,
            planPrice: planPrice,
            billingPeriod: billingPeriod,
            trialEnd: toISOStringFromTimestamp(subscription.trial_end),
            couponCode: eliteCouponCode
          })
        })
        
        if (emailResponse.ok) {
          const emailData = await emailResponse.json()
          if (emailData.skipped) {
            console.warn('⚠️ Email sending skipped:', emailData.message || 'Email credentials not configured')
          } else {
            console.log('✅ Subscription confirmation email sent successfully')
          }
        } else {
          const errorData = await emailResponse.json().catch(() => ({}))
          console.error('❌ Failed to send subscription confirmation email')
          console.error('Error details:', errorData.error || errorData.message || 'Unknown error')
        }
      } else {
        console.log('⚠️ No customer email found, skipping confirmation email')
      }
    } catch (emailError) {
      console.error('❌ Error sending subscription confirmation email:', emailError)
      // Don't fail the webhook if email fails
    }

    console.log('✅ Subscription created and saved successfully')
  } catch (error) {
    console.error('❌ ERROR in handleSubscriptionCreated:', error)
    throw error
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log('🔄 Subscription updated:', subscription.id)
  console.log('Status:', subscription.status)
  console.log('Customer ID:', subscription.customer)

  try {
    // Find the user by Stripe customer ID
    const { data: userProfile, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .select('user_id')
      .eq('stripe_customer_id', subscription.customer as string)
      .single()

    if (profileError || !userProfile) {
      console.error('User not found for customer ID:', subscription.customer)
      return
    }

    // Get the current price ID from Stripe to determine the plan
    const currentPriceId = subscription.items.data[0].price.id
    console.log('Current price ID from Stripe:', currentPriceId)
    
    // Map price ID to plan information
    const PRICE_TO_PLAN = {
      [process.env.STRIPE_FOUNDATION_MONTHLY_PRICE_ID!]: { plan_id: 'foundation', plan_name: 'Foundation' },
      [process.env.STRIPE_FOUNDATION_ANNUAL_PRICE_ID!]: { plan_id: 'foundation', plan_name: 'Foundation' },
      [process.env.STRIPE_FOUNDATION_SIXMONTH_PRICE_ID!]: { plan_id: 'foundation', plan_name: 'Foundation' },
      [process.env.STRIPE_GROWTH_MONTHLY_PRICE_ID!]: { plan_id: 'growth', plan_name: 'Growth' },
      [process.env.STRIPE_GROWTH_ANNUAL_PRICE_ID!]: { plan_id: 'growth', plan_name: 'Growth' },
      [process.env.STRIPE_GROWTH_SIXMONTH_PRICE_ID!]: { plan_id: 'growth', plan_name: 'Growth' },
      [process.env.STRIPE_ELITE_MONTHLY_PRICE_ID!]: { plan_id: 'elite', plan_name: 'Elite' },
      [process.env.STRIPE_ELITE_ANNUAL_PRICE_ID!]: { plan_id: 'elite', plan_name: 'Elite' },
      [process.env.STRIPE_ELITE_SIXMONTH_PRICE_ID!]: { plan_id: 'elite', plan_name: 'Elite' },
    }
    
    const planInfo = PRICE_TO_PLAN[currentPriceId]
    console.log('Plan info from price ID:', planInfo)
    
    // Update the subscription in our database
    const updateData: any = {
      status: subscription.status,
      current_period_start: toISOStringFromTimestamp(subscription.current_period_start),
      current_period_end: toISOStringFromTimestamp(subscription.current_period_end),
      cancel_at_period_end: subscription.cancel_at_period_end,
      updated_at: new Date().toISOString(),
    }

    // Add optional date fields only if they exist and are valid
    const canceledAt = toISOStringFromTimestamp(subscription.canceled_at)
    if (canceledAt) {
      updateData.canceled_at = canceledAt
    }
    
    const trialStart = toISOStringFromTimestamp(subscription.trial_start)
    if (trialStart) {
      updateData.trial_start = trialStart
    }
    
    const trialEnd = toISOStringFromTimestamp(subscription.trial_end)
    if (trialEnd) {
      updateData.trial_end = trialEnd
    }
    
    // Add plan information if we can determine it from the price ID
    if (planInfo) {
      updateData.plan_id = planInfo.plan_id
      updateData.plan_name = planInfo.plan_name
      console.log('Updating plan to:', planInfo.plan_name)
    }
    
    const { error: updateError } = await supabaseAdmin
      .from('user_subscriptions')
      .update(updateData)
      .eq('stripe_subscription_id', subscription.id)

    if (updateError) {
      console.error('Error updating subscription:', updateError)
    } else {
      console.log('✅ Subscription status updated in database:', subscription.status)
    }

    // Update user profile status
    const profileUpdateData: any = {
      subscription_status: subscription.status,
    }
    
    // Add plan information to user profile if available
    if (planInfo) {
      profileUpdateData.current_plan = planInfo.plan_id
    }
    
    const { error: profileUpdateError } = await supabaseAdmin
      .from('user_profiles')
      .update(profileUpdateData)
      .eq('user_id', userProfile.user_id)

    if (profileUpdateError) {
      console.error('❌ Error updating user profile:', profileUpdateError)
    } else {
      console.log('✅ User profile updated successfully')
    }

  } catch (error) {
    console.error('Error handling subscription update:', error)
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('🗑️ Subscription deleted:', subscription.id)
  console.log('Customer ID:', subscription.customer)

  try {
    // Find the user by Stripe customer ID
    const { data: userProfile, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .select('user_id')
      .eq('stripe_customer_id', subscription.customer as string)
      .single()

    if (profileError || !userProfile) {
      console.error('User not found for customer ID:', subscription.customer)
      return
    }

    // Update subscription status to canceled
    const { error } = await supabaseAdmin
      .from('user_subscriptions')
      .update({
        status: 'canceled',
        canceled_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_subscription_id', subscription.id)

    if (error) {
      console.error('❌ Error updating deleted subscription:', error)
      return
    }

    // Update user profile
    const { error: profileUpdateError } = await supabaseAdmin
      .from('user_profiles')
      .update({
        subscription_status: 'canceled',
        current_plan: null,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userProfile.user_id)

    if (profileUpdateError) {
      console.error('❌ Error updating user profile for deleted subscription:', profileUpdateError)
    } else {
      console.log('✅ User profile updated for deleted subscription')
    }

    console.log('✅ Subscription deletion handled successfully')
  } catch (error) {
    console.error('Error handling subscription deletion:', error)
  }
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log('💰 Invoice payment succeeded:', invoice.id)
  
  if (invoice.subscription) {
    const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string)
    await handleSubscriptionUpdated(subscription)
  }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  console.log('❌ Invoice payment failed:', invoice.id)
  console.log('Customer ID:', invoice.customer)
  console.log('Subscription ID:', invoice.subscription)

  try {
    // Find the user by Stripe customer ID
    const { data: userProfile, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .select('user_id')
      .eq('stripe_customer_id', invoice.customer as string)
      .single()

    if (profileError || !userProfile) {
      console.error('User not found for customer ID:', invoice.customer)
      return
    }

    // Update the subscription status to past_due in our database
    if (invoice.subscription) {
      const { error: updateError } = await supabaseAdmin
        .from('user_subscriptions')
        .update({
          status: 'past_due',
          updated_at: new Date().toISOString(),
        })
        .eq('stripe_subscription_id', invoice.subscription as string)

      if (updateError) {
        console.error('Error updating subscription status:', updateError)
      } else {
        console.log('✅ Subscription marked as past_due in database')
      }

      // Update user profile status
      const { error: profileUpdateError } = await supabaseAdmin
        .from('user_profiles')
        .update({
          subscription_status: 'past_due',
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userProfile.user_id)

      if (profileUpdateError) {
        console.error('❌ Error updating user profile:', profileUpdateError)
      } else {
        console.log('✅ User profile updated for payment failure')
      }
    }
  } catch (error) {
    console.error('Error handling payment failure:', error)
  }
}



