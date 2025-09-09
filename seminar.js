// Countdown Timer Logic
const countdown = () => {
    const countDate = new Date("September 26, 2025 10:30:00").getTime();
    const now = new Date().getTime();
    const gap = countDate - now;

    // Time calculations
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    // Calculate the values
    const textDay = Math.floor(gap / day);
    const textHour = Math.floor((gap % day) / hour);
    const textMinute = Math.floor((gap % hour) / minute);
    const textSecond = Math.floor((gap % minute) / second);

    // Update the DOM
    document.getElementById('days').innerText = textDay > 0 ? textDay : '0';
    document.getElementById('hours').innerText = textHour >= 0 ? textHour : '0';
    document.getElementById('minutes').innerText = textMinute >= 0 ? textMinute : '0';
    document.getElementById('seconds').innerText = textSecond >= 0 ? textSecond : '0';
};

// Run countdown every second
setInterval(countdown, 1000);

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function () {
    
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const navMenu = document.getElementById('nav-menu');

    if (mobileMenuButton && navMenu) {
        mobileMenuButton.addEventListener('click', () => {
            // In a real mobile view, we would toggle a class to show/hide the menu.
            // Since we're using Tailwind for larger screens which hides this logic,
            // we'll prepare the logic for a custom mobile menu implementation.
            
            navMenu.classList.toggle('nav__menu--active');

            // For accessibility
            const isExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';
            mobileMenuButton.setAttribute('aria-expanded', !isExpanded);
        });
    }

    // A simple fix for Tailwind's `hidden` class in case it gets stuck on resize
    // This is more complex with Tailwind, so we'll add a CSS class for mobile menu
    // And let CSS handle the display property.
    const style = document.createElement('style');
    style.innerHTML = `
        @media (max-width: 1023px) {
            .nav__menu {
                display: none;
                position: absolute;
                top: 70px; /* height of navbar */
                left: 0;
                right: 0;
                background-color: white;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                padding: 1rem;
                flex-direction: column;
                gap: 1rem;
            }
            .nav__menu--active {
                display: flex;
            }
            .nav__list {
                flex-direction: column;
                align-items: flex-start;
            }
        }
    `;
    document.head.appendChild(style);

    // Collapsible Committee Section
    const committeeToggle = document.querySelector('.collapsible-toggle');
    const committeeContent = document.querySelector('.collapsible-content');

    if (committeeToggle && committeeContent) {
        committeeToggle.addEventListener('click', () => {
            committeeToggle.classList.toggle('open');
            committeeContent.classList.toggle('open');
        });
    }
});

