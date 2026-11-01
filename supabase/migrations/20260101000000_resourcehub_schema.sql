-- ResourceHub Schema for Supabase PostgreSQL
-- CodeVerse India 2026

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. INSTITUTIONS
CREATE TABLE IF NOT EXISTS institutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  domain TEXT,
  address TEXT,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PROFILES (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'faculty', 'resource_owner', 'institution_admin')),
  institution_id UUID REFERENCES institutions(id) ON DELETE SET NULL,
  department TEXT,
  avatar_url TEXT,
  phone TEXT,
  is_verified BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. RESOURCES
CREATE TABLE IF NOT EXISTS resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  location TEXT NOT NULL,
  owner_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  condition TEXT NOT NULL DEFAULT 'Good' CHECK (condition IN ('Excellent', 'Good', 'Fair', 'Damaged')),
  capacity INT DEFAULT 1,
  max_duration_hours INT DEFAULT 4,
  eligibility TEXT[] DEFAULT ARRAY['student', 'faculty'],
  safety_instructions TEXT,
  usage_restrictions TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  thumbnail_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. RESOURCE IMAGES
CREATE TABLE IF NOT EXISTS resource_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  caption TEXT,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. BOOKINGS
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  purpose TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected', 'Checked Out', 'Returned', 'Cancelled', 'Overdue')),
  check_in_time TIMESTAMPTZ,
  check_out_time TIMESTAMPTZ,
  rejection_reason TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT check_booking_times CHECK (end_time > start_time)
);

-- 6. AVAILABILITY SLOTS
CREATE TABLE IF NOT EXISTS availability_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  CONSTRAINT check_slot_times CHECK (end_time > start_time)
);

-- 7. CONDITION REPORTS
CREATE TABLE IF NOT EXISTS condition_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  condition_rating TEXT NOT NULL CHECK (condition_rating IN ('Excellent', 'Good', 'Fair', 'Damaged')),
  checklist JSONB DEFAULT '{}'::JSONB,
  notes TEXT,
  issue_description TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info',
  link TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. SAVED RESOURCES
CREATE TABLE IF NOT EXISTS saved_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, resource_id)
);

-- 10. INCIDENTS
CREATE TABLE IF NOT EXISTS incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  reported_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  severity TEXT NOT NULL DEFAULT 'Medium' CHECK (severity IN ('Low', 'Medium', 'High', 'Critical')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Open' CHECK (status IN ('Open', 'Investigating', 'Resolved', 'Dismissed')),
  resolution_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. ACTIVITY LOGS
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  metadata JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_resources_institution ON resources(institution_id);
CREATE INDEX IF NOT EXISTS idx_resources_category ON resources(category);
CREATE INDEX IF NOT EXISTS idx_resources_owner ON resources(owner_id);
CREATE INDEX IF NOT EXISTS idx_bookings_resource ON bookings(resource_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_times ON bookings(start_time, end_time);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_resources_user ON saved_resources(user_id);

-- FUNCTION & TRIGGER: Prevent Overlapping Approved Bookings
CREATE OR REPLACE FUNCTION check_booking_overlap()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status IN ('Approved', 'Checked Out') THEN
    IF EXISTS (
      SELECT 1 FROM bookings
      WHERE resource_id = NEW.resource_id
        AND id <> NEW.id
        AND status IN ('Approved', 'Checked Out')
        AND (
          (NEW.start_time < end_time AND NEW.end_time > start_time)
        )
    ) THEN
      RAISE EXCEPTION 'This resource already has an approved booking overlapping with the selected time range.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_check_booking_overlap ON bookings;
CREATE TRIGGER trigger_check_booking_overlap
BEFORE INSERT OR UPDATE OF status, start_time, end_time
ON bookings
FOR EACH ROW
EXECUTE FUNCTION check_booking_overlap();

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE condition_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Institutions: readable by all authenticated users
CREATE POLICY "Institutions viewable by authenticated users"
ON institutions FOR SELECT TO authenticated USING (true);

-- Profiles: users read all profiles in their institution, can update only their own non-role fields
CREATE POLICY "Profiles viewable by authenticated users"
ON profiles FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Resources: readable by all authenticated users
CREATE POLICY "Resources viewable by authenticated users"
ON resources FOR SELECT TO authenticated USING (is_active = true OR owner_id = auth.uid());

CREATE POLICY "Owners and admins can insert resources"
ON resources FOR INSERT TO authenticated
WITH CHECK (
  auth.uid() = owner_id OR 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('resource_owner', 'institution_admin', 'faculty'))
);

CREATE POLICY "Owners and admins can update resources"
ON resources FOR UPDATE TO authenticated
USING (
  auth.uid() = owner_id OR 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'institution_admin')
);

CREATE POLICY "Owners and admins can delete resources"
ON resources FOR DELETE TO authenticated
USING (
  auth.uid() = owner_id OR 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'institution_admin')
);

-- Resource Images: viewable by all, editable by resource owners/admins
CREATE POLICY "Resource images viewable by authenticated"
ON resource_images FOR SELECT TO authenticated USING (true);

CREATE POLICY "Resource images editable by owners"
ON resource_images FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM resources WHERE resources.id = resource_images.resource_id AND (resources.owner_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'institution_admin'))
  )
);

-- Bookings: users see their own bookings; owners see bookings for their resources; admins see all for their institution
CREATE POLICY "Users see own bookings or bookings of their resources"
ON bookings FOR SELECT TO authenticated
USING (
  user_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM resources WHERE resources.id = bookings.resource_id AND resources.owner_id = auth.uid()) OR
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'institution_admin')
);

CREATE POLICY "Users can insert bookings"
ON bookings FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users and owners can update bookings"
ON bookings FOR UPDATE TO authenticated
USING (
  user_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM resources WHERE resources.id = bookings.resource_id AND resources.owner_id = auth.uid()) OR
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'institution_admin')
);

-- Notifications: users see only their own notifications
CREATE POLICY "Users read own notifications"
ON notifications FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Users update own notifications"
ON notifications FOR UPDATE TO authenticated USING (user_id = auth.uid());

-- Saved Resources: users manage their own saved resources
CREATE POLICY "Users manage saved resources"
ON saved_resources FOR ALL TO authenticated USING (user_id = auth.uid());

-- Condition Reports: users and owners can read and create reports
CREATE POLICY "Condition reports viewable by relevant users"
ON condition_reports FOR SELECT TO authenticated
USING (
  user_id = auth.uid() OR
  EXISTS (SELECT 1 FROM resources WHERE resources.id = condition_reports.resource_id AND resources.owner_id = auth.uid()) OR
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'institution_admin')
);

CREATE POLICY "Users can insert condition reports for their bookings"
ON condition_reports FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

