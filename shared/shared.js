/* ═══════════════════════════════════════════════════════════════
   COROMANDEL CPC — LUCKY DRAW 2025
   shared.js  |  Production Core Library
   ═══════════════════════════════════════════════════════════════ */

/* ── CONFIG ─────────────────────────────────────────────────── */
window.APP = window.APP || {};
APP.CFG = {
  companyName:    "Coromandel CPC",
  companyTag:     "Lucky Draw 2025",
  companyInitials:"CPC",
  logoSrc:        "",
  csvPath:        "../data.csv",
  basePath:       "",
  countdownTarget: Date.now() + 30 * 60 * 1000,
};

/* ── FALLBACK DATA ───────────────────────────────────────────── */
APP.FALLBACK = [
  {ID:'001',Name:'Rajesh Kumar',   Department:'Sales & Marketing',Prize:'Gold Trophy + ₹10000 Cash',    Card:'Card One',  Status:'Winner'},
  {ID:'002',Name:'Priya Sharma',   Department:'Operations',       Prize:'Weekend Getaway Package',       Card:'Card Two',  Status:'Winner'},
  {ID:'003',Name:'Amit Patel',     Department:'Finance',          Prize:'Smart Watch Series 8',          Card:'Card Three',Status:'Winner'},
  {ID:'004',Name:'Sunita Reddy',   Department:'HR & Admin',       Prize:'Laptop Bag + Accessories',      Card:'Card Four', Status:'Winner'},
  {ID:'005',Name:'Vikram Singh',   Department:'Logistics',        Prize:'Home Theater System',           Card:'Card Five', Status:'Winner'},
  {ID:'006',Name:'Meena Joshi',    Department:'Customer Service', Prize:'Dinner for Two — 5 Star',       Card:'Card Six',  Status:'Winner'},
  {ID:'007',Name:'Arjun Nair',     Department:'IT Department',    Prize:'Bluetooth Speaker Set',         Card:'Card One',  Status:'Runner Up'},
  {ID:'008',Name:'Deepa Menon',    Department:'Quality Control',  Prize:'Gift Voucher ₹5000',            Card:'Card Two',  Status:'Runner Up'},
  {ID:'009',Name:'Suresh Babu',    Department:'Production',       Prize:'Fitness Tracker Band',          Card:'Card Three',Status:'Runner Up'},
  {ID:'010',Name:'Kavita Gupta',   Department:'Procurement',      Prize:'Perfume Gift Set',              Card:'Card Four', Status:'Runner Up'},
  {ID:'011',Name:'Ramesh Yadav',   Department:'Warehouse',        Prize:'Cookware Set',                  Card:'Card Five', Status:'Runner Up'},
  {ID:'012',Name:'Anitha Thomas',  Department:'Accounts',         Prize:'Movie Tickets ×4',              Card:'Card Six',  Status:'Runner Up'},
];

/* ── CSV LOADER ──────────────────────────────────────────────── */
APP.loadCSV = function(onDone) {
  if (typeof Papa === 'undefined') { onDone(APP.FALLBACK); return; }
  Papa.parse(APP.CFG.csvPath, {
    download: true, header: true, skipEmptyLines: true,
    complete: r => onDone(r.data && r.data.length ? r.data : APP.FALLBACK),
    error:    () => onDone(APP.FALLBACK)
  });
};

/* ── PARTICLE CANVAS ─────────────────────────────────────────── */
APP.initParticles = function(canvasId) {
  const cv = document.getElementById(canvasId);
  if (!cv) return;
  const cx = cv.getContext('2d');
  let W, H;
  const stars = [], orbs = [], meteors = [];

  function resize() { W = cv.width = innerWidth; H = cv.height = innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  for (let i = 0; i < 220; i++) {
    stars.push({
      x: Math.random(), y: Math.random(),
      r: Math.random() * 1.4 + 0.15,
      t: Math.random() * Math.PI * 2,
      sp: 0.003 + Math.random() * 0.009,
      twinkle: Math.random() > 0.7
    });
  }
  const hues = [44, 340, 195, 275, 160];
  for (let i = 0; i < 16; i++) {
    orbs.push({
      x: Math.random() * innerWidth, y: Math.random() * innerHeight,
      r: 55 + Math.random() * 110,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
      hue: hues[i % hues.length],
      a: 0.018 + Math.random() * 0.048,
      phase: Math.random() * Math.PI * 2
    });
  }

  function spawnMeteor() {
    if (meteors.length < 3 && Math.random() < 0.003) {
      meteors.push({
        x: Math.random() * W, y: -20,
        vx: 2 + Math.random() * 4,
        vy: 3 + Math.random() * 5,
        len: 80 + Math.random() * 120,
        alpha: 1, done: false
      });
    }
  }

  let t = 0;
  function frame() {
    t++;
    cx.clearRect(0, 0, W, H);

    // Deep space gradient
    const bg = cx.createRadialGradient(W * 0.5, H * 0.35, 0, W * 0.5, H * 0.5, Math.max(W, H) * 0.9);
    bg.addColorStop(0, '#0e0c24');
    bg.addColorStop(0.4, '#070618');
    bg.addColorStop(0.8, '#04040f');
    bg.addColorStop(1, '#020208');
    cx.fillStyle = bg; cx.fillRect(0, 0, W, H);

    // Subtle grid
    cx.save();
    cx.strokeStyle = 'rgba(255,215,0,0.022)';
    cx.lineWidth = 1;
    const gs = 58;
    for (let x = 0; x < W; x += gs) { cx.beginPath(); cx.moveTo(x,0); cx.lineTo(x,H); cx.stroke(); }
    for (let y = 0; y < H; y += gs) { cx.beginPath(); cx.moveTo(0,y); cx.lineTo(W,y); cx.stroke(); }
    cx.restore();

    // Orbs with pulsing
    orbs.forEach(o => {
      o.phase += 0.008;
      o.x += o.vx; o.y += o.vy;
      if (o.x < -o.r) o.x = W + o.r; if (o.x > W + o.r) o.x = -o.r;
      if (o.y < -o.r) o.y = H + o.r; if (o.y > H + o.r) o.y = -o.r;
      const pulse = 1 + 0.18 * Math.sin(o.phase);
      const og = cx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r * pulse);
      og.addColorStop(0, `hsla(${o.hue},100%,68%,${o.a * pulse})`);
      og.addColorStop(0.5, `hsla(${o.hue},80%,50%,${o.a * 0.4})`);
      og.addColorStop(1, 'transparent');
      cx.fillStyle = og; cx.beginPath(); cx.arc(o.x, o.y, o.r * pulse, 0, Math.PI * 2); cx.fill();
    });

    // Stars
    stars.forEach(s => {
      s.t += s.sp;
      const alpha = s.twinkle ? 0.15 + 0.7 * Math.abs(Math.sin(s.t)) : 0.25 + 0.4 * Math.sin(s.t);
      cx.save(); cx.globalAlpha = alpha;
      const g = cx.createRadialGradient(s.x*W, s.y*H, 0, s.x*W, s.y*H, s.r*2);
      g.addColorStop(0, '#fff'); g.addColorStop(1, 'transparent');
      cx.fillStyle = g; cx.beginPath(); cx.arc(s.x*W, s.y*H, s.r*2, 0, Math.PI*2); cx.fill();
      cx.restore();
    });

    // Meteors
    spawnMeteor();
    for (let i = meteors.length - 1; i >= 0; i--) {
      const m = meteors[i];
      m.x += m.vx; m.y += m.vy; m.alpha -= 0.016;
      if (m.alpha <= 0 || m.y > H) { meteors.splice(i, 1); continue; }
      const mg = cx.createLinearGradient(m.x, m.y, m.x - m.vx * m.len / 5, m.y - m.vy * m.len / 5);
      mg.addColorStop(0, `rgba(255,220,100,${m.alpha})`);
      mg.addColorStop(1, 'transparent');
      cx.save(); cx.strokeStyle = mg; cx.lineWidth = 1.5;
      cx.beginPath(); cx.moveTo(m.x, m.y); cx.lineTo(m.x - m.vx * 18, m.y - m.vy * 18); cx.stroke(); cx.restore();
    }

    requestAnimationFrame(frame);
  }
  frame();
};

/* ── CUSTOM CURSOR ───────────────────────────────────────────── */
APP.initCursor = function() {
  const ring = document.getElementById('cursor');
  const dot  = document.getElementById('cursor-dot');
  if (!ring || !dot) return;

  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  // Smooth lag for ring
  (function animCursor() {
    rx += (mx - rx) * 0.14;
    ry += (my - ry) * 0.14;
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    dot.style.left  = mx + 'px'; dot.style.top  = my + 'px';
    requestAnimationFrame(animCursor);
  })();

  document.addEventListener('mouseover', e => {
    const el = e.target.closest('a,button,[data-cursor],.card-wrap,.num-btn,.car-arrow');
    if (el) ring.classList.add('on'); else ring.classList.remove('on');
  });
};

/* ── COUNTDOWN ───────────────────────────────────────────────── */
APP.initCountdown = function(hId, mId, sId) {
  const stored = localStorage.getItem('cpc_countdown_end');
  let target;
  if (stored) {
    target = parseInt(stored, 10);
    if (target < Date.now()) target = Date.now() + 30 * 60 * 1000;
  } else {
    target = Date.now() + 30 * 60 * 1000;
    localStorage.setItem('cpc_countdown_end', target);
  }

  function tick() {
    const left = Math.max(0, Math.floor((target - Date.now()) / 1000));
    const h = Math.floor(left / 3600);
    const m = Math.floor((left % 3600) / 60);
    const s = left % 60;
    const pad = n => String(n).padStart(2, '0');
    if (hId) document.getElementById(hId).textContent = pad(h);
    if (mId) document.getElementById(mId).textContent = pad(m);
    if (sId) document.getElementById(sId).textContent = pad(s);
  }
  setInterval(tick, 1000); tick();
};

/* ── CONFETTI BURST ──────────────────────────────────────────── */
APP.boom = function(color) {
  if (typeof confetti === 'undefined') return;
  const base = { zIndex: 9999, origin: { y: 0.55 } };
  confetti({ ...base, particleCount: 90, spread: 75, colors: [color, '#FFD700', '#fff', '#FF2D6B'] });
  setTimeout(() => {
    confetti({ ...base, angle: 58,  spread: 55, particleCount: 45, origin: { x: 0.08, y: 0.6 }, colors: [color, '#C653FF'] });
    confetti({ ...base, angle: 122, spread: 55, particleCount: 45, origin: { x: 0.92, y: 0.6 }, colors: [color, '#00E5FF'] });
  }, 250);
  setTimeout(() => confetti({ ...base, particleCount: 35, spread: 120, startVelocity: 15, colors: [color, '#fff', '#FFD700'] }), 500);
};

/* ── DOM SPARKS ──────────────────────────────────────────────── */
APP.sparks = function(color, count = 18) {
  for (let i = 0; i < count; i++) {
    const s = document.createElement('div');
    const sz = 3 + Math.random() * 9;
    const dur = 0.6 + Math.random() * 1.1;
    s.style.cssText = `
      position:fixed;z-index:9998;pointer-events:none;border-radius:50%;
      width:${sz}px;height:${sz}px;background:${color};
      left:${10 + Math.random() * 80}vw;top:${15 + Math.random() * 70}vh;
      box-shadow:0 0 ${sz * 2.5}px ${color};
      animation:sparkFly ${dur}s ease forwards;`;
    document.body.appendChild(s);
    s.addEventListener('animationend', () => s.remove());
  }
};

/* ── CAROUSEL (shared, dynamic per card) ─────────────────────── */
APP.Carousel = {
  data: [], index: 0, timer: null, perPage: 3,

  init(containerId, data) {
    this.data = data;
    this.index = 0;
    if (this.timer) clearInterval(this.timer);
    this.build(containerId);
    this.autoPlay();
  },

  build(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const track = container.querySelector('.car-track');
    const dots  = container.querySelector('.car-dots');
    if (!track || !dots) return;
    track.innerHTML = ''; dots.innerHTML = '';

    const pages = Math.ceil(this.data.length / this.perPage);
    this.data.forEach((row, i) => {
      const isWin = (row.Status || '').toLowerCase().includes('winner') &&
                    !(row.Status || '').toLowerCase().includes('runner');
      const card = document.createElement('div');
      card.className = 'car-card';
      card.style.animationDelay = (i % this.perPage) * 0.12 + 's';
      card.innerHTML = `
        <div class="car-card-tag">${row.Card || ''}</div>
        <div class="car-card-id">#${String(row.ID || i+1).padStart(3,'0')}</div>
        <div class="car-card-name">${row.Name || '—'}</div>
        <div class="car-card-dept">${row.Department || '—'}</div>
        <div class="car-card-prize-wrap">
          <div class="car-card-prize-label">PRIZE</div>
          <div class="car-card-prize">${row.Prize || '—'}</div>
        </div>
        <span class="car-card-status ${isWin ? 'sw' : 'sr'}">${row.Status || '—'}</span>
        <div class="car-card-glow"></div>`;
      track.appendChild(card);
    });

    for (let p = 0; p < pages; p++) {
      const d = document.createElement('div');
      d.className = 'car-dot' + (p === 0 ? ' active' : '');
      d.addEventListener('click', () => this.goTo(p));
      dots.appendChild(d);
    }
    this.goTo(0);
  },

  goTo(page) {
    const pages = Math.ceil(this.data.length / this.perPage);
    this.index = ((page % pages) + pages) % pages;
    const track = document.querySelector('.car-track');
    if (!track || !track.children.length) return;
    const cardW = track.children[0].offsetWidth || 280;
    const gap = 16;
    track.style.transform = `translateX(-${this.index * this.perPage * (cardW + gap)}px)`;
    document.querySelectorAll('.car-dot').forEach((d, i) =>
      d.classList.toggle('active', i === this.index));
    // Animate visible cards
    const visible = Array.from(track.children).slice(this.index * this.perPage, this.index * this.perPage + this.perPage);
    visible.forEach((c, i) => {
      c.style.animation = 'none';
      requestAnimationFrame(() => { c.style.animation = `cardSlideIn 0.5s ${i*0.1}s both ease`; });
    });
  },

  autoPlay() {
    const pages = Math.ceil(this.data.length / this.perPage);
    let prog = 0;
    const bar = document.getElementById('carBar');
    this.timer = setInterval(() => {
      prog += 100 / 60;
      if (bar) { bar.style.transition = 'width .1s linear'; bar.style.width = Math.min(prog, 100) + '%'; }
      if (prog >= 100) {
        prog = 0;
        if (bar) { bar.style.transition = 'none'; bar.style.width = '0%'; }
        this.goTo(this.index + 1);
      }
    }, 1000 / 6);
  },

  prev() { this.goTo(this.index - 1); },
  next() { this.goTo(this.index + 1); }
};
