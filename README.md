# 🚛 Trailer Reservation System

A simple, mobile-friendly web application for managing trailer reservations with real-time calendar updates and location tracking.

## Features

- 📅 **Visual Calendar** - See availability at a glance with FullCalendar
- 🗺️ **Location Tracking** - Track where your trailer is currently located
- 👥 **User Authentication** - Secure login/signup system
- ⚡ **Real-time Updates** - See reservations update live
- 📱 **Mobile Friendly** - Works great on phones and tablets
- 🔔 **Reservation Management** - Create, view, and cancel reservations

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **Backend**: Supabase (PostgreSQL database + Auth)
- **Calendar**: FullCalendar
- **Maps**: Leaflet
- **Real-time**: Supabase Realtime subscriptions

## Setup Instructions

### 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in your project details:
   - **Name**: trailer-reservation
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose closest to your users
5. Wait for the project to be created (~2 minutes)

### 2. Set Up the Database

1. In your Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy the entire contents of `database-schema.sql`
4. Paste it into the SQL editor
5. Click **Run** (bottom right)
6. You should see "Success. No rows returned" - this is correct!

### 3. Get Your API Credentials

1. In Supabase dashboard, go to **Settings** (gear icon) → **API**
2. Find these two values:
   - **Project URL** (something like `https://xxxxx.supabase.co`)
   - **anon public** key (under "Project API keys")
3. Copy both values

### 4. Configure the App

1. Open `config.js` in your code editor
2. Replace the placeholder values:
   ```javascript
   const SUPABASE_URL = 'https://your-project.supabase.co';
   const SUPABASE_ANON_KEY = 'your-anon-key-here';
   ```
3. Save the file

### 5. Enable Email Authentication (Optional but Recommended)

1. In Supabase dashboard, go to **Authentication** → **Providers**
2. Make sure **Email** is enabled
3. Configure email templates if desired:
   - Go to **Authentication** → **Email Templates**
   - Customize the confirmation email

### 6. Deploy Your App

You have several options:

#### Option A: Netlify (Recommended - Free & Easy)

1. Go to [https://app.netlify.com](https://app.netlify.com)
2. Sign up or log in
3. Drag and drop your `trailer-app` folder onto Netlify
4. Your app will be live in seconds!
5. Netlify will give you a URL like `https://your-app.netlify.app`

#### Option B: Vercel (Also Free & Easy)

1. Go to [https://vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Import your project
4. Deploy!

#### Option C: GitHub Pages (Free, requires GitHub)

1. Create a GitHub repository
2. Upload all files
3. Go to Settings → Pages
4. Select main branch
5. Your app will be at `https://yourusername.github.io/repo-name`

#### Option D: Local Testing

1. Install a simple HTTP server:
   ```bash
   # If you have Python installed:
   python -m http.server 8000
   
   # Or if you have Node.js:
   npx serve
   ```
2. Open your browser to `http://localhost:8000`

## Usage Guide

### For First-Time Setup

1. **Create an Account**
   - Click "Login" → "Sign Up"
   - Enter your email and password
   - Check your email for confirmation (may take a few minutes)
   - Click the confirmation link

2. **Set Initial Location**
   - Click "Update Location"
   - Allow location access when prompted
   - Enter a description (e.g., "Home Garage")

### Making Reservations

1. **Login** to your account
2. Click on dates in the calendar or drag across multiple dates
3. Fill in the reservation form:
   - Start date
   - End date
   - Optional notes
4. Click "Submit Reservation"

### Checking Availability

- Red events = Confirmed reservations (trailer is booked)
- Orange events = Pending reservations (awaiting confirmation)
- Click any event to see details

### Updating Trailer Location

- Click "Update Location" button
- Allow browser to access your location
- Enter a description of the location
- Location updates in real-time for all users

### Managing Your Reservations

- View all upcoming reservations in the "Upcoming Reservations" section
- Cancel your own reservations by clicking on them in the calendar

## File Structure

```
trailer-app/
├── index.html          # Main HTML structure
├── styles.css          # All styling (mobile-responsive)
├── app.js              # Main application logic
├── config.js           # Supabase configuration
├── database-schema.sql # Database setup script
└── README.md          # This file
```

## Customization

### Change Colors

Edit `styles.css`:
- Primary blue: `#3498db` → your color
- Confirmed reservations: `#e74c3c` → your color
- Pending reservations: `#f39c12` → your color

### Change Default Map Location

Edit `app.js` in the `initializeMap()` function:
```javascript
map = L.map('map').setView([YOUR_LAT, YOUR_LNG], 13);
```

### Add Admin Features

To add admin approval for reservations:
1. Add an `is_admin` column to the users table
2. Modify the reservation flow to require approval
3. Add admin UI to confirm/reject pending reservations

## Troubleshooting

### "Failed to fetch" or CORS errors
- Make sure your Supabase URL and API key are correct in `config.js`
- Check that your Supabase project is active

### Email confirmations not arriving
- Check spam folder
- In Supabase, go to Authentication → Settings
- Ensure email provider is configured
- For testing, you can disable email confirmation

### Map not showing
- Check browser console for errors
- Make sure you have internet connection (Leaflet needs to load tiles)

### Calendar not loading events
- Check browser console for errors
- Verify database schema was created correctly
- Check Supabase logs for any database errors

### Real-time updates not working
- Make sure you've enabled Realtime in Supabase:
  - Database → Replication
  - Enable replication for the `reservations` table

## Security Notes

- Row Level Security (RLS) is enabled by default
- Users can only modify their own reservations
- All users can view reservations (to check availability)
- Only authenticated users can create reservations
- API keys in `config.js` are safe to expose (they're "public" keys)

## Future Enhancements

Ideas for expanding the app:

- [ ] Email notifications for new/cancelled reservations
- [ ] Admin approval workflow
- [ ] Multiple trailers support
- [ ] Reservation history
- [ ] Export calendar to Google Calendar/iCal
- [ ] SMS notifications
- [ ] Damage reports/photos
- [ ] Maintenance schedule tracking
- [ ] User ratings/reviews
- [ ] Waitlist for popular dates

## Support

If you run into issues:

1. Check the browser console for errors (F12 → Console)
2. Check Supabase logs (Dashboard → Logs)
3. Verify all setup steps were completed
4. Make sure you're using a modern browser (Chrome, Firefox, Safari, Edge)

## License

MIT License - Feel free to use and modify for your needs!

---

Built with ❤️ using Supabase, FullCalendar, and Leaflet
