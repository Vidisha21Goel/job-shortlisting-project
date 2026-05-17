# 🎯 TalentSift — Candidate Profile Shortlisting System

A full-stack MERN (MongoDB, Express, React, Node.js) application for shortlisting job candidates using both rule-based skill matching and AI-powered analysis via OpenRouter.

---

## 🗂 Project Structure

```
candidate-shortlist/
├── backend/
│   ├── models/
│   │   └── Candidate.js       # MongoDB schema
│   ├── routes/
│   │   ├── candidates.js      # CRUD API
│   │   ├── match.js           # Basic matching logic
│   │   └── ai.js              # OpenRouter AI integration
│   ├── .env.example           # Environment variable template
│   ├── package.json
│   └── server.js              # Express server entry point
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Sidebar.js
    │   │   ├── CandidateCard.js
    │   │   └── SkillInput.js
    │   ├── pages/
    │   │   ├── Dashboard.js
    │   │   ├── AddCandidate.js
    │   │   ├── Candidates.js
    │   │   ├── Shortlist.js
    │   │   └── AIShortlist.js
    │   ├── utils/
    │   │   └── api.js          # Axios API helpers
    │   ├── App.js
    │   ├── index.css           # Global styles
    │   └── index.js
    └── package.json
```

---

## ✅ Prerequisites

Before you begin, install:

1. **Node.js** (v18 or higher) — https://nodejs.org
2. **MongoDB** (Community Edition) — https://www.mongodb.com/try/download/community
   - Or use **MongoDB Atlas** (free cloud DB) — https://www.mongodb.com/atlas

To verify installations, open a terminal and run:
```bash
node -v       # should print v18+
npm -v        # should print 9+
mongod --version  # should print MongoDB version
```

---

## 🚀 Setup & Run Instructions

### Step 1 — Open the project in VS Code

1. Extract the ZIP file to a folder (e.g., `Desktop/candidate-shortlist`)
2. Open **VS Code**
3. Go to **File → Open Folder** → select `candidate-shortlist`

---

### Step 2 — Set up the Backend

1. Open the **VS Code integrated terminal** (`Ctrl + `` ` `` ` or **Terminal → New Terminal**)

2. Navigate to the backend folder:
   ```bash
   cd backend
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Create your environment file:
   ```bash
   # On Windows (PowerShell):
   copy .env.example .env

   # On Mac/Linux:
   cp .env.example .env
   ```

5. Open `backend/.env` and configure:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/candidate_shortlist
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   ```

   > 💡 **Get a free OpenRouter API key:**
   > 1. Go to https://openrouter.ai
   > 2. Sign up for a free account
   > 3. Go to **Keys** → **Create Key**
   > 4. Paste it in `.env` as `OPENROUTER_API_KEY`
   >
   > The basic shortlisting and all other features work WITHOUT the key.
   > The AI Matching feature requires it.

6. Start MongoDB (if running locally):
   ```bash
   # On Windows: MongoDB runs as a service automatically after installation
   # You can verify it's running in Services (search "Services" in Start menu)

   # On Mac:
   brew services start mongodb-community

   # On Linux:
   sudo systemctl start mongod
   ```

7. Start the backend server:
   ```bash
   npm run dev
   ```

   You should see:
   ```
   ✅ Connected to MongoDB
   🚀 Server running on http://localhost:5000
   ```

---

### Step 3 — Set up the Frontend

1. Open a **new terminal** in VS Code (`Ctrl+Shift+5` or click `+` in terminal panel)

2. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```

3. Install dependencies:
   ```bash
   npm install
   ```
   > ⏳ This may take 2–5 minutes the first time.

4. Start the React app:
   ```bash
   npm start
   ```

   The browser will automatically open at **http://localhost:3000**

---

## 🖥 Using the Application

### 1. Add Candidates
- Go to **Add Candidate** in the sidebar
- Fill in name, email, experience, and skills
- Try the sample candidates listed on the page

### 2. View All Candidates
- Go to **Candidates** to see all registered candidates
- Use the search bar to filter by name or skill

### 3. Basic Shortlisting (no API key needed)
- Go to **Shortlist**
- Enter required skills (e.g., `React`, `Node.js`)
- Optionally add preferred skills and minimum experience
- Click **Find Matches** to see ranked results

### 4. AI Matching (requires OpenRouter API key)
- Go to **AI Matching**
- Enter the same job requirements
- Click **Run AI Analysis**
- View AI-generated rankings, recommendations, strengths, and gaps
- Click **Interview Questions** on any card to get tailored questions

### 5. Dashboard
- View total candidates, unique skills, average experience
- See bar charts of top skills and experience distribution

---

## 🔌 API Endpoints Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/candidates` | Add a new candidate |
| GET | `/api/candidates` | Get all candidates (supports `?search=`) |
| GET | `/api/candidates/:id` | Get a single candidate |
| DELETE | `/api/candidates/:id` | Delete a candidate |
| POST | `/api/match` | Basic skill matching |
| POST | `/api/ai/shortlist` | AI-powered ranking |
| POST | `/api/ai/interview-questions` | Generate interview questions |
| GET | `/api/health` | Health check |

---

## 🛠 Troubleshooting

**`MongoDB connection error`**
- Make sure MongoDB is running on your system
- Or switch to MongoDB Atlas: replace `MONGODB_URI` with your Atlas connection string

**`npm install` fails**
- Try: `npm install --legacy-peer-deps`
- Make sure Node.js is v18+

**`Port 5000 already in use`**
- Change `PORT=5001` in `backend/.env`

**Frontend shows blank page**
- Make sure the backend is running on port 5000
- Check browser console for errors (F12)

**AI features return error**
- Verify your OpenRouter API key is correct in `backend/.env`
- Restart the backend server after editing `.env`

---

## 📦 Technologies Used

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Recharts, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose |
| AI | OpenRouter API (GPT-4o-mini) |
| Styling | Custom CSS with CSS Variables |
