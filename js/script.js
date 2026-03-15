// ============================================
// Register GSAP
// ============================================
gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(ScrollTrigger, Flip);



// ============================================
// 1️⃣ LENIS SMOOTH SCROLL SETUP
// ============================================

const lenis = new Lenis({
  duration: 1.2,
  smooth: true,
  smoothTouch: false
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// Connect Lenis with ScrollTrigger 
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);


// ============================================
// 2️⃣ CINEMATIC 3D ZOOM + PARALLAX
// ============================================

// Set perspective dynamically
gsap.set(".zoom-container", {
  perspective: 1200
});

// Initial depth setup

// gsap.set(".zoom-item", { 
//     transformOrigin: "center center", 
//     force3D: true, 
//     scale: 0.6, 
//     opacity: 0.05 
// });

// gsap.set(".zoom-item", { 
//     scale: 0.6, 
//     opacity: 0.05 
// });

gsap.set(".zoom-item", {
  scale: 0.85,
  opacity: 0.05
});

const zoomContainer = document.querySelector(".zoom-container");


// ============================================
// 3D Zoom + Smooth Zoom Out → Zoom In
// ============================================


const zoomTimeline = gsap.timeline({
  scrollTrigger: {
    trigger: ".zoom-container",
    start: "top top",
    // end: "+=140%",
    // scrub: 1.2, 

    // end: "+=250%", 
    end: "+=150%",
    // end: "bottom top",
    scrub: 2.0,
    pin: true
  }
});


// Layer depth scaling multiplier
// const depthMap = {
//   1: { z: 400, scale: 1.1 },
//   2: { z: 700, scale: 1.3 },
//   3: { z: 1000, scale: 1.5 }
// };

const depthMap = {
  1: { z: 120, scale: 0.9 },
  2: { z: 200, scale: 1.0 },
  3: { z: 300, scale: 1.1 }
};

// Zoom out effect (scale up)
document.querySelectorAll(".zoom-item").forEach((item) => {
  const layer = item.dataset.layer;
  zoomTimeline.to(item, {
    z: depthMap[layer].z,
    scale: depthMap[layer].scale,
    opacity: 1,
    ease: "power3.out"
  }, 0);
});



// Heading cinematic reveal
zoomTimeline.to(".heading", {
  // z: 200, 
  // scale: 1.2, 
  z: 80,
  scale: 1.05,
  opacity: 1,
  ease: "power3.out"
}, 0);

zoomTimeline.to(".zoom-container", {
  opacity: 0,
  duration: 1
}, "=0.9");





// ============================================
// 2️⃣ CINEMATIC Sky
// ============================================

window.addEventListener("load", () => {

  const skyCanvas = document.getElementById("sky-stars");
  const skyCtx = skyCanvas.getContext("2d");

  function resizeSky() {
    const rect = skyCanvas.getBoundingClientRect();
    skyCanvas.width = rect.width;
    skyCanvas.height = rect.height;
  }
  resizeSky();
  window.addEventListener("resize", resizeSky);

  const STAR_COUNT = 300;
  const SHOOTING_COUNT = 3;
  const GOLDEN_COUNT = 80;

  let stars = [];
  let shootingStars = [];
  let goldenParticles = [];
  let zoomScale = 1;
  let globalStarOpacity = 1;
  let goldenOpacity = 1;

  // Create white stars
  for (let i = 0; i < STAR_COUNT; i++) {
    stars.push({
      radius: Math.random() * 2 + 0.5,
      distance: Math.random() * 600,
      angle: Math.random() * Math.PI * 2,
      speed: (Math.random() - 0.5) * 0.0015,
      depth: Math.random() * 1.5 + 0.5,
      brightness: Math.random() * 0.8 + 0.2,
      twinkleSpeed: Math.random() * 0.02 + 0.01
    });
  }

  // Shooting stars
  for (let i = 0; i < SHOOTING_COUNT; i++) {
    shootingStars.push({
      x: Math.random() * skyCanvas.width,
      y: Math.random() * skyCanvas.height / 2,
      length: Math.random() * 100 + 50,
      speed: Math.random() * 15 + 10,
      active: Math.random() < 0.5
    });
  }

  // Golden particles (like timeline/2022)
  for (let i = 0; i < GOLDEN_COUNT; i++) {
    goldenParticles.push({
      x: Math.random() * skyCanvas.width,
      y: Math.random() * skyCanvas.height,
      size: Math.random() * 2.5 + 0.5,
      baseSize: Math.random() * 2.5 + 0.5,
      speed: Math.random() * 0.3 + 0.1,
      opacity: Math.random() * 0.6 + 0.2
    });
  }

  // Moon and Nebula
  const moon = new Image();
  // moon.src = "https://i.ibb.co/L5s7sfV/moon.png";

  const nebula = new Image();
  // nebula.src = "https://i.ibb.co/6vC2K3v/nebula.png";

  let nebulaRotation = 0;

  function drawStars() {
    skyCtx.clearRect(0, 0, skyCanvas.width, skyCanvas.height);

    const centerX = skyCanvas.width / 2;
    const centerY = skyCanvas.height / 2;

    // Background
    skyCtx.fillStyle = "#000000";
    skyCtx.fillRect(0, 0, skyCanvas.width, skyCanvas.height);

    // Nebula
    skyCtx.save();
    skyCtx.translate(centerX, centerY);
    skyCtx.rotate(nebulaRotation);
    skyCtx.globalAlpha = 0.3;
    skyCtx.globalCompositeOperation = "screen";
    skyCtx.drawImage(nebula, -skyCanvas.width / 2, -skyCanvas.height / 2, skyCanvas.width, skyCanvas.height);
    skyCtx.restore();
    skyCtx.globalCompositeOperation = "source-over";
    nebulaRotation += 0.0008;

    // Moon
    skyCtx.save();
    skyCtx.globalAlpha = 0.6;
    skyCtx.drawImage(moon, centerX - 120, centerY - 200, 240, 240);
    skyCtx.restore();

    // White stars
    stars.forEach(star => {
      star.angle += star.speed;
      star.brightness += star.twinkleSpeed;
      if (star.brightness > 1 || star.brightness < 0.2) star.twinkleSpeed *= -1;

      const x = centerX + Math.cos(star.angle) * star.distance * zoomScale;
      const y = centerY + Math.sin(star.angle) * star.distance * zoomScale;

      skyCtx.beginPath();
      skyCtx.arc(x, y, star.radius * zoomScale * star.depth, 0, Math.PI * 2);

      const alpha = Math.max(globalStarOpacity * star.brightness, 0.05);
      skyCtx.fillStyle = `rgba(255,255,255,${alpha})`;
      skyCtx.fill();
    });

    // Golden particles
    goldenParticles.forEach(p => {
      p.y -= p.speed;
      if (p.y < 0) p.y = skyCanvas.height;

      skyCtx.beginPath();
      skyCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);

      skyCtx.fillStyle = `rgba(245,175,25,${goldenOpacity * p.opacity})`;
      skyCtx.fill();
    });

    // Shooting stars
    shootingStars.forEach(star => {
      if (!star.active && Math.random() < 0.002) star.active = true;

      if (star.active) {
        star.x += star.speed;
        star.y += star.speed * 0.2;

        skyCtx.beginPath();
        skyCtx.moveTo(star.x, star.y);
        skyCtx.lineTo(star.x - star.length, star.y - star.length * 0.2);
        skyCtx.strokeStyle = "white";
        skyCtx.lineWidth = 2;
        skyCtx.stroke();

        if (star.x > skyCanvas.width + star.length || star.y > skyCanvas.height + star.length) {
          star.x = Math.random() * skyCanvas.width / 2;
          star.y = Math.random() * skyCanvas.height / 2;
          star.active = false;
        }
      }
    });

    requestAnimationFrame(drawStars);
  }

  drawStars();

  // Scroll-linked zoom & opacity
  let skyZoom = { scale: 1, opacity: 1, gold: 0 };

  zoomTimeline.to(skyZoom, {
    // scale: 2.2,
    scale: 1.3,
    opacity: 0.05,
    gold: 1,
    ease: "power3.out",
    onUpdate: () => {
      zoomScale = skyZoom.scale;
      globalStarOpacity = skyZoom.opacity;
      goldenOpacity = skyZoom.gold;
      goldenParticles.forEach(p => {
        p.size = p.baseSize * (0.8 + 0.2 * skyZoom.gold);
      });
    }
  }, 0);

});


// ============================================
// 3️⃣ CINEMATIC TEXT REVEAL
// ============================================

const textElement = document.querySelector(".opacity-reveal");
const originalText = textElement.textContent;
textElement.innerHTML = "";

const words = originalText.split(" ");

words.forEach(word => {
  const span = document.createElement("span");
  span.innerHTML = word + "&nbsp;";
  span.style.opacity = "0.1";
  span.style.display = "inline-block";
  span.style.transform = "translateY(40px)";
  textElement.appendChild(span);
});

const chars = textElement.querySelectorAll("span");

const textTimeline = gsap.timeline({
  scrollTrigger: {
    trigger: ".section-stick",
    start: "top top",
    end: "+=200%",
    scrub: 1.5,
    pin: true
  }
});

// Letter cinematic rise
textTimeline.to(chars, {
  opacity: 1,
  y: 0,
  stagger: {
    each: 0.02
  },
  ease: "power2.out"
});

// Subtle zoom out fade
textTimeline.to(".opacity-reveal", {
  scale: 1.15,
  opacity: 0,
  duration: 1
});

// ============================================
// 🌟 SECTION-STICK PARTICLES (like timeline & 2022)
// ============================================

// Section-stick canvas & context
const stickCanvas = document.getElementById("stick-particles");
const stickCtx = stickCanvas.getContext("2d");

// Resize
function resizeStickCanvas() {
  stickCanvas.width = stickCanvas.offsetWidth;
  stickCanvas.height = stickCanvas.offsetHeight;
}
resizeStickCanvas();
window.addEventListener("resize", resizeStickCanvas);

// Create particles
let stickParticles = [];
for (let i = 0; i < 80; i++) {
  stickParticles.push({
    x: Math.random() * stickCanvas.width,
    y: Math.random() * stickCanvas.height,
    size: Math.random() * 2.5 + 0.5,  // golden mode size
    baseSize: Math.random() * 2.5 + 0.5,
    speed: Math.random() * 0.6 + 0.2,
    color: { r: 245, g: 175, b: 25 } // golden color
  });
}

// Draw particles with color and size
function drawStickParticles() {
  stickCtx.clearRect(0, 0, stickCanvas.width, stickCanvas.height);

  stickParticles.forEach(p => {
    p.y -= p.speed;
    if (p.y < 0) {
      p.y = stickCanvas.height;
      p.x = Math.random() * stickCanvas.width;
    }

    stickCtx.beginPath();
    stickCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    stickCtx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, 0.6)`;
    stickCtx.fill();
  });

  requestAnimationFrame(drawStickParticles);
}


drawStickParticles();

// ============================================
// 🌟 Scroll-linked color & size transition
// ============================================

// Create a tween object
let particleTween = { progress: 0 }; // 0 = golden, 1 = white small

zoomTimeline.to(particleTween, {
  progress: 1, // on zoom-out
  ease: "power3.out",
  onUpdate: () => {
    stickParticles.forEach(p => {
      // Interpolate color: golden -> white
      p.color.r = 245 + (255 - 245) * particleTween.progress;
      p.color.g = 175 + (255 - 175) * particleTween.progress;
      p.color.b = 25 + (255 - 25) * particleTween.progress;

      // Interpolate size: original -> smaller (like timeline)
      p.size = p.baseSize - (p.baseSize - 1.5) * particleTween.progress;
    });
  }
}, 0);

// Reverse tween when scrolling back (zoom in)
zoomTimeline.to(particleTween, {
  progress: 0,
  ease: "power3.out",
  onUpdate: () => {
    stickParticles.forEach(p => {
      p.color.r = 245 + (255 - 245) * particleTween.progress;
      p.color.g = 175 + (255 - 175) * particleTween.progress;
      p.color.b = 25 + (255 - 25) * particleTween.progress;
      p.size = p.baseSize - (p.baseSize - 1.5) * particleTween.progress;
    });
  }
}, 1); // delayed after zoom-out


// ============================================
// 📜 TIMELINE CARD SCROLL ANIMATION (UNCHANGED)
// ============================================

const timelineItems = gsap.utils.toArray(".timeline li");

const storyTimeline = gsap.timeline({
  scrollTrigger: {
    trigger: ".timeline",
    start: "top top",
    end: "+=500%",
    scrub: 1.2,
    pin: true
  }
});

// Step 1 → Title
storyTimeline.to(".timeline-title", {
  opacity: 1,
  y: 0,
  duration: 1
});

// Step 2 → Subtitle
storyTimeline.to(".timeline-subtitle", {
  opacity: 1,
  y: 0,
  duration: 1
});

// Step 3,4,5 → Cards
timelineItems.forEach((item) => {

  storyTimeline.to(item, {
    duration: 1,

    onStart: () => {
      item.classList.add("in-view");
    },

    onReverseComplete: () => {
      item.classList.remove("in-view");
    }

  });

});

// ============================================
// 🌠 FLOATING MEMORY PARTICLES
// ============================================

const timelineCanvas = document.getElementById("timeline-particles");
const tctx = timelineCanvas.getContext("2d");

function resizeCanvas() {
  timelineCanvas.width = timelineCanvas.offsetWidth;
  timelineCanvas.height = timelineCanvas.offsetHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

let memoryParticles = [];

for (let i = 0; i < 70; i++) {
  memoryParticles.push({
    x: Math.random() * timelineCanvas.width,
    y: Math.random() * timelineCanvas.height,
    size: Math.random() * 2 + 0.5,
    speed: Math.random() * 0.3 + 0.1,
    opacity: Math.random() * 0.6 + 0.2
  });
}

function animateTimelineParticles() {
  tctx.clearRect(0, 0, timelineCanvas.width, timelineCanvas.height);

  memoryParticles.forEach(p => {
    p.y -= p.speed;

    if (p.y < 0) {
      p.y = timelineCanvas.height;
      p.x = Math.random() * timelineCanvas.width;
    }

    tctx.beginPath();
    tctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    tctx.fillStyle = `rgba(245, 175, 25, ${p.opacity})`;
    tctx.fill();
  });

  requestAnimationFrame(animateTimelineParticles);
}

animateTimelineParticles();


// ============================================
// 🎬 2022 EMOTIONAL ANIMATION
// ============================================

const lines2022 = gsap.utils.toArray(".section-2022 .line");

const timeline2022 = gsap.timeline({
  scrollTrigger: {
    trigger: ".section-2022",
    start: "top top",
    end: "+=250%",
    scrub: 1.5,
    pin: true
  }
});

timeline2022.to(".year", {
  opacity: 0.15,
  scale: 1.2,
  duration: 2
});

timeline2022.to(lines2022, {
  opacity: 1,
  y: 0,
  stagger: 0.8,
  ease: "power2.out"
});

// ============================================
// 🌌 Soft Floating Particles
// ============================================

const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];

for (let i = 0; i < 60; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 2,
    speed: Math.random() * 0.5 + 0.2
  });
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach(p => {
    p.y -= p.speed;
    if (p.y < 0) p.y = canvas.height;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.fill();
  });

  requestAnimationFrame(animateParticles);
}

animateParticles();


// ============================================
// 4️⃣ MOBILE OPTIMIZATION
// ============================================

ScrollTrigger.matchMedia({

  // Mobile
  "(max-width: 768px)": function () {

    gsap.set(".zoom-item", {
      scale: 0.8
    });

    ScrollTrigger.refresh();
  }

});


// ============================================
// 🎬 1 YEAR LATER CINEMATIC TRANSITION
// ============================================

const lines1y = gsap.utils.toArray(".section-1y .line-1y");

const timeline1y = gsap.timeline({
  scrollTrigger: {
    trigger: ".section-1y",
    start: "top top",
    end: "+=200%",
    scrub: 1.5,
    pin: true
  }
});

// Fade in title slowly
timeline1y.to(".year-1y", {
  opacity: 1,
  y: 0,
  duration: 2,
  ease: "power3.out"
});

// Reveal lines slowly one by one
timeline1y.to(lines1y, {
  opacity: 1,
  y: 0,
  stagger: 1,
  ease: "power2.out"
});

// Final cinematic fade glow
timeline1y.to(".final-1y", {
  opacity: 1,
  duration: 2
});

// marriage Section

console.clear()
gsap.registerPlugin(ScrollTrigger, ScrollSmoother)
gsap.config({ trialWarn: false })

let smoother = ScrollSmoother.create({
  smooth: 3,
  effects: true
})


// ============================================
//Message Section
// ============================================

var swiper = new Swiper(".mySwiper", {
  effect: "coverflow",
  grabCursor: true,
  centeredSlides: true,
  slidesPerView: "auto",
  touchRatio: 1.5,
  
  coverflowEffect: {
    // rotate: 50,
    rotate: 0,
    stretch: 0,
    depth: 100,
    // modifier: 1,
    modifier: 2,
    slideShadows: true,
  },
  // loop : true,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  breakpoints: {
    0: {
      navigation: {
        enabled: true,
      },
    },

    768: {
      navigation: {
        enabled: false,
      },
    },
  },
});