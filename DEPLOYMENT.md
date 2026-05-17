# 🚀 Deployment Guide - Blog App

## **Quick Summary**
- **Backend:** Render.com (Node.js + Express + MongoDB)
- **Frontend:** Vercel (React + Vite)
- **Database:** MongoDB Atlas (Cloud)

---

## **Step 1: Prepare MongoDB Password ✅**

1. Open `/backend/.env`
2. Replace `<db_password>` with your actual MongoDB password:
   - Go to https://mongodb.com/cloud/atlas
   - Click "HarshasCluster" → "Connect" → "Drivers"
   - Find password in connection string
3. Save the file

**Example (.env file):**
```
MONGODB_URI=mongodb+srv://Harshab34:your-actual-password@harshascluster.2fvz9tp.mongodb.net/ecomdb?retryWrites=true&w=majority
JWT_SECRET_KEY=mysupersecretkey
PORT=4000
FRONTEND_URL=http://localhost:5173
```

---

## **Step 2: Deploy Backend to Render (5 minutes) 🏗️**

### **2.1 Create Render Account**
- Go to https://render.com
- Sign up with GitHub
- Authorize Render to access your repositories

### **2.2 Create Web Service**
1. Click **"New"** button → **"Web Service"**
2. Select your repo: `Harsha333hhh/Capstone-project`
3. Fill in the form:
   - **Name:** `capstone-blog-backend`
   - **Root Directory:** `backend`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** `Free` (or upgrade later)

### **2.3 Add Environment Variables**
1. Scroll down to **Environment Variables**
2. Add each variable:
   - **MONGODB_URI:** `mongodb+srv://Harshab34:<your-password>@harshascluster.2fvz9tp.mongodb.net/ecomdb?retryWrites=true&w=majority`
   - **JWT_SECRET_KEY:** `mysupersecretkey`
   - **PORT:** `4000`
   - **FRONTEND_URL:** (Leave empty for now, we'll update after Vercel deployment)

3. Click **"Create Web Service"**

### **2.4 Get Backend URL**
- Wait 2-3 minutes for deployment
- Copy the URL from Render dashboard (e.g., `https://capstone-blog-backend.onrender.com`)
- **Save this URL!** You'll need it next

---

## **Step 3: Deploy Frontend to Vercel (2 minutes) 📱**

### **3.1 Add Environment Variable to Vercel**
1. Go to https://vercel.com/dashboard
2. Click on project: `capstone-project-5ydl`
3. Go to **Settings** → **Environment Variables**
4. Click **"Add"**
5. Fill in:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://capstone-blog-backend.onrender.com` (or your Render backend URL)
   - **Environments:** Select all (Production, Preview, Development)
6. Click **"Save"**

### **3.2 Redeploy Frontend
1. Go to **Deployments**
2. Find the latest deployment
3. Click the menu (**⋮**) → **Redeploy**
4. Wait for deployment (1-2 minutes)

### **3.3 Get Frontend URL**
- Your frontend will be at: `https://capstone-project-5ydl.vercel.app`

---

## **Step 4: Update Backend CORS (Final Step) ✅**

Now that you have your Vercel URL, update Render environment variables:

1. Go to Render dashboard
2. Select `capstone-blog-backend`
3. Go to **Environment** tab
4. Edit `FRONTEND_URL`:
   - From: (empty)
   - To: `https://capstone-project-5ydl.vercel.app`
5. Click **"Save"** → Auto-redeploys

---

## **Testing Your Deployment 🧪**

### **Test Backend:**
Visit: `https://capstone-blog-backend.onrender.com/`
- Should show Render page or error (that's OK, backend is running)

### **Test Frontend:**
Visit: `https://capstone-project-5ydl.vercel.app/`
- Should load the blog app
- Try logging in → should work!

### **Test API Connection:**
1. Go to your deployed frontend
2. Try to login or register
3. Check browser DevTools Network tab
4. API calls should go to your Render backend URL

---

## **Troubleshooting 🔧**

### **Frontend shows errors:**
- Check Vercel logs: Go to Deployments → Click deployment → View logs
- Verify `VITE_API_URL` is set correctly

### **Login/API not working:**
- Check Render logs: Go to service → Logs tab
- Verify MongoDB connection string in `.env`
- Check CORS settings in backend/server.js

### **MongoDB connection error:**
- Verify password in connection string
- Check network access in MongoDB Atlas: Security → Network Access → Allow IP 0.0.0.0/0 (for now)

### **Render backend not running:**
- Check that `npm start` works locally: `cd backend && npm start`
- Verify all dependencies are in package.json

---

## **URLs Reference 📍**

Once deployed:
- **Frontend:** https://capstone-project-5ydl.vercel.app
- **Backend API:** https://capstone-blog-backend.onrender.com
- **MongoDB Atlas:** https://mongodb.com/cloud/atlas

---

## **Next Steps 🎯**

After successful deployment:
1. ✅ Test all features (login, create article, comment)
2. ✅ Share URL with friends!
3. ✅ Consider upgrading Render plan if needed (free tier sleeps after 15 min inactivity)
4. ✅ Set up custom domain (optional)

---

**Happy deploying! 🚀**
