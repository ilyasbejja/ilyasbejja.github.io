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

  function resolveMediaUrl(path) {
    if (!path) return null;
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    const base = window.api?.API_BASE_URL || "https://devearn-backend.onrender.com";
    return `${base}${path}`;
  }

  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text ?? "";
    return div.innerHTML;
  }

  function formatBudget(budget) {
    const raw = String(budget ?? "").trim();
    if (!raw) return "Budget sur devis";
    if (/\bmad\b/i.test(raw)) return raw;
    const digits = raw.replace(/[^\d.,]/g, "").replace(",", ".");
    const num = parseFloat(digits);
    if (!Number.isNaN(num) && num >= 1000) {
      if (num >= 1_000_000) {
        const m = num / 1_000_000;
        return `${m % 1 === 0 ? m.toFixed(0) : m.toFixed(1)}M MAD`;
      }
      return `${Math.round(num / 1000)}k MAD`;
    }
    return `${raw} MAD`;
  }

  function formatStatusLabel(status) {
    const s = String(status || "Ouvert").trim();
    if (!s) return "Ouvert";
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  }

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
        article.className = "project-card project-card--premium";

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

        const user = window.currentUser;
        let actionBtnHtml = "";

        if (user) {
            const isStudent = user.role.toLowerCase().includes("étudiant") || user.role.toLowerCase().includes("student");
            if (isStudent) {
                const appliedStatus = studentAppsMap[p.id];
                if (appliedStatus) {
                    let statusClass = "project-status-chip--neutral";
                    if (appliedStatus.toLowerCase().includes("attente")) statusClass = "project-status-chip--pending";
                    else if (appliedStatus.toLowerCase().includes("accept")) statusClass = "project-status-chip--accepted";
                    else if (appliedStatus.toLowerCase().includes("refus")) statusClass = "project-status-chip--refused";
                    actionBtnHtml = `<span class="project-status-chip ${statusClass}">Déjà postulé · ${escapeHtml(appliedStatus)}</span>`;
                } else {
                    actionBtnHtml = `<button type="button" class="btn btn-project-apply btn-apply-now" data-project-id="${p.id}">Postuler →</button>`;
                }
            } else {
                if (p.created_by_user_id === user.id) {
                    actionBtnHtml = `<span class="project-status-chip project-status-chip--owned">Mon projet</span>`;
                } else {
                    actionBtnHtml = `<span class="project-status-chip project-status-chip--neutral">${escapeHtml(p.creator_name || "Entreprise")}</span>`;
                }
            }
        } else {
            actionBtnHtml = `<button type="button" class="btn btn-project-apply btn-auth-trigger">Postuler →</button>`;
        }

        const companyName = escapeHtml(p.creator_name || `Projet #${p.id}`);
        const logoUrl = resolveMediaUrl(p.creator_logo);
        const initials = (p.creator_name || "DE").substring(0, 2).toUpperCase();
        const companyVisual = logoUrl
          ? `<div class="project-company-frame"><img src="${escapeHtml(logoUrl)}" alt="" loading="lazy" /></div>`
          : `<div class="project-company-frame project-company-frame--fallback" aria-hidden="true">${escapeHtml(initials)}</div>`;
        const desc = escapeHtml(
          p.description.length > 140 ? p.description.substring(0, 140) + "…" : p.description
        );
        const budgetLabel = formatBudget(p.budget);
        const statusLabel = formatStatusLabel(p.status);
        const appsHint =
          p.application_count > 0
            ? `<span class="project-card-apps">${p.application_count} candidature${p.application_count > 1 ? "s" : ""}</span>`
            : "";

        article.innerHTML = `
          <div class="project-card-inner">
            <header class="project-top">
              <div class="project-company-info">
                ${companyVisual}
                <span class="project-company-name">${companyName}</span>
              </div>
              <div class="project-top-end">
                <span class="project-card-badge">${escapeHtml(statusLabel)}</span>
                ${appsHint}
              </div>
            </header>
            <h3 class="project-title">${escapeHtml(p.title)}</h3>
            <p class="project-description">${desc}</p>
            <div class="project-meta">
              <span class="project-tag-pill">${escapeHtml(p.category)}</span>
              <span class="project-meta-dot" aria-hidden="true">·</span>
              <span class="project-tag-pill">${escapeHtml(p.level)}</span>
            </div>
            <footer class="project-footer">
              <span class="project-budget">${escapeHtml(budgetLabel)}</span>
              ${actionBtnHtml}
            </footer>
          </div>
        `;
        grid.appendChild(article);
    });

    grid.querySelectorAll(".btn-apply-now").forEach(btn => {
        btn.addEventListener("click", () => {
            const pId = btn.getAttribute("data-project-id");
            if (window.applyToProject) {
                window.applyToProject(pId).then(() => {
                    loadAllProjects();
                });
            }
        });
    });

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

  document.addEventListener("devearn:session-ready", () => {
      loadAllProjects();
  });

  window.addEventListener("hashchange", () => {
      if (window.location.hash === "#projects") {
          loadAllProjects();
      }
  });

  if (window.api) {
      loadAllProjects();
  } else {
      updateProjects();
  }
});
