/* ============================================================
   EVENTRA · Application Logic
   - Auth & role switching
   - Dynamic sidebar + page rendering
   - Event CRUD + approval workflow
   - QR / certificates / chatbot / notifications
   ============================================================ */

/* =================== UTILITIES =================== */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const el = (tag, attrs = {}, ...children) => {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === 'class') node.className = v;
    else if (k === 'html') node.innerHTML = v;
    else if (k.startsWith('on')) node.addEventListener(k.slice(2).toLowerCase(), v);
    else node.setAttribute(k, v);
  });
  children.flat().forEach(c => {
    if (c == null) return;
    node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
  });
  return node;
};
const initials = name => name.split(' ').map(s => s[0]).slice(0, 2).join('').toUpperCase();
const fmtDate = iso => {
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};
const fmtDateShort = iso => {
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
};

/* =================== TOAST =================== */
function toast(msg, type = '') {
  const t = $('#toast');
  const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : '✨';
  t.className = `toast show ${type}`;
  t.innerHTML = `<span class="icon">${icon}</span> ${msg}`;
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => t.classList.remove('show'), 2800);
}

/* =================== ICONS (inline SVG) =================== */
const ICON = {
  dashboard: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>',
  calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
  ticket: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/></svg>',
  bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>',
  award: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="8" r="6"/><path d="M15.5 12.8 17 22l-5-3-5 3 1.5-9.2"/></svg>',
  trophy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>',
  image: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>',
  sparkle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/></svg>',
  users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>',
  radio: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"/><path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"/><circle cx="12" cy="12" r="2"/><path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"/><path d="M19.1 4.9C23 8.8 23 15.1 19.1 19"/></svg>',
  qr: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 14h7v7h-7z"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="m9 12 2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>',
  shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>',
  chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="M7 16V10"/><path d="M12 16v-4"/><path d="M17 16V7"/></svg>',
  building: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="4" y="2" width="16" height="20"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>',
  file: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>',
  activity: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
  map: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>',
  users2: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/></svg>',
  tag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r="1.5"/></svg>',
};

/* =================== SIDEBAR DEFS PER ROLE =================== */
const NAV_BY_ROLE = {
  student: [
    { group: 'Main', items: [
      { id: 'dashboard',   label: 'Dashboard',        icon: ICON.dashboard },
      { id: 'events',      label: 'All Events',       icon: ICON.calendar },
      { id: 'my-events',   label: 'My Events',        icon: ICON.ticket, badge: '3' },
      { id: 'recommended', label: 'For You',          icon: ICON.sparkle },
    ]},
    { group: 'Engage', items: [
      { id: 'leaderboard', label: 'Leaderboard',      icon: ICON.trophy },
      { id: 'certificates',label: 'Certificates',     icon: ICON.award },
      { id: 'gallery',     label: 'Gallery',          icon: ICON.image },
      { id: 'external',    label: 'Other Colleges',   icon: ICON.building },
    ]},
  ],
  coordinator: [
    { group: 'Main', items: [
      { id: 'dashboard',   label: 'Dashboard',        icon: ICON.dashboard },
      { id: 'create',      label: 'Create Event',     icon: ICON.plus },
      { id: 'my-events-c', label: 'My Events',        icon: ICON.calendar, badge: '5' },
      { id: 'live',        label: 'Live Updates',     icon: ICON.radio },
      { id: 'attendance',  label: 'Attendance',       icon: ICON.qr },
    ]},
  ],
  faculty: [
    { group: 'Main', items: [
      { id: 'dashboard',   label: 'Dashboard',        icon: ICON.dashboard },
      { id: 'pending',     label: 'Pending Approvals',icon: ICON.shield, badge: '2' },
      { id: 'monitoring',  label: 'Monitoring',       icon: ICON.chart },
    ]},
  ],
  admin: [
    { group: 'Main', items: [
      { id: 'dashboard',   label: 'Dashboard',        icon: ICON.dashboard },
      { id: 'users',       label: 'User Management',  icon: ICON.users },
      { id: 'all-events',  label: 'All Events',       icon: ICON.calendar },
      { id: 'clubs',       label: 'Clubs',            icon: ICON.building },
    ]},
    { group: 'Reports', items: [
      { id: 'reports',     label: 'Reports',          icon: ICON.file },
      { id: 'activity',    label: 'Activity Log',     icon: ICON.activity },
    ]},
  ],
  guest: [
    { group: 'Main', items: [
      { id: 'dashboard', label: 'Invited Events', icon: ICON.calendar },
      { id: 'events',    label: 'Browse Events',  icon: ICON.calendar },
    ]},
  ],
};

/* =================== AUTH & BOOT =================== */
document.addEventListener('DOMContentLoaded', () => {
  initAuth();
  initChatbot();
  initTheme();
});

function initAuth() {
  // role chip selection
  let selectedRole = 'student';
  $$('#role-chips .chip').forEach(chip => {
    chip.addEventListener('click', () => {
      $$('#role-chips .chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      selectedRole = chip.dataset.role;
      // autofill sample email
      const sampleUser = DB.users.find(u => u.role === selectedRole);
      if (sampleUser) $('#login-email').value = sampleUser.email;
    });
  });

  // default fill
  $('#login-email').value = 'arun@iiitsurat.ac.in';
  $('#login-password').value = 'eventra';

  // login submit
  $('#login-form').addEventListener('submit', e => {
    e.preventDefault();
    const email = $('#login-email').value.trim();
    // find user by email first, else by role
    const user = DB.users.find(u => u.email === email) ||
                 DB.users.find(u => u.role === selectedRole);
    if (!user) { toast('User not found', 'error'); return; }
    loginUser(user);
  });

  $('#btn-guest').addEventListener('click', () => {
    const guest = DB.users.find(u => u.role === 'guest');
    loginUser(guest);
  });
}

function loginUser(user) {
  SESSION.currentUser = user;
  $('#auth-screen').classList.add('hidden');
  $('#app').classList.remove('hidden');
  renderSidebar();
  renderTopBar();
  renderNotifs();
  SESSION.currentPage = 'dashboard';
  navigate('dashboard');
  toast(`Welcome, ${user.name.split(' ')[0]}!`, 'success');
}

function logout() {
  SESSION.currentUser = null;
  $('#app').classList.add('hidden');
  $('#auth-screen').classList.remove('hidden');
}

/* =================== SIDEBAR / TOPBAR =================== */
function renderSidebar() {
  const u = SESSION.currentUser;
  const groups = NAV_BY_ROLE[u.role] || NAV_BY_ROLE.student;
  const nav = $('#sidebar-nav');
  nav.innerHTML = '';
  groups.forEach(g => {
    if (g.group) nav.appendChild(el('div', { class: 'nav-group-label' }, g.group));
    g.items.forEach(item => {
      const btn = el('button', {
        class: 'nav-item' + (item.id === SESSION.currentPage ? ' active' : ''),
        'data-page': item.id,
        onClick: () => navigate(item.id),
      });
      btn.innerHTML = `${item.icon}<span>${item.label}</span>${item.badge ? `<span class="badge">${item.badge}</span>` : ''}`;
      nav.appendChild(btn);
    });
  });

  // sidebar user box
  $('#avatar-mini').textContent = initials(u.name);
  $('#um-name').textContent = u.name;
  $('#um-role').textContent = `${u.role[0].toUpperCase()}${u.role.slice(1)}${u.roll ? ' · ' + u.roll : ''}`;

  // logout
  $('#btn-logout').onclick = logout;
  $('#hamburger').onclick = () => $('#sidebar').classList.toggle('open');
}

function renderTopBar() {
  const u = SESSION.currentUser;
  $('#avatar-chip').textContent = initials(u.name);
  $('#uc-name').textContent = u.name;
  $('#uc-role').textContent = u.role[0].toUpperCase() + u.role.slice(1);

  // notif-count for current user
  const unread = DB.notifications.filter(n => n.userId === u.id && n.unread).length;
  $('#notif-dot').textContent = unread;
  $('#notif-dot').style.display = unread ? 'grid' : 'none';

  $('#btn-notifs').onclick = () => $('#notif-drawer').classList.toggle('open');
  $('#close-notifs').onclick = () => $('#notif-drawer').classList.remove('open');
}

function renderNotifs() {
  const u = SESSION.currentUser;
  const list = $('#nd-list');
  list.innerHTML = '';
  const mine = DB.notifications.filter(n => n.userId === u.id);
  if (mine.length === 0) {
    list.appendChild(el('div', { class: 'empty' },
      el('div', { class: 'empty-title' }, 'You\'re all caught up'),
      el('div', { class: 'empty-text' }, 'New notifications will show up here.'),
    ));
    return;
  }
  mine.forEach(n => {
    const item = el('div', { class: 'nd-item' + (n.unread ? ' unread' : '') });
    item.innerHTML = `
      <div class="nd-dot"></div>
      <div style="flex:1">
        <div class="nd-title">${n.title}</div>
        <div class="nd-msg">${n.msg}</div>
        <div class="nd-time">${n.time}</div>
      </div>`;
    item.addEventListener('click', () => {
      n.unread = false;
      renderNotifs();
      renderTopBar();
    });
    list.appendChild(item);
  });
}

/* =================== NAVIGATION =================== */
function navigate(page) {
  SESSION.currentPage = page;
  // update active sidebar
  $$('.nav-item').forEach(n => n.classList.toggle('active', n.dataset.page === page));
  // close mobile sidebar
  $('#sidebar').classList.remove('open');
  $('#notif-drawer').classList.remove('open');
  // render the page
  const container = $('#page-container');
  container.innerHTML = '';
  const pageEl = el('div', { class: 'page active', id: `page-${page}` });
  container.appendChild(pageEl);

  const u = SESSION.currentUser;
  const role = u.role;

  if (page === 'dashboard') return renderDashboard(pageEl, role);

  // role-specific pages
  if (role === 'student' || role === 'guest') {
    if (page === 'events') return renderAllEvents(pageEl);
    if (page === 'my-events') return renderMyEvents(pageEl);
    if (page === 'recommended') return renderRecommended(pageEl);
    if (page === 'leaderboard') return renderLeaderboard(pageEl);
    if (page === 'certificates') return renderCertificates(pageEl);
    if (page === 'gallery') return renderGallery(pageEl);
    if (page === 'external') return renderExternal(pageEl);
  }
  if (role === 'coordinator') {
    if (page === 'create') return renderCreateEvent(pageEl);
    if (page === 'my-events-c') return renderMyEventsCoord(pageEl);
    if (page === 'live') return renderLiveUpdates(pageEl);
    if (page === 'attendance') return renderAttendance(pageEl);
  }
  if (role === 'faculty') {
    if (page === 'pending') return renderPendingApprovals(pageEl);
    if (page === 'monitoring') return renderMonitoring(pageEl);
  }
  if (role === 'admin') {
    if (page === 'users') return renderUserMgmt(pageEl);
    if (page === 'all-events') return renderAllEventsAdmin(pageEl);
    if (page === 'clubs') return renderClubs(pageEl);
    if (page === 'reports') return renderReports(pageEl);
    if (page === 'activity') return renderActivity(pageEl);
  }

  pageEl.innerHTML = '<div class="empty"><div class="empty-title">Page coming soon</div><div class="empty-text">This section is being built in the next sprint.</div></div>';
}

/* =================== PAGE: DASHBOARD (per role) =================== */
function renderDashboard(root, role) {
  const u = SESSION.currentUser;

  // Greeting header
  const greeting = el('div', { class: 'page-head' });
  const greetText = `Hey ${u.name.split(' ')[0]} 👋`;
  const subMap = {
    student: `Here's what's happening at IIIT Surat today.`,
    coordinator: `Your events, your audience, your moment.`,
    faculty: `${eventsByStatus('pending').length} events are waiting for your review.`,
    admin: `Eventra is serving ${DB.users.length} users across ${DB.clubs.length} clubs.`,
    guest: `Welcome to IIIT Surat. Browse the events you've been invited to.`,
  };
  greeting.innerHTML = `
    <div>
      <h1 class="page-title">${greetText}</h1>
      <p class="page-sub">${subMap[role] || ''}</p>
    </div>
    ${role === 'coordinator' ? `<div class="page-head-actions"><button class="btn btn-primary" onclick="navigate('create')">+ Create Event</button></div>` : ''}
    ${role === 'admin' ? `<div class="page-head-actions"><button class="btn btn-ghost" onclick="navigate('reports')">Export Reports</button></div>` : ''}
  `;
  root.appendChild(greeting);

  // Stats per role
  root.appendChild(renderStatsGrid(role));

  // Content blocks per role
  if (role === 'student' || role === 'guest') {
    // Recommendation strip
    const reco = el('div', { class: 'reco-card section' });
    const recEvent = approvedEvents()[0];
    reco.innerHTML = `
      <div style="font-size: 32px;">✨</div>
      <div style="flex:1">
        <span class="ai-badge">★ AI RECOMMENDATION</span>
        <h3 style="margin: 8px 0 4px; font-size: 18px;">${recEvent.title}</h3>
        <p style="font-size: 13px; color: var(--text-dim); margin: 0;">Matched with your CSE profile · 98% match confidence</p>
      </div>
      <button class="btn btn-primary btn-sm" onclick="openEventModal('${recEvent.id}')">View</button>
    `;
    root.appendChild(reco);

    // Upcoming + side panel
    const grid = el('div', { class: 'dash-grid' });
    const leftCol = el('div');
    leftCol.appendChild(sectionHeader('Upcoming Events', 'events'));
    const evGrid = el('div', { class: 'events-grid' });
    approvedEvents().slice(0, 4).forEach(ev => evGrid.appendChild(eventCard(ev)));
    leftCol.appendChild(evGrid);
    grid.appendChild(leftCol);

    const rightCol = el('div');
    rightCol.appendChild(sectionHeader('🔴 Live Now'));
    const liveWrap = el('div', { class: 'live-feed' });
    DB.liveUpdates.filter(l => l.live).forEach(l => liveWrap.appendChild(liveItem(l)));
    rightCol.appendChild(liveWrap);

    rightCol.appendChild(sectionHeader('Your Rank'));
    const me = DB.leaderboard.find(l => l.me);
    rightCol.appendChild(el('div', { class: 'card', html: `
      <div style="display:flex; align-items:center; gap:14px;">
        <div class="lb-rank" style="width:56px;height:56px;font-size:22px;">#${me.rank}</div>
        <div style="flex:1">
          <div style="font-size:15px; font-weight:600;">${me.name}</div>
          <div style="font-size:12px; color: var(--text-muted);">${me.events} events · ${me.dept}</div>
        </div>
      </div>
      <div style="margin-top:16px; padding:14px; background: var(--bg-2); border-radius: 10px;">
        <div style="font-size:11px; color: var(--text-muted); text-transform:uppercase; letter-spacing:0.05em;">Total Points</div>
        <div class="lb-points" style="text-align:left; font-size:32px; margin-top:4px;">${me.points} pts</div>
      </div>
      <button class="btn btn-ghost btn-sm btn-full" style="margin-top:12px;" onclick="navigate('leaderboard')">View full leaderboard →</button>
    `}));
    grid.appendChild(rightCol);
    root.appendChild(grid);
  }

  if (role === 'coordinator') {
    root.appendChild(sectionHeader('Events You Manage', 'my-events-c'));
    const evGrid = el('div', { class: 'events-grid' });
    DB.events.slice(0, 4).forEach(ev => evGrid.appendChild(eventCardCoord(ev)));
    root.appendChild(evGrid);

    root.appendChild(sectionHeader('Recent Live Updates'));
    const liveWrap = el('div', { class: 'live-feed' });
    DB.liveUpdates.forEach(l => liveWrap.appendChild(liveItem(l)));
    root.appendChild(liveWrap);
  }

  if (role === 'faculty') {
    root.appendChild(sectionHeader('Pending Your Review', 'pending'));
    const pending = eventsByStatus('pending');
    if (pending.length === 0) {
      root.appendChild(el('div', { class: 'empty', html: '<div class="empty-title">All caught up!</div><div class="empty-text">No events are pending approval right now.</div>' }));
    } else {
      const evGrid = el('div', { class: 'events-grid' });
      pending.forEach(ev => evGrid.appendChild(eventCardApproval(ev)));
      root.appendChild(evGrid);
    }

    root.appendChild(sectionHeader('Recently Approved'));
    const recGrid = el('div', { class: 'events-grid' });
    eventsByStatus('approved').slice(0, 3).forEach(ev => recGrid.appendChild(eventCard(ev)));
    root.appendChild(recGrid);
  }

  if (role === 'admin') {
    const grid = el('div', { class: 'dash-grid' });
    const left = el('div');
    left.appendChild(sectionHeader('Events by Category'));
    left.appendChild(renderBarChart());
    left.appendChild(sectionHeader('Recent Activity', 'activity'));
    const actList = el('div', { class: 'reports-list' });
    DB.activityLog.slice(0, 5).forEach(a => {
      actList.appendChild(el('div', { class: 'report-item', html: `
        <div>
          <div class="ri-title">${a.actor} <span style="color: var(--text-muted); font-weight: 400;">${a.action}</span> <span style="color: var(--primary-hi);">${a.target}</span></div>
          <div class="ri-meta">Today at ${a.time}</div>
        </div>
      `}));
    });
    left.appendChild(actList);
    grid.appendChild(left);

    const right = el('div');
    right.appendChild(sectionHeader('Top Clubs'));
    const clubList = el('div', { class: 'clubs-grid' });
    DB.clubs.slice(0, 4).forEach(c => {
      clubList.appendChild(el('div', { class: 'club-card', html: `
        <div class="club-emoji">${c.emoji}</div>
        <div class="club-name">${c.name}</div>
        <div class="club-members">${c.members} members</div>
      `}));
    });
    right.appendChild(clubList);
    grid.appendChild(right);
    root.appendChild(grid);
  }
}

/* =================== STATS GRID PER ROLE =================== */
function renderStatsGrid(role) {
  const wrap = el('div', { class: 'stats-grid' });
  let stats = [];

  if (role === 'student' || role === 'guest') {
    stats = [
      { icon: ICON.ticket,    value: '3',  label: 'My Registrations', trend: '+1 this week' },
      { icon: ICON.calendar,  value: approvedEvents().length.toString(), label: 'Live Events', trend: 'All categories' },
      { icon: ICON.trophy,    value: '420', label: 'Your Points', trend: '↗ +85 this month' },
      { icon: ICON.award,     value: '2',  label: 'Certificates', trend: '1 pending' },
    ];
  }
  if (role === 'coordinator') {
    stats = [
      { icon: ICON.calendar,  value: '5',  label: 'My Events' },
      { icon: ICON.users,     value: '364', label: 'Registrations' },
      { icon: ICON.check,     value: '94%', label: 'Attendance Rate' },
      { icon: ICON.radio,     value: '4',   label: 'Live Updates' },
    ];
  }
  if (role === 'faculty') {
    stats = [
      { icon: ICON.shield,    value: eventsByStatus('pending').length.toString(), label: 'Pending Review', trend: 'needs attention' },
      { icon: ICON.check,     value: eventsByStatus('approved').length.toString(), label: 'Approved' },
      { icon: ICON.calendar,  value: DB.events.length.toString(), label: 'Total Events' },
      { icon: ICON.users,     value: '1,247', label: 'Total Attendees' },
    ];
  }
  if (role === 'admin') {
    stats = [
      { icon: ICON.users,     value: DB.users.length.toString(), label: 'Total Users', trend: '↗ +12 this week' },
      { icon: ICON.calendar,  value: DB.events.length.toString(), label: 'Total Events' },
      { icon: ICON.building,  value: DB.clubs.length.toString(), label: 'Active Clubs' },
      { icon: ICON.chart,     value: '₹2.4L', label: 'Revenue (YTD)', trend: '↗ 18%' },
    ];
  }

  stats.forEach(s => {
    wrap.appendChild(el('div', { class: 'stat-card', html: `
      <div class="sc-icon">${s.icon}</div>
      <div class="sc-value">${s.value}</div>
      <div class="sc-label">${s.label}</div>
      ${s.trend ? `<div class="sc-trend">${s.trend}</div>` : ''}
    `}));
  });
  return wrap;
}

function sectionHeader(title, linkPage) {
  const sec = el('div', { class: 'section-head' });
  sec.innerHTML = `
    <h2 class="section-title">${title}</h2>
    ${linkPage ? `<a class="section-link" onclick="navigate('${linkPage}')" style="cursor:pointer">View all →</a>` : ''}
  `;
  const wrap = el('div', { class: 'section' });
  wrap.appendChild(sec);
  return wrap;
}

/* =================== EVENT CARD =================== */
function eventCard(ev) {
  const card = el('div', { class: 'event-card', onClick: () => openEventModal(ev.id) });
  const priceHtml = ev.price > 0
    ? `<span class="event-price">₹${ev.price}</span>`
    : `<span class="event-price free">Free</span>`;
  card.innerHTML = `
    <div class="event-cover" style="background: var(--${ev.cover});">
      <span class="event-category-tag">${ev.category}</span>
      <span class="event-status-tag ${ev.status}">${ev.status}</span>
      <div class="event-cover-title">${ev.title.split(' ').slice(0, 4).join(' ')}</div>
    </div>
    <div class="event-body">
      <div class="event-club">${ev.club}</div>
      <div class="event-desc">${ev.description.slice(0, 110)}…</div>
      <div class="event-meta">
        <span>${iconSm('calendar')} ${fmtDateShort(ev.date)} · ${ev.time}</span>
        <span>${iconSm('map')} ${ev.venue.split(',')[0]}</span>
      </div>
    </div>
    <div class="event-foot">
      ${priceHtml}
      <span class="event-spots"><strong>${ev.capacity - ev.registered}</strong> spots left</span>
    </div>
  `;
  return card;
}

function iconSm(name) {
  return `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2">${
    name === 'calendar' ? '<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>'
    : name === 'map'    ? '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>'
    : name === 'users'  ? '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>'
    : '<circle cx="12" cy="12" r="10"/>'
  }</svg>`;
}

function eventCardCoord(ev) {
  const c = eventCard(ev);
  c.onclick = () => openEventModal(ev.id, { coordinator: true });
  return c;
}

function eventCardApproval(ev) {
  const card = el('div', { class: 'event-card' });
  card.innerHTML = `
    <div class="event-cover" style="background: var(--${ev.cover});">
      <span class="event-category-tag">${ev.category}</span>
      <span class="event-status-tag pending">Pending</span>
      <div class="event-cover-title">${ev.title.split(' ').slice(0, 4).join(' ')}</div>
    </div>
    <div class="event-body">
      <div class="event-club">${ev.club}</div>
      <div class="event-desc">${ev.description.slice(0, 100)}…</div>
      <div class="event-meta">
        <span>${iconSm('calendar')} ${fmtDateShort(ev.date)}</span>
        <span>${iconSm('map')} ${ev.venue.split(',')[0]}</span>
      </div>
    </div>
    <div class="event-foot" style="gap: 8px;">
      <button class="btn btn-success btn-sm" onclick="approveEvent('${ev.id}'); event.stopPropagation();">✓ Approve</button>
      <button class="btn btn-danger btn-sm" onclick="rejectEvent('${ev.id}'); event.stopPropagation();">✕ Reject</button>
    </div>
  `;
  return card;
}

/* =================== EVENT DETAIL MODAL =================== */
function openEventModal(id, opts = {}) {
  const ev = findEvent(id);
  if (!ev) return;
  const u = SESSION.currentUser;
  const isRegistered = DB.registrations.some(r => r.userId === u.id && r.eventId === id);

  const modal = el('div', { class: 'modal lg' });
  modal.innerHTML = `
    <div class="event-cover" style="background: var(--${ev.cover}); height: 200px; display: flex; align-items: flex-end; padding: 24px;">
      <span class="event-category-tag">${ev.category}</span>
      <div class="event-cover-title" style="font-size: 32px;">${ev.title}</div>
    </div>
    <div class="modal-body">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <div class="event-club" style="font-size: 14px;">${ev.club}</div>
        <span class="pill pill-${ev.status === 'approved' ? 'green' : ev.status === 'pending' ? 'amber' : 'red'}">${ev.status}</span>
      </div>
      <p style="color: var(--text-dim); line-height: 1.6;">${ev.description}</p>

      <div class="form-grid" style="margin-top: 20px;">
        <div><div style="font-size: 11px; color: var(--text-muted); text-transform: uppercase;">Date & Time</div><div style="font-weight: 600; margin-top: 4px;">${fmtDate(ev.date)} · ${ev.time}</div></div>
        <div><div style="font-size: 11px; color: var(--text-muted); text-transform: uppercase;">Venue</div><div style="font-weight: 600; margin-top: 4px;">${ev.venue}</div></div>
        <div><div style="font-size: 11px; color: var(--text-muted); text-transform: uppercase;">Capacity</div><div style="font-weight: 600; margin-top: 4px;">${ev.registered} / ${ev.capacity} registered</div></div>
        <div><div style="font-size: 11px; color: var(--text-muted); text-transform: uppercase;">Price</div><div style="font-weight: 600; margin-top: 4px;">${ev.price > 0 ? '₹ ' + ev.price : 'Free Entry'}</div></div>
      </div>

      ${ev.status === 'rejected' && ev.remarks ? `<div style="margin-top: 20px; padding: 14px; background: rgba(255, 93, 115, 0.1); border: 1px solid rgba(255, 93, 115, 0.3); border-radius: 12px;"><strong style="color: var(--danger);">Rejection reason:</strong><br/>${ev.remarks}</div>` : ''}

      <div style="margin-top: 20px; display: flex; gap: 8px; flex-wrap: wrap;">
        ${ev.tags.map(t => `<span class="meta-pill">#${t}</span>`).join('')}
      </div>
    </div>
    <div class="modal-foot">
      <button class="btn btn-ghost" onclick="closeModal()">Close</button>
      ${u.role === 'student' && ev.status === 'approved'
        ? (isRegistered
          ? `<button class="btn btn-success" onclick="viewTicket('${ev.id}')">View Ticket</button>`
          : `<button class="btn btn-primary" onclick="registerForEvent('${ev.id}')">${ev.price > 0 ? `Register — ₹${ev.price}` : 'Register Free'}</button>`)
        : ''}
      ${u.role === 'faculty' && ev.status === 'pending' ? `<button class="btn btn-danger" onclick="rejectEvent('${ev.id}')">Reject</button><button class="btn btn-success" onclick="approveEvent('${ev.id}')">Approve</button>` : ''}
      ${u.role === 'coordinator' ? `<button class="btn btn-ghost">Edit</button><button class="btn btn-primary" onclick="navigate('attendance')">View Attendance</button>` : ''}
      ${u.role === 'admin' ? `<button class="btn btn-ghost">Edit</button><button class="btn btn-danger" onclick="deleteEvent('${ev.id}')">Delete</button>` : ''}
    </div>
  `;
  showModal(modal);
}

function showModal(inner) {
  const root = $('#modal-root');
  root.innerHTML = '';
  root.appendChild(el('div', { class: 'modal-backdrop', onClick: closeModal }));
  root.appendChild(inner);
  root.classList.add('open');
}
function closeModal() { $('#modal-root').classList.remove('open'); $('#modal-root').innerHTML = ''; }

function registerForEvent(id) {
  const ev = findEvent(id);
  const u = SESSION.currentUser;
  DB.registrations.push({ id: 'r' + Date.now(), userId: u.id, eventId: id, status: 'confirmed', paid: ev.price > 0, registeredAt: new Date().toISOString().slice(0,10) });
  ev.registered++;
  DB.notifications.unshift({ id: 'n' + Date.now(), userId: u.id, title: 'Registration confirmed', msg: `You are registered for ${ev.title}.`, time: 'just now', unread: true, eventId: id });
  closeModal();
  toast(`Registered for ${ev.title.split(' ').slice(0, 3).join(' ')}!`, 'success');
  renderTopBar();
  renderNotifs();
  setTimeout(() => viewTicket(id), 300);
}

function viewTicket(id) {
  const ev = findEvent(id);
  const u = SESSION.currentUser;
  const modal = el('div', { class: 'modal' });
  modal.innerHTML = `
    <div class="modal-head"><h3>Your QR Ticket</h3><button class="icon-btn" onclick="closeModal()">✕</button></div>
    <div class="modal-body">
      <div class="qr-card" style="flex-direction: column; text-align: center; background: transparent; border: none; padding: 0;">
        <div class="qr-img">${makeQRSvg(`EVENTRA|${ev.id}|${u.id}`)}</div>
        <div class="qr-info">
          <h3 style="font-size: 20px; margin-top: 16px;">${ev.title}</h3>
          <div class="meta-row" style="justify-content: center;">
            <div><div class="m-key">Attendee</div><div class="m-val">${u.name}</div></div>
            <div><div class="m-key">Date</div><div class="m-val">${fmtDateShort(ev.date)}</div></div>
            <div><div class="m-key">Venue</div><div class="m-val">${ev.venue.split(',')[0]}</div></div>
          </div>
          <p style="margin-top: 14px; font-size: 12px; color: var(--text-muted);">Show this QR at the venue to check in</p>
        </div>
      </div>
    </div>
    <div class="modal-foot">
      <button class="btn btn-ghost" onclick="closeModal()">Close</button>
      <button class="btn btn-primary" onclick="toast('Ticket saved to wallet', 'success')">Add to Wallet</button>
    </div>
  `;
  showModal(modal);
}

function approveEvent(id) {
  const ev = findEvent(id);
  ev.status = 'approved';
  ev.approvedBy = SESSION.currentUser.id;
  closeModal();
  toast(`Approved: ${ev.title.split(' ').slice(0, 3).join(' ')}`, 'success');
  navigate(SESSION.currentPage);
}
function rejectEvent(id) {
  const reason = prompt('Reason for rejection:', 'Needs more details. Please resubmit.');
  if (!reason) return;
  const ev = findEvent(id);
  ev.status = 'rejected';
  ev.remarks = reason;
  closeModal();
  toast(`Rejected: ${ev.title.split(' ').slice(0, 3).join(' ')}`, 'error');
  navigate(SESSION.currentPage);
}
function deleteEvent(id) {
  if (!confirm('Delete this event permanently?')) return;
  const idx = DB.events.findIndex(e => e.id === id);
  if (idx !== -1) DB.events.splice(idx, 1);
  closeModal();
  toast('Event deleted', 'success');
  navigate(SESSION.currentPage);
}

/* =================== QR CODE GENERATOR (simple visual) =================== */
function makeQRSvg(text) {
  // Generate a pseudo-QR visual using a deterministic hash — looks like a real QR
  const size = 25;
  const cells = [];
  let h = 0;
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) | 0;
  const rand = () => { h = (h * 1103515245 + 12345) & 0x7fffffff; return h / 0x7fffffff; };
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) cells.push(rand() > 0.5 ? 1 : 0);
  }
  // Draw corner finder patterns
  const setFinder = (ox, oy) => {
    for (let y = 0; y < 7; y++) for (let x = 0; x < 7; x++) {
      const inside = (x >= 2 && x <= 4 && y >= 2 && y <= 4);
      const edge = (x === 0 || x === 6 || y === 0 || y === 6);
      cells[(oy + y) * size + ox + x] = (inside || edge) ? 1 : 0;
    }
  };
  setFinder(0, 0); setFinder(size - 7, 0); setFinder(0, size - 7);

  let rects = '';
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (cells[y * size + x]) rects += `<rect x="${x}" y="${y}" width="1" height="1"/>`;
    }
  }
  return `<svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">${rects}</svg>`;
}

/* =================== PAGE: ALL EVENTS =================== */
function renderAllEvents(root) {
  const head = el('div', { class: 'page-head' });
  head.innerHTML = `
    <div>
      <h1 class="page-title">All <span class="italic">Events</span></h1>
      <p class="page-sub">Everything happening on campus — filter by category or club.</p>
    </div>
  `;
  root.appendChild(head);

  // Filter bar
  const categories = ['All', 'Tech', 'Cultural', 'Sports', 'Workshop', 'Business', 'Arts', 'Talk', 'Literary'];
  const bar = el('div', { class: 'filter-bar' });
  bar.innerHTML = `
    <input type="text" id="evt-search" placeholder="Search events…" style="flex: 1; min-width: 200px;"/>
    <select id="evt-price">
      <option value="all">All prices</option>
      <option value="free">Free only</option>
      <option value="paid">Paid only</option>
    </select>
    <div class="filter-chips">
      ${categories.map((c, i) => `<button class="fchip ${i === 0 ? 'active' : ''}" data-cat="${c}">${c}</button>`).join('')}
    </div>
  `;
  root.appendChild(bar);

  const grid = el('div', { class: 'events-grid' });
  root.appendChild(grid);

  function apply() {
    const q = $('#evt-search').value.toLowerCase();
    const priceFilter = $('#evt-price').value;
    const cat = $$('.fchip').find(c => c.classList.contains('active'))?.dataset.cat || 'All';

    const filtered = approvedEvents().filter(ev => {
      if (cat !== 'All' && ev.category !== cat) return false;
      if (priceFilter === 'free' && ev.price > 0) return false;
      if (priceFilter === 'paid' && ev.price === 0) return false;
      if (q && !ev.title.toLowerCase().includes(q) && !ev.club.toLowerCase().includes(q)) return false;
      return true;
    });
    grid.innerHTML = '';
    if (filtered.length === 0) {
      grid.appendChild(el('div', { class: 'empty', html: '<div class="empty-title">No events match</div><div class="empty-text">Try clearing filters or searching for something else.</div>' }));
    } else {
      filtered.forEach(ev => grid.appendChild(eventCard(ev)));
    }
  }
  apply();

  $('#evt-search').addEventListener('input', apply);
  $('#evt-price').addEventListener('change', apply);
  $$('.fchip').forEach(c => c.addEventListener('click', () => {
    $$('.fchip').forEach(x => x.classList.remove('active'));
    c.classList.add('active');
    apply();
  }));
}

/* =================== PAGE: MY EVENTS =================== */
function renderMyEvents(root) {
  const u = SESSION.currentUser;
  root.appendChild(pageHead('My Events', 'Your registered events and tickets.'));
  const myRegs = DB.registrations.filter(r => r.userId === u.id);
  if (myRegs.length === 0) {
    root.appendChild(el('div', { class: 'empty', html: '<div class="empty-title">No registrations yet</div><div class="empty-text">Browse events and register to see them here.</div>' }));
    return;
  }
  const grid = el('div', { class: 'events-grid' });
  myRegs.forEach(r => {
    const ev = findEvent(r.eventId);
    if (!ev) return;
    const c = eventCard(ev);
    // add ticket button
    const foot = c.querySelector('.event-foot');
    foot.innerHTML = `<span class="pill pill-${r.status === 'attended' ? 'green' : 'violet'}">${r.status}</span>
      <button class="btn btn-primary btn-xs" onclick="viewTicket('${ev.id}'); event.stopPropagation();">View QR</button>`;
    grid.appendChild(c);
  });
  root.appendChild(grid);
}

/* =================== PAGE: RECOMMENDED =================== */
function renderRecommended(root) {
  root.appendChild(pageHead('For You', 'AI-curated based on your department, past events and interests.'));
  const reco = el('div', { class: 'reco-card', style: 'margin-bottom: 28px;' });
  reco.innerHTML = `
    <div style="font-size: 40px;">🧠</div>
    <div style="flex:1">
      <span class="ai-badge">★ EVENTRA AI · v1.3</span>
      <h3 style="margin: 8px 0 4px; font-size: 20px;">Based on your CSE profile and past attendance</h3>
      <p style="margin: 0; color: var(--text-dim); font-size: 13px;">We found ${approvedEvents().length} events likely to interest you, ranked by match confidence.</p>
    </div>
  `;
  root.appendChild(reco);
  const grid = el('div', { class: 'events-grid' });
  const scored = approvedEvents()
    .filter(e => ['Tech', 'Workshop', 'Business', 'Talk'].includes(e.category))
    .slice(0, 6);
  scored.forEach(ev => grid.appendChild(eventCard(ev)));
  root.appendChild(grid);
}

/* =================== PAGE: LEADERBOARD =================== */
function renderLeaderboard(root) {
  root.appendChild(pageHead('Leaderboard', 'Top participants this academic year — points earned by attending, winning and giving feedback.'));
  const wrap = el('div', { class: 'lb-wrap' });
  DB.leaderboard.forEach(l => {
    wrap.appendChild(el('div', { class: `lb-row rank-${l.rank} ${l.me ? 'me' : ''}`, html: `
      <div class="lb-rank">${l.rank <= 3 ? ['🥇','🥈','🥉'][l.rank-1] : l.rank}</div>
      <div>
        <div class="lb-name">${l.name}${l.me ? ' <span class="pill pill-violet" style="font-size:10px;">YOU</span>' : ''}</div>
        <div class="lb-dept">${l.dept}</div>
      </div>
      <div class="lb-events">${l.events} events attended</div>
      <div class="lb-points">${l.points}</div>
    `}));
  });
  root.appendChild(wrap);
}

/* =================== PAGE: CERTIFICATES =================== */
function renderCertificates(root) {
  const u = SESSION.currentUser;
  root.appendChild(pageHead('Your Certificates', 'Automatically generated after events you attended. Download as PDF.'));
  const attended = DB.registrations.filter(r => r.userId === u.id && r.status === 'attended');
  if (attended.length === 0) {
    // fallback demo
    const ev = findEvent('e3');
    root.appendChild(buildCert(u.name, ev));
  } else {
    attended.forEach(r => root.appendChild(buildCert(u.name, findEvent(r.eventId))));
  }

  function buildCert(name, ev) {
    const wrap = el('div', { style: 'margin-bottom: 24px;' });
    const cert = el('div', { class: 'cert-card' });
    cert.innerHTML = `
      <div class="cert-sub">Certificate of Participation</div>
      <p style="color: rgba(255,255,255,0.7); margin: 0;">This is to certify that</p>
      <div class="cert-name">${name}</div>
      <p class="cert-body">has successfully participated in <span class="cert-event">${ev.title}</span>, organized by ${ev.club} at Indian Institute of Information Technology, Surat on ${fmtDate(ev.date)}.</p>
      <div class="cert-foot">
        <div class="sign">
          <strong>Dr. Trupti Gondaliya</strong><br/>
          <span style="color: rgba(255,255,255,0.7);">Faculty Coordinator · CSE</span>
        </div>
        <div class="sign">
          <strong>Eventra</strong><br/>
          <span style="color: rgba(255,255,255,0.7);">Cert ID: EVT-${ev.id.toUpperCase()}-${u.id.toUpperCase()}</span>
        </div>
      </div>
    `;
    wrap.appendChild(cert);
    wrap.appendChild(el('div', { style: 'display:flex; justify-content: flex-end; gap: 8px; margin-top: 12px;', html: `
      <button class="btn btn-ghost btn-sm" onclick="toast('Preview opened in new tab', 'success')">Preview</button>
      <button class="btn btn-primary btn-sm" onclick="toast('Certificate downloaded as PDF', 'success')">↓ Download PDF</button>
    `}));
    return wrap;
  }
}

/* =================== PAGE: GALLERY =================== */
function renderGallery(root) {
  root.appendChild(pageHead('Event Gallery', 'Memories from past editions. Click any thumbnail to view the full album.'));
  const grid = el('div', { class: 'gallery-grid' });
  DB.gallery.forEach(g => {
    grid.appendChild(el('div', { class: 'gallery-item', onClick: () => toast(`Opening album: ${g.title}`) , html: `
      <div class="g-cover" style="background: var(--${g.cover}); width: 100%; height: 100%;"></div>
      <div class="g-overlay">
        <div>
          <div class="g-title">${g.title}</div>
          <div class="g-date">${g.date}</div>
        </div>
      </div>
    `}));
  });
  root.appendChild(grid);
}

/* =================== PAGE: EXTERNAL COLLEGE EVENTS =================== */
function renderExternal(root) {
  root.appendChild(pageHead('Other College Events', 'Discover events at IITs, BITS, other IIITs and beyond.'));
  const grid = el('div', { class: 'events-grid' });
  DB.externalEvents.forEach((e, i) => {
    const covers = ['grad-cover-1', 'grad-cover-3', 'grad-cover-4', 'grad-cover-5'];
    grid.appendChild(el('div', { class: 'event-card', html: `
      <div class="event-cover" style="background: var(--${covers[i % 4]});">
        <span class="event-category-tag">External</span>
        <div class="event-cover-title">${e.event}</div>
      </div>
      <div class="event-body">
        <div class="event-club">${e.college}</div>
        <div class="event-meta"><span>${iconSm('calendar')} ${fmtDate(e.date)}</span></div>
      </div>
      <div class="event-foot">
        <span class="pill pill-blue">External</span>
        <a class="btn btn-primary btn-xs" href="${e.url}" target="_blank" rel="noopener">Visit site ↗</a>
      </div>
    `}));
  });
  root.appendChild(grid);
}

/* =================== PAGE: CREATE EVENT (coordinator) =================== */
function renderCreateEvent(root) {
  root.appendChild(pageHead('Create Event', 'Submit a new event for faculty approval. Takes ~2 minutes.'));
  const form = el('form', { class: 'card', style: 'padding: 28px;' });
  form.innerHTML = `
    <div class="form-grid">
      <div class="field span-2">
        <label>Event Title</label>
        <input type="text" id="ce-title" placeholder="e.g. Winter Hackathon 2026" required/>
      </div>
      <div class="field">
        <label>Category</label>
        <select id="ce-cat">
          <option>Tech</option><option>Cultural</option><option>Sports</option>
          <option>Workshop</option><option>Business</option><option>Arts</option>
          <option>Talk</option><option>Literary</option>
        </select>
      </div>
      <div class="field">
        <label>Organizing Club</label>
        <select id="ce-club">${DB.clubs.map(c => `<option>${c.name}</option>`).join('')}</select>
      </div>
      <div class="field">
        <label>Date</label>
        <input type="date" id="ce-date" required/>
      </div>
      <div class="field">
        <label>Time</label>
        <input type="time" id="ce-time" required/>
      </div>
      <div class="field">
        <label>Venue</label>
        <input type="text" id="ce-venue" placeholder="e.g. Central Auditorium"/>
      </div>
      <div class="field">
        <label>Capacity</label>
        <input type="number" id="ce-cap" value="100" min="1"/>
      </div>
      <div class="field">
        <label>Price (₹) — leave 0 for free</label>
        <input type="number" id="ce-price" value="0" min="0"/>
      </div>
      <div class="field">
        <label>Poster Theme</label>
        <select id="ce-cover">
          <option value="grad-cover-1">Indigo Flame</option>
          <option value="grad-cover-2">Emerald Dawn</option>
          <option value="grad-cover-3">Magenta Sunset</option>
          <option value="grad-cover-4">Electric Deep</option>
          <option value="grad-cover-5">Forest Glow</option>
          <option value="grad-cover-6">Amber Rush</option>
        </select>
      </div>
      <div class="field span-2">
        <label>Description</label>
        <textarea id="ce-desc" placeholder="What makes this event special?" required></textarea>
        <span class="field-hint">Include prize pool, speakers, rules — anything students should know.</span>
      </div>
    </div>
    <div style="display:flex; justify-content: flex-end; gap: 10px; margin-top: 20px;">
      <button type="button" class="btn btn-ghost" onclick="navigate('dashboard')">Cancel</button>
      <button type="submit" class="btn btn-primary">Submit for Approval</button>
    </div>
  `;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const newEvent = {
      id: 'e' + Date.now(),
      title: $('#ce-title').value,
      club: $('#ce-club').value,
      clubId: null,
      category: $('#ce-cat').value,
      description: $('#ce-desc').value,
      date: $('#ce-date').value,
      time: $('#ce-time').value,
      venue: $('#ce-venue').value,
      capacity: parseInt($('#ce-cap').value),
      registered: 0,
      price: parseInt($('#ce-price').value),
      status: 'pending',
      createdBy: SESSION.currentUser.id,
      approvedBy: null,
      cover: $('#ce-cover').value,
      tags: ['new'],
    };
    DB.events.unshift(newEvent);
    toast('Event submitted for faculty approval!', 'success');
    navigate('my-events-c');
  });
  root.appendChild(form);
}

/* =================== PAGE: MY EVENTS (COORDINATOR) =================== */
function renderMyEventsCoord(root) {
  root.appendChild(pageHead('My Events', 'Events you have created or manage.'));
  const grid = el('div', { class: 'events-grid' });
  DB.events.forEach(ev => grid.appendChild(eventCardCoord(ev)));
  root.appendChild(grid);
}

/* =================== PAGE: LIVE UPDATES =================== */
function renderLiveUpdates(root) {
  root.appendChild(pageHead('Live Updates', 'Post real-time announcements during your events.'));

  const postCard = el('div', { class: 'card', style: 'margin-bottom: 24px;' });
  postCard.innerHTML = `
    <div style="display:flex; gap: 10px; align-items: flex-end;">
      <div class="field" style="flex: 1;">
        <label>Post live update</label>
        <textarea id="lu-msg" placeholder="What's happening right now?" style="min-height: 60px;"></textarea>
      </div>
      <button class="btn btn-primary" id="lu-post">Post Update</button>
    </div>
  `;
  root.appendChild(postCard);

  const feed = el('div', { class: 'live-feed' });
  DB.liveUpdates.forEach(l => feed.appendChild(liveItem(l)));
  root.appendChild(feed);

  $('#lu-post').addEventListener('click', () => {
    const v = $('#lu-msg').value.trim();
    if (!v) return;
    DB.liveUpdates.unshift({
      id: 'l' + Date.now(), eventId: 'e1', event: 'Hackathon 3.0',
      msg: v, icon: '📢', time: 'just now', live: true
    });
    $('#lu-msg').value = '';
    toast('Update posted live!', 'success');
    navigate('live');
  });
}

function liveItem(l) {
  return el('div', { class: 'live-item', html: `
    <div class="l-icon">${l.icon}</div>
    <div>
      <div class="l-event">${l.event}</div>
      <div class="l-msg">${l.msg}</div>
    </div>
    <div style="text-align: right;">
      ${l.live ? '<span class="live-badge">LIVE</span><br/>' : ''}
      <span class="l-time">${l.time}</span>
    </div>
  `});
}

/* =================== PAGE: ATTENDANCE =================== */
function renderAttendance(root) {
  root.appendChild(pageHead('Attendance — Hackathon 3.0', 'Display the QR for students to scan, or scan their QR to mark attendance.'));

  const attHead = el('div', { class: 'att-head' });
  attHead.innerHTML = `
    <div>
      <strong style="font-size: 18px;">${DB.attendance.filter(a => a.checkedIn).length} / ${DB.attendance.length}</strong>
      <span style="color: var(--text-muted); margin-left: 6px;">checked in</span>
    </div>
    <div style="display: flex; gap: 8px;">
      <button class="btn btn-ghost btn-sm" onclick="exportCSV()">↓ Export CSV</button>
      <button class="btn btn-primary btn-sm" onclick="showScanQR()">Scan Student QR</button>
    </div>
  `;
  root.appendChild(attHead);

  const qrCard = el('div', { class: 'qr-card', style: 'margin-bottom: 24px;' });
  qrCard.innerHTML = `
    <div class="qr-img">${makeQRSvg('EVENTRA|e1|check-in')}</div>
    <div class="qr-info" style="flex: 1;">
      <h3>Event Check-in QR</h3>
      <p style="color: var(--text-dim); font-size: 14px;">Students scan this QR to mark their attendance. Refresh every 5 minutes for security.</p>
      <div class="meta-row">
        <div><div class="m-key">Event</div><div class="m-val">Hackathon 3.0</div></div>
        <div><div class="m-key">Capacity</div><div class="m-val">${DB.attendance.length}</div></div>
        <div><div class="m-key">Code expires</div><div class="m-val">In 4:32</div></div>
      </div>
      <div style="display: flex; gap: 8px; margin-top: 14px;">
        <button class="btn btn-primary btn-sm">Refresh QR</button>
        <button class="btn btn-ghost btn-sm">Display Fullscreen</button>
      </div>
    </div>
  `;
  root.appendChild(qrCard);

  const tbl = el('div', { class: 'table-wrap' });
  tbl.innerHTML = `
    <table class="tbl">
      <thead><tr><th>Roll No</th><th>Name</th><th>Status</th><th>Time</th><th></th></tr></thead>
      <tbody>
        ${DB.attendance.map(a => `
          <tr>
            <td><code style="font-family: var(--font-mono); font-size: 12px;">${a.roll}</code></td>
            <td>${a.name}</td>
            <td>${a.checkedIn ? '<span class="pill pill-green">✓ Present</span>' : '<span class="pill pill-grey">Not yet</span>'}</td>
            <td style="font-family: var(--font-mono); font-size: 12px;">${a.time}</td>
            <td>${!a.checkedIn ? `<button class="btn btn-xs btn-ghost" onclick="markPresent('${a.userId}')">Mark Present</button>` : ''}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
  root.appendChild(tbl);
}

function markPresent(uid) {
  const a = DB.attendance.find(x => x.userId === uid);
  if (!a) return;
  a.checkedIn = true;
  a.time = new Date().toTimeString().slice(0, 5);
  toast(`${a.name} marked present`, 'success');
  navigate('attendance');
}

function showScanQR() {
  const modal = el('div', { class: 'modal' });
  modal.innerHTML = `
    <div class="modal-head"><h3>Scan Student QR</h3><button class="icon-btn" onclick="closeModal()">✕</button></div>
    <div class="modal-body" style="text-align: center;">
      <div style="width: 280px; height: 280px; background: var(--bg-1); border: 2px dashed var(--border-hi); border-radius: 14px; margin: 0 auto; display: grid; place-items: center; position: relative; overflow: hidden;">
        <div style="position: absolute; inset: 20px; border: 3px solid var(--primary); border-radius: 12px; box-shadow: 0 0 20px var(--primary-glow);"></div>
        <span style="color: var(--text-muted); font-size: 13px; z-index: 1;">📷 Camera view (demo)</span>
        <div style="position: absolute; left: 20px; right: 20px; height: 2px; background: var(--primary); box-shadow: 0 0 10px var(--primary); top: 50%; animation: scan 2s infinite;"></div>
      </div>
      <p style="margin-top: 16px; color: var(--text-dim); font-size: 13px;">Point camera at student's QR ticket</p>
    </div>
    <div class="modal-foot">
      <button class="btn btn-ghost" onclick="closeModal()">Close</button>
      <button class="btn btn-primary" onclick="simulateScan()">Simulate Successful Scan</button>
    </div>
    <style>@keyframes scan { 0%,100%{top:20px;} 50%{top:calc(100% - 22px);} }</style>
  `;
  showModal(modal);
}
function simulateScan() {
  const a = DB.attendance.find(x => !x.checkedIn);
  if (a) markPresent(a.userId);
  closeModal();
}
function exportCSV() {
  const rows = [['Roll', 'Name', 'Status', 'Time'], ...DB.attendance.map(a => [a.roll, a.name, a.checkedIn ? 'Present' : 'Absent', a.time])];
  const csv = rows.map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'attendance.csv'; a.click();
  URL.revokeObjectURL(url);
  toast('Attendance exported as CSV', 'success');
}

/* =================== PAGE: PENDING APPROVALS =================== */
function renderPendingApprovals(root) {
  root.appendChild(pageHead('Pending Approvals', 'Review event submissions before they go live to students.'));
  const pending = eventsByStatus('pending');
  if (pending.length === 0) {
    root.appendChild(el('div', { class: 'empty', html: '<div class="empty-title">All caught up!</div><div class="empty-text">No events pending approval right now.</div>' }));
    return;
  }
  const grid = el('div', { class: 'events-grid' });
  pending.forEach(ev => grid.appendChild(eventCardApproval(ev)));
  root.appendChild(grid);
}

/* =================== PAGE: MONITORING (faculty) =================== */
function renderMonitoring(root) {
  root.appendChild(pageHead('Event Monitoring', 'Oversight of all events across the platform.'));
  root.appendChild(renderBarChart());
  root.appendChild(sectionHeader('Recently Approved'));
  const grid = el('div', { class: 'events-grid' });
  eventsByStatus('approved').slice(0, 6).forEach(ev => grid.appendChild(eventCard(ev)));
  root.appendChild(grid);
}

/* =================== PAGE: USER MGMT (admin) =================== */
function renderUserMgmt(root) {
  root.appendChild(pageHead('User Management', 'All registered users across Eventra.'));
  const tbl = el('div', { class: 'table-wrap' });
  tbl.innerHTML = `
    <table class="tbl">
      <thead><tr><th>User</th><th>Email</th><th>Role</th><th>Department</th><th>Points</th><th></th></tr></thead>
      <tbody>
        ${DB.users.map(u => `
          <tr>
            <td style="display: flex; align-items: center; gap: 10px;"><div class="avatar sm">${initials(u.name)}</div>${u.name}</td>
            <td style="font-family: var(--font-mono); font-size: 12px;">${u.email}</td>
            <td><span class="pill pill-${roleColor(u.role)}">${u.role}</span></td>
            <td>${u.dept}</td>
            <td>${u.points || '—'}</td>
            <td>
              <button class="btn btn-xs btn-ghost">Edit</button>
              <button class="btn btn-xs btn-ghost">Suspend</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
  root.appendChild(tbl);
}
function roleColor(r) {
  return { student: 'blue', coordinator: 'violet', faculty: 'amber', admin: 'red', guest: 'grey' }[r] || 'grey';
}

/* =================== PAGE: ALL EVENTS (admin) =================== */
function renderAllEventsAdmin(root) {
  root.appendChild(pageHead('All Events', 'Every event across every status.'));
  const grid = el('div', { class: 'events-grid' });
  DB.events.forEach(ev => grid.appendChild(eventCard(ev)));
  root.appendChild(grid);
}

/* =================== PAGE: CLUBS =================== */
function renderClubs(root) {
  root.appendChild(pageHead('Clubs & Societies', 'Manage all student clubs at IIIT Surat.'));
  const grid = el('div', { class: 'clubs-grid' });
  DB.clubs.forEach(c => {
    grid.appendChild(el('div', { class: 'club-card', html: `
      <div class="club-emoji">${c.emoji}</div>
      <div class="club-name">${c.name}</div>
      <div class="club-members">${c.members} members</div>
      <div style="margin-top: 10px;"><span class="pill pill-violet">${c.category}</span></div>
    `}));
  });
  root.appendChild(grid);
}

/* =================== PAGE: REPORTS =================== */
function renderReports(root) {
  root.appendChild(pageHead('Reports & Analytics', 'Download pre-generated reports or build custom ones.'));
  const list = el('div', { class: 'reports-list' });
  DB.reports.forEach(r => {
    list.appendChild(el('div', { class: 'report-item', html: `
      <div>
        <div class="ri-title">${r.title}</div>
        <div class="ri-meta">Generated ${fmtDate(r.gen)} · ${r.size} · ${r.type}</div>
      </div>
      <div style="display: flex; gap: 8px;">
        <button class="btn btn-xs btn-ghost" onclick="toast('Opening preview…')">Preview</button>
        <button class="btn btn-xs btn-primary" onclick="toast('Report downloaded', 'success')">↓ Download</button>
      </div>
    `}));
  });
  root.appendChild(list);
}

/* =================== PAGE: ACTIVITY LOG =================== */
function renderActivity(root) {
  root.appendChild(pageHead('System Activity', 'Real-time log of actions across Eventra.'));
  const tbl = el('div', { class: 'table-wrap' });
  tbl.innerHTML = `
    <table class="tbl">
      <thead><tr><th>Time</th><th>Actor</th><th>Action</th><th>Target</th></tr></thead>
      <tbody>
        ${DB.activityLog.map(a => `
          <tr>
            <td style="font-family: var(--font-mono); font-size: 12px; color: var(--text-muted);">${a.time}</td>
            <td>${a.actor}</td>
            <td><span class="pill pill-violet">${a.action}</span></td>
            <td>${a.target}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
  root.appendChild(tbl);
}

/* =================== HELPERS =================== */
function pageHead(title, sub) {
  const wrap = el('div', { class: 'page-head' });
  wrap.innerHTML = `
    <div>
      <h1 class="page-title">${title}</h1>
      <p class="page-sub">${sub}</p>
    </div>
  `;
  return wrap;
}

function renderBarChart() {
  const cats = {};
  DB.events.forEach(e => { cats[e.category] = (cats[e.category] || 0) + 1; });
  const max = Math.max(...Object.values(cats));
  const card = el('div', { class: 'chart-card' });
  const bars = el('div', { class: 'bar-chart' });
  Object.entries(cats).forEach(([cat, count]) => {
    const col = el('div', { class: 'bar-col', html: `
      <div class="bar-value">${count}</div>
      <div class="bar" style="height: ${(count / max) * 180}px;"></div>
      <div class="bar-label">${cat}</div>
    `});
    bars.appendChild(col);
  });
  card.appendChild(bars);
  return card;
}

/* =================== CHATBOT =================== */
function initChatbot() {
  $('#chatbot-fab').addEventListener('click', () => {
    $('#chatbot-panel').classList.toggle('open');
  });
  $('#close-chatbot').addEventListener('click', () => {
    $('#chatbot-panel').classList.remove('open');
  });
  $('#cb-form').addEventListener('submit', e => {
    e.preventDefault();
    sendChatbotMsg($('#cb-text').value);
  });
  $$('.cb-chip').forEach(c => c.addEventListener('click', () => sendChatbotMsg(c.dataset.q)));
}

function sendChatbotMsg(msg) {
  if (!msg.trim()) return;
  const body = $('#cb-body');
  body.appendChild(el('div', { class: 'cb-msg user' }, msg));
  $('#cb-text').value = '';
  body.scrollTop = body.scrollHeight;

  setTimeout(() => {
    const match = CHATBOT_KB.find(k => k.q.test(msg));
    const reply = match
      ? match.a
      : `Thanks for asking! I can help with registration, payments, QR attendance, certificates, points and more. Try one of these: "How do I register?", "Where's my certificate?", "How do payments work?"`;
    const b = el('div', { class: 'cb-msg bot' });
    b.innerHTML = reply;
    body.appendChild(b);
    body.scrollTop = body.scrollHeight;
  }, 500);
}

/* =================== THEME TOGGLE =================== */
function initTheme() {
  $('#btn-theme').addEventListener('click', () => {
    document.documentElement.classList.toggle('light');
    toast(document.documentElement.classList.contains('light') ? 'Light mode' : 'Dark mode');
  });
}
