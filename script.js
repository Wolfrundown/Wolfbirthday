const openBtn = document.getElementById("openBtn");
const surprise = document.getElementById("surprise");
const finalBtn = document.getElementById("finalBtn");
const finalMessage = document.getElementById("finalMessage");

openBtn.addEventListener("click", () => {
  surprise.classList.remove("hidden");
  openBtn.textContent = "Surprise Opened ❤️";
  openBtn.disabled = true;
  surprise.scrollIntoView({ behavior: "smooth" });
});

finalBtn.addEventListener("click", () => {
  finalMessage.classList.remove("hidden");
  finalBtn.style.display = "none";
  finalMessage.scrollIntoView({ behavior: "smooth", block: "center" });
});
