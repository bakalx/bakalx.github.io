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