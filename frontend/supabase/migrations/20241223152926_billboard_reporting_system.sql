-- Location: supabase/migrations/20241223152926_billboard_reporting_system.sql
-- Schema Analysis: No existing schema found - creating complete billboard reporting system
-- Integration Type: Full system implementation with email notifications
-- Dependencies: None (fresh schema)

-- 1. Create custom types
CREATE TYPE public.user_role AS ENUM ('citizen', 'municipal_authority', 'admin', 'inspector');
CREATE TYPE public.report_status AS ENUM ('submitted', 'under_review', 'investigating', 'resolved', 'rejected');
CREATE TYPE public.report_priority AS ENUM ('low', 'medium', 'high', 'emergency');

-- 2. Create user profiles table (intermediary for auth)
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role public.user_role DEFAULT 'citizen'::public.user_role,
    phone TEXT,
    organization TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create billboard reports table
CREATE TABLE public.billboard_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    image_url TEXT,
    additional_images TEXT[] DEFAULT '{}',
    location_data JSONB NOT NULL,
    violations TEXT[] DEFAULT '{}',
    priority public.report_priority DEFAULT 'medium'::public.report_priority,
    description TEXT,
    estimated_size TEXT,
    distance_from_road TEXT,
    traffic_impact JSONB DEFAULT '{}',
    ai_annotations JSONB DEFAULT '[]',
    status public.report_status DEFAULT 'submitted'::public.report_status,
    status_notes TEXT,
    contact_anonymous BOOLEAN DEFAULT false,
    contact_name TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    allow_follow_up BOOLEAN DEFAULT false,
    notification_preferences JSONB DEFAULT '{}',
    has_witnesses BOOLEAN DEFAULT false,
    data_consent BOOLEAN DEFAULT false,
    email_sent BOOLEAN DEFAULT false,
    email_sent_at TIMESTAMPTZ,
    assigned_to UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create storage bucket for billboard evidence
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'billboard-evidence',
    'billboard-evidence', 
    false,
    10485760, -- 10MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
);

-- 5. Create indexes
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX idx_billboard_reports_reporter_id ON public.billboard_reports(reporter_id);
CREATE INDEX idx_billboard_reports_status ON public.billboard_reports(status);
CREATE INDEX idx_billboard_reports_priority ON public.billboard_reports(priority);
CREATE INDEX idx_billboard_reports_created_at ON public.billboard_reports(created_at);
CREATE INDEX idx_billboard_reports_location_data ON public.billboard_reports USING gin(location_data);

-- 6. Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billboard_reports ENABLE ROW LEVEL SECURITY;

-- 7. Create helper functions
CREATE OR REPLACE FUNCTION public.is_municipal_authority()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() 
    AND up.role IN ('municipal_authority', 'admin', 'inspector')
    AND up.is_active = true
)
$$;

-- 8. RLS Policies - Pattern 1: Core user table (simple only)
CREATE POLICY "users_manage_own_user_profiles"
ON public.user_profiles
FOR ALL
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Pattern 2: Simple user ownership for reports
CREATE POLICY "users_manage_own_reports"
ON public.billboard_reports
FOR ALL
TO authenticated
USING (reporter_id = auth.uid())
WITH CHECK (reporter_id = auth.uid());

-- Pattern 6: Role-based access for authorities
CREATE POLICY "authorities_view_all_reports"
ON public.billboard_reports
FOR SELECT
TO authenticated
USING (public.is_municipal_authority());

CREATE POLICY "authorities_update_reports"
ON public.billboard_reports
FOR UPDATE
TO authenticated
USING (public.is_municipal_authority())
WITH CHECK (public.is_municipal_authority());

-- 9. Storage policies - Private user storage pattern
CREATE POLICY "users_view_own_evidence"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'billboard-evidence' AND owner = auth.uid());

CREATE POLICY "users_upload_evidence"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'billboard-evidence' 
    AND owner = auth.uid()
    AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "users_update_own_evidence"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'billboard-evidence' AND owner = auth.uid())
WITH CHECK (bucket_id = 'billboard-evidence' AND owner = auth.uid());

CREATE POLICY "users_delete_own_evidence"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'billboard-evidence' AND owner = auth.uid());

CREATE POLICY "authorities_view_all_evidence"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'billboard-evidence' AND public.is_municipal_authority());

-- 10. Functions for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'citizen')::public.user_role
  );  
  RETURN NEW;
END;
$$;

-- 11. Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 12. Create RPC functions for statistics
CREATE OR REPLACE FUNCTION public.get_report_statistics()
RETURNS JSONB
LANGUAGE sql
SECURITY DEFINER
AS $$
SELECT jsonb_build_object(
  'total_reports', COUNT(*),
  'submitted', COUNT(*) FILTER (WHERE status = 'submitted'),
  'under_review', COUNT(*) FILTER (WHERE status = 'under_review'),
  'investigating', COUNT(*) FILTER (WHERE status = 'investigating'),
  'resolved', COUNT(*) FILTER (WHERE status = 'resolved'),
  'rejected', COUNT(*) FILTER (WHERE status = 'rejected'),
  'high_priority', COUNT(*) FILTER (WHERE priority = 'high'),
  'emergency', COUNT(*) FILTER (WHERE priority = 'emergency'),
  'this_month', COUNT(*) FILTER (WHERE created_at >= date_trunc('month', now()))
)
FROM public.billboard_reports;
$$;

CREATE OR REPLACE FUNCTION public.get_user_report_statistics(user_id UUID)
RETURNS JSONB
LANGUAGE sql
SECURITY DEFINER
AS $$
SELECT jsonb_build_object(
  'total_reports', COUNT(*),
  'submitted', COUNT(*) FILTER (WHERE status = 'submitted'),
  'resolved', COUNT(*) FILTER (WHERE status = 'resolved'),
  'under_review', COUNT(*) FILTER (WHERE status = 'under_review'),
  'this_month', COUNT(*) FILTER (WHERE created_at >= date_trunc('month', now()))
)
FROM public.billboard_reports
WHERE reporter_id = user_id;
$$;

-- 13. Mock data for testing
DO $$
DECLARE
    citizen_uuid UUID := gen_random_uuid();
    authority_uuid UUID := gen_random_uuid();
    report_uuid UUID := gen_random_uuid();
BEGIN
    -- Create auth users with required fields
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (citizen_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'citizen@example.com', crypt('password123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "John Citizen", "role": "citizen"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (authority_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'authority@municipal.gov', crypt('admin123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Municipal Authority", "role": "municipal_authority"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Create sample billboard report
    INSERT INTO public.billboard_reports (
        id, reporter_id, image_url, location_data, violations, priority, description,
        estimated_size, distance_from_road, contact_name, contact_email, contact_phone,
        data_consent
    ) VALUES (
        report_uuid,
        citizen_uuid,
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
        '{"address": "MG Road, Connaught Place", "city": "New Delhi", "state": "Delhi", "latitude": 28.6139, "longitude": 77.2090, "landmarks": ["Metro Station", "Shopping Complex"]}'::jsonb,
        ARRAY['oversized', 'traffic_obstruction'],
        'high'::public.report_priority,
        'Large billboard blocking traffic signals and exceeding permitted size limits',
        '20x15 feet',
        '5 meters',
        'John Citizen',
        'citizen@example.com',
        '+91-9876543210',
        true
    );

EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key error: %', SQLERRM;
    WHEN unique_violation THEN
        RAISE NOTICE 'Unique constraint error: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Unexpected error: %', SQLERRM;
END $$;

-- 14. Create cleanup function for testing
CREATE OR REPLACE FUNCTION public.cleanup_test_data()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    auth_user_ids_to_delete UUID[];
BEGIN
    -- Get auth user IDs first
    SELECT ARRAY_AGG(id) INTO auth_user_ids_to_delete
    FROM auth.users
    WHERE email LIKE '%@example.com' OR email LIKE '%@municipal.gov';

    -- Delete in dependency order (children first, then auth.users last)
    DELETE FROM public.billboard_reports WHERE reporter_id = ANY(auth_user_ids_to_delete);
    DELETE FROM public.user_profiles WHERE id = ANY(auth_user_ids_to_delete);

    -- Delete auth.users last (after all references are removed)
    DELETE FROM auth.users WHERE id = ANY(auth_user_ids_to_delete);
EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key constraint prevents deletion: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Cleanup failed: %', SQLERRM;
END;
$$;