# SurakshaMitra HealthGuard 🛡️

**Your Intelligent AI Companion for Mind, Body, and Soul.**

SurakshaMitra HealthGuard is a next-generation Progressive Web App (PWA) designed to be your holistic health partner. Powered by Google's Gemini 3 Pro and Gemini 2.5 Flash models, it combines advanced AI reasoning with intuitive wellness tracking to support your physical health, mental well-being, and medical needs.

---

## 🌟 Key Features

### 1. 📊 Holistic Dashboard
A centralized command center for your daily wellness metrics.
*   **Activity Tracking:** visualizes daily steps and progress towards goals using interactive charts.
*   **Hydration Tracker:** Log water intake with smart reminders every 30 minutes to stay hydrated.
*   **Sleep Analysis:** Track sleep duration and quality.
*   **Rewards System:** Earn 'Suraksha Coins' for completing healthy activities.
*   **Daily Inspiration:** AI-generated motivational quotes and clean jokes to start your day.

### 2. 🧠 Mental Wellness Sanctuary
A dedicated space for emotional regulation and stress relief.
*   **Visual Sanctuary:** Uses Gemini Image Generation to create calming, personalized landscapes based on your prompts.
*   **Mood Analysis:** Logs your feelings and uses AI to analyze sentiment, emotional tone, and key themes, offering psychological insights.
*   **Therapeutic Voice:** Generates soothing, empathetic audio advice using advanced Text-to-Speech (TTS).
*   **Zen Games:** A built-in memory match game to improve focus and reduce anxiety.
*   **Crisis Detection:** Automatically detects distress keywords (e.g., self-harm) and provides immediate safety resources.

### 3. 🧬 Personality Hub
Discover your inner self with our AI-powered archetype assessment.
*   **Interactive Quiz:** A 5-step assessment covering energy, recovery, and goals.
*   **AI Archetypes:** Uses Gemini 3 Pro to analyze answers and generate a creative persona (e.g., "The Cosmic Healer") with unique traits and empowering messages.

### 4. 💪 Physical & Focus
Tools to keep your body moving and your mind sharp.
*   **Workout Generator:** Creates custom workout routines (sets/reps) tailored to your target area (e.g., Abs, Legs) and difficulty level.
*   **Deep Focus Mode:** A distraction-blocking timer to track and reward productive work sessions.

### 5. 🩺 Medical Assistant
Advanced medical AI tools for triage and logistics.
*   **Symptom Checker:** Uses Gemini 3 Pro's "Thinking Mode" for deep reasoning to provide detailed, professional health insights based on symptoms.
*   **Medical Scanner:**
    *   **Prescription Lens:** Extracts dosage, frequency, and instructions from photos of handwritten prescriptions.
    *   **X-Ray Analysis:** Analyzes bone structure and identifies potential anomalies in X-ray images.
*   **Appointment Timeline:** A visual schedule for doctor visits with customizable reminders.
*   **Find Nearby:** Uses Google Maps Grounding to locate nearby cardiologists, pharmacies, and gyms based on your real-time location.

---

## 🛠️ Technology Stack

*   **Frontend:** React 19, TypeScript, Tailwind CSS
*   **AI Models:**
    *   `gemini-3-pro-preview` (Reasoning, Symptom Checking, Vision)
    *   `gemini-3-pro-image-preview` (Image Generation)
    *   `gemini-2.5-flash` (General Chat, Data Parsing)
    *   `gemini-2.5-flash-preview-tts` (Text-to-Speech)
*   **APIs:** Google GenAI SDK (ESM), Google Maps Grounding
*   **Visuals:** Lucide React Icons, Recharts for data visualization

---

## 🚀 Getting Started

### Prerequisites
*   A modern web browser (Chrome/Edge recommended).
*   A **Google Gemini API Key**.

### Installation
This project uses ES Modules via CDN, so no `npm install` is required for dependencies.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/YOUR_USERNAME/surakshamitra-healthguard.git
    cd surakshamitra-healthguard
    ```

2.  **Configure API Key:**
    *   **Option A (Local Server):** Create a `.env` file (if using a build tool) or manually replace `process.env.API_KEY` in `services/geminiService.ts` with your actual key for local testing.
    *   **Option B (Deployment):** Set the `API_KEY` environment variable in your hosting provider (Vercel/Netlify).

    > **⚠️ Security Note:** Never commit your API key to a public repository.

3.  **Run the App:**
    *   If using VS Code, install the "Live Server" extension.
    *   Right-click `index.html` and select **"Open with Live Server"**.

---

## 🤝 Contributing

Contributions are welcome!
1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

**Created by Supriya**
