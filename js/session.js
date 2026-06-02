/**
 * session.js — User Session & Dynamic Navigation Management
 * Handles login state, user menu, role-based navigation, and section gating.
 */

(function () {
  "use strict";

  function parseJwt(token) {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      return JSON.parse(decodeURIComponent(atob(base64).split("").map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)).join("")));
    } catch (e) {
      return null;
    }
  }

  function isTokenExpired(token) {
    const payload = parseJwt(token);
    if (!payload || !payload.exp) return true;
    return payload.exp < (Date.now() / 1000);
  }

  async function fetchCurrentUser() {
    try {
      return await window.api.get("/auth/me");
    } catch (err) {
      window.api.clearToken();
      return null;
    }
  }

  // ─── Role helpers ───
  function isStudentRole(role) {
    if (!role) return false;
    const r = role.toLowerCase();
    return r.includes("étudiant") || r.includes("student");
  }

  function isClientRole(role) {
    if (!role) return false;
    const r = role.toLowerCase();
    return r.includes("client") || r.includes("entreprise");
  }

  function isLaureatRole(role) {
    if (!role) return false;
    const r = role.toLowerCase();
    return r.includes("lauréat") || r.includes("mentor");
  }

  // ─── Sections allowed per role ───
  // Students can see: student-hub, projects, my-applications
  // Clients & Lauréats can see: client-hub, project-applications
  const PUBLIC_SECTIONS = ["accueil", "students", "clients", "dashboard"];

  function getAllowedSections(role) {
    if (isStudentRole(role)) {
      return ["student-hub", "projects", "my-applications"];
    }
    if (isLaureatRole(role)) {
      return ["laureate-hub", "projects"];
    }
    return ["client-hub", "project-applications"];
  }

  function getDefaultSection(role) {
    if (isStudentRole(role)) return "student-hub";
    if (isLaureatRole(role)) return "laureate-hub";
    return "client-hub";
  }

  // ─── Render the user menu in the header ───
  function renderUserMenu(user) {
    const headerActions = document.querySelector(".header-actions");
    if (!headerActions || document.getElementById("user-menu")) return;

    // Hide login/register buttons and links
    const loginBtn = headerActions.querySelector("[data-open-modal='login-modal'], #nav-login-btn, a[href*='login.html']");
    const registerBtn = headerActions.querySelector("[data-open-modal='register-modal'], #nav-register-btn, a[href*='register.html']");
    if (loginBtn) loginBtn.style.display = "none";
    if (registerBtn) registerBtn.style.display = "none";

    const userMenu = document.createElement("div");
    userMenu.id = "user-menu";
    userMenu.style.display = "flex";
    userMenu.style.alignItems = "center";
    userMenu.style.gap = "12px";

    const userInfo = document.createElement("div");
    userInfo.style.display = "flex";
    userInfo.style.flexDirection = "column";
    userInfo.style.alignItems = "flex-end";
    
    const userName = document.createElement("div");
    userName.style.fontWeight = "700";
    userName.style.color = "var(--text)";
    userName.style.fontSize = "0.9rem";
    
    // XP badge ONLY for students — not for Entreprises or Lauréats
    if (isStudentRole(user.role)) {
        const xpPoints = user.xp_points ?? 150;
        userName.innerHTML = `${user.full_name} <span class="header-xp-badge" title="Points d'expérience"><img src="./assets/icons/xp.svg" alt="" class="header-xp-icon" width="14" height="14" />${xpPoints}</span>`;
    } else {
        userName.textContent = user.full_name;
    }
    
    const userRole = document.createElement("span");
    userRole.textContent = user.role;
    userRole.style.fontSize = "0.75rem";
    userRole.style.color = "var(--primary)";
    userRole.style.fontWeight = "600";
    
    userInfo.append(userName, userRole);

    // Avatar
    const avatar = document.createElement("div");
    if (user.profile_picture) {
        avatar.innerHTML = `<img src="${window.api.API_BASE_URL || 'https://devearn-backend.onrender.com'}${user.profile_picture}" style="width:100%; height:100%; object-fit:cover; border-radius:50%;" />`;
    } else {
        avatar.textContent = user.full_name.substring(0, 2).toUpperCase();
    }
    avatar.style.width = "40px";
    avatar.style.height = "40px";
    avatar.style.borderRadius = "50%";
    avatar.style.background = "linear-gradient(135deg, var(--primary), #00b87c)";
    avatar.style.color = "#030305";
    avatar.style.display = "flex";
    avatar.style.alignItems = "center";
    avatar.style.justifyContent = "center";
    avatar.style.fontWeight = "800";
    avatar.style.overflow = "hidden";

    // Profile button
    const profileBtn = document.createElement("button");
    profileBtn.className = "btn btn-outline btn-sm";
    profileBtn.textContent = "Profil";
    profileBtn.onclick = () => {
        const modal = document.getElementById("profile-modal");
        if (modal) {
            document.querySelectorAll(".modal-overlay.is-active").forEach((m) => {
                m.classList.remove("is-active");
                m.setAttribute("aria-hidden", "true");
            });
            modal.classList.add("is-active");
            modal.setAttribute("aria-hidden", "false");
            document.body.style.overflow = "hidden";
        }
    };

    // Inbox (Messagerie) button — visible message icon with red badge
    const inboxBtn = document.createElement("button");
    inboxBtn.className = "btn btn-outline btn-sm";
    inboxBtn.id = "header-inbox-btn";
    inboxBtn.style.cssText = "position: relative; display: flex; align-items: center; gap: 8px; padding: 8px 14px; border-radius: 20px; font-weight: 600;";
    inboxBtn.innerHTML = `
      <img src="./assets/icons/messages-2-svgrepo-com.svg" style="width: 16px; height: 16px; filter: invert(1); display: inline-block; vertical-align: middle;" alt="" />
      <span style="font-size: 0.85rem;">Messagerie</span>
      <span id="inbox-notification-badge"
        style="display:none; position:absolute; top:-5px; right:-5px; background: var(--danger);
               color: white; border-radius: 50%; min-width: 18px; height: 18px;
               font-size: 0.68rem; display: flex; align-items:center; justify-content:center;
               font-weight: 900; padding: 0 3px; border: 2px solid var(--bg-card, #0d0d12);">0</span>
    `;
    inboxBtn.onclick = () => {
        openInboxModal();
    };

    // Logout button
    const logoutBtn = document.createElement("button");
    logoutBtn.className = "btn btn-ghost";
    logoutBtn.textContent = "Déconnexion";
    logoutBtn.onclick = () => {
      window.api.clearToken();
      document.body.classList.remove("is-logged-in");
      window.location.hash = "";
      window.location.reload();
    };

    userMenu.append(userInfo, avatar, profileBtn, inboxBtn, logoutBtn);
    headerActions.appendChild(userMenu);
  }

  async function openInboxModal() {
      if (window.openModal) {
          window.openModal("inbox-modal");
      }
      
      const container = document.getElementById("inbox-threads-list");
      if (!container) return;
      container.innerHTML = `<div style="text-align:center; padding:30px; color:var(--text-soft);">Chargement des conversations...</div>`;
      
      try {
          const threads = await window.api.get("/messages/threads");
          if (!threads || threads.length === 0) {
              container.innerHTML = `
                  <div style="text-align:center; padding:50px 20px; color:var(--text-muted);">
                      <div style="margin-bottom:16px;"><img src="./assets/icons/messages-2-svgrepo-com.svg" style="width: 48px; height: 48px; filter: opacity(0.3) invert(1);" alt="" /></div>
                      Aucune conversation active pour le moment.<br>
                      <span style="font-size:0.85rem; color:var(--text-soft);">Les conversations débutent automatiquement lorsqu'une candidature est validée !</span>
                  </div>
              `;
              return;
          }
          
          container.innerHTML = "";
          threads.forEach(t => {
              const div = document.createElement("div");
              div.style.padding = "16px";
              div.style.background = "rgba(255,255,255,0.03)";
              div.style.border = "1px solid var(--border)";
              div.style.borderRadius = "var(--radius-md)";
              div.style.marginBottom = "10px";
              div.style.display = "flex";
              div.style.alignItems = "center";
              div.style.gap = "14px";
              div.style.cursor = "pointer";
              div.style.transition = "all 0.2s";
              
              div.onmouseover = () => {
                  div.style.background = "rgba(255,255,255,0.07)";
                  div.style.borderColor = "var(--primary)";
              };
              div.onmouseout = () => {
                  div.style.background = "rgba(255,255,255,0.03)";
                  div.style.borderColor = "var(--border)";
              };
              
              // Avatar
              let avatarHtml = "";
              if (t.other_user_avatar) {
                  avatarHtml = `<img src="${window.api.API_BASE_URL || 'https://devearn-backend.onrender.com'}${t.other_user_avatar}" style="width:100%; height:100%; object-fit:cover; border-radius:50%;" />`;
              } else {
                  avatarHtml = t.other_user_name.substring(0, 2).toUpperCase();
              }
              
              const timeStr = new Date(t.last_message_time).toLocaleDateString("fr-FR", { day: '2-digit', month: 'short' }) + " à " + new Date(t.last_message_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              
              div.innerHTML = `
                  <div style="width:42px; height:42px; border-radius:50%; background:linear-gradient(135deg, var(--primary), #00b87c); color:#030305; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:0.95rem; overflow:hidden; flex-shrink:0;">
                      ${avatarHtml}
                  </div>
                  <div style="flex:1; min-width:0;">
                      <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:4px; gap:8px;">
                          <strong style="color:var(--text); font-size:0.95rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${t.other_user_name}</strong>
                          <span style="font-size:0.75rem; color:var(--text-muted); flex-shrink:0;">${timeStr}</span>
                      </div>
                      <div style="color:var(--primary); font-size:0.8rem; font-weight:600; margin-bottom:3px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">Projet: ${t.project_title}</div>
                      <div style="color:var(--text-soft); font-size:0.85rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${t.last_message}</div>
                  </div>
              `;
              
              div.onclick = () => {
                  // Close inbox modal
                  if (window.closeModal) {
                      window.closeModal(document.getElementById("inbox-modal"));
                  }
                  // Open chat directly
                  if (window.openChat) {
                      window.openChat(t.project_id, t.other_user_id, t.other_user_name, t.project_title);
                  }
              };
              
              container.appendChild(div);
          });
          
      } catch (err) {
          console.error("Failed to load threads", err);
          container.innerHTML = `<div style="text-align:center; padding:30px; color:var(--danger);">Erreur lors de la récupération de vos messages.</div>`;
      }
  }

  async function checkNewMessages() {
      const token = window.api.getToken();
      if (!token) return;
      
      try {
          const threads = await window.api.get("/messages/threads");
          if (!threads || threads.length === 0) {
            const badge = document.getElementById("inbox-notification-badge");
            const studentBadge = document.getElementById("student-msg-badge");
            if (badge) badge.style.display = "none";
            if (studentBadge) studentBadge.style.display = "none";
            return;
          }
          
          let unreadCount = 0;
          
          threads.forEach(t => {
              const threadViewedTime = localStorage.getItem(`devearn_last_viewed_chat_${t.project_id}_${t.other_user_id}`) || "";
              if (t.last_message_time > threadViewedTime) {
                  unreadCount++;
              }
          });
          
          const badge = document.getElementById("inbox-notification-badge");
          const studentBadge = document.getElementById("student-msg-badge");

          if (badge) {
              if (unreadCount > 0) {
                  badge.textContent = unreadCount > 9 ? "9+" : String(unreadCount);
                  badge.style.display = "flex";
              } else {
                  badge.style.display = "none";
              }
          }

          if (studentBadge) {
              if (unreadCount > 0) {
                  studentBadge.textContent = unreadCount > 9 ? "9+" : String(unreadCount);
                  studentBadge.style.display = "flex";
              } else {
                  studentBadge.style.display = "none";
              }
          }
          
      } catch (err) {
          // Silent catch
      }
  }
  window.checkNewMessages = checkNewMessages;

  // ─── Build role-based navigation ───
  function buildDynamicNavigation(user) {
    const navList = document.querySelector(".nav-list");
    if (!navList) return;
    
    navList.innerHTML = ""; // Clear public nav

    let links = [];

    if (isStudentRole(user.role)) {
      links = [
        { name: "Mon Hub", hash: "student-hub" },
        { name: "Projets disponibles", hash: "projects" },
        { name: "Mes Candidatures", hash: "my-applications" }
      ];
    } else if (isLaureatRole(user.role)) {
      links = [
        { name: "Mon Dashboard", hash: "laureate-hub" },
        { name: "Projets disponibles", hash: "projects" },
        { name: "Proposer un Projet", hash: "laureate-hub", modal: "post-project-modal" }
      ];
    } else {
      links = [
        { name: "Mon Dashboard", hash: "client-hub" },
        { name: "Publier un Projet", hash: "client-hub", modal: "post-project-modal" }
      ];
    }

    links.forEach(linkDef => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      if (linkDef.modal) {
        a.href = "#";
        a.setAttribute("data-open-modal", linkDef.modal);
      } else {
        a.href = `#${linkDef.hash}`;
        a.setAttribute("data-nav-to", linkDef.hash);
      }
      a.textContent = linkDef.name;
      li.appendChild(a);
      navList.appendChild(li);
    });

    // Re-bind SPA links logic for the newly created elements
    if (window.bindSPALinks) window.bindSPALinks(navList);
    if (window.bindModalTriggers) window.bindModalTriggers(navList);
  }

  // ─── Gate navigation: redirect away from unauthorized sections (no flash on valid sections) ───
  function gateNavigation(user) {
    const currentHash = (window.location.hash || "").replace("#", "");
    const allowed = getAllowedSections(user.role);
    const defaultSection = getDefaultSection(user.role);

    // If on empty hash (first load), set to default section
    if (!currentHash) {
      window.location.hash = defaultSection;
      return;
    }

    // If on a section not allowed for their role, redirect
    if (!PUBLIC_SECTIONS.includes(currentHash) && !allowed.includes(currentHash)) {
      window.location.hash = defaultSection;
      return;
    }
    
    // DON'T redirect if already on a valid section - prevents flash on every click
  }

  // ─── Main session check ───
  async function checkSession() {
    const token = window.api.getToken();
    if (!token || isTokenExpired(token)) {
      window.api.clearToken();
      if (!window.location.hash) window.location.hash = "accueil";
      return;
    }

    const user = await fetchCurrentUser();
    if (user) {
      document.body.classList.add("is-logged-in");
      window.currentUser = user;
      renderUserMenu(user);
      buildDynamicNavigation(user);
      
      // Check if email verification is required
      if (!user.is_verified) {
        // Force email verification modal
        if (window.openModal) {
          window.openModal("verify-email-modal");
          const emailInput = document.getElementById("verify-email-input");
          if (emailInput) emailInput.value = user.email;
          const codeInput = document.getElementById("verify-code");
          if (codeInput) codeInput.focus();
        }
        return;
      }
      
      gateNavigation(user);

      // Also gate on future hash changes
      window.addEventListener("hashchange", () => gateNavigation(user));

      // Dispatch an event so other scripts know session is ready
      document.dispatchEvent(new CustomEvent("devearn:session-ready", { detail: { user } }));

      // Start polling for new messages every 10 seconds
      checkNewMessages(); // immediate first check (no delay)
      setInterval(checkNewMessages, 10000);
    }
  }

  document.addEventListener("DOMContentLoaded", checkSession);

  window.checkSession = checkSession;
})();
