/**
 * forms.js — DevEarn Form Handler
 * Gestion complète des formulaires modaux : validation, feedback toast,
 * et préparation pour l'intégration backend.
 */

(function () {
  "use strict";

  /* ── TOAST NOTIFICATION SYSTEM ─────────────────────────── */
  function createToastContainer() {
    let container = document.getElementById("toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "toast-container";
      container.setAttribute("aria-live", "polite");
      container.setAttribute("aria-atomic", "true");
      document.body.appendChild(container);
    }
    return container;
  }

  function showToast(message, type = "success", duration = 4000) {
    const container = createToastContainer();

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.setAttribute("role", "status");

    const icons = {
      success: "✓",
      error: "✕",
      info: "ℹ",
      warning: "⚠"
    };

    toast.innerHTML = `
      <span class="toast-icon">${icons[type] || icons.info}</span>
      <span class="toast-message">${message}</span>
      <button class="toast-close" aria-label="Fermer la notification">×</button>
    `;

    container.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        toast.classList.add("toast-visible");
      });
    });

    // Auto dismiss
    const dismissTimer = setTimeout(() => dismissToast(toast), duration);

    // Manual close
    toast.querySelector(".toast-close").addEventListener("click", () => {
      clearTimeout(dismissTimer);
      dismissToast(toast);
    });

    return toast;
  }

  function dismissToast(toast) {
    toast.classList.remove("toast-visible");
    toast.classList.add("toast-out");
    toast.addEventListener("transitionend", () => toast.remove(), { once: true });
  }

  /* ── FORM VALIDATION HELPERS ───────────────────────────── */
  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validatePassword(password) {
    return password.length >= 8;
  }

  function showFieldError(field, message) {
    field.classList.add("field-error");
    let errorEl = field.parentElement.querySelector(".field-error-msg");
    if (!errorEl) {
      errorEl = document.createElement("span");
      errorEl.className = "field-error-msg";
      field.parentElement.appendChild(errorEl);
    }
    errorEl.textContent = message;
  }

  function clearFieldError(field) {
    field.classList.remove("field-error");
    const errorEl = field.parentElement.querySelector(".field-error-msg");
    if (errorEl) errorEl.remove();
  }

  function clearAllErrors(form) {
    form.querySelectorAll(".field-error").forEach((f) => f.classList.remove("field-error"));
    form.querySelectorAll(".field-error-msg").forEach((e) => e.remove());
  }

  /* ── LOADING STATE ─────────────────────────────────────── */
  function setButtonLoading(btn, loading) {
    if (loading) {
      btn.dataset.originalText = btn.innerHTML;
      btn.innerHTML = `<span class="btn-spinner"></span> Chargement…`;
      btn.disabled = true;
    } else {
      btn.innerHTML = btn.dataset.originalText || btn.innerHTML;
      btn.disabled = false;
    }
  }

  /* ── CLOSE MODAL HELPER ────────────────────────────────── */
  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove("is-active");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  /* ── LOGIN FORM ────────────────────────────────────────── */
  function initLoginForm() {
    const form = document.querySelector("#login-modal .modal-form");
    if (!form) return;

    const emailInput = document.getElementById("modal-login-email");
    const passwordInput = document.getElementById("modal-login-password");
    const submitBtn = form.querySelector("[type='submit']");

    // Clear errors on input
    [emailInput, passwordInput].forEach((input) => {
      if (input) input.addEventListener("input", () => clearFieldError(input));
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      clearAllErrors(form);

      let hasError = false;

      if (!emailInput.value.trim() || !validateEmail(emailInput.value.trim())) {
        showFieldError(emailInput, "Veuillez saisir un email valide.");
        hasError = true;
      }

      if (!passwordInput.value || !validatePassword(passwordInput.value)) {
        showFieldError(passwordInput, "Le mot de passe doit contenir au moins 8 caractères.");
        hasError = true;
      }

      if (hasError) return;

      setButtonLoading(submitBtn, true);

      try {
        const result = await window.api.login(emailInput.value.trim(), passwordInput.value);
        window.api.setToken(result.access_token);

        showToast("Connexion réussie ! Bienvenue sur DevEarn.", "success");
        form.reset();
        closeModal(document.getElementById("login-modal"));
        
        // Reload to update session state
        setTimeout(() => window.location.reload(), 1000);
      } catch (err) {
        if (err.message && (err.message.includes("Email non vérifié") || err.status === 403)) {
            closeModal(document.getElementById("login-modal"));
            const verifyModal = document.getElementById("verify-email-modal");
            document.getElementById("verify-email-input").value = emailInput.value.trim();
            if (verifyModal) {
                verifyModal.classList.add("is-active");
                verifyModal.setAttribute("aria-hidden", "false");
            }
            showToast("Veuillez vérifier votre email avant de vous connecter.", "info", 5000);
        } else {
            showToast(err.message || "Erreur de connexion. Vérifiez vos identifiants.", "error");
        }
      } finally {
        setButtonLoading(submitBtn, false);
      }
    });
  }

  /* ── REGISTER FORM ─────────────────────────────────────── */
  function initRegisterForm() {
    const form = document.querySelector("#registration-form");
    if (!form) return;

    const step1 = document.getElementById("register-step-1");
    const step2 = document.getElementById("register-step-2");
    const roleBtns = document.querySelectorAll(".btn-role");
    const backBtn = document.getElementById("btn-back-role");
    
    const roleInput = document.getElementById("modal-reg-role");
    const fieldsPerson = document.getElementById("fields-person");
    const fieldsCompany = document.getElementById("fields-company");

    const firstNameInput = document.getElementById("modal-reg-firstname");
    const lastNameInput = document.getElementById("modal-reg-lastname");
    const companyNameInput = document.getElementById("modal-reg-companyname");
    const logoInput = document.getElementById("modal-reg-logo");
    
    const emailInput = document.getElementById("modal-reg-email");
    const passwordInput = document.getElementById("modal-reg-password");
    const passwordConfirmInput = document.getElementById("modal-reg-password-confirm");
    const submitBtn = form.querySelector("[type='submit']");

    [firstNameInput, lastNameInput, companyNameInput, emailInput, passwordInput, passwordConfirmInput].forEach((input) => {
      if (input) input.addEventListener("input", () => clearFieldError(input));
    });
    if(logoInput) logoInput.addEventListener("change", () => clearFieldError(logoInput));

    function setRole(role) {
        roleInput.value = role;
        step1.style.display = "none";
        step2.style.display = "block";
        
        if (role === "Client / Entreprise") {
            fieldsPerson.style.display = "none";
            fieldsCompany.style.display = "block";
        } else {
            fieldsPerson.style.display = "block";
            fieldsCompany.style.display = "none";
        }
    }

    roleBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            setRole(btn.dataset.role);
        });
    });

    backBtn.addEventListener("click", () => {
        step2.style.display = "none";
        step1.style.display = "block";
        form.reset();
        clearAllErrors(form);
    });

    // Listen to custom event for preselection
    document.addEventListener("devearn:preselect-role", (e) => {
        if (e.detail && e.detail.role) {
            setRole(e.detail.role);
        } else {
            step2.style.display = "none";
            step1.style.display = "block";
            form.reset();
            clearAllErrors(form);
        }
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      clearAllErrors(form);

      let hasError = false;
      const role = roleInput.value;
      const isCompany = role === "Client / Entreprise";

      if (isCompany) {
          if (!companyNameInput.value.trim()) {
              showFieldError(companyNameInput, "Le nom de l'entreprise est requis.");
              hasError = true;
          }
          if (!logoInput.files || logoInput.files.length === 0) {
              showFieldError(logoInput, "Le logo est obligatoire.");
              hasError = true;
          }
      } else {
          if (!firstNameInput.value.trim()) {
            showFieldError(firstNameInput, "Prénom requis.");
            hasError = true;
          }
          if (!lastNameInput.value.trim()) {
            showFieldError(lastNameInput, "Nom requis.");
            hasError = true;
          }
      }

      if (!emailInput.value.trim() || !validateEmail(emailInput.value.trim())) {
        showFieldError(emailInput, "Veuillez saisir un email valide.");
        hasError = true;
      }

      if (!passwordInput.value || !validatePassword(passwordInput.value)) {
        showFieldError(passwordInput, "Le mot de passe doit contenir au moins 8 caractères.");
        hasError = true;
      }

      if (passwordInput.value !== passwordConfirmInput.value) {
        showFieldError(passwordConfirmInput, "Les mots de passe ne correspondent pas.");
        hasError = true;
      }

      if (hasError) return;

      setButtonLoading(submitBtn, true);

      try {
        let fullName = isCompany ? companyNameInput.value.trim() : `${firstNameInput.value.trim()} ${lastNameInput.value.trim()}`;
        
        const payload = {
          full_name: fullName,
          email: emailInput.value.trim(),
          role: role,
          password: passwordInput.value
        };
        
        await window.api.post("/auth/register", payload);

        showToast("Inscription réussie ! Un code de vérification vous a été envoyé par email.", "success");
        form.reset();
        closeModal(document.getElementById("register-modal"));
        
        // Open verify email modal
        const verifyModal = document.getElementById("verify-email-modal");
        if (verifyModal) {
            window.openModal("verify-email-modal");
            const emailInputVerify = document.getElementById("verify-email-input");
            if (emailInputVerify) {
                emailInputVerify.value = payload.email;
            }
            const codeInputVerify = document.getElementById("verify-code");
            if (codeInputVerify) {
                codeInputVerify.focus();
            }
        }
        
      } catch (err) {
        showToast(err.message || "Erreur lors de la création du compte. Réessayez.", "error");
      } finally {
        setButtonLoading(submitBtn, false);
      }
    });
  }

  /* ── PROFILE FORM ──────────────────────────────────────── */
  function initProfileForm() {
    const form = document.getElementById("profile-form");
    if (!form) return;

    const companyInput = document.getElementById("modal-profile-company");
    const bioInput = document.getElementById("modal-profile-bio");
    const skillsInput = document.getElementById("modal-profile-skills");
    const educationInput = document.getElementById("modal-profile-education");
    const institutionInput = document.getElementById("modal-profile-institution");
    const cvInput = document.getElementById("modal-profile-cv");
    const avatarInput = document.getElementById("modal-profile-avatar");
    const avatarPreview = document.getElementById("profile-avatar-preview");
    const submitBtn = document.getElementById("btn-save-profile");

    // Populate form on session ready
    document.addEventListener("devearn:session-ready", (e) => {
        const user = e.detail.user;
        if (companyInput) companyInput.value = user.company_name || "";
        if (bioInput) bioInput.value = user.bio || "";
        if (skillsInput) skillsInput.value = user.skills_tags || "";
        if (educationInput) educationInput.value = user.education_level || "";
        if (institutionInput) institutionInput.value = user.institution || "";
        if (cvInput) cvInput.value = user.cv_url || "";
        
        if (user.profile_picture) {
            avatarPreview.innerHTML = `<img src="${window.api.API_BASE_URL || 'http://127.0.0.1:8001'}${user.profile_picture}" style="width:100%; height:100%; object-fit:cover;" />`;
        }
        
        const phoneInput = document.getElementById("modal-profile-phone");
        const githubInput = document.getElementById("modal-profile-github");
        const linkedinInput = document.getElementById("modal-profile-linkedin");
        const websiteInput = document.getElementById("modal-profile-website");
        const specialtyInput = document.getElementById("modal-profile-specialty");
        
        if (phoneInput) phoneInput.value = user.phone || "";
        if (githubInput) githubInput.value = user.github_url || "";
        if (linkedinInput) linkedinInput.value = user.linkedin_url || "";
        if (websiteInput) websiteInput.value = user.website_url || "";
        if (specialtyInput) specialtyInput.value = user.specialty || "";

        const isStudent = user.role && (user.role.toLowerCase().includes("étudiant") || user.role.toLowerCase().includes("student"));
        const isLaureate = user.role && (user.role.toLowerCase().includes("lauréat") || user.role.toLowerCase().includes("mentor"));
        
        const companyGroup = document.getElementById("profile-company-group");
        const studentFields = document.getElementById("profile-student-fields");
        const specialtyGroup = document.getElementById("profile-specialty-group");
        
        if (isStudent || isLaureate) {
            if (companyGroup) companyGroup.style.display = "none";
            if (studentFields) studentFields.style.display = "block";
            if (specialtyGroup) specialtyGroup.style.display = isLaureate ? "block" : "none";
        } else {
            if (companyGroup) companyGroup.style.display = "block";
            if (studentFields) studentFields.style.display = "none";
        }
    });

    avatarInput.addEventListener("change", (e) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = function(evt) {
                avatarPreview.innerHTML = `<img src="${evt.target.result}" style="width:100%; height:100%; object-fit:cover;" />`;
            }
            reader.readAsDataURL(e.target.files[0]);
        }
    });

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        setButtonLoading(submitBtn, true);

        try {
            // update text fields
            const payload = {};
            if (companyInput && companyInput.value.trim()) payload.company_name = companyInput.value.trim();
            if (bioInput && bioInput.value.trim()) payload.bio = bioInput.value.trim();
            if (skillsInput && skillsInput.value.trim()) payload.skills_tags = skillsInput.value.trim();
            if (educationInput && educationInput.value.trim()) payload.education_level = educationInput.value.trim();
            if (institutionInput && institutionInput.value.trim()) payload.institution = institutionInput.value.trim();
            if (cvInput && cvInput.value.trim()) payload.cv_url = cvInput.value.trim();
            
            const phoneInput = document.getElementById("modal-profile-phone");
            const githubInput = document.getElementById("modal-profile-github");
            const linkedinInput = document.getElementById("modal-profile-linkedin");
            const websiteInput = document.getElementById("modal-profile-website");
            const specialtyInput = document.getElementById("modal-profile-specialty");
            
            if (phoneInput && phoneInput.value.trim()) payload.phone = phoneInput.value.trim();
            if (githubInput && githubInput.value.trim()) payload.github_url = githubInput.value.trim();
            if (linkedinInput && linkedinInput.value.trim()) payload.linkedin_url = linkedinInput.value.trim();
            if (websiteInput && websiteInput.value.trim()) payload.website_url = websiteInput.value.trim();
            if (specialtyInput && specialtyInput.value.trim()) payload.specialty = specialtyInput.value.trim();

            await window.api.fetch("/users/me", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            // update avatar
            if (avatarInput.files && avatarInput.files.length > 0) {
                await window.api.uploadAvatar(avatarInput.files[0]);
            }

            showToast("Profil mis à jour avec succès !", "success");
            closeModal(document.getElementById("profile-modal"));
            
            // Reload to refresh UI (optional, could just update DOM)
            setTimeout(() => window.location.reload(), 1000);
        } catch (err) {
            showToast("Erreur lors de la mise à jour : " + err.message, "error");
        } finally {
            setButtonLoading(submitBtn, false);
        }
    });
  }

  /* ── POST PROJECT FORM ─────────────────────────────────── */
  function initPostProjectForm() {
    // Try by id first (most reliable), fallback to modal query
    const form = document.getElementById("post-project-form") || document.querySelector("#post-project-modal .modal-form");
    if (!form) return;

    const titleInput = document.getElementById("modal-project-title");
    const categorySelect = document.getElementById("modal-project-category");
    const budgetInput = document.getElementById("modal-project-budget");
    const descTextarea = document.getElementById("modal-project-desc");
    const skillsInput = document.getElementById("modal-project-skills");
    const submitBtn = form.querySelector("[type='submit']");

    [titleInput, categorySelect, budgetInput, descTextarea, skillsInput].forEach((input) => {
      if (input) input.addEventListener("input", () => clearFieldError(input));
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      clearAllErrors(form);

      // ── Check authentication first ──
      const user = window.currentUser;
      if (!user) {
        showToast("Vous devez être connecté pour publier un projet. Veuillez vous connecter.", "error", 5000);
        closeModal(document.getElementById("post-project-modal"));
        setTimeout(() => {
          const loginModal = document.getElementById("login-modal");
          if (loginModal && window.openModal) window.openModal("login-modal");
        }, 300);
        return;
      }

      // ── Check role (must be client or laureate) ──
      const role = user.role ? user.role.toLowerCase() : "";
      const canPost = role.includes("client") || role.includes("entreprise") || role.includes("lauréat") || role.includes("mentor");
      if (!canPost) {
        showToast("Seules les entreprises et les lauréats peuvent publier des projets.", "error", 4000);
        return;
      }

      let hasError = false;

      if (!titleInput.value.trim() || titleInput.value.trim().length < 5) {
        showFieldError(titleInput, "Le titre doit contenir au moins 5 caractères.");
        hasError = true;
      }

      if (!categorySelect.value) {
        showFieldError(categorySelect, "Veuillez sélectionner une catégorie.");
        hasError = true;
      }

      if (!budgetInput.value.trim()) {
        showFieldError(budgetInput, "Le budget est requis.");
        hasError = true;
      }

      if (!descTextarea.value.trim() || descTextarea.value.trim().length < 20) {
        showFieldError(descTextarea, "La description doit contenir au moins 20 caractères.");
        hasError = true;
      }

      if (!skillsInput.value.trim()) {
        showFieldError(skillsInput, "Veuillez préciser les compétences requises.");
        hasError = true;
      }

      if (hasError) return;

      setButtonLoading(submitBtn, true);

      try {
        const payload = {
          title: titleInput.value.trim(),
          category: categorySelect.value,
          budget: budgetInput.value.trim(),
          description: descTextarea.value.trim(),
          skills: skillsInput.value.trim()
        };
        const newProject = await window.api.post("/projects/", payload);

        showToast("Projet publié avec succès ! Les talents vous répondront bientôt.", "success", 5000);
        form.reset();
        closeModal(document.getElementById("post-project-modal"));

        // Reload client/laureate dashboard to show new project
        setTimeout(() => {
          if (window.location.hash === "#client-hub" || window.location.hash === "#laureate-hub") {
            // Trigger hashchange to reload
            const currentHash = window.location.hash;
            window.dispatchEvent(new HashChangeEvent("hashchange", {
              newURL: window.location.href,
              oldURL: window.location.href
            }));
          } else {
            // Navigate to client hub to see the new project
            if (role.includes("client") || role.includes("entreprise")) {
              window.location.hash = "client-hub";
            } else {
              window.location.hash = "laureate-hub";
            }
          }
        }, 500);

      } catch (err) {
        if (err.message && err.message.toLowerCase().includes("401")) {
          showToast("Session expirée. Veuillez vous reconnecter.", "error");
        } else {
          showToast(err.message || "Erreur lors de la publication. Réessayez.", "error");
        }
      } finally {
        setButtonLoading(submitBtn, false);
      }
    });
  }

  function initVerifyEmailForm() {
    const form = document.getElementById("verify-email-form");
    if (!form) return;
    
    const submitBtn = form.querySelector("[type='submit']");
    
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const email = document.getElementById("verify-email-input").value;
        const code = document.getElementById("verify-code").value;
        
        if (!code || code.length !== 6) {
            showToast("Le code doit contenir 6 chiffres.", "error");
            return;
        }
        
        setButtonLoading(submitBtn, true);
        
        try {
            await window.api.post("/auth/verify-email", { email, code });
            showToast("Email vérifié avec succès ! Vous pouvez maintenant vous connecter.", "success");
            form.reset();
            closeModal(document.getElementById("verify-email-modal"));
            
            // Open login modal
            const loginModal = document.getElementById("login-modal");
            if (loginModal) {
                loginModal.classList.add("is-active");
                loginModal.setAttribute("aria-hidden", "false");
                document.getElementById("modal-login-email").value = email;
            }
        } catch (err) {
            showToast(err.message || "Code invalide.", "error");
        } finally {
            setButtonLoading(submitBtn, false);
        }
    });
  }

  function initForgotPasswordForm() {
    const form = document.getElementById("forgot-password-form");
    if (!form) return;

    const emailInput = document.getElementById("forgot-password-email");
    const submitBtn = form.querySelector("[type='submit']");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      clearAllErrors(form);

      const email = emailInput.value.trim();
      if (!email || !validateEmail(email)) {
        showFieldError(emailInput, "Veuillez saisir un email valide.");
        return;
      }

      setButtonLoading(submitBtn, true);

      try {
        await window.api.post("/auth/forgot-password", { email });
        showToast("Code de réinitialisation envoyé avec succès ! Consultez vos emails.", "success");
        form.reset();
        closeModal(document.getElementById("forgot-password-modal"));

        // Open reset password modal
        const resetModal = document.getElementById("reset-password-modal");
        if (resetModal) {
          window.openModal("reset-password-modal");
          const emailInputReset = document.getElementById("reset-password-email");
          if (emailInputReset) {
            emailInputReset.value = email;
          }
          const codeInputReset = document.getElementById("reset-password-code");
          if (codeInputReset) {
            codeInputReset.focus();
          }
        }
      } catch (err) {
        showToast(err.message || "Erreur lors de l'envoi du code. Réessayez.", "error");
      } finally {
        setButtonLoading(submitBtn, false);
      }
    });
  }

  function initResetPasswordForm() {
    const form = document.getElementById("reset-password-form");
    if (!form) return;

    const emailInput = document.getElementById("reset-password-email");
    const codeInput = document.getElementById("reset-password-code");
    const newPasswordInput = document.getElementById("reset-password-new");
    const confirmPasswordInput = document.getElementById("reset-password-confirm");
    const submitBtn = form.querySelector("[type='submit']");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      clearAllErrors(form);

      let hasError = false;
      const email = emailInput.value.trim();
      const reset_code = codeInput.value.trim();
      const new_password = newPasswordInput.value;
      const confirm_password = confirmPasswordInput.value;

      if (!reset_code || reset_code.length !== 6) {
        showFieldError(codeInput, "Le code doit contenir 6 chiffres.");
        hasError = true;
      }

      if (!new_password || !validatePassword(new_password)) {
        showFieldError(newPasswordInput, "Le mot de passe doit contenir au moins 8 caractères.");
        hasError = true;
      }

      if (new_password !== confirm_password) {
        showFieldError(confirmPasswordInput, "Les mots de passe ne correspondent pas.");
        hasError = true;
      }

      if (hasError) return;

      setButtonLoading(submitBtn, true);

      try {
        await window.api.post("/auth/reset-password", {
          email,
          reset_code,
          new_password,
          confirm_password
        });
        showToast("Votre mot de passe a été réinitialisé avec succès ! Vous pouvez maintenant vous connecter.", "success");
        form.reset();
        closeModal(document.getElementById("reset-password-modal"));

        // Open login modal
        const loginModal = document.getElementById("login-modal");
        if (loginModal) {
          window.openModal("login-modal");
          const emailInputLogin = document.getElementById("modal-login-email");
          if (emailInputLogin) {
            emailInputLogin.value = email;
            emailInputLogin.focus();
          }
        }
      } catch (err) {
        showToast(err.message || "Code incorrect ou expiré.", "error");
      } finally {
        setButtonLoading(submitBtn, false);
      }
    });
  }

  /* ── INIT ──────────────────────────────────────────────── */
  document.addEventListener("DOMContentLoaded", () => {
    initLoginForm();
    initRegisterForm();
    initPostProjectForm();
    initProfileForm();
    initVerifyEmailForm();
    initForgotPasswordForm();
    initResetPasswordForm();
  });
})();
