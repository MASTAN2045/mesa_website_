// MESA Calendar JavaScript
class MESACalendar {
    constructor() {
        // Use real-time current date - will automatically update based on actual date
        this.currentDate = new Date(); // This will always show the current month/year
        this.events = [];
        this.categories = {};
        this.monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        
        this.init();
    }

    async init() {
        await this.loadEvents();
        this.setupEventListeners();
        this.renderCalendar();
    }

    async loadEvents() {
        try {
            const response = await fetch('data/calendar.json');
            const data = await response.json();
            this.events = data.events;
            this.categories = data.categories;
        } catch (error) {
            console.error('Error loading events:', error);
            this.events = [];
            this.categories = {};
        }
    }

    setupEventListeners() {
        const prevBtn = document.getElementById('prevMonth');
        const nextBtn = document.getElementById('nextMonth');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.currentDate.setMonth(this.currentDate.getMonth() - 1);
                this.renderCalendar();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.currentDate.setMonth(this.currentDate.getMonth() + 1);
                this.renderCalendar();
            });
        }
    }

    renderCalendar() {
        this.updateMonthTitle();
        this.renderEvents();
    }

    updateMonthTitle() {
        const monthTitle = document.getElementById('currentMonth');
        if (monthTitle) {
            const monthName = this.monthNames[this.currentDate.getMonth()];
            const year = this.currentDate.getFullYear();
            monthTitle.textContent = `${monthName} ${year}`;
        }
    }

    renderEvents() {
        const eventsList = document.getElementById('eventsList');
        const noEventsMessage = document.getElementById('noEventsMessage');
        
        if (!eventsList) return;

        // Filter events for current month and year
        const currentMonth = this.currentDate.getMonth() + 1; // JavaScript months are 0-indexed
        const currentYear = this.currentDate.getFullYear();
        
        const monthEvents = this.events.filter(event => {
            // Handle both old format (with date) and new format (with month/year)
            if (event.month && event.year) {
                return event.month === currentMonth && event.year === currentYear;
            } else if (event.date) {
                const eventDate = new Date(event.date);
                return eventDate.getMonth() === (currentMonth - 1) && 
                       eventDate.getFullYear() === currentYear;
            }
            return false;
        });

        // Sort events by title for consistent display
        monthEvents.sort((a, b) => a.title.localeCompare(b.title));

        // Clear previous events
        eventsList.innerHTML = '';

        if (monthEvents.length === 0) {
            eventsList.style.display = 'none';
            if (noEventsMessage) {
                noEventsMessage.style.display = 'flex';
            }
            return;
        }

        eventsList.style.display = 'block';
        if (noEventsMessage) {
            noEventsMessage.style.display = 'none';
        }

        // Render each event
        monthEvents.forEach((event, index) => {
            const eventElement = this.createEventElement(event, index);
            eventsList.appendChild(eventElement);
        });
    }

    createEventElement(event, index) {
        const eventDiv = document.createElement('div');
        eventDiv.className = 'mesa-event-item';
        
        // Get category info
        const category = this.categories[event.category] || {
            color: '#6b7280',
            icon: 'fas fa-calendar'
        };

        eventDiv.innerHTML = `
            <div class="mesa-event-icon mesa-icon-${event.category}">
                <i class="${category.icon}"></i>
            </div>
            <div class="mesa-event-content">
                <div class="mesa-event-header">
                    <h3 class="mesa-event-title">${event.title}</h3>
                    <div class="mesa-event-badges">
                        <span class="mesa-event-category mesa-category-${event.category}">
                            ${category.name}
                        </span>
                    </div>
                </div>
                <p class="mesa-event-description">${event.description}</p>
            </div>
        `;

        return eventDiv;
    }
}

// Initialize calendar when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MESACalendar();
});
