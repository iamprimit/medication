# 💊 Medication Reminder - Apple Health & Material 3 Web App

A full-fledged, responsive Medication Reminder web application particularly crafted for mobile devices, combining Apple's iOS Health design language with Google Material 3 fluid interactions, TailwindCSS, and Google Fonts / Material Symbols Rounded.

Designed to be hosted directly on **GitHub Pages** with zero backend or database required (utilizing browser `localStorage`, Web Audio API, PWA offline caching, and JSON data export/import).

---

## 📱 Features & Visuals (Reflected from Apple Health)

1. **Interactive Weekly Calendar Strip (`S M T W T F S`)**:
   - Shows daily adherence progress indicators matching iOS Health:
     - 🔵 **Solid Cyan Circle**: 100% of scheduled medications taken.
     - 🌓 **Half-filled Cyan Circle**: Partially completed day (e.g., morning dose taken, afternoon upcoming).
     - ⚪ **Empty Light Circle**: Untaken or future days.
   - Indicator caret `▼` and day bubble `(W)` highlight the selected day.
   - Interactive date picker by clicking the header date (`"Today, April 1"`).

2. **"Log" Section (Upcoming Doses)**:
   - Dynamic cards for upcoming doses (e.g., `12:00 PM Calcium`).
   - Quick log `+` button to instantly mark as taken with audio chime.
   - **"As Needed Medications"** card with dedicated PRN modal to log symptom-relief meds anytime.

3. **"Logged" Section**:
   - Displays completed doses grouped by time slot (e.g., `8:00 AM • Levothyroxine, Omega-3`).
   - Click to open the **"Recorded at [Time]"** sheet to inspect or toggle between **Skipped** and **✓ Taken**.

4. **"Recorded at [Time]" Sheet**:
   - Pill header icon badge.
   - 3D pill avatars with distinct colors and shapes.
   - Toggle buttons: `Skipped` (soft baby blue pill) and `✓ Taken` (vibrant iOS blue pill).
   - "Done" button to dismiss and update adherence rings live.

5. **"Edit Schedule" & "Review Details" Modals**:
   - Frequency: Daily, Cyclical (e.g., use for 21 days, pause for 7 days), or As Needed.
   - Multiple dose times per day with custom pill counts.
   - Duration tracking (Start date, End date).
   - Nicknames, food instructions, and refill inventory tracking.

6. **Custom 3D Pill Appearance Designer**:
   - Real-time 3D pill preview with specular lighting, debossed tablet scores, and two-tone capsule shells.
   - Choose shapes: Round Tablet, Oblong Capsule, Oval Caplet, Liquid/Drops.
   - Color swatches: Mauve Purple, Sage Olive, Sunshine Yellow, Sky Blue, Coral Red, Mint Green, and Pure White.

7. **Audio Feedback & Dynamic Island**:
   - Web Audio synthesizer generates Apple-style celebratory double-chimes when medications are taken.
   - Animated Dynamic Island pill expands at the top of the iPhone bezel to confirm actions.

8. **Health Summary & Medical ID**:
   - Weekly adherence percentage and 7-day consistency chart.
   - Medication inventory with low-supply refill warnings.
   - Medical ID card with emergency allergies, blood type, and JSON export/import.

9. **Desktop Device Frame vs Full Screen Mode**:
   - On desktop computers, displays an iPhone 16 Pro device frame with status bar, time, and Dynamic Island.
   - A toggle button in the top right switches between **"iPhone Frame"** and **"Full Screen"**.
   - On mobile devices, the app automatically expands to native full-screen edge-to-edge.

---

## 🚀 How to Host on GitHub Pages

1. **Initialize Git & Commit**:
   ```bash
   cd "Medication Reminder"
   git init
   git add .
   git commit -m "Initial commit of Medication Reminder web app"
   ```

2. **Push to GitHub**:
   - Create a new public or private repository on GitHub (e.g. `medication-reminder`).
   - Link and push your repository:
   ```bash
   git remote add origin https://github.com/<your-username>/medication-reminder.git
   git branch -M main
   git push -u origin main
   ```

3. **Enable GitHub Pages**:
   - In your GitHub repository, navigate to **Settings** > **Pages** (in the left sidebar).
   - Under **Build and deployment** > **Source**, select **Deploy from a branch**.
   - Under **Branch**, select `main` and folder `/ (root)`.
   - Click **Save**.
   - Within 1–2 minutes, your website will be live at `https://<your-username>.github.io/medication-reminder/`!

---

## 📲 Installing as a Native PWA (Add to Home Screen)

- **On iOS (Safari)**:
  1. Open your GitHub Pages link in Safari.
  2. Tap the **Share** button (box with upward arrow) at the bottom.
  3. Scroll down and tap **"Add to Home Screen"**.
  4. Tap **Add** — it will now launch full-screen like a native iOS app!

- **On Android (Chrome)**:
  1. Open the link in Chrome.
  2. Tap the three dots menu ⋮ in the top right.
  3. Tap **"Install app"** or **"Add to Home Screen"**.

---

## 🛠️ Tech Stack

- **HTML5 & Vanilla JavaScript (ES6+)**: Fast, lightweight, zero dependencies, client-side persistence via `localStorage`.
- **TailwindCSS**: Modern utility styling and responsive layouts.
- **Google Fonts & Material Symbols Rounded**: `Plus Jakarta Sans` / `SF Pro Display` and `material-symbols-rounded`.
- **Web Audio API**: Real-time sound synthesis for celebratory health alerts.
- **Service Worker (`sw.js`) & Web Manifest (`manifest.json`)**: Offline support and home screen installation.
