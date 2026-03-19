document.addEventListener('DOMContentLoaded', () => {
    // 1. Intersection Observer for Scroll Animations
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.fade-in, .reveal').forEach(el => observer.observe(el));
    setTimeout(() => { document.querySelectorAll('.hero .fade-in').forEach(el => el.classList.add('visible')); }, 100);

    // 2. Netlify Form Submission Native Mocking
    const form = document.getElementById('waitlist-form');
    const successMsg = document.getElementById('form-success');
    const emailInput = document.getElementById('email');

    if (form && successMsg && emailInput) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (emailInput.value.trim()) {
                const btn = form.querySelector('.btn-primary');
                const prevHtml = btn.innerHTML;
                btn.innerHTML = '<span class="btn-text">PROCESSANDO...</span>';
                btn.style.opacity = '0.7';
                btn.style.pointerEvents = 'none';

                fetch("/", {
                    method: "POST",
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    body: new URLSearchParams(new FormData(form)).toString()
                })
                .then(() => {
                    form.style.display = 'none';
                    successMsg.classList.remove('hidden');
                    successMsg.animate([{ opacity: 0, transform: 'scale(0.95)' }, { opacity: 1, transform: 'scale(1)' }], { duration: 500, fill: 'forwards' });
                })
                .catch(() => {
                    // Fallback se rodar fora do netlify apenas para testes UX visuais
                    setTimeout(() => {
                        form.style.display = 'none';
                        successMsg.classList.remove('hidden');
                        successMsg.animate([{ opacity: 0, transform: 'scale(0.95)' }, { opacity: 1, transform: 'scale(1)' }], { duration: 500, fill: 'forwards' });
                    }, 500);
                });
            }
        });
    }

    // 3. Optional Mouse Parallax for hero
    const bookWrapper = document.querySelector('.book-wrapper');
    const hero = document.querySelector('.hero');
    if (bookWrapper && hero && window.innerWidth > 992) {
        hero.addEventListener('mousemove', (e) => {
            const x = (window.innerWidth / 2 - e.pageX) / 45;
            const y = (window.innerHeight / 2 - e.pageY) / 45;
            bookWrapper.style.transform = `rotateY(${-8 + x}deg) rotateX(${4 + y}deg)`;
        });
        hero.addEventListener('mouseleave', () => { bookWrapper.style.transform = `rotateY(-8deg) rotateX(4deg)`; });
    }
});
