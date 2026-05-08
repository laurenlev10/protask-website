# PRO TASK RUNNER SERVICES — Full System Project Brief

## Overview
A complete web-based business management system for **Pro Task Runner Services** — a construction runner/logistics company based in Canoga Park, CA. The system has three user roles and is designed to be hosted on GitHub Pages (static, no backend required).

---

## Business Context
- **Company:** Pro Task Runner Services (L&E Trading)
- **Owner:** Lauren (Admin)
- **Phone:** (323) 384-2662
- **Address:** 6931 Topanga Canyon Blvd, Suite 9, Canoga Park, CA 91303
- **Website:** www.protaskrunnerservices.com
- **Colors:** Purple (#3d1e6d) + Gold (#f5a623) on dark background
- **Payment processor:** Square (not Stripe)

## Services Offered
1. Construction Site Inspections
2. Tile, Wood & Material Delivery (Ford Transit Van)
3. Plans Pickup & Delivery
4. Check Pickup & Bank Deposits
5. Trash Removal from Job Site
6. Door Delivery
7. Home Depot & Lowe's Pickups

## Service Areas
Los Angeles · Orange County · San Diego · Inland Empire · San Francisco · Las Vegas

---

## System Architecture — 3 Files + 1 Shared JS

### 1. `index.html` — Customer-Facing Website
**Purpose:** Marketing site + booking form for clients (contractors, builders, property managers)

**Sections:**
- Hero: Logo, headline "Never Miss A Project. Book More Jobs.", CTA buttons
- Services grid (7 services with icons)
- Pricing: Starting at $150
- Service areas
- Booking form → sends WhatsApp message to (323) 384-2662 + saves to localStorage as pending job
- Contact strip: Phone, WhatsApp, Address
- Footer

**Key behavior:**
- Form submission opens WhatsApp with pre-filled message AND saves job to `localStorage` as `status: "pending"`
- Mobile-first, fully responsive

---

### 2. `admin.html` — Admin Dashboard (Lauren)
**Purpose:** Full business management dashboard

**Access:** Password protected (PIN: ask Lauren to set on first load, saved to localStorage)

**Dashboard tabs/sections:**

#### 📋 Jobs Board (Kanban)
- Columns: Pending → Assigned → In Progress → Completed → Cancelled
- Each job card shows: client name, service type, pickup/drop address, date, runner assigned, price
- Actions: Assign to runner, change status, add notes, mark paid

#### 👥 Runners Management
- Add/remove runners (name, phone, WhatsApp, active status)
- View runner's active jobs
- Runner performance: jobs completed this week/month

#### 💰 Payments & Revenue
- List of completed jobs with payment status (Paid / Unpaid / Square link sent)
- Generate Square payment link per job (opens Square payment URL)
- Monthly revenue total
- Export summary (copy to clipboard as text)

#### 📊 Stats Overview
- Total jobs this week / month
- Revenue this week / month
- Most popular service
- Jobs by status breakdown

#### 🔔 Notifications
- New booking alerts (from customer form)
- Jobs pending assignment

**Data storage:** All data in `localStorage` with keys:
- `ptrs_jobs` — array of job objects
- `ptrs_runners` — array of runner objects
- `ptrs_settings` — admin PIN, company settings

---

### 3. `runner.html` — Runner Portal
**Purpose:** Simple mobile interface for runners to see and update their assigned jobs

**Access:** Runner logs in with their phone number (matched against runners list in localStorage)

**Features:**
- View assigned jobs (today / upcoming)
- Each job: client info, pickup address, destination, service type, notes
- Status buttons: "Start Job" → "Complete Job"
- One-tap: Call client, WhatsApp client, Google Maps navigation to pickup/destination
- Mark job complete (triggers admin notification flag)

---

### 4. `app.js` — Shared Logic
**Purpose:** Shared data layer used by all three pages

**Functions:**
```javascript
// Data management
getJobs() → array
saveJob(job) → void
updateJob(id, changes) → void
getRunners() → array
saveRunner(runner) → void

// Job object schema
{
  id: "JOB-" + timestamp,
  status: "pending" | "assigned" | "inprogress" | "completed" | "cancelled",
  clientName: string,
  clientPhone: string,
  service: string,
  pickup: string,
  destination: string,
  date: string,
  time: string,
  notes: string,
  runnerId: string | null,
  price: number | null,
  paid: boolean,
  squareLink: string | null,
  createdAt: timestamp,
  updatedAt: timestamp
}

// Runner object schema
{
  id: "RUN-" + timestamp,
  name: string,
  phone: string,
  active: boolean,
  jobsCompleted: number
}
```

---

## Design System (apply to ALL pages)
```css
--purple:       #3d1e6d;
--purple-mid:   #5a2d9c;
--gold:         #f5a623;
--gold-dark:    #c8841a;
--dark:         #0d0b14;
--dark2:        #13101e;
--white:        #ffffff;
--text-muted:   rgba(255,255,255,0.6);
```

**Fonts:** Bebas Neue (headings) + Barlow Condensed (labels/buttons) + Barlow (body)
**Style:** Dark, bold, high-contrast. Construction/industrial feel. Gold accents. NOT generic.

---

## Integrations
- **WhatsApp:** `https://wa.me/13233842662?text=...` (pre-fill booking details)
- **Square Payments:** `https://square.link/...` (admin generates link per job manually, pastes into job record)
- **Google Maps:** `https://www.google.com/maps/dir/?api=1&destination=ADDRESS` (runner navigation)
- **Phone:** `tel:+13233842662`

---

## GitHub Pages Deployment
All files are static HTML/CSS/JS — no server needed.
1. Upload all files to GitHub repo
2. Enable GitHub Pages from Settings → Pages → Deploy from main
3. Site live at: `https://username.github.io/repo-name/`

Each page is standalone and linked to each other:
- `index.html` → links to customer booking
- `admin.html` → admin login button in nav (hidden)
- `runner.html` → runner login at `/runner`

---

## Current Files in This Project
| File | Purpose |
|------|---------|
| `index.html` | Customer website + booking |
| `admin.html` | Admin dashboard |
| `runner.html` | Runner portal |
| `app.js` | Shared data layer |
| `logo.png` | Company logo (purple/gold) |
| `README.md` | Setup + deployment instructions |
| `PROJECT_BRIEF.md` | This file — full system spec |

---

## Priority Build Order
1. `app.js` — data layer first
2. `index.html` — customer site (already built, refine)
3. `admin.html` — most critical for operations
4. `runner.html` — runner mobile interface

## Notes for Agent
- Use localStorage for ALL data (no backend)
- Every page must work standalone on GitHub Pages
- Mobile-first on runner.html (runners use phones on job sites)
- Admin dashboard needs to feel like a real ops tool — not a toy
- WhatsApp integration is critical — every job notification goes to (323) 384-2662
