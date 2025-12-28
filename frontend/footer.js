/**
 * CSS BERLIN - Interactive Footer JavaScript
 * Features: Newsletter validation, Back-to-top, Mobile accordion
 */

(function() {
    'use strict';

    // ==================
    // NEWSLETTER FORM
    // ==================
    const newsletterForm = document.getElementById('newsletterForm');
    const newsletterEmail = document.getElementById('newsletterEmail');
    const newsletterMessage = document.getElementById('newsletterMessage');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const email = newsletterEmail.value.trim();
            const privacyChecked = document.getElementById('newsletterPrivacy').checked;

            // Validation
            if (!validateEmail(email)) {
                showMessage('Bitte gib eine gültige E-Mail-Adresse ein.', 'error');
                return;
            }

            if (!privacyChecked) {
                showMessage('Bitte akzeptiere die Datenschutzerklärung.', 'error');
                return;
            }

            // Submit to backend (placeholder - replace with actual API endpoint)
            try {
                // Simulate API call
                await submitNewsletter(email);
                showMessage('✓ Vielen Dank! Bitte bestätige deine E-Mail-Adresse.', 'success');
                newsletterForm.reset();
            } catch (error) {
                showMessage('Fehler beim Anmelden. Bitte versuche es später erneut.', 'error');
            }
        });
    }

    function validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    function showMessage(text, type) {
        newsletterMessage.textContent = text;
        newsletterMessage.className = `newsletter-message ${type}`;

        // Auto-hide after 5 seconds
        setTimeout(() => {
            newsletterMessage.className = 'newsletter-message';
        }, 5000);
    }

    async function submitNewsletter(email) {
        // Placeholder for actual backend integration
        // Replace with your backend API endpoint
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Save to localStorage for demo
                const subscribers = JSON.parse(localStorage.getItem('cssberlin_newsletter') || '[]');
                if (!subscribers.includes(email)) {
                    subscribers.push(email);
                    localStorage.setItem('cssberlin_newsletter', JSON.stringify(subscribers));
                }
                resolve();
            }, 1000);
        });

        // Example with backend API:
        /*
        const response = await fetch('/api/newsletter/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email })
        });

        if (!response.ok) {
            throw new Error('Subscription failed');
        }

        return await response.json();
        */
    }

    // ==================
    // BACK TO TOP BUTTON
    // ==================
    const backToTopBtn = document.getElementById('backToTop');

    if (backToTopBtn) {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        // Scroll to top on click
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ==================
    // MOBILE ACCORDION
    // ==================
    function initMobileAccordion() {
        // Only activate on mobile (< 768px)
        if (window.innerWidth >= 768) {
            return;
        }

        const footerColumns = document.querySelectorAll('.footer-column');

        footerColumns.forEach(column => {
            // Skip brand column (always open)
            if (column.classList.contains('footer-brand')) {
                return;
            }

            const heading = column.querySelector('h4');
            if (!heading) return;

            // Make clickable
            heading.style.cursor = 'pointer';

            heading.addEventListener('click', () => {
                // Toggle active state
                const isActive = column.classList.contains('active');

                // Close all other columns (optional - remove to allow multiple open)
                /*
                footerColumns.forEach(col => {
                    if (col !== column) {
                        col.classList.remove('active');
                    }
                });
                */

                // Toggle current column
                if (isActive) {
                    column.classList.remove('active');
                } else {
                    column.classList.add('active');
                }
            });
        });
    }

    // Initialize on page load
    initMobileAccordion();

    // Re-initialize on window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // Remove all active states when switching to desktop
            if (window.innerWidth >= 768) {
                document.querySelectorAll('.footer-column').forEach(col => {
                    col.classList.remove('active');
                });
            } else {
                initMobileAccordion();
            }
        }, 250);
    });

    // ==================
    // COOKIE SETTINGS LINK
    // ==================
    const cookieSettingsLink = document.getElementById('cookieSettingsLink');

    if (cookieSettingsLink) {
        cookieSettingsLink.addEventListener('click', (e) => {
            // If cookie consent modal exists, open it instead of navigating
            if (typeof window.openCookieSettings === 'function') {
                e.preventDefault();
                window.openCookieSettings();
            }
            // Otherwise, let the link navigate to cookie.html normally
        });
    }

    // ==================
    // SOCIAL MEDIA TRACKING (Optional)
    // ==================
    const socialIcons = document.querySelectorAll('.social-icon');

    socialIcons.forEach(icon => {
        icon.addEventListener('click', (e) => {
            const platform = icon.getAttribute('aria-label');

            // Track click with analytics (if available)
            if (typeof gtag === 'function') {
                gtag('event', 'social_click', {
                    'social_network': platform,
                    'social_action': 'click',
                    'social_target': icon.href
                });
            }

            // Also log to console for debugging
            console.log(`Social media click: ${platform}`);
        });
    });

    // ==================
    // FOOTER LINK TRACKING (Optional)
    // ==================
    const footerLinks = document.querySelectorAll('.footer-column a, .footer-bottom-links a');

    footerLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const linkText = link.textContent.trim();
            const linkHref = link.href;

            // Track with analytics (if available)
            if (typeof gtag === 'function') {
                gtag('event', 'footer_link_click', {
                    'link_text': linkText,
                    'link_url': linkHref
                });
            }

            // Log to console for debugging
            console.log(`Footer link click: ${linkText} -> ${linkHref}`);
        });
    });

    // ==================
    // ACCESSIBILITY: ESC KEY TO CLOSE MODALS
    // ==================
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // Close any open modals/overlays
            const activeModals = document.querySelectorAll('.modal.active, .overlay.active');
            activeModals.forEach(modal => {
                modal.classList.remove('active');
            });
        }
    });

    console.log('✓ Footer interactivity initialized');
})();
