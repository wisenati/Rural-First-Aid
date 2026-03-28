# RuralHealth Connect 🚑

**Offline-first emergency first aid and health connection app for rural areas.**

RuralHealth Connect is a smart first aid and emergency assistant designed specifically for rural communities. It features offline-ready guides, SOS emergency alerts, AI-driven symptom checking, and a local health directory.

## 🚀 How to Run Locally

To run this application on your computer (Windows, Mac, or Linux), follow these steps:

### 1. Prerequisites
*   **Node.js:** Download and install the LTS version from [nodejs.org](https://nodejs.org/).
*   **Git (Optional):** If you want to clone the repository.

### 2. Download the Code
*   If you're in AI Studio, click the **Settings** (⚙️ gear icon) -> **Export** -> **Download as ZIP**.
*   Extract the ZIP file to a folder on your computer.

### 3. Installation
Open your terminal or command prompt, navigate to the project folder, and run:
```bash
npm install
```

### 4. Set Up Environment Variables
Create a file named `.env` in the root folder of the project and add your Gemini API key:
```env
GEMINI_API_KEY=your_api_key_here
```
*   You can get a free API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

### 5. Start the App
Run the following command to start the development server:
```bash
npm run dev
```
*   The app will be available at `http://localhost:3000`.

## 🛠️ Tech Stack
*   **React + Vite:** Frontend framework.
*   **Tailwind CSS:** Styling.
*   **Lucide React:** Icons.
*   **Google Gemini API:** AI-driven symptom analysis.
*   **PWA (Progressive Web App):** Service workers for offline functionality.

## 🛡️ Privacy & Security
*   All medical data is stored locally on your device using `localStorage`.
*   AI analysis is performed via encrypted transmission to Google's Gemini models.
*   The app includes an "Account & Data Deletion" feature to permanently remove all local data.

## 📄 License
This project is for educational and emergency support purposes. Always consult with a medical professional for serious health concerns.
