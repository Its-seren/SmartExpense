// Basic client-side enhancements

document.addEventListener('DOMContentLoaded', () => {
  // Back to top support: ensure #top exists
  if (!document.getElementById('top')) {
    const topAnchor = document.createElement('div');
    topAnchor.id = 'top';
    document.body.prepend(topAnchor);
  }

  // Smooth scroll for dashboard nav links
  document.querySelectorAll('.dashboard-nav a, .back-to-top').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Confirm deletion
  document.querySelectorAll('form[action^="/expenses/delete/"] button[type="submit"]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      if (!confirm('Delete this expense?')) {
        e.preventDefault();
      }
    });
  });
});