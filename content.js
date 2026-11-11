let focusSettings = {
  hideShorts: true,
  hideRecommendations: true,
  hideComments: true,
  hideFeed: true,
  intentGateUnlockedUntil: 0,
  currentIntent: "",
  studyList: [
    { id: "1", title: "Lecture 1", completed: true },
    { id: "2", title: "Lecture 2", completed: false }
  ],
  timestampNotes: {
    "default": [
      { time: 760, label: "Carnot cycle" }
    ]
  },
  todayWatchSeconds: 2280, // 38 mins default for demo
  lastDateStr: new Date().toDateString()
};

function loadStoredState() {
  chrome.storage.local.get(["ytFocusData"], (res) => {
    if (res.ytFocusData) {
      focusSettings = { ...focusSettings, ...res.ytFocusData };
    }
    applyDistractionClasses();
    checkIntentGate();
    injectFocusUI();
  });
}

function saveState() {
  chrome.storage.local.set({ ytFocusData: focusSettings });
}

function applyDistractionClasses() {
  document.body.classList.toggle("hide-comments", focusSettings.hideComments);
  document.body.classList.toggle("hide-recommendations", focusSettings.hideRecommendations);
  document.body.classList.toggle("hide-feed", focusSettings.hideFeed);
}

function checkIntentGate() {
  const isUnlocked = focusSettings.intentGateUnlockedUntil > Date.now();
  let gateEl = document.getElementById("yt-focus-gate-overlay");

  if (!isUnlocked) {
    if (!gateEl) {
      gateEl = document.createElement("div");
      gateEl.id = "yt-focus-gate-overlay";
      gateEl.innerHTML = `
        <div class="yt-focus-gate-box">
          <div style="font-size:32px; margin-bottom:10px;">🎯</div>
          <h2>Why are you here?</h2>
          <p>YouTube is locked to keep you focused. Type your study intention to unlock for 60 minutes.</p>
          <input type="text" id="ytGateReason" class="yt-focus-gate-input" placeholder="e.g., Revising thermodynamics" autofocus />
          <button id="ytGateSubmit" class="yt-focus-gate-btn">Unlock YouTube (60 Mins)</button>
        </div>
      `;
      document.body.appendChild(gateEl);

      document.getElementById("ytGateSubmit").onclick = () => {
        const val = document.getElementById("ytGateReason").value.trim() || "Revising thermodynamics";
        focusSettings.currentIntent = val;
        focusSettings.intentGateUnlockedUntil = Date.now() + 60 * 60 * 1000;
        saveState();
        gateEl.remove();
        injectFocusUI();
      };
    }
  } else if (gateEl) {
    gateEl.remove();
  }
}

function injectFocusUI() {
  if (!window.location.href.includes("watch")) return;

  const secondary = document.querySelector("#secondary-inner") || document.querySelector("#secondary");
  if (!secondary) return;

  let sidebar = document.getElementById("yt-study-sidebar");
  if (!sidebar) {
    sidebar = document.createElement("div");
    sidebar.id = "yt-study-sidebar";
    secondary.prepend(sidebar);
  }

  const mins = Math.floor(focusSettings.todayWatchSeconds / 60);

  sidebar.innerHTML = `
    <div class="yt-study-header">
      <h3>Study list</h3>
      <span class="yt-study-stat">Today: <strong>${mins} min</strong></span>
    </div>

    ${focusSettings.currentIntent ? `
      <div class="yt-current-intent-card">
        <div class="label">Why are you here?</div>
        <div class="text">${focusSettings.currentIntent}</div>
      </div>
    ` : ""}

    <ul class="yt-study-list">
      ${focusSettings.studyList.map(item => `
        <li class="yt-study-item ${item.completed ? "" : "active"}">
          <span>${item.completed ? "✓" : "▶"} ${item.title}</span>
        </li>
      `).join("")}
    </ul>

    <div style="font-size: 11px; text-transform: uppercase; color: #94a3b8; margin: 12px 0 6px 0; font-weight: 700;">
      Timestamp Notes
    </div>
    <div id="ytNotesContainer">
      <div class="yt-timestamp-badge" id="tsNoteSample">
        <span class="yt-ts-time">12:40</span>
        <span>Carnot cycle</span>
      </div>
    </div>
  `;

  const tsSample = document.getElementById("tsNoteSample");
  if (tsSample) {
    tsSample.onclick = () => {
      const vid = document.querySelector("video");
      if (vid) {
        vid.currentTime = 760;
        vid.play();
      }
    };
  }
}

setInterval(() => {
  const vid = document.querySelector("video");
  if (vid && !vid.paused && !document.hidden && window.location.href.includes("watch")) {
    focusSettings.todayWatchSeconds += 1;
    if (focusSettings.todayWatchSeconds % 30 === 0) saveState();
  }
}, 1000);

window.addEventListener("yt-navigate-finish", () => {
  applyDistractionClasses();
  checkIntentGate();
  setTimeout(injectFocusUI, 1200);
});

loadStoredState();