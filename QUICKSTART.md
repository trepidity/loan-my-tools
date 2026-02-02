# Quick Start Guide

## 🚀 Get Your App Running in 15 Minutes

### Step 1: Set Up Supabase (5 minutes)

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project:
   - Name: `trailer-reservation`
   - Choose a database password (save it!)
   - Select your region
   - Wait for setup to complete

3. Set up the database:
   - Click "SQL Editor" in the left sidebar
   - Click "New Query"
   - Open the file `database-schema.sql` from this project
   - Copy ALL the SQL code and paste it into the editor
   - Click "RUN" at the bottom right
   - You should see "Success. No rows returned"

4. Get your API keys:
   - Click the "Settings" gear icon (bottom left)
   - Click "API"
   - Copy these two values:
     - **Project URL** (looks like `https://xxxxx.supabase.co`)
     - **anon public** key (long string under "Project API keys")

### Step 2: Configure Your App (2 minutes)

1. Open `config.js` in a text editor
2. Replace the placeholder text with your actual Supabase credentials:

```javascript
const SUPABASE_URL = 'https://your-actual-project-id.supabase.co';
const SUPABASE_ANON_KEY = 'your-actual-long-anon-key-here';
```

3. Save the file

### Step 3: Deploy (5 minutes)

**Easiest Option - Netlify Drop:**

1. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag the entire `trailer-app` folder onto the page
3. Wait 30 seconds
4. Your app is live! You'll get a URL like `https://random-name-123.netlify.app`
5. (Optional) Click "Site settings" → "Change site name" to customize your URL

**Alternative - Vercel:**

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "Add New Project"
4. Upload the `trailer-app` folder
5. Click "Deploy"

### Step 4: Create Your First Account (3 minutes)

1. Open your deployed app URL
2. Click "Login"
3. Click "Sign Up"
4. Enter your email and password
5. Check your email for a confirmation link
6. Click the confirmation link
7. Return to your app and log in

### Step 5: Test It Out!

1. **Update Location:**
   - Click "Update Location"
   - Allow location access
   - Enter a description like "Home Garage"

2. **Make a Reservation:**
   - Click on a date in the calendar
   - Fill in start date, end date
   - Add optional notes
   - Click "Submit Reservation"

3. **Share with Others:**
   - Send your app URL to others
   - They can create accounts and make reservations too!

## 🎉 You're Done!

Your trailer reservation system is now live and ready to use!

## Next Steps

- **Customize colors**: Edit `styles.css`
- **Add your logo**: Replace the 🚛 emoji in `index.html`
- **Set your location**: Update default coordinates in `app.js`
- **Add admin features**: See README.md for ideas

## Need Help?

Common issues:

- **Can't log in?** Check your email for confirmation link (check spam)
- **Map not showing?** Make sure you have internet connection
- **Calendar empty?** Try creating a test reservation
- **"Failed to fetch" error?** Double-check your Supabase credentials in `config.js`

## Video Tutorial

For a visual walkthrough, search YouTube for "Supabase tutorial" to see similar setup processes.

---

**Total Time:** ~15 minutes  
**Cost:** $0 (everything is free tier)  
**Difficulty:** Beginner-friendly 🟢
