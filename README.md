# 🎬 CineZone Premium Media Hub

CineZone is a modern, lightweight Windows desktop application built with Electron.js. It acts as a sleek, Netflix-inspired interface to browse, search, and stream media content directly from local FTP clusters (`172.16.50.7` and `172.16.50.14`) without downloading files beforehand.

## ✨ Features
* **Dual-Server Integration:** Seamlessly maps separate content categories to individual server IPs.
* **Smart Filter System:** Real-time text search by name, plus quick dropdowns for video formats (1080p, 720p, Dual Audio) and release years.
* **Continuous Slider:** A smooth, auto-cycling promotional banner displaying trending content at the top.
* **Adaptive Mobile UI:** Responsive sidebar collapses into a clean touch-to-open slide drawer for smaller screen layouts.
* **Immersive Video Player:** Native HTML5 streaming modal overlay with immediate playback control.

---

## 📂 Project Folder Structure

To run the application, arrange your files in your project directory exactly like this:

```text
cinezone-app/
├── package.json        # Project metadata, dependencies, and run scripts
├── main.js             # Electron background process (secure node/FTP layer)
├── preload.js          # Secure bridge exposing API access to the UI
├── renderer.js         # Frontend engine handling UI interaction, search, & logic
├── styles.css          # Premium Netflix/Plex dark theme styling definitions
└── index.html          # HTML5 layout structure for the layout viewports
