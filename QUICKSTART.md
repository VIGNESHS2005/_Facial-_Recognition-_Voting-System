# Quick Start Guide

## Fastest Way to Run Locally (5 Minutes)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Create Your Supabase Project

1. **Go to** [https://supabase.com](https://supabase.com) and sign up/login
2. **Click** "New Project"
3. **Fill in:**
   - Project name: `voting-system`
   - Database password: (save this somewhere safe)
   - Region: (choose closest to you)
4. **Wait** ~2 minutes for project creation

### Step 3: Get Your Credentials

In your Supabase dashboard:
1. Go to **Settings** → **API**
2. Copy the following:
   - **Project URL**: (looks like `https://xxxxx.supabase.co`)
   - **Anon public key**: (long JWT token)
   - **Service role key**: (another long JWT token)

### Step 4: Update Your Config

Edit `/utils/supabase/info.tsx`:

```typescript
// Extract just the project ID from URL: https://hhgmwnlrcskisoaufbmr.supabase.co → hhgmwnlrcskisoaufbmr
export const projectId = "YOUR_PROJECT_ID_HERE"
export const publicAnonKey = "YOUR_ANON_KEY_HERE"
```

### Step 5: Deploy Backend

```bash
# Install Supabase CLI (one-time)
npm install -g supabase

# Login
supabase login

# Link project (use the project ID from Step 4)
supabase link --project-ref YOUR_PROJECT_ID

# Deploy the backend function
supabase functions deploy make-server-89722b6c --no-verify-jwt
```

### Step 6: Set Environment Variables

In Supabase Dashboard:
1. Go to **Edge Functions** → **make-server-89722b6c**
2. Click **Settings** → **Secrets**
3. Add these secrets:
   - `SUPABASE_URL` = Your project URL
   - `SUPABASE_ANON_KEY` = Your anon public key
   - `SUPABASE_SERVICE_ROLE_KEY` = Your service role key

### Step 7: Run the App!

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser!

---

## Default Login Credentials

**Admin:**
- Username: `admin`
- Password: `admin123`

**Voter:**
- Must register first at `/register-voter`

---

## Common Issues & Fixes

### ❌ "Backend connection failed"
**Fix:** Make sure you deployed the Edge Function (Step 5) and set environment variables (Step 6)

**Check:**
```bash
supabase functions list
supabase functions logs make-server-89722b6c
```

### ❌ "Camera permission denied"
**Fix:** Use the "Upload Photo" option instead of "Use Camera"

### ❌ Module errors during build
**Fix:** Delete and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

### ❌ Port already in use
**Fix:** Use a different port:
```bash
npm run dev -- --port 3000
```

---

## Testing the Full Flow

### 1. Register a Voter
1. Go to http://localhost:5173
2. Click "Register as Voter"
3. Fill in student info
4. Upload a photo (any photo works for demo)
5. Click "Confirm & Continue"

### 2. Login as Admin
1. Go to http://localhost:5173
2. Click "Admin Portal"
3. Login with `admin` / `admin123`

### 3. Create an Election
1. In admin dashboard, click "Create Election"
2. Fill in details
3. Add candidates with photos

### 4. Vote
1. Logout and go back home
2. Click "Vote Now"
3. Login with your student ID
4. Upload a photo again
5. Select candidates and vote!

### 5. View Results
1. Click "View Results" from home page
2. See real-time vote counts

---

## Need Help?

1. **Check browser console** (F12) for frontend errors
2. **Check Supabase logs** for backend errors:
   ```bash
   supabase functions logs make-server-89722b6c --tail
   ```
3. **Read the full README.md** for detailed documentation

---

## What's Next?

- Change default admin password in `/supabase/functions/server/index.tsx`
- Add more candidates and positions
- Customize the UI theme in `/src/styles/theme.css`
- Deploy to production (Vercel, Netlify, etc.)
