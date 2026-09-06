# 📚 BOOKD

**BOOKD** is a full-stack book discovery and rating platform inspired by IMDb, built with the MERN stack.

Users can discover books, search and filter titles, rate books, save favorites, and manage their personal profile.

🔗 **Live Demo:** https://bookd-swart-three.vercel.app/

---

## ✨ Features

* 🔐 **User Authentication**

  * User registration and login
  * JWT-based authentication
  * Protected user routes

* 🔎 **Book Discovery**

  * Browse books by different categories
  * Search for books
  * Filter and sort books

* ⭐ **Ratings & Reviews**

  * Rate books
  * View the BOOKD rating
  * View ratings from other users
  * Edit or delete your own ratings

* ❤️ **Favorites**

  * Add books to favorites
  * Remove books from favorites
  * View saved books from your profile

* 👤 **User Profile**

  * View account information
  * View favorite books
  * View books you've rated
  * Secure logout

* 📱 **Responsive UI**

  * Responsive layouts for desktop and mobile
  * Minimal, book-focused interface

---

## 🛠️ Tech Stack

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* React Router
* Lucide React

### Backend

* Node.js
* Express.js
* TypeScript
* MongoDB
* Mongoose
* JWT
* bcrypt

### Deployment

* **Frontend:** Vercel
* **Backend:** Render
* **Database:** MongoDB Atlas

---

## 🏗️ Project Structure

```text
BOOKD/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── data/
│   │   ├── services/
│   │   └── App.tsx
│   │
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── server.ts
│   │
│   └── package.json
│
└── README.md
```

---

## 🔄 Application Flow

```text
                    ┌───────────────┐
                    │    BOOKD UI   │
                    │ React + Vite  │
                    └───────┬───────┘
                            │
                            │ REST API
                            ▼
                    ┌───────────────┐
                    │ Express / API │
                    │   Node.js     │
                    └───────┬───────┘
                            │
                            │ Mongoose
                            ▼
                    ┌───────────────┐
                    │    MongoDB    │
                    │     Atlas     │
                    └───────────────┘
```

---

## 🔐 Authentication

BOOKD uses JWT-based authentication.

When a user logs in:

1. Credentials are validated by the backend.
2. A JWT token is generated.
3. The token is stored on the client.
4. Protected API requests include the token.
5. Backend middleware verifies the token before allowing access to protected resources.

Passwords are securely hashed using **bcrypt** before being stored.

---

## 📡 API Routes

### Authentication

```text
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
```

### Books

```text
GET    /api/books
GET    /api/books/:id
```

### Favorites

```text
GET    /api/favourites
POST   /api/favourites
DELETE /api/favourites/:bookId
```

### Ratings

```text
GET    /api/ratings/:bookId
POST   /api/ratings
PUT    /api/ratings/:id
DELETE /api/ratings/:id
```

> Route names may vary depending on the current backend implementation.

---

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/BOOKD.git
cd BOOKD
```

### 2. Install dependencies

Install frontend dependencies:

```bash
cd frontend
npm install
```

Install backend dependencies:

```bash
cd ../backend
npm install
```

---

## 🔑 Environment Variables

### Backend

Create a `.env` file inside `backend/`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5173
```

### Frontend

Create a `.env` file inside `frontend/`:

```env
VITE_API_URL=http://localhost:5000/api
```

> Never commit your `.env` files or database credentials to GitHub.

---

## ▶️ Running Locally

### Start the backend

```bash
cd backend
npm run dev
```

The backend will run on:

```text
http://localhost:5000
```

### Start the frontend

Open another terminal:

```bash
cd frontend
npm run dev
```

The frontend will run on:

```text
http://localhost:5173
```

---

## 🚀 Deployment

BOOKD is deployed in this simple way:

```text
Frontend
   │
   ▼
Vercel
   │
   │ API Requests
   ▼
Render
   │
   ▼
MongoDB Atlas
```



## 📸 Screenshots

### Home Page

<img width="1920" height="1976" alt="screencapture-bookd-swart-three-vercel-app-2026-08-30-15_10_09" src="https://github.com/user-attachments/assets/099fc7d6-4d7a-4d5b-9643-5e594c7ffc3b" />


### Book Details

<img width="1920" height="1389" alt="screencapture-bookd-swart-three-vercel-app-book-ol-OL15057739W-2026-08-30-15_09_38" src="https://github.com/user-attachments/assets/767e66e5-7cba-41f5-8c12-3df81b4f7869" />


### User Profile

<img width="1920" height="1718" alt="screencapture-bookd-swart-three-vercel-app-profile-2026-08-30-15_14_12" src="https://github.com/user-attachments/assets/6d3420fc-5434-440d-ac43-e2348b39d0ba" />


### Ratings & Reviews

<img width="1920" height="1257" alt="screencapture-bookd-swart-three-vercel-app-book-ol-OL19870W-2026-08-30-15_17_44" src="https://github.com/user-attachments/assets/3b73494b-1eee-44de-8d0c-182fb51bf7cd" />



---

⭐ If you found this project interesting, consider giving the repository a star!
