// Firebase Event Management for MESA Website
import { db, MESA_CONFIG } from './firebase-config.js';
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  onSnapshot,
  where,
  Timestamp 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

class MESAFirebaseEvents {
  constructor() {
    this.events = [];
    this.unsubscribe = null;
    this.init();
  }

  async init() {
    this.setupEventListeners();
    this.setupRealTimeListener();
  }

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

  // Set up real-time listener for events
  setupRealTimeListener() {
    const eventsRef = collection(db, MESA_CONFIG.collections.events);
    const q = query(eventsRef, orderBy('date', 'desc'));

    this.unsubscribe = onSnapshot(q, (snapshot) => {
      this.events = [];
      snapshot.forEach((doc) => {
        this.events.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      this.renderEventsList();
      this.updateCalendarEvents();
      console.log('Events updated in real-time:', this.events.length);
    });
  }

  // Load events from Firestore
  async loadEvents() {
    try {
      const eventsRef = collection(db, MESA_CONFIG.collections.events);
      const q = query(eventsRef, orderBy('date', 'desc'));
      const querySnapshot = await getDocs(q);
      
      this.events = [];
      querySnapshot.forEach((doc) => {
        this.events.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      this.renderEventsList();
      this.updateCalendarEvents();
      console.log('Events loaded from Firebase:', this.events.length);
      
    } catch (error) {
      console.error('Error loading events:', error);
      this.showNotification('Error loading events: ' + error.message, 'error');
    }
  }

  // Add new event to Firestore
  async addEvent(eventData) {
    try {
      // Convert date string to Firestore Timestamp
      const eventDate = new Date(eventData.date);
      const firestoreData = {
        ...eventData,
        date: Timestamp.fromDate(eventDate),
        createdAt: Timestamp.now(),
        createdBy: window.mesaFirebaseAuth?.getCurrentUser()?.email || 'unknown'
      };

      const docRef = await addDoc(collection(db, MESA_CONFIG.collections.events), firestoreData);
      
      this.showNotification('Event added successfully!', 'success');
      this.hideEventForm();
      
      console.log('Event added with ID:', docRef.id);
      
    } catch (error) {
      console.error('Error adding event:', error);
      this.showNotification('Error adding event: ' + error.message, 'error');
    }
  }

  // Update existing event in Firestore
  async updateEvent(eventId, eventData) {
    try {
      // Convert date string to Firestore Timestamp
      const eventDate = new Date(eventData.date);
      const firestoreData = {
        ...eventData,
        date: Timestamp.fromDate(eventDate),
        updatedAt: Timestamp.now(),
        updatedBy: window.mesaFirebaseAuth?.getCurrentUser()?.email || 'unknown'
      };

      const eventRef = doc(db, MESA_CONFIG.collections.events, eventId);
      await updateDoc(eventRef, firestoreData);
      
      this.showNotification('Event updated successfully!', 'success');
      this.hideEventForm();
      
      console.log('Event updated:', eventId);
      
    } catch (error) {
      console.error('Error updating event:', error);
      this.showNotification('Error updating event: ' + error.message, 'error');
    }
  }

  // Delete event from Firestore
  async deleteEvent(eventId) {
    if (!confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      await deleteDoc(doc(db, MESA_CONFIG.collections.events, eventId));
      this.showNotification('Event deleted successfully!', 'success');
      console.log('Event deleted:', eventId);
      
    } catch (error) {
      console.error('Error deleting event:', error);
      this.showNotification('Error deleting event: ' + error.message, 'error');
    }
  }

  // Handle event form submission
  async handleEventSubmit(e) {
    e.preventDefault();
    
    const eventData = {
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

    const eventId = document.getElementById('eventId').value;

    if (eventId) {
      await this.updateEvent(eventId, eventData);
    } else {
      await this.addEvent(eventData);
    }
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
    
    // Convert Firestore Timestamp to date string
    const eventDate = event.date?.toDate ? event.date.toDate() : new Date(event.date);
    document.getElementById('eventDate').value = eventDate.toISOString().split('T')[0];
    
    document.getElementById('eventTime').value = event.time;
    document.getElementById('eventLocation').value = event.location;
    document.getElementById('eventCategory').value = event.category;
    document.getElementById('eventDescription').value = event.description;
    document.getElementById('eventStatus').value = event.status;
    document.getElementById('eventRegistrationLink').value = event.registrationLink || '';
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

  // Render events list in admin panel
  renderEventsList() {
    const eventsContainer = document.getElementById('eventsContainer');
    if (!eventsContainer) return;

    if (this.events.length === 0) {
      eventsContainer.innerHTML = '<p class="no-events">No events found. Add your first event!</p>';
      return;
    }

    const eventsHTML = this.events.map(event => {
      // Convert Firestore Timestamp to readable date
      const eventDate = event.date?.toDate ? event.date.toDate() : new Date(event.date);
      const formattedDate = eventDate.toLocaleDateString();
      
      return `
        <div class="event-card" data-event-id="${event.id}">
          <div class="event-header">
            <div class="event-info">
              <h3>${event.title}</h3>
              <div class="event-meta">
                <span class="event-date"><i class="fas fa-calendar"></i> ${formattedDate}</span>
                <span class="event-time"><i class="fas fa-clock"></i> ${event.time}</span>
                <span class="event-location"><i class="fas fa-map-marker-alt"></i> ${event.location}</span>
              </div>
              <span class="event-category ${event.category}">${event.category}</span>
              <span class="event-status ${event.status}">${event.status}</span>
            </div>
            <div class="event-actions">
              <button class="btn-edit" onclick="mesaFirebaseEvents.editEvent('${event.id}')">
                <i class="fas fa-edit"></i> Edit
              </button>
              <button class="btn-delete" onclick="mesaFirebaseEvents.deleteEvent('${event.id}')">
                <i class="fas fa-trash"></i> Delete
              </button>
            </div>
          </div>
          <p class="event-description">${event.description}</p>
        </div>
      `;
    }).join('');

    eventsContainer.innerHTML = eventsHTML;
  }

  // Update calendar events (for calendar.html)
  updateCalendarEvents() {
    // If MESA calendar exists, update it with Firebase data
    if (window.mesaCalendar) {
      const calendarEvents = this.events.map(event => ({
        ...event,
        date: event.date?.toDate ? event.date.toDate().toISOString().split('T')[0] : event.date
      }));
      
      window.mesaCalendar.updateEventsFromFirebase(calendarEvents);
    }
  }

  // Get events for public display (calendar, homepage)
  async getPublicEvents(limit = null) {
    try {
      const eventsRef = collection(db, MESA_CONFIG.collections.events);
      let q = query(eventsRef, orderBy('date', 'asc'));
      
      if (limit) {
        q = query(eventsRef, orderBy('date', 'asc'), limit(limit));
      }
      
      const querySnapshot = await getDocs(q);
      const events = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        events.push({
          id: doc.id,
          ...data,
          date: data.date?.toDate ? data.date.toDate().toISOString().split('T')[0] : data.date
        });
      });
      
      return events;
      
    } catch (error) {
      console.error('Error getting public events:', error);
      return [];
    }
  }

  // Edit event
  editEvent(eventId) {
    const event = this.events.find(e => e.id === eventId);
    if (event) {
      this.showEventForm(event);
    }
  }

  // Show notification
  showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.firebase-events-notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `firebase-events-notification ${type}`;
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

  // Cleanup method
  destroy() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
}

// Initialize Firebase events management
let mesaFirebaseEvents;
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('adminPanel') || document.querySelector('.mesa-calendar-section')) {
    mesaFirebaseEvents = new MESAFirebaseEvents();
    window.mesaFirebaseEvents = mesaFirebaseEvents;
  }
});

export default MESAFirebaseEvents;
