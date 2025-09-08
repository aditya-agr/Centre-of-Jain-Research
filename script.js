/**
 * Centre for Jain Studies - Main JavaScript File
 * Enhanced with modern ES6+ features, error handling, and accessibility
 */

class JainStudiesApp {
    constructor() {
        this.init();
    }

    init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupApp());
        } else {
            this.setupApp();
        }
    }

    setupApp() {
        try {
            this.setupMobileMenu();
            this.setupDropdownMenus();
            this.setupSmoothScrolling();
            this.setupAccessibility();
            this.setupAnimations();
            this.setupFormValidation();
            this.setupLazyLoading();
            this.setupGlimpsesSlider();
            console.log('Jain Studies App initialized successfully');
        } catch (error) {
            console.error('Error initializing Jain Studies App:', error);
        }
    }

    /**
     * Glimpses slider controls (prev/next) with smooth sliding and auto-play resume
     */
    setupGlimpsesSlider() {
        const container = document.querySelector('.marquee-container');
        const track = container?.querySelector('.marquee-content');
        const prevBtn = container?.parentElement?.querySelector('.marquee-prev');
        const nextBtn = container?.parentElement?.querySelector('.marquee-next');
        if (!container || !track || !prevBtn || !nextBtn) return;

        // Pause CSS auto animation while user interacts
        const getComputedTranslateX = (el) => {
            const style = window.getComputedStyle(el);
            const transform = style.transform || 'matrix(1, 0, 0, 1, 0, 0)';
            const match = transform.match(/matrix\([^,]+,[^,]+,[^,]+,[^,]+,\s*([^,]+),\s*([^\)]+)\)/);
            if (match) {
                const x = parseFloat(match[1]);
                return isNaN(x) ? 0 : x;
            }
            return 0;
        };

        const pauseAuto = () => {
            // Freeze current computed position into inline transform and stop animation
            const x = getComputedTranslateX(track);
            track.style.animationPlayState = 'paused';
            track.style.animation = 'none';
            track.style.transition = 'none';
            track.style.transform = `translateX(${x}px)`;
        };
        const resumeAuto = () => {
            // Clear inline transform/transition and let CSS animation run again
            track.style.transition = 'none';
            track.style.transform = '';
            track.style.animation = '';
            track.style.animationPlayState = 'running';
        };

        // Calculate one image width step (first child including margin)
        const getStep = () => {
            const first = track.querySelector('img');
            if (!first) return 0;
            const styles = window.getComputedStyle(first);
            const mr = parseFloat(styles.marginRight) || 0;
            return first.getBoundingClientRect().width + mr;
        };

        let isAnimating = false;
        const slide = (dir) => {
            if (isAnimating) return;
            const step = getStep();
            if (!step) return;
            isAnimating = true;
            pauseAuto();

            // Ensure inline baseline equals computed position
            const currentX = getComputedTranslateX(track);
            track.style.transition = 'none';
            track.style.transform = `translateX(${currentX}px)`;
            // Force reflow before animating
            // eslint-disable-next-line no-unused-expressions
            track.offsetHeight;
            const targetX = dir === 'next' ? currentX - step : currentX + step;

            track.style.transition = 'transform 500ms ease';
            track.style.transform = `translateX(${targetX}px)`;

            // After transition, reorder DOM for infinite effect
            track.addEventListener('transitionend', () => {
                track.style.transition = 'none';
                const imgs = track.querySelectorAll('img');
                if (imgs.length > 0) {
                    if (dir === 'next') {
                        // Move first image to end and reset X
                        track.appendChild(imgs[0]);
                        track.style.transform = `translateX(${currentX}px)`;
                    } else {
                        // Move last image to front and reset X
                        track.insertBefore(imgs[imgs.length - 1], imgs[0]);
                        track.style.transform = `translateX(${currentX}px)`;
                    }
                }
                // Force reflow then allow CSS animation again
                // eslint-disable-next-line no-unused-expressions
                track.offsetHeight;
                isAnimating = false;
                // Resume auto after short delay
                clearTimeout(this._glimpsesResumeT);
                this._glimpsesResumeT = setTimeout(() => resumeAuto(), 2000);
            }, { once: true });
        };

        nextBtn.addEventListener('click', () => slide('next'));
        prevBtn.addEventListener('click', () => slide('prev'));

        // Pause on hover/focus for accessibility
        container.addEventListener('mouseenter', pauseAuto);
        container.addEventListener('mouseleave', resumeAuto);
        container.addEventListener('focusin', pauseAuto);
        container.addEventListener('focusout', resumeAuto);
    }

    /**
     * Accessible Dropdown Menus (About)
     */
    setupDropdownMenus() {
        const dropdowns = document.querySelectorAll('.dropdown');
        if (dropdowns.length === 0) return;

        dropdowns.forEach((dropdown) => {
            const toggle = dropdown.querySelector('.dropdown__toggle');
            const menu = dropdown.querySelector('.dropdown__menu');
            if (!toggle || !menu) return;

            // Toggle on click/tap
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                const isOpen = dropdown.classList.contains('open');
                this.closeAllDropdowns();
                if (!isOpen) {
                    dropdown.classList.add('open');
                    toggle.setAttribute('aria-expanded', 'true');
                    menu.querySelector('a, button')?.focus();
                }
            });

            // Keyboard navigation
            toggle.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    dropdown.classList.add('open');
                    toggle.setAttribute('aria-expanded', 'true');
                    menu.querySelector('a, button')?.focus();
                }
            });

            menu.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.closeAllDropdowns();
                    toggle.focus();
                }
            });
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!(e.target instanceof Element)) return;
            const isInside = e.target.closest('.dropdown');
            if (!isInside) this.closeAllDropdowns();
        });

        // Close on Esc globally
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeAllDropdowns();
        });
    }

    closeAllDropdowns() {
        document.querySelectorAll('.dropdown.open').forEach((dd) => {
            dd.classList.remove('open');
            const toggle = dd.querySelector('.dropdown__toggle');
            if (toggle) toggle.setAttribute('aria-expanded', 'false');
        });
    }

    /**
     * Mobile Menu Setup with Enhanced Accessibility
     */
    setupMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const navMenu = document.getElementById('nav-menu');

        if (!mobileMenuButton || !navMenu) {
            console.warn('Mobile menu elements not found');
            return;
        }

        // Add click event listener
        mobileMenuButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleMobileMenu(mobileMenuButton, navMenu);
        });

        // Add keyboard support
        mobileMenuButton.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.toggleMobileMenu(mobileMenuButton, navMenu);
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !mobileMenuButton.contains(e.target)) {
                this.closeMobileMenu(mobileMenuButton, navMenu);
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeMobileMenu(mobileMenuButton, navMenu);
            }
        });

        // Handle window resize
        window.addEventListener('resize', this.debounce(() => {
            if (window.innerWidth >= 1280) {
                this.closeMobileMenu(mobileMenuButton, navMenu);
            }
        }, 250));
    }

    toggleMobileMenu(button, menu) {
        const isExpanded = button.getAttribute('aria-expanded') === 'true';
        
        if (isExpanded) {
            this.closeMobileMenu(button, menu);
        } else {
            this.openMobileMenu(button, menu);
        }
    }

    openMobileMenu(button, menu) {
        menu.classList.add('nav__menu--active');
        button.setAttribute('aria-expanded', 'true');
        button.setAttribute('aria-label', 'Close navigation menu');
        
        // Focus first menu item
        const firstMenuItem = menu.querySelector('.nav__link');
        if (firstMenuItem) {
            firstMenuItem.focus();
        }
    }

    closeMobileMenu(button, menu) {
        menu.classList.remove('nav__menu--active');
        button.setAttribute('aria-expanded', 'false');
        button.setAttribute('aria-label', 'Open navigation menu');
    }

    /**
     * Smooth Scrolling for Navigation Links
     */
    setupSmoothScrolling() {
        const navLinks = document.querySelectorAll('a[href^="#"]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                // Skip if it's just "#"
                if (href === '#') return;
                
                const targetElement = document.querySelector(href);
                
                if (targetElement) {
                    e.preventDefault();
                    this.smoothScrollTo(targetElement);
                }
            });
        });
    }

    smoothScrollTo(element) {
        const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
        const targetPosition = element.offsetTop - headerHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }

    /**
     * Enhanced Accessibility Features
     */
    setupAccessibility() {
        // Add skip link functionality
        const skipLink = document.querySelector('.skip-link');
        if (skipLink) {
            skipLink.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(skipLink.getAttribute('href'));
                if (target) {
                    target.focus();
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }

        // Add focus indicators for keyboard navigation
        this.addFocusIndicators();
        
        // Add ARIA live region for announcements
        this.setupLiveRegion();
    }

    addFocusIndicators() {
        const focusableElements = document.querySelectorAll(
            'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );

        focusableElements.forEach(element => {
            element.addEventListener('focus', () => {
                element.classList.add('focus-visible');
            });

            element.addEventListener('blur', () => {
                element.classList.remove('focus-visible');
            });
        });
    }

    setupLiveRegion() {
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.id = 'live-region';
        document.body.appendChild(liveRegion);
    }

    /**
     * Animation and Intersection Observer Setup
     */
    setupAnimations() {
        // Add intersection observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const animatedElements = document.querySelectorAll(
            '.info-card, .objective-item, .leadership-card, .research-card, .student-resource-card'
        );
        
        animatedElements.forEach(el => {
            observer.observe(el);
        });
    }

    /**
     * Form Validation Setup
     */
    setupFormValidation() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                if (!this.validateForm(form)) {
                    e.preventDefault();
                }
            });

            // Real-time validation
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.addEventListener('blur', () => {
                    this.validateField(input);
                });
            });
        });
    }

    validateForm(form) {
        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        const type = field.type;
        let isValid = true;
        let message = '';

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            message = 'This field is required';
        }

        // Email validation
        if (type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                message = 'Please enter a valid email address';
            }
        }

        // Phone validation
        if (type === 'tel' && value) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(value.replace(/\s/g, ''))) {
                isValid = false;
                message = 'Please enter a valid phone number';
            }
        }

        // Update field state
        this.updateFieldState(field, isValid, message);
        return isValid;
    }

    updateFieldState(field, isValid, message) {
        const errorElement = field.parentNode.querySelector('.error-message');
        
        if (isValid) {
            field.classList.remove('error');
            field.classList.add('valid');
            if (errorElement) {
                errorElement.remove();
            }
        } else {
            field.classList.remove('valid');
            field.classList.add('error');
            
            if (errorElement) {
                errorElement.textContent = message;
            } else {
                const errorDiv = document.createElement('div');
                errorDiv.className = 'error-message';
                errorDiv.textContent = message;
                field.parentNode.appendChild(errorDiv);
            }
        }
    }

    /**
     * Lazy Loading for Images
     */
    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src || img.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            const lazyImages = document.querySelectorAll('img[loading="lazy"]');
            lazyImages.forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    /**
     * Utility Functions
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    announceToScreenReader(message) {
        const liveRegion = document.getElementById('live-region');
        if (liveRegion) {
            liveRegion.textContent = message;
        }
    }

    /**
     * Public API Methods
     */
    scrollToSection(sectionId) {
        const element = document.getElementById(sectionId);
        if (element) {
            this.smoothScrollTo(element);
        }
    }

    toggleAnnouncement(show) {
        const announcementBox = document.querySelector('.announcement-box');
        if (announcementBox) {
            announcementBox.style.display = show ? 'block' : 'none';
        }
    }
}

// Initialize the application
const app = new JainStudiesApp();

// Expose app to global scope for external access
window.JainStudiesApp = app;

// Add CSS for focus indicators and animations
    const style = document.createElement('style');
style.textContent = `
    .skip-link {
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--primary-color);
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 1000;
        transition: top 0.3s;
    }
    
    .skip-link:focus {
        top: 6px;
    }
    
    .focus-visible {
        outline: 2px solid var(--primary-color);
        outline-offset: 2px;
    }
    
    .sr-only {
                position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
    }
    
    .error {
        border-color: #ef4444 !important;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
    
    .valid {
        border-color: #10b981 !important;
    }
    
    .error-message {
        color: #ef4444;
        font-size: 0.875rem;
        margin-top: 0.25rem;
    }
    
    .animate-in {
        animation: fadeInUp 0.6s ease-out forwards;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .announcement-link {
        color: var(--primary-color);
        text-decoration: none;
        font-weight: 600;
    }
    
    .announcement-link:hover {
        text-decoration: underline;
    }
    `;
    document.head.appendChild(style);
