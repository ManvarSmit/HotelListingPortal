# 🌍 Wanderlust — Project Setup Guide

A full-stack travel listings app built with **React + Vite** (frontend) and **Express + PostgreSQL/Sequelize** (backend).

---

## ✅ Prerequisites

Make sure the following are installed on your machine before starting:

| Tool | Download Link |
|------|--------------|
| Node.js (v18+) | https://nodejs.org |
| PostgreSQL (v14+) | https://www.postgresql.org/download |
| npm (comes with Node.js) | — |

---

## 📁 Project Structure

```
MAJOR PROJECT/
├── backend/      → Express REST API (runs on port 3000)
└── frontend/     → React + Vite app (runs on port 5173)
```

---

## 🐘 Step 1 — Set Up PostgreSQL Database

1. Open **pgAdmin** or the **psql** terminal (comes with PostgreSQL).
2. Create a new database named `wanderlust`:

```sql
CREATE DATABASE wanderlust;
```

> Default PostgreSQL credentials assumed: username = `postgres`, password = `postgres`
> If yours are different, update the connection string in Step 3.

---

## ⚙️ Step 2 — Configure Backend Environment Variables

1. Go into the `backend/` folder.
2. Create a file named `.env` (if not already present in the zip).
3. Paste the following content into it:

```env
CLOUD_NAME=dbqemijrj
CLOUD_API_KEY=292598685596673
CLOUD_API_SECRET=YLoYTwn64Z26sauOWDcNKDECbhk
```

> These are Cloudinary credentials for image uploads. They are already configured — no changes needed unless you want to use your own Cloudinary account.

---

## 🔌 Step 3 — (Optional) Change Database Credentials

If your PostgreSQL username/password is **not** `postgres/postgres`, open:

```
backend/config/db.js
```

And change the connection string on line 3:

```js
const connectionString = process.env.DATABASE_URL || "postgres://YOUR_USERNAME:YOUR_PASSWORD@127.0.0.1:5432/wanderlust";
```

---

## 📦 Step 4 — Install Dependencies

Open **two separate terminals**.

**Terminal 1 — Backend:**
```bash
cd backend
npm install
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm install
```

---

## 🗄️ Step 5 — Initialize the Database (First Time Only)

Run this **once** to create all tables and seed sample data:

```bash
cd backend
node init/index.js
```

You should see:
```
PostgreSQL Connection successful
Tables recreated successfully
Data was initialized successfully
```

> ⚠️ WARNING: Running this again will **delete all existing data** and reset the database.

This also creates a default admin account:
- **Email:** `admin@gmail.com`
- **Password:** `admin123`

---

## 🚀 Step 6 — Run the Project

Open **two terminals** and run both servers simultaneously:

**Terminal 1 — Start Backend (port 3000):**
```bash
cd backend
npm run dev
```

**Terminal 2 — Start Frontend (port 5173):**
```bash
cd frontend
npm run dev
```

---

## 🌐 Step 7 — Open in Browser

Once both servers are running, visit:

```
http://localhost:5173
```

---

## 🛠️ Troubleshooting

| Problem | Fix |
|---------|-----|
| `ECONNREFUSED` on backend start | PostgreSQL is not running. Start it from Services or pgAdmin. |
| `database "wanderlust" does not exist` | Run `CREATE DATABASE wanderlust;` in psql/pgAdmin. |
| `password authentication failed` | Update credentials in `backend/config/db.js` |
| Port 3000 already in use | Kill the process using that port or change port in `backend/app.js` |
| Port 5173 already in use | Vite will auto-switch to 5174 — check terminal output |
| Images not uploading | Check that `.env` file exists in the `backend/` folder with Cloudinary keys |

---

## 📋 Quick Reference

| Command | Description |
|---------|-------------|
| `node init/index.js` | Seed/reset the database (run from `backend/`) |
| `npm run dev` | Start backend server (run from `backend/`) |
| `npm run dev` | Start frontend dev server (run from `frontend/`) |
