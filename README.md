# RESOURCEHUB — Campus Shared Equipment & Space Ecosystem

> **CodeVerse India 2026 Hackathon Project**  
> **Challenge Track:** *Unlock Underused Equipment and Spaces*  
> **Status:** Production-Ready Full-Stack Web Application

---

## 🌟 Executive Summary

**RESOURCEHUB** is a full-stack, enterprise-grade resource-sharing ecosystem engineered to eliminate academic equipment underutilization. In typical Indian higher-education and research institutions, millions of rupees worth of high-precision equipment (e.g. SLA 3D printers, NVIDIA DGX compute nodes, collaborative robotic manipulators, RF oscilloscopes, and specialized clean rooms) operate at an average utilization rate of less than 26%, isolated within departmental silos.

ResourceHub unifies these resources into an institution-wide digital commons featuring:
1. **Multi-Role RBAC Portals** tailored for **Students**, **Faculty Researchers**, **Resource Custodians/Owners**, and **Institution Admins**.
2. **Conflict-Free Reservation Engine** powered by server-side collision validation and PostgreSQL concurrency triggers to prevent overlapping bookings.
3. **Contactless Check-In & Check-Out Workflow** complete with post-use physical condition audits and custody signoffs.
4. **Real-Time Utilization Telemetry** displaying live asset density, idle duration, and capital expenditure savings.
5. **AI-Assisted Resource Discovery** that takes student project descriptions (e.g. *"IoT-based smart irrigation prototype"*) and automatically matches relevant hardware, safety protocols, and suggested lab durations.
6. **Judge-Friendly 1-Click Demo Switcher** allowing hackathon evaluators to toggle effortlessly between Student, Faculty, Owner, and Admin personas without typing passwords.

---

## 🏛️ Application Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                        NEXT.JS 14 APP ROUTER                            │
├────────────────────────────────────────────────────────────────────────┤
│ Public Presentation & Discovery:                                       │
│   • Landing Page (/)                  • Discover Catalog (/discover)    │
│   • Resource Details (/resources/[id]) • AI Matchmaker (/ai-match)     │
│   • Utilization Analytics (/analytics) • Auth & Profiles (/login)      │
├────────────────────────────────────────────────────────────────────────┤
│ Role-Based Dashboards:                                                 │
│   • Student Portal (/dashboard/student)                                │
│   • Resource Owner Center (/dashboard/owner)                           │
│   • Institution Admin Office (/dashboard/admin)                        │
│   • Faculty Research Portal (/dashboard/faculty)                       │
├────────────────────────────────────────────────────────────────────────┤
│ Next.js Node.js Serverless Route Handlers (/api/*):                    │
│   • /api/resources          • /api/resources/[id]                      │
│   • /api/bookings           • /api/bookings/[id]/approve               │
│   • /api/bookings/[id]/reject • /api/bookings/[id]/check-in            │
│   • /api/bookings/[id]/check-out • /api/condition-reports              │
│   • /api/notifications      • /api/analytics                           │
│   • /api/ai-discovery       • /api/demo/reset                          │
├────────────────────────────────────────────────────────────────────────┤
│ Database & Storage Layer:                                              │
│   • Supabase PostgreSQL Relational Schema + Row Level Security (RLS)    │
│   • Automated PostgreSQL Overlap Trigger (`check_booking_overlap`)     │
│   • In-Memory / Local Storage Persistent Store Fallback for Demo Mode  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## ⚡ Technology Stack

- **Framework:** Next.js 14 (App Router, Server & Client Components, Route Handlers)
- **Frontend Library:** React 18, TypeScript (Strict Mode)
- **Styling & UI:** Tailwind CSS, PostCSS, Lucide React, Framer Motion
- **Data Visualization:** Recharts (Area charts, Bar graphs, Utilization meters)
- **Database:** Supabase PostgreSQL with Row Level Security (RLS) policies
- **Schema Validation:** Zod
- **Date Handling:** Date-fns

---

## 🗄️ Relational Database Schema

The database design adheres to 3rd normal form (3NF) and includes strict foreign key cascades and check constraints.

### Tables
1. **`institutions`**: Campus identifier, domain, address, logo.
2. **`profiles`**: Linked to `auth.users`, roles (`student`, `faculty`, `resource_owner`, `institution_admin`), verified badge.
3. **`resources`**: Name, 10 categories, location, capacity, condition, safety rules, restrictions, owner ID, institution ID.
4. **`resource_images`**: High-resolution gallery images with primary thumbnail flag.
5. **`bookings`**: Start time, end time, purpose, status (`Pending`, `Approved`, `Rejected`, `Checked Out`, `Returned`, `Cancelled`, `Overdue`), check-in/out timestamps.
6. **`availability_slots`**: Recurring weekly operating availability windows.
7. **`condition_reports`**: Post-checkout physical inspection audits, checklist booleans, ratings, and notes.
8. **`notifications`**: Targeted user alerts for status changes and reminders.
9. **`saved_resources`**: User bookmarking shortlist.
10. **`incidents`**: Hardware safety incident and damage ticketing.
11. **`activity_logs`**: Immutable audit trail of administrative and custodial actions.

### Concurrency Protection Trigger
```sql
CREATE OR REPLACE FUNCTION check_booking_overlap()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status IN ('Approved', 'Checked Out') THEN
    IF EXISTS (
      SELECT 1 FROM bookings
      WHERE resource_id = NEW.resource_id
        AND id <> NEW.id
        AND status IN ('Approved', 'Checked Out')
        AND (NEW.start_time < end_time AND NEW.end_time > start_time)
    ) THEN
      RAISE EXCEPTION 'This resource already has an approved booking overlapping with the selected time range.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js version 18.17+ or 20.x or 24.x
- npm version 9+ or 10+ or 11+

### Installation Steps

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url> resourcehub
   cd resourcehub
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create `.env.local` using `.env.example` as a template:
   ```bash
   cp .env.example .env.local
   ```
   *(Note: The application includes a self-contained demonstration engine with high-fidelity sample data so you can run and experience the entire ecosystem immediately without external Supabase keys).*

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Execute QA Automated Test Suite:**
   ```bash
   npm run typecheck
   npm run build
   ```

---

## 🧑‍⚖️ Hackathon Judge Demonstration Guide

To evaluate the complete ecosystem in under 3 minutes:

1. **Top Demo Persona Switcher Banner:**
   At the very top of every screen, notice the dark judge banner:
   - **🎓 Student (Aarav):** Navigate to [Discover](/discover), pick an asset (e.g., *Sony FX6 Cinema Camera* or *Keysight Oscilloscope*), and submit a booking request.
   - **⚙️ Resource Custodian (Prof. Rajesh):** Click the "Owner" button in the top banner. Notice the new booking appears instantly in your queue. Click **Approve**.
   - **🎓 Return to Student (Aarav):** Click "Student" in the banner. Notice your booking is now **Approved**. Click **Check In Now** to simulate taking custody.
   - **Return & Inspection:** Click **Check Out & Report**. Complete the 4-point custody checklist, set the condition rating, and confirm return.
   - **🏛️ Campus Admin (Dr. Vikram):** Click "Admin" to view real-time institutional utilization telemetry, master equipment lists, and safety logs.
   - **Reset Anytime:** Click the **Reset** button in the top banner to restore pristine demo data.

2. **Test AI Matchmaker:**
   Visit [/ai-match](/ai-match) and click any of the preset prompts (e.g. *"I need equipment to build an IoT-based smart irrigation prototype"*). The system semantic matcher evaluates technical criteria, returns compatibility scores, and suggests an operational workflow.

---

## 🔒 Security & Best Practices

- **Zero Client-Side Privilege Escalation:** Administrative roles cannot be registered through public signup forms.
- **Service Role Key Protection:** Supabase service-role keys are strictly encapsulated in server-side Next.js route handlers and never leaked to browser client bundles.
- **Server-Side Collision Defense:** Overlapping time-slot bookings are verified and rejected by both route handlers and database level triggers.
- **Input Sanitization:** All payloads validated with Zod schemas.

---

## ☁️ Deployment to Vercel

1. Push your repository to GitHub.
2. Log into [Vercel](https://vercel.com) and import the project.
3. In the Vercel project settings, set Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (optional, for direct Supabase connectivity)
   - `NEXT_PUBLIC_DEMO_MODE=true`
4. Deploy! Vercel will run `npm run build` which produces the optimized production bundle.

---

## 🏆 CodeVerse India 2026 Submission Details

- **Project:** RESOURCEHUB
- **Theme:** Unlock Underused Equipment and Spaces
- **Target Institutions:** IITs, NITs, Central & State Universities, Research Labs across India.

