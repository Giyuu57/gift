const canvas = document.getElementById('confetti-canvas');
const ctx = canvas.getContext('2d');
let confettiParticles = [];
let confettiActive = false;
let confettiTimer = null;

function updateClock() {
	const now = new Date();
	const dateEl = document.getElementById('live-date');
	const timeEl = document.getElementById('live-time');
	if (dateEl) dateEl.textContent = now.toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' });
	if (timeEl) timeEl.textContent = now.toLocaleTimeString('en-IN', { hour12: false });
}
updateClock();
setInterval(updateClock, 1000);

function updateCountdown() {
	const now = new Date();
	const currentYear = now.getFullYear();
	let target = new Date(currentYear, 5, 19, 0, 0, 0);
	if (now >= target) {
		// Check if it's exactly today
		const isToday = now.getDate() === 19 && now.getMonth() === 5;
		if (isToday) {
			document.getElementById('countdown-grid').style.display = 'none';
			document.getElementById('birthday-today-msg').classList.add('show');
			return;
		}

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

function resizeCanvas() {
	canvas.width = Math.max(window.innerWidth, document.documentElement.clientWidth || 0);
	canvas.height = Math.max(window.innerHeight, document.documentElement.clientHeight || 0);
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);
window.addEventListener('pageshow', resizeCanvas);

function launchConfetti(duration = 5000, options = {}) {
	if (confettiTimer) clearTimeout(confettiTimer);
	confettiActive = true;
	const origin = options.origin || 'spread';
	const particleCount = options.count || 90;
	const spread = options.spread || 0.5;
	const verticalSpeedMin = options.verticalSpeedMin || 2;
	const verticalSpeedMax = options.verticalSpeedMax || 6;
	const horizontalSpeed = options.horizontalSpeed || 4;
	const colors = ['#f5c842','#e85d8a','#9c27b0','#ff9800','#03a9f4','#4caf50','#ff5722'];
	for (let i = 0; i < particleCount; i++) {
		const baseX = origin === 'center'
			? canvas.width * 0.5 + (Math.random() - 0.5) * canvas.width * spread
			: Math.random() * canvas.width;
		confettiParticles.push({
			x: baseX,
			y: origin === 'center' ? -30 - Math.random() * 40 : -10,
			w: Math.random() * 10 + 5,
			h: Math.random() * 5 + 3,
			color: colors[Math.floor(Math.random() * colors.length)],
			vx: (Math.random() - 0.5) * horizontalSpeed,
			vy: Math.random() * (verticalSpeedMax - verticalSpeedMin) + verticalSpeedMin,
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

function createHeroParticles() {
	const container = document.getElementById('hero-particles');
	const emojis = ['✨','⭐','🌟','💫','✦','❤️','🎉','🎊','🎈'];
	// Particles
	for (let i = 0; i < 12; i++) {
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

	const balloonEmojis = ['🎈','🎈','🎈','🎉','🎊'];
	for (let i = 0; i < 3; i++) {
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

let candlesBlown = false;

function blowCandles() {
	if (candlesBlown) return;
	candlesBlown = true;

	const cake = document.getElementById('cake-wrapper');
	if (cake) cake.classList.add('candles-blown');

	['flame1','flame2','flame3'].forEach(id => {
		const el = document.getElementById(id);
		if (el) {
			el.style.transition = 'opacity 0.4s, transform 0.4s';
			el.style.opacity = '0';
			el.style.transform = 'scaleY(0)';
		}
	});

	const btn = document.getElementById('blow-btn');
	if (btn) { btn.textContent = '🎉 Wish Made!'; btn.disabled = true; btn.style.opacity='0.6'; }

	const msg = document.getElementById('cake-message');
	if (msg) msg.textContent = 'Your wish is on its way to the stars, Papa! 🌟';

	launchConfetti(8000);
	setTimeout(launchFireworks, 500);

	const audio = document.getElementById('birthday-audio');
	if (audio && audio.src && audio.src !== window.location.href) {
		audio.volume = 0.6;
		audio.play().catch(() => {});
	}
}

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

const revealObserver = new IntersectionObserver((entries) => {
	entries.forEach(entry => {
		if (entry.isIntersecting) {
			entry.target.classList.add('visible');

			if (entry.target.closest('#message-section')) startTypewriter();
			revealObserver.unobserve(entry.target);
		}
	});
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
	revealObserver.observe(el);
});

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

const themeBtn = document.getElementById('theme-toggle');
let lightMode = false;

themeBtn.addEventListener('click', () => {
	lightMode = !lightMode;
	document.documentElement.setAttribute('data-theme', lightMode ? 'light' : 'dark');
	themeBtn.textContent = lightMode ? '☀️' : '🌙';
});

const audio = document.getElementById('birthday-audio');
const playBtn = document.getElementById('play-pause-btn');
const disc = document.getElementById('player-disc');
const bar = document.getElementById('player-bar');
const currentEl = document.getElementById('player-current');
const totalEl = document.getElementById('player-total');
const volSlider = document.getElementById('volume-slider');

if (audio) {
	audio.load();
}

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
		audio.play().then(() => {
			playBtn.textContent = '⏸';
			disc.classList.add('spinning');
		}).catch(() => {
			playBtn.textContent = '▶';
			disc.classList.remove('spinning');
		});
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

document.getElementById('gift-box').addEventListener('keydown', (e) => {
	if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openGift(); }
});

const voiceAudio = document.getElementById('voice-audio');
const voiceBtn = document.getElementById('voice-btn');
const voiceWaveform = document.getElementById('voice-waveform');
let voicePlaying = false;

function toggleVoice() {
	if (!voiceAudio.src || voiceAudio.src === window.location.href) {

		if (!voicePlaying) {
			voicePlaying = true;
			voiceBtn.textContent = '⏸';
			voiceWaveform.classList.remove('voice-paused');

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

function downloadCertificate() {
	const certEl = document.getElementById('certificate-el');
	if (!certEl) return;

	const win = window.open('', '_blank', 'width=900,height=1200');
	if (!win) {
		alert('Please allow pop-ups to open the certificate preview.');
		return;
	}

	const styleTags = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
		.map(node => node.outerHTML)
		.join('\n');
	const certHtml = certEl.outerHTML;
	const doc = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Birthday Certificate - Papa</title>${styleTags}
		<style>
			body { margin:0; padding:40px; background:#1a0533; display:flex; justify-content:center; align-items:center; min-height:100vh; }
			#certificate-el { width:min(100%, 760px); }
			@media print { body { background:white; padding:0; } }
		</style>
	</head><body>${certHtml}<script>window.onload = () => window.print();<\/script></body></html>`;

	win.document.open();
	win.document.write(doc);
	win.document.close();
}
