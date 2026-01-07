const btn = document.getElementById('theme-toggle');
const html = document.documentElement;

btn.addEventListener('click', () => {
    const isDark = html.getAttribute('data-theme') === 'dark';
    const nextTheme = isDark ? 'light' : 'dark';
    html.setAttribute('data-theme', nextTheme);
    if (btn) btn.setAttribute('aria-pressed', nextTheme === 'dark' ? 'true' : 'false');
    // Update the icon to reflect the new theme: moon in light mode, sun in dark mode
    const icon = btn.querySelector('.theme-icon');
    if (icon) {
        if (nextTheme === 'dark') {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }
    localStorage.setItem('theme', nextTheme);
});

// Check gespeichertes Theme
if (localStorage.getItem('theme') === 'dark') {
    html.setAttribute('data-theme', 'dark');
    if (btn) btn.setAttribute('aria-pressed', 'true');
    // Set initial icon state
    if (btn) {
        const icon = btn.querySelector('.theme-icon');
        if (icon) { icon.classList.remove('fa-moon'); icon.classList.add('fa-sun'); }
    }
} else {
    if (btn) btn.setAttribute('aria-pressed', 'false');
    if (btn) {
        const icon = btn.querySelector('.theme-icon');
        if (icon) { icon.classList.remove('fa-sun'); icon.classList.add('fa-moon'); }
    }
}

// ensure footer shows current year
(function () {
    const y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();
})();

// Enhance skip-link behaviour: focus target (nav or main) when activated
(function () {
    document.querySelectorAll('a.skip-link').forEach(skip => {
        skip.addEventListener('click', function (e) {
            const href = this.getAttribute('href') || '#main-nav';
            const id = href.charAt(0) === '#' ? href.slice(1) : href;
            const target = document.getElementById(id);
            if (target) {
                // ensure focusable and focus
                if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
                target.focus();
            }
        });
    });
})();

// Mock contact form submission
(function () {
    const form = document.getElementById('contact-form');
    if (!form) return;
    const result = document.getElementById('contact-result');

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        if (!form.reportValidity()) {
            return;
        }

        // Mock sending
        if (result) {
            result.className = 'contact-result';
            result.textContent = 'Senden...';
            result.hidden = false;
            result.style.display = 'block';
        }

        setTimeout(() => {
            if (result) {
                result.classList.add('success');
                result.textContent = 'Danke! Deine Nachricht wurde (mock) gesendet.';
                result.focus();
            }
            form.reset();
        }, 900);
    });
})();

/* Play a short click sound for primary actions (buy buttons) */
(function () {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    let ctx = null;

    function ensureCtx() {
        if (!AudioCtx) return null;
        if (!ctx) ctx = new AudioCtx();
        if (ctx.state === 'suspended') {
            ctx.resume().catch(() => {});
        }
        return ctx;
    }

    function playClick() {
        const c = ensureCtx();
        if (!c) return;
        const now = c.currentTime;

        // Create a bright, happy ping using two sine oscillators (major interval)
        const osc1 = c.createOscillator();
        const osc2 = c.createOscillator();
        const gain = c.createGain();
        const filter = c.createBiquadFilter();

        osc1.type = 'sine';
        osc2.type = 'sine';

        // Base and a major third above for a cheerful interval
        osc1.frequency.value = 880; // A5
        osc2.frequency.value = 1108.73; // C#6 (~major third above A5)

        filter.type = 'highpass';
        filter.frequency.value = 360; // keep it bright

        gain.gain.value = 0.0001;

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(c.destination);

        // Fast attack, pleasant decay
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.22, now + 0.006);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.36);

        osc1.start(now);
        // slight stagger for shimmer
        osc2.start(now + 0.01);
        osc1.stop(now + 0.37);
        osc2.stop(now + 0.37);
    }

    // Only attach sound + popup to explicit purchase buttons: add data-action="buy" to the element
    document.querySelectorAll('.buy-button[data-action="buy"]').forEach(btn => {
        btn.addEventListener('click', function (e) {
            try { playClick(); } catch (err) { /* ignore audio errors */ }
            // Show a simple accessible toast popup (auto-dismiss)
            try { showSimplePopup('Danke! Deine Lizenz wurde (mock) erstellt.'); } catch (err) {}
        });
    });
})();

// Simple toast popup utility
(function () {
    let popup = null;
    let hideTimer = null;

    function createPopup() {
        if (popup) return popup;
        popup = document.createElement('div');
        popup.className = 'simple-popup';
        popup.setAttribute('role', 'status');
        popup.setAttribute('aria-live', 'polite');
        popup.innerHTML = '<div class="popup-message"></div><button class="popup-close" aria-label="Schließen">✕</button>';
        document.body.appendChild(popup);

        const btn = popup.querySelector('.popup-close');
        btn.addEventListener('click', hidePopup);
        return popup;
    }

    function showSimplePopup(message, timeout = 3000) {
        const p = createPopup();
        const msg = p.querySelector('.popup-message');
        msg.textContent = message;
        p.classList.add('show');
        if (hideTimer) clearTimeout(hideTimer);
        hideTimer = setTimeout(hidePopup, timeout);
    }

    function hidePopup() {
        if (!popup) return;
        popup.classList.remove('show');
        if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
    }

    window.showSimplePopup = showSimplePopup;
    window.hideSimplePopup = hidePopup;
})();