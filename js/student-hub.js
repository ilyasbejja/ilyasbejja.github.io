/**
 * student-hub.js — Complete Student Dashboard Experience
 * Shows: welcome, profile completeness, skills, XP, inbox preview
 */

(function () {
  "use strict";

  async function loadStudentHub() {
    const user = window.currentUser;
    if (!user) return;

    const role = user.role ? user.role.toLowerCase() : "";
    if (!role.includes("étudiant") && !role.includes("student")) return;

    // ── Welcome message ──
    const welcomeMsg = document.getElementById("student-welcome-msg");
    if (welcomeMsg) welcomeMsg.textContent = `Bonjour, ${user.full_name}`;

    // ── KPI Stats ──
    try {
      const applications = await window.api.get("/applications/me");
      const kpiApplied = document.getElementById("student-kpi-applied");
      const kpiActive = document.getElementById("student-kpi-active");
      const kpiXp = document.getElementById("student-kpi-xp");

      if (kpiApplied) kpiApplied.textContent = applications.length;

      let activeMissions = 0;
      applications.forEach(app => {
          if (app.status === "Acceptée") activeMissions++;
      });
      if (kpiActive) kpiActive.textContent = activeMissions;

      // XP = 50 per application + 100 per accepted
      const xpPoints = user.xp_points || (applications.length * 50 + activeMissions * 100);
      if (kpiXp) kpiXp.textContent = `${xpPoints} XP`;

    } catch (err) {
      console.error("Failed to fetch student stats", err);
    }

    // ── Profile Completeness Card ──
    renderProfileCard(user);

    // ── Inbox Preview ──
    loadInboxPreview();
  }

  function renderProfileCard(user) {
    const container = document.getElementById("student-profile-card");
    if (!container) return;

    // Calculate profile completion
    let completed = 0;
    const total = 6;
    if (user.full_name) completed++;
    if (user.email) completed++;
    if (user.bio) completed++;
    if (user.skills_tags) completed++;
    if (user.education_level) completed++;
    if (user.institution) completed++;

    const pct = Math.round((completed / total) * 100);
    const skillsArr = user.skills_tags ? user.skills_tags.split(",").map(s => s.trim()).filter(Boolean) : [];

    // Avatar HTML
    let avatarHtml = "";
    if (user.profile_picture) {
      const baseUrl = window.api.API_BASE_URL || "http://127.0.0.1:8001";
      avatarHtml = `<img src="${baseUrl}${user.profile_picture}" style="width:100%; height:100%; object-fit:cover; border-radius:50%;" />`;
    } else {
      avatarHtml = `<span style="font-size: 1.8rem; font-weight: 800; color: #030305;">${user.full_name.substring(0, 2).toUpperCase()}</span>`;
    }

    container.innerHTML = `
      <!-- Avatar & Name -->
      <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 24px;">
        <div style="width: 72px; height: 72px; border-radius: 50%; background: linear-gradient(135deg, var(--primary), #00b87c); display: flex; align-items: center; justify-content: center; overflow: hidden; flex-shrink: 0;">
          ${avatarHtml}
        </div>
        <div>
          <h3 style="margin: 0; font-size: 1.2rem; font-weight: 800;">${user.full_name}</h3>
          <div style="font-size: 0.85rem; color: var(--primary); font-weight: 600; margin-top: 2px;">${user.specialty || user.role || "Étudiant IT"}</div>
          <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 2px;">${user.institution || ""} ${user.education_level ? "· " + user.education_level : ""}</div>
        </div>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
        <span style="font-size: 0.85rem; font-weight: 600; color: var(--text-soft);">Complétion du profil</span>
        <span style="font-size: 1.1rem; font-weight: 800; color: ${pct === 100 ? 'var(--primary)' : 'var(--text)'};">${pct}%</span>
      </div>
      
      <div class="profile-complete-bar" style="margin-bottom: 20px;">
        <span style="width: ${pct}%;"></span>
      </div>

      <div style="margin-bottom: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
          <div style="font-weight: 600; color: var(--text); font-size: 0.92rem;">Compétences</div>
          <button type="button" class="btn btn-outline btn-sm" id="btn-add-skills" style="font-size: 0.78rem; padding: 4px 14px;">
            + Ajouter
          </button>
        </div>
        <div id="skills-tag-cloud">
          ${skillsArr.length > 0 
            ? skillsArr.map(s => `<span class="skill-tag">${s}</span>`).join("") 
            : '<span style="color: var(--text-muted); font-size: 0.85rem;">Aucune compétence — cliquez sur "+ Ajouter"</span>'
          }
        </div>
      </div>

      <div style="display: flex; gap: 10px; flex-wrap: wrap; padding-top: 16px; border-top: 1px solid var(--border);">
        <button type="button" class="btn btn-outline btn-sm" id="btn-edit-profile" style="font-size: 0.82rem;">
          ✏️ Modifier mon profil
        </button>
        ${user.cv_url 
          ? `<a href="${user.cv_url}" target="_blank" class="btn btn-outline btn-sm" style="font-size: 0.82rem; text-decoration: none;">📄 Voir mon CV</a>` 
          : `<button type="button" class="btn btn-outline btn-sm" id="btn-add-cv" style="font-size: 0.82rem;">📄 Ajouter mon CV</button>`
        }
        ${user.github_url ? `<a href="${user.github_url}" target="_blank" class="btn btn-outline btn-sm" style="font-size: 0.82rem; text-decoration: none;">💻 GitHub</a>` : ""}
      </div>
    `;

    // Bind buttons
    const addSkillsBtn = document.getElementById("btn-add-skills");
    const editProfileBtn = document.getElementById("btn-edit-profile");
    const addCvBtn = document.getElementById("btn-add-cv");

    const openProfileModal = () => {
      if (window.openModal) window.openModal("profile-modal");
    };

    if (addSkillsBtn) addSkillsBtn.addEventListener("click", () => {
      openProfileModal();
      setTimeout(() => {
        const skillsInput = document.getElementById("modal-profile-skills");
        if (skillsInput) skillsInput.focus();
      }, 200);
    });

    if (editProfileBtn) editProfileBtn.addEventListener("click", openProfileModal);
    if (addCvBtn) addCvBtn.addEventListener("click", () => {
      openProfileModal();
      setTimeout(() => {
        const cvInput = document.getElementById("modal-profile-cv");
        if (cvInput) cvInput.focus();
      }, 200);
    });
  }

  async function loadInboxPreview() {
    const container = document.getElementById("student-inbox-preview");
    const badge = document.getElementById("student-msg-badge");
    if (!container) return;

    try {
      const threads = await window.api.get("/messages/threads");

      // Update global notification badge too
      const globalBadge = document.getElementById("inbox-notification-badge");

      if (!threads || threads.length === 0) {
        container.innerHTML = `
          <div style="text-align:center; padding: 30px 10px; color: var(--text-muted);">
            <div style="margin-bottom: 8px;">
              <img src="./assets/icons/messages-2-svgrepo-com.svg" style="height: 28px; width: 28px; opacity: 0.5; filter: invert(1);" alt="" />
            </div>
            <div style="font-size: 0.88rem;">Aucune conversation active.</div>
            <div style="font-size: 0.78rem; color: var(--text-soft); margin-top: 6px;">Les conversations débutent lorsqu'une candidature est acceptée.</div>
          </div>
        `;
        if (badge) badge.style.display = "none";
        if (globalBadge) globalBadge.style.display = "none";
        return;
      }

      // Check for unread messages
      let hasUnread = false;
      threads.forEach(t => {
        const lastViewed = localStorage.getItem(`devearn_last_viewed_chat_${t.project_id}_${t.other_user_id}`) || "";
        if (t.last_message_time > lastViewed) hasUnread = true;
      });

      if (badge) badge.style.display = hasUnread ? "flex" : "none";
      if (globalBadge) globalBadge.style.display = hasUnread ? "flex" : "none";

      // Show up to 3 threads preview
      container.innerHTML = "";
      const previewThreads = threads.slice(0, 3);

      previewThreads.forEach(t => {
        const div = document.createElement("div");
        const isUnread = t.last_message_time > (localStorage.getItem(`devearn_last_viewed_chat_${t.project_id}_${t.other_user_id}`) || "");

        div.style.cssText = `
          display: flex; align-items: center; gap: 12px;
          padding: 14px 16px;
          background: rgba(255,255,255,${isUnread ? '0.06' : '0.02'});
          border: 1px solid ${isUnread ? 'var(--primary)' : 'var(--border)'};
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all 0.2s;
        `;

        div.onmouseover = () => div.style.background = "rgba(255,255,255,0.08)";
        div.onmouseout = () => div.style.background = `rgba(255,255,255,${isUnread ? '0.06' : '0.02'})`;

        const timeStr = new Date(t.last_message_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const avatarText = t.other_user_name.substring(0, 2).toUpperCase();

        div.innerHTML = `
          <div style="width: 38px; height: 38px; border-radius: 50%; background: linear-gradient(135deg, #4dabf7, #2188d8); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.85rem; flex-shrink: 0;">
            ${avatarText}
          </div>
          <div style="flex: 1; min-width: 0;">
            <div style="display: flex; justify-content: space-between; align-items: baseline; gap: 8px;">
              <strong style="color: var(--text); font-size: 0.9rem; ${isUnread ? 'color: var(--primary)' : ''};">${t.other_user_name}</strong>
              <span style="font-size: 0.72rem; color: var(--text-muted); flex-shrink: 0;">${timeStr}</span>
            </div>
            <div style="font-size: 0.78rem; color: var(--primary); font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${t.project_title}</div>
            <div style="font-size: 0.82rem; color: var(--text-soft); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; ${isUnread ? 'font-weight: 600;' : ''}">${t.last_message}</div>
          </div>
          ${isUnread ? '<span style="width: 8px; height: 8px; background: var(--primary); border-radius: 50%; flex-shrink: 0;"></span>' : ''}
        `;

        div.onclick = () => {
          if (window.openChat) {
            // Mark as read
            localStorage.setItem(`devearn_last_viewed_chat_${t.project_id}_${t.other_user_id}`, new Date().toISOString());
            window.openChat(t.project_id, t.other_user_id, t.other_user_name, t.project_title);
          }
        };

        container.appendChild(div);
      });

      if (threads.length > 3) {
        const moreDiv = document.createElement("div");
        moreDiv.style.cssText = "text-align: center; font-size: 0.82rem; color: var(--text-muted); padding: 8px;";
        moreDiv.textContent = `+${threads.length - 3} autre(s) conversation(s)`;
        container.appendChild(moreDiv);
      }

    } catch (err) {
      console.error("Failed to load inbox preview", err);
      if (container) {
        container.innerHTML = `<div style="text-align:center; padding: 20px; color: var(--text-muted); font-size: 0.85rem;">Impossible de charger les messages.</div>`;
      }
    }
  }

  // Listen for the custom session event
  document.addEventListener("devearn:session-ready", (e) => {
    if (window.location.hash === "#student-hub") {
        loadStudentHub();
    }
  });

  window.addEventListener("hashchange", () => {
    if (window.location.hash === "#student-hub") {
      loadStudentHub();
    }
  });

})();
