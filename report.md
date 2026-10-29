# 📋 BloodBridge Frontend — Project Report

**Generated on:** 2026-10-28  
**Project Name:** `blood-bridge-frontend`  
**Version:** 1.0.0  
**Type:** React + Vite Single-Page Application (SPA)

---

## 📌 Project Overview

**BloodBridge** is a cloud-connected, responsive web application built to coordinate blood availability and emergency blood requests between patients/donors and participating blood banks. The frontend communicates directly with an **AWS API Gateway** backend (`BloodBankAPI`) deployed on the `dev` stage.

> ⚠️ This is a **college demonstration project** — not a production-grade medical or clinical system.

---

## 🗂️ File Structure

```
arshath/
├── index.html                  # Root HTML entry point
├── vite.config.js              # Vite build configuration
├── package.json                # Project metadata & dependencies
├── package-lock.json           # Locked dependency tree
├── .env.example                # Environment variable template
├── .gitignore                  # Git ignore rules
├── README.md                   # Developer setup & API contract documentation
├── dist/                       # Production build output (generated)
├── node_modules/               # Installed npm packages
└── src/
    ├── main.jsx                # React app entry point
    ├── App.jsx                 # Core application — all pages & components
    ├── styles.css              # Global CSS stylesheet
    └── services/
        └── api.js              # Centralized API service layer
```

---

## 📄 File-by-File Breakdown

---

### 1. `index.html`
**Role:** Root HTML shell / entry point

This is the single HTML page the browser loads. It:
- Sets the page `<title>` as **"BloodBridge — Blood availability coordination"**
- Sets `theme-color` to `#a52132` (the brand red, used on mobile browsers' status bar)
- Includes a `<meta name="description">` for SEO/accessibility
- Contains the `<div id="root"></div>` mount point where React renders the entire app
- Loads `src/main.jsx` as a JS module to kick off the React application

---

### 2. `vite.config.js`
**Role:** Build tool configuration

Configures **Vite** (the fast build tool & dev server) for this project:
- Registers the `@vitejs/plugin-react` plugin so Vite understands JSX and React's Fast Refresh (hot reload during development)
- Sets `server.host` to `0.0.0.0` so the dev server is accessible across the local network (e.g., from mobile devices on the same Wi-Fi)

---

### 3. `package.json`
**Role:** Project manifest & dependency declaration

| Field | Value |
|-------|-------|
| Name | `blood-bridge-frontend` |
| Version | `1.0.0` |
| Module type | ES Modules (`"type": "module"`) |

**Scripts:**
| Command | Action |
|---------|--------|
| `npm run dev` | Start Vite development server with hot reload |
| `npm run build` | Build optimized production bundle into `/dist` |
| `npm run preview` | Serve the production build locally for testing |

**Dependencies:**
| Package | Version | Purpose |
|---------|---------|---------|
| `react` | ^18.3.1 | Core UI library |
| `react-dom` | ^18.3.1 | React DOM renderer |
| `react-router-dom` | ^6.28.1 | Client-side routing |
| `lucide-react` | ^0.468.0 | Icon library (SVG icons) |
| `@vitejs/plugin-react` | ^4.3.4 | Vite + React integration |
| `vite` | ^6.0.7 | Build tool & dev server |

---

### 4. `.env.example`
**Role:** Environment variable template

Provides a template for developers to create their own `.env.local` file. Contains two variables:

```env
VITE_API_BASE_URL=https://on8wmr7f1b.execute-api.us-east-1.amazonaws.com/dev
VITE_DEMO_ADMIN_PASSWORD=change-this-demo-password
```

- `VITE_API_BASE_URL` — The AWS API Gateway base URL. Can be changed if the backend endpoint changes.
- `VITE_DEMO_ADMIN_PASSWORD` — A client-side demo gate password for the Admin page (default: `demo-admin`). **Not real authentication** — it's a demonstration gate only, embedded in the browser bundle at build time.

---

### 5. `.gitignore`
**Role:** Git exclusion rules

Tells Git to ignore:
- `node_modules/` — third-party packages (re-installed via `npm install`)
- `dist/` — production build output (regenerated via `npm run build`)
- `.env` and `.env.local` — local environment secrets (never committed)
- `*.log` — log files

---

### 6. `src/main.jsx`
**Role:** React application bootstrapper

The entry point for the React app. It:
- Imports React and `ReactDOM.createRoot`
- Imports `BrowserRouter` from `react-router-dom` for client-side URL routing
- Imports the root `<App />` component
- Imports the global CSS (`styles.css`)
- Mounts the app into `<div id="root">` inside `index.html`
- Wraps everything in `<React.StrictMode>` to catch potential issues during development

---

### 7. `src/services/api.js`
**Role:** Centralized API communication layer

This is the single place where all HTTP calls to the backend are made. It exports a unified `api` object that the rest of the app imports.

**Base URL Resolution:**
```js
const BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'https://...amazonaws.com/dev').replace(/\/$/, '');
```
Reads from the environment variable, falls back to the hardcoded `dev` stage URL.

**Core `request()` function:**
- Builds the full URL, appends query params (skipping undefined/null/empty values)
- Calls `fetch()` with correct headers (`Accept: application/json`, and `Content-Type: application/json` for POST/PUT/PATCH)
- Catches network errors and throws a user-friendly message
- Parses JSON response or falls back to text
- Throws on non-2xx HTTP responses with the API's error message

**Exported API methods:**
| Method | HTTP | Endpoint | Description |
|--------|------|----------|-------------|
| `getBloodBanks()` | GET | `/blood-banks` | Fetch all registered blood banks |
| `searchBlood(params)` | GET | `/search-blood` | Search by blood group & optional city |
| `addBloodBank(body)` | POST | `/add-blood-bank` | Register a new blood bank |
| `deleteBloodBank(bankId)` | DELETE | `/delete-blood-bank` | Remove a blood bank |
| `createBloodRequest(body)` | POST | `/create-request` | Submit an emergency blood request |
| `trackBloodRequest(requestId)` | GET | `/track-request` | Get status of a request by ID |
| `getBankRequests(bankId)` | GET | `/bank-requests` | Fetch requests for a specific bank |
| `manageBloodRequest(body)` | PATCH | `/manage-request` | Accept or reject a request |
| `updateInventory(body)` | PUT | `/update-inventory` | Update a bank's available blood units |

---

### 8. `src/App.jsx`
**Role:** Main application file — contains all pages, components, and routing

This is the heart of the frontend. It is a single large file containing:

#### 🔧 Shared UI Utilities (Reusable components)

| Component | Description |
|-----------|-------------|
| `Alert` | Displays error, warning, or success messages with appropriate ARIA roles and color tones |
| `Spinner` | Animated CSS loading spinner shown during API calls |
| `PageTitle` | Reusable page header with eyebrow label, `<h1>` title, subtitle, and optional action button |
| `Field` | Labeled form field wrapper with optional hint text |

#### 🐚 Shell Layout (`Shell` component)
The persistent layout wrapper around every page, containing:
- **Topbar/Navbar:** Sticky header with the BloodBridge brand logo (droplet icon + name), full navigation links, and an "API-backed data" status indicator
- **Mobile hamburger menu:** Toggle button (`<Menu>`/`<X>` icon) for responsive mobile navigation
- **`<main>`:** Page content area
- **Footer:** Branding and medical disclaimer

#### 📄 Pages

---

##### 🏠 `Home` (route: `/`)
The landing page. Features:
- **Hero section:** Large banner with headline, call-to-action buttons ("Find availability", "Make an urgent request"), and decorative animated art (orbiting rings, blood drop icon, floating cards)
- **Quick Search panel:** Inline form to pick a blood group and enter a city/location, then navigate directly to the search results page
- **Blood Group Grid:** 8 clickable tiles (A+, A-, B+, B-, AB+, AB-, O+, O-) — each links to the search page pre-filtered for that group
- **How-it-works split section:** 3-step process (Search → Coordinate → Track)
- **Participating Banks preview:** Loads the first 3 blood banks from the live API and displays them as a directory teaser
- **Emergency CTA banner:** Red call-to-action to start an emergency blood request

---

##### 🔍 `SearchPage` (route: `/search`)
Live blood availability search. Features:
- Reads initial `bloodGroup` and `city` from the URL query string (so the home page tiles can pre-fill it)
- Calls `GET /search-blood?bloodGroup=...` on the API
- Performs **client-side location filtering** on the results — matches the city/location input against the `city` and `address` fields returned by the API (handles neighborhoods like "Anna Nagar" that the API's city-only filter may miss)
- Shows results as cards with: blood group badge, bank name, address, reported available units, blood component pill, "Request from this bank" link (pre-fills the request form), phone number (clickable `tel:` link), and last-updated timestamp
- Shows empty state with retry button if no results found
- Displays a warning that reported availability must be confirmed with the bank

---

##### 🏥 `BanksPage` (route: `/banks`)
Full blood bank directory. Features:
- Fetches all banks from `GET /blood-banks`
- **Client-side search/filter** bar to filter by name, city, or address
- Displays banks as a responsive grid of cards (each showing: icon, name, city, address, phone, bank ID, verified status chip)
- Refresh button to reload from the API
- Shows count of listed banks
- Empty state when no banks or no filter matches

---

##### 🆘 `RequestPage` (route: `/request`)
Emergency blood request form. Features:
- Reads `bankId`, `bloodGroup`, and `component` from URL query params (pre-filled when coming from a search result)
- Loads bank list from the API to populate the bank dropdown
- Form fields: Bank selector, blood group, component (RBC/Plasma/Platelets/Whole Blood), quantity, requester name, contact phone, urgency (Normal/Emergency)
- **Two-step confirmation:** Clicking "Review request" opens a modal with a summary of all entered details before final submission
- On success: shows a success panel with the returned `requestId` and a direct link to track the request

---

##### 📝 `RegisterBank` (route: `/register-bank`)
Public blood bank registration form. Features:
- Fields: Bank ID, Name, City, Address, Contact Phone
- Submits to `POST /add-blood-bank`
- On success: shows a success panel with the assigned Bank ID and a button to register another bank

---

##### 📦 `TrackPage` (route: `/track`)
Request status tracker. Features:
- Reads `requestId` from the URL query string (auto-tracks when linked from the success page)
- Calls `GET /track-request?requestId=...`
- Shows a status card with: request ID, status chip (color-coded: pending/accepted/rejected), blood group, component, quantity, urgency, bank ID, created timestamp
- Privacy warning reminding users not to share request IDs publicly

---

##### 🔐 `Login` (sub-component for Admin)
Demo-only admin password gate:
- Reads the expected password from `VITE_DEMO_ADMIN_PASSWORD` env variable (defaults to `demo-admin`)
- Stores `'bb-demo-admin': 'true'` in `sessionStorage` on success (cleared when the tab closes)
- Clearly labelled as **not backend authentication**

---

##### ⚙️ `Admin` (route: `/admin`)
Admin/staff management dashboard. Gated by the demo login. Features three tabs:

**Tab 1 — Blood Bank Management:**
- `AdminRegisterBank`: Register new blood banks (same API as public form)
- `DeleteBank`: Danger-zone panel to permanently delete a bank from the API with a confirmation modal

**Tab 2 — Inventory Management:**
- Select a bank, blood group, component, and unit count
- Submits to `PUT /update-inventory`
- Note: The API has no read endpoint for inventory, so saved stock is not displayed back

**Tab 3 — Emergency Requests:**
- Loads incoming requests for the selected bank via `GET /bank-requests?bankId=...`
- **Auto-refreshes every 30 seconds** using `setInterval`
- Shows pending count badge
- Each request row shows: urgency, blood group, component, quantity, requester name, contact phone, request ID
- EMERGENCY requests highlighted with a red left border
- Accept/Reject buttons for PENDING requests (calls `PATCH /manage-request`)

---

#### 🔀 Router & 404
```
/           → Home
/search     → SearchPage
/banks      → BanksPage
/request    → RequestPage
/register-bank → RegisterBank
/track      → TrackPage
/admin      → Admin (with Login gate)
*           → 404 Not Found page
```

---

### 9. `src/styles.css`
**Role:** Global CSS stylesheet

A large, carefully crafted CSS file with no external CSS framework (no Tailwind, no Bootstrap). Everything is hand-written using:

**Design System Highlights:**
- **Fonts:** `DM Sans` (body) + `Manrope` (headings) loaded from Google Fonts
- **Color palette (CSS variables):**
  | Variable | Color | Use |
  |----------|-------|-----|
  | `--red` | `#a52132` | Brand/primary actions |
  | `--red-dark` | `#861a2a` | Hover states |
  | `--navy` | `#172536` | Dark text/icons |
  | `--muted` | `#728091` | Secondary text |
  | `--line` | `#e7e9ed` | Borders/dividers |
  | `--green` | `#16834b` | Success/verified states |
  | `--orange` | `#b66a11` | Warning states |
  | `--shadow` | `0 12px 40px rgba(...)` | Card shadows |

**Key UI Patterns:**
- Sticky topbar with active nav underline indicator
- Responsive hero section (2-column → 1-column on mobile)
- Card-based layouts for banks, search results, and requests
- Accessible focus rings on interactive elements
- CSS spinner animation (`@keyframes spin`)
- Status chips with contextual colors (pending=yellow, accepted=green, rejected=red)
- Modal backdrop with confirmation dialogs
- Admin dashboard tab system
- Emergency request row highlighting (red left border)
- `@media (prefers-reduced-motion: reduce)` support for accessibility

**Responsive Breakpoints:**
| Breakpoint | Layout Changes |
|-----------|---------------|
| ≤ 1050px | Reduced nav gaps, 4-column group grid, hero scaled |
| ≤ 760px | Mobile nav (hamburger), single-column hero, 2-column bank grid |
| ≤ 500px | Ultra-compact layout, stacked hero actions, 1-column grids |

---

## 🏗️ Architecture Summary

```
Browser
  └── index.html
        └── src/main.jsx          (React bootstrap)
              └── <BrowserRouter>
                    └── <App />   (src/App.jsx)
                          ├── <Shell>         (Topbar + Nav + Footer)
                          └── <Routes>
                                ├── /          → <Home />
                                ├── /search    → <SearchPage />
                                ├── /banks     → <BanksPage />
                                ├── /request   → <RequestPage />
                                ├── /register-bank → <RegisterBank />
                                ├── /track     → <TrackPage />
                                └── /admin     → <Admin /> (demo login gate)

All pages call:
  src/services/api.js → AWS API Gateway (us-east-1) → AWS Lambda functions
```

---

## ☁️ Backend API Contract

The frontend connects to:
```
https://on8wmr7f1b.execute-api.us-east-1.amazonaws.com/dev
```

| Endpoint | Method | Used By |
|----------|--------|---------|
| `/blood-banks` | GET | Home, BanksPage, RequestPage, Admin |
| `/search-blood` | GET | SearchPage |
| `/add-blood-bank` | POST | RegisterBank, Admin (Register tab) |
| `/delete-blood-bank` | DELETE | Admin (Banks tab) |
| `/create-request` | POST | RequestPage |
| `/track-request` | GET | TrackPage |
| `/bank-requests` | GET | Admin (Requests tab) |
| `/manage-request` | PATCH | Admin (Requests tab — Accept/Reject) |
| `/update-inventory` | PUT | Admin (Inventory tab) |

---

## 🔒 Security & Limitations

| Concern | Status |
|---------|--------|
| Admin auth | Demo-only client-side gate (`VITE_DEMO_ADMIN_PASSWORD`). Not real authorization. |
| API key | None embedded. Write operations may fail if API Gateway requires an API key. |
| Request ID tracking | No identity verification — treat request IDs as private. |
| Inventory read | No `GET /inventory` endpoint; saved stock cannot be read back. |
| CORS | Backend must allow the local dev origin for API calls to succeed. |
| Patient data | Must NOT be used for real clinical/patient data without backend authorization. |

---

## 🚀 How to Run

```bash
# 1. Install dependencies
npm install

# 2. Set up environment (copy and edit)
cp .env.example .env.local

# 3. Start development server
npm run dev

# 4. Build for production
npm run build

# 5. Preview production build locally
npm run preview
```

**Default Admin Password:** `demo-admin` (configurable via `VITE_DEMO_ADMIN_PASSWORD`)

---

## 📊 Project Stats

| Metric | Value |
|--------|-------|
| Total source files | 4 (main.jsx, App.jsx, styles.css, api.js) |
| Pages/Routes | 7 (+ 404) |
| API endpoints used | 9 |
| React components | ~15 (in a single App.jsx file) |
| External dependencies | 5 |
| CSS framework | None (fully hand-written CSS) |
| Build tool | Vite 6 |
| React version | 18.3.1 |

---

*This report was auto-generated by reading all source files in the project.*
