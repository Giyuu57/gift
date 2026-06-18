/* =========================================
	 LIVE CLOCK
	 ========================================= */
function updateClock() {
	const now = new Date();
	const dateEl = document.getElementById('live-date');
	const timeEl = document.getElementById('live-time');
	if (dateEl) dateEl.textContent = now.toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' });
	if (timeEl) timeEl.textContent = now.toLocaleTimeString('en-IN', { hour12: false });
}
updateClock();
setInterval(updateClock, 1000);

/* =========================================
	 COUNTDOWN
	 ========================================= */
function updateCountdown() {
	const now = new Date();
	const currentYear = now.getFullYear();
	let target = new Date(currentYear, 5, 19, 0, 0, 0); // June = month 5
	if (now >= target) {
		// Check if it's exactly today
		const isToday = now.getDate() === 19 && now.getMonth() === 5;
		if (isToday) {
			document.getElementById('countdown-grid').style.display = 'none';
			document.getElementById('birthday-today-msg').classList.add('show');
			launchConfetti(); // auto-celebrate!
			return;
		}
		// Past this year's birthday → count to next year
		target = new Date(currentYear + 1, 5, 19, 0, 0, 0);
	}

	const diff = target - now;
	const days = Math.floor(diff / 86400000);
	const hours = Math.floor((diff % 86400000) / 3600000);
	const mins = Math.floor((diff % 3600000) / 60000);
	const secs = Math.floor((diff % 60000) / 1000);

	document.getElementById('cd-days').textContent = String(days).padStart(2,'0');
	document.getElementById('cd-hours').textContent = String(hours).padStart(2,'0');
	document.getElementById('cd-mins').textContent = String(mins).padStart(2,'0');
	document.getElementById('cd-secs').textContent = String(secs).padStart(2,'0');
}
updateCountdown();
setInterval(updateCountdown, 1000);

/* =========================================
	 CONFETTI ENGINE
	 ========================================= */
const canvas = document.getElementById('confetti-canvas');
const ctx = canvas.getContext('2d');
let confettiParticles = [];
let confettiActive = false;
let confettiTimer = null;

function resizeCanvas() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function launchConfetti(duration = 5000) {
	if (confettiTimer) clearTimeout(confettiTimer);
	confettiActive = true;
	const colors = ['#f5c842','#e85d8a','#9c27b0','#ff9800','#03a9f4','#4caf50','#ff5722'];
	for (let i = 0; i < 180; i++) {
		confettiParticles.push({
			x: Math.random() * canvas.width,
			y: -10,
			w: Math.random() * 10 + 5,
			h: Math.random() * 5 + 3,
			color: colors[Math.floor(Math.random() * colors.length)],
			vx: (Math.random() - 0.5) * 4,
			vy: Math.random() * 4 + 2,
			angle: Math.random() * 360,
			spin: (Math.random() - 0.5) * 8,
			opacity: 1,
		});
	}
	confettiTimer = setTimeout(() => { confettiActive = false; }, duration);
}

function drawConfetti() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	confettiParticles = confettiParticles.filter(p => p.y < canvas.height + 20 && p.opacity > 0.05);

	confettiParticles.forEach(p => {
		p.x += p.vx;
		p.y += p.vy;
		p.vy += 0.05; // gravity
		p.angle += p.spin;
		if (p.y > canvas.height * 0.7) p.opacity -= 0.015;

		ctx.save();
		ctx.translate(p.x, p.y);
		ctx.rotate(p.angle * Math.PI / 180);
		ctx.globalAlpha = p.opacity;
		ctx.fillStyle = p.color;
		ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
		ctx.restore();
	});

	requestAnimationFrame(drawConfetti);
}
drawConfetti();
// Welcome confetti on load
window.addEventListener('load', () => setTimeout(() => launchConfetti(6000), 400));

/* =========================================
	 FIREWORKS
	 ========================================= */
function launchFireworks() {
	const colors = ['#f5c842','#e85d8a','#9c27b0','#ff9800','#ffffff'];
	for (let i = 0; i < 8; i++) {
		setTimeout(() => {
			const x = 100 + Math.random() * (window.innerWidth - 200);
			const y = 80 + Math.random() * (window.innerHeight * 0.5);
			createFirework(x, y, colors[Math.floor(Math.random() * colors.length)]);
		}, i * 300);
	}
}

function createFirework(x, y, color) {
	for (let i = 0; i < 24; i++) {
		const dot = document.createElement('div');
		dot.className = 'firework';
		const angle = (i / 24) * 2 * Math.PI;
		const speed = 60 + Math.random() * 80;
		const tx = Math.cos(angle) * speed;
		const ty = Math.sin(angle) * speed;
		dot.style.cssText = `
			left:${x}px; top:${y}px;
			width:6px; height:6px;
			border-radius:50%;
			background:${color};
			position:fixed;
			pointer-events:none;
			z-index:9998;
			transition: all 1s cubic-bezier(0.2,0,1,1);
			box-shadow: 0 0 6px ${color};
		`;
		document.body.appendChild(dot);
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				dot.style.transform = `translate(${tx}px, ${ty}px)`;
				dot.style.opacity = '0';
			});
		});
		setTimeout(() => dot.remove(), 1200);
	}
}

/* =========================================
	 FLOATING PARTICLES IN HERO
	 ========================================= */
function createHeroParticles() {
	const container = document.getElementById('hero-particles');
	const emojis = ['✨','⭐','🌟','💫','✦','❤️','🎉','🎊','🎈'];
	// Particles
	for (let i = 0; i < 24; i++) {
		const p = document.createElement('div');
		p.className = 'particle';
		const size = Math.random() * 6 + 3;
		const color = ['#f5c842','#e85d8a','#9c27b0','#ff9800'][Math.floor(Math.random()*4)];
		p.style.cssText = `
			width:${size}px; height:${size}px;
			background:${color};
			left:${Math.random()*100}%;
			bottom:0;
			animation-duration:${8+Math.random()*12}s;
			animation-delay:${Math.random()*8}s;
		`;
		container.appendChild(p);
	}
	// Balloons
	const balloonEmojis = ['🎈','🎈','🎈','🎉','🎊'];
	for (let i = 0; i < 5; i++) {
		const b = document.createElement('div');
		b.className = 'balloon';
		b.textContent = balloonEmojis[i % balloonEmojis.length];
		b.style.cssText = `
			left:${10+i*18}%;
			font-size:${1.8+Math.random()}rem;
			animation-duration:${12+Math.random()*8}s;
			animation-delay:${i*2.5}s;
		`;
		container.appendChild(b);
	}
}
createHeroParticles();

/* =========================================
	 BIRTHDAY CAKE
	 ========================================= */
let candlesBlown = false;

function blowCandles() {
	if (candlesBlown) return;
	candlesBlown = true;

	// Extinguish flames
	['flame1','flame2','flame3'].forEach(id => {
		const el = document.getElementById(id);
		if (el) {
			el.style.transition = 'opacity 0.4s, transform 0.4s';
			el.style.opacity = '0';
			el.style.transform = 'scaleY(0)';
		}
	});

	// Update button
	const btn = document.getElementById('blow-btn');
	if (btn) { btn.textContent = '🎉 Wish Made!'; btn.disabled = true; btn.style.opacity='0.6'; }

	// Message
	const msg = document.getElementById('cake-message');
	if (msg) msg.textContent = 'Your wish is on its way to the stars, Papa! 🌟';

	// Confetti & fireworks
	launchConfetti(8000);
	setTimeout(launchFireworks, 500);

	// Try to play birthday audio
	const audio = document.getElementById('birthday-audio');
	if (audio && audio.src && audio.src !== window.location.href) {
		audio.volume = 0.6;
		audio.play().catch(() => {});
	}
}

/* =========================================
	 TYPEWRITER EFFECT
	 ========================================= */
// 📝 CUSTOMIZE: Edit this message to personalise it
const typewriterMsg = "Thank you for always supporting me, guiding me, and believing in me even when I didn't believe in myself. Every sacrifice you made, every sleepless night, every silent prayer. I see it all now, and I am so grateful. You are not just my father. You are my greatest inspiration, my safe harbour, and my hero. Happy Birthday, Papa! may this day be as beautiful as every day you have made mine. ❤️";

let twIndex = 0;
let twActive = false;

function startTypewriter() {
	if (twActive) return;
	twActive = true;
	const el = document.getElementById('typewriter-text');
	if (!el) return;
	el.innerHTML = '<span class="cursor"></span>';
	twIndex = 0;
	typeNextChar(el);
}

function typeNextChar(el) {
	if (twIndex <= typewriterMsg.length) {
		el.innerHTML = typewriterMsg.slice(0, twIndex) + '<span class="cursor"></span>';
		twIndex++;
		setTimeout(() => typeNextChar(el), 38);
	}
}

/* =========================================
	 SCROLL ANIMATIONS & INTERSECTION OBSERVER
	 ========================================= */
const revealObserver = new IntersectionObserver((entries) => {
	entries.forEach(entry => {
		if (entry.isIntersecting) {
			entry.target.classList.add('visible');
			// Start typewriter when message section is visible
			if (entry.target.closest('#message-section')) startTypewriter();
			revealObserver.unobserve(entry.target);
		}
	});
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
	revealObserver.observe(el);
});

/* =========================================
	 NAV ACTIVE HIGHLIGHT + SCROLL
	 ========================================= */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const navObserver = new IntersectionObserver((entries) => {
	entries.forEach(entry => {
		if (entry.isIntersecting) {
			navLinks.forEach(a => {
				a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
			});
		}
	});
}, { threshold: 0.4 });

sections.forEach(s => navObserver.observe(s));

/* =========================================
	 MOBILE MENU
	 ========================================= */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

hamburger.addEventListener('click', () => {
	const open = mobileMenu.classList.toggle('open');
	hamburger.setAttribute('aria-expanded', open);
	mobileMenu.setAttribute('aria-hidden', !open);
});

function closeMobileMenu() {
	mobileMenu.classList.remove('open');
	hamburger.setAttribute('aria-expanded', false);
	mobileMenu.setAttribute('aria-hidden', true);
}

/* =========================================
	 DARK / LIGHT THEME TOGGLE
	 ========================================= */
const themeBtn = document.getElementById('theme-toggle');
let lightMode = false;

themeBtn.addEventListener('click', () => {
	lightMode = !lightMode;
	document.documentElement.setAttribute('data-theme', lightMode ? 'light' : 'dark');
	themeBtn.textContent = lightMode ? '☀️' : '🌙';
});

/* =========================================
	 LIGHTBOX
	 ========================================= */
/* Lightbox removed (gallery removed) */

/* =========================================
	 MUSIC PLAYER
	 ========================================= */
const audio = document.getElementById('birthday-audio');
const playBtn = document.getElementById('play-pause-btn');
const disc = document.getElementById('player-disc');
const bar = document.getElementById('player-bar');
const currentEl = document.getElementById('player-current');
const totalEl = document.getElementById('player-total');
const volSlider = document.getElementById('volume-slider');

function fmt(s) {
	const m = Math.floor(s/60);
	const sec = Math.floor(s%60);
	return `${m}:${sec.toString().padStart(2,'0')}`;
}

function togglePlay() {
	if (!audio.src || audio.src === window.location.href) {
		alert('📝 To enable music: add a birthday song MP3 file and update the <audio> src in the HTML code.');
		return;
	}
	if (audio.paused) {
		audio.play();
		playBtn.textContent = '⏸';
		disc.classList.add('spinning');
	} else {
		audio.pause();
		playBtn.textContent = '▶';
		disc.classList.remove('spinning');
	}
}

function skipBack() { audio.currentTime = Math.max(0, audio.currentTime - 10); }
function skipForward() { if (audio.duration) audio.currentTime = Math.min(audio.duration, audio.currentTime + 10); }

audio.addEventListener('timeupdate', () => {
	if (audio.duration) {
		bar.style.width = (audio.currentTime / audio.duration * 100) + '%';
		currentEl.textContent = fmt(audio.currentTime);
	}
});

audio.addEventListener('loadedmetadata', () => {
	totalEl.textContent = fmt(audio.duration);
});

audio.addEventListener('ended', () => {
	playBtn.textContent = '▶';
	disc.classList.remove('spinning');
	bar.style.width = '0%';
	currentEl.textContent = '0:00';
});

volSlider.addEventListener('input', () => {
	audio.volume = volSlider.value / 100;
});

audio.volume = 0.8;

/* =========================================
	 GIFT BOX
	 ========================================= */
let giftOpened = false;

function openGift() {
	if (giftOpened) return;
	giftOpened = true;

	const box = document.getElementById('gift-box');
	const msg = document.getElementById('gift-open-msg');

	box.style.transition = 'all 0.6s cubic-bezier(0.34,1.56,0.64,1)';
	box.style.transform = 'scale(0) rotate(10deg)';
	box.style.opacity = '0';

	setTimeout(() => {
		box.style.display = 'none';
		msg.classList.add('show');
		launchFireworks();
		launchConfetti(6000);
	}, 500);
}

// Keyboard support for gift box
document.getElementById('gift-box').addEventListener('keydown', (e) => {
	if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openGift(); }
});

/* =========================================
	 VOICE MESSAGE
	 ========================================= */
const voiceAudio = document.getElementById('voice-audio');
const voiceBtn = document.getElementById('voice-btn');
const voiceWaveform = document.getElementById('voice-waveform');
let voicePlaying = false;

function toggleVoice() {
	if (!voiceAudio.src || voiceAudio.src === window.location.href) {
		// Simulate playback visually
		if (!voicePlaying) {
			voicePlaying = true;
			voiceBtn.textContent = '⏸';
			voiceWaveform.classList.remove('voice-paused');
			// Auto-stop after 5 seconds (demo)
			setTimeout(() => {
				voicePlaying = false;
				voiceBtn.textContent = '▶';
				voiceWaveform.classList.add('voice-paused');
			}, 5000);
		} else {
			voicePlaying = false;
			voiceBtn.textContent = '▶';
			voiceWaveform.classList.add('voice-paused');
		}
		return;
	}
	if (voiceAudio.paused) {
		voiceAudio.play();
		voiceBtn.textContent = '⏸';
		voiceWaveform.classList.remove('voice-paused');
	} else {
		voiceAudio.pause();
		voiceBtn.textContent = '▶';
		voiceWaveform.classList.add('voice-paused');
	}
}

voiceAudio.addEventListener('ended', () => {
	voiceBtn.textContent = '▶';
	voiceWaveform.classList.add('voice-paused');
});

/* =========================================
	 WISHES WALL — LOCAL STORAGE
	 ========================================= */
/* Wishes functionality removed (section deleted) */

/* =========================================
	 CERTIFICATE DOWNLOAD
	 Using html2canvas via CDN
	 ========================================= */
function downloadCertificate() {
	// Fallback: open a print-friendly version
	const certEl = document.getElementById('certificate-el');
	const win = window.open('', '_blank', 'width=800,height=600');
	if (!win) { alert('Please allow pop-ups to download the certificate.'); return; }

	const styles = `
		@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Dancing+Script:wght@600;700&family=Inter:wght@400;600&display=swap');
		body { margin:0; padding:40px; background:#1a0533; display:flex; justify-content:center; align-items:center; min-height:100vh; font-family:'Inter',sans-serif; }
		.cert { max-width:640px; width:100%; background:linear-gradient(135deg,#1e0840,#2d0d55,#1a0533); border:2px solid #f5c842; border-radius:12px; padding:3.5rem 3rem; position:relative; box-shadow:0 0 60px rgba(245,200,66,0.2); color:#fdf8f0; text-align:center; }
		.cert::before,.cert::after { content:''; position:absolute; border:1px solid rgba(245,200,66,0.3); border-radius:8px; }
		.cert::before { inset:12px; }
		.cert::after { inset:18px; }
		.cert-seal { font-size:4rem; margin-bottom:1rem; }
		.cert-label { font-size:0.7rem; letter-spacing:0.25em; text-transform:uppercase; color:#f5c842; margin-bottom:0.5rem; }
		.cert-title { font-family:'Playfair Display',serif; font-size:2.5rem; font-weight:700; color:#f5c842; line-height:1.2; margin-bottom:1.25rem; }
		.cert-body { font-family:'Playfair Display',serif; font-size:1rem; color:rgba(253,248,240,0.8); line-height:1.8; font-style:italic; margin-bottom:1rem; }
		.cert-recipient { font-family:'Dancing Script',cursive; font-size:2.5rem; color:#fff; margin:0.5rem 0 1.5rem; }
		.cert-footer { display:flex; justify-content:space-between; align-items:flex-end; font-size:0.8rem; color:rgba(253,248,240,0.5); position:relative; z-index:1; }
		.cert-signature { font-family:'Dancing Script',cursive; font-size:1.4rem; color:#f4a0bf; }
		.cert-corner { position:absolute; font-size:2rem; opacity:0.3; }
		.tl { top:30px; left:30px; } .tr { top:30px; right:30px; } .bl { bottom:30px; left:30px; } .br { bottom:30px; right:30px; }
		@media print { body { background:white; padding:0; } .cert { box-shadow:none; } }
	`;

	win.document.write(`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Birthday Certificate - Papa</title><style>${styles}</style></head><body>
		<div class="cert">
			<div class="cert-corner tl">✦</div>
			<div class="cert-corner tr">✦</div>
			<div class="cert-corner bl">✦</div>
			<div class="cert-corner br">✦</div>
			<div class="cert-seal">🏅</div>
			<p class="cert-label">Certificate of Excellence · 19 June 2025</p>
			<h2 class="cert-title">World's Best Father</h2>
			<p class="cert-body">This certificate is proudly presented to</p>
			<div class="cert-recipient">Dear Papa</div>
			<p class="cert-body">In recognition of a lifetime of unconditional love, tireless sacrifice, unwavering strength, and being the greatest hero in your child's life. Your love has been the greatest gift the universe ever gave us.</p>
			<div class="cert-footer">
				<div><div class="cert-signature">With all my love</div><div style="border-top:1px solid rgba(253,248,240,0.3);padding-top:4px;margin-top:4px;">Your Child</div></div>
				<div style="text-align:right;"><div style="font-size:1.5rem;margin-bottom:4px;">❤️</div><div>19 June 2025</div></div>
			</div>
		</div>
		<script>window.onload=()=>{window.print();}<\/script>
	</body></html>`);
	win.document.close();
}
