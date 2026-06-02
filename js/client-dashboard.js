/**
 * client-dashboard.js
 * Handles the logic for the private client dashboard.
 */

(function () {
  "use strict";

  async function loadClientDashboard() {
    const tableBody = document.getElementById("client-projects-table-body");
    const emptyState = document.getElementById("client-projects-empty");
    
    // KPIs
    const kpiActive = document.getElementById("client-kpi-active");
    const kpiApps = document.getElementById("client-kpi-apps");
    const kpiBudget = document.getElementById("client-kpi-budget");
    const kpiCompleted = document.getElementById("client-kpi-completed");
    
    const welcomeMsg = document.getElementById("client-welcome-msg");
    const user = window.currentUser;
    if (welcomeMsg && user) welcomeMsg.textContent = `Bienvenue sur votre espace, ${user.full_name}`;

    try {
      // 1. Fetch Stats
      const stats = await window.api.get("/projects/stats");
      if (kpiActive) kpiActive.textContent = stats.active_projects;
      if (kpiApps) kpiApps.textContent = stats.total_applications;
      if (kpiBudget) kpiBudget.textContent = stats.total_budget.toLocaleString("fr-FR") + " MAD";
      if (kpiCompleted) kpiCompleted.textContent = stats.completed_projects;

      // 2. Fetch Projects List
      const projects = await window.api.get("/projects/me");

      if (!projects || projects.length === 0) {
        if(emptyState) emptyState.style.display = "block";
        if(tableBody) tableBody.innerHTML = "";
        return;
      }

      if(emptyState) emptyState.style.display = "none";
      if(tableBody) tableBody.innerHTML = "";

      projects.forEach((proj) => {
        const dateObj = new Date(proj.created_at);
        const dateStr = dateObj.toLocaleDateString("fr-FR", { day: '2-digit', month: 'short', year: 'numeric' });

        let statusColor = "var(--text-muted)";
        let statusBg = "rgba(255, 255, 255, 0.05)";
        
        if (proj.status.toLowerCase().includes("attente")) {
          statusColor = "#ffb833";
          statusBg = "rgba(255, 184, 51, 0.15)";
        } else if (proj.status.toLowerCase().includes("cours")) {
          statusColor = "#4dabf7";
          statusBg = "rgba(77, 171, 247, 0.15)";
        } else if (proj.status.toLowerCase().includes("termin")) {
          statusColor = "var(--primary)";
          statusBg = "rgba(0, 223, 154, 0.15)";
        }

        const tr = document.createElement("tr");
        tr.style.borderBottom = "1px solid var(--border)";
        
        tr.innerHTML = `
          <td style="padding: 16px;">
            <div style="font-weight: 700; color: var(--text);">${proj.title}</div>
            <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 4px;">ID: #${proj.id}</div>
          </td>
          <td style="padding: 16px; color: var(--text-soft); font-size: 0.9rem;">${proj.category}</td>
          <td style="padding: 16px; font-weight: 700;">${proj.budget}</td>
          <td style="padding: 16px; color: var(--text-muted); font-size: 0.85rem;">${dateStr}</td>
          <td style="padding: 16px;">
            <span style="display: inline-block; padding: 4px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: 700; color: ${statusColor}; background: ${statusBg};">
              ${proj.status}
            </span>
          </td>
          <td style="padding: 16px;">
            <button class="btn btn-outline btn-sm view-apps-btn" data-project-id="${proj.id}" data-project-title="${proj.title}">Voir candidats</button>
          </td>
        `;
        if(tableBody) tableBody.appendChild(tr);
      });

      // Bind view apps buttons
      if(tableBody) {
        tableBody.querySelectorAll(".view-apps-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const pId = btn.getAttribute("data-project-id");
                const pTitle = btn.getAttribute("data-project-title");
                window.viewProjectApplications(pId, pTitle);
            });
        });
      }

    } catch (err) {
      console.error("Erreur de chargement du dashboard client", err);
      if(tableBody) tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--danger); padding: 20px;">Impossible de charger les données.</td></tr>`;
    }
  }

  window.viewProjectApplications = async function(projectId, projectTitle) {
      // Open modal
      if (window.openModal) {
          window.openModal("project-applications-modal");
      }
      
      const titleEl = document.getElementById("pam-project-title");
      if(titleEl) titleEl.textContent = `Candidatures : ${projectTitle}`;

      const tbody = document.getElementById("pam-tbody");
      const emptyState = document.getElementById("pam-empty-state");
      
      if (!tbody) return;
      tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 20px; color: var(--text-soft);">Chargement...</td></tr>`;

      try {
          const apps = await window.api.get(`/applications/project/${projectId}`);
          
          if (!apps || apps.length === 0) {
              if (emptyState) emptyState.style.display = "block";
              tbody.innerHTML = "";
              return;
          }

          if (emptyState) emptyState.style.display = "none";
          tbody.innerHTML = "";

          apps.forEach(app => {
              const dateObj = new Date(app.created_at);
              const dateStr = dateObj.toLocaleDateString("fr-FR", { day: '2-digit', month: 'short', year: 'numeric' });

              let statusColor = "var(--text-muted)";
              let statusBg = "rgba(255, 255, 255, 0.05)";
              if (app.status === "Acceptée") { statusColor = "var(--primary)"; statusBg = "rgba(0,223,154,0.15)"; }
              else if (app.status === "Refusée") { statusColor = "var(--danger)"; statusBg = "rgba(255,75,107,0.15)"; }
              else if (app.status === "En attente") { statusColor = "#ffb833"; statusBg = "rgba(255,184,51,0.15)"; }

              const tr = document.createElement("tr");
              tr.style.borderBottom = "1px solid var(--border)";
              
              // Parse motivation and stage from enriched message
              let motivationDisplay = app.message || "-";
              let stageDisplay = "";
              if (app.message && app.message.includes("---")) {
                const parts = app.message.split("---");
                motivationDisplay = parts[0].replace("Motivation :", "").trim();
                stageDisplay = parts[1] ? parts[1].replace("Opportunité de stage :", "").trim() : "";
              }

              tr.innerHTML = `
                  <td style="padding: 16px;">
                      <div style="font-weight: 700; color: var(--text);">${app.applicant_name}</div>
                  </td>
                  <td style="padding: 16px; color: var(--text-soft); font-size: 0.9rem;">${app.applicant_email}</td>
                  <td style="padding: 16px; color: var(--text-muted); font-size: 0.85rem;">${dateStr}</td>
                  <td style="padding: 16px; color: var(--text-soft); font-size: 0.88rem; max-width: 220px;">
                      <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${motivationDisplay}">${motivationDisplay || "-"}</div>
                      ${stageDisplay ? `<div style="font-size: 0.75rem; color: var(--primary); margin-top: 4px; font-weight: 600;">Stage: ${stageDisplay}</div>` : ""}
                  </td>
                  <td style="padding: 16px;">
                      <span class="status-badge" style="display: inline-block; padding: 4px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: 700; color: ${statusColor}; background: ${statusBg};">
                        ${app.status}
                      </span>
                  </td>
                  <td style="padding: 16px; display: flex; gap: 6px; flex-wrap: wrap; align-items: center;">
                      <button class="btn btn-sm btn-outline btn-view-profile" data-user-id="${app.user_id}" style="padding: 5px 10px; font-size: 0.78rem;">Profil</button>
                      <button class="btn btn-sm btn-chat" data-user-id="${app.user_id}" data-project-id="${app.project_id}" data-project-title="${projectTitle}" data-user-name="${app.applicant_name}" style="background: #4dabf7; color: #030305; border: none; padding: 5px 10px; border-radius: 4px; font-weight: 600; cursor: pointer; font-size: 0.78rem;">Contacter</button>
                      ${app.status === 'En attente' ? `
                          <button class="btn btn-sm btn-accept" data-id="${app.id}" style="background: var(--primary); color: #030305; border: none; padding: 5px 10px; border-radius: 4px; font-weight: 600; cursor: pointer; font-size: 0.78rem;">✓ Accepter</button>
                          <button class="btn btn-sm btn-reject" data-id="${app.id}" style="background: rgba(255, 75, 107, 0.1); color: var(--danger); border: 1px solid var(--danger); padding: 5px 10px; border-radius: 4px; font-weight: 600; cursor: pointer; font-size: 0.78rem;">✕ Refuser</button>
                      ` : ""}
                  </td>
              `;
              tbody.appendChild(tr);
          });

          // Bind accept/reject buttons
          tbody.querySelectorAll(".btn-accept").forEach(btn => {
              btn.addEventListener("click", () => updateAppStatus(btn.dataset.id, "Acceptée", projectId, projectTitle));
          });
          tbody.querySelectorAll(".btn-reject").forEach(btn => {
              btn.addEventListener("click", () => updateAppStatus(btn.dataset.id, "Refusée", projectId, projectTitle));
          });
          
          // Bind profile and chat buttons
          tbody.querySelectorAll(".btn-view-profile").forEach(btn => {
              btn.addEventListener("click", () => {
                  if (window.openStudentPublicProfile) window.openStudentPublicProfile(btn.dataset.userId);
              });
          });
          tbody.querySelectorAll(".btn-chat").forEach(btn => {
              btn.addEventListener("click", () => {
                  if (window.openChat) window.openChat(btn.dataset.projectId, btn.dataset.userId, btn.dataset.userName, btn.dataset.projectTitle);
              });
          });

      } catch (err) {
          console.error("Failed to load project applications", err);
          tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--danger); padding: 20px;">Erreur de chargement.</td></tr>`;
      }
  };

  async function updateAppStatus(appId, newStatus, projectId, projectTitle) {
      if (!confirm(`Voulez-vous marquer cette candidature comme ${newStatus} ?`)) return;
      try {
          await window.api.fetch(`/applications/${appId}/status?new_status=${newStatus}`, { method: 'PATCH' });
          if (window.showToast) {
              window.showToast("Statut mis à jour !", "success", 4000);
          } else {
              alert("Statut mis à jour !");
          }
          window.viewProjectApplications(projectId, projectTitle); // refresh list
      } catch (err) {
          if (window.showToast) {
              window.showToast("Erreur : " + err.message, "error", 5000);
          } else {
              alert("Erreur : " + err.message);
          }
      }
  }

  // Hook into the SPA navigation logic
  window.addEventListener("hashchange", () => {
    if (window.location.hash === "#client-hub") {
      loadClientDashboard();
    }
  });

  document.addEventListener("devearn:session-ready", (e) => {
    if (window.location.hash === "#client-hub") {
        loadClientDashboard();
    }
    
    // Also listen for when navigating to client-hub from post-project
    window.addEventListener("hashchange", () => {
        if (window.location.hash === "#client-hub") {
            loadClientDashboard();
        }
    });
  });

})();
