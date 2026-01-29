# SkoolMitra 🎓

SkoolMitra is a **Student Management System** built using **Django** for the backend and **React (Vite)** for the frontend.  
This project is designed to manage students, batches, and role-based access in an educational environment.

> ⚠️ Note: This repository currently contains the **source code only**.  
> The project is intended to be run **locally**. Online deployment can be added later if needed.

---

## 🧰 Tech Stack

### Backend
- Django
- Django REST Framework
- MySQL (local development)
- PostgreSQL (planned for production)
- Gunicorn

### Frontend
- React (Vite)
- JavaScript
- CSS

---

## ✨ Features

- Role-based authentication  
  - Admin  
  - Counselor 
- Secure login system
- Student, course and batch management
- Protected routes (frontend)
- Modular and clean project structure

---

## 📁 Project Structure

SkoolMitra/
├── backend/
│ └── config/
│ ├── manage.py
│ ├── requirements.txt
│ └── server/
├── frontend/
│ ├── src/
│ ├── public/
│ └── package.json
├── .gitignore
└── README.md

---

## 🚀 How to Run Locally

### 🔹 Backend Setup

```bash
cd backend/config
# activate your virtual environment (eco / venv)
pip install -r requirements.txt
python manage.py runserver

-- backend will run at:
http://127.0.0.1:8000/
```

### 🔹Frontend Setup

```bash
cd frontend
npm install
npm run dev

--frontend will run at:
http://localhost:5173/
```

## 🚀 Environment Variables
Create a .env file in backend/config

SECRET_KEY=your-secret-key
DEBUG=True

DB_ENGINE=mysql
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=3306


## 👤 Author
# Saihari Vavilala

