# 🚀 Deployment Guide

Batafsil deployment qo'llanmasi - Render.com va Netlify uchun.

## 📋 Pre-Deployment Checklist

- [ ] GitHub repository yaratilgan va code push qilingan
- [ ] Backend `.env.example` fayl mavjud
- [ ] Frontend `.env.example` fayl mavjud
- [ ] `netlify.toml` va `render.yaml` fayllar mavjud
- [ ] Barcha dependency'lar `package.json` da ko'rsatilgan

## 🗄️ Database Setup (Render.com)

### 1. Render.com account yaratish

1. [render.com](https://render.com) ga kiring
2. GitHub bilan sign up qiling
3. Repositoringizni connect qiling

### 2. PostgreSQL Database yaratish

1. Dashboard → **New** → **PostgreSQL**
2. Settings:
   - **Name:** `tictactoe-db`
   - **Database:** `tictactoe`
   - **User:** `tictactoe_user`
   - **Region:** Yaqin region tanlang (masalan, Frankfurt)
   - **PostgreSQL Version:** 14 yoki yuqori
   - **Plan:** Free
3. **Create Database** tugmasini bosing
4. Database yaratilgach, **Internal Database URL** ni copy qiling
   - Format: `postgresql://user:password@hostname/database`
5. Shu URL ni saqlab qo'ying (keyin kerak bo'ladi)

## 🔧 Backend Deployment (Render.com)

### 1. Web Service yaratish

1. Dashboard → **New** → **Web Service**
2. GitHub repositoryingizni tanlang
3. Settings to'ldiring:

#### Basic Settings:
- **Name:** `tictactoe-backend` (yoki o'zingiz xohlaganini)
- **Region:** Database bilan bir xil region
- **Branch:** `main`
- **Root Directory:** `backend`
- **Environment:** `Node`
- **Build Command:** `npm install`
- **Start Command:** `npm start`

#### Environment Variables:
**Add Environment Variable** tugmasini bosing va quyidagilarni qo'shing:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `5000` |
| `DATABASE_URL` | (Database Internal URL ni paste qiling) |
| `CLIENT_URL` | (Hozircha bo'sh qoldiring, keyinroq frontend URL qo'shamiz) |

4. **Create Web Service** tugmasini bosing

### 2. Database Initialize qilish

✅ **AVTOMATIK!** Database server ishga tushganda avtomatik initialize bo'ladi!

**Deploy tugagach:**

1. **Logs** tabni oching (Render dashboard → Service → Logs)
2. Quyidagi xabarlarni kutib turing:
   ```
   ✅ Connected to PostgreSQL database
   🔄 Checking database tables...
   ✅ Database tables ready!
   ```

**Agar xatolik bo'lsa (manual init kerak):**

Browser ochib quyidagi URL ga kiring:
```
https://your-backend.onrender.com/api/init-db
```

Ko'rinishi kerak:
```json
{
  "success": true,
  "message": "✅ Database initialized successfully!"
}
```

**Eslatma:**
- ✅ Free plan da shell yo'q, shuning uchun avtomatik initialization qilindi!
- ✅ Browser orqali manual init qilish mumkin
- ✅ Har safar server restart bo'lganda avtomatik check qilinadi

### 3. Backend URL ni copy qiling

- Service URL ni copy qiling (masalan: `https://tictactoe-backend.onrender.com`)
- Shu URL ni saqlab qo'ying (frontend uchun kerak)

## 🎨 Frontend Deployment (Netlify)

### 1. Netlify account yaratish

1. [netlify.com](https://netlify.com) ga kiring
2. GitHub bilan sign up qiling

### 2. Site deploy qilish

1. **Add new site** → **Import an existing project**
2. **GitHub** ni tanlang va repository connect qiling
3. Settings:

#### Build Settings:
- **Base directory:** `frontend`
- **Build command:** `npm run build`
- **Publish directory:** `frontend/dist`

#### Environment Variables:
**Show advanced** → **New variable** bosing:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | (Backend Render URL ni paste qiling) |
| `VITE_SOCKET_URL` | (Backend Render URL ni paste qiling) |

4. **Deploy site** tugmasini bosing
5. Deploy tugashini kutib turing (2-3 daqiqa)

### 3. Frontend URL ni copy qiling

- Deploy tugagach, site URL ni copy qiling (masalan: `https://tictactoe-game.netlify.app`)

## 🔗 Final Configuration

### Backend ga Frontend URL qo'shish

1. Render.com → Backend Service ga qaytib boring
2. **Environment** tabga o'ting
3. `CLIENT_URL` variable ni topib, frontend URL ni qo'shing
   - Value: `https://your-app.netlify.app` (o'zingizniki)
4. **Save Changes** bosing
5. Service avtomatik restart bo'ladi

## ✅ Testing Deployment

### 1. Backend test qilish

Browser ochib, backend URL ga kiring:
```
https://your-backend.onrender.com
```

Ko'rinishi kerak:
```json
{"message": "🎮 Tic-Tac-Toe Server is running!"}
```

Health check:
```
https://your-backend.onrender.com/health
```

### 2. Frontend test qilish

Frontend URL ni oching:
```
https://your-app.netlify.app
```

1. Ismingizni kiriting
2. Game yarating yoki join qiling
3. O'ynashga harakat qiling
4. Statistikani tekshiring

## 🐛 Troubleshooting

### Backend ishlamasa:

1. **Logs tekshiring:**
   - Render dashboard → Service → Logs tab
   - Qizil error messagelarni qidiring

2. **Environment variables tekshiring:**
   - Barcha variable'lar to'g'ri kiritilganmi?
   - DATABASE_URL to'g'rimi?
   - CLIENT_URL frontend URL bilan mos keladimi?

3. **Database connection:**
   - Database ishlab turibmi?
   - `npm run db:init` ishladimi?

### Frontend ishlamasa:

1. **Deploy logs tekshiring:**
   - Netlify dashboard → Site → Deploys → Deploy log

2. **Environment variables tekshiring:**
   - VITE_API_URL to'g'rimi?
   - VITE_SOCKET_URL backend URL bilan mos keladimi?

3. **Browser console:**
   - F12 bosing
   - Console tabda errorlar bormi?
   - Network tabda API calls statusini tekshiring

### CORS errors:

Agar CORS error ko'rsangiz:

1. Backend `CLIENT_URL` to'g'ri kiritilganmi tekshiring
2. Frontend URLda trailing slash (`/`) yo'qligini tekshiring
3. Backend server restart qiling

### Database connection errors:

1. Database ishlab turibmi? (Render dashboarddan tekshiring)
2. DATABASE_URL to'g'ri copy qilinganmi?
3. Internal URL ishlatilganmi (External emas)?

## 📊 Monitoring

### Render.com:
- Dashboard → Service → Metrics
- CPU, Memory, Request count ko'rish mumkin
- Logs real-time kuzatish mumkin

### Netlify:
- Dashboard → Site → Analytics
- Traffic, bandwidth ko'rish mumkin
- Deploy history va logs

## 🔄 Updating the App

### Code o'zgartirish:

1. Local code o'zgartiring
2. Git commit va push qiling:
```bash
git add .
git commit -m "Update: description"
git push origin main
```

3. **Backend:** Render avtomatik deploy qiladi
4. **Frontend:** Netlify avtomatik deploy qiladi

### Manual redeploy:

**Render:**
- Service → Manual Deploy → Deploy latest commit

**Netlify:**
- Site → Deploys → Trigger deploy

## 💰 Cost (Free Tier Limits)

### Render.com Free Plan:
- ✅ 750 hours/month (1 service uchun yetarli)
- ✅ PostgreSQL database (90 days max)
- ⚠️ Service 15 daqiqa ishlatilmasa sleep mode ga o'tadi
- ⚠️ Cold start 30-50 sekund olishi mumkin

### Netlify Free Plan:
- ✅ 100GB bandwidth/month
- ✅ 300 build minutes/month
- ✅ Instant global CDN
- ✅ HTTPS avtomatik

## 🎯 Performance Tips

1. **Backend warmup:** Har 10 daqiqada health check qiling (sleep modega tushmasligi uchun)
2. **Frontend:** CDN orqali serve bo'lgani uchun tez
3. **Database:** Free tier 1GB storage beradi
4. **Images:** Netlify CDN optimize qiladi

## 📝 Notes

- Render free tier 90 kundan keyin database o'chadi (yangi yasang)
- Environment variable o'zgartirsa, restart kerak
- Git push har doim auto-deploy qiladi
- Custom domain qo'shish mumkin (settings orqali)

## 🆘 Support

Muammo bo'lsa:
1. README.md o'qing
2. Logs tekshiring
3. Environment variables tekshiring
4. Google/StackOverflow da qidiring
5. GitHub Issues yarating

---

**Deployment muvaffaqiyatli bo'lsin! 🚀**
