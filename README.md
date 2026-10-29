# 🩸 Cloud-Based Blood Availability System

A responsive web application that helps users **search for blood availability**, **coordinate emergency blood requests**, and **manage blood bank inventories** — all powered by a cloud-hosted AWS API backend.

> ⚠️ **Disclaimer:** This is an academic/demonstration project. It is **not** a production-ready healthcare system and should not be used for real medical decisions.

---

## 📌 What This Project Does

This system connects people who need blood with participating blood banks through a simple, unified web interface:

| Feature | Description |
|---------|-------------|
| 🔍 **Search Blood Availability** | Search real-time blood stock by blood group and city/location |
| 🏥 **Blood Bank Directory** | Browse all registered blood banks with contact details |
| 🆘 **Emergency Blood Request** | Submit urgent blood requests to a specific blood bank |
| 📋 **Request Tracking** | Track the status of your blood request using a unique Request ID |
| 🏢 **Blood Bank Registration** | Register a new blood bank into the system |
| ⚙️ **Admin Dashboard** | Manage inventory, accept/reject incoming requests (demo-gated) |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, React Router v6 |
| **Build Tool** | Vite |
| **Icons** | Lucide React |
| **Backend API** | AWS API Gateway + Lambda (serverless) |
| **Database** | AWS DynamoDB (managed by backend) |
| **Hosting** | Can be deployed to any static hosting (Vercel, Netlify, S3, etc.) |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or higher (Node 20 LTS recommended)
- npm (comes with Node.js)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/cloud-based-blood-availability-system.git
   cd cloud-based-blood-availability-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` if you need to change the API URL or demo admin password.

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**  
   Visit the local URL printed in the terminal (usually `http://localhost:5173`).

---

## 📦 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the development server with hot reload |
| `npm run build` | Build the optimized production bundle |
| `npm run preview` | Preview the production build locally |

---

## 📂 Project Structure

```
cloud-based-blood-availability-system/
├── index.html              # Entry HTML file
├── vite.config.js          # Vite configuration
├── package.json            # Project metadata and dependencies
├── .env.example            # Sample environment variables
├── .gitignore              # Files excluded from version control
├── report.md               # Detailed project report
├── README.md               # This file
└── src/
    ├── main.jsx            # React app entry point
    ├── App.jsx             # All pages and components
    ├── styles.css          # Complete application styles
    └── services/
        └── api.js          # API service layer (all backend calls)
```

---

## 🔗 API Endpoints Used

The frontend communicates with an AWS API Gateway backend. Here are the endpoints it uses:

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/blood-banks` | Fetch all registered blood banks |
| `GET` | `/search-blood` | Search blood availability by group and location |
| `GET` | `/track-request` | Track a blood request by its ID |
| `GET` | `/bank-requests` | Get pending requests for a specific bank |
| `POST` | `/add-blood-bank` | Register a new blood bank |
| `POST` | `/create-request` | Submit an emergency blood request |
| `PUT` | `/update-inventory` | Update blood stock for a bank |
| `PATCH` | `/manage-request` | Accept or reject a pending request |
| `DELETE` | `/delete-blood-bank` | Remove a blood bank from the directory |

---

## 🖥️ Pages Overview

### 🏠 Home Page
Landing page with a quick search bar, blood group shortcuts, and a preview of participating blood banks.

### 🔍 Search Availability
Search for blood by group (A+, A−, B+, B−, AB+, AB−, O+, O−) and optionally filter by city. Results show available units, components, and a direct link to request blood from that bank.

### 🏥 Blood Bank Directory
Browse all registered blood banks. Filter by name, city, or address. View contact details and verification status.

### 🆘 Emergency Request
Fill out a form with your details, select a blood bank, blood group, component, quantity, and urgency level. A confirmation dialog appears before submission. You receive a Request ID to track the status.

### 📋 Track Request
Enter your Request ID to view the current status (Pending, Accepted, Rejected), blood group, component, quantity, and timestamps.

### ⚙️ Admin Dashboard (Demo-Gated)
Protected by a client-side demo password. Provides three management tabs:
- **Blood Bank Management** — Register or delete blood banks
- **Inventory Management** — Update blood stock levels
- **Emergency Requests** — View and accept/reject incoming requests

---

## ⚠️ Important Notes

- **Demo Admin Password:** The admin panel uses a client-side password gate (`VITE_DEMO_ADMIN_PASSWORD`). This is **not real authentication** — it's only a demo barrier. The default password is `demo-admin`.
- **No Secrets in Code:** No AWS credentials or API keys are embedded. The frontend calls a public API Gateway endpoint.
- **Data Accuracy:** Displayed blood stock is reported inventory, not a guarantee. Always confirm directly with the blood bank.
- **CORS:** The backend API must have CORS configured to allow requests from your frontend's origin.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 📄 License

This project is created for academic/demonstration purposes.

---

## 👤 Author

**Arshath Ahamed**

---

*Built with ❤️ using React + Vite + AWS*
