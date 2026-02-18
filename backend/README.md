# 🚀 ToDo FullStack — Backend

This is the **server-side** of the ToDo FullStack application.

The backend is responsible for:
- Handling API requests
- Managing business logic
- Connecting to the database
- Performing CRUD operations on tasks

---

## 🛠 Tech Stack

- Node.js
- Express
- H2 Database (or your configured database)
- dotenv (for environment variables)
- CORS

---

## 📂 Project Structure (Typical)

backend/
│
├── controllers/      # Logic for handling API requests
├── models/           # Database schemas (Task model)
├── routes/           # API route definitions
├── config/           # Database configuration
├── server.js / app.js # Entry point
├── .env              # Environment variables
└── package.json      # Dependencies and scripts

---

## ⚙️ Installation & Setup

### 1️⃣ Navigate to backend folder

```bash
cd backend
2️⃣ Install dependencies
npm install
3️⃣ Configure Environment Variables
Create a .env file inside backend:

PORT=8080
H2_URI=your_H2_connection_string
4️⃣ Start the server
npm start
or (if using nodemon):

npm run dev
Server runs on:

http://localhost:8080
📡 API Endpoints
Get All Tasks
GET /api/tasks

Create Task
POST /api/tasks

Update Task
PUT /api/tasks/:id

Delete Task
DELETE /api/tasks/:id

🧠 How Backend Works
Server starts using Node.js runtime.

Express creates REST API endpoints.

Requests are handled by controllers.

Data is stored in H2.

JSON responses are sent back to frontend.

🔐 Security Notes
Never commit .env file

Use strong MongoDB credentials

Enable CORS only for trusted origins in production

🧪 Testing API
You can test API using:

Postman

Thunder Client (VS Code extension)

Curl commands

📌 Future Improvements
Add authentication (JWT)

Add user accounts

Add validation middleware

Add logging system
