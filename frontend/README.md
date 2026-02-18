 📁 frontend/ — README.md

```markdown
# 🎨 ToDo FullStack — Frontend

This is the **client-side** of the ToDo FullStack application.

The frontend provides:
- Task creation UI
- Task list display
- Edit & delete functionality
- API integration with backend

---

## 🛠 Tech Stack

- React
- Vite
- Axios (for API calls)
- CSS / Tailwind (if used)

---

## 📂 Project Structure

frontend/
│
├── public/          # Static files
├── src/
│   ├── components/  # Reusable UI components
│   ├── pages/       # Page-level components
│   ├── App.jsx      # Main app component
│   ├── main.jsx     # Entry point
│   └── api.js       # API configuration (if created)
├── vite.config.js
└── package.json

---

## ⚙️ Installation & Setup

### 1️⃣ Navigate to frontend folder

```bash
cd frontend
2️⃣ Install dependencies
npm install
3️⃣ Start development server
npm run dev
App runs on:

http://localhost:5173
🔗 Connecting to Backend
Make sure backend is running on:

http://localhost:8080
Example API call:

fetch("http://localhost:8080/api/tasks")
Or using axios:

axios.get("/api/tasks")
🧠 How Frontend Works
React handles UI rendering.

Vite provides fast development build.

User actions trigger API calls.

State updates dynamically display task list.

Data is fetched from backend.

🖥 Features
Add new tasks

Mark tasks as complete

Delete tasks

Real-time UI updates

Responsive design

🚀 Build for Production
npm run build
Output will be inside:

dist/
You can deploy this to:

Vercel

Netlify

Any static hosting provider

📌 Future Enhancements
Dark mode

Authentication system

Drag & drop tasks

Pagination

Task categories
