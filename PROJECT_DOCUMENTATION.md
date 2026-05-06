# Facial Recognition Voting System - Project Documentation

## Table of Contents
1. [Overview](#overview)
2. [Programming Languages & Technologies](#programming-languages--technologies)
3. [Architecture](#architecture)
4. [Project Structure](#project-structure)
5. [Features](#features)
6. [Installation & Setup](#installation--setup)
7. [API Endpoints](#api-endpoints)
8. [Database Schema](#database-schema)
9. [Authentication Flow](#authentication-flow)
10. [Deployment](#deployment)

---

## Overview

A comprehensive web-based voting system for student council elections featuring:
- **Facial recognition authentication** for secure voter identification
- **Real-time vote tracking** and results display
- **Admin dashboard** for election management
- **OTP verification** for registration security
- **Blockchain-style transaction verification** with hash generation
- **Professional UI** with navy blue theme

---

## Programming Languages & Technologies

### Frontend Technologies

#### Core Languages
- **TypeScript** (.tsx, .ts) - Primary language for type-safe development
- **JavaScript** (via TypeScript compilation)
- **CSS** - Styling with Tailwind CSS v4
- **HTML** (JSX/TSX syntax)

#### Frontend Frameworks & Libraries
- **React 18.3.1** - UI library
- **React Router 7.13.0** - Client-side routing
- **TypeScript** - Type safety and developer experience
- **Vite 6.3.5** - Build tool and dev server
- **Tailwind CSS 4.1.12** - Utility-first CSS framework

#### UI Component Libraries
- **Radix UI** - Headless UI components for accessibility
  - Alert Dialog, Avatar, Dialog, Progress, Radio Group, etc.
- **shadcn/ui** - Pre-built component system
- **Lucide React** - Icon library
- **Material-UI (MUI) 7.3.5** - Optional component library
- **Motion 12.23.24** - Animation library (formerly Framer Motion)

#### Specialized Libraries
- **React Webcam 7.2.0** - Webcam access for facial recognition
- **Recharts 2.15.2** - Charts and data visualization
- **React Hook Form 7.55.0** - Form management
- **Sonner 2.0.3** - Toast notifications
- **Date-fns 3.6.0** - Date manipulation

### Backend Technologies

#### Core Languages
- **TypeScript** (.tsx) - Backend API development
- **Deno Runtime** - Modern JavaScript/TypeScript runtime

#### Backend Frameworks & Services
- **Supabase** - Backend-as-a-Service (BaaS)
  - PostgreSQL database
  - Authentication service
  - Edge Functions (serverless)
  - Storage (for candidate photos)
- **Hono** - Lightweight web framework (running on Deno)
- **PostgreSQL** - Relational database

### Development Tools
- **pnpm** - Package manager
- **ESLint** - Code linting (implicit)
- **Git** - Version control

---

## Architecture

### Three-Tier Architecture

```
┌─────────────────────────────────────────────────┐
│          Frontend (React + TypeScript)          │
│  - User interfaces (Voter & Admin)              │
│  - State management (Context API)               │
│  - Client-side routing                          │
└─────────────────┬───────────────────────────────┘
                  │
                  │ HTTPS/REST API
                  │
┌─────────────────▼───────────────────────────────┐
│      Server (Supabase Edge Functions)           │
│  - Hono web framework on Deno                   │
│  - API routes (/make-server-89722b6c/*)         │
│  - Business logic & validation                  │
│  - Authentication & authorization               │
└─────────────────┬───────────────────────────────┘
                  │
                  │ Database queries
                  │
┌─────────────────▼───────────────────────────────┐
│         Database (Supabase PostgreSQL)          │
│  - kv_store_89722b6c table (key-value pairs)    │
│  - JSONB data storage                           │
│  - Supabase Storage (candidate photos)          │
└─────────────────────────────────────────────────┘
```

### Data Flow

1. **User Interaction** → React components
2. **State Management** → Context API (VotingContext)
3. **API Calls** → Fetch to Supabase Edge Functions
4. **Backend Processing** → Hono routes in Deno runtime
5. **Data Storage** → PostgreSQL via KV store utilities
6. **Response** → JSON back to frontend

---

## Project Structure

```
/tmp/sandbox/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── ui/           # shadcn/ui components
│   │   │   │   ├── avatar.tsx
│   │   │   │   ├── button.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── dialog.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   └── ... (40+ UI components)
│   │   │   └── figma/
│   │   │       └── ImageWithFallback.tsx
│   │   │
│   │   ├── context/
│   │   │   └── VotingContext.tsx   # Global state management
│   │   │
│   │   ├── pages/              # Page components
│   │   │   ├── HomePage.tsx
│   │   │   ├── VoterLogin.tsx
│   │   │   ├── RegisterVoter.tsx
│   │   │   ├── ActiveElections.tsx
│   │   │   ├── VotingPage.tsx
│   │   │   ├── ResultsPage.tsx
│   │   │   ├── AdminLogin.tsx
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── CreateElection.tsx
│   │   │   ├── ManageVoters.tsx
│   │   │   └── MonitorVotes.tsx
│   │   │
│   │   └── App.tsx             # Main app with routing
│   │
│   ├── styles/
│   │   ├── theme.css           # Design system & CSS variables
│   │   └── fonts.css           # Font imports
│   │
│   └── main.tsx                # React entry point
│
├── supabase/
│   └── functions/
│       └── server/
│           ├── index.tsx       # Hono API routes
│           └── kv_store.tsx    # Database utilities (protected)
│
├── package.json                # Dependencies
├── vite.config.ts              # Vite configuration
└── tailwind.config.js          # Tailwind CSS config (v4)
```

---

## Features

### Voter Features
1. **Registration with OTP Verification**
   - Student information input
   - Email/phone OTP verification
   - Facial recognition registration
   - 4-step registration flow

2. **Facial Recognition Login**
   - Webcam-based authentication
   - Face matching against stored data
   - Secure voter identification

3. **Voting Interface**
   - View active elections
   - Browse candidates by position
   - Select candidates with radio buttons
   - Vote confirmation dialog
   - Transaction hash generation

4. **Results Viewing**
   - Real-time vote counts
   - Percentage calculations
   - Winner highlighting
   - Visual progress bars

### Admin Features
1. **Admin Dashboard**
   - Election overview cards
   - Quick statistics
   - Real-time vote counts
   - Voter management

2. **Election Management**
   - Create new elections
   - Define positions
   - Set start/end dates
   - Publish/unpublish elections

3. **Candidate Management**
   - Add candidates with photos
   - Position assignment
   - Manifesto/bio entry
   - Preview with avatar fallback

4. **Voter Management**
   - View registered voters
   - Verify voter data
   - Track voting status

5. **Vote Monitoring**
   - Real-time vote tracking
   - Analytics dashboard
   - Results publication

---

## Installation & Setup

### Prerequisites
- Node.js 18+
- pnpm package manager
- Supabase account

### Frontend Setup

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

### Backend Setup

The Supabase Edge Functions are already configured. Environment variables required:
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Public anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key (server-side only)
- `SUPABASE_DB_URL` - Database connection string

### Configuration Files

**vite.config.ts** - Build configuration
**tailwind.config.js** - Tailwind CSS v4 settings
**src/styles/theme.css** - Professional navy blue theme with CSS variables

---

## API Endpoints

All endpoints are prefixed with `/make-server-89722b6c/`

### Admin Endpoints

#### POST `/admin/login`
Authenticate admin user
```json
Request: { "username": "admin", "password": "admin123" }
Response: { "success": true, "token": "0x...", "message": "Admin login successful" }
```

#### POST `/admin/elections`
Create new election (requires admin token)
```json
Request: {
  "title": "Student Council 2026",
  "description": "Annual elections",
  "startDate": "2026-04-10T09:00:00",
  "endDate": "2026-04-15T17:00:00",
  "positions": ["President", "Vice President"]
}
```

#### POST `/admin/candidates`
Add candidate to election
```json
Request: {
  "electionId": "election-uuid",
  "position": "President",
  "name": "John Doe",
  "department": "Computer Science",
  "year": "3rd Year",
  "manifesto": "...",
  "imageUrl": "https://..."
}
```

### Voter Endpoints

#### POST `/voter/register`
Register new voter with facial data
```json
Request: {
  "studentId": "STU001",
  "name": "Jane Doe",
  "email": "jane@university.edu",
  "department": "Engineering",
  "year": "2nd Year",
  "phoneNumber": "+1234567890",
  "faceData": "base64-encoded-image",
  "otp": "123456"
}
```

#### POST `/voter/login`
Authenticate voter with facial recognition
```json
Request: {
  "studentId": "STU001",
  "faceData": "base64-encoded-image"
}
Response: {
  "success": true,
  "token": "0x...",
  "voter": { ... }
}
```

#### POST `/voter/otp/generate`
Generate OTP for registration
```json
Request: { "email": "jane@university.edu", "phoneNumber": "+1234567890" }
Response: { "success": true, "otp": "123456", "expiresAt": 1234567890 }
```

#### POST `/voter/otp/verify`
Verify OTP code
```json
Request: { "otp": "123456" }
Response: { "success": true, "message": "OTP verified" }
```

### Election Endpoints

#### GET `/elections`
Get all elections (public)

#### GET `/elections/:electionId`
Get specific election details

#### GET `/elections/:electionId/candidates`
Get candidates for an election

#### POST `/vote`
Cast vote (requires voter token)
```json
Request: {
  "electionId": "election-uuid",
  "votes": [
    { "position": "President", "candidateId": "candidate-uuid" }
  ]
}
Response: {
  "success": true,
  "transactionHash": "0x...",
  "message": "Vote cast successfully"
}
```

#### GET `/results/:electionId`
Get election results

---

## Database Schema

### Key-Value Store Table
```sql
CREATE TABLE kv_store_89722b6c (
  key TEXT NOT NULL PRIMARY KEY,
  value JSONB NOT NULL
);
```

### Data Keys Structure

#### Elections
- Key: `election:{uuid}`
- Value: `{ id, title, description, startDate, endDate, positions, status, createdAt }`

#### Candidates
- Key: `candidate:{uuid}`
- Value: `{ id, electionId, position, name, department, year, manifesto, imageUrl }`

#### Voters
- Key: `voter:{studentId}`
- Value: `{ studentId, name, email, department, year, phoneNumber, faceData, registeredAt, hasVoted }`

#### Votes
- Key: `vote:{electionId}:{voterId}`
- Value: `{ voteId, electionId, voterId, votes[], transactionHash, timestamp }`

#### OTP Codes
- Key: `otp:{identifier}`
- Value: `{ otp, expiresAt, verified }`

#### Admin
- Key: `admin:credentials`
- Value: `{ username, password }`

---

## Authentication Flow

### Voter Authentication
1. Student enters student ID
2. Webcam captures face image
3. Face data sent to backend
4. Backend compares with stored face data
5. On match, JWT-like token generated
6. Token stored in React Context
7. Token used for subsequent API calls

### Admin Authentication
1. Username/password input
2. Credentials verified against KV store
3. Session token generated
4. Admin state stored in Context
5. Protected routes accessible

### OTP Verification Flow
1. User enters email/phone during registration
2. System generates 6-digit OTP
3. OTP sent to user (displayed in demo mode)
4. User enters OTP within 5 minutes
5. Backend verifies OTP code
6. On success, registration proceeds

---

## Deployment

### Frontend Deployment
The application is designed for Figma Make's environment:
- No manual `vite build` needed
- Dev server auto-started
- Preview surface provided
- Custom entrypoint: `__figma__entrypoint__.ts` (auto-generated)

### Backend Deployment
Supabase Edge Functions are deployed to:
- **URL**: `https://{projectId}.supabase.co/functions/v1/make-server-89722b6c/*`
- **Runtime**: Deno on Supabase infrastructure
- **Database**: Managed PostgreSQL on Supabase

### Environment Variables
Set in Supabase dashboard:
```
SUPABASE_URL=https://hhgmwnlrcskisoaufbmr.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key
SUPABASE_DB_URL=postgresql://...
```

---

## Design System

### Theme
- **Primary Color**: Navy Blue (#1e40af)
- **Background**: Clean White (#ffffff)
- **Typography**: Inter font family
- **Border Radius**: 0.5rem
- **Shadows**: Subtle professional shadows

### Component Patterns
- Avatar with initials fallback
- Card-based layouts
- Toast notifications (Sonner)
- Modal dialogs (Radix UI)
- Form validation (React Hook Form)

---

## Security Considerations

### Frontend Security
- No sensitive keys in client code
- Input validation on all forms
- XSS prevention via React's built-in escaping
- CORS configured on backend

### Backend Security
- Service role key never exposed to frontend
- OTP expiration (5 minutes)
- Transaction hash verification
- Admin authentication required for protected routes

### Data Privacy
- Face data stored as base64 strings
- Voter information encrypted at rest (PostgreSQL)
- HTTPS-only communication
- No plaintext password storage

---

## Future Enhancements

### Potential Features
1. Real email/SMS OTP delivery
2. Advanced face recognition using ML models
3. Multi-language support
4. Vote verification portal
5. Election audit logs
6. Export results to PDF/CSV
7. Candidate campaign pages
8. Live election monitoring dashboard

### Technical Improvements
1. Add Redis for caching
2. Implement proper database migrations
3. Add comprehensive test suite
4. Set up CI/CD pipeline
5. Add rate limiting
6. Implement WebSocket for real-time updates

---

## Troubleshooting

### Common Issues

**Broken candidate images**
- Solution: System uses Avatar fallback with candidate initials
- Ensure image URLs are valid and CORS-enabled

**OTP not working**
- Check server logs in Supabase dashboard
- Verify email/phone format
- Ensure OTP hasn't expired (5-minute window)

**Facial recognition failing**
- Ensure webcam permissions granted
- Check lighting conditions
- Verify face data is being captured

**Admin login issues**
- Default credentials: admin/admin123
- Check Supabase Edge Function logs
- Verify SUPABASE_SERVICE_ROLE_KEY is set

---

## Credits & Libraries

### Major Dependencies
- React + TypeScript - Frontend framework
- Supabase - Backend infrastructure
- Tailwind CSS v4 - Styling
- Radix UI - Accessible components
- Hono - Backend web framework
- React Webcam - Camera access
- Recharts - Data visualization

---

## License
This project is built for educational purposes as a student council election management system.

---

## Support
For issues or questions, refer to:
- Supabase Documentation: https://supabase.com/docs
- React Documentation: https://react.dev
- Tailwind CSS v4 Docs: https://tailwindcss.com

---

**Last Updated**: April 5, 2026
**Version**: 1.0.0
**Project Type**: Full-stack web application with facial recognition
