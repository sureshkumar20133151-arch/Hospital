# 🏥 Aarogya Multi-Specialty Hospital — Project Handoff & Status

> **Current Status**: 🟢 100% Production Live on Cloud (Vercel + Render + Supabase)  
> **Last Updated**: October 1, 2026  
> **Repository**: [https://github.com/sureshkumar20133151-arch/Hospital](https://github.com/sureshkumar20133151-arch/Hospital) (Branch: `main`)  
> **Local Path**: `c:\Users\Suresh\Documents\Antigravity\hospital`

---

## 📋 Copy-Paste Prompt for Your New Chat

When you start your new chat, you can paste this exact prompt to immediately resume work:

```markdown
Hi! We are working on the Aarogya Multi-Specialty Hospital monorepo.
Please read `PROJECT_STATUS.md` in the root of `c:\Users\Suresh\Documents\Antigravity\hospital`.
All production services (Patient Portal on Vercel, Admin Console on Vercel, Backend API on Render, Supabase PostgreSQL in Mumbai) are currently live and functional.
Let's continue with Phase 1: Razorpay Payment Gateway Integration for OPD booking fees.
```

---

## 🌐 1. Live Production URLs & Deployments

| Component | Platform | Live URL | Status | Details |
| :--- | :--- | :--- | :---: | :--- |
| **Patient Web Portal** | Vercel | [https://hospital-umber-eight.vercel.app](https://hospital-umber-eight.vercel.app) | 🟢 Live | Next.js 14 App Router, Patient Booking, Doctor Directory, Privacy Console |
| **Staff Admin Console** | Vercel | [https://aarogya-hospital-admin.vercel.app](https://aarogya-hospital-admin.vercel.app) | 🟢 Live | Next.js 14, OPD Queue Management, Token Callout, EMR Consultation Notes |
| **Backend Core API** | Render | [https://aarogya-hospital-api-ez31.onrender.com/api/v1](https://aarogya-hospital-api-ez31.onrender.com/api/v1) | 🟢 Live | Express + TypeScript + Prisma, Port 10000, 0.0.0.0 container routing |
| **Database (PostgreSQL)** | Supabase | Mumbai (`ap-south-1`) via AWS IPv4 Pooler | 🟢 Live | 8 Departments, 5 Doctors, Weekly Schedules, Patient Records, DPDP Consent |
| **Keep-Alive Monitor** | UptimeRobot | Pings `/api/v1/health` every 5 minutes | 🟢 Active | Prevents Render Free Tier cold start / sleep mode (24/7 Always-On) |

---

## 🔑 2. Seeded Test Credentials (All Roles)

Default Password for all seeded accounts: **`Hospital@12345`**

| Role | Email / Identifier | Purpose |
| :--- | :--- | :--- |
| **Super Admin** | `admin@aarogyahospital.example.com` | Full administrative control, all queues, audit logs |
| **Consultant Doctor** | `cardio.consultant@aarogyahospital.example.com` | OPD appointments, consultation lifecycle, EMR notes |
| **Receptionist** | `reception@aarogyahospital.example.com` | Check-in walk-in patients, token callout, billing |
| **Demo Patient** | `patient@aarogyahospital.example.com` | Book slots, view prescription history, data erasure request |

---

## 🛠️ 3. Summary of What We Have Completed

### A. Vercel Account Cleanup & Safety Backups
- Audited all user Vercel projects.
- Downloaded and saved local backups in `C:\Users\Suresh\Documents\Backups\`:
  - `pc-build-lime-vercel-backup.zip` (~59 MB)
  - `listing-generator-nine-backup.zip` (~311 KB)
  - `TourPro360` repository archive.
- Re-deployed `pc-factory-v2` live on Vercel at `https://pc-factory-v2.vercel.app/`.
- Kept all active live projects intact (`3d-portfolio-main` -> `solodeveloper.pro`, `abc-builders-madurai`, `linkedin-ai-assistant`, `personal-finance-app`).

### B. Git Monorepo Initialization & GitHub Push
- Initialized Git repository on `main` branch with comprehensive `.gitignore` ensuring zero secret leaks.
- Remote repository connected: `https://github.com/sureshkumar20133151-arch/Hospital.git`.

### C. Build & Monorepo Package Resolution
- Configured path mapping in `apps/web/tsconfig.json` and `apps/admin/tsconfig.json` for `@hospital/shared`.
- Precompiled and tracked `packages/shared/dist/` in Git so the Node.js ESM/CJS runtime on Render executes without module resolution errors (`ERR_MODULE_NOT_FOUND`).

### D. Cloud Infrastructure & Network Engineering
- Added `render.yaml` Blueprint for zero-friction Render deployments.
- Bound API server to `0.0.0.0` (Render reverse proxy requirement).
- **Supabase IPv6 / Render Workaround (CRITICAL)**: Render's free tier lacks outbound IPv6 connectivity, causing direct connections to `db.<project>.supabase.co:5432` to fail with timeout/502. We switched `DATABASE_URL` to Supabase's AWS Mumbai IPv4 Connection Pooler:
  ```text
  postgresql://postgres.gukaanfbewjnjshaxzsu:[PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:5432/postgres
  ```
  Verified: 8 clinical departments retrieved in milliseconds.
- Configured automated client fallback to `https://aarogya-hospital-api-ez31.onrender.com/api/v1` in both `apps/web` and `apps/admin` so frontend builds communicate with the live API seamlessly.

### E. 24/7 Always-On Keep-Alive
- Set up an UptimeRobot monitor pinging `https://aarogya-hospital-api-ez31.onrender.com/api/v1/health` every 5 minutes.
- Prevents Render's container from sleeping, ensuring instant response times for patient booking and staff logins.

---

## 🎯 4. What We Need to Do Next (Action Plan)

### Phase 1: Razorpay Payment Gateway Integration
- **Objective**: Collect OPD consultation booking fees (₹500 / ₹800) online.
- **Tasks**:
  1. Add Razorpay SDK to `apps/api` (`razorpay`).
  2. Implement backend endpoint `POST /api/v1/payments/create-order` to generate Razorpay orders with Indian Rupee (INR) currency.
  3. Implement frontend Razorpay Standard Checkout in `apps/web` supporting UPI (GPay, PhonePe, Paytm), Cards, and NetBanking.
  4. Create `POST /api/v1/payments/verify` webhook with HMAC-SHA256 signature verification to update appointment status to `CONFIRMED`.
  5. Generate downloadable digital payment receipts/invoices.

### Phase 2: SMS & WhatsApp Notifications (MSG91 / Twilio)
- **Objective**: Deliver real-time communication to patients and staff in compliance with Indian healthcare expectations.
- **Tasks**:
  1. Instant appointment booking confirmation via SMS & WhatsApp.
  2. OPD queue token callout notification ("Your token #12 is in 2 turns. Please proceed to Room 102").
  3. Email appointment summary and prescription links via Resend or Nodemailer.

### Phase 3: Secure Cloud Storage for Medical Records (Cloudinary / AWS S3)
- **Objective**: Store and stream patient lab reports, X-rays, and scans securely.
- **Compliance Requirement (DPDP Act 2023)**:
  - Medical files must **NEVER** be publicly accessible via static URLs.
  - Upload files into a private bucket/folder.
  - Generate time-limited, signed URLs (TTL: 5-15 minutes) only after authenticating user session and verifying doctor/patient access rights.
  - Log every file view/download event to the audit trail.

### Phase 4: Full End-to-End Walkthrough & Verification
- **Objective**: Complete end-to-end user journeys live on production.
  1. Patient lands on `https://hospital-umber-eight.vercel.app`, selects Cardiology, picks Dr. Sharma, books slot, pays via Razorpay test mode.
  2. Receptionist on `https://aarogya-hospital-admin.vercel.app` checks in the patient and issues queue token.
  3. Doctor opens patient EMR, enters diagnosis and medicines, and signs digital prescription.
  4. Patient accesses `My Prescriptions` and downloads PDF.

---

## 🔐 5. Environment Variables Reference

### Backend (`apps/api` on Render)
| Variable | Value / Description | Status |
| :--- | :--- | :---: |
| `NODE_ENV` | `production` | Set |
| `PORT` | `10000` | Set |
| `DATABASE_URL` | Supabase IPv4 Pooler URL | Set |
| `JWT_ACCESS_SECRET` | Super secure random string | Set |
| `JWT_REFRESH_SECRET` | Super secure random string | Set |
| `CORS_ORIGIN` | Frontends origin URLs | Set |
| `RAZORPAY_KEY_ID` | `rzp_test_...` | Pending |
| `RAZORPAY_KEY_SECRET` | Razorpay Secret | Pending |
| `TWILIO_ACCOUNT_SID` / `MSG91_AUTH_KEY` | SMS/WhatsApp Provider | Pending |
| `CLOUDINARY_URL` / `AWS_S3_*` | Storage Provider | Pending |

### Frontends (`apps/web` & `apps/admin` on Vercel)
| Variable | Value / Description | Status |
| :--- | :--- | :---: |
| `NEXT_PUBLIC_API_URL` | `https://aarogya-hospital-api-ez31.onrender.com/api/v1` | Baked as default |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Razorpay Public Key ID | Pending |
