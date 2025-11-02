// Dynamic Content Management System for MESA Website
// Handles events, photos, and team data from JSON files

class MESAContentManager {
    constructor() {
        this.eventsData = null;
        this.photosData = null;
        this.teamData = null;
        this.baseURL = './data/';
        this.init();
    }

    async init() {
        try {
            await this.loadAllData();
            console.log('JSON Data loaded:', {
                events: this.eventsData?.events?.length || 0,
                photos: this.photosData?.photos?.length || 0,
                team: this.teamData?.team ? 'loaded' : 'not loaded'
            });
            this.updateContent();
            console.log('MESA Content Manager initialized successfully');
        } catch (error) {
            console.error('Error initializing Content Manager:', error);
        }
    }

    // Load all JSON data files
    async loadAllData() {
        try {
            const [eventsResponse, photosResponse, teamResponse] = await Promise.all([
                fetch(`${this.baseURL}calendar.json`),
                fetch(`${this.baseURL}photos.json`),
                fetch(`${this.baseURL}team.json`)
            ]);

            this.eventsData = await eventsResponse.json();
            this.photosData = await photosResponse.json();
            this.teamData = await teamResponse.json();
        } catch (error) {
            console.error('Error loading data files:', error);
            // Fallback to static data if JSON files are not available
            this.loadFallbackData();
        }
    }

    // Fallback to static data if JSON files are not available
    loadFallbackData() {
        console.log('Using fallback static data');
        // Keep existing static data as fallback
    }

    // Update all content on the page
    updateContent() {
        this.updateEvents();
        this.updatePhotos();
        this.updateTeam();
        this.updateCalendar();
    }

    // Update events on events page and home page
    updateEvents() {
        if (!this.eventsData) return;

        // Update events page
        this.updateEventsPage();
        
        // Skip home page events update to preserve original static content
        // this.updateHomePageEvents();
    }

    updateEventsPage() {
        // Check for timeline format (events page)
        const timelineContainer = document.querySelector('.events-timeline');
        if (timelineContainer) {
            this.updateEventsTimeline(timelineContainer);
            return;
        }

        // Check for grid format (other pages)
        const eventsContainer = document.querySelector('.events-grid');
        if (eventsContainer) {
            this.updateEventsGrid(eventsContainer);
            return;
        }
    }

    updateEventsTimeline(container) {
        const upcomingEvents = this.eventsData.events.filter(event => 
            new Date(event.date) >= new Date() && event.status === 'upcoming'
        ).slice(0, 6); // Show only next 6 events

        console.log('Updating events timeline with', upcomingEvents.length, 'events');

        container.innerHTML = upcomingEvents.map(event => {
            const eventDate = new Date(event.date);
            const day = eventDate.getDate();
            const month = eventDate.toLocaleDateString('en-US', { month: 'short' });
            
            return `
                <div class="timeline-item">
                    <div class="timeline-date">
                        <span class="date">${day}</span>
                        <span class="month">${month}</span>
                    </div>
                    <div class="timeline-content">
                        <h3>${event.title}</h3>
                        <p class="event-location"><i class="fas fa-map-marker-alt"></i> ${event.location}</p>
                        <p class="event-time"><i class="fas fa-clock"></i> ${event.time}</p>
                        <p>${event.description}</p>
                        <div class="event-tags">
                            <span class="tag">${this.eventsData.categories[event.category].name}</span>
                            <span class="tag">${event.category}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    updateEventsGrid(container) {
        const upcomingEvents = this.eventsData.events.filter(event => 
            new Date(event.date) >= new Date() && event.status === 'upcoming'
        ).slice(0, 6); // Show only next 6 events

        container.innerHTML = upcomingEvents.map(event => `
            <div class="event-card" data-category="${event.category}">
                <div class="event-image">
                    <img src="${event.image}" alt="${event.title}" onerror="this.src='photos/default-event.jpg'">
                    <div class="event-category ${event.category}">
                        <i class="${event.icon}"></i>
                        <span>${this.eventsData.categories[event.category].name}</span>
                    </div>
                </div>
                <div class="event-content">
                    <div class="event-date">
                        <i class="fas fa-calendar"></i>
                        <span>${this.formatDate(event.date)}</span>
                    </div>
                    <h3 class="event-title">${event.title}</h3>
                    <div class="event-meta">
                        <div class="event-time">
                            <i class="fas fa-clock"></i>
                            <span>${event.time}</span>
                        </div>
                        <div class="event-location">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${event.location}</span>
                        </div>
                    </div>
                    <p class="event-description">${event.description}</p>
                    <div class="event-actions">
                        <button class="btn btn-primary" onclick="openEventModal('${event.id}')">
                            Learn More
                        </button>
                        ${event.registrationLink !== '#' ? 
                            `<a href="${event.registrationLink}" class="btn btn-outline">Register</a>` : 
                            ''
                        }
                    </div>
                </div>
            </div>
        `).join('');
    }

    updateHomePageEvents() {
        // Completely disabled to preserve static home page content
        return;
    }

    // Update photos based on category
    updatePhotos() {
        if (!this.photosData) return;

        // Update team page photos
        this.updateTeamPhotos();
        
        // Skip recent event photos update to preserve home page static content
        // this.updateRecentEventPhotos();
        
        // Update photo gallery
        this.updatePhotoGallery();
    }

    updateTeamPhotos() {
        const teamPhotos = this.photosData.photos.filter(photo => 
            photo.category === 'team' && photo.featured
        );

        // Update team page group photos
        const teamGallery = document.querySelector('.team-gallery');
        if (teamGallery) {
            teamGallery.innerHTML = teamPhotos.map(photo => `
                <div class="photo-item">
                    <img src="photos/${photo.filename}" alt="${photo.title}" 
                         onerror="this.src='photos/default-team.jpg'">
                    <div class="photo-overlay">
                        <h4>${photo.title}</h4>
                        <p>${photo.description}</p>
                    </div>
                </div>
            `).join('');
        }
    }

    updateRecentEventPhotos() {
        const eventPhotos = this.photosData.photos.filter(photo => 
            photo.category === 'events' && photo.featured
        ).slice(0, 6);

        const recentPhotosContainer = document.querySelector('.recent-photos .photo-grid');
        if (recentPhotosContainer) {
            recentPhotosContainer.innerHTML = eventPhotos.map(photo => `
                <div class="photo-item">
                    <img src="photos/${photo.filename}" alt="${photo.title}"
                         onerror="this.src='photos/default-event.jpg'">
                    <div class="photo-overlay">
                        <h4>${photo.title}</h4>
                        <span class="photo-date">${this.formatDate(photo.date)}</span>
                    </div>
                </div>
            `).join('');
        }
    }

    updatePhotoGallery() {
        const photoGallery = document.querySelector('.photo-gallery-grid');
        if (!photoGallery) return;

        const allPhotos = this.photosData.photos.slice(0, 12); // Show 12 photos max

        photoGallery.innerHTML = allPhotos.map(photo => `
            <div class="photo-item" data-category="${photo.category}">
                <img src="photos/${photo.filename}" alt="${photo.title}"
                     onerror="this.src='photos/default-photo.jpg'">
                <div class="photo-overlay">
                    <h4>${photo.title}</h4>
                    <p>${photo.description}</p>
                    <span class="photo-category">${photo.category}</span>
                </div>
            </div>
        `).join('');
    }

    // Update team members
    updateTeam() {
        if (!this.teamData) return;

        this.updateFacultySection();
        this.updateOfficeBearers();
        this.updateCoordinators();
        this.updateRepresentatives();
    }

    updateFacultySection() {
        const facultyContainer = document.querySelector('.faculty-section .team-grid');
        if (!facultyContainer) return;

        const activeFaculty = this.teamData.team.faculty.filter(member => member.active);

        facultyContainer.innerHTML = activeFaculty.map(faculty => `
            <div class="team-card faculty-card">
                <div class="team-photo">
                    <img src="${faculty.image}" alt="${faculty.name}"
                         onerror="this.src='photos/default-faculty.jpg'">
                </div>
                <div class="team-info">
                    <h3>${faculty.name}</h3>
                    <p class="team-position">${faculty.position}</p>
                    <p class="team-department">${faculty.department}</p>
                    <div class="team-contact">
                        <a href="mailto:${faculty.email}"><i class="fas fa-envelope"></i></a>
                        <a href="tel:${faculty.phone}"><i class="fas fa-phone"></i></a>
                    </div>
                    <p class="team-bio">${faculty.bio}</p>
                </div>
            </div>
        `).join('');
    }

    updateOfficeBearers() {
        const bearersContainer = document.querySelector('.office-bearers .team-grid');
        if (!bearersContainer) return;

        const activeBearers = this.teamData.team.office_bearers.filter(member => member.active);

        bearersContainer.innerHTML = activeBearers.map(bearer => `
            <div class="team-card">
                <div class="team-photo">
                    <img src="${bearer.image}" alt="${bearer.name}"
                         onerror="this.src='photos/default-student.jpg'">
                </div>
                <div class="team-info">
                    <h3>${bearer.name}</h3>
                    <p class="team-position">${bearer.position}</p>
                    <p class="team-year">${bearer.year} - ${bearer.branch}</p>
                    <div class="team-contact">
                        <a href="mailto:${bearer.email}"><i class="fas fa-envelope"></i></a>
                        <a href="tel:${bearer.phone}"><i class="fas fa-phone"></i></a>
                    </div>
                    <p class="team-bio">${bearer.bio}</p>
                </div>
            </div>
        `).join('');
    }

    updateCoordinators() {
        const coordContainer = document.querySelector('.coordinators .team-grid');
        if (!coordContainer) return;

        const activeCoords = this.teamData.team.coordinators.filter(member => member.active);

        coordContainer.innerHTML = activeCoords.map(coord => `
            <div class="team-card">
                <div class="team-photo">
                    <img src="${coord.image}" alt="${coord.name}"
                         onerror="this.src='photos/default-student.jpg'">
                </div>
                <div class="team-info">
                    <h3>${coord.name}</h3>
                    <p class="team-position">${coord.position}</p>
                    <p class="team-year">${coord.year} - ${coord.branch}</p>
                    <div class="team-contact">
                        <a href="mailto:${coord.email}"><i class="fas fa-envelope"></i></a>
                        <a href="tel:${coord.phone}"><i class="fas fa-phone"></i></a>
                    </div>
                    <p class="team-bio">${coord.bio}</p>
                </div>
            </div>
        `).join('');
    }

    updateRepresentatives() {
        const repsContainer = document.querySelector('.representatives .team-grid');
        if (!repsContainer) return;

        const activeReps = this.teamData.team.representatives.filter(member => member.active);

        repsContainer.innerHTML = activeReps.map(rep => `
            <div class="team-card">
                <div class="team-photo">
                    <img src="${rep.image}" alt="${rep.name}"
                         onerror="this.src='photos/default-student.jpg'">
                </div>
                <div class="team-info">
                    <h3>${rep.name}</h3>
                    <p class="team-position">${rep.position}</p>
                    <p class="team-year">${rep.year} - ${rep.branch}</p>
                    <div class="team-contact">
                        <a href="mailto:${rep.email}"><i class="fas fa-envelope"></i></a>
                    </div>
                    <p class="team-bio">${rep.bio}</p>
                </div>
            </div>
        `).join('');
    }

    // Update calendar with events
    updateCalendar() {
        if (!this.eventsData) return;

        // Update both main calendar and sidebar calendar
        this.updateMainCalendar();
        this.updateSidebarCalendar();
    }

    updateMainCalendar() {
        // Update the main calendar page with events from JSON
        if (typeof window.updateCalendarEvents === 'function') {
            window.updateCalendarEvents(this.eventsData.events);
        }
    }

    updateSidebarCalendar() {
        // Update sidebar calendar events
        if (typeof window.updateSidebarEvents === 'function') {
            window.updateSidebarEvents(this.eventsData.events);
        }
    }

    // Utility functions
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    // Refresh data (can be called periodically)
    async refreshData() {
        console.log('Refreshing MESA content data...');
        await this.loadAllData();
        this.updateContent();
    }

    // Add new event (for admin use)
    async addEvent(eventData) {
        if (!this.eventsData) return false;
        
        eventData.id = Date.now().toString();
        this.eventsData.events.push(eventData);
        this.updateEvents();
        return true;
    }

    // Add new photo (for admin use)
    async addPhoto(photoData) {
        if (!this.photosData) return false;
        
        photoData.id = Date.now().toString();
        this.photosData.photos.push(photoData);
        this.updatePhotos();
        return true;
    }

    // Add new team member (for admin use)
    async addTeamMember(memberData, category) {
        if (!this.teamData) return false;
        
        memberData.id = `${category}-${Date.now()}`;
        this.teamData.team[category].push(memberData);
        this.updateTeam();
        return true;
    }
}

// Initialize content manager when DOM is loaded - skip on home page
document.addEventListener('DOMContentLoaded', function() {
    // Don't initialize content manager on home page to preserve static content
    const isHomePage = window.location.pathname.endsWith('index.html') || 
                      window.location.pathname === '/' || 
                      window.location.pathname.endsWith('/');
    
    if (!isHomePage) {
        window.mesaContentManager = new MESAContentManager();
    }
});

// Auto-refresh data every 5 minutes (optional)
setInterval(() => {
    if (window.mesaContentManager) {
        window.mesaContentManager.refreshData();
    }
}, 300000); // 5 minutes

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MESAContentManager;
}
