document.getElementById("actionBtn").addEventListener("click", async () => {
  // Example: Run a simple script on the current tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => alert("Hello from your Chrome Extension 👋")
  });
});