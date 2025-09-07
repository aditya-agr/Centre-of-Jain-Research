document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle Logic
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const navMenu = document.getElementById('nav-menu');

    if (mobileMenuButton && navMenu) {
        mobileMenuButton.addEventListener('click', () => {
            navMenu.classList.toggle('nav__menu--active');
            const isExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';
            mobileMenuButton.setAttribute('aria-expanded', !isExpanded);
        });
    }

    // Add mobile menu styles dynamically
    const style = document.createElement('style');
    style.innerHTML = `
        @media (max-width: 1023px) {
            .nav__menu {
                display: none; position: absolute; top: 80px; left: 0; right: 0;
                background-color: white; box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                padding: 1rem; flex-direction: column; gap: 1rem;
            }
            .nav__menu--active { display: flex; }
            .nav__list { flex-direction: column; align-items: flex-start; }
        }
    `;
    document.head.appendChild(style);

    // Countdown Timer Logic
    const countdownDate = new Date("September 26, 2025 09:00:00").getTime();

    const countdownFunction = setInterval(() => {
        const now = new Date().getTime();
        const distance = countdownDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');
        
        if(daysEl && hoursEl && minutesEl && secondsEl) {
            daysEl.innerText = days < 10 ? '0' + days : days;
            hoursEl.innerText = hours < 10 ? '0' + hours : hours;
            minutesEl.innerText = minutes < 10 ? '0' + minutes : minutes;
            secondsEl.innerText = seconds < 10 ? '0' + seconds : seconds;
        }

        if (distance < 0) {
            clearInterval(countdownFunction);
            const countdownEl = document.getElementById("countdown");
            if(countdownEl) {
                countdownEl.innerHTML = "<div class='text-2xl font-bold p-4 bg-white rounded-lg shadow-md'>The Seminar has started!</div>";
            }
        }
    }, 1000);
});

