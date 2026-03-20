// LOADER
window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("loader").classList.add("hidden");
  }, 2200);
});

// CURSOR
const cursor = document.getElementById("cursor");
const ring = document.getElementById("cursor-ring");
let mx = 0,
  my = 0,
  rx = 0,
  ry = 0;
document.addEventListener("mousemove", (e) => {
  mx = e.clientX;
  my = e.clientY;
});
function animateCursor() {
  cursor.style.transform = `translate(${mx - 6}px, ${my - 6}px)`;
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.transform = `translate(${rx - 18}px, ${ry - 18}px)`;
  requestAnimationFrame(animateCursor);
}
animateCursor();
document
  .querySelectorAll(
    "a,button,.highlight-card,.menu-card,.exp-cell,.review-card",
  )
  .forEach((el) => {
    el.addEventListener("mouseenter", () => {
      ring.style.width = "54px";
      ring.style.height = "54px";
      ring.style.borderColor = "rgba(201,168,76,0.8)";
    });
    el.addEventListener("mouseleave", () => {
      ring.style.width = "36px";
      ring.style.height = "36px";
      ring.style.borderColor = "rgba(201,168,76,0.5)";
    });
  });

// NAV SCROLL
window.addEventListener("scroll", () => {
  const nav = document.getElementById("navbar");
  nav.classList.toggle("scrolled", window.scrollY > 60);
});

// MOBILE MENU
function toggleMenu() {
  document.getElementById("mobileMenu").classList.toggle("open");
}

// HERO CANVAS — Particle System
const canvas = document.getElementById("hero-canvas");
const ctx = canvas.getContext("2d");
let W,
  H,
  particles = [],
  mouse = { x: 0, y: 0 };

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

document.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

const COLORS = [
  "rgba(201,168,76,",
  "rgba(79,195,247,",
  "rgba(106,26,255,",
  "rgba(245,240,232,",
];

class Particle {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.size = Math.random() * 1.5 + 0.3;
    this.baseSize = this.size;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    this.alpha = Math.random() * 0.6 + 0.1;
    this.life = Math.random() * 200 + 100;
    this.age = 0;
    this.pulse = Math.random() * Math.PI * 2;
  }
  update() {
    this.age++;
    this.pulse += 0.02;
    const dx = mouse.x - this.x,
      dy = mouse.y - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 120) {
      this.vx -= (dx / dist) * 0.3;
      this.vy -= (dy / dist) * 0.3;
    }
    this.vx *= 0.99;
    this.vy *= 0.99;
    this.x += this.vx;
    this.y += this.vy;
    this.size = this.baseSize + Math.sin(this.pulse) * 0.3;
    if (
      this.age > this.life ||
      this.x < 0 ||
      this.x > W ||
      this.y < 0 ||
      this.y > H
    )
      this.reset();
  }
  draw() {
    const a =
      this.age < 30
        ? this.age / 30
        : this.age > this.life - 30
          ? (this.life - this.age) / 30
          : 1;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color + this.alpha * a + ")";
    ctx.fill();
  }
}

for (let i = 0; i < 120; i++) particles.push(new Particle());

// Floating orbs
class Orb {
  constructor() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.r = Math.random() * 80 + 40;
    this.vx = (Math.random() - 0.5) * 0.2;
    this.vy = (Math.random() - 0.5) * 0.2;
    this.color = Math.random() > 0.5 ? "106,26,255" : "79,195,247";
    this.alpha = Math.random() * 0.04 + 0.01;
    this.pulse = Math.random() * Math.PI * 2;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.pulse += 0.005;
    if (this.x < -this.r) this.x = W + this.r;
    if (this.x > W + this.r) this.x = -this.r;
    if (this.y < -this.r) this.y = H + this.r;
    if (this.y > H + this.r) this.y = -this.r;
  }
  draw() {
    const grad = ctx.createRadialGradient(
      this.x,
      this.y,
      0,
      this.x,
      this.y,
      this.r * (1 + Math.sin(this.pulse) * 0.1),
    );
    grad.addColorStop(0, `rgba(${this.color},${this.alpha})`);
    grad.addColorStop(1, `rgba(${this.color},0)`);
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
  }
}

const orbs = Array.from({ length: 6 }, () => new Orb());

function animate() {
  ctx.clearRect(0, 0, W, H);
  // Deep background gradient
  const bg = ctx.createRadialGradient(
    W / 2,
    H / 2,
    0,
    W / 2,
    H / 2,
    Math.max(W, H),
  );
  bg.addColorStop(0, "rgba(10,10,20,1)");
  bg.addColorStop(1, "rgba(5,5,8,1)");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  orbs.forEach((o) => {
    o.update();
    o.draw();
  });
  particles.forEach((p) => {
    p.update();
    p.draw();
  });

  // Connect nearby particles
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < 80) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(201,168,76,${(1 - d / 80) * 0.08})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(animate);
}
animate();

// MENU DATA
const menuItems = [
  {
    cat: "food",
    emoji: "🍗",
    name: "Golden Chicken Curry",
    desc: "Slow-cooked in aromatic spices, served with tandoor naan",
    price: "₹ 320",
    tag: "Indian",
    badge: "Bestseller",
    bg: "linear-gradient(135deg,#1a0808,#200a05)",
  },
  {
    cat: "food",
    emoji: "🥩",
    name: "Seekh Kebab Platter",
    desc: "Minced lamb with herbs, served with mint chutney & onions",
    price: "₹ 380",
    tag: "Grill",
    bg: "linear-gradient(135deg,#120a08,#1a0a05)",
  },
  {
    cat: "food",
    emoji: "🍝",
    name: "Butter Chicken Biryani",
    desc: "Long grain basmati with saffron & house butter chicken",
    price: "₹ 420",
    tag: "Biryani",
    badge: "Chef's Pick",
    bg: "linear-gradient(135deg,#1a1008,#140c05)",
  },
  {
    cat: "food",
    emoji: "🫕",
    name: "Paneer Tikka Masala",
    desc: "Char-grilled cottage cheese in a rich tomato gravy",
    price: "₹ 280",
    tag: "Vegetarian",
    bg: "linear-gradient(135deg,#100a18,#0a0814)",
  },
  {
    cat: "cocktails",
    emoji: "🍹",
    name: "Club-7 Signature",
    desc: "House blend of aged rum, passion fruit & smoked chilli",
    price: "₹ 380",
    tag: "Cocktail",
    badge: "Signature",
    bg: "linear-gradient(135deg,#0a1820,#051018)",
  },
  {
    cat: "cocktails",
    emoji: "🍸",
    name: "Mumbai Mule",
    desc: "Premium vodka, ginger beer, lime & a secret spice blend",
    price: "₹ 320",
    tag: "Cocktail",
    bg: "linear-gradient(135deg,#0a180a,#050d05)",
  },
  {
    cat: "cocktails",
    emoji: "🌅",
    name: "Nalasopara Sunrise",
    desc: "Tequila, orange juice, grenadine — tropical and bold",
    price: "₹ 290",
    tag: "Cocktail",
    bg: "linear-gradient(135deg,#1a0808,#1a1005)",
  },
  {
    cat: "beer",
    emoji: "🍺",
    name: "Kingfisher Draught",
    desc: "India's favourite, ice cold on tap — pint or pitcher",
    price: "₹ 180",
    tag: "Beer",
    badge: "Popular",
    bg: "linear-gradient(135deg,#100a00,#1a1005)",
  },
  {
    cat: "beer",
    emoji: "🍻",
    name: "Budweiser Pint",
    desc: "Classic American lager, perfectly chilled",
    price: "₹ 220",
    tag: "Beer",
    bg: "linear-gradient(135deg,#0a0808,#141005)",
  },
  {
    cat: "special",
    emoji: "👑",
    name: "Royal Platter",
    desc: "Mixed grill feast — chicken, lamb, seekh kebabs & prawns",
    price: "₹ 1,200",
    tag: "Premium",
    badge: "★ Special",
    bg: "linear-gradient(135deg,#1a1508,#12100a)",
  },
  {
    cat: "special",
    emoji: "🦐",
    name: "Coastal Prawn Curry",
    desc: "Juicy Konkan prawns in coconut-tomato gravy",
    price: "₹ 650",
    tag: "Seafood",
    bg: "linear-gradient(135deg,#081018,#050a10)",
  },
  {
    cat: "cocktails",
    emoji: "🫧",
    name: "Berry Blast Mocktail",
    desc: "Mixed berries, soda & mint — non-alcoholic option",
    price: "₹ 180",
    tag: "Mocktail",
    bg: "linear-gradient(135deg,#180a18,#100514)",
  },
];

function renderMenu(filter = "all") {
  const grid = document.getElementById("menuGrid");
  const items =
    filter === "all" ? menuItems : menuItems.filter((i) => i.cat === filter);
  grid.innerHTML = items
    .map(
      (i) => `
    <div class="menu-card reveal visible">
      ${i.badge ? `<div class="badge">${i.badge}</div>` : ""}
      <div class="menu-img">
        <div class="menu-img-bg" style="background:${i.bg};position:absolute;inset:0"></div>
        <span>${i.emoji}</span>
      </div>
      <div class="menu-body">
        <div class="menu-tag">${i.tag}</div>
        <div class="menu-name">${i.name}</div>
        <div class="menu-desc">${i.desc}</div>
        <div class="menu-price">${i.price}</div>
      </div>
    </div>
  `,
    )
    .join("");
}
renderMenu();

function filterMenu(cat) {
  document
    .querySelectorAll(".tab-btn")
    .forEach((b) => b.classList.remove("active"));
  event.target.classList.add("active");
  renderMenu(cat);
}

// REVIEWS
const reviews = [
  {
    name: "Rohan Sharma",
    text: "Absolutely love the vibe here! The cocktails are fantastic and the food is top-notch. Perfect place for birthdays and get-togethers.",
    rating: 5,
    date: "2 weeks ago",
    init: "RS",
  },
  {
    name: "Priya Nair",
    text: "Great ambience, friendly staff. The butter chicken here is the best I've had in Nalasopara. Will definitely come back!",
    rating: 5,
    date: "1 month ago",
    init: "PN",
  },
  {
    name: "Akash Patel",
    text: "Club-7 is our go-to spot for celebrations. The team went above and beyond for my anniversary dinner. Highly recommended!",
    rating: 5,
    date: "3 weeks ago",
    init: "AP",
  },
  {
    name: "Sneha Joshi",
    text: "Finally a premium dining experience in Nalasopara. The bar is stocked really well and the cocktails are creative.",
    rating: 4,
    date: "1 month ago",
    init: "SJ",
  },
  {
    name: "Vikram Desai",
    text: "Best late night dining spot in the area. Love that they're open till 1:30 AM. Seekh kebabs are outstanding!",
    rating: 5,
    date: "2 months ago",
    init: "VD",
  },
  {
    name: "Meera Kulkarni",
    text: "Celebrated my birthday here and the staff made it super special. Food is great, service is warm and attentive.",
    rating: 5,
    date: "3 months ago",
    init: "MK",
  },
  {
    name: "Arjun Mehta",
    text: "The Royal Platter is a must-try! Portions are generous and flavors are bold. Club-7 sets the bar very high in this area.",
    rating: 4,
    date: "1 week ago",
    init: "AM",
  },
];

function renderReviews() {
  const track = document.getElementById("reviewsTrack");
  const doubled = [...reviews, ...reviews];
  track.innerHTML = doubled
    .map(
      (r) => `
    <div class="review-card">
      <div class="review-stars">${"★".repeat(r.rating)}${"☆".repeat(5 - r.rating)}</div>
      <p class="review-text">"${r.text}"</p>
      <div class="review-author">
        <div class="review-avatar">${r.init}</div>
        <div>
          <div class="review-name">${r.name}</div>
          <div class="review-date">${r.date}</div>
        </div>
      </div>
    </div>
  `,
    )
    .join("");
}
renderReviews();

// RESERVATION SUBMIT
function submitReservation() {
  const btn = document.querySelector(".btn-submit");
  btn.textContent = "✓ Reservation Confirmed — We'll call you shortly!";
  btn.style.background = "linear-gradient(135deg,#2d6a4f,#1b4332)";
  btn.style.color = "#fff";
  setTimeout(() => {
    btn.textContent = "Confirm Reservation ✦";
    btn.style.background = "";
    btn.style.color = "";
  }, 4000);
}

// SCROLL REVEAL
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add("visible");
    });
  },
  { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
);
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
