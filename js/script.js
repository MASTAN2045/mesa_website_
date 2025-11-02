// MESA Website JavaScript

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    initMobileMenu();
    initSmoothScrolling();
    initContactForm();
    initFAQ();
    initNewsletterForm();
    initScrollAnimations();
    initHeaderScroll();
    initIntroReveal();
    initPhotoSlider();
    initPhotoLightbox();
    initGSAPAnimations(); // Add GSAP animations
});

// Mobile Menu Toggle
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
        
        // Close menu when clicking on a link (but not dropdown toggles)
        const navLinksItems = document.querySelectorAll('.nav-links a:not(.dropdown-toggle)');
        navLinksItems.forEach(link => {
            link.addEventListener('click', function() {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
        
        // Handle dropdown toggles in mobile
        const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
        dropdownToggles.forEach(toggle => {
            toggle.addEventListener('click', function(e) {
                e.preventDefault();
                const dropdown = this.closest('.dropdown');
                const dropdownMenu = dropdown.querySelector('.dropdown-menu');
                
                // In mobile view, toggle the dropdown menu visibility
                if (window.innerWidth <= 768) {
                    dropdownMenu.classList.toggle('mobile-active');
                }
            });
        });
    }
}

// Smooth Scrolling for Anchor Links
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Contact Form Handling
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const formObject = {};
            
            formData.forEach((value, key) => {
                formObject[key] = value;
            });
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Simulate form submission (replace with actual API call)
            setTimeout(() => {
                // Show success message
                showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
                
                // Reset form
                this.reset();
                
                // Reset button
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }
}

// Newsletter Form Handling
function initNewsletterForm() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = this.querySelector('input[type="email"]').value;
            
            if (email) {
                // Show loading state
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Subscribing...';
                submitBtn.disabled = true;
                
                // Simulate subscription (replace with actual API call)
                setTimeout(() => {
                    showNotification('Successfully subscribed to our newsletter!', 'success');
                    this.reset();
                    
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }, 1500);
            }
        });
    }
}

// FAQ Accordion
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        if (question) {
            question.addEventListener('click', function() {
                const answer = item.querySelector('.faq-answer');
                const icon = this.querySelector('i');
                
                // Close other open items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        const otherAnswer = otherItem.querySelector('.faq-answer');
                        const otherIcon = otherItem.querySelector('.faq-question i');
                        
                        if (otherAnswer && otherIcon) {
                            otherAnswer.style.maxHeight = null;
                            otherIcon.style.transform = 'rotate(0deg)';
                        }
                    }
                });
                
                // Toggle current item
                if (answer && icon) {
                    if (answer.style.maxHeight) {
                        answer.style.maxHeight = null;
                        icon.style.transform = 'rotate(0deg)';
                    } else {
                        answer.style.maxHeight = answer.scrollHeight + 'px';
                        icon.style.transform = 'rotate(180deg)';
                    }
                }
            });
        }
    });
}

// Enhanced Scroll Animations with ScrollReveal
function initScrollAnimations() {
    // Check if ScrollReveal is available, if not use fallback
    if (typeof ScrollReveal !== 'undefined') {
        const sr = ScrollReveal({
            origin: 'bottom',
            distance: '60px',
            duration: 1000,
            delay: 200,
            easing: 'cubic-bezier(0.5, 0, 0, 1)',
            reset: false, // Disabled reverse animation - elements stay visible once animated
            viewFactor: 0.2,
            viewOffset: { top: 0, right: 0, bottom: 0, left: 0 },
            mobile: true,
            cleanup: true
        });

        // Hero section animations
        sr.reveal('.slide-title', {
            origin: 'top',
            distance: '80px',
            duration: 1200,
            delay: 300
        });

        sr.reveal('.slide-subtitle', {
            origin: 'bottom',
            distance: '60px',
            duration: 1000,
            delay: 500
        });

        // Section titles
        sr.reveal('.section-title', {
            origin: 'bottom',
            distance: '50px',
            duration: 800,
            delay: 200
        });

        // Feature cards with stagger
        sr.reveal('.feature-card', {
            origin: 'bottom',
            distance: '60px',
            duration: 800,
            delay: 200,
            interval: 200
        });

        // Event cards with stagger
        sr.reveal('.event-card', {
            origin: 'left',
            distance: '80px',
            duration: 800,
            delay: 250,
            interval: 200
        });

        // Timeline items (for events page)
        sr.reveal('.timeline-item', {
            origin: 'left',
            distance: '60px',
            duration: 800,
            delay: 200,
            interval: 150
        });

        // Team photos with stagger
        sr.reveal('.team-photo', {
            origin: 'bottom',
            distance: '60px',
            duration: 800,
            delay: 100,
            interval: 150
        });

        // Faculty advisor cards
        sr.reveal('.faculty-card', {
            origin: 'bottom',
            distance: '60px',
            duration: 800,
            delay: 200,
            interval: 200
        });

        // Team grid containers
        sr.reveal('.team-grid', {
            origin: 'bottom',
            distance: '30px',
            duration: 600,
            delay: 100
        });

        // Faculty grid container
        sr.reveal('.faculty-grid', {
            origin: 'bottom',
            distance: '30px',
            duration: 600,
            delay: 100
        });

        // Representatives grid container
        sr.reveal('.representatives-grid', {
            origin: 'bottom',
            distance: '30px',
            duration: 600,
            delay: 100
        });

        // Representative cards
        sr.reveal('.representative-card', {
            origin: 'bottom',
            distance: '60px',
            duration: 800,
            delay: 200,
            interval: 200
        });

        // Photo gallery sections
        sr.reveal('.gallery-section', {
            origin: 'bottom',
            distance: '80px',
            duration: 1000,
            delay: 300
        });

        // Photo items in gallery
        sr.reveal('.photo-item', {
            origin: 'bottom',
            distance: '40px',
            duration: 600,
            delay: 100,
            interval: 100
        });

        // Stats section - simplified for better performance
        sr.reveal('.stat-item', {
            origin: 'bottom',
            distance: '30px',
            duration: 600,
            interval: 80
        });

        // Logo animations removed - no reveal animation for MESA IIT Palakkad header text

        // Footer sections - removed animations as requested

        // Page headers
        sr.reveal('.page-header h1', {
            origin: 'top',
            distance: '80px',
            duration: 1000,
            delay: 300
        });

        sr.reveal('.page-header p', {
            origin: 'bottom',
            distance: '60px',
            duration: 800,
            delay: 500
        });

        // About page specific elements - synchronized timing
        sr.reveal('.about-text', {
            origin: 'left',
            distance: '80px',
            duration: 1000,
            delay: 200
        });

        sr.reveal('.about-image', {
            origin: 'right',
            distance: '80px',
            duration: 1000,
            delay: 200
        });

        // Mission & Vision cards
        sr.reveal('.mv-card', {
            origin: 'bottom',
            distance: '60px',
            duration: 800,
            delay: 200,
            interval: 300
        });

        // Activity cards (What We Do section) - both home and about page
        sr.reveal('.activity-card', {
            origin: 'bottom',
            distance: '60px',
            duration: 800,
            delay: 100,
            interval: 200
        });

        // Activities grid container
        sr.reveal('.activities-grid', {
            origin: 'bottom',
            distance: '40px',
            duration: 600,
            delay: 50
        });

        // Achievement items
        sr.reveal('.achievement-item', {
            origin: 'bottom',
            distance: '60px',
            duration: 800,
            delay: 200,
            interval: 200
        });

        // Buttons and CTAs
        sr.reveal('.btn, .cta-button', {
            origin: 'bottom',
            distance: '40px',
            duration: 600,
            delay: 300
        });

        // Academic Calendar animations
        sr.reveal('.calendar-header-info', {
            origin: 'top',
            distance: '60px',
            duration: 800,
            delay: 200
        });

        sr.reveal('.semester-section', {
            origin: 'bottom',
            distance: '60px',
            duration: 800,
            delay: 300,
            interval: 200
        });

        sr.reveal('.table-row', {
            origin: 'left',
            distance: '40px',
            duration: 600,
            delay: 100,
            interval: 30
        });

        // Events timeline container
        sr.reveal('.events-timeline', {
            origin: 'bottom',
            distance: '40px',
            duration: 600,
            delay: 100
        });

        // Gallery subtitle
        sr.reveal('.gallery-subtitle', {
            origin: 'bottom',
            distance: '30px',
            duration: 600,
            delay: 100
        });

        // About grid container
        sr.reveal('.about-grid', {
            origin: 'bottom',
            distance: '30px',
            duration: 600,
            delay: 50
        });

        // Mission vision grid
        sr.reveal('.mv-grid', {
            origin: 'bottom',
            distance: '30px',
            duration: 600,
            delay: 50
        });

        // Features grid container
        sr.reveal('.features-grid', {
            origin: 'bottom',
            distance: '30px',
            duration: 600,
            delay: 50
        });

        // Events grid container
        sr.reveal('.events-grid', {
            origin: 'bottom',
            distance: '30px',
            duration: 600,
            delay: 50
        });

        // Stats grid container
        sr.reveal('.stats-grid', {
            origin: 'bottom',
            distance: '30px',
            duration: 600,
            delay: 50
        });

        // Calendar main title
        sr.reveal('.calendar-main-title', {
            origin: 'top',
            distance: '40px',
            duration: 800,
            delay: 100
        });

        // Calendar subtitle
        sr.reveal('.calendar-subtitle', {
            origin: 'top',
            distance: '30px',
            duration: 700,
            delay: 200
        });

        // Table headers
        sr.reveal('.table-header', {
            origin: 'top',
            distance: '30px',
            duration: 600,
            delay: 150
        });

        // Semester titles
        sr.reveal('.semester-title', {
            origin: 'left',
            distance: '50px',
            duration: 700,
            delay: 100
        });

        // Faculty image containers
        sr.reveal('.faculty-image', {
            origin: 'bottom',
            distance: '40px',
            duration: 700,
            delay: 100
        });

        // Team photo overlays
        sr.reveal('.overlay', {
            origin: 'bottom',
            distance: '20px',
            duration: 500,
            delay: 200
        });

        // Sidebar calendar animation (calendar page only)
        sr.reveal('.sidebar-calendar', {
            origin: 'right',
            distance: '50px',
            duration: 800,
            delay: 500
        });

        console.log('ScrollReveal animations initialized');
    } else {
        // Fallback to Intersection Observer
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);
        
        // Observe elements for animation
        const animateElements = document.querySelectorAll('.feature-card, .event-card, .team-photo, .achievement-item, .activity-card, .timeline-item, .photo-item, .stat-item, .gallery-section, .about-text, .about-image, .mv-card, .faculty-card, .table-row, .sidebar-calendar, .calendar-header-info, .semester-section, .representative-card, .activities-grid, .team-grid, .faculty-grid, .representatives-grid, .events-timeline, .gallery-subtitle, .about-grid, .mv-grid, .features-grid, .events-grid, .stats-grid, .calendar-main-title, .calendar-subtitle, .table-header, .semester-title, .faculty-image, .overlay');
        animateElements.forEach(el => {
            observer.observe(el);
        });

        console.log('Fallback scroll animations initialized');
    }
}

// Header Scroll Effect - Background Change Only
function initHeaderScroll() {
    const header = document.querySelector('.header');

    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
}

// Page Intro Reveal (staggered)
function initIntroReveal() {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const splashPlayed = sessionStorage.getItem('mesaSplashPlayed') === 'true';

    const splash = document.getElementById('mesa-splash');
    const hero = document.querySelector('.hero-content');

    const revealHero = () => {
        if (!hero) return;
        const sequence = [
            hero.querySelector('.hero-title'),
            hero.querySelector('.hero-subtitle'),
            ...hero.querySelectorAll('.btn, .btn-primary, .btn-secondary, .btn-outline')
        ].filter(Boolean);
        sequence.forEach((el, idx) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(16px)';
            el.style.animation = `fadeInUp 0.6s ease-out forwards`;
            el.style.animationDelay = `${0.12 * idx}s`;
        });
    };

    if (!splash || splashPlayed || prefersReduced) {
        if (splash) splash.style.display = 'none';
        revealHero();
        return;
    }

    // Play splash then reveal
    setTimeout(() => {
        splash.style.transition = 'opacity 1500ms ease-out, visibility 1500ms ease-out';
        splash.style.opacity = '0';
        splash.style.visibility = 'hidden';
        setTimeout(() => {
            splash.remove();
            revealHero();
            sessionStorage.setItem('mesaSplashPlayed', 'true');
        }, 620);
    }, 9000);
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        hideNotification(notification);
    }, 5000);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        hideNotification(notification);
    });
}

function hideNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// Counter Animation for Stats
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number, .achievement-number');
    
    counters.forEach(counter => {
        // Skip if already animated
        if (counter.dataset.animated === 'true') return;
        counter.dataset.animated = 'true';
        
        const target = parseInt(counter.textContent.replace(/\D/g, ''));
        const hasPlus = counter.textContent.includes('+');
        const duration = 1200; // Faster - 1.2 seconds instead of 2
        const startTime = performance.now();
        
        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(easeOutQuart * target);
            
            counter.textContent = current + (hasPlus ? '+' : '');
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target + (hasPlus ? '+' : '');
            }
        };
        
        requestAnimationFrame(updateCounter);
    });
}

// Initialize counter animation when stats section is visible - optimized
const statsObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Delay counter animation slightly to let ScrollReveal finish
            setTimeout(() => {
                animateCounters();
            }, 300);
            statsObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.3 // Trigger when 30% visible
});

const statsSection = document.querySelector('.stats, .achievements');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// Form Validation
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('error');
            isValid = false;
        } else {
            input.classList.remove('error');
        }
        
        // Email validation
        if (input.type === 'email' && input.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value)) {
                input.classList.add('error');
                isValid = false;
            }
        }
    });
    
    return isValid;
}

// Add CSS for animations and notifications
const style = document.createElement('style');
style.textContent = `
    .nav-links.active {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: #0f1115;
        border-top: 1px solid rgba(249,115,22,0.25);
        box-shadow: 0 5px 15px rgba(0,0,0,0.25);
        padding: 20px;
        z-index: 1000;
    }
    
    .hamburger.active span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }
    
    .hamburger.active span:nth-child(2) {
        opacity: 0;
    }
    
    .hamburger.active span:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
    }
    
    .header.scrolled {
        background: rgba(17, 24, 39, 0.95);
        box-shadow: 0 2px 20px rgba(0,0,0,0.35);
    }
    
    .animate-in {
        animation: fadeInUp 0.6s ease-out forwards;
    }
    
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 400px;
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification-success {
        border-left: 4px solid #10b981;
    }
    
    .notification-info {
        border-left: 4px solid #3b82f6;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        padding: 15px 20px;
        gap: 10px;
    }
    
    .notification-content i {
        color: #10b981;
        font-size: 1.2rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #666;
        margin-left: auto;
    }
    
    .form-group input.error,
    .form-group select.error,
    .form-group textarea.error {
        border-color: #ef4444;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
    
    .faq-answer {
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.3s ease;
    }
    
    .faq-question i {
        transition: transform 0.3s ease;
    }
    
    @media (max-width: 768px) {
        .nav-links {
            display: none;
        }
        
        .nav-links.active {
            display: flex;
        }
    }
`;
document.head.appendChild(style);

// Photo Slider Functionality
let currentSlideIndex = 0;
let slideInterval;
let isSliderPaused = false;
let pauseTimeout;

function initPhotoSlider() {
    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.indicator');
    
    if (slides.length === 0) {
        console.log('No slides found for photo slider');
        return;
    }
    
    console.log(`Photo slider initialized with ${slides.length} slides`);
    
    // Ensure only first slide is visible initially
    slides.forEach((slide, index) => {
        if (index === 0) {
            slide.classList.add('active');
        } else {
            slide.classList.remove('active');
        }
    });
    
    // Initialize first slide
    showSlide(0);
    
    // Start auto-slide with delay to coordinate with logo animation (9s total)
    setTimeout(() => {
        startAutoSlide();
    }, 10000); // Wait 10 seconds - logo animation (9s) + 1s buffer for smooth transition
    
    // Pause auto-slide on hover over the entire photo slider section
    const photoSliderSection = document.querySelector('.photo-slider');
    if (photoSliderSection) {
        let isHovering = false;
        
        photoSliderSection.addEventListener('mouseenter', () => {
            isHovering = true;
            isSliderPaused = true;
            stopAutoSlide();
            console.log('Auto-slide paused - mouse entered slider area');
            
            // Clear any existing pause timeout
            if (pauseTimeout) {
                clearTimeout(pauseTimeout);
            }
        });
        
        photoSliderSection.addEventListener('mouseleave', () => {
            isHovering = false;
            isSliderPaused = false;
            
            // Clear any existing pause timeout
            if (pauseTimeout) {
                clearTimeout(pauseTimeout);
            }
            
            // Resume auto-slide after a short delay
            pauseTimeout = setTimeout(() => {
                if (!isHovering && !isSliderPaused) {
                    startAutoSlide();
                    console.log('Auto-slide resumed - mouse left slider area');
                }
            }, 200);
        });
    }
    
    // Add click listeners to navigation buttons
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            stopAutoSlide();
            changeSlide(-1);
            // Restart auto-slide after a longer delay to prevent conflicts
            setTimeout(() => {
                if (!isSliderPaused) {
                    startAutoSlide();
                }
            }, 2500);
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            stopAutoSlide();
            changeSlide(1);
            // Restart auto-slide after a longer delay to prevent conflicts
            setTimeout(() => {
                if (!isSliderPaused) {
                    startAutoSlide();
                }
            }, 2500);
        });
    }
    
    // Add click listeners to indicators
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            stopAutoSlide();
            showSlide(index);
            // Restart auto-slide after a longer delay to prevent conflicts
            setTimeout(() => {
                if (!isSliderPaused) {
                    startAutoSlide();
                }
            }, 2500);
        });
    });
    
    // Safety mechanism: ensure auto-slide is always running when not paused
    setInterval(() => {
        if (!isSliderPaused && !slideInterval) {
            console.log('Safety restart: Auto-slide was stopped, restarting...');
            startAutoSlide();
        }
    }, 5000); // Check every 5 seconds
}

function showSlide(index) {
    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.indicator');
    
    if (slides.length === 0) return;
    
    // Wrap around if index is out of bounds
    if (index >= slides.length) {
        currentSlideIndex = 0;
    } else if (index < 0) {
        currentSlideIndex = slides.length - 1;
    } else {
        currentSlideIndex = index;
    }
    
    // Remove active class from all slides and indicators
    slides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));
    
    // Force reflow to ensure the removal is processed
    slides[0].offsetHeight;
    
    // Add active class to current slide and indicator
    if (slides[currentSlideIndex]) {
        slides[currentSlideIndex].classList.add('active');
    }
    if (indicators[currentSlideIndex]) {
        indicators[currentSlideIndex].classList.add('active');
    }
    
    console.log(`Showing slide ${currentSlideIndex}`);
}

function changeSlide(direction) {
    showSlide(currentSlideIndex + direction);
}

function currentSlide(index) {
    showSlide(index - 1); // Convert to 0-based index
}

function startAutoSlide() {
    stopAutoSlide(); // Clear any existing interval
    slideInterval = setInterval(() => {
        changeSlide(1);
    }, 5000); // Change slide every 5 seconds - slightly longer for better user experience after logo animation
}

// Sidebar Calendar Functionality
function initSidebarCalendar() {
        const sidebarCalendar = document.getElementById('sidebarCalendar');
        const sidebarToggle = document.getElementById('sidebarToggle');
        const sidebarMonthYear = document.getElementById('sidebarMonthYear');
        const sidebarDays = document.getElementById('sidebarDays');
        const sidebarPrevMonth = document.getElementById('sidebarPrevMonth');
        const sidebarNextMonth = document.getElementById('sidebarNextMonth');

        if (!sidebarCalendar) return;

        let currentDate = new Date();
        let currentMonth = currentDate.getMonth();
        let currentYear = currentDate.getFullYear();

        // Sample events data
        const events = {
            '2025-10-15': { type: 'workshop', icon: 'fas fa-wrench', title: 'CAD Workshop' },
            '2025-10-21': { type: 'seminar', icon: 'fas fa-microphone', title: 'Tech Talk' },
            '2025-10-28': { type: 'competition', icon: 'fas fa-trophy', title: 'Design Contest' },
            '2025-11-05': { type: 'community', icon: 'fas fa-users', title: 'Networking Event' },
            '2025-11-12': { type: 'workshop', icon: 'fas fa-wrench', title: 'Manufacturing Workshop' },
            '2025-11-18': { type: 'seminar', icon: 'fas fa-microphone', title: 'Industry Talk' }
        };

        function generateSidebarCalendar(month, year) {
            const firstDay = new Date(year, month, 1).getDay();
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            const today = new Date();
            
            sidebarMonthYear.textContent = new Date(year, month).toLocaleDateString('en-US', { 
                month: 'long', 
                year: 'numeric' 
            });

            let daysHTML = '';

            // Previous month's trailing days
            const prevMonthDays = new Date(year, month, 0).getDate();
            for (let i = firstDay - 1; i >= 0; i--) {
                const day = prevMonthDays - i;
                daysHTML += `<div class="sidebar-day other-month">${day}</div>`;
            }

            // Current month days
            for (let day = 1; day <= daysInMonth; day++) {
                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
                const hasEvent = events[dateStr];
                
                let classes = 'sidebar-day';
                if (isToday) classes += ' today';
                if (hasEvent) classes += ' has-event';

                let eventIcon = '';
                if (hasEvent) {
                    eventIcon = `<div class="sidebar-event-icon" title="${hasEvent.title}">
                        <i class="${hasEvent.icon}"></i>
                    </div>`;
                }

                daysHTML += `<div class="${classes}" data-date="${dateStr}">
                    ${day}
                    ${eventIcon}
                </div>`;
            }

            // Next month's leading days
            const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;
            const remainingCells = totalCells - (firstDay + daysInMonth);
            for (let day = 1; day <= remainingCells; day++) {
                daysHTML += `<div class="sidebar-day other-month">${day}</div>`;
            }

            sidebarDays.innerHTML = daysHTML;

            // Add click events to days with events
            document.querySelectorAll('.sidebar-day.has-event').forEach(day => {
                day.addEventListener('click', function() {
                    const dateStr = this.dataset.date;
                    const event = events[dateStr];
                    if (event) {
                        showEventTooltip(event, this);
                    }
                });
            });
        }

        function showEventTooltip(event, element) {
            // Remove existing tooltips
            document.querySelectorAll('.event-tooltip').forEach(tooltip => tooltip.remove());

            const tooltip = document.createElement('div');
            tooltip.className = 'event-tooltip';
            tooltip.innerHTML = `
                <div class="tooltip-header">
                    <i class="${event.icon}"></i>
                    <span>${event.title}</span>
                </div>
            `;
            
            tooltip.style.cssText = `
                position: absolute;
                background: var(--bg-card);
                border: 2px solid var(--color-gold);
                border-radius: 0.5rem;
                padding: 0.75rem;
                font-size: 0.8rem;
                box-shadow: var(--shadow-medium);
                z-index: 1002;
                white-space: nowrap;
                top: -40px;
                left: 50%;
                transform: translateX(-50%);
            `;

            element.style.position = 'relative';
            element.appendChild(tooltip);

            // Remove tooltip after 3 seconds
            setTimeout(() => tooltip.remove(), 3000);
        }

        // Initialize calendar on load
        generateSidebarCalendar(currentMonth, currentYear);

        // Navigation
        sidebarPrevMonth.addEventListener('click', () => {
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            generateSidebarCalendar(currentMonth, currentYear);
        });

        sidebarNextMonth.addEventListener('click', () => {
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            generateSidebarCalendar(currentMonth, currentYear);
        });

        // Toggle functionality
        sidebarToggle.addEventListener('click', () => {
            sidebarCalendar.classList.toggle('hidden');
            const icon = sidebarToggle.querySelector('i');
            if (sidebarCalendar.classList.contains('hidden')) {
                icon.className = 'fas fa-calendar-alt';
            } else {
                icon.className = 'fas fa-times';
            }
        });

        // Initialize calendar
        generateSidebarCalendar(currentMonth, currentYear);

        // Add scroll reveal animation
        if (typeof ScrollReveal !== 'undefined') {
            ScrollReveal().reveal('.sidebar-calendar', {
                origin: 'right',
                distance: '50px',
                duration: 800,
                delay: 500
            });
        }
    }

// Initialize sidebar calendar only on calendar page
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the calendar page
    if (document.body.classList.contains('calendar-page')) {
        initSidebarCalendar();
    }
});

function stopAutoSlide() {
    if (slideInterval) {
        clearInterval(slideInterval);
        slideInterval = null;
        console.log('Auto-slide stopped');
    }
}

function restartAutoSlide() {
    stopAutoSlide();
    setTimeout(() => {
        if (!isSliderPaused) {
            startAutoSlide();
        }
    }, 2000); // Restart after 2 second delay to prevent conflicts
}

// Force restart auto-slide if it gets stuck
function forceRestartAutoSlide() {
    stopAutoSlide();
    setTimeout(() => {
        startAutoSlide();
    }, 100);
}

// Make functions global so they can be called from HTML onclick attributes
window.changeSlide = changeSlide;
window.currentSlide = currentSlide;

// Photo Lightbox Functionality
function initPhotoLightbox() {
    const photoItems = document.querySelectorAll('.photo-item');
    const lightbox = document.getElementById('photoLightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxClose = document.getElementById('lightboxClose');
    
    if (!lightbox || !lightboxImage || !lightboxClose) {
        console.log('Lightbox elements not found');
        return;
    }
    
    // Add click listeners to all photo items
    photoItems.forEach(photoItem => {
        photoItem.addEventListener('click', function() {
            const img = this.querySelector('img');
            if (img) {
                openLightbox(img.src, img.alt);
            }
        });
        
        // Add keyboard support
        photoItem.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const img = this.querySelector('img');
                if (img) {
                    openLightbox(img.src, img.alt);
                }
            }
        });
        
        // Make photo items focusable
        photoItem.setAttribute('tabindex', '0');
        photoItem.setAttribute('role', 'button');
        photoItem.setAttribute('aria-label', 'View full size image');
    });
    
    // Close lightbox when clicking close button
    lightboxClose.addEventListener('click', closeLightbox);
    
    // Close lightbox when clicking outside the image
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Close lightbox with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
    
    function openLightbox(imageSrc, imageAlt) {
        lightboxImage.src = imageSrc;
        lightboxImage.alt = imageAlt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
        
        // Focus the close button for accessibility
        setTimeout(() => {
            lightboxClose.focus();
        }, 100);
    }
    
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
        
        // Clear the image source to save memory
        setTimeout(() => {
            if (!lightbox.classList.contains('active')) {
                lightboxImage.src = '';
                lightboxImage.alt = '';
            }
        }, 300);
    }
}

// GSAP ScrollTrigger Animations
function initGSAPAnimations() {
    // Check if GSAP and ScrollTrigger are available
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.log('GSAP or ScrollTrigger not available, skipping GSAP animations');
        return;
    }

    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Animate upcoming events scroll section
    gsap.fromTo('.upcoming-events-scroll .section-title', 
        {
            opacity: 0,
            y: 50
        },
        {
            opacity: 1,
            y: 0,
            duration: 1,
            scrollTrigger: {
                trigger: '.upcoming-events-scroll',
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'play reverse play reverse',
                scrub: true
            }
        }
    );

    // Animate event scroll cards with stagger
    gsap.fromTo('.event-scroll-card', 
        {
            opacity: 0,
            x: 100,
            scale: 0.8
        },
        {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.2,
            scrollTrigger: {
                trigger: '.events-scroll-container',
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'play reverse play reverse',
                scrub: true
            }
        }
    );

    // Animate feature cards - optimized for home page
    gsap.fromTo('.feature-card', 
        {
            opacity: 0,
            y: 60,
            rotationX: 15
        },
        {
            opacity: 1,
            y: 0,
            rotationX: 0,
            duration: 0.8,
            stagger: 0.2,
            scrollTrigger: {
                trigger: '.features',
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            }
        }
    );

    // Animate recent events - optimized for home page
    gsap.fromTo('.event-card', 
        {
            opacity: 0,
            y: 50,
            scale: 0.9
        },
        {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.15,
            scrollTrigger: {
                trigger: '.recent-events',
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            }
        }
    );

    // Stats section animation handled by ScrollReveal only for better performance

    // Animate team photos (excluding header and footer)
    gsap.fromTo('.team-photo', 
        {
            opacity: 0,
            y: 40,
            rotationY: 15
        },
        {
            opacity: 1,
            y: 0,
            rotationY: 0,
            duration: 0.8,
            stagger: 0.15,
            scrollTrigger: {
                trigger: '.team-photos, .representatives-grid, .core-team, .event-coordinators, .technical-team',
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'play reverse play reverse',
                scrub: true
            }
        }
    );

    // Animate calendar elements (for calendar page)
    if (document.querySelector('.calendar-container')) {
        gsap.fromTo('.calendar-container', 
            {
                opacity: 0,
                scale: 0.8,
                y: 50
            },
            {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 1.2,
                scrollTrigger: {
                    trigger: '.interactive-calendar',
                    start: 'top 80%',
                    end: 'bottom 20%',
                    toggleActions: 'play reverse play reverse',
                    scrub: true
                }
            }
        );

        gsap.fromTo('.legend-item', 
            {
                opacity: 0,
                x: -50,
                rotationX: 10
            },
            {
                opacity: 1,
                x: 0,
                rotationX: 0,
                duration: 0.8,
                stagger: 0.1,
                scrollTrigger: {
                    trigger: '.calendar-legend-section',
                    start: 'top 80%',
                    end: 'bottom 20%',
                    toggleActions: 'play reverse play reverse',
                    scrub: true
                }
            }
        );
    }

    // Animate about page elements - synchronized timing
    if (document.querySelector('.about-content')) {
        gsap.fromTo('.about-text, .about-image', 
            {
                opacity: 0,
                y: 50
            },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                stagger: 0.1, // Reduced stagger for simultaneous appearance
                scrollTrigger: {
                    trigger: '.about-content',
                    start: 'top 80%',
                    end: 'bottom 20%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
    }

    console.log('GSAP ScrollTrigger animations initialized');
}

