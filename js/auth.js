document.addEventListener("DOMContentLoaded", () => {
  const toggles = document.querySelectorAll("[data-password-toggle]");

  toggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const targetSelector = toggle.getAttribute("data-password-toggle");
      const input = document.querySelector(targetSelector);

      if (!input) return;

      const isPassword = input.type === "password";
      input.type = isPassword ? "text" : "password";
      toggle.textContent = isPassword ? "Masquer" : "Afficher";
    });
  });
});