# 🚀 SNAPS PROJECT SETUP GUIDE

Complete setup instructions for your Snaps virtual try-on application with Supabase authentication.

## 📋 Project Details
- **Supabase URL**: `https://niattjpmdyownffusrsq.supabase.co`
- **Master User Email**: `snaps@snaps.com`
- **Master User Password**: `snaps123`

## 🗄️ Step 1: Database Setup

### 1.1 Apply Database Migrations

1. Go to your Supabase Dashboard: https://app.supabase.com/project/niattjpmdyownffusrsq
2. Navigate to **SQL Editor**
3. Copy and paste the entire content of `setup-snaps-project.sql`
4. Click **Run** to execute the migration

This will create:
- ✅ `profiles` table for user data
- ✅ `virtual_tryon_sessions` table for try-on data
- ✅ `uploaded_images` table for image management
- ✅ Row-level security policies
- ✅ Automatic triggers for user profile creation

## 👤 Step 2: Create Master User

### 2.1 Method 1: Using Supabase Dashboard (Recommended)

1. Go to **Authentication** → **Users** in your Supabase dashboard
2. Click **Add User**
3. Fill in the details:
   - **Email**: `snaps@snaps.com`
   - **Password**: `snaps123`
   - **Auto Confirm User**: ✅ (checked)
   - **User Metadata** (optional):
     ```json
     {
       "first_name": "Snaps",
       "last_name": "Admin",
       "full_name": "Snaps Admin"
     }
     ```
4. Click **Create User**

### 2.2 Method 2: Using Admin API (Alternative)

If you prefer to use code, get your **service_role** key from **Settings** → **API** and run:

```javascript
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://niattjpmdyownffusrsq.supabase.co',
  'YOUR_SERVICE_ROLE_KEY_HERE',
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function createMasterUser() {
  const { data, error } = await supabase.auth.admin.createUser({
    email: 'snaps@snaps.com',
    password: 'snaps123',
    email_confirm: true,
    user_metadata: {
      first_name: 'Snaps',
      last_name: 'Admin',
      full_name: 'Snaps Admin'
    }
  });
  
  if (error) console.error('Error:', error);
  else console.log('✅ User created:', data.user.id);
}

createMasterUser();
```

## 🔒 Step 3: Security Configuration

### 3.1 Configure Authentication Settings

1. Go to **Authentication** → **Settings**
2. Configure these settings:

**Site URL**: `http://localhost:3000` (for development)
**Redirect URLs**: `http://localhost:3000/**`

**Email Templates**: Customize as needed
**SMTP Settings**: Configure for production email sending

### 3.2 Verify Row Level Security

Ensure RLS is enabled by running this check in SQL Editor:
```sql
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND rowsecurity = true;
```

## 🎨 Step 4: Frontend Application Setup

Your Next.js app is already configured with:
- ✅ Environment variables in `.env.local`
- ✅ Clean email/password authentication (OAuth removed)
- ✅ AuthContext with proper Supabase integration
- ✅ Protected routes with authentication guards

### Test the Setup

1. Start your development server: `npm run dev`
2. Go to `http://localhost:3000`
3. You should be redirected to `/sign-in`
4. Try logging in with:
   - **Email**: `snaps@snaps.com`
   - **Password**: `snaps123`

## 📊 Step 5: Database Schema Overview

### Tables Created:

1. **`profiles`** - User profile data
   - Links to `auth.users`
   - Stores first_name, last_name, full_name, avatar_url

2. **`virtual_tryon_sessions`** - Try-on session data
   - Tracks garment and person images
   - Stores processing status and results
   - User-specific with RLS

3. **`uploaded_images`** - Image management
   - Tracks user uploaded files
   - Stores file metadata and URLs
   - User-specific with RLS

### Key Features:
- 🔐 **Row Level Security (RLS)** on all tables
- 🔄 **Automatic profile creation** on user signup
- ⏰ **Automatic timestamp updates**
- 🗂️ **Proper indexing** for performance

## 🧪 Step 6: Testing

### Test User Registration
1. Go to `/register`
2. Create a new account
3. Verify profile is automatically created
4. Check database in Supabase dashboard

### Test Authentication Flow
1. Sign out if logged in
2. Try accessing protected routes
3. Verify redirect to sign-in
4. Test login with master user credentials

## 🚀 Step 7: Next Steps

### For Production:
1. Update `SITE_URL` in Supabase auth settings
2. Configure SMTP for email sending
3. Set up proper image storage with Supabase Storage
4. Configure proper error monitoring
5. Set up analytics

### For Development:
1. Add virtual try-on API integration
2. Implement image upload functionality
3. Create user dashboard
4. Add session management for try-on results

## ⚠️ Important Notes

- **Service Role Key**: Keep your service_role key secure and never expose it in client-side code
- **RLS Policies**: Always test RLS policies thoroughly before production
- **Password**: Change the master user password in production
- **Backup**: Always backup your database before applying migrations

## 🐛 Troubleshooting

### Common Issues:

1. **User can't sign in**: Check if email is confirmed in auth.users table
2. **Profile not created**: Verify the trigger function is working
3. **RLS blocking queries**: Check policy configurations
4. **Environment variables**: Ensure `.env.local` is properly configured

### Verification Queries:

```sql
-- Check if user exists
SELECT id, email, email_confirmed_at FROM auth.users WHERE email = 'snaps@snaps.com';

-- Check if profile was created
SELECT * FROM public.profiles;

-- Check RLS policies
SELECT * FROM pg_policies WHERE schemaname = 'public';
```

---

## ✅ Setup Complete!

Your Snaps application is now fully configured with:
- 🔐 Secure authentication system
- 🗄️ Proper database structure
- 👤 Master user account
- 🛡️ Row-level security
- 🎨 Clean, modern UI

**Master User Credentials:**
- Email: `snaps@snaps.com`
- Password: `snaps123`

Ready to start building your virtual try-on features! 🎉 