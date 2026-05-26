document.addEventListener("DOMContentLoaded", () => {
  const categoryButtons = document.querySelectorAll("[data-filter]");
  const levelButtons = document.querySelectorAll("[data-level]");
  const cards = document.querySelectorAll(".project-card");
  const resultsCounter = document.getElementById("results-counter");

  let activeCategory = "all";
  let activeLevel = "all";

  function updateProjects() {
    let visibleCount = 0;

    cards.forEach((card) => {
      const category = card.dataset.category;
      const level = card.dataset.level;

      const categoryMatch = activeCategory === "all" || category === activeCategory;
      const levelMatch = activeLevel === "all" || level === activeLevel;

      const shouldShow = categoryMatch && levelMatch;

      card.classList.toggle("is-hidden", !shouldShow);

      if (shouldShow) {
        visibleCount += 1;
      }
    });

    if (resultsCounter) {
      resultsCounter.textContent =
        visibleCount > 1
          ? `${visibleCount} projets affichés`
          : `${visibleCount} projet affiché`;
    }
  }

  categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      categoryButtons.forEach((btn) => btn.classList.remove("is-active"));
      button.classList.add("is-active");
      activeCategory = button.dataset.filter;
      updateProjects();
    });
  });

  levelButtons.forEach((button) => {
    button.addEventListener("click", () => {
      levelButtons.forEach((btn) => btn.classList.remove("is-active"));
      button.classList.add("is-active");
      activeLevel = button.dataset.level;
      updateProjects();
    });
  });

  updateProjects();
});