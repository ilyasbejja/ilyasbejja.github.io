/**
 * applications.js — Logique pour postuler et voir ses candidatures (Étudiant)
 */

(function () {
  "use strict";

// Track pending application
  let _pendingProjectId = null;

  // In-memory cache: project_id -> status (populated from /applications/me)
  window._studentAppliedProjects = window._studentAppliedProjects || {};

  /**
   * Opens the premium apply modal for a given project.
   * Called from project cards.
   */
  window.applyToProject = function(projectId) {
    const user = window.currentUser;
    if (!user) {
      if (window.openModal) window.openModal("login-modal");
      return Promise.resolve();
    }

    // ── Check if already applied (client-side cache) ──
    const existingStatus = window._studentAppliedProjects[parseInt(projectId)];
    if (existingStatus) {
      if (window.showToast) {
        window.showToast(`Vous avez déjà postulé à ce projet. Statut actuel : ${existingStatus}`, "info", 4000);
      } else {
        alert(`Vous avez déjà postulé à ce projet. Statut : ${existingStatus}`);
      }
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      _pendingProjectId = parseInt(projectId);

      // Reset form
      const motivationEl = document.getElementById("apply-project-motivation");
      const stageEl = document.getElementById("apply-project-stage-opt");
      const projectIdEl = document.getElementById("apply-project-id");

      if (motivationEl) motivationEl.value = "";
      if (stageEl) stageEl.selectedIndex = 0;
      if (projectIdEl) projectIdEl.value = projectId;

      // Open modal
      if (window.openModal) {
        window.openModal("apply-project-modal");
      }

      // The resolve will be called after form submit
      window._applyResolve = resolve;
    });
  };

  // Handle the premium apply form submission
  function initApplyProjectForm() {
    const form = document.getElementById("apply-project-form");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const user = window.currentUser;
      if (!user || !_pendingProjectId) return;

      const motivation = (document.getElementById("apply-project-motivation")?.value || "").trim();
      const stageOption = (document.getElementById("apply-project-stage-opt")?.value || "").trim();
      const submitBtn = form.querySelector("[type='submit']");

      if (!motivation) {
        if (window.showToast) window.showToast("Veuillez écrire un message de motivation.", "error");
        else alert("Veuillez écrire un message de motivation.");
        return;
      }
      if (!stageOption) {
        if (window.showToast) window.showToast("Veuillez indiquer votre souhait concernant une opportunité de stage.", "error");
        else alert("Veuillez indiquer votre souhait concernant une opportunité de stage.");
        return;
      }

      // Build enriched message
      const enrichedMessage = `Motivation : ${motivation}\n---\nOpportunité de stage : ${stageOption}`;

      if (submitBtn) {
        submitBtn.innerHTML = `<span class="btn-spinner"></span> Envoi en cours…`;
        submitBtn.disabled = true;
      }

      try {
        await window.api.post("/applications/", {
          project_id: _pendingProjectId,
          message: enrichedMessage
        });

        // Update client-side cache
        window._studentAppliedProjects[_pendingProjectId] = "En attente";

        // Close modal
        if (window.closeModal) {
          window.closeModal(document.getElementById("apply-project-modal"));
        }

        // Show success toast if available
        if (window.showToast) {
          window.showToast("Candidature envoyée avec succès ! L'entreprise vous recontactera bientôt.", "success", 5000);
        } else {
          alert("Candidature envoyée avec succès !");
        }

        // Resolve the pending promise (triggers refresh in projects.js)
        if (window._applyResolve) {
          window._applyResolve();
          window._applyResolve = null;
        }

        _pendingProjectId = null;

        // Refresh applications list if on my-applications section
        if (window.location.hash === "#my-applications") {
          loadMyApplications();
        }

      } catch (err) {
        if (window.showToast) {
          window.showToast("Erreur: " + err.message, "error");
        } else {
          alert("Erreur: " + err.message);
        }
      } finally {
        if (submitBtn) {
          submitBtn.innerHTML = `Confirmer ma candidature <span class="btn-hero-arrow">→</span>`;
          submitBtn.disabled = false;
        }
      }
    });
  }

  async function loadMyApplications() {
    const tbody = document.getElementById("student-applications-tbody");
    const emptyState = document.getElementById("student-applications-empty");
    if (!tbody) return;

    try {
      const apps = await window.api.get("/applications/me");

      if (!apps || apps.length === 0) {
        if (emptyState) emptyState.style.display = "block";
        tbody.innerHTML = "";
        return;
      }

      if (emptyState) emptyState.style.display = "none";
      tbody.innerHTML = "";

      // ── Populate the client-side applied cache ──
      window._studentAppliedProjects = {};
      apps.forEach(app => {
        window._studentAppliedProjects[app.project_id] = app.status;
      });

      apps.forEach(app => {
        const dateObj = new Date(app.created_at);
        const dateStr = dateObj.toLocaleDateString("fr-FR", { day: '2-digit', month: 'short', year: 'numeric' });

        let statusColor = "var(--text-muted)";
        let statusBg = "rgba(255, 255, 255, 0.05)";

        if (app.status.toLowerCase().includes("attente")) {
          statusColor = "#ffb833";
          statusBg = "rgba(255, 184, 51, 0.15)";
        } else if (app.status.toLowerCase().includes("accept")) {
          statusColor = "var(--primary)";
          statusBg = "rgba(0, 223, 154, 0.15)";
        } else if (app.status.toLowerCase().includes("refus")) {
          statusColor = "var(--danger)";
          statusBg = "rgba(255, 75, 107, 0.15)";
        }

        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td style="padding: 16px;">
            <div style="font-weight: 700; color: var(--text);">${app.project_title}</div>
          </td>
          <td style="padding: 16px; color: var(--text-soft); font-size: 0.9rem;">${app.project_category}</td>
          <td style="padding: 16px; font-weight: 700;">${app.project_budget}</td>
          <td style="padding: 16px; color: var(--text-muted); font-size: 0.85rem;">${dateStr}</td>
          <td style="padding: 16px;">
            <span style="display: inline-block; padding: 4px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: 700; color: ${statusColor}; background: ${statusBg};">
              ${app.status}
            </span>
          </td>
        `;
        tbody.appendChild(tr);
      });

    } catch (err) {
      console.error("Failed to load applications", err);
      tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--danger);">Erreur de chargement.</td></tr>`;
    }
  }

  window.addEventListener("hashchange", () => {
    if (window.location.hash === "#my-applications") {
      loadMyApplications();
    }
  });

  document.addEventListener("devearn:session-ready", () => {
    if (window.location.hash === "#my-applications") {
      loadMyApplications();
    }

    // Initialize the apply form
    initApplyProjectForm();
  });

  document.addEventListener("DOMContentLoaded", () => {
    // Bind form even if session isn't ready yet (modal may exist early)
    initApplyProjectForm();
  });

})();
