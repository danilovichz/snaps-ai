const { createClient } = require('@supabase/supabase-js');

// Your Supabase configuration
const supabaseUrl = 'https://niattjpmdyownffusrsq.supabase.co';

// You need to get your SERVICE ROLE key from:
// https://app.supabase.com/project/niattjpmdyownffusrsq/settings/api
// Look for "service_role" key (NOT the anon key)
const supabaseServiceRoleKey = 'PASTE_YOUR_SERVICE_ROLE_KEY_HERE';

if (supabaseServiceRoleKey === 'PASTE_YOUR_SERVICE_ROLE_KEY_HERE') {
  console.log('🔑 Please update the service role key in this script:');
  console.log('1. Go to https://app.supabase.com/project/niattjpmdyownffusrsq/settings/api');
  console.log('2. Copy the "service_role" key');
  console.log('3. Replace "PASTE_YOUR_SERVICE_ROLE_KEY_HERE" with your actual key');
  console.log('4. Run this script again');
  process.exit(1);
}

// Create admin client
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createMasterUser() {
  try {
    console.log('🚀 Creating master user for Snaps...');
    
    // First check if user already exists
    const { data: existingUsers, error: checkError } = await supabaseAdmin
      .from('auth.users')
      .select('id, email')
      .eq('email', 'snaps@snaps.com');
    
    if (checkError) {
      console.log('Note: Could not check existing users (this is normal)');
    }
    
    // Create the master user
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: 'snaps@snaps.com',
      password: 'snaps123',
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        first_name: 'Snaps',
        last_name: 'Admin',
        full_name: 'Snaps Admin'
      }
    });

    if (error) {
      if (error.message.includes('User already registered')) {
        console.log('✅ User already exists! You can now sign in with:');
        console.log('   Email: snaps@snaps.com');
        console.log('   Password: snaps123');
        return;
      }
      console.error('❌ Error creating user:', error.message);
      return;
    }

    console.log('✅ Master user created successfully!');
    console.log('📧 Email: snaps@snaps.com');
    console.log('🔑 Password: snaps123');
    console.log('🆔 User ID:', data.user.id);
    console.log('📅 Created at:', data.user.created_at);
    console.log('');
    console.log('🎉 You can now sign in to your app!');
    
  } catch (err) {
    console.error('❌ Script failed:', err.message);
  }
}

createMasterUser(); 