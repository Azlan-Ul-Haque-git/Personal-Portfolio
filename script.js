/* Ultra Pro JS
   - Particles background (canvas)
   - Typewriter header
   - Smooth scroll
   - Reveal on scroll
   - Skill bar animation
   - 3D tilt on mousemove for .tilt elements
*/

/* ---------------- Particles ---------------- */
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let W = canvas.width = innerWidth;
let H = canvas.height = innerHeight;
const particles = [];
const PARTICLE_COUNT = Math.max(Math.floor((W * H) / 90000), 45); // responsive count

function rand(min, max) { return Math.random() * (max - min) + min; }
function resizeCanvas() {
    W = canvas.width = innerWidth;
    H = canvas.height = innerHeight;
}
addEventListener('resize', () => {
    resizeCanvas();
});

// Particle constructor
function Particle() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.vx = rand(-0.35, 0.35);
    this.vy = rand(-0.55, 0.55);
    this.r = rand(0.6, 2.6);
    this.alpha = rand(0.15, 0.6);
}
Particle.prototype.update = function () {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < -10) this.x = W + 10;
    if (this.x > W + 10) this.x = -10;
    if (this.y < -10) this.y = H + 10;
    if (this.y > H + 10) this.y = -10;
};
Particle.prototype.draw = function () {
    ctx.beginPath();
    ctx.fillStyle = `rgba(0,255,153,${this.alpha})`;
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fill();
};

function initParticles() {
    particles.length = 0;
    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());
}
initParticles();

function connectParticles() {
    let threshold = 110;
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            let dx = particles[i].x - particles[j].x;
            let dy = particles[i].y - particles[j].y;
            let dist2 = dx * dx + dy * dy;
            if (dist2 < threshold * threshold) {
                let alpha = 0.12 - (dist2 / (threshold * threshold)) * 0.11;
                ctx.beginPath();
                ctx.strokeStyle = `rgba(0,255,153,${alpha})`;
                ctx.lineWidth = 0.8;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, W, H);
    for (let p of particles) { p.update(); p.draw(); }
    connectParticles();
    requestAnimationFrame(animateParticles);
}
animateParticles();

/* ---------------- Typewriter ---------------- */
const roles = ["MERN Stack Developer", "AI-Integrated Web Apps", "React • Node • MongoDB"];
let typeEl = document.querySelector('.typewriter');
let roleIndex = 0, charIndex = 0;
let typing = true;

function typeLoop() {
    if (!typeEl) return;
    let current = roles[roleIndex];
    if (typing) {
        charIndex++;
        typeEl.textContent = current.substring(0, charIndex);
        if (charIndex === current.length) {
            typing = false;
            setTimeout(typeLoop, 1000);
            return;
        }
    } else {
        charIndex--;
        typeEl.textContent = current.substring(0, charIndex);
        if (charIndex === 0) {
            typing = true;
            roleIndex = (roleIndex + 1) % roles.length;
        }
    }
    setTimeout(typeLoop, typing ? rand(60, 120) : rand(30, 60));
}
typeLoop();

/* ---------------- Smooth Scroll ---------------- */
document.querySelectorAll('header a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (!target) return;
        const top = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
    });
});

/* ---------------- Reveal on Scroll ---------------- */
const revealEls = document.querySelectorAll('.reveal');
function revealOnScroll() {
    const offset = window.innerHeight * 0.82;
    revealEls.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < offset) {
            el.classList.add('active');
        }
    });
}
window.addEventListener('scroll', revealOnScroll);
revealOnScroll();

/* ---------------- Skill Bars Animation ---------------- */
function animateSkillBars() {
    document.querySelectorAll('.bar span').forEach(span => {
        const w = span.style.width; // e.g. "92%"
        span.style.width = '0';
        // delay to create cascade
        setTimeout(() => { span.style.width = w; }, 250 + Math.random() * 600);
    });
}
// When skills reveal becomes active trigger bars
const skillsSection = document.getElementById('skills');
if (skillsSection) {
    const obs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSkillBars();
                obs.disconnect();
            }
        });
    }, { threshold: 0.3 });
    obs.observe(skillsSection);
}

/* ---------------- 3D Tilt Interaction ---------------- */
function applyTilt(selector) {
    document.querySelectorAll(selector).forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within element.
            const y = e.clientY - rect.top;
            const cx = rect.width / 2;
            const cy = rect.height / 2;
            const dx = (x - cx) / cx;
            const dy = (y - cy) / cy;
            const tiltX = (dy * 8).toFixed(2);
            const tiltY = (dx * -8).toFixed(2);
            card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(8px)`;
            // slight shadow glow
            card.style.boxShadow = `0 20px 50px rgba(0,255,153,0.06)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
            card.style.boxShadow = '';
        });
    });
}
applyTilt('.tilt');
applyTilt('.glass-card');

/* ---------------- Utility: tiny random function used above ---------------- */
function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/* ---------------- Ensure particles recalculated on resize ---------------- */
addEventListener('resize', () => {
    initParticles();
});
