# 🌟 ClubSphere — College Club Event Management Platform

> **Discover. Participate. Connect.**  
> The premier, modern full-stack web application designed for campus clubs, student activities, and event registrations.

---

## 📸 Overview & Features

ClubSphere is a production-quality full-stack platform built with **React (Vite)**, **Node.js (Express)**, and **MongoDB (Mongoose)**. It provides a modern experience for students exploring campus events and a comprehensive administration dashboard for club leads and faculty coordinators.

### 🎓 Student / User Facing Features
* **Interactive Home Page:**
  * Modern sticky navigation.
  * Hero banner with live Next Event preview card.
  * Real-time Campus KPI Metrics (Upcoming Events, Open Registrations, Active Categories, Total Passes).
  * **Flagship Event Spotlight** showcasing top campus events.
  * Three-pillar value proposition (*Discover*, *Participate*, *Connect*).
  * Category quick-filters and clean footer.
* **Events Discovery & Catalog:**
  * Real-time search by Title, Description, or Venue.
  * Category filter pills (*All*, *Technical*, *Workshop*, *Hackathon*, *Cultural*, *Sports*, *Competition*, *Management*).
  * Sorting options (Upcoming First, Furthest First, Title A-Z, Title Z-A).
  * Smooth loading skeleton animations and empty search states.
* **Event Details View:**
  * High-resolution cover banners with dynamic category tags.
  * Comprehensive overview, agenda breakdown, rules, and participant perks.
  * Live seat capacity progress indicator (*Fast Filling* / *Housefull* badges).
  * Direct share link with clipboard copy feedback.
* **Event Registration & Digital Ticket Pass:**
  * Validated registration form (Full Name, College Email, Institution, Academic Year, 10-Digit Phone).
  * Duplicate registration prevention.
  * Confetti celebration on confirmed submission.
  * **Digital Campus Entry Pass** with Ticket ID, attendee details, event metadata, and print/save functionality.

---

### 🛡️ Admin Portal Features
* **Secure Admin Authentication:**
  * Dedicated login gateway with token session persistence.
  * Protected route guards for admin consoles.
* **Overview Analytics:**
  * Total Events, Upcoming Events, and Verified Student Registrations KPIs.
* **Full Event CRUD Management:**
  * **Create Event:** Modal form with category selectors, custom dates, time ranges, venues, capacities, and custom cover images.
  * **Edit Event:** Instant inline updating of existing events.
  * **Delete Event:** Confirmation dialog preventing accidental loss of events and registrations.
* **Student Registrations Manager:**
  * Live search across student names, emails, colleges, and ticket IDs.
  * Filter registrations by specific campus event.
  * **One-Click CSV Export** for offline attendance tracking and certificate generation.

---

## 🛠️ Tech Stack & Architecture

```
club-event-management/
│
├── frontend/                     # React + Vite Client
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   │   ├── layout/           # Navbar, Footer
│   │   │   ├── common/           # Button, Badge, Modal, Skeletons
│   │   │   ├── events/           # EventCard, SearchFilterBar, FeaturedEvent
│   │   │   ├── home/             # Hero, HeroEventPreview, Stats, WhyClubSphere, CategoryGrid, CTA
│   │   │   └── admin/            # StatsCard, EventModal, ConfirmDeleteModal, RegistrationTable
│   │   ├── pages/                # Home, Events, EventDetails, Register, AdminLogin, AdminDashboard
│   │   ├── services/             # Axios API client, eventService, registrationService, authService
│   │   ├── context/              # AuthContext for session management
│   │   └── styles/               # CSS design tokens & Tailwind utilities
│   ├── package.json
│   └── vite.config.js
│
├── backend/                      # Node.js + Express API Server
│   ├── config/                   # MongoDB connection manager (Atlas / In-Memory)
│   ├── models/                   # Event, Registration, Admin Mongoose Schemas
│   ├── controllers/              # Business logic for Events, Registrations, and Auth
│   ├── middleware/               # JWT auth guard, Central error handler
│   ├── routes/                   # REST API routes (/api/events, /api/registrations, /api/auth)
│   ├── utils/                    # Initial database seeder
│   ├── server.js                 # Express server entry point
│   ├── .env.example              # Environment variables template
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started Locally

### Prerequisites
* **Node.js** (v18 or higher recommended)
* **npm** (v9 or higher)

### 1. Clone & Install Dependencies
```bash
# In the project root directory
npm run install:all
```

---

### 2. Start the Backend Server
```bash
cd backend
npm start
```
* The server will start on **`http://localhost:5001`**.
* Initial events and default admin account will be seeded automatically!
* Health Check: `http://localhost:5001/api/health`

---

### 3. Start the Frontend Application
```bash
cd frontend
npm run dev
```
* Open your browser at **`http://localhost:5173`**.

---

## 🔑 Default Admin Credentials

To access the Admin Management Portal:
* **URL:** `http://localhost:5173/admin/login`
* **Username:** `admin`
* **Password:** `admin123`

---

## 📡 REST API Reference

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Service health status | No |
| `GET` | `/api/events` | List all events (query: `search`, `category`, `sort`) | No |
| `GET` | `/api/events/:id` | Get single event details with live seat count | No |
| `POST` | `/api/events` | Create new event | **Admin JWT** |
| `PUT` | `/api/events/:id` | Update existing event | **Admin JWT** |
| `DELETE` | `/api/events/:id` | Delete event & its registrations | **Admin JWT** |
| `POST` | `/api/registrations` | Register student for an event | No |
| `GET` | `/api/registrations` | List all registrations (query: `search`, `eventId`) | **Admin JWT** |
| `GET` | `/api/registrations/event/:id` | List registrations for specific event | **Admin JWT** |
| `POST` | `/api/auth/login` | Admin login & JWT token retrieval | No |
| `GET` | `/api/auth/verify` | Verify current session | **Admin JWT** |
| `GET` | `/api/auth/stats` | Aggregate dashboard analytics | **Admin JWT** |

---

## 📄 License
This project is licensed under the MIT License.
