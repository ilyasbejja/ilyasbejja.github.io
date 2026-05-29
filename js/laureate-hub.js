/**
 * laureate-hub.js — Laureate / Mentor Dashboard Logic
 */

(function () {
    "use strict";
  
    // Check if user is Laureate
    function isLaureatRole(role) {
      if (!role) return false;
      const r = role.toLowerCase();
      return r.includes("lauréat") || r.includes("mentor");
    }
  
    async function loadLaureateDashboard(user) {
      if (!isLaureatRole(user.role)) return;
  
      const welcomeMsg = document.getElementById("laureate-welcome-msg");
      if (welcomeMsg) {
        welcomeMsg.innerHTML = `Bienvenue, <span style="color:var(--primary);">${user.full_name}</span>`;
      }
  
      // Load their projects / mentorships
      try {
        const projects = await window.api.fetch("/projects/me");
        
        const tbody = document.getElementById("laureate-projects-tbody");
        const emptyState = document.getElementById("laureate-projects-empty");
        const kpiActive = document.getElementById("laureate-kpi-active");
        
        if (!tbody) return;
  
        tbody.innerHTML = "";
  
        if (projects.length === 0) {
          if (emptyState) emptyState.style.display = "block";
          if (kpiActive) kpiActive.textContent = "0";
        } else {
          if (emptyState) emptyState.style.display = "none";
          if (kpiActive) kpiActive.textContent = projects.length;
  
          projects.forEach(p => {
            const tr = document.createElement("tr");
            const dateStr = new Date(p.created_at).toLocaleDateString("fr-FR");
            
            let statusBadge = "";
            if (p.status === "Ouvert") statusBadge = `<span class="status-badge status-open">Ouvert</span>`;
            else if (p.status === "En cours") statusBadge = `<span class="status-badge status-progress">En cours</span>`;
            else statusBadge = `<span class="status-badge status-closed">${p.status}</span>`;
  
            tr.innerHTML = `
              <td><strong>${p.title}</strong></td>
              <td><span class="category-tag">${p.category}</span></td>
              <td>${dateStr}</td>
              <td>${statusBadge}</td>
              <td>
                <button class="btn btn-outline btn-sm view-apps-btn" data-id="${p.id}">
                  Voir candidatures
                </button>
              </td>
            `;
            tbody.appendChild(tr);
          });
  
          // Bind applications view
          tbody.querySelectorAll(".view-apps-btn").forEach(btn => {
            btn.addEventListener("click", () => {
              const projectId = btn.dataset.id;
              // Re-use the client project application view logic
              if (window.loadProjectApplications) {
                window.loadProjectApplications(projectId);
              }
            });
          });
        }
  
        // Mock impact score and applications for now since we don't have dedicated endpoints for these laureate specific stats yet
        const kpiApps = document.getElementById("laureate-kpi-apps");
        const kpiXp = document.getElementById("laureate-kpi-xp");
        
        if (kpiApps) {
            let totalApps = 0;
            // Fetch all apps for their projects
            for (const p of projects) {
                try {
                    const apps = await window.api.fetch(`/applications/project/${p.id}`);
                    totalApps += apps.length;
                } catch(e) {}
            }
            kpiApps.textContent = totalApps;
        }

        if (kpiXp) {
            kpiXp.textContent = (user.xp_points || 0) + " XP";
        }
  
      } catch (err) {
        console.error("Failed to load laureate dashboard:", err);
      }
    }
  
    document.addEventListener("devearn:session-ready", (e) => {
      const user = e.detail.user;
      if (isLaureatRole(user.role)) {
        loadLaureateDashboard(user);
      }
    });
  
    // Also load on hash change if it's the laureate hub
    window.addEventListener("hashchange", () => {
      const hash = window.location.hash.replace("#", "");
      if (hash === "laureate-hub" && window.currentUser) {
        loadLaureateDashboard(window.currentUser);
      }
    });
  
  })();
