# Facial Recognition Voting System

A comprehensive online voting system for student council elections with facial recognition authentication, built with React, TypeScript, Tailwind CSS, and Supabase.

## Features

### Voter Side
- ✅ Facial recognition registration (camera or photo upload)
- ✅ Facial recognition login
- ✅ View active elections
- ✅ Browse candidates with detailed profiles
- ✅ Cast votes with confirmation dialogs
- ✅ View real-time results
- ✅ Blockchain-style transaction verification

### Admin Side
- ✅ Admin authentication
- ✅ Create and manage elections
- ✅ Add candidates with photos and manifestos
- ✅ View registered voters
- ✅ Monitor vote counts in real-time
- ✅ Analytics dashboard
- ✅ Results publishing

## Prerequisites

Before running this project locally, ensure you have:

- **Node.js** (v18 or higher)
- **npm** or **pnpm** package manager
- **A Supabase account** (free tier works)
- **Git** (for cloning)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd facial-recognition-voting
```

### 2. Install Dependencies

```bash
# Using npm
npm install

# OR using pnpm
pnpm install
```

### 3. Set Up Supabase

#### Create a Supabase Project:
1. Go to [https://supabase.com](https://supabase.com)
2. Create a new project
3. Note your **Project URL** and **Anon Public Key**

#### Update Supabase Info:
Edit `/utils/supabase/info.tsx` with your Supabase credentials:

```typescript
export const projectId = "YOUR_PROJECT_ID" // Extract from your Supabase URL
export const publicAnonKey = "YOUR_ANON_PUBLIC_KEY"
```

### 4. Deploy Backend Edge Function

The backend server needs to be deployed to Supabase Edge Functions.

#### Install Supabase CLI:
```bash
npm install -g supabase
```

#### Login to Supabase:
```bash
supabase login
```

#### Link Your Project:
```bash
supabase link --project-ref YOUR_PROJECT_ID
```

#### Deploy the Edge Function:
```bash
supabase functions deploy make-server-89722b6c --no-verify-jwt
```

**Important:** The function should be at `/supabase/functions/server/index.tsx`

You may need to create a proper function structure:
```bash
# Create the function directory
mkdir -p supabase/functions/make-server-89722b6c

# Copy the server files
cp supabase/functions/server/index.tsx supabase/functions/make-server-89722b6c/index.ts
cp supabase/functions/server/kv_store.tsx supabase/functions/make-server-89722b6c/kv_store.ts
```

#### Set Environment Variables in Supabase:
Go to your Supabase Dashboard → Edge Functions → Secrets and add:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### 5. Run Development Server

```bash
# Using npm
npm run dev

# OR using pnpm
pnpm dev
```

The app should now be running at `http://localhost:5173`

## Default Credentials

**Admin Login:**
- Username: `admin`
- Password: `admin123`

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── ui/          # Shadcn UI components
│   │   │   └── FaceRecognition.tsx
│   │   ├── context/         # React Context (State Management)
│   │   ├── pages/           # Application pages/routes
│   │   ├── routes.tsx       # React Router configuration
│   │   └── App.tsx          # Main app component
│   ├── styles/              # Global styles and Tailwind
│   └── main.tsx             # Application entry point
├── supabase/
│   └── functions/
│       └── server/          # Backend Edge Function
│           ├── index.tsx    # API routes
│           └── kv_store.tsx # Database utilities
├── utils/
│   └── supabase/
│       └── info.tsx         # Supabase configuration
├── package.json
├── vite.config.ts
└── index.html
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS v4, Shadcn UI
- **Routing:** React Router v7
- **State Management:** React Context API
- **Backend:** Supabase Edge Functions (Hono)
- **Database:** Supabase KV Store (Postgres)
- **Camera:** react-webcam
- **Icons:** Lucide React
- **Charts:** Recharts
- **Notifications:** Sonner (Toast)

## Important Notes

### Camera Permissions
- Users must allow camera access in their browser
- Upload photo fallback is available if camera access is denied
- Camera errors are handled gracefully with helpful instructions

### Backend Architecture
- Uses Supabase Edge Functions with Hono web framework
- KV Store for data persistence (key-value pairs in Postgres)
- RESTful API endpoints prefixed with `/make-server-89722b6c`
- All routes have CORS enabled

### Security Considerations
⚠️ **This is a prototype/demo application:**
- Face data is stored as base64 strings (NOT production-ready)
- No actual ML-based facial recognition (90% success rate simulation)
- Default admin credentials should be changed
- In production, implement proper facial recognition ML models
- Add proper authentication with JWT tokens
- Implement rate limiting and input validation

## Troubleshooting

### Backend Connection Issues
- Verify Edge Function is deployed: `supabase functions list`
- Check function logs: `supabase functions logs make-server-89722b6c`
- Ensure environment variables are set in Supabase Dashboard

### Camera Not Working
- Check browser permissions in address bar
- Try using "Upload Photo" option instead
- Ensure HTTPS is used (cameras require secure context)

### Build Errors
- Clear node_modules: `rm -rf node_modules && npm install`
- Check Node.js version: `node --version` (should be v18+)
- Verify all dependencies installed correctly

## Development Notes

### Adding New Features
1. Create components in `/src/app/components`
2. Add pages in `/src/app/pages`
3. Update routes in `/src/app/routes.tsx`
4. Add API endpoints in `/supabase/functions/server/index.tsx`

### Database Schema
The KV Store uses the following key patterns:
- `voter:{studentId}` - Voter records
- `election:{electionId}` - Election records
- `candidate:{candidateId}` - Candidate records
- `vote:{voteId}` - Vote transaction records
- `voters:list` - Array of all voter IDs
- `elections:list` - Array of all election IDs
- `election:{electionId}:candidates` - Array of candidate IDs per election

## License

This project is for educational purposes.

## Support

For issues or questions, please check the browser console logs and Supabase function logs for detailed error messages.
