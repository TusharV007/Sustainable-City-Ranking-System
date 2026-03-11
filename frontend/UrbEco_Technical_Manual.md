# UrbEco: System Architecture & Technical Documentation

## 1. Overview
UrbEco is a high-performance sustainability indexing platform designed to evaluate and visualize the environmental impact of global cities. It combines real-time data visualization, AI-powered insights, and automated geocoding to provide a comprehensive view of urban sustainability.

---

## 2. Technology Stack
The application is built using a modern, scalable stack:

*   **Frontend Framework**: Next.js 16.1.6 (App Router)
*   **Language**: TypeScript
*   **Styling**: Vanilla CSS & TailwindCSS (customized with premium glassmorphism effects)
*   **Database**: Google Cloud Firestore (Real-time NoSQL)
*   **Authentication**: Firebase Auth (with protected routes and session management)
*   **AI Engine**: Google Gemini Pro (used for calculating sustainability insights and recommendations)
*   **Mapping**: React-Leaflet & Leaflet (OpenStreetMap tiles)
*   **Geocoding API**: Nominatim (OpenStreetMap)
*   **Icons**: Lucide React

---

## 3. User Interaction Flow

### A. Authentication & Landing
1.  User enters the platform via a premium landing page.
2.  Login/Signup is required to access the central dashboard.

### B. The Assessment Process
1.  **Input**: User navigates to `/assess` and enters a City Name and Country.
2.  **Metric Entry**: User adjusts 10 environmental sliders (CO₂, Air Quality, Renewables, etc.).
3.  **Automated Processing**:
    *   **AI Analysis**: Gemini API analyzes the input metrics to generate text-based urban recommendations.
    *   **Geocoding**: The system calls the Nominatim API to find the exact Lat/Long coordinates for the city name provided.
4.  **Persistence**: The score is calculated, and the document is saved to Firestore with the user's ID.

### C. Dashboard & Visualization
1.  **Global Index**: Users view a live dashboard with average scores and impact distributions.
2.  **Interactive Map**: Users can see all city pins globally, color-coded by impact.
3.  **Differentiator**: Users can toggle between "Global" and "Personal" views to see only their own assessments.

---

## 4. Backend Calculations & Scoring Model

The **Sustain-Index** is a weighted average of 10 key environmental factors. The final score is on a scale of **0-100**.

### Scoring Weights and Inputs:

| Metric | Weight | Unit | Target Trend | Value Range |
| :--- | :--- | :--- | :--- | :--- |
| **CO₂ Emissions** | 20% | t/cap | Lower is Better | 0 - 25 |
| **Air Quality (AQI)** | 15% | AQI | Lower is Better | 0 - 300 |
| **Renewable Energy** | 18% | % | Higher is Better | 0 - 100% |
| **Waste Recycling** | 12% | % | Higher is Better | 0 - 100% |
| **Green Space** | 10% | m²/cap | Higher is Better | 0 - 100 |
| **Public Transport** | 10% | % coverage | Higher is Better | 0 - 100% |
| **Water Quality** | 8% | index/100 | Higher is Better | 0 - 100 |
| **Energy Efficiency**| 7% | index/100 | Higher is Better | 0 - 100 |

### Impact Categorization:
*   **Low Impact (Sustainable)**: Score **80 - 100** (Green)
*   **Medium Impact**: Score **50 - 79** (Yellow)
*   **High Impact (Critical)**: Score **0 - 49** (Red)

---

## 5. Key Features

### Automated Geocoding
To solve the issue of regional cities not showing on maps, the system performs a backend fetch to OpenStreetMap during the saving process. This ensures that every entry, regardless of city size, has geographic coordinates.

### AI Insight Engine
The platform uses Gemini 1.5 Pro to process numerical data into human-readable advice. It identifies the "bottleneck" metric (e.g., low recycling) and suggests specific urban planning strategies.

### Live Multi-User Sync
Using Firestore's real-time capabilities, the "Global Index" count and the Map markers update instantly for all users whenever a new assessment is saved.

---
*Documentation Generated for UrbEco Sustainability Platform - 2026*
