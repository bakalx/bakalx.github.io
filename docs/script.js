const btn = document.getElementById('theme-toggle');
const html = document.documentElement;

btn.addEventListener('click', () => {
    const isDark = html.getAttribute('data-theme') === 'dark';
    const nextTheme = isDark ? 'light' : 'dark';
    html.setAttribute('data-theme', nextTheme);
    btn.textContent = nextTheme === 'dark' ? '☀️' : '🌙';
    localStorage.setItem('theme', nextTheme);
});

// Check gespeichertes Theme
if (localStorage.getItem('theme') === 'dark') {
    html.setAttribute('data-theme', 'dark');
    btn.textContent = '☀️';
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