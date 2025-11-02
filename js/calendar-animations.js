// Simple Calendar Page Animations
document.addEventListener('DOMContentLoaded', function() {
    // Check if ScrollReveal is available
    if (typeof ScrollReveal === 'undefined') {
        console.log('ScrollReveal not available for calendar animations');
        return;
    }

    // Only run on calendar page to avoid conflicts
    if (!document.querySelector('.mesa-calendar-section')) {
        return;
    }

    // Simple configuration for better performance
    const sr = ScrollReveal({
        origin: 'bottom',
        distance: '40px',
        duration: 600,
        delay: 100,
        easing: 'ease-out',
        reset: false,
        mobile: true,
        cleanup: false // Disable cleanup to avoid conflicts with dynamic content
    });

    // Only animate static elements - Page Header
    sr.reveal('.page-header h1', {
        origin: 'top',
        distance: '50px',
        duration: 800,
        delay: 200
    });

    sr.reveal('.page-header p', {
        origin: 'bottom',
        distance: '30px',
        duration: 600,
        delay: 300
    });

    // Calendar Container - Simple animation
    sr.reveal('.mesa-calendar-container', {
        origin: 'bottom',
        distance: '50px',
        duration: 800,
        delay: 400
    });

    console.log('Simple calendar animations initialized');
});
