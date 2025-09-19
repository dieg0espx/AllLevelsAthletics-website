import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabaseAdmin } from '@/lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
})

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()
    
    console.log('=== DOWNGRADE TO FOUNDATION ===')
    console.log('User ID:', userId)

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Get user's current subscription
    console.log('🔍 Fetching active subscription for user:', userId)
    const { data: currentSubscription, error: subscriptionError } = await supabaseAdmin
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single()

    console.log('Downgrade subscription query result:', {
      data: currentSubscription,
      error: subscriptionError,
      errorCode: subscriptionError?.code
    })

    if (subscriptionError || !currentSubscription) {
      console.error('Error fetching current subscription:', subscriptionError)
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 400 }
      )
    }

    console.log('✅ Found active subscription for downgrade:', {
      id: currentSubscription.id,
      status: currentSubscription.status,
      plan_name: currentSubscription.plan_name,
      stripe_subscription_id: currentSubscription.stripe_subscription_id
    })

    // Define the Foundation plan
    const foundationPlan = {
      name: 'Foundation',
      priceId: process.env.STRIPE_FOUNDATION_MONTHLY_PRICE_ID,
      price: 197,
    }

    // Get the current Stripe subscription
    const stripeSubscription = await stripe.subscriptions.retrieve(currentSubscription.stripe_subscription_id)
    
    // Update the Stripe subscription to Foundation plan
    const updatedSubscription = await stripe.subscriptions.update(stripeSubscription.id, {
      items: [{
        id: stripeSubscription.items.data[0].id,
        price: foundationPlan.priceId,
      }],
      proration_behavior: 'none', // No proration for testing
    })

    console.log('✅ Stripe subscription downgraded to Foundation')

    // Update the subscription in our database
    const { error: updateError } = await supabaseAdmin
      .from('user_subscriptions')
      .update({
        plan_name: foundationPlan.name,
        plan_id: 'foundation',
        current_period_start: new Date(updatedSubscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(updatedSubscription.current_period_end * 1000).toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', currentSubscription.id)

    if (updateError) {
      console.error('Error updating subscription in database:', updateError)
      return NextResponse.json(
        { error: 'Failed to update subscription in database' },
        { status: 500 }
      )
    }

    console.log('✅ Database subscription downgraded to Foundation')

    return NextResponse.json({ 
      success: true,
      message: 'Successfully downgraded to Foundation plan',
      newPlan: foundationPlan.name,
      newPrice: foundationPlan.price
    })

  } catch (error) {
    console.error('❌ Error processing downgrade:', error)
    return NextResponse.json(
      { error: 'Failed to process downgrade' },
      { status: 500 }
    )
  }
}
