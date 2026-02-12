# ⚡ Quick Start Guide

Tez boshlanish uchun qo'llanma - 5 daqiqada ishga tushiring!

## 🎯 Maqsad

Bu qo'llanma sizga loyihani **local** da ishga tushirishda yordam beradi.

## 📋 Kerakli narsalar

1. ✅ **Node.js** (v18+) - [Download](https://nodejs.org/)
2. ✅ **PostgreSQL** (v14+) - [Download](https://www.postgresql.org/download/)
3. ✅ **Git** - [Download](https://git-scm.com/)
4. ✅ **Code Editor** (VS Code tavsiya etiladi)

## 🚀 5 Daqiqada Ishga Tushirish

### 1️⃣ Repository Clone qiling

```bash
git clone https://github.com/your-username/task6.git
cd task6
```

### 2️⃣ PostgreSQL Database yarating

**Windows (pgAdmin):**
1. pgAdmin 4 ni oching
2. Servers → PostgreSQL → Databases
3. Right-click → Create → Database
4. Name: `tictactoe`
5. Save

**MacOS/Linux (Terminal):**
```bash
psql -U postgres
CREATE DATABASE tictactoe;
\q
```

### 3️⃣ Backend Setup (Terminal 1)

```bash
# Backend papkaga o'ting
cd backend

# Dependencies install qiling
npm install

# .env fayl yarating
cp .env.example .env

# .env ni edit qiling (VS Code da):
# DATABASE_URL=postgresql://postgres:your_password@localhost:5432/tictactoe

# Database initialize qiling
npm run db:init

# Backend serverni run qiling
npm run dev
```

✅ Backend ishlab turganda ko'rinishi: `Server: http://localhost:5000`

### 4️⃣ Frontend Setup (Terminal 2 - yangi terminal)

```bash
# Root papkadan frontend ga o'ting
cd frontend

# Dependencies install qiling
npm install

# .env fayl yarating (allaqachon mavjud bo'lishi kerak)
# Agar yo'q bo'lsa:
cp .env.example .env

# Frontend serverni run qiling
npm run dev
```

✅ Frontend ishlab turganda: `http://localhost:5173`

### 5️⃣ Test qiling! 🎮

1. Browser ochib `http://localhost:5173` ga kiring
2. Ismingizni kiriting
3. "Create Game" bosing
4. **Yangi incognito/private window** ochib yana `http://localhost:5173` ga kiring
5. Boshqa ism kiriting
6. Yaratilgan o'yinga "Join" qiling
7. O'ynang! 🎉

## 🐛 Muammolar?

### ❌ Backend ishlamasa:

**Error:** `ECONNREFUSED`
- ✅ PostgreSQL ishlab turganini tekshiring
- ✅ `.env` dagi `DATABASE_URL` to'g'ri ekanligini tekshiring
- ✅ Password to'g'ri kiritilganini tekshiring

**Error:** `relation "users" does not exist`
- ✅ `npm run db:init` ni run qiling

**Error:** `Port 5000 already in use`
- ✅ `.env` da `PORT=5001` qilib o'zgartiring

### ❌ Frontend ishlamasa:

**Error:** `Failed to fetch`
- ✅ Backend ishlab turganini tekshiring (`http://localhost:5000`)
- ✅ `.env` dagi `VITE_API_URL` to'g'ri ekanligini tekshiring

**Error:** `Port 5173 already in use`
- ✅ Boshqa port ishlatadi avtomatik (5174, 5175, ...)

## 📝 Development Tips

### VS Code Extensions (tavsiya):
- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter
- ESLint
- PostgreSQL

### Useful Commands:

**Backend:**
```bash
npm run dev          # Development mode
npm start            # Production mode
npm run db:init      # Database reset
```

**Frontend:**
```bash
npm run dev          # Development mode
npm run build        # Production build
npm run preview      # Preview production build
```

### Database qanday ishlayotganini ko'rish:

**pgAdmin:**
1. Servers → PostgreSQL → Databases → tictactoe
2. Schemas → public → Tables
3. users/games ni right-click → View/Edit Data

**Terminal:**
```bash
psql -U postgres -d tictactoe
SELECT * FROM users;
SELECT * FROM games;
\q
```

## 🔄 Restart qilish

Agar biron narsa ishlamasa:

1. **Backend ni to'xtating** (Ctrl+C)
2. **Frontend ni to'xtating** (Ctrl+C)
3. **PostgreSQL ni restart qiling**
4. **Database ni qayta initialize qiling:**
   ```bash
   cd backend
   npm run db:init
   ```
5. **Qayta ishga tushiring:**
   ```bash
   # Terminal 1 (backend)
   npm run dev

   # Terminal 2 (frontend)
   cd ../frontend
   npm run dev
   ```

## 🎓 Keyingi Qadamlar

1. ✅ Local da test qiling
2. 📖 [DEPLOYMENT.md](DEPLOYMENT.md) o'qing
3. 🚀 Render va Netlify ga deploy qiling
4. 🎬 Video demo yarating
5. 📧 Topshiring!

## 💡 Pro Tips

1. **Hot reload:** Code o'zgartiring, avtomatik yangilanadi
2. **Multiple games:** Incognito windowlar ochib bir nechta o'yinchi sifatida test qiling
3. **Console logs:** Browser console (F12) da errorlarni ko'ring
4. **Network tab:** API calls ni monitor qiling
5. **PostgreSQL logs:** Database queriesni ko'ring

## 🎉 Tayyor!

Endi sizning multiplayer Tic-Tac-Toe o'yiningiz ishlayotgani bo'lishi kerak!

Muammolar bo'lsa:
- README.md ga qarang
- DEPLOYMENT.md ga qarang
- Browser console ni tekshiring
- Backend terminal logs ni o'qing

**Omad yor bo'lsin! 🚀**
