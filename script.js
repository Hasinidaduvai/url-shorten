const btn = document.getElementById("shortenBtn");
const loader = document.querySelector(".loader");
const resultDiv = document.getElementById("result");
const statsBox = document.getElementById("statsBox");
const clickCount = document.getElementById("clickCount");
const toast = document.getElementById("toast");

let currentCode = null;

// Animate counter
function animateCounter(target) {
  let count = 0;
  const interval = setInterval(() => {
    count++;
    clickCount.innerText = count;
    if (count >= target) clearInterval(interval);
  }, 40);
}

// Show toast
function showToast(message) {
  toast.innerText = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3000);
}

// Dark toggle
function toggleTheme() {
  document.body.classList.toggle("dark");
}

// Fetch stats live
async function fetchStats() {
  if (!currentCode) return;

  const res = await fetch(`/api/stats/${currentCode}`);
  const data = await res.json();

  animateCounter(data.clicks);
}

// Shorten URL
btn.addEventListener("click", async () => {

  loader.style.display = "inline-block";
  btn.disabled = true;

  const originalUrl = document.getElementById("urlInput").value;
  const expiryMinutes = document.getElementById("expiryInput").value;

  const res = await fetch("/api/shorten", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ originalUrl, expiryMinutes })
  });

  const data = await res.json();

  loader.style.display = "none";
  btn.disabled = false;

  if (data.shortUrl) {

    currentCode = data.shortUrl.split("/").pop();

    resultDiv.innerHTML = `
      <a href="${data.shortUrl}" target="_blank">${data.shortUrl}</a>
      <br><br>
      <button onclick="copyLink('${data.shortUrl}')">Copy</button>
    `;

    statsBox.classList.remove("hidden");

    QRCode.toCanvas(document.getElementById("qrCanvas"), data.shortUrl);

    fetchStats();

    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 }
    });

    showToast("Short URL Created Successfully 🎉");

  } else {
    showToast(data.error);
  }
});

function copyLink(url) {
  navigator.clipboard.writeText(url);
  showToast("Copied to clipboard!");
}