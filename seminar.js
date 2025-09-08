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
    const menuButton = document.getElementById('mobile-menu-button');
    const navMenu = document.getElementById('nav-menu');

    if (menuButton && navMenu) {
        menuButton.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

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

