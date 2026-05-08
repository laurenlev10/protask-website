// ============================================================
// PRO TASK RUNNER SERVICES — Shared Data Layer
// app.js v1.1 — used by index.html, admin.html, runner.html
// ============================================================

const PTRS = {

  // ── Keys ──────────────────────────────────────────────────
  KEYS: {
    jobs:     'ptrs_jobs',
    runners:  'ptrs_runners',
    settings: 'ptrs_settings',
    alerts:   'ptrs_alerts',
  },

  // ── Company Info ──────────────────────────────────────────
  COMPANY: {
    name:    'Pro Task Runner Services',
    phone:   '+13233842662',
    wa:      '13233842662',
    address: '6931 Topanga Canyon Blvd, Suite 9, Canoga Park, CA 91303',
    website: 'www.protaskrunnerservices.com',
    email:   'hello@protaskrunnerservices.com',
    startingPrice: 150,
  },

  SERVICES: [
    { id: 'inspection',  label: 'Construction Site Inspection',        icon: '🔍' },
    { id: 'materials',   label: 'Tile, Wood & Material Delivery',       icon: '🚐' },
    { id: 'plans',       label: 'Plans Pickup & Delivery',              icon: '📐' },
    { id: 'checks',      label: 'Check Pickup & Bank Deposits',         icon: '💵' },
    { id: 'trash',       label: 'Trash Removal from Job Site',          icon: '🗑️' },
    { id: 'doors',       label: 'Door Delivery',                        icon: '🚪' },
    { id: 'store',       label: "Home Depot & Lowe's Pickups",          icon: '🏪' },
    { id: 'other',       label: 'Other / Multiple Services',            icon: '📋' },
  ],

  STATUS: {
    pending:    { label: 'Pending',     color: '#f5a623', bg: 'rgba(245,166,35,0.15)'  },
    assigned:   { label: 'Assigned',    color: '#3b82f6', bg: 'rgba(59,130,246,0.15)'  },
    inprogress: { label: 'In Progress', color: '#8b5cf6', bg: 'rgba(139,92,246,0.15)'  },
    completed:  { label: 'Completed',   color: '#22c55e', bg: 'rgba(34,197,94,0.15)'   },
    cancelled:  { label: 'Cancelled',   color: '#ef4444', bg: 'rgba(239,68,68,0.15)'   },
  },

  // ── Helpers ───────────────────────────────────────────────
  _get(key) {
    try { return JSON.parse(localStorage.getItem(key) || '[]'); }
    catch { return []; }
  },
  _set(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
  },
  _getObj(key) {
    try { return JSON.parse(localStorage.getItem(key) || '{}'); }
    catch { return {}; }
  },

  uid(prefix = 'ID') {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2,6).toUpperCase()}`;
  },

  formatDate(ts) {
    if (!ts) return '—';
    return new Date(ts).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' });
  },

  formatTime(ts) {
    if (!ts) return '';
    return new Date(ts).toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit' });
  },

  // ── Jobs ─────────────────────────────────────────────────
  getJobs() { return this._get(this.KEYS.jobs); },

  saveJob(job) {
    const jobs = this.getJobs();
    job.id        = job.id || this.uid('JOB');
    job.status    = job.status || 'pending';
    job.paid      = job.paid || false;
    job.createdAt = job.createdAt || Date.now();
    job.updatedAt = Date.now();
    const idx = jobs.findIndex(j => j.id === job.id);
    if (idx >= 0) {
      jobs[idx] = job;
    } else {
      jobs.unshift(job);
      this.addAlert(`New job from ${job.clientName} — ${job.service}`, 'job', job.id);
    }
    this._set(this.KEYS.jobs, jobs);
    return job;
  },

  updateJob(id, changes) {
    const jobs = this.getJobs();
    const idx = jobs.findIndex(j => j.id === id);
    if (idx < 0) return null;
    jobs[idx] = { ...jobs[idx], ...changes, updatedAt: Date.now() };
    this._set(this.KEYS.jobs, jobs);
    return jobs[idx];
  },

  getJob(id) {
    return this.getJobs().find(j => j.id === id) || null;
  },

  deleteJob(id) {
    const jobs = this.getJobs().filter(j => j.id !== id);
    this._set(this.KEYS.jobs, jobs);
  },

  getJobsByRunner(runnerId) {
    return this.getJobs().filter(j => j.runnerId === runnerId);
  },

  getJobsByStatus(status) {
    return this.getJobs().filter(j => j.status === status);
  },

  // ── Runners ───────────────────────────────────────────────
  getRunners() { return this._get(this.KEYS.runners); },

  saveRunner(runner) {
    const runners = this.getRunners();
    runner.id = runner.id || this.uid('RUN');
    runner.active = runner.active !== false;
    runner.jobsCompleted = runner.jobsCompleted || 0;
    runner.createdAt = runner.createdAt || Date.now();
    const idx = runners.findIndex(r => r.id === runner.id);
    if (idx >= 0) runners[idx] = runner;
    else runners.push(runner);
    this._set(this.KEYS.runners, runners);
    return runner;
  },

  getRunner(id) {
    return this.getRunners().find(r => r.id === id) || null;
  },

  getRunnerByPhone(phone) {
    const clean = phone.replace(/\D/g,'');
    return this.getRunners().find(r => r.phone.replace(/\D/g,'') === clean) || null;
  },

  deleteRunner(id) {
    const runners = this.getRunners().filter(r => r.id !== id);
    this._set(this.KEYS.runners, runners);
  },

  // ── Settings ─────────────────────────────────────────────
  getSettings() { return this._getObj(this.KEYS.settings); },

  saveSetting(key, val) {
    const s = this.getSettings();
    s[key] = val;
    localStorage.setItem(this.KEYS.settings, JSON.stringify(s));
  },

  // ── Alerts ────────────────────────────────────────────────
  getAlerts() { return this._get(this.KEYS.alerts); },

  addAlert(message, type = 'info', refId = null) {
    const alerts = this.getAlerts();
    alerts.unshift({ id: this.uid('ALT'), message, type, refId, read: false, ts: Date.now() });
    if (alerts.length > 50) alerts.splice(50);
    this._set(this.KEYS.alerts, alerts);
  },

  markAlertRead(id) {
    const alerts = this.getAlerts().map(a => a.id === id ? {...a, read:true} : a);
    this._set(this.KEYS.alerts, alerts);
  },

  clearAlerts() { this._set(this.KEYS.alerts, []); },

  unreadAlertCount() { return this.getAlerts().filter(a => !a.read).length; },

  // ── Stats ─────────────────────────────────────────────────
  getStats() {
    const jobs = this.getJobs();
    const now = Date.now();
    const weekAgo = now - 7 * 86400000;
    const monthAgo = now - 30 * 86400000;

    const completed = jobs.filter(j => j.status === 'completed');
    const thisWeek  = completed.filter(j => j.updatedAt > weekAgo);
    const thisMonth = completed.filter(j => j.updatedAt > monthAgo);

    const revenue = (arr) => arr.reduce((s, j) => s + (parseFloat(j.price) || 0), 0);

    const serviceCounts = {};
    jobs.forEach(j => { serviceCounts[j.service] = (serviceCounts[j.service] || 0) + 1; });
    const topService = Object.entries(serviceCounts).sort((a,b) => b[1]-a[1])[0]?.[0] || '—';

    return {
      totalJobs:      jobs.length,
      pending:        jobs.filter(j => j.status === 'pending').length,
      assigned:       jobs.filter(j => j.status === 'assigned').length,
      inprogress:     jobs.filter(j => j.status === 'inprogress').length,
      completed:      completed.length,
      cancelled:      jobs.filter(j => j.status === 'cancelled').length,
      weekJobs:       thisWeek.length,
      monthJobs:      thisMonth.length,
      weekRevenue:    revenue(thisWeek),
      monthRevenue:   revenue(thisMonth),
      totalRevenue:   revenue(completed),
      unpaidJobs:     completed.filter(j => !j.paid).length,
      topService,
      activeRunners:  this.getRunners().filter(r => r.active).length,
    };
  },

  // ── WhatsApp ─────────────────────────────────────────────
  waLink(phone, message) {
    const clean = phone.replace(/\D/g,'');
    return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`;
  },

  waBookingMessage(job) {
    return `*New Task Request — Pro Task Runner Services*\n\n` +
      `👤 Client: ${job.clientName}\n` +
      `📞 Phone: ${job.clientPhone}\n` +
      (job.clientEmail ? `✉️ Email: ${job.clientEmail}\n` : '') +
      `🔧 Service: ${job.service}\n` +
      (job.pickup      ? `📦 Pickup: ${job.pickup}\n`      : '') +
      (job.destination ? `📍 Destination: ${job.destination}\n` : '') +
      (job.date        ? `📅 Date: ${job.date}\n`          : '') +
      (job.time        ? `🕐 Time: ${job.time}\n`          : '') +
      (job.notes       ? `📝 Notes: ${job.notes}\n`        : '') +
      `\n🆔 Job ID: ${job.id}`;
  },

  waRunnerAssignment(job, runner) {
    return `*Job Assignment — Pro Task Runner Services*\n\n` +
      `Hi ${runner.name}! You have a new job:\n\n` +
      `🆔 ${job.id}\n` +
      `🔧 ${job.service}\n` +
      `👤 Client: ${job.clientName} · ${job.clientPhone}\n` +
      `📦 Pickup: ${job.pickup || '—'}\n` +
      `📍 Destination: ${job.destination || '—'}\n` +
      `📅 ${job.date || 'ASAP'} · ${job.time || 'Flexible'}\n` +
      (job.notes ? `📝 ${job.notes}\n` : '') +
      `\nQuestions? Call Lauren: ${this.COMPANY.phone}`;
  },

  mapsLink(address) {
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
  },

  // ── Seed Demo Data (for first run) ───────────────────────
  seedDemoData() {
    if (this.getJobs().length > 0) return; // already has data
    const demoJobs = [
      { clientName:'Mike Torres', clientPhone:'(818) 555-0101', service:'Construction Site Inspection', pickup:'12345 Ventura Blvd, Sherman Oaks', destination:'same', date:'2026-05-08', time:'Morning (7am–12pm)', notes:'3rd floor, check framing progress', price:175, status:'pending' },
      { clientName:'David Kim', clientPhone:'(310) 555-0202', service:'Tile, Wood & Material Delivery', pickup:'Home Depot, Reseda', destination:'456 Oak St, Burbank', date:'2026-05-08', time:'Afternoon (12pm–5pm)', notes:'8 boxes of 12x24 porcelain tile', price:220, status:'assigned', runnerId:null },
      { clientName:'Carlos Reyes', clientPhone:'(323) 555-0303', service:'Plans Pickup & Delivery', pickup:'City Hall LA', destination:'789 Maple Ave, Glendale', date:'2026-05-07', time:'ASAP / Same Day', notes:'Permit set for project #2241', price:150, status:'completed', paid:true },
    ];
    demoJobs.forEach(j => {
      const job = { ...j, id: this.uid('JOB'), createdAt: Date.now() - Math.random()*86400000*3, updatedAt: Date.now() };
      const jobs = this.getJobs();
      jobs.unshift(job);
      this._set(this.KEYS.jobs, jobs);
    });
    const demoRunners = [
      { name:'Alex Rivera',  phone:'(747) 555-0401', active:true,  jobsCompleted:12 },
      { name:'Jason Park',   phone:'(818) 555-0402', active:true,  jobsCompleted:8  },
      { name:'Omar Hassan',  phone:'(310) 555-0403', active:false, jobsCompleted:5  },
    ];
    demoRunners.forEach(r => this.saveRunner(r));
  },
};

// Auto-init on load
if (typeof window !== 'undefined') {
  window.PTRS = PTRS;
}
