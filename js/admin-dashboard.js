// MESA Admin Dashboard - Event Management System
class MESAAdminDashboard {
    constructor() {
        this.events = [];
        this.categories = {};
        this.init();
    }

    async init() {
        await this.loadEvents();
        this.setupEventListeners();
        this.renderEventsList();
        this.renderJoinRequests();
    }

    // Load events from JSON file
    async loadEvents() {
        try {
            const response = await fetch('data/calendar.json');
            const data = await response.json();
            this.events = data.events || [];
            this.categories = data.categories || {};
        } catch (error) {
            console.error('Error loading events:', error);
            this.showNotification('Error loading events data', 'error');
        }
    }

    // Setup event listeners
    setupEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            const addEventBtn = document.getElementById('addEventBtn');
            const eventForm = document.getElementById('eventForm');
            const cancelEventBtn = document.getElementById('cancelEvent');

            if (addEventBtn) {
                addEventBtn.addEventListener('click', () => this.showEventForm());
            }

            if (eventForm) {
                eventForm.addEventListener('submit', (e) => this.handleEventSubmit(e));
            }

            if (cancelEventBtn) {
                cancelEventBtn.addEventListener('click', () => this.hideEventForm());
            }
        });
    }

    // Show event form
    showEventForm(event = null) {
        const formSection = document.getElementById('eventFormSection');
        const formTitle = document.getElementById('formTitle');
        
        if (formSection) {
            formSection.style.display = 'block';
            formTitle.textContent = event ? 'Edit Event' : 'Add New Event';
            
            if (event) {
                this.populateEventForm(event);
            } else {
                document.getElementById('eventForm').reset();
                document.getElementById('eventId').value = '';
            }
        }
    }

    // Hide event form
    hideEventForm() {
        const formSection = document.getElementById('eventFormSection');
        if (formSection) {
            formSection.style.display = 'none';
        }
    }

    // Populate event form with existing data
    populateEventForm(event) {
        document.getElementById('eventId').value = event.id;
        document.getElementById('eventTitle').value = event.title;
        document.getElementById('eventDate').value = event.date;
        document.getElementById('eventTime').value = event.time;
        document.getElementById('eventLocation').value = event.location;
        document.getElementById('eventCategory').value = event.category;
        document.getElementById('eventDescription').value = event.description;
        document.getElementById('eventStatus').value = event.status;
        document.getElementById('eventRegistrationLink').value = event.registrationLink || '';
    }

    // Handle event form submission
    handleEventSubmit(e) {
        e.preventDefault();
        
        const eventData = {
            id: document.getElementById('eventId').value || this.generateEventId(),
            title: document.getElementById('eventTitle').value,
            date: document.getElementById('eventDate').value,
            time: document.getElementById('eventTime').value,
            location: document.getElementById('eventLocation').value,
            category: document.getElementById('eventCategory').value,
            description: document.getElementById('eventDescription').value,
            status: document.getElementById('eventStatus').value,
            registrationLink: document.getElementById('eventRegistrationLink').value || '#',
            icon: this.getCategoryIcon(document.getElementById('eventCategory').value),
            image: `photos/events/${document.getElementById('eventCategory').value}.jpg`
        };

        if (document.getElementById('eventId').value) {
            this.updateEvent(eventData);
        } else {
            this.addEvent(eventData);
        }
    }

    // Generate unique event ID
    generateEventId() {
        return Date.now().toString();
    }

    // Get category icon
    getCategoryIcon(category) {
        const iconMap = {
            'workshop': 'fas fa-tools',
            'seminar': 'fas fa-microphone',
            'competition': 'fas fa-trophy',
            'meeting': 'fas fa-users',
            'social': 'fas fa-heart',
            'academic': 'fas fa-graduation-cap'
        };
        return iconMap[category] || 'fas fa-calendar';
    }

    // Add new event
    addEvent(eventData) {
        this.events.push(eventData);
        this.saveEvents();
        this.renderEventsList();
        this.hideEventForm();
        this.showNotification('Event added successfully!', 'success');
    }

    // Update existing event
    updateEvent(eventData) {
        const index = this.events.findIndex(event => event.id === eventData.id);
        if (index !== -1) {
            this.events[index] = eventData;
            this.saveEvents();
            this.renderEventsList();
            this.hideEventForm();
            this.showNotification('Event updated successfully!', 'success');
        }
    }

    // Delete event
    deleteEvent(eventId) {
        if (confirm('Are you sure you want to delete this event?')) {
            this.events = this.events.filter(event => event.id !== eventId);
            this.saveEvents();
            this.renderEventsList();
            this.showNotification('Event deleted successfully!', 'success');
        }
    }

    // Save events to localStorage (in production, send to backend)
    saveEvents() {
        const calendarData = {
            events: this.events,
            categories: this.categories
        };
        localStorage.setItem('mesaCalendarData', JSON.stringify(calendarData));
        
        // Also update the JSON file content for display purposes
        // Note: In production, this would be handled by backend API
        console.log('Events saved to localStorage. In production, this would update the server.');
    }

    // Render events list
    renderEventsList() {
        const eventsContainer = document.getElementById('eventsContainer');
        if (!eventsContainer) return;

        if (this.events.length === 0) {
            eventsContainer.innerHTML = '<p class="no-events">No events found. Add your first event!</p>';
            return;
        }

        const eventsHTML = this.events.map(event => `
            <div class="event-card" data-event-id="${event.id}">
                <div class="event-header">
                    <div class="event-info">
                        <h3>${event.title}</h3>
                        <div class="event-meta">
                            <span class="event-date"><i class="fas fa-calendar"></i> ${event.date}</span>
                            <span class="event-time"><i class="fas fa-clock"></i> ${event.time}</span>
                            <span class="event-location"><i class="fas fa-map-marker-alt"></i> ${event.location}</span>
                        </div>
                        <span class="event-category ${event.category}">${event.category}</span>
                        <span class="event-status ${event.status}">${event.status}</span>
                    </div>
                    <div class="event-actions">
                        <button class="btn-edit" onclick="adminDashboard.editEvent('${event.id}')">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn-delete" onclick="adminDashboard.deleteEvent('${event.id}')">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
                <p class="event-description">${event.description}</p>
            </div>
        `).join('');

        eventsContainer.innerHTML = eventsHTML;
    }

    // Edit event
    editEvent(eventId) {
        const event = this.events.find(e => e.id === eventId);
        if (event) {
            this.showEventForm(event);
        }
    }

    // Render join requests (admin only)
    renderJoinRequests() {
        if (!mesaAuth.isAdmin()) return;

        const joinRequestsContainer = document.getElementById('joinRequestsContainer');
        if (!joinRequestsContainer) return;

        const joinRequests = JSON.parse(localStorage.getItem('mesaJoinRequests') || '[]');
        
        if (joinRequests.length === 0) {
            joinRequestsContainer.innerHTML = '<p class="no-requests">No pending join requests.</p>';
            return;
        }

        const requestsHTML = joinRequests.map((request, index) => `
            <div class="join-request-card" data-request-index="${index}">
                <div class="request-info">
                    <h4>${request.name}</h4>
                    <p><strong>Email:</strong> ${request.email}</p>
                    <p><strong>Roll Number:</strong> ${request.rollNumber}</p>
                    <p><strong>Date:</strong> ${new Date(request.timestamp).toLocaleDateString()}</p>
                    <span class="request-status ${request.status}">${request.status}</span>
                </div>
                <div class="request-actions">
                    <button class="btn-approve" onclick="adminDashboard.approveJoinRequest(${index})">
                        <i class="fas fa-check"></i> Approve
                    </button>
                    <button class="btn-reject" onclick="adminDashboard.rejectJoinRequest(${index})">
                        <i class="fas fa-times"></i> Reject
                    </button>
                </div>
            </div>
        `).join('');

        joinRequestsContainer.innerHTML = requestsHTML;
    }

    // Approve join request
    approveJoinRequest(index) {
        const joinRequests = JSON.parse(localStorage.getItem('mesaJoinRequests') || '[]');
        if (joinRequests[index]) {
            joinRequests[index].status = 'approved';
            localStorage.setItem('mesaJoinRequests', JSON.stringify(joinRequests));
            this.renderJoinRequests();
            this.showNotification('Join request approved!', 'success');
        }
    }

    // Reject join request
    rejectJoinRequest(index) {
        const joinRequests = JSON.parse(localStorage.getItem('mesaJoinRequests') || '[]');
        if (joinRequests[index]) {
            joinRequests[index].status = 'rejected';
            localStorage.setItem('mesaJoinRequests', JSON.stringify(joinRequests));
            this.renderJoinRequests();
            this.showNotification('Join request rejected.', 'info');
        }
    }

    // Show notification
    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.admin-notification');
        existingNotifications.forEach(notification => notification.remove());
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `admin-notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'error' ? 'exclamation-circle' : type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Auto remove after 4 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 4000);
    }
}

// Initialize admin dashboard
let adminDashboard;
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('adminPanel')) {
        adminDashboard = new MESAAdminDashboard();
        window.adminDashboard = adminDashboard;
    }
});
