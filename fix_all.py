import os

BASE = os.path.dirname(os.path.abspath(__file__))

# ─────────────────────────────────────────────────────────────────
#  SHARED FRAGMENTS
# ─────────────────────────────────────────────────────────────────
NAV_HOME = """  <header class="site-header">
    <div class="container header-inner">
      <a href="./index.html" class="brand" aria-label="Accueil DevEarn">
        <span class="brand-mark" aria-hidden="true">
          <span class="brand-dev">Dev</span><span class="brand-amp">&amp;</span><span class="brand-earn">Earn</span>
        </span>
      </a>
      <nav class="main-nav" aria-label="Navigation principale">
        <button class="nav-toggle" type="button" aria-label="Ouvrir le menu">
          <span></span><span></span><span></span>
        </button>
        <ul class="nav-list">
          <li><a href="./index.html" class="is-current">Accueil</a></li>
          <li><a href="./projects.html">Projets</a></li>
          <li><a href="./student-space.html">Étudiants</a></li>
          <li><a href="./client-space.html">Entreprises</a></li>
          <li><a href="./dashboard.html">Dashboard</a></li>
        </ul>
      </nav>
      <div class="header-actions">
        <button class="theme-toggle" type="button" aria-label="Basculer le thème">
          <span class="theme-toggle-icon">◐</span>
        </button>
        <button type="button" class="btn btn-ghost" data-open-modal="login-modal">Connexion</button>
        <button type="button" class="btn btn-primary" data-open-modal="register-modal">Inscription</button>
      </div>
    </div>
  </header>"""

def nav_for(page):
    """Return header+nav HTML with the correct is-current link."""
    pages = {
        "home": ("./index.html", "Accueil"),
        "projects": ("./projects.html", "Projets"),
        "students": ("./student-space.html", "Étudiants"),
        "client": ("./client-space.html", "Entreprises"),
        "dashboard": ("./dashboard.html", "Dashboard"),
    }
    links = ""
    for key, (href, label) in pages.items():
        active = ' class="is-current"' if key == page else ''
        links += f'\n          <li><a href="{href}"{active}>{label}</a></li>'
    return f"""  <header class="site-header">
    <div class="container header-inner">
      <a href="./index.html" class="brand" aria-label="Accueil DevEarn">
        <span class="brand-mark" aria-hidden="true">
          <span class="brand-dev">Dev</span><span class="brand-amp">&amp;</span><span class="brand-earn">Earn</span>
        </span>
      </a>
      <nav class="main-nav" aria-label="Navigation principale">
        <button class="nav-toggle" type="button" aria-label="Ouvrir le menu">
          <span></span><span></span><span></span>
        </button>
        <ul class="nav-list">{links}
        </ul>
      </nav>
      <div class="header-actions">
        <button class="theme-toggle" type="button" aria-label="Basculer le thème">
          <span class="theme-toggle-icon">◐</span>
        </button>
        <a href="./login.html" class="btn btn-ghost">Connexion</a>
        <a href="./register.html" class="btn btn-primary">Inscription</a>
      </div>
    </div>
  </header>"""

FOOTER_HOME = """  <footer class="site-footer">
    <div class="container footer-inner">
      <div class="footer-brand">
        <a href="./index.html" class="brand footer-brand-link" aria-label="Accueil DevEarn">
          <span class="brand-mark" aria-hidden="true">
            <span class="brand-dev">Dev</span><span class="brand-amp">&amp;</span><span class="brand-earn">Earn</span>
          </span>
        </a>
        <p>Plateforme marocaine de talents IT.</p>
      </div>
      <div class="footer-links-group">
        <span class="footer-title">Navigation</span>
        <a href="./projects.html">Projets</a>
        <a href="./student-space.html">Étudiants</a>
        <a href="./client-space.html">Entreprises</a>
        <a href="./dashboard.html">Dashboard</a>
      </div>
      <div class="footer-links-group">
        <span class="footer-title">Accès</span>
        <a href="./login.html">Connexion</a>
        <a href="./register.html">Inscription</a>
        <a href="./post-project.html">Publier un projet</a>
      </div>
    </div>
  </footer>"""

MODALS = """  <!-- MODAL : CONNEXION -->
  <div class="modal-overlay" id="login-modal" aria-hidden="true">
    <div class="modal-card glass-card">
      <button type="button" class="modal-close" aria-label="Fermer">&times;</button>
      <h2>Connexion</h2>
      <p>Accédez à votre espace DevEarn.</p>
      <form class="modal-form" action="#" method="post">
        <div class="floating-group">
          <input type="email" id="modal-login-email" name="email" placeholder=" " required />
          <label for="modal-login-email">Email</label>
        </div>
        <div class="floating-group">
          <input type="password" id="modal-login-password" name="password" placeholder=" " required />
          <label for="modal-login-password">Mot de passe</label>
        </div>
        <div class="modal-row">
          <label class="check-inline">
            <input type="checkbox" name="remember_me" />
            <span>Se souvenir de moi</span>
          </label>
          <a href="#" class="text-link-sm">Mot de passe oublié ?</a>
        </div>
        <button type="submit" class="btn-hero btn-hero-full">Se connecter <span class="btn-hero-arrow">→</span></button>
      </form>
      <div class="modal-footer-note">
        <span>Pas de compte ?</span>
        <button type="button" class="text-link-sm" data-switch-modal="register-modal">Créer un compte</button>
      </div>
    </div>
  </div>

  <!-- MODAL : INSCRIPTION -->
  <div class="modal-overlay" id="register-modal" aria-hidden="true">
    <div class="modal-card glass-card">
      <button type="button" class="modal-close" aria-label="Fermer">&times;</button>
      <h2>Inscription</h2>
      <p>Rejoignez la plateforme DevEarn.</p>
      <form class="modal-form" action="#" method="post">
        <div class="modal-form-row">
          <div class="floating-group">
            <input type="text" id="modal-reg-firstname" name="firstname" placeholder=" " required />
            <label for="modal-reg-firstname">Prénom</label>
          </div>
          <div class="floating-group">
            <input type="text" id="modal-reg-lastname" name="lastname" placeholder=" " required />
            <label for="modal-reg-lastname">Nom</label>
          </div>
        </div>
        <div class="floating-group">
          <input type="email" id="modal-reg-email" name="email" placeholder=" " required />
          <label for="modal-reg-email">Email</label>
        </div>
        <div class="floating-group">
          <select id="modal-reg-role" name="role" required>
            <option value="" disabled selected></option>
            <option>Étudiant</option>
            <option>Client / Entreprise</option>
            <option>Mentor / Lauréat</option>
          </select>
          <label for="modal-reg-role">Type de profil</label>
        </div>
        <div class="floating-group">
          <input type="password" id="modal-reg-password" name="password" placeholder=" " required />
          <label for="modal-reg-password">Mot de passe</label>
        </div>
        <div class="floating-group">
          <input type="password" id="modal-reg-password-confirm" name="password_confirm" placeholder=" " required />
          <label for="modal-reg-password-confirm">Confirmer</label>
        </div>
        <label class="check-inline">
          <input type="checkbox" name="terms" required />
          <span>J'accepte les conditions d'utilisation.</span>
        </label>
        <button type="submit" class="btn-hero btn-hero-full">Créer mon compte <span class="btn-hero-arrow">→</span></button>
      </form>
      <div class="modal-footer-note">
        <span>Déjà inscrit ?</span>
        <button type="button" class="text-link-sm" data-switch-modal="login-modal">Se connecter</button>
      </div>
    </div>
  </div>"""

# ─────────────────────────────────────────────────────────────────
#  INDEX.HTML  — Marquee now BELOW hero buttons
# ─────────────────────────────────────────────────────────────────
index_html = f"""<!DOCTYPE html>
<html lang="fr" data-theme="dark">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>DevEarn — Talents IT &amp; projets réels</title>
  <meta name="description" content="DevEarn connecte les étudiants IT et les entreprises autour de missions réelles et rémunérées." />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="./css/global.css" />
  <link rel="stylesheet" href="./css/home.css" />
</head>

<body class="home-page">
  <a href="#main-content" class="skip-link">Aller au contenu principal</a>

{nav_for("home")}

  <main id="main-content">

    <!-- HERO -->
    <section class="hero-section">
      <div class="hero-backdrop"></div>
      <div class="container hero-content-centered">
        <p class="hero-eyebrow">La plateforme IT marocaine</p>
        <div class="hero-typed-box">
          <h1 id="typed-slogan" class="typed-slogan"></h1>
        </div>
        <p class="hero-subtitle">Projets réels · Talents vérifiés · Résultats concrets</p>
        <div class="hero-actions">
          <a href="./student-space.html" class="btn-hero">
            Espace Étudiant
            <span class="btn-hero-arrow">→</span>
          </a>
          <a href="./post-project.html" class="btn-hero btn-hero-outline">
            Déposer un projet
            <span class="btn-hero-arrow">→</span>
          </a>
        </div>
      </div>
    </section>

    <!-- MARQUEE PARTENAIRES & ENTREPRISES — sous les boutons -->
    <section class="partners-section bottom-marquee" aria-label="Partenaires et entreprises">
      <div class="marquee-label">Partenaires &amp; entreprises partenaires</div>
      <div class="marquee-wrapper">
        <div class="marquee-track">
          <div class="marquee-content">
            <img src="./assets/images/INPT.svg" alt="INPT" class="partner-logo" />
            <img src="./assets/images/ANRT.svg" alt="ANRT" class="partner-logo" />
            <img src="./assets/images/Centre régional d'investissement - Maroc.svg" alt="CRI Maroc" class="partner-logo" />
            <img src="./assets/images/ENTR/Attijariwafa Bank.svg" alt="Attijariwafa" class="partner-logo" />
            <img src="./assets/images/ENTR/BCP  Banque Populaire du Maroc.svg" alt="BCP" class="partner-logo" />
            <img src="./assets/images/ENTR/Bank al maghrib بنك المغرب.svg" alt="Bank Al Maghrib" class="partner-logo" />
            <img src="./assets/images/ENTR/CDG.svg" alt="CDG" class="partner-logo" />
            <img src="./assets/images/ENTR/CIH Bank.svg" alt="CIH" class="partner-logo" />
            <img src="./assets/images/ENTR/Inwi.svg" alt="Inwi" class="partner-logo" />
            <img src="./assets/images/ENTR/Maroc Telecom Logo (2025).svg" alt="Maroc Telecom" class="partner-logo" />
            <img src="./assets/images/ENTR/Orange.svg" alt="Orange" class="partner-logo" />
            <img src="./assets/images/ENTR/Safran.svg" alt="Safran" class="partner-logo" />
            <img src="./assets/images/ENTR/bank of africa logo.svg" alt="BOA" class="partner-logo" />
            <img src="./assets/images/ENTR/cfg bank.svg" alt="CFG" class="partner-logo" />
            <img src="./assets/images/ENTR/TGCC.svg" alt="TGCC" class="partner-logo" />
            <img src="./assets/images/ENTR/Dsys Maroc.svg" alt="Dsys" class="partner-logo" />
          </div>
          <!-- Duplicate for seamless loop -->
          <div class="marquee-content" aria-hidden="true">
            <img src="./assets/images/INPT.svg" alt="" class="partner-logo" />
            <img src="./assets/images/ANRT.svg" alt="" class="partner-logo" />
            <img src="./assets/images/Centre régional d'investissement - Maroc.svg" alt="" class="partner-logo" />
            <img src="./assets/images/ENTR/Attijariwafa Bank.svg" alt="" class="partner-logo" />
            <img src="./assets/images/ENTR/BCP  Banque Populaire du Maroc.svg" alt="" class="partner-logo" />
            <img src="./assets/images/ENTR/Bank al maghrib بنك المغرب.svg" alt="" class="partner-logo" />
            <img src="./assets/images/ENTR/CDG.svg" alt="" class="partner-logo" />
            <img src="./assets/images/ENTR/CIH Bank.svg" alt="" class="partner-logo" />
            <img src="./assets/images/ENTR/Inwi.svg" alt="" class="partner-logo" />
            <img src="./assets/images/ENTR/Maroc Telecom Logo (2025).svg" alt="" class="partner-logo" />
            <img src="./assets/images/ENTR/Orange.svg" alt="" class="partner-logo" />
            <img src="./assets/images/ENTR/Safran.svg" alt="" class="partner-logo" />
            <img src="./assets/images/ENTR/bank of africa logo.svg" alt="" class="partner-logo" />
            <img src="./assets/images/ENTR/cfg bank.svg" alt="" class="partner-logo" />
            <img src="./assets/images/ENTR/TGCC.svg" alt="" class="partner-logo" />
            <img src="./assets/images/ENTR/Dsys Maroc.svg" alt="" class="partner-logo" />
          </div>
        </div>
      </div>
    </section>

    <!-- PROJETS À LA UNE -->
    <section class="showcase-section section-spacing">
      <div class="container">
        <div class="section-heading-row">
          <div>
            <h2 class="section-title typed-section-title" data-typed="Projets à la une"></h2>
            <p class="section-subtitle">Missions récentes publiées par nos entreprises partenaires.</p>
          </div>
          <a href="./projects.html" class="btn btn-outline">Tous les projets</a>
        </div>
        <div class="showcase-grid">
          <article class="glass-card showcase-card">
            <div class="showcase-top">
              <span class="badge premium">Top Rated</span>
              <span class="showcase-price">25k–40k MAD</span>
            </div>
            <h3>Prédiction de churn client</h3>
            <p>Pipeline data complet et dashboard KPI pour une PME retail.</p>
            <div class="showcase-meta">
              <span>Data / IA</span><span>•</span><span>2 Semaines</span>
            </div>
          </article>
          <article class="glass-card showcase-card">
            <div class="showcase-top">
              <span class="badge hot">Hot</span>
              <span class="showcase-price">10k–15k MAD</span>
            </div>
            <h3>Refonte UX/UI application mobile</h3>
            <p>Design system et parcours utilisateur pour une app santé.</p>
            <div class="showcase-meta">
              <span>Design UI/UX</span><span>•</span><span>1 Mois</span>
            </div>
          </article>
          <article class="glass-card showcase-card">
            <div class="showcase-top">
              <span class="badge new">Nouveau</span>
              <span class="showcase-price">À négocier</span>
            </div>
            <h3>Audit de sécurité plateforme Web</h3>
            <p>Analyse de vulnérabilités et rapport détaillé pour une fintech.</p>
            <div class="showcase-meta">
              <span>Cybersécurité</span><span>•</span><span>10 Jours</span>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- TOP TALENTS -->
    <section class="showcase-section section-spacing">
      <div class="container">
        <div class="section-heading-row">
          <div>
            <h2 class="section-title typed-section-title" data-typed="Top Talents DevEarn"></h2>
            <p class="section-subtitle">Les profils étudiants les plus performants de la plateforme.</p>
          </div>
          <a href="./student-space.html" class="btn btn-outline">Explorer les talents</a>
        </div>
        <div class="showcase-grid">
          <article class="glass-card talent-card">
            <div class="talent-avatar">IB</div>
            <h3>Ilyas Bejja</h3>
            <p class="talent-role">ML Engineer · Data Science</p>
            <div class="talent-stats">
              <div><strong>4.94 ★</strong><span>Note</span></div>
              <div><strong>18</strong><span>Projets</span></div>
              <div><strong>Top 2%</strong><span>Rang</span></div>
            </div>
          </article>
          <article class="glass-card talent-card">
            <div class="talent-avatar alt">SA</div>
            <h3>Salma Ait</h3>
            <p class="talent-role">UX/UI Designer · Product</p>
            <div class="talent-stats">
              <div><strong>4.88 ★</strong><span>Note</span></div>
              <div><strong>12</strong><span>Projets</span></div>
              <div><strong>Fast</strong><span>Livraison</span></div>
            </div>
          </article>
          <article class="glass-card talent-card">
            <div class="talent-avatar alt-2">YM</div>
            <h3>Youssef M.</h3>
            <p class="talent-role">Full Stack Dev · Automation</p>
            <div class="talent-stats">
              <div><strong>4.82 ★</strong><span>Note</span></div>
              <div><strong>15</strong><span>Projets</span></div>
              <div><strong>Fiable</strong><span>Badge</span></div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- CTA FINAL -->
    <section class="cta-section section-spacing">
      <div class="container cta-centered">
        <h2>Prêt à commencer ?</h2>
        <p>Rejoignez DevEarn et transformez vos compétences en opportunités réelles.</p>
        <div class="hero-actions">
          <a href="./student-space.html" class="btn-hero">
            Espace Étudiant <span class="btn-hero-arrow">→</span>
          </a>
          <a href="./post-project.html" class="btn-hero btn-hero-outline">
            Déposer un projet <span class="btn-hero-arrow">→</span>
          </a>
        </div>
      </div>
    </section>

  </main>

{FOOTER_HOME}

{MODALS}

  <script src="./js/main.js"></script>
  <script src="./js/home.js"></script>
</body>

</html>
"""

# ─────────────────────────────────────────────────────────────────
#  PROJECTS.HTML  — Fully rebuilt, bugs fixed
# ─────────────────────────────────────────────────────────────────
projects_html = f"""<!DOCTYPE html>
<html lang="fr" data-theme="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>DevEarn — Projets</title>
  <meta name="description" content="Explorez les projets tendances, missions bien notées et opportunités à fort impact sur DevEarn." />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="./css/global.css" />
  <link rel="stylesheet" href="./css/projects.css" />
</head>
<body class="projects-page">
  <a href="#main-content" class="skip-link">Aller au contenu principal</a>

{nav_for("projects")}

  <main id="main-content">

    <!-- PAGE HERO -->
    <section class="page-hero">
      <div class="container page-hero-inner">
        <p class="page-hero-eyebrow">Missions disponibles</p>
        <div class="page-typed-box">
          <h1 id="typed-projects" class="page-typed-slogan"></h1>
        </div>
        <p class="page-hero-sub">Filtrez par catégorie ou niveau pour trouver la mission qui vous correspond.</p>
      </div>
    </section>

    <!-- FILTRES -->
    <section class="filters-section">
      <div class="container">
        <div class="filters-bar">
          <div class="filters-group">
            <button class="filter-chip is-active" data-filter="all">Tous</button>
            <button class="filter-chip" data-filter="web">Web</button>
            <button class="filter-chip" data-filter="data">Data / IA</button>
            <button class="filter-chip" data-filter="design">Design</button>
            <button class="filter-chip" data-filter="cyber">Cybersécurité</button>
            <button class="filter-chip" data-filter="automation">Automatisation</button>
          </div>
          <div class="filters-group">
            <button class="filter-chip level-chip is-active" data-level="all">Tous niveaux</button>
            <button class="filter-chip level-chip" data-level="junior">Junior</button>
            <button class="filter-chip level-chip" data-level="intermediate">Intermédiaire</button>
            <button class="filter-chip level-chip" data-level="advanced">Avancé</button>
          </div>
        </div>
        <span class="results-counter" id="results-counter">6 projets affichés</span>
      </div>
    </section>

    <!-- GRILLE PROJETS -->
    <section class="trending-projects section-spacing">
      <div class="container">
        <div class="projects-grid" id="projects-grid">

          <article class="project-card glass-card" data-category="web" data-level="intermediate">
            <div class="project-top">
              <span class="project-tag hot">Hot</span>
              <span class="project-rating">4.8 ★</span>
            </div>
            <h3>Refonte plateforme vitrine pour PME</h3>
            <p>Refonte complète d'un site web corporate avec dashboard simple et optimisation UX.</p>
            <div class="project-meta">
              <span>Web</span><span>·</span><span>Intermédiaire</span>
            </div>
            <div class="project-stats">
              <div><strong>23</strong><span>candidatures</span></div>
              <div><strong>5</strong><span>shortlistés</span></div>
              <div><strong>92%</strong><span>matching</span></div>
            </div>
            <a href="./post-project.html" class="text-link">Voir le projet</a>
          </article>

          <article class="project-card glass-card" data-category="data" data-level="advanced">
            <div class="project-top">
              <span class="project-tag premium">Top Rated</span>
              <span class="project-rating">4.9 ★</span>
            </div>
            <h3>Prédiction de churn client avec dashboard analytique</h3>
            <p>Pipeline data, modélisation prédictive et restitution visuelle des résultats.</p>
            <div class="project-meta">
              <span>Data / IA</span><span>·</span><span>Avancé</span>
            </div>
            <div class="project-stats">
              <div><strong>17</strong><span>candidatures</span></div>
              <div><strong>3</strong><span>retenus</span></div>
              <div><strong>95%</strong><span>satisfaction</span></div>
            </div>
            <a href="./post-project.html" class="text-link">Voir le projet</a>
          </article>

          <article class="project-card glass-card" data-category="design" data-level="junior">
            <div class="project-top">
              <span class="project-tag amber">Impact</span>
              <span class="project-rating">4.7 ★</span>
            </div>
            <h3>Prototype mobile UX pour application santé</h3>
            <p>Conception d'écrans mobiles, parcours utilisateur et système visuel cohérent.</p>
            <div class="project-meta">
              <span>UI/UX Design</span><span>·</span><span>Junior</span>
            </div>
            <div class="project-stats">
              <div><strong>29</strong><span>vues</span></div>
              <div><strong>11</strong><span>likes</span></div>
              <div><strong>89%</strong><span>engagement</span></div>
            </div>
            <a href="./post-project.html" class="text-link">Voir le projet</a>
          </article>

          <article class="project-card glass-card" data-category="cyber" data-level="advanced">
            <div class="project-top">
              <span class="project-tag hot">Critical</span>
              <span class="project-rating">4.9 ★</span>
            </div>
            <h3>Audit sécurité pour portail interne</h3>
            <p>Analyse de vulnérabilités et rapport de recommandations actionnable.</p>
            <div class="project-meta">
              <span>Cybersécurité</span><span>·</span><span>Avancé</span>
            </div>
            <div class="project-stats">
              <div><strong>12</strong><span>candidatures</span></div>
              <div><strong>2</strong><span>experts ciblés</span></div>
              <div><strong>97%</strong><span>priorité</span></div>
            </div>
            <a href="./post-project.html" class="text-link">Voir le projet</a>
          </article>

          <article class="project-card glass-card" data-category="automation" data-level="intermediate">
            <div class="project-top">
              <span class="project-tag premium">Fast Win</span>
              <span class="project-rating">4.6 ★</span>
            </div>
            <h3>Automatisation de reporting Excel et emailing</h3>
            <p>Automatiser le traitement de fichiers et l'envoi de rapports périodiques.</p>
            <div class="project-meta">
              <span>Automatisation</span><span>·</span><span>Intermédiaire</span>
            </div>
            <div class="project-stats">
              <div><strong>18</strong><span>candidatures</span></div>
              <div><strong>8</strong><span>compatibles</span></div>
              <div><strong>86%</strong><span>rapidité</span></div>
            </div>
            <a href="./post-project.html" class="text-link">Voir le projet</a>
          </article>

          <article class="project-card glass-card" data-category="web" data-level="junior">
            <div class="project-top">
              <span class="project-tag amber">Starter</span>
              <span class="project-rating">4.5 ★</span>
            </div>
            <h3>Mini-site événementiel pour association</h3>
            <p>Site élégant avec formulaire, page programme et adaptation mobile.</p>
            <div class="project-meta">
              <span>Web</span><span>·</span><span>Junior</span>
            </div>
            <div class="project-stats">
              <div><strong>31</strong><span>candidatures</span></div>
              <div><strong>14</strong><span>intéressés</span></div>
              <div><strong>83%</strong><span>accessibilité</span></div>
            </div>
            <a href="./post-project.html" class="text-link">Voir le projet</a>
          </article>

        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta-section section-spacing">
      <div class="container">
        <div class="cta-panel glass-card">
          <div class="cta-copy">
            <h2>Publiez une mission ou candidatez dès maintenant</h2>
            <p>DevEarn met en avant les projets à potentiel et valorise concrètement les talents étudiants.</p>
          </div>
          <div class="cta-actions">
            <a href="./post-project.html" class="btn btn-primary btn-lg">Déposer un projet</a>
            <a href="./student-profile.html" class="btn btn-secondary btn-lg">Voir les profils</a>
          </div>
        </div>
      </div>
    </section>

  </main>

  <footer class="site-footer">
    <div class="container footer-inner">
      <div class="footer-brand">
        <a href="./index.html" class="brand footer-brand-link" aria-label="Accueil DevEarn">
          <span class="brand-mark" aria-hidden="true">
            <span class="brand-dev">Dev</span><span class="brand-amp">&amp;</span><span class="brand-earn">Earn</span>
          </span>
        </a>
        <p>Explorez les missions, comparez les projets et accédez aux opportunités à fort impact.</p>
      </div>
      <div class="footer-links-group">
        <span class="footer-title">Plateforme</span>
        <a href="./index.html">Accueil</a>
        <a href="./projects.html" class="is-current">Projets</a>
        <a href="./dashboard.html">Dashboard</a>
        <a href="./post-project.html">Publier un projet</a>
      </div>
      <div class="footer-links-group">
        <span class="footer-title">Profils</span>
        <a href="./student-space.html">Espace Étudiant</a>
        <a href="./client-space.html">Espace Entreprise</a>
        <a href="./student-profile.html">Profil étudiant</a>
        <a href="./register.html">Inscription</a>
      </div>
    </div>
  </footer>

  <script src="./js/main.js"></script>
  <script src="./js/projects.js"></script>
</body>
</html>
"""

# ─────────────────────────────────────────────────────────────────
#  STUDENT-SPACE.HTML  — Fixed (the nav was corrupted)
# ─────────────────────────────────────────────────────────────────
student_html = f"""<!DOCTYPE html>
<html lang="fr" data-theme="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>DevEarn — Espace Étudiant</title>
  <meta name="description" content="Tableau de bord étudiant DevEarn : candidatures, projets recommandés, progression, badges et portfolio." />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="./css/global.css" />
  <link rel="stylesheet" href="./css/student-space.css" />
</head>
<body class="student-space-page">
  <a href="#main-content" class="skip-link">Aller au contenu principal</a>

{nav_for("students")}

  <main id="main-content">

    <!-- PAGE HERO -->
    <section class="page-hero">
      <div class="container page-hero-inner">
        <p class="page-hero-eyebrow">Espace Personnel</p>
        <div class="page-typed-box">
          <h1 id="typed-students" class="page-typed-slogan"></h1>
        </div>
        <p class="page-hero-sub">Gérez vos candidatures, suivez votre progression et accédez aux meilleures missions.</p>
      </div>
    </section>

    <!-- KPI RAPIDES -->
    <section class="student-kpi section-spacing">
      <div class="container">
        <div class="kpi-grid">
          <article class="kpi-card glass-card">
            <span class="kpi-label">Candidatures</span>
            <strong class="kpi-value">27</strong>
            <p>Envoyées sur les derniers cycles</p>
          </article>
          <article class="kpi-card glass-card">
            <span class="kpi-label">Shortlists</span>
            <strong class="kpi-value">08</strong>
            <p>Projets où le profil a été retenu</p>
          </article>
          <article class="kpi-card glass-card">
            <span class="kpi-label">Matching</span>
            <strong class="kpi-value">87%</strong>
            <p>Alignement compétences / projets</p>
          </article>
          <article class="kpi-card glass-card">
            <span class="kpi-label">Badges</span>
            <strong class="kpi-value">12</strong>
            <p>Débloqués — fiabilité &amp; impact</p>
          </article>
        </div>
      </div>
    </section>

    <!-- TABLEAU DE BORD PRINCIPAL -->
    <section class="student-main-board section-spacing">
      <div class="container board-grid">
        <div class="board-column-main">

          <!-- Projets recommandés -->
          <div class="panel-card glass-card">
            <div class="panel-header">
              <div>
                <span class="section-chip">Projets recommandés</span>
                <h2>Opportunités alignées avec votre profil</h2>
              </div>
              <a href="./projects.html" class="text-link">Voir tout</a>
            </div>
            <div class="recommended-list">
              <article class="recommended-card">
                <div class="recommended-top">
                  <span class="recommended-tag">95% match</span>
                  <span class="recommended-level">Avancé</span>
                </div>
                <h3>Fine-tuning LLM pour domaine spécialisé</h3>
                <p>Aligné avec vos compétences en NLP, PEFT et optimisation de modèles.</p>
                <div class="recommended-footer">
                  <span>NLP / LLM</span><span>Budget premium</span><span>2 semaines</span>
                </div>
              </article>
              <article class="recommended-card">
                <div class="recommended-top">
                  <span class="recommended-tag">90% match</span>
                  <span class="recommended-level">Intermédiaire</span>
                </div>
                <h3>Dashboard analytique pour KPI business</h3>
                <p>Adapté à vos compétences en data visualisation et restitution claire.</p>
                <div class="recommended-footer">
                  <span>Dashboard</span><span>Client PME</span><span>10 jours</span>
                </div>
              </article>
              <article class="recommended-card">
                <div class="recommended-top">
                  <span class="recommended-tag">88% match</span>
                  <span class="recommended-level">Avancé</span>
                </div>
                <h3>Pipeline de classification pour données métiers</h3>
                <p>ML appliqué avec préparation, évaluation et documentation complète.</p>
                <div class="recommended-footer">
                  <span>Data / IA</span><span>Modèle + rapport</span><span>12 jours</span>
                </div>
              </article>
            </div>
          </div>

          <!-- Candidatures -->
          <div class="panel-card glass-card">
            <div class="panel-header">
              <div>
                <span class="section-chip">Mes candidatures</span>
                <h2>Suivi de vos propositions</h2>
              </div>
              <a href="./projects.html" class="text-link">Trouver d'autres projets</a>
            </div>
            <div class="application-table">
              <div class="table-row table-head">
                <span>Projet</span><span>Catégorie</span><span>Statut</span><span>Date</span>
              </div>
              <div class="table-row">
                <span>Audit data pipeline</span><span>Data</span>
                <span class="status-badge pending">En revue</span><span>24 Mai</span>
              </div>
              <div class="table-row">
                <span>Dashboard RH</span><span>Analytics</span>
                <span class="status-badge accepted">Shortlist</span><span>23 Mai</span>
              </div>
              <div class="table-row">
                <span>Prototype LLM santé</span><span>NLP</span>
                <span class="status-badge active">Entretien</span><span>22 Mai</span>
              </div>
              <div class="table-row">
                <span>Refonte site startup</span><span>Web</span>
                <span class="status-badge rejected">Clôturé</span><span>20 Mai</span>
              </div>
            </div>
          </div>

        </div>

        <aside class="board-column-side">
          <!-- Progression -->
          <div class="panel-card glass-card">
            <div class="panel-header">
              <div>
                <span class="section-chip">Progression</span>
                <h2>Niveau du profil</h2>
              </div>
            </div>
            <div class="level-box">
              <span class="level-title">Level 07 · Expert Track</span>
              <strong>2 420 XP</strong>
              <p>Encore 180 XP pour le niveau suivant.</p>
            </div>
            <div class="progress-block">
              <div class="progress-meta"><span>Réputation</span><span>91%</span></div>
              <div class="progress-bar"><span style="width: 91%"></span></div>
            </div>
            <div class="progress-block">
              <div class="progress-meta"><span>Complétion profil</span><span>96%</span></div>
              <div class="progress-bar"><span style="width: 96%"></span></div>
            </div>
            <div class="progress-block">
              <div class="progress-meta"><span>Match moyen</span><span>87%</span></div>
              <div class="progress-bar"><span style="width: 87%"></span></div>
            </div>
          </div>

          <!-- Badges -->
          <div class="panel-card glass-card">
            <div class="panel-header">
              <div>
                <span class="section-chip">Badges</span>
                <h2>Récompenses actives</h2>
              </div>
            </div>
            <div class="badge-list">
              <span class="badge-pill">Top Rated</span>
              <span class="badge-pill">Reliable</span>
              <span class="badge-pill">Fast Responder</span>
              <span class="badge-pill">NLP Expert</span>
              <span class="badge-pill">Data Driven</span>
              <span class="badge-pill">Strong Delivery</span>
            </div>
          </div>

          <!-- Portfolio -->
          <div class="panel-card glass-card">
            <div class="panel-header">
              <div>
                <span class="section-chip">Portfolio</span>
                <h2>Derniers livrables</h2>
              </div>
            </div>
            <div class="mini-portfolio-list">
              <article class="mini-portfolio-card">
                <strong>Dashboard performance</strong>
                <p>Visualisation KPI pour une PME.</p>
              </article>
              <article class="mini-portfolio-card">
                <strong>LLM domain adaptation</strong>
                <p>Adaptation d'un modèle pour besoin ciblé.</p>
              </article>
              <article class="mini-portfolio-card">
                <strong>Classification pipeline</strong>
                <p>Pipeline ML avec métriques et synthèse.</p>
              </article>
            </div>
            <a href="./student-profile.html" class="btn btn-secondary portfolio-btn">Voir mon profil complet</a>
          </div>
        </aside>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta-section section-spacing">
      <div class="container">
        <div class="cta-panel glass-card">
          <div class="cta-copy">
            <h2>Construisez votre réputation avec des livrables concrets</h2>
            <p>DevEarn transforme votre espace en hub de progression : projets, badges et opportunités réelles.</p>
          </div>
          <div class="cta-actions">
            <a href="./projects.html" class="btn btn-primary btn-lg">Candidater à un projet</a>
            <a href="./student-profile.html" class="btn btn-secondary btn-lg">Optimiser mon profil</a>
          </div>
        </div>
      </div>
    </section>

  </main>

  <footer class="site-footer">
    <div class="container footer-inner">
      <div class="footer-brand">
        <a href="./index.html" class="brand footer-brand-link" aria-label="Accueil DevEarn">
          <span class="brand-mark" aria-hidden="true">
            <span class="brand-dev">Dev</span><span class="brand-amp">&amp;</span><span class="brand-earn">Earn</span>
          </span>
        </a>
        <p>Pilotez vos candidatures, réputation et progression sur DevEarn.</p>
      </div>
      <div class="footer-links-group">
        <span class="footer-title">Explorer</span>
        <a href="./projects.html">Projets</a>
        <a href="./student-profile.html">Profil étudiant</a>
        <a href="./dashboard.html">Dashboard</a>
        <a href="./index.html">Accueil</a>
      </div>
      <div class="footer-links-group">
        <span class="footer-title">Actions</span>
        <a href="./post-project.html">Publier un projet</a>
        <a href="./client-space.html">Espace Entreprise</a>
        <a href="./register.html">Inscription</a>
        <a href="./login.html">Connexion</a>
      </div>
    </div>
  </footer>

  <script src="./js/main.js"></script>
</body>
</html>
"""

# ─────────────────────────────────────────────────────────────────
#  WRITE ALL FILES
# ─────────────────────────────────────────────────────────────────
files = {
    "index.html": index_html,
    "projects.html": projects_html,
    "student-space.html": student_html,
}

for fname, content in files.items():
    path = os.path.join(BASE, fname)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Written: {fname}")

print("\\nAll files updated successfully!")
