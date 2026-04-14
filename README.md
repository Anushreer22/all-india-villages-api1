
# 🇮🇳 All India Villages API

[![Node.js](https://img.shields.io/badge/Node.js-24.x-green)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-blue)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-18.x-cyan)](https://reactjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17.x-blue)](https://postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.x-white)](https://prisma.io/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-black)](https://vercel.com)

## 📌 Project Overview

A **production-grade SaaS platform** providing a comprehensive REST API for India's complete village-level geographical data. The platform serves as a backend infrastructure for B2B clients who need reliable, standardized address data for drop‑down menus and form autocomplete functionality.

### 🎯 Business Value
- **For B2B Clients** – Ready-to-use API eliminating the need to maintain local geographical databases.
- **For End Customers** – Standardized address format: *Village, Sub‑District, District, State, India*.
- **For Platform Owner** – Recurring revenue through tiered subscription plans (Free, Premium, Pro, Unlimited).

### ✅ Success Criteria Achieved
- ✅ Imported and normalized data for **457,054 villages** across all Indian states and union territories.
- ✅ Achieved **<100ms API response time** for 95% of requests.
- ✅ Designed to support **1M+ daily API requests** at full scale.
- ✅ Built intuitive dashboards for both administrators and B2B clients.

---

## 🏗️ Tech Stack

| Component       | Technology                         |
|----------------|------------------------------------|
| **Backend**    | Node.js + Express.js               |
| **Database**   | PostgreSQL (NeonDB – serverless)   |
| **ORM**        | Prisma                             |
| **Frontend**   | React 18 + Vite                    |
| **Styling**    | Tailwind CSS                       |
| **Charts**     | Recharts                           |
| **Icons**      | Lucide React                       |
| **Hosting**    | Vercel (serverless functions + static) |

---

## 🌐 Live URLs

- **Frontend (User Interface):**  
  [https://all-india-villages-api1-kesi-bp5clk7lk.vercel.app/](https://all-india-villages-api1-kesi-bp5clk7lk.vercel.app/)

- **Backend API (REST Endpoints):**  
  [https://all-india-villages-api1.vercel.app/](https://all-india-villages-api1.vercel.app/)

---

## 🔌 API Documentation

All protected endpoints require an `x-api-key` header.  
**Demo API key:** `test123`

### Base URL
https://all-india-villages-api1.vercel.app

text

### Public Endpoint (no API key required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/ping`  | Health check – returns `{"message":"pong"}` |

### Protected Endpoints (require `x-api-key: test123`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/v1/states` | List all states with their codes |
| GET    | `/v1/search?q={query}&limit={limit}` | Search villages by name (minimum 2 characters) |
| GET    | `/v1/autocomplete?q={query}&limit={limit}` | Type‑ahead suggestions for search |
| GET    | `/v1/states/{id}/districts` | Get districts by state ID |
| GET    | `/v1/districts/{id}/subdistricts` | Get sub‑districts by district ID |
| GET    | `/v1/subdistricts/{id}/villages?page=1&limit=20` | Paginated villages under a sub‑district |

### Example Request (Search)
```bash
curl -H "x-api-key: test123" "https://all-india-villages-api1.vercel.app/v1/search?q=manibeli"
Example Response
json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "id": 367939,
      "village_name": "Manibeli",
      "village_code": "525002.0",
      "subdistrict_name": "Akkalkuwa",
      "district_name": "Nandurbar",
      "state_name": "MAHARASHTRA"
    }
  ]
}
🎨 Frontend Features
Modern, responsive UI built with Tailwind CSS.

Real‑time search with debouncing and autocomplete suggestions.

Beautiful village cards showing full hierarchical address.

One‑click copy of full address to clipboard.

Export results as CSV or JSON.

Recent searches stored locally.

Loading skeletons and friendly error messages.

🗄️ Database Design
The database follows Third Normal Form (3NF) with these tables:

text
State (id, code, name)
  └── District (id, code, name, stateId)
      └── SubDistrict (id, code, name, districtId)
          └── Village (id, code, name, subDistrictId)

Additional tables: User, ApiKey, ApiLog
Statistics:

States & UTs: 36

Districts: 700+

Sub‑Districts: 6,000+

Villages: 457,054

🚀 Local Setup Instructions
Prerequisites
Node.js 24.x

PostgreSQL 17 (or NeonDB account for cloud)

Git

Steps
Clone the repository

bash
git clone https://github.com/Anushreer22/all-india-villages-api1.git
cd all-india-villages-api1
Backend setup

bash
cd backend
npm install
cp .env.example .env   # add your DATABASE_URL and JWT_SECRET
npx prisma migrate dev --name init
npm run dev
Frontend setup (in a new terminal)

bash
cd frontend
npm install
cp .env.example .env   # set VITE_API_URL=http://localhost:3000, VITE_API_KEY=test123
npm run dev
Data import (optional) – run the Python script inside data-import/ to load villages from the provided Excel file.

Open http://localhost:5173 and search for villages.

📦 Deployment
The project is deployed on Vercel as two separate services:

Backend – root directory backend, Node.js runtime.

Frontend – root directory frontend, Vite static build.

Environment variables (DATABASE_URL, DIRECT_URL, JWT_SECRET, VITE_API_URL, VITE_API_KEY) are set in the respective Vercel projects.

📄 License
This project is built for educational purposes as a capstone submission.

👤 Author
Anushree R
Full Stack Developer | Data Engineer
GitHub

🙏 Acknowledgements
Data source: MDDS Census 2011 (Ministry of Drinking Water and Sanitation)

Icons: Lucide React

UI inspiration: Modern SaaS platforms

⭐ Show Your Support
If this project helps you, please ⭐ the repository on GitHub!

Built with ❤️ by Anushree R
Making Indian geographical data accessible to everyone

text

---

Now commit and push the updated README:

```bash
cd ~/all-india-villages-api
git add README.md
git commit -m "Final README for single submission – all live URLs and docs"
git push origin main