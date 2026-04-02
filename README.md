# Digital Life Lessons

**Live Site:** [https://digital-life-lessons-client-0.netlify.app](https://digital-life-lessons-client-0.netlify.app)

## About the Project

Digital Life Lessons is a full-stack platform where users can create, store, and share meaningful life lessons, personal growth insights, and wisdom gathered over time. The platform encourages mindful reflection and community-driven learning.

## Features

- 🔐 Secure authentication with Email/Password and Google Sign-In via Firebase, with JWT-based protected API routes
- 💎 Free & Premium subscription plans with Stripe payment integration — one-time ৳1,500 lifetime access that unlocks exclusive premium lessons
- 📖 Browse public life lessons with real-time search, filter by category and emotional tone, sort by newest or most saved, and paginated results
- 🔒 Premium lessons are blurred and locked for free users with an upgrade prompt; premium users see full content
- 📊 User and Admin dashboards with analytics charts, lesson management, user role control, and reported content moderation
- 🔖 Save lessons to a personal Favorites collection and manage them with category/tone filters
- ❤️ Like, comment, report, and share lessons on Facebook, X (Twitter), and LinkedIn
- 📄 Export any lesson as a PDF with one click
- 🌙 Dark/Light theme toggle for comfortable reading in any environment
- 🎞️ Lottie animation feedback when a lesson is successfully published
- 🛡️ Admin panel to manage users, toggle featured lessons, moderate content, and handle flagged/reported lessons
- 📱 Fully responsive design for mobile, tablet, and desktop

## Tech Stack

**Client:** React 18, Vite, Tailwind CSS, React Router DOM v6, TanStack React Query, Firebase, Axios, Recharts, Swiper, React Hook Form, React Hot Toast, SweetAlert2, Lottie React, React Share, jsPDF, html2canvas

**Server:** Node.js, Express.js, MongoDB, JWT, Stripe, CORS

## Getting Started

```bash
# Clone the repo
git clone https://github.com/your-username/digital-life-lessons-client

# Install dependencies
npm install

# Set up environment variables in .env.local
# VITE_FIREBASE_API_KEY, VITE_API_URL, VITE_STRIPE_PUBLISHABLE_KEY

# Start development server
npm run dev
```

## Environment Variables

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_API_URL=
VITE_STRIPE_PUBLISHABLE_KEY=
```
