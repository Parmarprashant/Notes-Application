# 📝 Notes API

A production-ready **RESTful Notes API** built with **Node.js, Express, and MongoDB (Mongoose)**.  
It supports full CRUD operations along with advanced features like filtering, sorting, pagination, and bulk actions.

---

## 🌐 Live API

🔗 https://notes-application-3.onrender.com/notes

---

## 📬 API Documentation (Postman)

🔗 https://documenter.getpostman.com/view/50841493/2sBXqGqgfh

---

## 🚀 Features

### 🔹 Core CRUD Operations
- Create a single note
- Create multiple notes (bulk)
- Get all notes
- Get note by ID
- Update note (PATCH)
- Replace note (PUT)
- Delete note
- Delete multiple notes (bulk)

---

### 🔹 Advanced Features

#### ✅ Filtering
- By category (`work`, `personal`, `study`)
- By pinned status
- By date range

#### ✅ Sorting
- Fields: `title`, `createdAt`, `updatedAt`, `category`
- Order: ascending / descending

#### ✅ Pagination
- Page & limit support
- Category-based pagination

---

## 📦 Data Model

```json
{
  "title": "String (required)",
  "content": "String (required)",
  "category": "work | personal | study",
  "isPinned": "Boolean (default: false)",
  "createdAt": "Date",
  "updatedAt": "Date"
}