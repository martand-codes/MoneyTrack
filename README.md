# 💰 MoneyTrack

![React](https://img.shields.io/badge/React-19-blue)
![Node.js](https://img.shields.io/badge/Node.js-20-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)
![Express](https://img.shields.io/badge/Express.js-5-black)
![Docker](https://img.shields.io/badge/Docker-Containerized-blue)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-black)
![Render](https://img.shields.io/badge/Render-Deployed-purple)
![License](https://img.shields.io/badge/License-MIT-success)

A production-ready full-stack **MERN Personal Finance Tracker** that helps users securely manage income, expenses, financial reports, and analytics through an intuitive dashboard.

MoneyTrack is actively used by me for managing my own college budget, gym expenses, gaming purchases, and daily finances, making it a continuously evolving real-world project rather than just a demo application.

---

# 🚀 Live Demo

### 🌐 Frontend
https://money-track-frontend-pearl.vercel.app

### ⚙ Backend API
https://moneytrack-backend-2sir.onrender.com

---

# 📸 Dashboard

![Dashboard](./assets/Dashboard.png)

MoneyTrack is fully responsive across desktop, tablet, and mobile devices while maintaining consistent functionality and user experience.

---

# 🏗 Architecture

```text
                React + Vite
                     │
                     ▼
              Axios REST API
                     │
                     ▼
            Node.js + Express.js
                     │
         JWT Authentication Middleware
                     │
                     ▼
             Controllers & Business Logic
                     │
                     ▼
               MongoDB Atlas
```

---

# ✨ Features

## 🔐 Authentication & Security

- ✅ JWT Authentication
- ✅ Protected REST APIs
- ✅ User Registration
- ✅ Secure Login & Logout
- ✅ Profile Management
- ✅ Password Update

---

## 💸 Transaction Management

- ✅ Add Income
- ✅ Add Expenses
- ✅ Edit Transactions
- ✅ Delete Transactions
- ✅ Category Management
- ✅ Search & Filtering
- ✅ Monthly Tracking
- ✅ Weekly Tracking
- ✅ Transaction History
- ✅ User-specific Data Isolation

MoneyTrack uses a **single Transaction schema** with a `type` field (`income` or `expense`) instead of maintaining separate collections, significantly reducing duplicate business logic and improving maintainability.

---

## 📊 Analytics Dashboard

- ✅ Financial Dashboard
- ✅ Monthly Reports
- ✅ Weekly Reports
- ✅ Income Overview
- ✅ Expense Overview
- ✅ Savings Overview
- ✅ Category-wise Analytics
- ✅ Interactive Charts
- ✅ Dynamic Financial Insights

---

## 📁 Excel Export

- ✅ Export Transactions to Excel
- ✅ Analyze Financial Records Offline
- ✅ Category-wise Export Support

---

## 🎨 Frontend Features

- ✅ Responsive UI
- ✅ Interactive Charts using Recharts
- ✅ Toast Notifications
- ✅ Modular React Components
- ✅ Dynamic Filtering
- ✅ Mobile Friendly Design

---

# 📷 Preview

## Dashboard

![Dashboard](./assets/Dashboard.png)

---

## Income

![Income](./assets/Income.png)

---

## Expenses

![Expense](./assets/Expense.png)

---

## Excel Export

![Excel Export](./assets/ExcelExport.png)

---

## Tablet View

![Tablet](./assets/DashboardTabletView.png)

---

## Mobile View

![Mobile](./assets/profileMobileView.png)

---

# ⚙ Tech Stack

| Frontend | Backend | Database | Deployment |
|----------|----------|-----------|------------|
| React.js | Node.js | MongoDB Atlas | Vercel |
| Vite | Express.js | Mongoose | Render |
| Tailwind CSS | JWT | | Docker |
| Axios | bcryptjs | | Docker Compose |
| Recharts | Validator | | |

---

# 🚀 Deployment

## Frontend

- Vercel

## Backend

- Render

## Database

- MongoDB Atlas

---

# 📁 Project Structure

```text
MoneyTrack
│
├── Backend
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── utils
│   ├── server.js
│   └── package.json
│
├── Frontend
│   ├── src
│   │   ├── assets
│   │   ├── components
│   │   ├── pages
│   │   ├── utils
│   │   └── App.jsx
│   └── package.json
│
├── docker-compose.yml
├── README.md
└── assets
```

---

# 🔑 Environment Variables

## Backend

```env
PORT=5000
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_secret_key
TOKEN_EXPIRY=7d
```

## Frontend

```env
VITE_API_BASE=http://localhost:5000
```

For production:

```env
VITE_API_BASE=https://moneytrack-backend-2sir.onrender.com
```

---

# 💻 Installation

Clone the repository

```bash
git clone https://github.com/martand-codes/MoneyTrack.git

cd MoneyTrack
```

Backend

```bash
cd Backend

npm install

npm start
```

Frontend

```bash
cd Frontend

npm install

npm run dev
```

---

# 📡 API Endpoints

## User APIs

| Method | Endpoint |
|---------|----------|
| POST | /api/user/register |
| POST | /api/user/login |
| GET | /api/user/me |
| PUT | /api/user/profile |
| PUT | /api/user/password |

---

## Transaction APIs

| Method | Endpoint |
|---------|----------|
| POST | /api/transaction/add |
| GET | /api/transaction/get |
| PUT | /api/transaction/update/:id |
| DELETE | /api/transaction/delete/:id |
| GET | /api/transaction/overview |
| GET | /api/transaction/downloadexcel |

---

# 🧠 Engineering Concepts Implemented

- REST API Design
- JWT Authentication
- Express Middleware
- MVC Architecture
- MongoDB Schema Design
- Protected Routes
- CRUD Operations
- Client-Server Architecture
- React State Management
- Environment Variable Management
- Responsive UI Development
- Docker Containerization
- Production Deployment
- Excel File Generation
- Reusable Component Architecture

---

# 🚧 Challenges Solved

During development, several real-world engineering problems were encountered and resolved.

### Transaction Architecture

Initially, separate logic existed for income and expense management. The application was refactored to use a unified **Transaction schema** with a `type` enum, significantly reducing duplicated business logic and improving scalability.

---

### Authentication Flow

Implemented secure JWT authentication with protected middleware and synchronized authentication state between React and Express.

---

### Chart Rendering

Resolved responsive rendering issues in Recharts by restructuring conditional rendering logic and dashboard state management.

---

### Environment Configuration

Configured separate development and production environments using Vite environment variables, Docker, Render, and Vercel deployments.

---

### Route Protection

Designed middleware to ensure authenticated users can only access and modify their own financial records.

---

### Deployment

Successfully deployed the frontend on **Vercel** and backend on **Render**, while integrating MongoDB Atlas as the production database.

---

# 🚀 Future Improvements

- GitHub Actions CI/CD
- Budget Planning
- Recurring Transactions
- AI-powered Financial Insights
- Expense Forecasting
- Dark Mode
- Push Notifications
- Progressive Web App (PWA)
- Kubernetes Deployment
- Role-Based Authorization

---

# 📚 Lessons Learned

Building MoneyTrack strengthened my understanding of:

- Full-stack MERN Development
- REST API Design
- Authentication & Authorization
- MongoDB Data Modeling
- React State Management
- Docker Workflows
- Deployment using Render & Vercel
- Production Debugging
- Modular Software Architecture

This project continues to evolve as I explore more scalable backend architectures and improve the overall user experience.

---

# 👨‍💻 Connect With Me

**LinkedIn**

https://www.linkedin.com/in/martand-prakhar-a04904315/

**GitHub**

https://github.com/martand-codes

---

# 👨‍💻 Author

**Martand Prakhar**

Second-Year Information Science Engineering Student

Passionate about Full Stack Development, Backend Engineering, System Design, Open Source, and Software Engineering.