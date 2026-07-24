/* ── VISITOR COUNTER ── */
(function() {
  const el = document.getElementById('visitorCount');
  if (!el) return;
  
  // Get stored count
  let total = parseInt(localStorage.getItem('karam_visitors') || '0', 10);
  
  // Increment if this is a new session
  if (!sessionStorage.getItem('karam_counted')) {
    total++;
    localStorage.setItem('karam_visitors', total);
    sessionStorage.setItem('karam_counted', '1');
  }
  
  // Animate counting up
  let current = 0;
  const duration = 1200;
  const step = Math.max(1, Math.floor(total / 40));
  const interval = duration / (total / step);
  
  const counter = setInterval(() => {
    current += step;
    if (current >= total) {
      current = total;
      clearInterval(counter);
    }
    el.textContent = current;
  }, interval);
})();

/* ── PARTICLES ── */
(function() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const canvas = document.createElement('canvas');
  canvas.className = 'particle-canvas';
  hero.prepend(canvas);   /* safe — works with any hero HTML structure */
  const ctx = canvas.getContext('2d');
  const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
  resize(); window.addEventListener('resize', resize, { passive:true });
  const dots = Array.from({length:40}, () => ({
    x:Math.random()*canvas.width, y:Math.random()*canvas.height,
    r:Math.random()*1.6+.4, vx:(Math.random()-.5)*.25, vy:-(Math.random()*.5+.08),
    opacity:Math.random()*.22+.04,
    h:58+Math.random()*18, s:28+Math.random()*28, l:26+Math.random()*20
  }));
  (function loop() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    dots.forEach(d => {
      d.x+=d.vx; d.y+=d.vy;
      if(d.y<-10){d.y=canvas.height+10;d.x=Math.random()*canvas.width;}
      if(d.x<0)d.x=canvas.width; if(d.x>canvas.width)d.x=0;
      ctx.globalAlpha=d.opacity;
      ctx.fillStyle=`hsl(${d.h},${d.s}%,${d.l}%)`;
      ctx.beginPath(); ctx.arc(d.x,d.y,d.r,0,Math.PI*2); ctx.fill();
    });
    ctx.globalAlpha=1; requestAnimationFrame(loop);
  })();
})();

/* ── NAVBAR ── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => nav.classList.toggle('solid', window.scrollY > 40), {passive:true});

/* ── MOBILE MENU ── */
const burger = document.getElementById('burger'), mobMenu = document.getElementById('mobMenu');
burger.addEventListener('click', () => {
  burger.classList.toggle('open'); mobMenu.classList.toggle('open');
  document.body.style.overflow = mobMenu.classList.contains('open') ? 'hidden' : '';
});
document.querySelectorAll('.mn').forEach(a => a.addEventListener('click', () => {
  burger.classList.remove('open'); mobMenu.classList.remove('open'); document.body.style.overflow = '';
}));

/* ── FADE-UP OBSERVER ── */
const io = new IntersectionObserver(entries => {
  entries.forEach((e,i) => { if(e.isIntersecting) setTimeout(()=>e.target.classList.add('vis'), i*90); });
}, {threshold:.08});
document.querySelectorAll('.fu, .sec-title, .tl-item').forEach(el => io.observe(el));

/* ── SKILL DOTS ── */
document.querySelectorAll('.sk-item').forEach((item,idx) => {
  const level = parseInt(item.dataset.l||0), c = item.querySelector('.sk-dots');
  if(!c) return;
  c.innerHTML = '';
  for(let i=1;i<=5;i++){const d=document.createElement('div'); d.className='sk-dot'+(i<=level?' on':''); c.appendChild(d);}
  item.style.transitionDelay=(idx%11)*.055+'s';
});
const skIo = new IntersectionObserver(entries => {
  entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('vis');});
},{threshold:.05});
document.querySelectorAll('.sk-item').forEach(el=>skIo.observe(el));

/* ── STATS COUNTER ── */
function countUp(el,target,suffix){
  let cur=0;
  const step=()=>{cur=Math.min(cur+Math.ceil(target/28),target); el.textContent=cur+suffix; if(cur<target)setTimeout(step,38);};
  step();
}
const statsObs = new IntersectionObserver(entries=>{
  if(!entries[0].isIntersecting)return;
  document.querySelectorAll('.stat-n[data-target]').forEach((el,i)=>{
    const t=parseInt(el.dataset.target), s=el.dataset.suffix||'';
    setTimeout(()=>countUp(el,t,s),i*200);
  });
  statsObs.disconnect();
},{threshold:.4});
const sg=document.querySelector('.stats-grid'); if(sg) statsObs.observe(sg);

/* ── VISITOR COUNTER ── */
async function loadVisits(){
  const el=document.getElementById('vcNum'); if(!el)return;
  try{
    const r=await fetch('https://api.countapi.xyz/hit/karam-shama-ka-ram-v2/visits');
    if(r.ok){const d=await r.json(); animNum(el,d.value||1); return;}
  }catch(_){}
  const local=parseInt(localStorage.getItem('ks_v')||'0')+1;
  localStorage.setItem('ks_v',local); animNum(el,local);
}
function animNum(el,target){
  const dur=1600,t0=performance.now();
  (function step(now){
    const p=Math.min((now-t0)/dur,1), ease=1-Math.pow(1-p,4);
    el.textContent=Math.floor(ease*target).toLocaleString();
    if(p<1)requestAnimationFrame(step); else el.textContent=target.toLocaleString();
  })(t0);
}
loadVisits();

/* ── LIGHTBOX (IMAGES & VIDEOS) ── */
function openLB(src, caption) {
  const lb = document.getElementById('lightbox');
  const img = document.getElementById('lbImg');
  const cap = document.getElementById('lbCaption');

  // Check if video file extension
  const isVideo = /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(src);

  let videoEl = document.getElementById('lbVideo');
  if (!videoEl && isVideo) {
    videoEl = document.createElement('video');
    videoEl.id = 'lbVideo';
    videoEl.className = 'lb-img';
    videoEl.controls = true;
    videoEl.autoplay = true;
    lb.insertBefore(videoEl, cap);
  }

  if (isVideo) {
    if (img) img.style.display = 'none';
    if (videoEl) {
      videoEl.style.display = 'block';
      videoEl.src = src;
      videoEl.play().catch(() => {});
    }
  } else {
    if (videoEl) {
      videoEl.pause();
      videoEl.style.display = 'none';
      videoEl.src = '';
    }
    if (img) {
      img.style.display = 'block';
      img.src = src;
      img.classList.remove('zoomed');
    }
  }

  if (cap) cap.textContent = caption || '';
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImg');
  const lbVideo = document.getElementById('lbVideo');

  if (lb) lb.classList.remove('has-zoomed');
  if (lbImg) lbImg.classList.remove('zoomed');
  if (lbVideo) {
    lbVideo.pause();
    lbVideo.src = '';
    lbVideo.style.display = 'none';
  }

  document.getElementById('lightbox')?.classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => {
    if (lbImg) lbImg.src = '';
  }, 350);
}

document.getElementById('lightbox')?.addEventListener('click', function(e) {
  if (e.target === this) closeLightbox();
});
document.getElementById('lbImg')?.addEventListener('click', function(e) {
  e.stopPropagation();
  const isZoomed = this.classList.toggle('zoomed');
  document.getElementById('lightbox')?.classList.toggle('has-zoomed', isZoomed);

  if (isZoomed) {
    const rect = this.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    this.style.transformOrigin = `${x}% ${y}%`;
  } else {
    this.style.transformOrigin = 'center center';
  }
});

document.getElementById('lbImg')?.addEventListener('mousemove', function(e) {
  if (!this.classList.contains('zoomed')) return;
  const rect = this.getBoundingClientRect();
  const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
  const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
  this.style.transformOrigin = `${x}% ${y}%`;
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

/* ── SOCIAL MEDIA POSTS CAROUSEL ENGINE ── */
(function initSocialMediaCarousel() {
  const container = document.getElementById('smCarousel');
  const wrapper = document.getElementById('smCarouselWrapper');
  if (!container || !wrapper) return;

  const socialMediaImages = [
    'Portfolio/Social Media/1%20(1).jpg',
    'Portfolio/Social Media/1%20(3).jpg',
    'Portfolio/Social Media/1%20(4).jpg',
    'Portfolio/Social Media/1%20(5).jpg',
    'Portfolio/Social Media/1%20(6).jpg',
    'Portfolio/Social Media/2%20(1).jpg',
    'Portfolio/Social Media/2%20(2).jpg',
    'Portfolio/Social Media/2%20(5).jpg',
    'Portfolio/Social Media/2%20(6).jpg',
    'Portfolio/Social Media/2%20(7).jpg',
    'Portfolio/Social Media/2%20(8).jpg',
    'Portfolio/Social Media/2%20(9).jpg',
    'Portfolio/Social Media/3%20(1).jpg',
    'Portfolio/Social Media/3%20(5).jpg',
    'Portfolio/Social Media/3%20(6).jpg',
    'Portfolio/Social Media/3%20(7).jpg',
    'Portfolio/Social Media/3%20(8).jpg',
    'Portfolio/Social Media/4%20(1).jpg',
    'Portfolio/Social Media/4%20(1).png',
    'Portfolio/Social Media/4%20(2).jpg',
    'Portfolio/Social Media/4%20(3).jpg',
    'Portfolio/Social Media/4%20(7).png',
    'Portfolio/Social Media/4%20(8).png',
    'Portfolio/Social Media/4%20(9).png',
    'Portfolio/Social Media/4%20(10).png',
    'Portfolio/Social Media/4%20(11).png',
    'Portfolio/Social Media/5%20(1).jpg',
    'Portfolio/Social Media/5%20(3).jpg',
    'Portfolio/Social Media/5%20(4).jpg',
    'Portfolio/Social Media/5%20(5).jpg',
    'Portfolio/Social Media/5%20(6).jpg',
    'Portfolio/Social Media/5%20(7).jpg',
    'Portfolio/Social Media/5%20(8).jpg',
    'Portfolio/Social Media/5%20(9).jpg',
    'Portfolio/Social Media/5%20(10).jpg',
    'Portfolio/Social Media/6%20(1).jpg',
    'Portfolio/Social Media/6%20(2).jpg',
    'Portfolio/Social Media/6%20(3).jpg',
    'Portfolio/Social Media/6%20(4).jpg',
    'Portfolio/Social Media/6%20(5).jpg',
    'Portfolio/Social Media/6%20(6).jpg',
    'Portfolio/Social Media/6%20(7).jpg',
    'Portfolio/Social Media/6%20(8).jpg',
    'Portfolio/Social Media/6%20(9).jpg',
    'Portfolio/Social Media/6%20(10).jpg',
    'Portfolio/Social Media/7%20(1).jpg',
    'Portfolio/Social Media/7%20(2).jpg',
    'Portfolio/Social Media/7%20(3).jpg',
    'Portfolio/Social Media/7%20(4).jpg',
    'Portfolio/Social Media/8%20(1).jpg',
    'Portfolio/Social Media/8%20(2).jpg',
    'Portfolio/Social Media/8%20(3).jpg',
    'Portfolio/Social Media/8%20(4).jpg'
  ];

  // Render cards
  container.innerHTML = socialMediaImages.map((src, i) => `
    <div class="portfolio-card" data-idx="${i}" style="--idx: ${i}" onclick="openLB('${src}', 'Social Media Design')">
      <img src="${src}" alt="Social Media Post ${i+1}" loading="lazy" />
    </div>
  `).join('');

  const cards = container.querySelectorAll('.portfolio-card');

  // Calculate active center card & 3D Cover Flow angles on scroll
  function updateCenterCard() {
    const wrapperRect = wrapper.getBoundingClientRect();
    const wrapperCenter = wrapperRect.left + wrapperRect.width / 2;

    let closestCard = null;
    let minDistance = Infinity;

    cards.forEach(card => {
      const cardRect = card.getBoundingClientRect();
      const cardCenter = cardRect.left + cardRect.width / 2;
      const dist = Math.abs(wrapperCenter - cardCenter);

      if (dist < minDistance) {
        minDistance = dist;
        closestCard = card;
      }
    });

    cards.forEach(card => {
      const cardRect = card.getBoundingClientRect();
      const cardCenter = cardRect.left + cardRect.width / 2;

      card.classList.remove('center-card', 'left-card', 'right-card');

      if (card === closestCard) {
        card.classList.add('center-card');
      } else if (cardCenter < wrapperCenter) {
        card.classList.add('left-card');
      } else {
        card.classList.add('right-card');
      }
    });
  }

  wrapper.addEventListener('scroll', updateCenterCard, { passive: true });
  window.addEventListener('resize', updateCenterCard, { passive: true });

  // Initial center update
  setTimeout(() => {
    if (cards[1]) {
      const cardRect = cards[1].getBoundingClientRect();
      const wrapperRect = wrapper.getBoundingClientRect();
      wrapper.scrollLeft = cards[1].offsetLeft - (wrapperRect.width / 2) + (cardRect.width / 2);
    }
    updateCenterCard();
  }, 100);

  // Arrow buttons navigation
  const prevBtn = document.getElementById('smPrev');
  const nextBtn = document.getElementById('smNext');

  prevBtn?.addEventListener('click', () => {
    const cardWidth = cards[0]?.offsetWidth || 300;
    wrapper.scrollBy({ left: -(cardWidth + 28), behavior: 'smooth' });
  });

  nextBtn?.addEventListener('click', () => {
    const cardWidth = cards[0]?.offsetWidth || 300;
    wrapper.scrollBy({ left: (cardWidth + 28), behavior: 'smooth' });
  });

  // Touch & Mouse Momentum Dragging
  let isDown = false;
  let startX, scrollLeft;

  wrapper.addEventListener('mousedown', (e) => {
    isDown = true;
    startX = e.pageX - wrapper.offsetLeft;
    scrollLeft = wrapper.scrollLeft;
  });
  wrapper.addEventListener('mouseleave', () => { isDown = false; });
  wrapper.addEventListener('mouseup', () => { isDown = false; });
  wrapper.addEventListener('mousemove', (e) => {
    if(!isDown) return;
    e.preventDefault();
    const x = e.pageX - wrapper.offsetLeft;
    const walk = (x - startX) * 1.5;
    wrapper.scrollLeft = scrollLeft - walk;
  });
})();

/* ── VIDEO REELS CAROUSEL ENGINE ── */
(function initReelsCarousel() {
  const container = document.getElementById('reelsCarousel');
  const wrapper = document.getElementById('reelsCarouselWrapper');
  if (!container || !wrapper) return;

  const reelsVideos = [
    { src: 'Portfolio/Reels/100ج تكفي تبدأ محفظة استثمارية ناجحة؟.mp4', poster: 'Portfolio/Reels/Cover/100ج تكفي تبدأ محفظة استثمارية ناجحة؟.jpg', title: ' تكفي تبدأ محفظة استثمارية ناجحة؟ ' },
    { src: 'Portfolio/Reels/5 أخطاء في البورصة.mp4', poster: 'Portfolio/Reels/Cover/5 أخطاء في البورصة.jpg', title: ' خمس أخطاء في البورصة' },
    { src: 'Portfolio/Reels/الأسهم الاسلامية الجزء الـ1.mp4', poster: 'Portfolio/Reels/Cover/الأسهم الاسلامية الجزء الـ1.jpg', title: 'الأسهم الاسلامية الجزء الـ1' },
    { src: 'Portfolio/Reels/الأسهم الاسلامية الجزء الـ2.mp4', poster: 'Portfolio/Reels/Cover/الأسهم الاسلامية الجزء الـ2.jpg', title: 'الأسهم الاسلامية الجزء الـ2' },
    { src: 'Portfolio/Reels/الذهب 2.mp4', poster: 'Portfolio/Reels/Cover/الذهب 2.jpg', title: 'الذهب 2' },
    { src: 'Portfolio/Reels/العاطفة أخطر عدو للمستثمر.mp4', poster: 'Portfolio/Reels/Cover/العاطفة أخطر عدو للمستثمر.jpeg', title: 'العاطفة أخطر عدو للمستثمر' },
    { src: 'Portfolio/Reels/القيمه العادله (1).mp4', poster: 'Portfolio/Reels/Cover/القيمه العادله (1).jpg', title: 'القيمه العادله (1)' },
    { src: 'Portfolio/Reels/القيمة العادلة (2).mp4', poster: 'Portfolio/Reels/Cover/القيمة العادلة (2).png', title: 'القيمة العادلة (2)' },
    { src: 'Portfolio/Reels/القيمة العادلة (3).mp4', poster: 'Portfolio/Reels/Cover/القيمة العادلة (3).jpg', title: 'القيمة العادلة (3)' },
    { src: 'Portfolio/Reels/القيمة العادلة (4).mp4', poster: 'Portfolio/Reels/Cover/القيمة العادلة (4).jpg', title: 'القيمة العادلة (4)' },
    { src: 'Portfolio/Reels/شهادة الـ18.mp4', poster: 'Portfolio/Reels/Cover/شهادة الـ18.jpg', title: '%شهادة الـ18' },
    { src: 'Portfolio/Reels/قصه بشمهندس احمد.mp4', poster: 'Portfolio/Reels/Cover/قصه بشمهندس احمد.jpg', title: 'قصه بشمهندس احمد' },
    { src: 'Portfolio/Reels/يعني اية توزيعات ارباح او كوبونات.mp4', poster: 'Portfolio/Reels/Cover/يعني اية توزيعات ارباح او كوبونات.jpg', title: 'يعني اية توزيعات ارباح او كوبونات' }
  ];

  container.innerHTML = reelsVideos.map((item, i) => `
    <div class="portfolio-card reels-card" data-idx="${i}" style="--idx: ${i}" onclick="openLB('${item.src}', '${item.title}')">
      <video src="${item.src}" poster="${item.poster}" muted loop playsinline preload="metadata"></video>
      <div class="reels-play-badge"><i class="fas fa-play"></i></div>
      <div class="pinfo" style="position:absolute;bottom:10px;left:10px;right:10px;z-index:4;background:rgba(18,18,14,0.85);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,0.15);border-radius:12px;padding:8px 10px;text-align:center;">
        <div class="ptitle" style="font-size:0.85rem;color:var(--white);font-weight:700;">${item.title}</div>
      </div>
    </div>
  `).join('');

  const cards = container.querySelectorAll('.portfolio-card');

  // Play video preview on hover for desktop
  cards.forEach(card => {
    const video = card.querySelector('video');
    card.addEventListener('mouseenter', () => { if (video) video.play().catch(()=>{}); });
    card.addEventListener('mouseleave', () => { if (video) { video.pause(); video.currentTime = 0; } });
  });

  function updateCenterCard() {
    const wrapperRect = wrapper.getBoundingClientRect();
    const wrapperCenter = wrapperRect.left + wrapperRect.width / 2;

    let closestCard = null;
    let minDistance = Infinity;

    cards.forEach(card => {
      const cardRect = card.getBoundingClientRect();
      const cardCenter = cardRect.left + cardRect.width / 2;
      const dist = Math.abs(wrapperCenter - cardCenter);

      if (dist < minDistance) {
        minDistance = dist;
        closestCard = card;
      }
    });

    cards.forEach(card => {
      const cardRect = card.getBoundingClientRect();
      const cardCenter = cardRect.left + cardRect.width / 2;

      card.classList.remove('center-card', 'left-card', 'right-card');

      if (card === closestCard) {
        card.classList.add('center-card');
      } else if (cardCenter < wrapperCenter) {
        card.classList.add('left-card');
      } else {
        card.classList.add('right-card');
      }
    });
  }

  wrapper.addEventListener('scroll', updateCenterCard, { passive: true });
  window.addEventListener('resize', updateCenterCard, { passive: true });

  setTimeout(() => {
    if (cards[1]) {
      const cardRect = cards[1].getBoundingClientRect();
      const wrapperRect = wrapper.getBoundingClientRect();
      wrapper.scrollLeft = cards[1].offsetLeft - (wrapperRect.width / 2) + (cardRect.width / 2);
    }
    updateCenterCard();
  }, 120);

  const prevBtn = document.getElementById('reelsPrev');
  const nextBtn = document.getElementById('reelsNext');

  prevBtn?.addEventListener('click', () => {
    const cardWidth = cards[0]?.offsetWidth || 240;
    wrapper.scrollBy({ left: -(cardWidth + 28), behavior: 'smooth' });
  });

  nextBtn?.addEventListener('click', () => {
    const cardWidth = cards[0]?.offsetWidth || 240;
    wrapper.scrollBy({ left: (cardWidth + 28), behavior: 'smooth' });
  });

  // Touch & Mouse Dragging
  let isDown = false, startX, scrollLeft;
  wrapper.addEventListener('mousedown', (e) => {
    isDown = true;
    startX = e.pageX - wrapper.offsetLeft;
    scrollLeft = wrapper.scrollLeft;
  });
  wrapper.addEventListener('mouseleave', () => { isDown = false; });
  wrapper.addEventListener('mouseup', () => { isDown = false; });
  wrapper.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - wrapper.offsetLeft;
    wrapper.scrollLeft = scrollLeft - (x - startX) * 1.5;
  });
})();


/* ── CONTACT FORM (WHATSAPP REDIRECT) ── */
function sendMsg(e){
  e.preventDefault();
  const name = document.getElementById('fn').value.trim();
  const email = document.getElementById('fe').value.trim() || 'Not provided';
  const subj = document.getElementById('fs').value.trim() || 'Project Inquiry';
  const msg = document.getElementById('fm').value.trim();
  const btn = document.getElementById('cfBtn');

  const waText = `👋 *New Portfolio Message*\n\n👤 *Name:* ${name}\n✉️ *Email:* ${email}\n📌 *Subject:* ${subj}\n\n💬 *Message:*\n${msg}`;
  const waUrl = `https://wa.me/201145908553?text=${encodeURIComponent(waText)}`;

  window.open(waUrl, '_blank');
  
  if (btn) {
    const origHtml = btn.innerHTML;
    btn.innerHTML = '<i class="fab fa-whatsapp" style="margin-right:8px;"></i>Opening WhatsApp...';
    setTimeout(() => {
      btn.innerHTML = '<i class="fas fa-check" style="margin-right:8px;"></i>Sent to WhatsApp!';
      btn.style.background = '#25D366';
      btn.style.color = '#FFFFFF';
    }, 1200);
    setTimeout(() => {
      btn.innerHTML = origHtml;
      btn.style.background = '';
      btn.style.color = '';
    }, 4000);
  }
}

/* ── ACTIVE NAV ── */
const secs=document.querySelectorAll('section[id]'), navAs=document.querySelectorAll('.nav-links a');
window.addEventListener('scroll',()=>{
  let cur=''; secs.forEach(s=>{if(window.scrollY>=s.offsetTop-180)cur=s.id;});
  navAs.forEach(a=>{if(a.classList.contains('nav-cta'))return; a.style.color=a.getAttribute('href')==='#'+cur?'var(--accent-l)':'';});
},{passive:true});

/* ── PARALLAX HERO ── */
const heroEl=document.querySelector('.hero');
window.addEventListener('scroll',()=>{
  if(heroEl) heroEl.style.backgroundPositionY=`calc(50% + ${window.scrollY*.3}px)`;
},{passive:true});

/* ── MOUSE PARALLAX ON HERO PHOTO LAYERS ── */
(function() {
  const container = document.getElementById('parallaxContainer');
  const hero = document.querySelector('.hero');
  if (!container || !hero) return;

  hero.addEventListener('mousemove', e => {
    const rect = hero.getBoundingClientRect();
    const x = e.clientX - rect.left - (rect.width / 2);
    const y = e.clientY - rect.top - (rect.height / 2);

    const nx = x / (rect.width / 2);
    const ny = y / (rect.height / 2);

    const layers = container.querySelectorAll('.photo-layer');
    layers.forEach(layer => {
      const depth = parseFloat(layer.getAttribute('data-depth') || '0.2');
      const moveX = nx * depth * 32;
      const moveY = ny * depth * 32;
      
      let rotStr = '';
      if (layer.classList.contains('panel-1')) rotStr = ' rotate(-6deg)';
      if (layer.classList.contains('panel-2')) rotStr = ' rotate(4deg)';

      layer.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)${rotStr}`;
    });
  });

  hero.addEventListener('mouseleave', () => {
    const layers = container.querySelectorAll('.photo-layer');
    layers.forEach(layer => {
      let rotStr = '';
      if (layer.classList.contains('panel-1')) rotStr = ' rotate(-6deg)';
      if (layer.classList.contains('panel-2')) rotStr = ' rotate(4deg)';
      layer.style.transform = `translate3d(0, 0, 0)${rotStr}`;
    });
  });
})();

/* ── FULL CONTENT PROTECTION & ANTI-THEFT SHIELD ── */
(function initAntiTheftProtection() {
  let toastTimer;
  function showProtectedToast(msg) {
    let toast = document.getElementById('protectToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'protectToast';
      toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%) translateY(20px);
        background: rgba(18, 18, 14, 0.95);
        border: 1px solid rgba(168, 168, 80, 0.5);
        color: #FFFFFF;
        padding: 10px 22px;
        border-radius: 100px;
        font-family: 'Outfit', sans-serif;
        font-size: 0.78rem;
        font-weight: 700;
        letter-spacing: 0.08em;
        z-index: 100000;
        box-shadow: 0 10px 30px rgba(0,0,0,0.8), 0 0 20px rgba(116, 116, 52, 0.4);
        backdrop-filter: blur(12px);
        opacity: 0;
        pointer-events: none;
        transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
      `;
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<i class="fas fa-lock" style="color:#A8A850;margin-right:8px;"></i> ${msg || 'Content Protected © Karam Shama'}`;
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
    
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(20px)';
    }, 2200);
  }

  // Disable Right-Click Context Menu
  document.addEventListener('contextmenu', e => {
    if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
    e.preventDefault();
    showProtectedToast('Right-Clicking Disabled · Protected Content');
  });

  // Disable Image Drag & Drop
  document.addEventListener('dragstart', e => {
    e.preventDefault();
  });

  // Disable Keyboard Shortcuts (Inspect, Copy, Save, Print, Select All)
  document.addEventListener('keydown', e => {
    const k = e.key ? e.key.toUpperCase() : '';
    const ctrl = e.ctrlKey || e.metaKey;
    const shift = e.shiftKey;

    if (
      e.keyCode === 123 || 
      (ctrl && shift && (k === 'I' || k === 'J' || k === 'C')) ||
      (ctrl && (k === 'U' || k === 'S' || k === 'P'))
    ) {
      e.preventDefault();
      showProtectedToast('Protected Content © Karam Shama');
      return false;
    }

    if (ctrl && (k === 'C' || k === 'X' || k === 'A')) {
      if (!['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
        e.preventDefault();
        showProtectedToast('Copying Disabled · Protected Content');
        return false;
      }
    }
  });
})();
