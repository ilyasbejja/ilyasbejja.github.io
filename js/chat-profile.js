/**
 * chat-profile.js
 * Handles the logic for viewing public student profiles and the real-time chat interface.
 */

(function () {
  "use strict";

  // --- Student Public Profile ---
  window.openStudentPublicProfile = async function(userId) {
    const modal = document.getElementById("student-public-profile-modal");
    if (!modal) return;
    
    // reset contents
    document.getElementById("spp-avatar").innerHTML = "Chargement...";
    document.getElementById("spp-name").textContent = "Chargement...";
    document.getElementById("spp-specialty").textContent = "";
    document.getElementById("spp-xp").textContent = "0 XP";
    document.getElementById("spp-education").textContent = "";
    document.getElementById("spp-bio").textContent = "Chargement...";
    document.getElementById("spp-skills").innerHTML = "";
    
    const projectsContainer = document.getElementById("spp-completed-projects");
    if (projectsContainer) {
        projectsContainer.innerHTML = "Chargement...";
    }
    
    ["spp-cv", "spp-github", "spp-linkedin", "spp-website"].forEach(id => {
        document.getElementById(id).style.display = "none";
    });

    window.openModal("student-public-profile-modal");

    try {
        const profile = await window.api.get(`/users/${userId}/public`);
        
        // Avatar
        const avatarEl = document.getElementById("spp-avatar");
        if (profile.profile_picture) {
            // Adjust the base URL for images
            const baseUrl = window.api.getBaseUrl ? window.api.getBaseUrl() : (window.api.API_BASE_URL || "https://devearn-backend.onrender.com");
            avatarEl.innerHTML = `<img src="${baseUrl}${profile.profile_picture}" style="width: 100%; height: 100%; object-fit: cover;" alt="${profile.full_name}" />`;
        } else {
            avatarEl.innerHTML = profile.full_name.substring(0, 2).toUpperCase();
        }

        document.getElementById("spp-name").textContent = profile.full_name;
        document.getElementById("spp-specialty").textContent = profile.specialty || (profile.role === "Étudiant" ? "Étudiant IT" : profile.role);
        document.getElementById("spp-xp").textContent = `${profile.xp_points} XP`;
        document.getElementById("spp-education").textContent = profile.education_level ? `${profile.education_level} - ${profile.institution || ''}` : "Non renseigné";
        document.getElementById("spp-bio").textContent = profile.bio || "Aucune biographie fournie.";

        // Skills
        const skillsContainer = document.getElementById("spp-skills");
        skillsContainer.innerHTML = "";
        if (profile.skills_tags) {
            const skills = profile.skills_tags.split(',').map(s => s.trim()).filter(s => s);
            if (skills.length > 0) {
                skills.forEach(skill => {
                    const span = document.createElement("span");
                    span.className = "badge-tag";
                    span.textContent = skill;
                    skillsContainer.appendChild(span);
                });
            } else {
                skillsContainer.innerHTML = "<span style='color: var(--text-muted); font-size: 0.9rem;'>Aucune compétence listée.</span>";
            }
        } else {
            skillsContainer.innerHTML = "<span style='color: var(--text-muted); font-size: 0.9rem;'>Aucune compétence listée.</span>";
        }

        // Completed Projects
        if (projectsContainer) {
            projectsContainer.innerHTML = "";
            if (profile.completed_projects && profile.completed_projects.length > 0) {
                profile.completed_projects.forEach(proj => {
                    const item = document.createElement("div");
                    item.style.padding = "12px 16px";
                    item.style.background = "rgba(0, 223, 154, 0.04)";
                    item.style.border = "1px solid rgba(0, 223, 154, 0.15)";
                    item.style.borderRadius = "var(--radius-md)";
                    item.style.display = "flex";
                    item.style.justifyContent = "space-between";
                    item.style.alignItems = "center";
                    item.style.marginTop = "6px";
                    
                    item.innerHTML = `
                        <div>
                            <div style="font-weight: 700; color: var(--text); font-size: 0.92rem;">${proj.title}</div>
                            <div style="font-size: 0.8rem; color: var(--text-soft); margin-top: 2px;">Catégorie: ${proj.category}</div>
                        </div>
                        <span style="font-size: 0.72rem; font-weight: 700; color: var(--primary); padding: 3px 8px; background: rgba(0, 223, 154, 0.1); border-radius: 8px;">Complété ✓</span>
                    `;
                    projectsContainer.appendChild(item);
                });
            } else {
                projectsContainer.innerHTML = "<span style='color: var(--text-muted); font-size: 0.88rem;'>Aucun projet complété sur la plateforme pour le moment.</span>";
            }
        }

        // Links
        if (profile.cv_url) {
            const el = document.getElementById("spp-cv");
            el.href = profile.cv_url;
            el.style.display = "inline-flex";
        }
        if (profile.github_url) {
            const el = document.getElementById("spp-github");
            el.href = profile.github_url;
            el.style.display = "inline-flex";
        }
        if (profile.linkedin_url) {
            const el = document.getElementById("spp-linkedin");
            el.href = profile.linkedin_url;
            el.style.display = "inline-flex";
        }
        if (profile.website_url) {
            const el = document.getElementById("spp-website");
            el.href = profile.website_url;
            el.style.display = "inline-flex";
        }

    } catch (err) {
        console.error("Failed to fetch user profile", err);
        document.getElementById("spp-name").textContent = "Erreur de chargement";
        document.getElementById("spp-bio").textContent = "Impossible de récupérer les informations de cet utilisateur.";
        document.getElementById("spp-avatar").innerHTML = "!";
        if (projectsContainer) {
            projectsContainer.innerHTML = "<span style='color: var(--danger);'>Erreur.</span>";
        }
    }
  };

  // --- Chat / Messagerie ---
  let currentChatInterval = null;
  let currentChatData = null;

  window.openChat = async function(projectId, otherUserId, otherUserName, projectTitle) {
      currentChatData = { projectId, otherUserId, otherUserName, projectTitle };
      
      document.getElementById("chat-other-user-name").textContent = otherUserName;
      document.getElementById("chat-project-title").textContent = projectTitle;
      
      const messagesContainer = document.getElementById("chat-messages");
      messagesContainer.innerHTML = "<div style='text-align:center; color:var(--text-muted);'>Chargement des messages...</div>";
      
      window.openModal("chat-modal");
      
      await loadChatMessages();
      
      // Start polling for new messages
      if (currentChatInterval) clearInterval(currentChatInterval);
      currentChatInterval = setInterval(loadChatMessages, 3000); // refresh every 3 seconds
  };

  // Stop polling when modal is closed
  document.querySelectorAll(".modal-close").forEach(btn => {
      btn.addEventListener("click", () => {
          const modal = btn.closest(".modal-overlay");
          if (modal && modal.id === "chat-modal") {
              if (currentChatInterval) clearInterval(currentChatInterval);
              currentChatInterval = null;
          }
      });
  });

  const chatModal = document.getElementById("chat-modal");
  if (chatModal) {
      chatModal.addEventListener("click", (e) => {
          if (e.target.id === "chat-modal") {
              if (currentChatInterval) clearInterval(currentChatInterval);
              currentChatInterval = null;
          }
      });
  }

  async function loadChatMessages() {
      if (!currentChatData) return;
      
      try {
          const messages = await window.api.get(`/messages/${currentChatData.projectId}/${currentChatData.otherUserId}`);
          renderChatMessages(messages);
      } catch (err) {
          console.error("Error loading messages:", err);
      }
  }

  function renderChatMessages(messages) {
      const container = document.getElementById("chat-messages");
      
      // Check if user is scrolled to bottom before updating
      const isScrolledToBottom = container.scrollHeight - container.clientHeight <= container.scrollTop + 50;

      container.innerHTML = "";
      
      if (!messages || messages.length === 0) {
          container.innerHTML = "<div style='text-align:center; color:var(--text-muted); margin-top: auto; margin-bottom: auto;'>Aucun message. Commencez la discussion !</div>";
          return;
      }

      const currentUserId = window.currentUser ? window.currentUser.id : null;

      messages.forEach(msg => {
          const isMine = msg.sender_id === currentUserId;
          const timeStr = new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

          const msgDiv = document.createElement("div");
          msgDiv.style.display = "flex";
          msgDiv.style.flexDirection = "column";
          msgDiv.style.maxWidth = "80%";
          
          if (isMine) {
              msgDiv.style.alignSelf = "flex-end";
              msgDiv.innerHTML = `
                  <div style="background: var(--primary); color: #030305; padding: 10px 14px; border-radius: 16px 16px 0 16px; font-size: 0.95rem; line-height: 1.4;">
                      ${msg.content}
                  </div>
                  <span style="font-size: 0.75rem; color: var(--text-muted); align-self: flex-end; margin-top: 4px;">${timeStr}</span>
              `;
          } else {
              msgDiv.style.alignSelf = "flex-start";
              msgDiv.innerHTML = `
                  <div style="background: rgba(255,255,255,0.1); color: var(--text); padding: 10px 14px; border-radius: 16px 16px 16px 0; font-size: 0.95rem; line-height: 1.4; border: 1px solid var(--border);">
                      ${msg.content}
                  </div>
                  <span style="font-size: 0.75rem; color: var(--text-muted); align-self: flex-start; margin-top: 4px;">${timeStr}</span>
              `;
          }
          
          container.appendChild(msgDiv);
      });

      if (isScrolledToBottom || messages.length <= 5) {
          container.scrollTop = container.scrollHeight;
      }
  }

  // Handle chat form submit
  const chatForm = document.getElementById("chat-form");
  if (chatForm) {
      chatForm.addEventListener("submit", async (e) => {
          e.preventDefault();
          
          const currentUserId = window.currentUser ? window.currentUser.id : null;
          if (!currentUserId) {
              if (window.showToast) window.showToast("Vous devez être connecté pour envoyer un message.", "error");
              return;
          }

          const input = document.getElementById("chat-input");
          const content = input.value.trim();
          
          if (!content || !currentChatData) return;
          
          // Optimistically show message
          const msg = {
              sender_id: currentUserId,
              receiver_id: currentChatData.otherUserId,
              project_id: currentChatData.projectId,
              content: content,
              created_at: new Date().toISOString()
          };
          
          input.value = "";
          
          try {
              await window.api.post("/messages/", {
                  receiver_id: currentChatData.otherUserId,
                  project_id: currentChatData.projectId,
                  content: content
              });
              
              await loadChatMessages();
              const container = document.getElementById("chat-messages");
              container.scrollTop = container.scrollHeight;
          } catch (err) {
              console.error("Failed to send message", err);
              if (window.showToast) {
                  window.showToast("Erreur lors de l'envoi du message.", "error");
              } else {
                  alert("Erreur lors de l'envoi du message.");
              }
          }
      });
  }

})();
