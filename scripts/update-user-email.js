// Script to update user to admin and add name
// Run this with: node scripts/update-user-email.js

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY // Use service role key for admin operations

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function updateUserToAdmin() {
  const userId = '9a579ceb-e89e-4181-8873-71f34b1eff1a'
  const newEmail = 'alllevelsathletics@gmail.com'
  const fullName = 'Daniel'

  try {
    // Update user with admin role and name
    const { data, error } = await supabase.auth.admin.updateUserById(userId, {
      email: newEmail,
      user_metadata: {
        full_name: fullName,
        role: 'admin'
      },
      app_metadata: {
        role: 'admin'
      }
    })

    if (error) {
      console.error('Error updating user to admin:', error)
    } else {
      console.log('User updated to admin successfully:', data.user)
      console.log('User metadata:', data.user.user_metadata)
      console.log('App metadata:', data.user.app_metadata)
    }
  } catch (error) {
    console.error('Error:', error)
  }
}

updateUserToAdmin()
