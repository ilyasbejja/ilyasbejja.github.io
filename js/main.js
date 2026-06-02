document.addEventListener("DOMContentLoaded", () => {
  const html = document.documentElement;
  const navToggle = document.querySelector(".nav-toggle");
  const navList = document.querySelector(".nav-list");
  const themeToggle = document.querySelector(".theme-toggle");
  const body = document.body;

  let currentTheme = "dark";

  /* ── THEME ─────────────────────────────────────────── */
  function applyTheme(theme) {
    currentTheme = theme;
    html.setAttribute("data-theme", theme);
    if (themeToggle) {
      const icon = themeToggle.querySelector(".theme-toggle-icon");
      if (icon) icon.textContent = theme === "dark" ? "◐" : "☀";
      themeToggle.setAttribute("aria-label", theme === "dark" ? "Passer au mode clair" : "Passer au mode sombre");
      themeToggle.setAttribute("data-theme-state", theme);
    }
  }

  function initializeTheme() {
    const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
    applyTheme(prefersLight ? "light" : "dark");
  }

  /* ── MOBILE MENU ────────────────────────────────────── */
  function initializeMobileMenu() {
    if (!navToggle || !navList) return;
    navToggle.setAttribute("aria-expanded", "false");

    navToggle.addEventListener("click", () => {
      const isOpen = navList.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      body.classList.toggle("menu-open", isOpen);
    });

    document.addEventListener("click", (event) => {
      if (!navToggle.contains(event.target) && !navList.contains(event.target) && navList.classList.contains("is-open")) {
        navList.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        body.classList.remove("menu-open");
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && navList.classList.contains("is-open")) {
        navList.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        body.classList.remove("menu-open");
      }
    });

    navList.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navList.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        body.classList.remove("menu-open");
      });
    });
  }

  function initializeThemeToggle() {
    if (!themeToggle) return;
    themeToggle.addEventListener("click", () => {
      applyTheme(currentTheme === "dark" ? "light" : "dark");
    });
  }

  /* ── REVEAL ANIMATIONS ──────────────────────────────── */
  function initializeRevealAnimations() {
    const animatedElements = document.querySelectorAll(
      ".feature-card, .stats-card, .audience-card, .mini-stat, .kpi-box, .highlight-item, .proof-metric, .cta-panel, .section-heading, .proof-content, .proof-card, .showcase-section, .dashboard-card, .client-hero-main"
    );
    if (!animatedElements.length) return;

    animatedElements.forEach((element, index) => {
      element.style.opacity = "0";
      element.style.transform = "translateY(40px)";
      element.style.transition = `opacity 1000ms cubic-bezier(0.2, 0.8, 0.2, 1) ${index * 40}ms, transform 1000ms cubic-bezier(0.2, 0.8, 0.2, 1) ${index * 40}ms`;
    });

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -40px 0px" }
    );

    animatedElements.forEach((element) => observer.observe(element));
  }

  function initializeHeaderState() {
    const header = document.querySelector(".site-header");
    if (!header) return;
    const toggleHeaderClass = () => header.classList.toggle("is-scrolled", window.scrollY > 12);
    toggleHeaderClass();
    window.addEventListener("scroll", toggleHeaderClass, { passive: true });
  }

  /* ── SPA SECTION ROUTING ────────────────────────────── */
  const sections = {
    accueil: document.getElementById("accueil-section"),
    projects: document.getElementById("projects-section"),
    students: document.getElementById("students-section"),
    clients: document.getElementById("clients-section"),
    dashboard: document.getElementById("dashboard-section"),
    "student-hub": document.getElementById("student-hub-section"),
    "my-applications": document.getElementById("my-applications-section"),
    "client-hub": document.getElementById("client-hub-section"),
    "project-applications": document.getElementById("project-applications-section")
  };

  let activeSectionId = "accueil";

  /* ── COUNT-UP ANIMATION WITH EASING ────────────────── */
  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function animateCountUp(el) {
    const target = parseFloat(el.dataset.target) || 0;
    const decimals = parseInt(el.dataset.decimals || "0", 10);
    const suffix = el.dataset.suffix || "";
    const duration = 1600;
    const startTime = performance.now();

    // Reset to zero before animating
    el.textContent = (0).toFixed(decimals) + suffix;

    function tick(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);
      const current = easedProgress * target;
      el.textContent = current.toFixed(decimals) + suffix;

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = target.toFixed(decimals) + suffix;
      }
    }

    requestAnimationFrame(tick);
  }

  function animateCountUps(sectionEl) {
    const countEls = sectionEl.querySelectorAll(".count-up");
    countEls.forEach((el, i) => {
      // Stagger each counter for a cascade effect
      setTimeout(() => animateCountUp(el), i * 120);
    });
  }

  /* ── PROGRESS BAR ANIMATIONS ────────────────────────── */
  function animateProgressBars(sectionEl) {
    const progressBars = sectionEl.querySelectorAll(".progress-bar span");
    progressBars.forEach((bar) => {
      if (!bar.dataset.targetWidth) {
        bar.dataset.targetWidth = bar.style.width || "100%";
      }
      bar.style.width = "0%";
      setTimeout(() => {
        bar.style.width = bar.dataset.targetWidth;
      }, 50);
    });
  }

  /* ── INFINITE HERO SLOGAN CYCLING ──────────────────── */
  const heroSlogans = [
    "1 240+ talents · 126+ missions · 450k MAD",
    "Talents IT vérifiés.",
    "Missions réelles, impact concret.",
    "Étudiants et entreprises connectés.",
    "4.92/5 · 85+ entreprises · 482 projets",
    "Votre talent, vos opportunités.",
    "L'innovation IT du Maroc.",
    "Codez. Gagnez. Progressez.",
    "Powered by"
  ];

  // Index of the "Powered by" slogan
  const POWERED_BY_INDEX = heroSlogans.length - 1;
  const STATS_INDICES = [0, 4]; // Indices that contain statistics

  let heroSloganIndex = 0;
  let heroTypingActive = false;
  let heroTypingTimeouts = [];

  function clearHeroTimers() {
    heroTypingTimeouts.forEach((t) => clearTimeout(t));
    heroTypingTimeouts = [];
  }

  function heroTimeout(fn, delay) {
    const t = setTimeout(fn, delay);
    heroTypingTimeouts.push(t);
    return t;
  }

  function showHeroLogos() {
    const logosContainer = document.getElementById("hero-logos-container");
    const sloganLine = document.querySelector(".hero-slogan-line");
    if (logosContainer) logosContainer.classList.add("is-visible");
    if (sloganLine) sloganLine.classList.add("is-powered-by");
  }

  function hideHeroLogos() {
    const logosContainer = document.getElementById("hero-logos-container");
    const sloganLine = document.querySelector(".hero-slogan-line");
    if (logosContainer) logosContainer.classList.remove("is-visible");
    if (sloganLine) sloganLine.classList.remove("is-powered-by");
  }

  function runHeroSloganCycle() {
    if (!heroTypingActive) return;

    const el = document.getElementById("typed-slogan");
    if (!el) return;

    hideHeroLogos();
    el.textContent = "";

    const phrase = heroSlogans[heroSloganIndex];
    const isPoweredBy = heroSloganIndex === POWERED_BY_INDEX;
    const isStats = STATS_INDICES.includes(heroSloganIndex);

    let charIndex = 0;
    const TYPE_SPEED = isStats ? 20 : 40; // Faster for stats, normal for regular slogans
    const READ_DELAY = isPoweredBy ? 2200 : (isStats ? 3200 : 2000);
    const LOGOS_SHOW_DELAY = 200;
    const LOGOS_READ_DELAY = 2600;
    const DELETE_SPEED = 18;

    // --- Type the phrase character by character ---
    function typeChar() {
      if (!heroTypingActive) return;
      if (charIndex < phrase.length) {
        el.textContent += phrase.charAt(charIndex);
        charIndex++;
        heroTimeout(typeChar, TYPE_SPEED);
      } else {
        // Finished typing — show logos if applicable
        if (isPoweredBy) {
          heroTimeout(() => {
            showHeroLogos();
            // After showing logos, wait then delete
            heroTimeout(startDeleting, LOGOS_READ_DELAY);
          }, LOGOS_SHOW_DELAY);
        } else {
          // Normal slogan — wait then delete
          heroTimeout(startDeleting, READ_DELAY);
        }
      }
    }

    // --- Delete the phrase character by character ---
    function startDeleting() {
      if (!heroTypingActive) return;
      hideHeroLogos();
      heroTimeout(deleteChar, 400); // Brief pause before deletion starts
    }

    function deleteChar() {
      if (!heroTypingActive) return;
      const current = el.textContent;
      if (current.length > 0) {
        el.textContent = current.slice(0, -1);
        heroTimeout(deleteChar, DELETE_SPEED);
      } else {
        // Move to next slogan
        heroSloganIndex = (heroSloganIndex + 1) % heroSlogans.length;
        heroTimeout(runHeroSloganCycle, 350);
      }
    }

    // Kick off typing
    heroTimeout(typeChar, 80);
  }

  function startHeroSloganCycle() {
    heroTypingActive = true;
    clearHeroTimers();
    runHeroSloganCycle();
  }

  function stopHeroSloganCycle() {
    heroTypingActive = false;
    clearHeroTimers();
    hideHeroLogos();
  }

  /* ── SINGLE-PHRASE TYPING (for inner sections) ─────── */
  function triggerTypingAnimation(sectionEl) {
    const typedEl = sectionEl.querySelector("[data-typed-phrase]");
    if (!typedEl) return;

    const phrase = typedEl.getAttribute("data-typed-phrase");
    typedEl.textContent = "";
    typedEl.classList.remove("typed-cursor-effect");

    let charIndex = 0;
    if (typedEl._typingTimeout) clearTimeout(typedEl._typingTimeout);

    function type() {
      if (charIndex < phrase.length) {
        typedEl.textContent += phrase.charAt(charIndex);
        charIndex++;
        typedEl._typingTimeout = setTimeout(type, 35);
      } else {
        typedEl.classList.add("typed-cursor-effect");
      }
    }

    typedEl._typingTimeout = setTimeout(type, 150);
  }

  /* ── SHOW SECTION ───────────────────────────────────── */
  function showSection(targetId) {
    if (!sections[targetId]) return;
    if (targetId === activeSectionId && sections[targetId].classList.contains("is-active")) return;

    const currentSection = sections[activeSectionId];
    const newSection = sections[targetId];

    // Stop hero cycle if leaving accueil
    if (activeSectionId === "accueil") stopHeroSloganCycle();

    if (currentSection) {
      currentSection.classList.remove("is-active");
      currentSection.classList.add("is-fading-out");
    }

    document.querySelectorAll(".nav-list a").forEach((link) => {
      const href = link.getAttribute("href");
      const isMatch = href.includes(targetId) || (targetId === "accueil" && href.endsWith("index.html"));
      link.classList.toggle("is-current", isMatch);
    });

    setTimeout(() => {
      if (currentSection) {
        currentSection.classList.remove("is-fading-out");
        currentSection.style.display = "none";
      }

      newSection.style.display = "block";
      void newSection.offsetWidth; // force reflow
      newSection.classList.add("is-active");
      activeSectionId = targetId;

      history.pushState(null, null, `#${targetId}`);

      // Trigger appropriate animations for the new section
      if (targetId === "accueil") {
        startHeroSloganCycle();
        animateCountUps(newSection);
      } else {
        triggerTypingAnimation(newSection);
        animateProgressBars(newSection);
        animateCountUps(newSection);
      }

      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 300);
  }

  /* ── SMOOTH SCROLL (boutons « Découvrir ») ─────────── */
  function smoothScrollToElement(target, duration = 1000) {
    const header = document.querySelector(".site-header");
    const headerOffset = header ? header.offsetHeight + 20 : 20;
    const startTop = window.scrollY || document.documentElement.scrollTop;
    const targetTop =
      target.getBoundingClientRect().top + startTop - headerOffset;
    const distance = targetTop - startTop;

    if (Math.abs(distance) < 4) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      window.scrollTo({ top: targetTop, behavior: "auto" });
      return;
    }

    let startTime = null;

    function easeInOutCubic(t) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function step(currentTime) {
      if (startTime === null) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      window.scrollTo({ top: startTop + distance * easeInOutCubic(progress), behavior: "auto" });
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  function scrollToSectionTarget(targetId) {
    const target = document.getElementById(targetId);
    if (!target) return;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => smoothScrollToElement(target));
    });
  }

  function initializeScrollTriggers() {
    document.querySelectorAll("[data-scroll-to]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        scrollToSectionTarget(btn.getAttribute("data-scroll-to"));
      });
    });
  }

  /* ── SPA LINK INTERCEPTION ──────────────────────────── */
  function initializeSPALinks(scope) {
    const links = scope instanceof Element
      ? scope.querySelectorAll("a")
      : document.querySelectorAll(".nav-list a, .footer-links-group a, .brand, [data-nav-to]");

    links.forEach((link) => {
      if (link.dataset.spaBound === "1") return;
      link.dataset.spaBound = "1";

      if (link.dataset.navTo) {
        link.addEventListener("click", (e) => {
          e.preventDefault();
          showSection(link.dataset.navTo);
        });
        return;
      }

      const href = link.getAttribute("href");
      if (!href) return;

      let targetSection = null;
      if (href.includes("projects.html") || href.includes("#projects")) targetSection = "projects";
      else if (href.includes("student-space.html") || href.includes("#students")) targetSection = "students";
      else if (href.includes("client-space.html") || href.includes("#clients")) targetSection = "clients";
      else if (href.includes("dashboard.html") || href.includes("#dashboard")) targetSection = "dashboard";
      else if (href.includes("index.html") || href === "./" || href === "#accueil") targetSection = "accueil";

      if (targetSection) {
        link.addEventListener("click", (e) => {
          e.preventDefault();
          showSection(targetSection);

          const navList = document.querySelector(".nav-list");
          const navToggle = document.querySelector(".nav-toggle");
          if (navList && navList.classList.contains("is-open")) {
            navList.classList.remove("is-open");
            if (navToggle) navToggle.setAttribute("aria-expanded", "false");
            document.body.classList.remove("menu-open");
          }
        });
      }
    });
  }
  window.bindSPALinks = initializeSPALinks;

  /* ── MODALS MANAGER ─────────────────────────────────── */
  function openModal(id, triggerElement = null) {
    const modal = document.getElementById(id);
    if (!modal) return;

    document.querySelectorAll(".modal-overlay.is-active").forEach((m) => {
      m.classList.remove("is-active");
      m.setAttribute("aria-hidden", "true");
    });

    modal.classList.add("is-active");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    if (id === "register-modal") {
        let role = null;
        if (triggerElement && triggerElement.dataset.preselectRole) {
            role = triggerElement.dataset.preselectRole;
        }
        document.dispatchEvent(new CustomEvent('devearn:preselect-role', { detail: { role } }));
    }

    setTimeout(() => {
      const firstInput = modal.querySelector("input, select, textarea");
      if (firstInput) firstInput.focus();
    }, 100);
  }

  function closeModal(modal) {
    modal.classList.remove("is-active");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function bindModalTriggers(root = document) {
    const scope = root instanceof Element ? root : document;
    scope.querySelectorAll("[data-open-modal]").forEach((btn) => {
      if (btn.dataset.modalBound === "1") return;
      btn.dataset.modalBound = "1";
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        openModal(btn.getAttribute("data-open-modal"), btn);
      });
    });
  }

  function initializeModals() {
    bindModalTriggers();

    document.querySelectorAll("[data-switch-modal]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        openModal(btn.getAttribute("data-switch-modal"), btn);
      });
    });

    document.querySelectorAll(".modal-close").forEach((btn) => {
      btn.addEventListener("click", () => {
        const modal = btn.closest(".modal-overlay");
        if (modal) closeModal(modal);
      });
    });

    document.querySelectorAll(".modal-overlay").forEach((overlay) => {
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) closeModal(overlay);
      });
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        document.querySelectorAll(".modal-overlay.is-active").forEach((m) => closeModal(m));
      }
    });
  }

  /* ── PROJECT FILTERING ──────────────────────────────── */
  function initializeProjectFiltering() {
    const categoryButtons = document.querySelectorAll("[data-filter]");
    const levelButtons = document.querySelectorAll("[data-level]");
    const cards = document.querySelectorAll(".project-card");
    const resultsCounter = document.getElementById("results-counter");

    if (!cards.length) return;

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
        if (shouldShow) visibleCount++;
      });

      if (resultsCounter) {
        resultsCounter.textContent = visibleCount > 1
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
  }

  /* ── HASH ROUTING INITIALIZATION ───────────────────── */
  function initializeHashRouting() {
    const hash = window.location.hash.replace("#", "");

    if (hash === "login" || hash === "register" || hash === "post-project-modal") {
      if (hash === "login") openModal("login-modal");
      else if (hash === "register") openModal("register-modal");
      else openModal("post-project-modal");
      
      showSection("accueil");
      startHeroSloganCycle();
      animateCountUps(sections["accueil"]);
    } else if (sections[hash]) {
      sections["accueil"].style.display = "none";
      sections["accueil"].classList.remove("is-active");

      sections[hash].style.display = "block";
      sections[hash].classList.add("is-active");
      activeSectionId = hash;

      triggerTypingAnimation(sections[hash]);
      animateProgressBars(sections[hash]);
      animateCountUps(sections[hash]);

      document.querySelectorAll(".nav-list a").forEach((link) => {
        link.classList.toggle("is-current", link.getAttribute("href").includes(hash));
      });
    } else {
      // Default: accueil
      startHeroSloganCycle();
      animateCountUps(sections["accueil"]);
    }
  }

  window.addEventListener("hashchange", () => {
    const hash = window.location.hash.replace("#", "") || "accueil";
    if (hash === "login" || hash === "register" || hash === "post-project-modal") return;
    if (sections[hash]) {
      showSection(hash);
    }
  });

  /* ── INITIALIZE ALL MODULES ─────────────────────────── */
  initializeTheme();
  initializeMobileMenu();
  initializeThemeToggle();
  initializeRevealAnimations();
  initializeHeaderState();
  initializeModals();
  initializeSPALinks();
  initializeScrollTriggers();
  initializeProjectFiltering();
  initializeHashRouting();

  // Expose modal functions globally
  window.openModal = openModal;
  window.closeModal = closeModal;
  window.bindModalTriggers = bindModalTriggers;
});