# Assignment 01: Notes Management REST API

## **Project Goal**
Build a **Notes Management REST API** using **Node.js + Express + MongoDB (Mongoose)**. This project focuses on the fundamentals of RESTful API design, database connection, schema design, and MVC structure.

## **Tech Stack**
- **Node.js**: Runtime environment
- **Express**: Web framework
- **MongoDB**: NoSQL database
- **Mongoose**: ODM for MongoDB
- **dotenv**: Environment variable management
- **nodemon**: Development auto-restart

## **Folder Structure**
```text
notes-app/
│
├── src/
│   ├── config/          # Database configuration
│   ├── models/          # Mongoose schemas
│   ├── controllers/     # Business logic
│   ├── routes/          # API route definitions
│   ├── middlewares/     # Custom middlewares (empty for now)
│   ├── app.js           # Express app setup
│   └── index.js         # Entry point (Server listen)
│
├── .env                 # Environment variables (private)
├── .env.example         # Template for environment variables
└── package.json         # Project dependencies and scripts
```

## **Installation & Setup**

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/Parmarprashant/Notes-Application.git
    cd Assignment-1
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Setup**:
    Create a `.env` file in the `Assignment-1` folder and add your MongoDB connection string:
    ```env
    MONGODB_URI=your_mongodb_connection_string
    PORT=5000
    ```

4.  **Run the server**:
    - For development (auto-restart): `npm run dev`
    - For production: `npm start`

## **API Endpoints**

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Welcome message |
| `GET` | `/api/notes` | Get all notes |
| `GET` | `/api/notes/:id` | Get a single note by ID |
| `POST` | `/api/notes` | Create a single note |
| `POST` | `/api/notes/bulk` | Create multiple notes at once |
| `PUT` | `/api/notes/:id` | Replace a note completely |
| `PATCH` | `/api/notes/:id` | Update specific fields only |
| `DELETE` | `/api/notes/:id` | Delete a single note |
| `DELETE` | `/api/notes/bulk` | Delete multiple notes by IDs |

## **Postman Documentation**
You can find the full API documentation here:
[Postman API Documentation](https://documenter.getpostman.com/view/50841493/2sBXqDsNUH)

Deploy Link: 
[Live Link](https://notes-application-2-n5ow.onrender.com/).

---
*Developed by Prashant Parmar*
