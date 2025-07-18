# 🧑‍💻 Live Auction Platform - Frontend

This is the frontend application for a real-time auction platform built using **React.js**, **Redux Toolkit**, **Socket.io-client**, and **Tailwind CSS**. Users can view live auctions, place real-time bids, and manage auction items via a clean UI.

---

## 📦 Tech Stack

| Tool            | Purpose                              |
|-----------------|---------------------------------------|
| React.js        | Frontend framework                    |
| Redux Toolkit   | State management (store/slices)       |
| Socket.io-client| Real-time communication               |
| Tailwind CSS    | Utility-first CSS framework           |
| Axios           | HTTP client for API calls             |
| React Toastify  | Notification system                   |
| React Router    | Routing and navigation                |
| FormData        | File uploads via forms                |

---

## 🧪 Features

### 🚀 Live Auction View

- Displays all active auctions
- Real-time bidding with WebSocket (Socket.io)
- Live current price updates
- Bid history per auction
- Join auction room via socket

### 📤 Add Auction Item

- Upload auction item with:
  - Title, Description
  - Start & End time
  - Starting price
  - Image upload via file input
- Form uses `FormData` to submit both fields + file

### 🔔 Notifications

- Toast messages for:
  - Success & failure (bid placed, errors)
  - Validation errors
  - Live bid activity

### 🔐 Auth & Protected Routes

- Token-based verification (JWT)
- Fetch loginUser with token
- Restrict access to Add & User auctions

---

## 📁 Folder Structure

