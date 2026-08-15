/* ============================================================
   EVENTRA · Sample Data Store
   All in-memory demo data for the system.
   In production, swap these for REST API calls.
   ============================================================ */

// Global app state
const DB = {

  /* ----- USERS (pre-filled credentials for all roles) ----- */
  users: [
    { id: 'u1', name: 'Arun Kumar',        email: 'arun@iiitsurat.ac.in',   role: 'student',     dept: 'CSE · UI24CS11', roll: 'UI24CS11', points: 420, joined: '2024-08-15' },
    { id: 'u2', name: 'Rushikesh Kardile', email: 'rushi@iiitsurat.ac.in',  role: 'student',     dept: 'CSE · UI24CS39', roll: 'UI24CS39', points: 580, joined: '2024-08-15' },
    { id: 'u3', name: 'Amresh Kumar',      email: 'amresh@iiitsurat.ac.in', role: 'student',     dept: 'CSE · UI24CS09', roll: 'UI24CS09', points: 510, joined: '2024-08-15' },
    { id: 'u4', name: 'Ronit Chaudhary',   email: 'ronit@iiitsurat.ac.in',  role: 'coordinator', dept: 'LCS Club Lead',   points: 0, joined: '2023-07-20' },
    { id: 'u5', name: 'Dr. Trupti Gondaliya', email: 'trupti@iiitsurat.ac.in', role: 'faculty',  dept: 'CSE · Assistant Professor', points: 0, joined: '2020-01-01' },
    { id: 'u6', name: 'Sakil Sindhi',      email: 'sakil@iiitsurat.ac.in',  role: 'admin',       dept: 'System Administrator', points: 0, joined: '2021-05-10' },
    { id: 'u7', name: 'Ashiwini Gautam',   email: 'guest@external.com',     role: 'guest',       dept: 'Invited Guest — IIT Bombay', points: 0, joined: '2026-04-01' },
    { id: 'u8', name: 'Priya Sharma',      email: 'priya@iiitsurat.ac.in',  role: 'student',     dept: 'ECE · UI24EC23', roll: 'UI24EC23', points: 380, joined: '2024-08-15' },
    { id: 'u9', name: 'Karan Patel',       email: 'karan@iiitsurat.ac.in',  role: 'student',     dept: 'CSE · UI24CS28', roll: 'UI24CS28', points: 650, joined: '2024-08-15' },
    { id: 'u10', name: 'Sneha Reddy',      email: 'sneha@iiitsurat.ac.in',  role: 'student',     dept: 'ECE · UI24EC12', roll: 'UI24EC12', points: 470, joined: '2024-08-15' },
  ],

  /* ----- CLUBS (from IIIT Surat) ----- */
  clubs: [
    { id: 'c1', name: 'LCS — Learn Code Solve', emoji: '💻', members: 245, category: 'Tech' },
    { id: 'c2', name: 'GDG — Google Developer Groups', emoji: '🚀', members: 180, category: 'Tech' },
    { id: 'c3', name: 'Saras — Cultural Committee', emoji: '🎭', members: 320, category: 'Cultural' },
    { id: 'c4', name: 'Indominus — Sports Club', emoji: '⚽', members: 210, category: 'Sports' },
    { id: 'c5', name: 'Ruminate — E-Cell', emoji: '💡', members: 140, category: 'Business' },
    { id: 'c6', name: 'CineWorks — Photography Club', emoji: '📸', members: 95, category: 'Arts' },
    { id: 'c7', name: 'Hindi Cell', emoji: '📚', members: 110, category: 'Literary' },
    { id: 'c8', name: 'Robotics Club', emoji: '🤖', members: 130, category: 'Tech' },
  ],

  /* ----- EVENTS (8+ IIIT Surat events) ----- */
  events: [
    {
      id: 'e1',
      title: 'Hackathon 3.0 — Build for Bharat',
      club: 'LCS — Learn Code Solve',
      clubId: 'c1',
      category: 'Tech',
      description: '36-hour national-level hackathon. Build innovative solutions for problems facing India — from agritech to accessibility. ₹1L prize pool, industry mentors.',
      date: '2026-05-02',
      time: '09:00',
      venue: 'Central Auditorium + Lab Block',
      capacity: 200,
      registered: 164,
      price: 199,
      status: 'approved',
      createdBy: 'u4',
      approvedBy: 'u5',
      cover: 'grad-cover-1',
      tags: ['flagship', 'hackathon', 'prizes'],
    },
    {
      id: 'e2',
      title: 'Spring Fiesta · Saanjh 2026',
      club: 'Saras — Cultural Committee',
      clubId: 'c3',
      category: 'Cultural',
      description: 'Our annual cultural extravaganza. DJ night, celebrity performance, food stalls, and 20+ cultural competitions across music, dance and theatre.',
      date: '2026-04-28',
      time: '17:30',
      venue: 'Main Ground + Open Air Theatre',
      capacity: 1200,
      registered: 890,
      price: 299,
      status: 'approved',
      createdBy: 'u4',
      approvedBy: 'u5',
      cover: 'grad-cover-3',
      tags: ['flagship', 'cultural'],
    },
    {
      id: 'e3',
      title: 'AI & ML Workshop — Production RAG Systems',
      club: 'GDG — Google Developer Groups',
      clubId: 'c2',
      category: 'Workshop',
      description: 'Hands-on session on building production-grade RAG pipelines using LangChain, vector DBs, and Gemini. Bring your laptop.',
      date: '2026-04-25',
      time: '14:00',
      venue: 'Lab 2, Academic Block',
      capacity: 60,
      registered: 52,
      price: 0,
      status: 'approved',
      createdBy: 'u4',
      approvedBy: 'u5',
      cover: 'grad-cover-4',
      tags: ['workshop', 'ai'],
    },
    {
      id: 'e4',
      title: 'Prakash Memorial — Inter-IIIT Football Championship',
      club: 'Indominus — Sports Club',
      clubId: 'c4',
      category: 'Sports',
      description: '8 IIITs compete for the Prakash Memorial trophy. Cheer for IIIT Surat at the home ground!',
      date: '2026-05-10',
      time: '08:00',
      venue: 'Main Sports Ground',
      capacity: 500,
      registered: 312,
      price: 0,
      status: 'approved',
      createdBy: 'u4',
      approvedBy: 'u5',
      cover: 'grad-cover-5',
      tags: ['sports', 'tournament'],
    },
    {
      id: 'e5',
      title: 'Entrepreneur Summit 2026',
      club: 'Ruminate — E-Cell',
      clubId: 'c5',
      category: 'Business',
      description: 'Fireside chats with founders, pitch competition with ₹2L seed funding for winner, and startup expo.',
      date: '2026-05-15',
      time: '10:00',
      venue: 'Conference Hall A',
      capacity: 250,
      registered: 98,
      price: 149,
      status: 'pending',
      createdBy: 'u4',
      approvedBy: null,
      cover: 'grad-cover-6',
      tags: ['business', 'pitching'],
    },
    {
      id: 'e6',
      title: 'Photography Walk — Old Surat City',
      club: 'CineWorks — Photography Club',
      clubId: 'c6',
      category: 'Arts',
      description: 'Sunrise walk through the old city — textile mills, the Tapi riverfront and heritage lanes. Bring any camera, even phones.',
      date: '2026-04-27',
      time: '05:30',
      venue: 'Meet at Main Gate',
      capacity: 30,
      registered: 24,
      price: 0,
      status: 'approved',
      createdBy: 'u4',
      approvedBy: 'u5',
      cover: 'grad-cover-2',
      tags: ['photography', 'outdoor'],
    },
    {
      id: 'e7',
      title: 'Guest Lecture — Dr. Ashiwini Gautam (IIT Bombay)',
      club: 'CSE Department',
      clubId: null,
      category: 'Talk',
      description: 'Distinguished talk on "The Next Decade of Distributed Systems" by Dr. Ashiwini Gautam, Professor at IIT Bombay.',
      date: '2026-04-22',
      time: '11:30',
      venue: 'Seminar Hall',
      capacity: 120,
      registered: 78,
      price: 0,
      status: 'approved',
      createdBy: 'u4',
      approvedBy: 'u5',
      cover: 'grad-cover-4',
      tags: ['lecture', 'guest'],
    },
    {
      id: 'e8',
      title: 'Hindi Pakhwada — Poetry & Elocution',
      club: 'Hindi Cell',
      clubId: 'c7',
      category: 'Literary',
      description: 'Two-week celebration of Hindi literature. Poetry recitation, debates, and a literary quiz with book prizes.',
      date: '2026-05-06',
      time: '16:00',
      venue: 'Lecture Hall 3',
      capacity: 80,
      registered: 34,
      price: 0,
      status: 'pending',
      createdBy: 'u4',
      approvedBy: null,
      cover: 'grad-cover-3',
      tags: ['literary', 'hindi'],
    },
    {
      id: 'e9',
      title: 'Synapse — Freshers & Farewell 2026',
      club: 'Saras — Cultural Committee',
      clubId: 'c3',
      category: 'Cultural',
      description: 'Welcome the new batch and bid farewell to graduating seniors with an evening of performances, awards and dinner.',
      date: '2026-05-20',
      time: '18:00',
      venue: 'Central Auditorium',
      capacity: 600,
      registered: 0,
      price: 199,
      status: 'rejected',
      createdBy: 'u4',
      approvedBy: 'u5',
      remarks: 'Venue clashes with Entrepreneur Summit. Please reschedule to May 25th.',
      cover: 'grad-cover-6',
      tags: ['cultural', 'farewell'],
    },
    {
      id: 'e10',
      title: 'Open Mic Night — Stand-up & Poetry',
      club: 'Saras — Cultural Committee',
      clubId: 'c3',
      category: 'Cultural',
      description: 'An intimate evening of stand-up comedy, spoken word poetry and acoustic music. Sign up to perform!',
      date: '2026-04-24',
      time: '19:00',
      venue: 'Cafeteria Stage',
      capacity: 100,
      registered: 67,
      price: 49,
      status: 'approved',
      createdBy: 'u4',
      approvedBy: 'u5',
      cover: 'grad-cover-1',
      tags: ['open mic', 'evening'],
    },
  ],

  /* ----- EXTERNAL COLLEGE EVENTS ----- */
  externalEvents: [
    { college: 'IIT Bombay',   event: 'Techfest 2026', date: '2026-05-08', url: 'https://techfest.org' },
    { college: 'BITS Pilani',  event: 'APOGEE 2026',   date: '2026-04-30', url: 'https://bits-apogee.org' },
    { college: 'IIT Delhi',    event: 'Rendezvous 26', date: '2026-05-12', url: 'https://rendezvous.iitd.ac.in' },
    { college: 'IIIT Hyderabad', event: 'Felicity',    date: '2026-05-18', url: 'https://felicity.iiit.ac.in' },
  ],

  /* ----- NOTIFICATIONS ----- */
  notifications: [
    { id: 'n1', userId: 'u1', title: 'Registration confirmed', msg: 'You are registered for Hackathon 3.0 — Build for Bharat. Team formation opens April 26.', time: '2h ago', unread: true, eventId: 'e1' },
    { id: 'n2', userId: 'u1', title: 'Reminder — Photography Walk', msg: 'Meet at Main Gate tomorrow at 5:30 AM. Carry water.', time: '5h ago', unread: true, eventId: 'e6' },
    { id: 'n3', userId: 'u1', title: 'Certificate ready', msg: 'Your certificate for AI & ML Workshop — RAG Systems is now available.', time: '1d ago', unread: true, eventId: 'e3' },
    { id: 'n4', userId: 'u1', title: 'Spring Fiesta — last 48 hours', msg: 'Ticket sales close on April 26. Book now to lock your spot.', time: '2d ago', unread: false, eventId: 'e2' },
    { id: 'n5', userId: 'u1', title: 'New recommendation', msg: 'Based on your CSE profile, we suggest: Entrepreneur Summit 2026.', time: '3d ago', unread: false, eventId: 'e5' },
  ],

  /* ----- LIVE UPDATES ----- */
  liveUpdates: [
    { id: 'l1', eventId: 'e1', event: 'Hackathon 3.0', msg: 'Problem statements released! Check your team dashboard.', icon: '🚀', time: 'just now', live: true },
    { id: 'l2', eventId: 'e2', event: 'Spring Fiesta', msg: 'DJ Nucleya confirmed as headliner for the night of April 28!', icon: '🎧', time: '12m ago', live: true },
    { id: 'l3', eventId: 'e4', event: 'Football Championship', msg: 'IIIT Surat 2 - 1 IIIT Bangalore · Full time. We\'re in the semis!', icon: '⚽', time: '1h ago', live: false },
    { id: 'l4', eventId: 'e3', event: 'AI Workshop', msg: 'Workshop materials uploaded. Link sent to registered emails.', icon: '📚', time: '3h ago', live: false },
  ],

  /* ----- LEADERBOARD ----- */
  leaderboard: [
    { rank: 1, name: 'Karan Patel',       dept: 'CSE · UI24CS28', events: 14, points: 650, me: false },
    { rank: 2, name: 'Rushikesh Kardile', dept: 'CSE · UI24CS39', events: 12, points: 580, me: false },
    { rank: 3, name: 'Amresh Kumar',      dept: 'CSE · UI24CS09', events: 11, points: 510, me: false },
    { rank: 4, name: 'Sneha Reddy',       dept: 'ECE · UI24EC12', events: 10, points: 470, me: false },
    { rank: 5, name: 'Arun Kumar',        dept: 'CSE · UI24CS11', events: 9,  points: 420, me: true },
    { rank: 6, name: 'Priya Sharma',      dept: 'ECE · UI24EC23', events: 8,  points: 380, me: false },
    { rank: 7, name: 'Nishant Bhatt',     dept: 'CSE · UI24CS47', events: 7,  points: 340, me: false },
    { rank: 8, name: 'Zara Khan',         dept: 'ECE · UI24EC31', events: 6,  points: 290, me: false },
    { rank: 9, name: 'Vivek Joshi',       dept: 'CSE · UI24CS55', events: 5,  points: 230, me: false },
    { rank: 10, name: 'Ananya Desai',     dept: 'ECE · UI24EC08', events: 5,  points: 210, me: false },
  ],

  /* ----- GALLERY (past events — cover + title only, visual) ----- */
  gallery: [
    { id: 'g1', title: 'Tech Quest 2025 — Closing Ceremony', date: 'Oct 2025', cover: 'grad-cover-1' },
    { id: 'g2', title: 'Spring Fiesta 2025 — DJ Night',     date: 'Apr 2025', cover: 'grad-cover-3' },
    { id: 'g3', title: 'HackIIIT 2025 — 36hr Marathon',     date: 'Mar 2025', cover: 'grad-cover-4' },
    { id: 'g4', title: 'Inter-IIIT Sports Meet 2025',       date: 'Feb 2025', cover: 'grad-cover-5' },
    { id: 'g5', title: 'Alumni Meet — Batch of 2020',       date: 'Dec 2024', cover: 'grad-cover-6' },
    { id: 'g6', title: 'TEDx Youth @ Campus 2024',          date: 'Nov 2024', cover: 'grad-cover-2' },
    { id: 'g7', title: 'AI Summit 2024 — Keynote',          date: 'Sep 2024', cover: 'grad-cover-4' },
    { id: 'g8', title: 'Synapse — Farewell 2024',           date: 'Aug 2024', cover: 'grad-cover-3' },
  ],

  /* ----- REPORTS (admin) ----- */
  reports: [
    { id: 'r1', title: 'Events Summary — April 2026',      gen: '2026-04-18', size: '1.2 MB', type: 'PDF' },
    { id: 'r2', title: 'Student Participation Analytics',  gen: '2026-04-15', size: '640 KB', type: 'XLSX' },
    { id: 'r3', title: 'Club-wise Revenue Report Q1',      gen: '2026-04-01', size: '820 KB', type: 'PDF' },
    { id: 'r4', title: 'Feedback & Ratings Digest',        gen: '2026-03-28', size: '410 KB', type: 'PDF' },
  ],

  /* ----- REGISTRATIONS (student-event links) ----- */
  registrations: [
    { id: 'r1', userId: 'u1', eventId: 'e1', status: 'confirmed', paid: true,  registeredAt: '2026-04-18' },
    { id: 'r2', userId: 'u1', eventId: 'e2', status: 'confirmed', paid: true,  registeredAt: '2026-04-17' },
    { id: 'r3', userId: 'u1', eventId: 'e6', status: 'confirmed', paid: false, registeredAt: '2026-04-15' },
    { id: 'r4', userId: 'u1', eventId: 'e3', status: 'attended',  paid: false, registeredAt: '2026-04-10' },
  ],

  /* ----- ATTENDANCE (for a given event) ----- */
  attendance: [
    { userId: 'u1', name: 'Arun Kumar', roll: 'UI24CS11', checkedIn: true,  time: '08:52' },
    { userId: 'u2', name: 'Rushikesh Kardile', roll: 'UI24CS39', checkedIn: true, time: '08:47' },
    { userId: 'u3', name: 'Amresh Kumar', roll: 'UI24CS09', checkedIn: true, time: '08:55' },
    { userId: 'u8', name: 'Priya Sharma', roll: 'UI24EC23', checkedIn: false, time: '-' },
    { userId: 'u9', name: 'Karan Patel', roll: 'UI24CS28', checkedIn: true, time: '08:40' },
    { userId: 'u10', name: 'Sneha Reddy', roll: 'UI24EC12', checkedIn: false, time: '-' },
  ],

  /* ----- SYSTEM ACTIVITY LOG (admin) ----- */
  activityLog: [
    { time: '14:32', actor: 'Ronit Chaudhary', action: 'Created event',  target: 'Entrepreneur Summit 2026' },
    { time: '14:10', actor: 'Dr. Trupti',       action: 'Approved event', target: 'AI & ML Workshop' },
    { time: '13:55', actor: 'Arun Kumar',       action: 'Registered for', target: 'Hackathon 3.0' },
    { time: '13:22', actor: 'Dr. Trupti',       action: 'Rejected event', target: 'Synapse 2026' },
    { time: '12:48', actor: 'Sakil Sindhi',     action: 'Exported report', target: 'Events Summary April 2026' },
    { time: '11:30', actor: 'Ronit Chaudhary', action: 'Posted live update', target: 'Hackathon 3.0' },
  ],
};

/* ----- current session (who's logged in) ----- */
const SESSION = {
  currentUser: null,     // set on login
  currentPage: 'dashboard',
};

/* ----- helper lookups ----- */
function findEvent(id)  { return DB.events.find(e => e.id === id); }
function findUser(id)   { return DB.users.find(u => u.id === id); }
function eventsByStatus(s) { return DB.events.filter(e => e.status === s); }
function approvedEvents() { return DB.events.filter(e => e.status === 'approved'); }

/* ----- sample chatbot knowledge base ----- */
const CHATBOT_KB = [
  { q: /(register|registration|sign up)/i, a: 'To register for an event: open the event → click the <b>Register</b> button → for paid events, complete the payment → you\'ll receive a QR ticket by email and in your <b>My Events</b> page. 🎟️' },
  { q: /(payment|paid|money|price|fee)/i, a: 'For paid events, we accept UPI, debit/credit cards and net banking via Razorpay. All payments are confirmed instantly and your registration status becomes <b>Confirmed</b>. ₹ (INR) is the default currency.' },
  { q: /(qr|attendance|check in)/i, a: 'On event day, the coordinator displays an event-specific QR code. Open your <b>QR Ticket</b> page → let them scan it — or you scan theirs — and you\'re automatically marked present. No paper sign-in!' },
  { q: /(certificate|cert)/i, a: 'Certificates are auto-generated within 24 hours of event completion, provided you were marked present via QR. Download them from <b>My Certificates</b> as PDF.' },
  { q: /(point|rank|leaderboard)/i, a: 'You earn points: <br>• +50 per event attended<br>• +200 for winning<br>• +30 for active participation<br>• +10 for feedback. Check <b>Leaderboard</b> for your rank.' },
  { q: /(cancel|refund)/i, a: 'You can cancel a registration up to 24 hours before the event from <b>My Events</b>. Paid events are refunded to the original payment method within 5-7 business days.' },
  { q: /(approval|faculty)/i, a: 'Events go live only after faculty approval. When a coordinator creates an event, it enters the <b>Pending</b> queue → faculty reviews → on approval it becomes visible to students. Rejected events show a reason and can be edited and resubmitted.' },
  { q: /(club|coordinator)/i, a: 'Interested in running events? Talk to any club coordinator or email <b>sakil@iiitsurat.ac.in</b> to get coordinator access for your club.' },
  { q: /(hi|hello|hey)/i, a: 'Hey there! 👋 Ask me about registration, payments, QR attendance, certificates, points or anything else about Eventra.' },
];
