document.addEventListener("DOMContentLoaded", () => {
  // ── Glow effect on mouse move ──
  const heroSection = document.querySelector(".hero-section");
  if (heroSection) {
    heroSection.addEventListener("mousemove", (e) => {
      const rect = heroSection.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      heroSection.style.setProperty("--mouse-x", `${x}px`);
      heroSection.style.setProperty("--mouse-y", `${y}px`);
    });
  }
});