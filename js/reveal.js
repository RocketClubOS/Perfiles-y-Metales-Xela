(() => {
    const items = document.querySelectorAll('.reveal-on-scroll');
    if (!items.length) return;

    if (!('IntersectionObserver' in window)) {
        return;
    }

    document.documentElement.classList.add('reveal-ready');

    const revealAll = () => {
        items.forEach((el) => el.classList.add('is-visible'));
    };

    // Red de seguridad: si por lo que sea el observer no dispara,
    // el contenido nunca debe quedar invisible para siempre.
    const safetyTimeout = setTimeout(revealAll, 4000);

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    items.forEach((el) => observer.observe(el));

    window.addEventListener('beforeunload', () => clearTimeout(safetyTimeout));
})();
