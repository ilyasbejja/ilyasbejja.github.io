/**
 * projects.js — Logique d'affichage et de candidature dans la section "Missions disponibles"
 */

document.addEventListener("DOMContentLoaded", () => {
  const categoryButtons = document.querySelectorAll("[data-filter]");
  const levelButtons = document.querySelectorAll("[data-level]");
  const resultsCounter = document.getElementById("results-counter");

  let activeCategory = "all";
  let activeLevel = "all";

  function updateProjects() {
    let visibleCount = 0;
    const allCards = document.querySelectorAll("#projects-grid .project-card");

    allCards.forEach((card) => {
      const category = card.dataset.category || "";
      const level = card.dataset.level || "";

      const categoryMatch = activeCategory === "all" || category.toLowerCase() === activeCategory.toLowerCase();
      const levelMatch = activeLevel === "all" || level.toLowerCase() === activeLevel.toLowerCase();

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

  function renderRealProjects(projects, studentAppsMap = {}) {
    const grid = document.getElementById("projects-grid");
    if (!grid) return;
    grid.innerHTML = "";

    if (projects.length === 0) {
        grid.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding: 40px; color: var(--text-muted);">Aucun projet disponible pour le moment.</div>`;
        updateProjects();
        return;
    }

    projects.forEach(p => {
        const article = document.createElement("article");
        article.className = "project-card glass-card";
        
        // Map category string to data-category for filtering
        let catValue = "web";
        const catStr = p.category.toLowerCase();
        if (catStr.includes("data") || catStr.includes("ia")) catValue = "data";
        else if (catStr.includes("design") || catStr.includes("ui")) catValue = "design";
        else if (catStr.includes("cyber") || catStr.includes("sécur")) catValue = "cyber";
        else if (catStr.includes("automat")) catValue = "automation";

        let levelValue = p.level ? p.level.toLowerCase() : "junior";
        if (levelValue === "intermédiaire") levelValue = "intermediate";
        if (levelValue === "avancé") levelValue = "advanced";

        article.dataset.category = catValue;
        article.dataset.level = levelValue;

        // Determine action button html
        const user = window.currentUser;
        let actionBtnHtml = "";
        
        if (user) {
            const isStudent = user.role.toLowerCase().includes("étudiant") || user.role.toLowerCase().includes("student");
            if (isStudent) {
                const appliedStatus = studentAppsMap[p.id];
                if (appliedStatus) {
                    let statusColor = "var(--text-soft)";
                    let statusBg = "rgba(255, 255, 255, 0.05)";
                    if (appliedStatus.toLowerCase().includes("attente")) {
                      statusColor = "#ffb833";
                      statusBg = "rgba(255, 184, 51, 0.15)";
                    } else if (appliedStatus.toLowerCase().includes("accept")) {
                      statusColor = "var(--primary)";
                      statusBg = "rgba(0, 223, 154, 0.15)";
                    } else if (appliedStatus.toLowerCase().includes("refus")) {
                      statusColor = "var(--danger)";
                      statusBg = "rgba(255, 75, 107, 0.15)";
                    }
                    actionBtnHtml = `<span style="display: inline-block; padding: 6px 12px; border-radius: var(--radius-md); font-size: 0.8rem; font-weight: 700; color: ${statusColor}; background: ${statusBg}; border: 1px solid ${statusColor}40;">Déjà postulé (${appliedStatus})</span>`;
                } else {
                    actionBtnHtml = `<button type="button" class="btn btn-primary btn-sm btn-apply-now" data-project-id="${p.id}">Postuler →</button>`;
                }
            } else {
                // For client / mentor users
                if (p.created_by_user_id === user.id) {
                    actionBtnHtml = `<span style="font-size: 0.8rem; color: var(--primary); font-weight: 600; padding: 4px 8px; background: rgba(0, 223, 154, 0.05); border: 1px solid var(--primary)30; border-radius: 4px;">Mon projet</span>`;
                } else {
                    actionBtnHtml = `<span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 500;">Par : ${p.creator_name || 'Inconnu'}</span>`;
                }
            }
        } else {
            actionBtnHtml = `<button type="button" class="btn btn-outline btn-sm btn-auth-trigger">Postuler</button>`;
        }

        article.innerHTML = `
          <div class="project-top">
            <div class="project-company-info">
              <span class="project-company-name">${p.creator_name || `Projet #${p.id}`}</span>
            </div>
            <span class="project-rating">${p.status}</span>
          </div>
          <h3>${p.title}</h3>
          <p>${p.description.length > 150 ? p.description.substring(0, 150) + "..." : p.description}</p>
          <div class="project-meta">
            <span>${p.category}</span><span>·</span><span>${p.level}</span>
          </div>
          <div class="project-stats" style="margin-top: auto; margin-bottom: 4px;">
            <div><strong>${p.application_count || 0}</strong><span>candidatures</span></div>
            <div><strong>${p.level}</strong><span>niveau</span></div>
            <div><strong>${p.budget}</strong><span>budget</span></div>
          </div>
          <div class="project-footer" style="margin-top: 8px;">
            <div class="project-action-wrapper" style="width: 100%; display: flex; justify-content: flex-end;">
              ${actionBtnHtml}
            </div>
          </div>
        `;
        grid.appendChild(article);
    });

    // Bind apply buttons
    grid.querySelectorAll(".btn-apply-now").forEach(btn => {
        btn.addEventListener("click", () => {
            const pId = btn.getAttribute("data-project-id");
            if (window.applyToProject) {
                window.applyToProject(pId).then(() => {
                    // Re-load projects to reflect newly applied status
                    loadAllProjects();
                });
            }
        });
    });

    // Bind auth trigger buttons
    grid.querySelectorAll(".btn-auth-trigger").forEach(btn => {
        btn.addEventListener("click", () => {
            if (window.openModal) {
                window.openModal("login-modal");
            } else {
                alert("Veuillez vous connecter pour postuler.");
            }
        });
    });

    updateProjects();
  }

  async function loadAllProjects() {
    const grid = document.getElementById("projects-grid");
    if (!grid) return;
    grid.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding: 40px; color: var(--text-soft);">Chargement des projets...</div>`;

    try {
        const projects = await window.api.get("/projects/");
        
        let studentAppsMap = {};
        const user = window.currentUser;
        if (user && (user.role.toLowerCase().includes("étudiant") || user.role.toLowerCase().includes("student"))) {
            try {
                const apps = await window.api.get("/applications/me");
                if (apps) {
                    window._studentAppliedProjects = window._studentAppliedProjects || {};
                    apps.forEach(app => {
                        studentAppsMap[app.project_id] = app.status;
                        window._studentAppliedProjects[app.project_id] = app.status;
                    });
                }
            } catch (err) {
                console.error("Failed to load student applications", err);
            }
        }
        
        renderRealProjects(projects, studentAppsMap);
    } catch (err) {
        console.error("Erreur récupération projets", err);
        grid.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding: 40px; color: var(--danger);">Impossible de charger les projets.</div>`;
    }
  }

  // Handle dynamic updates
  document.addEventListener("devearn:session-ready", () => {
      loadAllProjects();
  });

  window.addEventListener("hashchange", () => {
      if (window.location.hash === "#projects") {
          loadAllProjects();
      }
  });

  // Call on load
  if (window.api) {
      loadAllProjects();
  } else {
      updateProjects();
  }
});