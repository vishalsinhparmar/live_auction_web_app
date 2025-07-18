# 🧿 Live Auction Web App

A **real-time live auction platform** built using **MERN stack (MongoDB, Express, React, Node.js)**, integrated with **Socket.IO**, **Cloudinary**, **Multer**, **Redis**, and other technologies to provide a scalable and interactive bidding experience.

🔗 **Live Site**: [https://live-auction-web-app.vercel.app](https://live-auction-web-app.vercel.app)  
📦 **GitHub Repo**: [github.com/vishalsinhparmar/live_auction_web_app](https://github.com/vishalsinhparmar/live_auction_web_app)  
☁️ **Frontend Deployment**: Vercel  
⚙️ **Backend Deployment**: Railway  

---

## 📦 Tech Stack

### 🚀 Frontend
- **React.js** with Hooks
- **Redux Toolkit** for state management
- **React Router** for navigation
- **Socket.IO Client** for real-time updates
- **Tailwind CSS** for styling
- **Toastify** for alerts & notifications
- **Axios** for API requests
- **Vite** for fast builds

### 🛠 Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **Socket.IO Server** for real-time communication
- **Redis** for bid caching & rate limiting
- **JWT Auth** for secure login
- **Multer + Cloudinary** for image upload
- **Custom Middleware** for rate-limiting, authorization

---

## 🔐 Features

### 👤 Authentication
- User SignUp / SignIn with JWT token
- Protected routes using middleware
- Rate Limiting on login using Redis

### 🎯 Auction Item Management
- Add auction items (title, description, price, start/end time)
- Upload images via Cloudinary
- View your auction items in user panel

### ⏱ Live Auction (Real-time with Socket.IO)
- Users can join live auctions using socket rooms
- Bid in real-time across multiple users
- Show current highest bid & bid history
- Reject lower bids with message
- Update current price using Redis cache
- Save all bids into MongoDB with timestamp

### 🥇 Bid History
- View all recent bids on each item
- Mark top bidder as the winner after auction ends

### 🔐 Security
- JWT token validation
- Login rate-limiting via Redis
- Input sanitization & error handling

---

## 🧩 Project Structure

```bash
live_auction_web_app/
├── backend_web_app/
│   ├── src/
│   │   ├── controller/
│   │   ├── model/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── utils/
│   ├── redisClient.js
│   ├── socketHandler.js
│   └── index.js
├── frontend_web_app/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── features/
│   │   ├── services/
│   │   ├── utils/
│   │   └── App.jsx
│   └── main.jsx
