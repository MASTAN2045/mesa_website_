// MESA Admin Authentication System
class MESAAuth {
    constructor() {
        this.allowedDomains = ['@smail.iitpkd.ac.in'];
        this.adminEmails = ['admin-mesa@iitpkd.ac.in'];
        this.currentUser = null;
        this.init();
    }

    init() {
        this.checkAuthStatus();
        this.setupEventListeners();
    }

    // Check if user is already authenticated
    checkAuthStatus() {
        const savedAuth = localStorage.getItem('mesaAuth');
        if (savedAuth) {
            try {
                const authData = JSON.parse(savedAuth);
                if (this.isValidSession(authData)) {
                    this.currentUser = authData;
                    this.showAuthenticatedContent();
                    return true;
                }
            } catch (e) {
                localStorage.removeItem('mesaAuth');
            }
        }
        this.showLoginForm();
        return false;
    }

    // Validate session (check if not expired)
    isValidSession(authData) {
        const now = new Date().getTime();
        const sessionExpiry = authData.timestamp + (24 * 60 * 60 * 1000); // 24 hours
        return now < sessionExpiry;
    }

    // Setup event listeners
    setupEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            const loginForm = document.getElementById('loginForm');
            const logoutBtn = document.getElementById('logoutBtn');
            const joinForm = document.getElementById('joinForm');

            if (loginForm) {
                loginForm.addEventListener('submit', (e) => this.handleLogin(e));
            }

            if (logoutBtn) {
                logoutBtn.addEventListener('click', () => this.logout());
            }

            if (joinForm) {
                joinForm.addEventListener('submit', (e) => this.handleJoinRequest(e));
            }
        });
    }

    // Handle login
    async handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        if (!this.validateEmail(email)) {
            this.showError('Please use a valid IIT Palakkad email address (@smail.iitpkd.ac.in) or admin email.');
            return;
        }

        // For demo purposes, we'll use simple password validation
        // In production, this should be handled by a backend server
        if (this.isAdminEmail(email)) {
            if (password === 'mesa2024admin') { // Change this in production
                this.authenticateUser(email, 'admin');
            } else {
                this.showError('Invalid admin credentials.');
            }
        } else {
            if (password === 'mesa2024') { // Change this in production
                this.authenticateUser(email, 'member');
            } else {
                this.showError('Invalid member credentials.');
            }
        }
    }

    // Validate email domain
    validateEmail(email) {
        if (this.isAdminEmail(email)) return true;
        return this.allowedDomains.some(domain => email.endsWith(domain));
    }

    // Check if email is admin
    isAdminEmail(email) {
        return this.adminEmails.includes(email);
    }

    // Authenticate user
    authenticateUser(email, role) {
        const authData = {
            email: email,
            role: role,
            timestamp: new Date().getTime()
        };

        this.currentUser = authData;
        localStorage.setItem('mesaAuth', JSON.stringify(authData));
        
        this.showSuccess(`Welcome ${role === 'admin' ? 'Admin' : 'Member'}!`);
        setTimeout(() => {
            this.showAuthenticatedContent();
        }, 1000);
    }

    // Handle member join request
    handleJoinRequest(e) {
        e.preventDefault();
        const email = document.getElementById('joinEmail').value.trim();
        const name = document.getElementById('joinName').value.trim();
        const rollNumber = document.getElementById('rollNumber').value.trim();

        if (!email.endsWith('@smail.iitpkd.ac.in')) {
            this.showError('Only IIT Palakkad students (@smail.iitpkd.ac.in) can join MESA.');
            return;
        }

        if (!name || !rollNumber) {
            this.showError('Please fill in all required fields.');
            return;
        }

        // Store join request (in production, send to backend)
        const joinRequest = {
            email: email,
            name: name,
            rollNumber: rollNumber,
            timestamp: new Date().toISOString(),
            status: 'pending'
        };

        let joinRequests = JSON.parse(localStorage.getItem('mesaJoinRequests') || '[]');
        joinRequests.push(joinRequest);
        localStorage.setItem('mesaJoinRequests', JSON.stringify(joinRequests));

        this.showSuccess('Join request submitted! Admin will review your application.');
        document.getElementById('joinForm').reset();
    }

    // Show authenticated content
    showAuthenticatedContent() {
        const loginSection = document.getElementById('loginSection');
        const adminPanel = document.getElementById('adminPanel');
        const userInfo = document.getElementById('userInfo');

        if (loginSection) loginSection.style.display = 'none';
        if (adminPanel) adminPanel.style.display = 'block';
        
        if (userInfo && this.currentUser) {
            userInfo.innerHTML = `
                <div class="user-info">
                    <i class="fas fa-user"></i>
                    <span>${this.currentUser.email}</span>
                    <span class="role-badge ${this.currentUser.role}">${this.currentUser.role}</span>
                </div>
            `;
        }

        // Show/hide admin-only features
        const adminOnlyElements = document.querySelectorAll('.admin-only');
        adminOnlyElements.forEach(element => {
            element.style.display = this.currentUser.role === 'admin' ? 'block' : 'none';
        });
    }

    // Show login form
    showLoginForm() {
        const loginSection = document.getElementById('loginSection');
        const adminPanel = document.getElementById('adminPanel');

        if (loginSection) loginSection.style.display = 'block';
        if (adminPanel) adminPanel.style.display = 'none';
    }

    // Logout
    logout() {
        localStorage.removeItem('mesaAuth');
        this.currentUser = null;
        this.showLoginForm();
        this.showSuccess('Logged out successfully!');
    }

    // Show error message
    showError(message) {
        this.showNotification(message, 'error');
    }

    // Show success message
    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    // Show notification
    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.auth-notification');
        existingNotifications.forEach(notification => notification.remove());
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `auth-notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'error' ? 'exclamation-circle' : type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Check if user is admin
    isAdmin() {
        return this.currentUser && this.currentUser.role === 'admin';
    }

    // Check if user is authenticated
    isAuthenticated() {
        return this.currentUser !== null;
    }
}

// Initialize authentication system
const mesaAuth = new MESAAuth();

// Export for use in other scripts
window.mesaAuth = mesaAuth;
