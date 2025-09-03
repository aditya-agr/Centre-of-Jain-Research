document.addEventListener('DOMContentLoaded', () => {
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
});
