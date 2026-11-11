document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get(["ytFocusData"], (res) => {
    const data = res.ytFocusData || {};
    document.getElementById("chkShorts").checked = data.hideShorts !== false;
    document.getElementById("chkRecs").checked = data.hideRecommendations !== false;
    document.getElementById("chkComments").checked = data.hideComments !== false;
  });

  const sync = () => {
    chrome.storage.local.get(["ytFocusData"], (res) => {
      const data = res.ytFocusData || {};
      data.hideShorts = document.getElementById("chkShorts").checked;
      data.hideRecommendations = document.getElementById("chkRecs").checked;
      data.hideComments = document.getElementById("chkComments").checked;
      chrome.storage.local.set({ ytFocusData: data });
    });
  };

  document.querySelectorAll("input[type='checkbox']").forEach(el => el.onchange = sync);

  document.getElementById("btnResetGate").onclick = () => {
    chrome.storage.local.get(["ytFocusData"], (res) => {
      const data = res.ytFocusData || {};
      data.intentGateUnlockedUntil = 0;
      data.currentIntent = "";
      chrome.storage.local.set({ ytFocusData: data }, () => {
        alert("Focus Gate reset! Refresh YouTube to test.");
      });
    });
  };
});