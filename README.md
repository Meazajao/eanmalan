# 📩 E-Anmälan – Ärendehanteringssystem

E-Anmälan är ett fullstack-projekt där användare kan skapa ärenden (tickets), följa status och kommunicera via meddelanden, medan administratörer kan hantera, svara på och avsluta ärenden i en separat adminvy.

Projektet är byggt som ett modernt webbsystem med autentisering, rollbaserad åtkomst och realtidsliknande kommunikation.

🌐 **Live-demo:**  
https://eanmalan-1.onrender.com

---

## ✨ Funktioner

### 👤 Användare
- Skapa konto & logga in
- Skapa nya ärenden med titel, beskrivning och prioritet
- Se alla egna ärenden
- Filtrera ärenden (Alla / Pågående / Avslutade)
- Skicka och ta emot meddelanden i varje ärende

### 🛠 Admin
- Separat admin-dashboard
- Se alla användares ärenden
- Öppna ett enskilt ärende i egen vy
- Svara på ärenden via meddelanden
- Stäng ärenden
- Se status, prioritet, skapad av, datum m.m.

### 🔐 Säkerhet & Auth
- JWT-baserad autentisering
- HttpOnly cookies
- Rollbaserad åtkomst (USER / ADMIN)
- Skyddade routes (frontend & backend)

---

## 🧱 Tech Stack

### Frontend
- **React** (Vite)
- **React Router**
- **Tailwind CSS**
- Fetch API
- Miljövariabler via `import.meta.env`

### Backend
- **Node.js**
- **Express**
- **Prisma ORM**
- **JWT (jsonwebtoken)**
- **bcrypt / bcryptjs**
- **PostgreSQL** (Render)
- Cookie-baserad autentisering

### Deployment
- **Backend + PostgreSQL:** Render
- **Frontend:** Render
- **Databas:** Render PostgreSQL

---

## 🗂 Projektstruktur (förenklad)

```txt
mez-eanmalan-lite/
├── api/                # Backend (Express + Prisma)
│   ├── prisma/
│   └── src/
│       ├── routes/
│       ├── controllers/
│       ├── middleware/
│       └── server.js
│
├── apps/
│   └── web/            # Frontend (React + Vite)
│       ├── src/
│       │   ├── pages/
│       │   ├── components/
│       │   └── api.js
│       └── vite.config.js
│
└── README.md
