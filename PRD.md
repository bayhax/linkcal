# LinkCal - Product Requirements Document

## Overview
LinkCal is a URL-based serverless calendar application that allows users to create, share, and manage events without requiring registration or a backend server. All data is encoded directly in the URL, making sharing seamless and privacy-friendly.

## Target Users
- Event organizers sharing one-time events
- Freelancers sharing availability
- Small teams coordinating schedules
- Privacy-conscious users avoiding cloud calendars
- Developers needing embeddable calendar functionality

## Core Value Proposition
- **Zero Signup**: Create and share calendars instantly
- **Privacy First**: Data never touches our servers
- **Universal Sharing**: One link works everywhere
- **Open Source**: Fully transparent and self-hostable

---

## Features

### MVP (Phase 1)

#### Free Tier
1. **Create Event**
   - Title (required)
   - Date & Time (required)
   - End Date & Time (optional)
   - Description (optional)
   - Location (optional, supports URL)
   - All-day toggle

2. **Create Calendar**
   - Multiple events in one calendar
   - Calendar title
   - Timezone selection

3. **Share via URL**
   - Data encoded in URL hash (#)
   - Compressed using lz-string
   - One-click copy link

4. **View Calendar**
   - Clean, modern calendar view
   - Month/Week/Day views
   - Responsive design (mobile-first)

5. **Add to Calendar**
   - Google Calendar
   - Apple Calendar (.ics)
   - Outlook
   - Yahoo Calendar

6. **Theme**
   - Light/Dark mode
   - System preference detection

### Paid Tier (Pro) - $5/month or $29 one-time

7. **Password Protection**
   - AES-256-GCM encryption
   - Password required to view
   - Encrypted data in URL

8. **Custom Expiry**
   - Link expires after set time
   - Auto-invalidation

9. **Remove Branding**
   - No "Powered by LinkCal" footer

10. **Priority Support**
    - Email support

---

## Technical Architecture

### Stack
- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **State**: Zustand (minimal, local only)
- **Calendar**: date-fns for date handling
- **Compression**: lz-string
- **Encryption**: Web Crypto API (AES-GCM)
- **Build**: Vite
- **Deployment**: Vercel (static)

### URL Structure
```
https://linkcal.app/#<compressed-base64-data>
```

For encrypted:
```
https://linkcal.app/#e:<encrypted-base64-data>
```

### Data Schema
```typescript
interface Event {
  id: string;
  title: string;
  start: string; // ISO 8601
  end?: string;
  allDay?: boolean;
  description?: string;
  location?: string;
}

interface Calendar {
  v: number; // schema version
  title?: string;
  tz?: string; // timezone
  events: Event[];
  pro?: {
    expires?: number; // unix timestamp
    license?: string;
  };
}
```

### Payment Flow (Creem)
1. User creates calendar
2. Clicks "Upgrade to Pro"
3. Redirected to Creem checkout
4. On success, receives license key
5. License key encoded in URL
6. Frontend validates license (offline-capable)

---

## User Flows

### Create & Share (Free)
1. Land on homepage
2. Click "Create Calendar" or "Quick Event"
3. Fill in event details
4. Click "Generate Link"
5. Copy and share link

### View Shared Calendar
1. Open shared link
2. See calendar with events
3. Click event for details
4. Click "Add to Calendar" to export

### Upgrade to Pro
1. Create calendar
2. Click "Add Password Protection"
3. Redirected to Creem checkout ($5)
4. Enter payment details
5. Receive license key
6. Set password
7. New encrypted URL generated

---

## Pages

1. **/** - Homepage (create/landing)
2. **/#<data>** - View calendar
3. **/pricing** - Pricing page
4. **/docs** - Documentation/Help

---

## Design Principles

1. **Minimalist**: Clean, uncluttered UI
2. **Fast**: No loading spinners, instant feedback
3. **Accessible**: WCAG 2.1 AA compliant
4. **International**: English UI, support for all timezones
5. **Mobile-First**: Works perfectly on phones

---

## Success Metrics

- Time to first calendar created: < 30 seconds
- URL length: < 2000 characters for 5 events
- Lighthouse score: > 95
- Conversion rate (free to paid): > 2%

---

## Roadmap

### Phase 1 (MVP) - Week 1
- [ ] Core calendar creation
- [ ] URL encoding/decoding
- [ ] Share functionality
- [ ] Add to calendar exports
- [ ] Basic responsive design

### Phase 2 (Pro) - Week 2
- [ ] Creem payment integration
- [ ] Password protection
- [ ] License validation
- [ ] Expiry feature

### Phase 3 (Growth) - Week 3+
- [ ] Recurring events
- [ ] RSVP functionality
- [ ] Embed widget
- [ ] API for developers

---

## Competitive Advantage

| Feature | LinkCal | Calendly | AddCal | Google Calendar |
|---------|---------|----------|--------|-----------------|
| No signup | ✅ | ❌ | ❌ | ❌ |
| No backend | ✅ | ❌ | ❌ | ❌ |
| Data in URL | ✅ | ❌ | ❌ | ❌ |
| Privacy | ✅ | ❌ | ❌ | ❌ |
| Open source | ✅ | ❌ | ❌ | ❌ |
| Free tier | ✅ | ✅ | ✅ | ✅ |
| Encryption | ✅ (Pro) | ❌ | ❌ | ❌ |
