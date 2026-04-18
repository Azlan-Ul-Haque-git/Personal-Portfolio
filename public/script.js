/* ===============================
   ULTRA PRO PORTFOLIO JS
   Clean • Optimized • Stable
   =============================== */

/* ---------- Utilities ---------- */
const randFloat = (min, max) => Math.random() * (max - min) + min;
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

/* ---------- Particles ---------- */
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');

let W, H, particles = [];
let PARTICLE_COUNT = 0;

function resizeCanvas() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    PARTICLE_COUNT = Math.max(Math.floor((W * H) / 90000), 45);
    initParticles();
}

class Particle {
    constructor() {
        this.x = Math.random() * W;
        this.y = Math.random() * H;
        this.vx = randFloat(-0.35, 0.35);
        this.vy = randFloat(-0.55, 0.55);
        this.r = randFloat(0.6, 2.6);
        this.alpha = randFloat(0.15, 0.6);
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < -10) this.x = W + 10;
        if (this.x > W + 10) this.x = -10;
        if (this.y < -10) this.y = H + 10;
        if (this.y > H + 10) this.y = -10;
    }
    draw() {
        ctx.beginPath();
        ctx.fillStyle = `rgba(0,255,153,${this.alpha})`;
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
    }
}

function connectParticles() {
    const threshold = 110;
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = dx * dx + dy * dy;
            if (dist < threshold * threshold) {
                const alpha = 0.12 - (dist / (threshold * threshold)) * 0.11;
                ctx.strokeStyle = `rgba(0,255,153,${alpha})`;
                ctx.lineWidth = 0.8;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    connectParticles();
    requestAnimationFrame(animateParticles);
}

resizeCanvas();
animateParticles();
window.addEventListener('resize', resizeCanvas);

/* ---------- Typewriter ---------- */
const roles = [
    "MERN Stack Developer",
    "AI-Integrated Web Apps",
    "React • Node • MongoDB"
];

const typeEl = document.querySelector('.typewriter');
let roleIndex = 0, charIndex = 0, typing = true;

function typeLoop() {
    if (!typeEl) return;
    const current = roles[roleIndex];

    if (typing) {
        charIndex++;
        typeEl.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
            typing = false;
            setTimeout(typeLoop, 1200);
            return;   
        }
    } else {
        charIndex--;
        typeEl.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
            typing = true;
            roleIndex = (roleIndex + 1) % roles.length;
        }
    }
    setTimeout(typeLoop, typing ? randInt(60, 120) : randInt(40, 70));
}
typeLoop();

/* ---------- Smooth Scroll (Header + Mobile) ---------- */
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
        const target = document.querySelector(link.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        const y = target.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top: y, behavior: 'smooth' });
    });
});

/* ---------- Reveal on Scroll ---------- */
const revealEls = document.querySelectorAll('.reveal');
function revealOnScroll() {
    const trigger = window.innerHeight * 0.82;
    revealEls.forEach(el => {
        if (el.getBoundingClientRect().top < trigger) {
            el.classList.add('active');
        }
    });
}
window.addEventListener('scroll', revealOnScroll);
revealOnScroll();

/* ---------- Skill Bars ---------- */
const skillsSection = document.getElementById('skills');
if (skillsSection) {
    const observer = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {

            document.querySelectorAll('.bar span').forEach(span => {
                const target = span.getAttribute('data-width');
                span.style.width = '0';
                setTimeout(() => {
                    span.style.width = target;
                }, 300);
            });
            observer.disconnect();
        }
    }, { threshold: 0.35 });
    observer.observe(skillsSection);
}

/* ---------- 3D Tilt (Desktop Only) ---------- */
if (!isTouch) {
    document.querySelectorAll('.tilt').forEach(card => {
        card.addEventListener('mousemove', e => {
            const r = card.getBoundingClientRect();
            const x = e.clientX - r.left;
            const y = e.clientY - r.top;
            const dx = (x - r.width / 2) / (r.width / 2);
            const dy = (y - r.height / 2) / (r.height / 2);
            card.style.transform =
                `perspective(1000px) rotateX(${dy * 8}deg) rotateY(${dx * -8}deg) translateZ(8px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    });
}
/* ---------- Resume Open Popup ---------- */
const resumeBtn = document.querySelector(".resume-btn");
const resumePopup = document.getElementById("resumePopup");

if (resumeBtn && resumePopup) {
    resumeBtn.addEventListener("click", () => {

        // show popup
        resumePopup.classList.add("show");

        // auto hide after 3s
        setTimeout(() => {
            resumePopup.classList.remove("show");
        }, 3000);
    });
}















