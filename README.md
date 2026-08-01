# Vance Metal Fabrication Portal

A MERN stack (MongoDB, Express.js, React, Node.js) web application for an industrial metal/steel fabrication company. The platform showcases company capabilities, hosts a filterable project portfolio, processes client quote requests (with PDF/blueprint uploads), and features a secure, JWT-authenticated admin control panel for content management.

## Project Structure

```text
/
├── server/       # Node.js + Express.js backend API
└── client/       # React (Vite) + Tailwind CSS v4 frontend
```

---

## 🚀 Setup & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [MongoDB](https://www.mongodb.com/) (Local server or MongoDB Atlas connection)

---

### 1. Backend Server Setup (`/server`)

1. Navigate to the server folder:
   ```bash
   cd server
   ```
2. Install node dependencies:
   ```bash
   npm install
   ```
3. Configure your environment variables. Create a `.env` file based on `.env.example`:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/fab-company
   JWT_SECRET=super_secret_key_123_456_steel_fab
   ADMIN_EMAIL=admin@fabsteel.com

   # Cloudinary (Optional - Falls back to local directory uploads if left blank)
   CLOUDINARY_CLOUD_NAME=
   CLOUDINARY_API_KEY=
   CLOUDINARY_API_SECRET=

   # Nodemailer SMTP Configuration (Optional - Logs to console if left blank)
   SMTP_HOST=
   SMTP_PORT=
   SMTP_USER=
   SMTP_PASS=
   ```
4. **Seed the database:** Populate default admin account (`admin@fabsteel.com` / `admin123`), sample services, projects, and testimonials:
   ```bash
   npm run seed
   ```
5. Launch the backend API:
   ```bash
   # Production mode
   npm start
   
   # Development mode (with nodemon auto-restart)
   npm run dev
   ```

*Note: If Cloudinary is not configured, files will be saved in `/server/uploads/` and served statically.*

---

### 2. Frontend Client Setup (`/client`)

1. Navigate to the client folder:
   ```bash
   cd client
   ```
2. Install node dependencies:
   ```bash
   npm install
   ```
3. (Optional) Configure environment variables in a `.env` file:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. Run the frontend development server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to `http://localhost:5173`.

---

## 🛠️ Administrative Portal

To access the administration panel:
1. Navigate to the admin login gate at `/admin/login` on the website (or click "Admin Portal Gateway" in the footer).
2. Authenticate using the seeded admin credentials:
   - **Email:** `admin@fabsteel.com`
   - **Password:** `admin123`
3. Manage quote proposal requests, inspect contact mail, and run CRUD updates on services and projects.
