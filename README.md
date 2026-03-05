# Surakshamitra Healthguard (Decoupled Architecture)

This project has been restructured into a decoupled architecture, separating the client-side front-end application and the server-side backend API.

## Project Structure

- `/frontend` - Contains the React 19 application (built with Vite). Uses TypeScript, React Router, and Recharts.
- `/backend` - Contains the server-side logic and database/API configurations.

## Running the Application Locally

You will need two terminal windows to run both services simultaneously.

### 1. Setup and Run Backend
Open a new terminal and navigate to the backend directory:
```bash
cd backend
npm install
npm run dev
```

### 2. Setup and Run Frontend
Open another terminal and navigate to the frontend directory:
```bash
cd frontend
npm install
npm run dev
```

*Note: Make sure to review the `.env` settings inside the respective folders (`frontend` and `backend`) specifically for API keys like your `GEMINI_API_KEY`!*
