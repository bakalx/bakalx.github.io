const btn = document.getElementById('theme-toggle');
const html = document.documentElement;

// Präferenz beim Laden prüfen
const savedTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', savedTheme);
btn.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

btn.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    btn.textContent = newTheme === 'dark' ? '☀️' : '🌙';
});