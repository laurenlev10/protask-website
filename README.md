# Pro Task Runner Services — Full Web System

Complete business management system: customer website + admin dashboard + runner portal.

---

## 📁 Files

| File | Purpose | Who Uses It |
|------|---------|-------------|
| `index.html` | Customer website + booking form | Clients / Public |
| `admin.html` | Business dashboard (jobs, runners, payments) | Lauren (Admin) |
| `runner.html` | Mobile job portal | Runners |
| `app.js` | Shared data layer (localStorage) | All pages |
| `logo.png` | Company logo | All pages |

---

## 🚀 Deploy to GitHub Pages (Free Hosting)

### Step 1 — Create Repository
1. Go to [github.com](https://github.com) → Sign in
2. Click **"New repository"**
3. Name: `protask-website`
4. Set to **Public**
5. Click **"Create repository"**

### Step 2 — Upload Files
1. Click **"uploading an existing file"**
2. Drag and drop ALL files:
   - `index.html`
   - `admin.html`
   - `runner.html`
   - `app.js`
   - `logo.png`
3. Click **"Commit changes"**

### Step 3 — Enable GitHub Pages
1. Go to **Settings** → **Pages**
2. Source: **Deploy from a branch**
3. Branch: `main` / Folder: `/ (root)`
4. Click **Save**

### Step 4 — Your URLs (after ~2 minutes)
```
Customer Site:  https://USERNAME.github.io/protask-website/
Admin Panel:    https://USERNAME.github.io/protask-website/admin.html
Runner Portal:  https://USERNAME.github.io/protask-website/runner.html
```

---

## 🔐 Admin Login
- Default PIN: **1234**
- Change it in Admin → Settings on first login

## 🏃 Runner Login
- Runners enter their phone number
- Must match a phone number saved in Admin → Runners

---

## 💳 QuickBooks Payments Setup

1. Sign in to your QuickBooks account for Pro Task Runner Services
2. Go to **Payments** → **Payment Links** → create a new link
3. Copy your QuickBooks payment link
4. In **Admin → Settings** → paste under "QuickBooks Payment Link"
5. Now when you click "💳 Send Invoice" on any job, it automatically:
   - Opens a WhatsApp message to the client
   - Includes the job details + your payment link
   - Client pays directly via QuickBooks (credit card, ACH)

---

## 📱 How It Works Day-to-Day

**Customer books online:**
1. Client fills booking form on `index.html`
2. Job automatically saves as "Pending" in your admin
3. You get a WhatsApp notification with details

**You manage in admin:**
1. Open `admin.html` → Jobs Board
2. Assign runner → they get WhatsApp notification
3. When done: mark Paid + send QuickBooks payment link to client

**Runner on the job:**
1. Opens `runner.html` on phone
2. Logs in with their phone number
3. Sees their jobs for today
4. Taps: Start Job → Complete Job
5. One-tap navigation, call/WhatsApp client

---

## ✏️ Customization
Open any `.html` file in a text editor (VS Code, Notepad++) to edit text, colors, or prices.
- Change phone number: search for `3233842662` and replace
- Change starting price: search for `$150` and replace
- Change colors: edit CSS variables at top of each file (`--purple`, `--gold`, etc.)

---

## 📞 Contact Info in System
- Phone: (323) 384-2662
- WhatsApp: (323) 384-2662  
- Address: 6931 Topanga Canyon Blvd, Suite 9, Canoga Park, CA 91303
- Company: L&E Trading / Pro Task Runner Services
