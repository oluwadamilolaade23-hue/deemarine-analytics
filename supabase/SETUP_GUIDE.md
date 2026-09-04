# DMA Internship Portal — Supabase Backend Setup Guide

## Overview
This guide walks you through setting up the complete Supabase backend for the DMA Internship application portal. All SQL is in a single migration file: `dma_internship_backend.sql`.

## Prerequisites
- A Supabase project (already created: `qyhlicrdbegvnswsvoko`)
- Access to the Supabase Dashboard

## Step-by-Step Setup

### Step 1: Open the SQL Editor
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project (`qyhlicrdbegvnswsvoko`)
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**

### Step 2: Run the Migration
1. Open the file `supabase/dma_internship_backend.sql`
2. Copy the **entire contents** of the file
3. Paste it into the SQL Editor
4. Click **Run** (or press Ctrl+Enter)
5. Wait for the query to complete — you should see "Success" with no errors

### Step 3: Verify the Tables
1. Go to **Table Editor** in the left sidebar
2. You should see these new tables:
   - `dma_internship_applications` — Main application data
   - `admin_profiles` — Admin user roles
   - `dma_internship_reviews` — Reviewer scores per application
   - `dma_internship_application_events` — Audit log for status/score changes

### Step 4: Verify Storage Buckets
1. Go to **Storage** in the left sidebar
2. You should see these buckets:
   - `dma-internship-cvs`
   - `dma-internship-portfolios`
   - `dma-internship-projects`
   - `dma-internship-supporting-documents`
   - `dma-internship-photos`

### Step 5: Verify RLS Policies
1. Go to **Authentication** → **Policies**
2. You should see Row Level Security policies for:
   - `dma_internship_applications` (public insert, applicant read/update own draft, admin full access)
   - `admin_profiles` (admin read, super admin manage)
   - `dma_internship_reviews` (admin read/insert/update)
   - `dma_internship_application_events` (admin read/insert)
   - Storage objects (applicant upload, admin read)

### Step 6: Verify Views
1. Go to **SQL Editor** and run:
   ```sql
   SELECT * FROM dma_internship_score_bands LIMIT 5;
   SELECT * FROM dma_internship_summary;
   SELECT * FROM dma_internship_dept_distribution;
   SELECT * FROM dma_internship_country_distribution;
   ```
2. All queries should return empty results (no data yet) without errors

### Step 7: Add an Admin User (Optional)
After the tables are created, you can add an admin user:
1. Create a user via **Authentication** → **Users** → **Add User**
2. Note the user's `id` (UUID)
3. Run in SQL Editor:
   ```sql
   INSERT INTO admin_profiles (user_id, full_name, role, is_active)
   VALUES ('USER_UUID_HERE', 'Admin Name', 'Super Admin', TRUE);
   ```

## What Gets Created

### Tables
| Table | Purpose |
|-------|---------|
| `dma_internship_applications` | Main application form data with scoring fields |
| `admin_profiles` | Admin roles and permissions |
| `dma_internship_reviews` | Individual reviewer scores per application |
| `dma_internship_application_events` | Audit trail for status and score changes |

### Storage Buckets
| Bucket | Purpose | Public |
|--------|---------|--------|
| `dma-internship-cvs` | CV/resume uploads | No |
| `dma-internship-portfolios` | Portfolio files | No |
| `dma-internship-projects` | Project files | No |
| `dma-internship-supporting-documents` | Supporting documents | No |
| `dma-internship-photos` | Professional photos | No |

### Triggers
| Trigger | Purpose |
|---------|---------|
| `trg_internship_ref_before_insert` | Auto-generates application reference (DMA-2026-XXXX) |
| `trg_calculate_total_score` | Auto-calculates total score from 6 categories |
| `trg_internship_updated_at` | Auto-updates `updated_at` timestamp |
| `trg_log_status_change` | Logs status changes to events table |
| `trg_log_score_change` | Logs score changes to events table |
| `trg_calculate_review_total_score` | Auto-calculates reviewer total score |
| `trg_review_updated_at` | Auto-updates review `updated_at` |

### Views
| View | Purpose |
|------|---------|
| `dma_internship_score_bands` | Categorizes applicants by score band |
| `dma_internship_summary` | Application count by status |
| `dma_internship_dept_distribution` | Applications per department |
| `dma_internship_country_distribution` | Applications per country |
| `dma_internship_review_flags` | Flags reviewer score discrepancies >15 pts |

### RLS Policies
- **Public**: Can insert new applications (no auth required)
- **Applicants**: Can read/update only their own Draft applications
- **Admins**: Full read/update access to all applications, reviews, events, and files
- **Super Admins**: Can manage admin profiles

## Troubleshooting

### "already exists" errors
If you see errors about objects already existing, it means some parts were created before. The SQL uses `IF NOT EXISTS` and `IF NOT EXISTS` where possible, so most errors are safe to ignore.

### RLS blocking inserts
If the application form can't submit, check that the `public_insert_internship_application` policy exists and allows `anon` inserts.

### Storage upload fails
Ensure the user is authenticated and uploading to a folder named with their user ID (e.g., `user-uuid/filename.pdf`).