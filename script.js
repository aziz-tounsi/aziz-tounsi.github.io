// Theme toggle
const toggle = document.getElementById('themeToggle');
const userPref = localStorage.getItem('theme');
if (userPref === 'light') document.body.classList.add('light');
toggle?.addEventListener('click', () => {
  document.body.classList.toggle('light');
  localStorage.setItem('theme', document.body.classList.contains('light') ? 'light' : 'dark');
});

// Year
document.getElementById('year').textContent = new Date().getFullYear();
