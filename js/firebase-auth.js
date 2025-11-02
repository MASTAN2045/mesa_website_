// Firebase Authentication for MESA Website
import { auth, MESA_CONFIG } from './firebase-config.js';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendEmailVerification
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

class MESAFirebaseAuth {
  constructor() {
    this.currentUser = null;
    this.init();
  }

  init() {
    // Listen for authentication state changes
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.handleUserLogin(user);
      } else {
        this.handleUserLogout();
      }
    });

    this.setupEventListeners();
  }

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
        joinForm.addEventListener('submit', (e) => this.handleRegistration(e));
      }
    });
  }

  // Handle user login
  async handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    // Validate email domain
    if (!this.validateEmail(email)) {
      this.showError('Please use a valid IIT Palakkad email address or admin email.');
      return;
    }

    try {
      this.showLoading('Signing in...');
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      this.showSuccess('Login successful!');
    } catch (error) {
      this.handleAuthError(error);
    } finally {
      this.hideLoading();
    }
  }

  // Handle user registration
  async handleRegistration(e) {
    e.preventDefault();
    const email = document.getElementById('joinEmail').value.trim();
    const name = document.getElementById('joinName').value.trim();
    const rollNumber = document.getElementById('rollNumber').value.trim();
    const password = this.generateTemporaryPassword();

    // Validate email domain
    if (!email.endsWith(MESA_CONFIG.allowedDomain)) {
      this.showError('Only IIT Palakkad students can register.');
      return;
    }

    try {
      this.showLoading('Creating account...');
      
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Send email verification
      await sendEmailVerification(userCredential.user);
      
      // Store additional user data in Firestore
      await this.storeUserData(userCredential.user.uid, {
        name,
        email,
        rollNumber,
        status: 'pending',
        createdAt: new Date(),
        role: 'member'
      });

      this.showSuccess(`Account created! Check your email for verification. Temporary password: ${password}`);
      document.getElementById('joinForm').reset();
      
    } catch (error) {
      this.handleAuthError(error);
    } finally {
      this.hideLoading();
    }
  }

  // Handle successful login
  handleUserLogin(user) {
    this.currentUser = user;
    
    // Check email domain
    if (!this.validateEmail(user.email)) {
      this.showError('Unauthorized email domain. Signing out...');
      this.logout();
      return;
    }

    // Determine user role
    const isAdmin = user.email === MESA_CONFIG.adminEmail;
    const role = isAdmin ? 'admin' : 'member';

    // Show authenticated content
    this.showAuthenticatedContent(user, role);
    
    console.log(`User logged in: ${user.email} (${role})`);
  }

  // Handle user logout
  handleUserLogout() {
    this.currentUser = null;
    this.showLoginForm();
    console.log('User logged out');
  }

  // Validate email domain
  validateEmail(email) {
    return email === MESA_CONFIG.adminEmail || email.endsWith(MESA_CONFIG.allowedDomain);
  }

  // Generate temporary password for new users
  generateTemporaryPassword() {
    return 'MESA' + Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  // Store user data in Firestore
  async storeUserData(uid, userData) {
    const { db } = await import('./firebase-config.js');
    const { doc, setDoc } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");
    
    await setDoc(doc(db, MESA_CONFIG.collections.members, uid), userData);
  }

  // Show authenticated content
  showAuthenticatedContent(user, role) {
    const loginSection = document.getElementById('loginSection');
    const adminPanel = document.getElementById('adminPanel');
    const userInfo = document.getElementById('userInfo');

    if (loginSection) loginSection.style.display = 'none';
    if (adminPanel) adminPanel.style.display = 'block';
    
    if (userInfo) {
      userInfo.innerHTML = `
        <div class="user-info">
          <i class="fas fa-user"></i>
          <span>${user.email}</span>
          <span class="role-badge ${role}">${role}</span>
          ${user.emailVerified ? '<i class="fas fa-check-circle verified" title="Email Verified"></i>' : '<i class="fas fa-exclamation-triangle unverified" title="Email Not Verified"></i>'}
        </div>
      `;
    }

    // Show/hide admin-only features
    const adminOnlyElements = document.querySelectorAll('.admin-only');
    adminOnlyElements.forEach(element => {
      element.style.display = role === 'admin' ? 'block' : 'none';
    });

    // Initialize dashboard if available
    if (window.mesaFirebaseEvents) {
      window.mesaFirebaseEvents.loadEvents();
    }
  }

  // Show login form
  showLoginForm() {
    const loginSection = document.getElementById('loginSection');
    const adminPanel = document.getElementById('adminPanel');

    if (loginSection) loginSection.style.display = 'block';
    if (adminPanel) adminPanel.style.display = 'none';
  }

  // Logout user
  async logout() {
    try {
      await signOut(auth);
      this.showSuccess('Logged out successfully!');
    } catch (error) {
      this.showError('Error signing out: ' + error.message);
    }
  }

  // Handle authentication errors
  handleAuthError(error) {
    let message = 'Authentication error occurred.';
    
    switch (error.code) {
      case 'auth/user-not-found':
        message = 'No account found with this email.';
        break;
      case 'auth/wrong-password':
        message = 'Incorrect password.';
        break;
      case 'auth/email-already-in-use':
        message = 'An account with this email already exists.';
        break;
      case 'auth/weak-password':
        message = 'Password should be at least 6 characters.';
        break;
      case 'auth/invalid-email':
        message = 'Invalid email address.';
        break;
      case 'auth/too-many-requests':
        message = 'Too many failed attempts. Please try again later.';
        break;
      default:
        message = error.message;
    }
    
    this.showError(message);
  }

  // Utility methods for UI feedback
  showError(message) {
    this.showNotification(message, 'error');
  }

  showSuccess(message) {
    this.showNotification(message, 'success');
  }

  showLoading(message) {
    // Create or update loading indicator
    let loader = document.getElementById('authLoader');
    if (!loader) {
      loader = document.createElement('div');
      loader.id = 'authLoader';
      loader.className = 'auth-loader';
      document.body.appendChild(loader);
    }
    loader.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${message}`;
    loader.style.display = 'block';
  }

  hideLoading() {
    const loader = document.getElementById('authLoader');
    if (loader) {
      loader.style.display = 'none';
    }
  }

  showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.firebase-notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `firebase-notification ${type}`;
    notification.innerHTML = `
      <i class="fas fa-${type === 'error' ? 'exclamation-circle' : type === 'success' ? 'check-circle' : 'info-circle'}"></i>
      <span>${message}</span>
      <button class="close-notification" onclick="this.parentElement.remove()">
        <i class="fas fa-times"></i>
      </button>
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

  // Public methods for external use
  getCurrentUser() {
    return this.currentUser;
  }

  isAdmin() {
    return this.currentUser && this.currentUser.email === MESA_CONFIG.adminEmail;
  }

  isAuthenticated() {
    return this.currentUser !== null;
  }

  isEmailVerified() {
    return this.currentUser && this.currentUser.emailVerified;
  }
}

// Initialize Firebase authentication
const mesaFirebaseAuth = new MESAFirebaseAuth();

// Export for use in other scripts
window.mesaFirebaseAuth = mesaFirebaseAuth;
export default mesaFirebaseAuth;
