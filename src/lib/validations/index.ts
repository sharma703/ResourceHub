import { z } from "zod";

export const resourceSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(120),
  category: z.string().min(2, "Category is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  location: z.string().min(3, "Location is required"),
  condition: z.enum(["Excellent", "Good", "Fair", "Damaged"]),
  capacity: z.coerce.number().min(1, "Capacity must be at least 1").default(1),
  max_duration_hours: z.coerce.number().min(1).max(72).default(4),
  eligibility: z.array(z.string()).default(["student", "faculty"]),
  safety_instructions: z.string().optional(),
  usage_restrictions: z.string().optional(),
  thumbnail_url: z.string().url("Must be a valid URL").optional(),
});

export const bookingSchema = z.object({
  resource_id: z.string().min(1, "Resource ID is required"),
  user_id: z.string().min(1, "User ID is required"),
  start_time: z.string().min(1, "Start time is required"),
  end_time: z.string().min(1, "End time is required"),
  purpose: z.string().min(5, "Please state the purpose for this reservation (min 5 characters)"),
});

export const conditionReportSchema = z.object({
  booking_id: z.string().min(1, "Booking ID is required"),
  resource_id: z.string().min(1, "Resource ID is required"),
  user_id: z.string().min(1, "User ID is required"),
  condition_rating: z.enum(["Excellent", "Good", "Fair", "Damaged"]),
  checklist: z.object({
    cleanliness: z.boolean(),
    cables_intact: z.boolean(),
    functional_test_passed: z.boolean(),
    accessories_returned: z.boolean(),
  }),
  notes: z.string().optional(),
  issue_description: z.string().optional(),
});

