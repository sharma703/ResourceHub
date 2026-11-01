export type UserRole = 'student' | 'faculty' | 'resource_owner' | 'institution_admin';

export type ResourceCondition = 'Excellent' | 'Good' | 'Fair' | 'Damaged';

export type BookingStatus = 
  | 'Pending' 
  | 'Approved' 
  | 'Rejected' 
  | 'Checked Out' 
  | 'Returned' 
  | 'Cancelled' 
  | 'Overdue';

export interface Institution {
  id: string;
  name: string;
  code: string;
  domain?: string;
  address?: string;
  logo_url?: string;
  created_at?: string;
}

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  institution_id?: string;
  institution_name?: string;
  department?: string;
  avatar_url?: string;
  phone?: string;
  created_at?: string;
}

export interface ResourceImage {
  id: string;
  resource_id: string;
  url: string;
  caption?: string;
  is_primary: boolean;
}

export interface Resource {
  id: string;
  name: string;
  category: string;
  description: string;
  institution_id: string;
  institution?: Institution;
  location: string;
  owner_id?: string;
  owner?: Profile;
  condition: ResourceCondition;
  capacity: number;
  max_duration_hours: number;
  eligibility: string[];
  safety_instructions?: string;
  usage_restrictions?: string;
  is_active: boolean;
  thumbnail_url?: string;
  images?: ResourceImage[];
  created_at?: string;
  updated_at?: string;
}

export interface Booking {
  id: string;
  resource_id: string;
  resource?: Resource;
  user_id: string;
  user?: Profile;
  start_time: string;
  end_time: string;
  purpose: string;
  status: BookingStatus;
  check_in_time?: string | null;
  check_out_time?: string | null;
  rejection_reason?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ConditionReport {
  id: string;
  booking_id: string;
  resource_id: string;
  user_id: string;
  user_name?: string;
  condition_rating: ResourceCondition;
  checklist: {
    cleanliness: boolean;
    cables_intact: boolean;
    functional_test_passed: boolean;
    accessories_returned: boolean;
  };
  notes?: string;
  issue_description?: string;
  image_url?: string;
  created_at: string;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  link?: string;
  is_read: boolean;
  created_at: string;
}

export interface Incident {
  id: string;
  resource_id: string;
  resource_name?: string;
  booking_id?: string;
  reported_by: string;
  reporter_name?: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  title: string;
  description: string;
  status: 'Open' | 'Investigating' | 'Resolved' | 'Dismissed';
  resolution_notes?: string;
  created_at: string;
}

export interface UtilizationMetrics {
  totalResources: number;
  activeBookings: number;
  pendingRequests: number;
  completedBookings: number;
  overallUtilizationRate: number; // percentage
  savedCostHours: number;
  categoryBreakdown: { category: string; count: number; utilization: number }[];
  monthlyTrends: { month: string; bookings: number; utilization: number }[];
  mostUsedResources: { id: string; name: string; category: string; bookingCount: number; hoursUtilized: number }[];
  underutilizedResources: { id: string; name: string; category: string; idleDays: number }[];
}
