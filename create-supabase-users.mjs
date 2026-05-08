import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const adminEmail = process.env.ADMIN_EMAIL
const adminPassword = process.env.ADMIN_PASSWORD
const testEmail = process.env.TEST_EMAIL
const testPassword = process.env.TEST_PASSWORD

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables:')
  console.error('- SUPABASE_URL')
  console.error('- SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createUser(email, password, role) {
  console.log(`Creating user: ${email} with role: ${role}`)

  try {
    // Create the user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true // Auto-confirm email
    })

    if (authError) {
      console.error(`Failed to create user ${email}:`, authError.message)
      return false
    }

    console.log(`✓ Created auth user: ${authData.user.id}`)

    // Add role to user_roles table
    const { error: roleError } = await supabase
      .from('user_roles')
      .insert({
        user_id: authData.user.id,
        role: role
      })

    if (roleError) {
      console.error(`Failed to assign role to ${email}:`, roleError.message)
      return false
    }

    console.log(`✓ Assigned role '${role}' to user`)
    return true

  } catch (error) {
    console.error(`Unexpected error creating user ${email}:`, error.message)
    return false
  }
}

async function main() {
  console.log('🚀 Creating Supabase users...\n')

  const results = []

  // Create admin user
  if (adminEmail && adminPassword) {
    const adminSuccess = await createUser(adminEmail, adminPassword, 'admin')
    results.push({ email: adminEmail, role: 'admin', success: adminSuccess })
  } else {
    console.log('⚠️  Skipping admin user creation (missing ADMIN_EMAIL or ADMIN_PASSWORD)')
  }

  // Create test user
  if (testEmail && testPassword) {
    const testSuccess = await createUser(testEmail, testPassword, 'player')
    results.push({ email: testEmail, role: 'player', success: testSuccess })
  } else {
    console.log('⚠️  Skipping test user creation (missing TEST_EMAIL or TEST_PASSWORD)')
  }

  console.log('\n📊 Summary:')
  results.forEach(result => {
    const status = result.success ? '✅' : '❌'
    console.log(`${status} ${result.email} (${result.role})`)
  })

  const successCount = results.filter(r => r.success).length
  const totalCount = results.length

  if (successCount === totalCount && totalCount > 0) {
    console.log('\n🎉 All users created successfully!')
  } else if (successCount > 0) {
    console.log(`\n⚠️  ${successCount}/${totalCount} users created successfully`)
  } else {
    console.log('\n❌ No users were created')
    process.exit(1)
  }
}

main().catch(error => {
  console.error('💥 Script failed:', error.message)
  process.exit(1)
})