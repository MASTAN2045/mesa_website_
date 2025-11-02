# MESA Website - Dynamic Content Management System

## Overview
The MESA website now includes a dynamic content management system that automatically updates events, photos, and team members based on JSON data files. This system follows the recommended setup for easy content updates.

## Features Implemented

### 1. Dynamic Event Management
- **File**: `data/events.json`
- **Updates**: Calendar page, Events page, Home page recent events
- **Categories**: Workshop, Seminar, Competition, Community, Industry Visit, Meeting

### 2. Dynamic Photo Management
- **File**: `data/photos.json`
- **Auto-categorization**: 
  - Team photos → Team page
  - Event photos → Recent photos section
  - General photos → Photo gallery
- **Categories**: Team, Events, Gallery

### 3. Dynamic Team Management
- **File**: `data/team.json`
- **Sections**: Faculty, Office Bearers, Coordinators, Representatives
- **Auto-updates**: Team page with contact information

## File Structure
```
mesa_stage_1/
├── data/
│   ├── events.json      # Event data
│   ├── photos.json      # Photo metadata
│   └── team.json        # Team member data
├── js/
│   ├── content-manager.js  # Main content management system
│   ├── script.js          # Existing functionality
│   └── calendar.js        # Calendar functionality
├── photos/
│   ├── events/           # Event photos
│   ├── team/             # Team member photos
│   └── gallery/          # General photos
└── admin.html           # Admin panel for content management
```

## How to Use

### For Administrators

#### 1. Using the Admin Panel
- Open `admin.html` in your browser
- Use the forms to add new events, photos, or team members
- Changes are reflected immediately on the website

#### 2. Manual JSON Editing
- Edit the JSON files in the `data/` folder directly
- The website will automatically update content every 5 minutes
- Or refresh the page to see immediate changes

### For Content Updates

#### Adding New Events
1. Add event details to `data/events.json`
2. Upload event image to `photos/events/`
3. Event will appear on:
   - Events page
   - Calendar page
   - Home page (if recent)

#### Adding New Photos
1. Upload photo to appropriate folder:
   - Team photos: `photos/team/`
   - Event photos: `photos/events/`
   - General: `photos/gallery/`
2. Add metadata to `data/photos.json`
3. Photo will automatically appear in relevant sections

#### Adding Team Members
1. Upload member photo to `photos/team/`
2. Add member details to `data/team.json`
3. Member will appear on team page in appropriate section

## JSON File Formats

### events.json
```json
{
  "events": [
    {
      "id": "unique-id",
      "title": "Event Title",
      "date": "YYYY-MM-DD",
      "time": "9:00 AM - 5:00 PM",
      "location": "Event Location",
      "category": "workshop|seminar|competition|community|industry|meeting",
      "icon": "fas fa-icon-name",
      "description": "Event description",
      "status": "upcoming|completed",
      "registrationLink": "URL or #",
      "image": "photos/events/event-image.jpg"
    }
  ]
}
```

### photos.json
```json
{
  "photos": [
    {
      "id": "unique-id",
      "filename": "photo-name.jpg",
      "category": "team|events|gallery",
      "subcategory": "group|individual|workshop|etc",
      "title": "Photo Title",
      "description": "Photo description",
      "date": "YYYY-MM-DD",
      "tags": ["tag1", "tag2"],
      "featured": true|false
    }
  ]
}
```

### team.json
```json
{
  "team": {
    "faculty": [...],
    "office_bearers": [...],
    "coordinators": [...],
    "representatives": [
      {
        "id": "unique-id",
        "name": "Member Name",
        "position": "Position Title",
        "year": "Year (for students)",
        "branch": "Branch",
        "email": "email@example.com",
        "phone": "+91-xxxxxxxxxx",
        "image": "photos/team/member.jpg",
        "bio": "Member biography",
        "active": true|false
      }
    ]
  }
}
```

## Recommended Hosting Solutions

### 1. GitHub Pages (Free)
- Host JSON files in repository
- Automatic updates via GitHub commits
- Free SSL and custom domain support

### 2. Netlify (Free)
- Drag and drop deployment
- Form handling for admin panel
- Automatic builds from Git

### 3. Google Drive Integration
- Store images on Google Drive
- Use Google Sheets API for data management
- Automatic synchronization

## Content Management Workflow

### Daily Operations
1. Upload new photos to appropriate folders
2. Update JSON files with new content
3. Website automatically reflects changes

### Event Management
1. Add upcoming events to `events.json`
2. Events automatically appear on calendar
3. Past events can be marked as "completed"

### Photo Management
1. Categorize photos by type (team/events/gallery)
2. Set featured photos for homepage display
3. System automatically places photos in correct sections

## Security Notes
- Admin panel is client-side only (no server required)
- JSON files should be protected in production
- Consider authentication for admin access
- Regular backups of JSON data recommended

## Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- JavaScript must be enabled
- Local file access may require server environment

## Troubleshooting

### Content Not Updating
1. Check browser console for errors
2. Verify JSON file syntax
3. Ensure image paths are correct
4. Refresh page or wait for auto-update

### Images Not Loading
1. Verify image file exists in correct folder
2. Check file path in JSON matches actual location
3. Ensure image formats are supported (jpg, png, webp)

### Admin Panel Issues
1. Ensure content-manager.js is loaded
2. Check browser console for JavaScript errors
3. Verify JSON files are accessible

## Future Enhancements
- Google Sheets integration for easier editing
- Image upload functionality
- User authentication system
- Content versioning and backup
- SEO optimization for dynamic content

## Support
For technical support or questions about the content management system, contact the web development team or refer to the documentation.
