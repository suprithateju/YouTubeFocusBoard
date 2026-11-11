# 🎯 YouTube Focus Board

> An offline-first, privacy-respecting Chrome Extension (Manifest V3) that transforms YouTube into an intentional study terminal by removing algorithmic distractions, enforcing an intent gate, tracking study time, and linking notes directly to video timestamps.

---

## 📌 Executive Summary

* **Objective:** Eliminate distracting rabbit holes on YouTube (Shorts, recommendations, comments) and convert it into a structured learning environment with study playlists and precision timestamped note navigation.
* **Methodology:** 
  * Manifest V3 content script architecture utilizing selective CSS tree removal to suppress algorithmic elements without breaking core player APIs.
  * Single Page Application (SPA) lifecycle hook listening to `yt-navigate-finish` to preserve custom UI components across video switches without full-page reloads.
  * Direct HTML5 video DOM API integration (`video.currentTime`) enabling instant timestamp seeking via interactive UI chips.
  * Client-side persistent storage utilizing `chrome.storage.local` with zero external server tracking.
* **Expected Outcome:** A fully self-contained Chrome extension that suppresses distractions, enforces a 60-minute intent gate, logs daily study watch duration, and allows interactive timestamped note-taking.

---

## 🚀 Key Features

### 1. 🛡️ Algorithmic Distraction Shield
* Automatically hides **YouTube Shorts** carousels, sidebar navigation links, and reels[cite: 7].
* Removes the home feed recommendations, watch-next sidebar suggestions, and comment sections[cite: 7].
* Replaces visual clutter with a clean, distraction-free study HUD beside the active video player[cite: 7].

### 2. ⏳ Intent-Based Gatekeeper ("Why are you here?")
* When you open YouTube, an intent gate locks the screen until you declare your learning objective (e.g., *"Revising thermodynamics"*)[cite: 7].
* Unlocks access for **60 minutes**, preventing aimless browsing[cite: 7].
* Displays the current active goal persistently in the study sidebar[cite: 7].

### 3. ⏱️ Timestamped Notes with Instant Seeking
* Add study notes at any moment during a lecture[cite: 7].
* Clicking on any saved timestamp (e.g., `12:40 · Carnot cycle`) immediately jumps the video player to that exact second[cite: 7].

### 4. 📋 Interactive Study Playlist & Time Tracking
* Keep an interactive checklist of lectures to watch (e.g., `Lecture 1`, `Lecture 2`)[cite: 7].
* Automatic watch timer logs active playback duration in minutes for the current day[cite: 7].
* Automatically resets the timer every 24 hours at midnight.

### 5. 🔒 100% Offline & Private
* Zero third-party analytics, tracking pixels, or remote APIs.
* All notes, goals, and checklists are persisted locally using `chrome.storage.local` and survive browser restarts[cite: 7].

---

## 🖥️ Interface Preview
<img width="1920" height="1080" alt="Screenshot (317)" src="https://github.com/user-attachments/assets/c922458e-c1b6-4951-9c53-ef2298484bf1" />


