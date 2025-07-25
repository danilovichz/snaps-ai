-- =============================================
-- SNAPS PROJECT DATABASE SETUP
-- Project: niattjpmdyownffusrsq.supabase.co
-- =============================================

-- 1. Create user profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 4. Create function to automatically handle new user signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, full_name)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'first_name', ''),
    COALESCE(new.raw_user_meta_data->>'last_name', ''),
    COALESCE(new.raw_user_meta_data->>'full_name', '')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Create trigger for automatic profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 6. Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 7. Create trigger for updated_at
CREATE TRIGGER handle_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- 8. Create additional tables for the Snaps app

-- Virtual try-on sessions table
CREATE TABLE IF NOT EXISTS public.virtual_tryon_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  garment_image_url TEXT NOT NULL,
  person_image_url TEXT NOT NULL,
  result_image_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for virtual_tryon_sessions
ALTER TABLE public.virtual_tryon_sessions ENABLE ROW LEVEL SECURITY;

-- Policies for virtual_tryon_sessions
CREATE POLICY "Users can view own sessions" ON public.virtual_tryon_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own sessions" ON public.virtual_tryon_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions" ON public.virtual_tryon_sessions
  FOR UPDATE USING (auth.uid() = user_id);

-- Image uploads table
CREATE TABLE IF NOT EXISTS public.uploaded_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  upload_status TEXT DEFAULT 'uploaded' CHECK (upload_status IN ('uploading', 'uploaded', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for uploaded_images
ALTER TABLE public.uploaded_images ENABLE ROW LEVEL SECURITY;

-- Policies for uploaded_images
CREATE POLICY "Users can view own images" ON public.uploaded_images
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can upload images" ON public.uploaded_images
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Add updated_at triggers for new tables
CREATE TRIGGER handle_virtual_tryon_sessions_updated_at
  BEFORE UPDATE ON public.virtual_tryon_sessions
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- =============================================
-- INDEXES for performance
-- =============================================

CREATE INDEX IF NOT EXISTS profiles_user_id_idx ON public.profiles(id);
CREATE INDEX IF NOT EXISTS virtual_tryon_sessions_user_id_idx ON public.virtual_tryon_sessions(user_id);
CREATE INDEX IF NOT EXISTS virtual_tryon_sessions_status_idx ON public.virtual_tryon_sessions(status);
CREATE INDEX IF NOT EXISTS uploaded_images_user_id_idx ON public.uploaded_images(user_id);

-- =============================================
-- COMMENTS
-- =============================================

COMMENT ON TABLE public.profiles IS 'User profile information linked to auth.users';
COMMENT ON TABLE public.virtual_tryon_sessions IS 'Virtual try-on session data and results';
COMMENT ON TABLE public.uploaded_images IS 'User uploaded images for virtual try-on';

-- =============================================
-- SETUP COMPLETE
-- ============================================= 