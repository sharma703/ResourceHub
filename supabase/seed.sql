-- Seed Data for ResourceHub Demo
-- CodeVerse India 2026

-- 1. INSTITUTION
INSERT INTO institutions (id, name, code, domain, address)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'Indian Institute of Technology & Science (IITS)',
  'IITS-CAMPUS-01',
  'iits.edu.in',
  'Main Academic Block, Tech Park Road, Bengaluru'
) ON CONFLICT (code) DO NOTHING;

-- 2. DEMO PROFILES (Corresponding to mock/demo users)
-- Students, Faculty, Resource Owners, Admin
INSERT INTO profiles (id, full_name, email, role, institution_id, department, avatar_url, phone)
VALUES 
(
  '22222222-2222-2222-2222-222222222221',
  'Aarav Sharma',
  'student.aarav@iits.edu.in',
  'student',
  '11111111-1111-1111-1111-111111111111',
  'Robotics & AI',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  '+91 98765 43210'
),
(
  '22222222-2222-2222-2222-222222222222',
  'Dr. Priya Deshmukh',
  'faculty.priya@iits.edu.in',
  'faculty',
  '11111111-1111-1111-1111-111111111111',
  'Electrical Engineering',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
  '+91 98765 43211'
),
(
  '22222222-2222-2222-2222-222222222223',
  'Prof. Rajesh Verma',
  'owner.rajesh@iits.edu.in',
  'resource_owner',
  '11111111-1111-1111-1111-111111111111',
  'Central FabLab & Innovation Center',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  '+91 98765 43212'
),
(
  '22222222-2222-2222-2222-222222222224',
  'Dr. Vikram Malhotra',
  'admin.vikram@iits.edu.in',
  'institution_admin',
  '11111111-1111-1111-1111-111111111111',
  'Office of Academic Infrastructure & Research',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
  '+91 98765 43213'
)
ON CONFLICT (id) DO NOTHING;

-- 3. RESOURCES ACROSS 10 DIVERSE CATEGORIES
INSERT INTO resources (id, name, category, description, institution_id, location, owner_id, condition, capacity, max_duration_hours, eligibility, safety_instructions, usage_restrictions, thumbnail_url)
VALUES 
(
  '33333333-3333-3333-3333-333333333301',
  'Formlabs Form 3+ Stereolithography (SLA) 3D Printer',
  '3D printers',
  'High-precision resin 3D printer for industrial grade rapid prototyping, microfluidics, and architectural models with 25-micron layer resolution.',
  '11111111-1111-1111-1111-111111111111',
  'Innovation Hub, Room 104',
  '22222222-2222-2222-2222-222222222223',
  'Excellent',
  2,
  8,
  ARRAY['student', 'faculty'],
  'Resin handling gloves and safety goggles required. Clean vat using IPA wash station after print completion.',
  'Only approved standard UV resins allowed. No third-party chemical mixtures.',
  'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800'
),
(
  '33333333-3333-3333-3333-333333333302',
  'NVIDIA DGX A100 AI Compute Node (4x 80GB GPUs)',
  'Computing equipment',
  'Enterprise deep learning and high-performance computing cluster node for training LLMs, computer vision architectures, and molecular dynamics simulation.',
  '11111111-1111-1111-1111-111111111111',
  'Data Center Annex, Rack 4B',
  '22222222-2222-2222-2222-222222222223',
  'Excellent',
  4,
  24,
  ARRAY['student', 'faculty'],
  'SSH access via campus VPN or internal subnet. Slurm workload manager credentials needed.',
  'Max job runtime is 24 hours without admin extension. Crypto mining strictly prohibited.',
  'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800'
),
(
  '33333333-3333-3333-3333-333333333303',
  'Universal Robots UR5e Collaborative Robotic Arm',
  'Robotics',
  '6-axis collaborative robotic manipulator with 5kg payload and 850mm reach, equipped with force/torque sensors and gripper kit for automation research.',
  '11111111-1111-1111-1111-111111111111',
  'Robotics Laboratory, Block C-202',
  '22222222-2222-2222-2222-222222222223',
  'Good',
  3,
  6,
  ARRAY['student', 'faculty'],
  'Emergency stop button must be kept in hand during initial path trajectories. Calibrate payload before running.',
  'Speeds limited to 250mm/s without supervisor presence.',
  'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800'
),
(
  '33333333-3333-3333-3333-333333333304',
  'Sony FX6 Cinema Camera & G-Master Prime Lens Kit',
  'Cameras',
  'Full-frame 4K 120fps cinema camera setup with dual base ISO, electronic variable ND, and Sony 24-70mm f/2.8 & 85mm f/1.4 GM lenses for documentary and research capture.',
  '11111111-1111-1111-1111-111111111111',
  'Media Arts Studio, Room 012',
  '22222222-2222-2222-2222-222222222223',
  'Excellent',
  1,
  12,
  ARRAY['student', 'faculty'],
  'Always store in Pelican hard case with silica gel packs. Check lens elements before signing checkout.',
  'Campus and official institutional field trips only.',
  'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800'
),
(
  '33333333-3333-3333-3333-333333333305',
  'Keysight Infiniium 4-Channel 1GHz Digital Oscilloscope & Logic Analyzer',
  'Electronics',
  'High-bandwidth digital signal analyzer with 5 GSa/s real-time sample rate, protocol decoding for I2C, SPI, CAN, and USB 2.0.',
  '11111111-1111-1111-1111-111111111111',
  'VLSI & Embedded Systems Lab, Bench 6',
  '22222222-2222-2222-2222-222222222222',
  'Good',
  2,
  4,
  ARRAY['student', 'faculty'],
  'ESD wrist strap mandatory. Verify ground clips before probing high-voltage rails.',
  'Bench equipment: must not be removed from Bench 6.',
  'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800'
),
(
  '33333333-3333-3333-3333-333333333306',
  'Biomolecular Spectroscopy & PCR Thermocycler Workstation',
  'Laboratories',
  'Thermal cycler suite with UV-Vis microvolume spectrophotometer for DNA/RNA quantification and enzyme reaction kinetics.',
  '11111111-1111-1111-1111-111111111111',
  'Bioengineering Building, Clean Room Lab 3',
  '22222222-2222-2222-2222-222222222222',
  'Excellent',
  4,
  5,
  ARRAY['student', 'faculty'],
  'Lab coat, nitrile gloves, and closed-toe shoes mandatory at all times. Biosafety Level 1 certified reagents only.',
  'All waste tubes must be disposed in designated biohazard bins.',
  'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800'
),
(
  '33333333-3333-3333-3333-333333333307',
  'Smart Interactive Collaborative Classroom (Capacity: 45)',
  'Classrooms',
  'Dual 85-inch 4K interactive digital touch displays, hybrid conference mic array, automated lecture recording, and movable pod seating.',
  '11111111-1111-1111-1111-111111111111',
  'Academic Complex, East Wing 201',
  '22222222-2222-2222-2222-222222222224',
  'Excellent',
  45,
  4,
  ARRAY['student', 'faculty'],
  'Return movable modular desks to standard formation after session. Wipe whiteboards clean.',
  'Beverages permitted with spill-proof lids only. No hot food.',
  'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800'
),
(
  '33333333-3333-3333-3333-333333333308',
  'Executive Innovation Boardroom & Pitch Suite',
  'Meeting rooms',
  'Acoustically isolated conference room with Polycom 4K telepresence, motorized glass privacy blinds, wireless screen casting, and ergonomic Herman Miller seating.',
  '11111111-1111-1111-1111-111111111111',
  'Entrepreneurship Cell, Top Floor 401',
  '22222222-2222-2222-2222-222222222224',
  'Excellent',
  16,
  3,
  ARRAY['student', 'faculty'],
  'Switch off projection and motorized blinds before leaving.',
  'For project presentations, thesis defenses, and team collaborative milestones.',
  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800'
),
(
  '33333333-3333-3333-3333-333333333309',
  'FLIR E8-XT High-Resolution Infrared Thermal Imaging Camera',
  'Technical tools',
  'Building diagnostics, electrical inspection, and thermal dissipation research tool with 320x240 IR resolution and MSX enhancement.',
  '11111111-1111-1111-1111-111111111111',
  'Mechanical Engineering Tool Crib, Desk A',
  '22222222-2222-2222-2222-222222222223',
  'Good',
  1,
  8,
  ARRAY['student', 'faculty'],
  'Do not point directly at high-intensity solar radiation or high-power laser optics.',
  'Keep in protective silicon boot.',
  'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=800'
),
(
  '33333333-3333-3333-3333-333333333310',
  'Smart Sensor Instrumented Badminton & Squash Courts',
  'Sports equipment',
  'Indoor timber-sprung court equipped with high-speed optical tracking sensors, biometric telemetry, and tournament-grade Yonex net systems.',
  '11111111-1111-1111-1111-111111111111',
  'Sports Arena & Student Wellness Complex',
  '22222222-2222-2222-2222-222222222224',
  'Excellent',
  4,
  2,
  ARRAY['student', 'faculty'],
  'Non-marking indoor court shoes strictly enforced. Bring own shuttles.',
  'Booking limited to max 2 hours per team daily.',
  'https://images.unsplash.com/photo-1521537634581-0dced2fedc42?w=800'
)
ON CONFLICT (id) DO NOTHING;

-- 4. RESOURCE IMAGES
INSERT INTO resource_images (resource_id, url, caption, is_primary)
VALUES
('33333333-3333-3333-3333-333333333301', 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800', 'Front View Formlabs Form 3+', true),
('33333333-3333-3333-3333-333333333302', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800', 'DGX A100 High Density Rack', true),
('33333333-3333-3333-3333-333333333303', 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800', 'UR5e Cobot in Cell', true),
('33333333-3333-3333-3333-333333333304', 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800', 'Sony FX6 Cinema Kit', true),
('33333333-3333-3333-3333-333333333305', 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800', 'Keysight Oscilloscope Bench', true)
ON CONFLICT DO NOTHING;

-- 5. SAMPLE BOOKINGS (With varying realistic states)
INSERT INTO bookings (id, resource_id, user_id, start_time, end_time, purpose, status, check_in_time, check_out_time, notes)
VALUES
(
  '44444444-4444-4444-4444-444444444401',
  '33333333-3333-3333-3333-333333333301',
  '22222222-2222-2222-2222-222222222221',
  NOW() - INTERVAL '2 days',
  NOW() - INTERVAL '1 day 20 hours',
  'Rapid prototyping drone propeller chassis for autonomous navigation project',
  'Returned',
  NOW() - INTERVAL '2 days',
  NOW() - INTERVAL '1 day 20 hours',
  'Smooth run, cleaned vat with IPA.'
),
(
  '44444444-4444-4444-4444-444444444402',
  '33333333-3333-3333-3333-333333333302',
  '22222222-2222-2222-2222-222222222221',
  NOW() - INTERVAL '3 hours',
  NOW() + INTERVAL '5 hours',
  'Distributed fine-tuning of LLaMA model on Indic agriculture dataset',
  'Checked Out',
  NOW() - INTERVAL '3 hours',
  NULL,
  'Running Slurm cluster job 89201.'
),
(
  '44444444-4444-4444-4444-444444444403',
  '33333333-3333-3333-3333-333333333304',
  '22222222-2222-2222-2222-222222222221',
  NOW() + INTERVAL '1 day',
  NOW() + INTERVAL '1 day 6 hours',
  'Capturing documentary footage of campus tech symposium and demo booths',
  'Approved',
  NULL,
  NULL,
  'Awaiting morning pickup at Media Arts studio.'
),
(
  '44444444-4444-4444-4444-444444444404',
  '33333333-3333-3333-3333-333333333303',
  '22222222-2222-2222-2222-222222222221',
  NOW() + INTERVAL '2 days',
  NOW() + INTERVAL '2 days 4 hours',
  'Kinematic trajectory validation for soft-object gripping mechanism',
  'Pending',
  NULL,
  NULL,
  'Requires safety induction verification.'
)
ON CONFLICT (id) DO NOTHING;

-- 6. SAMPLE NOTIFICATIONS
INSERT INTO notifications (id, user_id, title, message, type, link, is_read)
VALUES
(
  '55555555-5555-5555-5555-555555555501',
  '22222222-2222-2222-2222-222222222221',
  'Booking Request Approved!',
  'Your request for Sony FX6 Cinema Camera has been approved by Prof. Rajesh Verma.',
  'success',
  '/dashboard/student/bookings',
  false
),
(
  '55555555-5555-5555-5555-555555555502',
  '22222222-2222-2222-2222-222222222221',
  'Check-in Confirmed',
  'You are currently checked in to NVIDIA DGX A100 AI Compute Node. Return due in 5 hours.',
  'info',
  '/dashboard/student/bookings',
  false
),
(
  '55555555-5555-5555-5555-555555555503',
  '22222222-2222-2222-2222-222222222223',
  'New Booking Request',
  'Aarav Sharma requested Universal Robots UR5e Cobot for 2 days from now.',
  'warning',
  '/dashboard/owner/requests',
  false
)
ON CONFLICT (id) DO NOTHING;

