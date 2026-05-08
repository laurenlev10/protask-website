# Pro Task Runner Services — Audit Findings

**Audit date:** May 7, 2026
**Files audited:** `app.js`, `index.html`, `admin.html`, `runner.html`
**Verification method:** static syntax check (Node), simulated end-to-end flow with mocked localStorage, cross-file label/key grep, brief vs. implementation diff.

---

## TL;DR

The system is **largely complete and functional**. The customer → admin → runner flow works end-to-end (verified by simulation). All inline JS is syntactically valid. Design system and UX match the brief.

There are **3 must-fix issues**, **6 should-fix issues**, and a handful of nice-to-haves. The single biggest item: payment processor is wired to **Square**, but the README and the new direction are **QuickBooks**. This needs a coordinated rename.

---

## What Works (Verified)

- **Data layer (`app.js`)**: all CRUD for jobs/runners/settings/alerts is correct. Phone-by-runner lookup normalizes both sides. Stats compute correctly. `uid()` adds a random suffix to prevent collisions.
- **Customer flow (`index.html`)**: form validates required fields, saves a `pending` job to localStorage, opens WhatsApp with the formatted booking message via `PTRS.waBookingMessage()`.
- **Admin flow (`admin.html`)**: PIN gate, sidebar nav, dashboard stats, kanban board, runner cards with stats, payments table, alerts feed, settings with PIN change, modals for new/edit job and add runner. Auto-assign logic (status flips to `assigned` if a runner is picked while pending). Optional WhatsApp ping to the runner on assignment.
- **Runner flow (`runner.html`)**: phone-based login, Today/Upcoming/Completed tabs, Maps deep links for pickup + destination, one-tap call/WhatsApp the client, Start → Complete buttons, runner counter bumps on completion.
- **End-to-end simulation passed**: pending → assigned → inprogress → completed → paid, with all status transitions, runner counter, stats, and alerts behaving as expected.

---

## Must-Fix Issues

### 1. Payment processor is Square in the code, QuickBooks in the README
**Files:** `admin.html` (lines 265, 266, 362, 495, 496, 502, 504, 505)
**Symptom:** Settings panel says "Square Payment Base URL"; localStorage key is `squareBase`; Payments table button reads "💳 Square" and calls `sendSquare()`. The README tells the owner to set up QuickBooks.
**Fix:** rename throughout `admin.html`:
- Label: `Square Payment Base URL` → `QuickBooks Payment Link`
- Placeholder: `https://square.link/u/...` → `https://quickbooks.intuit.com/...` (or whatever QB hands back)
- Function: `saveSquare()` → `saveQbLink()`
- Setting key: `squareBase` → `qbLink`
- Button label: `💳 Square` → `💳 Send Invoice`
- WhatsApp message templates that include the link

Recommend also updating `PROJECT_BRIEF.md` to remove the Square references, since you've decided on QuickBooks.

### 2. `saveJob()` fires an alert on every update, not just on creation
**File:** `app.js`, line 87.
**Symptom:** Each time admin clicks "Save Job" on an existing job (e.g. to change price, status, or notes), a new alert is appended. Over a busy week this floods the Alerts feed with duplicate "New job from X" entries that aren't really new jobs.
**Fix:** only call `addAlert` when `idx < 0` (first insert). Move the `addAlert` call inside the else branch, like:
```js
const idx = jobs.findIndex(j => j.id === job.id);
if (idx >= 0) {
  jobs[idx] = job;
} else {
  jobs.unshift(job);
  this.addAlert(`New job from ${job.clientName} — ${job.service}`, 'job', job.id);
}
```

### 3. Service-label drift between customer form and `app.js`
**Files:** `index.html` (lines 241, 245, 246) vs. `app.js` (line 31, 35).
**Symptom:** The customer dropdown offers "Check Pickup & Bank Deposit" (singular), but `SERVICES` has "Bank Deposits" (plural). Customer dropdown also splits "Multiple Services" and "Other" into two options, while `SERVICES` has a single "Other / Multiple Services". When the runner card or admin board look up an icon for these strings, the lookup fails silently and falls back to 📋.
**Fix:** make the customer dropdown render dynamically from `PTRS.SERVICES` (same approach the admin modal already uses), so the labels stay in sync forever. Smallest fix: just edit the strings in `index.html` to match `app.js` exactly.

---

## Should-Fix Issues

### 4. Customer email is collected but never saved
**File:** `index.html` line 234 + `submitForm()` at line 290. The form has an `#femail` input but the resulting `job` object doesn't include it. Either save it (add `clientEmail: document.getElementById('femail').value`) and surface it in admin/runner views, or remove the field.

### 5. New-job modal can show stale Status/Time after editing then opening fresh
**File:** `admin.html`, `populateJobModalDropdowns(j)` at line 555. The function only sets `jStatus` / `jTime` when an existing job `j` is passed. After editing a job, then clicking "+ New Job", those two selects keep the prior values. Fix: in `openNewJobModal()`, explicitly reset `jStatus` to `pending` and `jTime` to `Any time`.

### 6. Admin dashboard isn't responsive at all on tablets/phones
**File:** `admin.html`. The kanban board uses `grid-template-columns:repeat(5,1fr)` with no media queries; the sidebar and stats grid likewise stay at desktop widths. Lauren almost certainly opens the admin from her phone occasionally. Add a mobile breakpoint: collapse sidebar to a top hamburger, switch board to horizontal scroll or single-column.

### 7. Square/QuickBooks "Send Invoice" WhatsApp message includes a literal placeholder when no link is set
**File:** `admin.html` line 496. The fallback string `[add Square link in Settings]` ends up inside the WhatsApp body if the owner forgot to configure the link. Better: if no link is set, disable the Send button and show a toast/warning. (When you do the rename in #1, fix this at the same time.)

### 8. Runner has no logout
**File:** `runner.html`. Once logged in, there's no way to switch runners or log out from the UI. Add a small "Sign Out" link in the header for shared-device cases.

### 9. Bottom nav on runner portal has no "Completed" shortcut
**File:** `runner.html` line 151. The Completed tab can only be reached by tapping the small tab pill at the top. Add a 5th bottom-nav item or move "Lauren"/"WhatsApp" out so the three tabs are first-class.

### 10. Customer form doesn't reset after a successful submit
**File:** `index.html` `submitForm()`. The success message shows but the fields stay populated, so refreshing or scrolling back makes it look like the next click would re-submit the same job. Reset the form on success.

---

## Nice-to-Haves

- **Persist last-active admin panel** across reload (`localStorage.setItem('ptrs_lastPanel', name)` in `showPanel`).
- **Job delete from modal**, not just status change to "cancelled".
- **Date formatting on the runner card**: a date like `2026-05-08` is fine but "May 8 · Morning" reads better. `PTRS.formatDate()` already exists.
- **Server-rendered fallback link in admin contact strip** and a real `mailto:` for `hello@protaskrunnerservices.com`.
- **Active state for "Lauren" / "WhatsApp"** bottom nav items (currently they keep `.active` styles from the previous tab).
- **Recent jobs table empty-state colspan**: it says `colspan="7"` but the header has 7 columns including the actions column — works, but worth verifying after any column change.
- **`waLink()` should clamp/escape unusual characters** in `phone` more aggressively. The current `.replace(/\D/g, '')` is fine for US numbers; document the assumption.

---

## Brief Coverage Check

| Brief item | Status |
|---|---|
| `index.html` hero, services grid, pricing $150, areas, booking form, contact strip, footer | ✅ All present |
| `index.html` form → WA + saves to localStorage as pending | ✅ Works |
| `admin.html` PIN-gated | ✅ Default 1234, Settings can change it |
| Jobs Board (5-column kanban) | ✅ |
| Runners management with active jobs + counters | ✅ |
| Payments & Revenue with invoice link | ⚠️ Wired to Square — needs QuickBooks rename |
| Stats Overview | ✅ |
| Notifications feed | ✅ (with alert-spam bug, see #2) |
| `runner.html` phone login | ✅ |
| Today / Upcoming view, Start/Complete, Maps/Call/WA shortcuts | ✅ |
| Shared `app.js` data layer with documented schema | ✅ |
| Design tokens (purple/gold/dark, Bebas/Barlow) | ✅ |
| GitHub Pages deployable (no backend) | ✅ |

---

## Recommended Fix Order

1. Square → QuickBooks rename (issue #1) — blocks the "Send Invoice" UX going live.
2. Alert-spam fix (issue #2) — one-line code change, big quality-of-life win.
3. Service-label sync (issue #3) — unblocks correct icon rendering.
4. Save customer email + reset form on success (#4, #10).
5. New-job modal reset (#5).
6. QuickBooks WA placeholder cleanup (#7) — bundle with #1.
7. Admin responsive breakpoints (#6) — biggest visual lift, can wait.
8. Runner logout + bottom-nav rebalance (#8, #9).

Each fix is small enough to be a single commit. I can apply them in this order on request.
