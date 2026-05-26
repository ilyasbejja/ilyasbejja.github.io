import os

BASE = r'c:\Users\ilyas\OneDrive\Desktop\java2\web\devearn'

def nav_for(page):
    pages = {
        'home': ('./index.html', 'Accueil'),
        'projects': ('./projects.html', 'Projets'),
        'students': ('./student-space.html', 'Étudiants'),
        'client': ('./client-space.html', 'Entreprises'),
        'dashboard': ('./dashboard.html', 'Dashboard'),
    }
    links = ''
    for key, (href, label) in pages.items():
        active = ' class="is-current"' if key == page else ''
        links += f'\n          <li><a href="{href}"{active}>{label}</a></li>'
    return f'''  <header class="site-header">
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
        <button type="button" class="btn btn-ghost" data-open-modal="login-modal">Connexion</button>
        <button type="button" class="btn btn-primary" data-open-modal="register-modal">Inscription</button>
      </div>
    </div>
  </header>'''

FOOTER_HOME = '''  <footer class="site-footer">
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
        <button type="button" class="text-link-sm" data-open-modal="login-modal">Connexion</button>
        <button type="button" class="text-link-sm" data-open-modal="register-modal">Inscription</button>
        <a href="./post-project.html">Publier un projet</a>
      </div>
    </div>
  </footer>'''

login_html = f'''<!DOCTYPE html>
<html lang="fr" data-theme="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>DevEarn — Connexion</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="./css/global.css" />
  <link rel="stylesheet" href="./css/auth.css" />
</head>
<body class="auth-page">
{nav_for('home')}
  <main id="main-content">
    <section class="auth-section">
      <div class="container auth-container">
        <div class="auth-card glass-card">
          <h2>Connexion</h2>
          <p>Accédez à votre espace personnel DevEarn.</p>
          <form class="auth-form" action="#" method="post">
            <div class="floating-group">
              <input type="email" id="login-email" name="email" placeholder=" " required />
              <label for="login-email">Email</label>
            </div>
            <div class="floating-group">
              <input type="password" id="login-password" name="password" placeholder=" " required />
              <label for="login-password">Mot de passe</label>
            </div>
            <div class="auth-row">
              <label class="check-inline">
                <input type="checkbox" name="remember_me" />
                <span>Se souvenir de moi</span>
              </label>
              <a href="#" class="text-link-sm">Oublié ?</a>
            </div>
            <button type="submit" class="btn-hero btn-hero-full">Se connecter <span class="btn-hero-arrow">→</span></button>
          </form>
          <div class="auth-footer-note">
            <span>Pas de compte ?</span>
            <a href="./register.html" class="text-link-sm">Créer un compte</a>
          </div>
        </div>
      </div>
    </section>
  </main>
{FOOTER_HOME}
  <script src="./js/main.js"></script>
</body>
</html>'''

register_html = f'''<!DOCTYPE html>
<html lang="fr" data-theme="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>DevEarn — Inscription</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="./css/global.css" />
  <link rel="stylesheet" href="./css/auth.css" />
</head>
<body class="auth-page">
{nav_for('home')}
  <main id="main-content">
    <section class="auth-section">
      <div class="container auth-container">
        <div class="auth-card glass-card">
          <h2>Inscription</h2>
          <p>Rejoignez DevEarn et accédez aux meilleures opportunités.</p>
          <form class="auth-form" action="#" method="post">
            <div class="auth-form-row">
              <div class="floating-group">
                <input type="text" id="reg-firstname" name="firstname" placeholder=" " required />
                <label for="reg-firstname">Prénom</label>
              </div>
              <div class="floating-group">
                <input type="text" id="reg-lastname" name="lastname" placeholder=" " required />
                <label for="reg-lastname">Nom</label>
              </div>
            </div>
            <div class="floating-group">
              <input type="email" id="reg-email" name="email" placeholder=" " required />
              <label for="reg-email">Email</label>
            </div>
            <div class="floating-group">
              <select id="reg-role" name="role" required>
                <option value="" disabled selected></option>
                <option>Étudiant</option>
                <option>Client / Entreprise</option>
              </select>
              <label for="reg-role">Type de profil</label>
            </div>
            <div class="floating-group">
              <input type="password" id="reg-password" name="password" placeholder=" " required />
              <label for="reg-password">Mot de passe</label>
            </div>
            <div class="floating-group">
              <input type="password" id="reg-password-confirm" name="password_confirm" placeholder=" " required />
              <label for="reg-password-confirm">Confirmer</label>
            </div>
            <label class="check-inline">
              <input type="checkbox" name="terms" required />
              <span>J'accepte les conditions d'utilisation.</span>
            </label>
            <button type="submit" class="btn-hero btn-hero-full">Créer mon compte <span class="btn-hero-arrow">→</span></button>
          </form>
          <div class="auth-footer-note">
            <span>Déjà inscrit ?</span>
            <a href="./login.html" class="text-link-sm">Se connecter</a>
          </div>
        </div>
      </div>
    </section>
  </main>
{FOOTER_HOME}
  <script src="./js/main.js"></script>
</body>
</html>'''

post_project_html = f'''<!DOCTYPE html>
<html lang="fr" data-theme="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>DevEarn — Déposer un Projet</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="./css/global.css" />
  <link rel="stylesheet" href="./css/post-project.css" />
</head>
<body class="post-project-page">
{nav_for('client')}
  <main id="main-content">
    <section class="page-hero">
      <div class="container page-hero-inner">
        <p class="page-hero-eyebrow">Publication</p>
        <div class="page-typed-box">
          <h1 id="typed-post" class="page-typed-slogan"></h1>
        </div>
        <p class="page-hero-sub">Décrivez votre besoin pour trouver les meilleurs talents IT du Maroc.</p>
      </div>
    </section>

    <section class="post-form-section section-spacing">
      <div class="container">
        <div class="form-wrapper glass-card">
          <form class="post-project-form" action="#" method="post">
            <div class="form-group">
              <label for="project-title">Titre du projet</label>
              <input type="text" id="project-title" name="title" placeholder="Ex: Refonte UX/UI application mobile" required />
            </div>
            
            <div class="form-group-row">
              <div class="form-group">
                <label for="project-category">Catégorie</label>
                <select id="project-category" name="category" required>
                  <option value="" disabled selected>Choisir...</option>
                  <option>Développement Web</option>
                  <option>Data / IA</option>
                  <option>Design UI/UX</option>
                  <option>Cybersécurité</option>
                  <option>Automatisation</option>
                </select>
              </div>
              <div class="form-group">
                <label for="project-budget">Budget (MAD)</label>
                <input type="text" id="project-budget" name="budget" placeholder="Ex: 10k - 15k" required />
              </div>
            </div>

            <div class="form-group">
              <label for="project-desc">Description de la mission</label>
              <textarea id="project-desc" name="description" rows="5" placeholder="Décrivez les objectifs, livrables attendus..." required></textarea>
            </div>

            <div class="form-group">
              <label for="project-skills">Compétences requises</label>
              <input type="text" id="project-skills" name="skills" placeholder="Ex: React, Node.js, Figma..." required />
            </div>

            <button type="submit" class="btn-hero btn-hero-full">Publier le projet <span class="btn-hero-arrow">→</span></button>
          </form>
        </div>
      </div>
    </section>
  </main>
{FOOTER_HOME}
  <script src="./js/main.js"></script>
  <script>
    document.addEventListener("DOMContentLoaded", () => {{
      const el = document.getElementById("typed-post");
      if (el) {{
        let phrase = "Publiez votre projet en 2 minutes.";
        let charIndex = 0;
        function type() {{
          if (charIndex < phrase.length) {{
            el.textContent += phrase.charAt(charIndex);
            charIndex++;
            setTimeout(type, 50);
          }} else {{
            el.classList.add("typed-cursor-effect");
          }}
        }}
        setTimeout(type, 300);
      }}
    }});
  </script>
</body>
</html>'''

student_profile_html = f'''<!DOCTYPE html>
<html lang="fr" data-theme="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>DevEarn — Profil Étudiant</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="./css/global.css" />
  <link rel="stylesheet" href="./css/student-space.css" />
</head>
<body class="student-profile-page">
{nav_for('students')}
  <main id="main-content">
    <section class="page-hero">
      <div class="container page-hero-inner">
        <div class="talent-avatar" style="width:120px; height:120px; font-size:2.5rem; margin-bottom:16px;">IB</div>
        <div class="page-typed-box">
          <h1 id="typed-profile" class="page-typed-slogan"></h1>
        </div>
        <p class="page-hero-sub">ML Engineer · Data Science</p>
      </div>
    </section>

    <section class="profile-details section-spacing">
      <div class="container">
        <div class="client-board-grid">
          <div class="client-main-column">
            <div class="dashboard-panel glass-card">
              <div class="panel-header">
                <div>
                  <span class="section-chip">À propos</span>
                  <h2>Présentation</h2>
                </div>
              </div>
              <p>Passionné par la Data Science et le Machine Learning, je réalise des pipelines complets, de l'acquisition des données à la modélisation et restitution visuelle.</p>
            </div>
            <div class="dashboard-panel glass-card">
              <div class="panel-header">
                <div>
                  <span class="section-chip">Portfolio</span>
                  <h2>Derniers projets livrés</h2>
                </div>
              </div>
              <div class="project-table">
                <div class="table-row table-head">
                  <span>Projet</span><span>Client</span><span>Note</span>
                </div>
                <div class="table-row">
                  <span>Prédiction de churn</span><span>PME Retail</span><span>5.0 ★</span>
                </div>
                <div class="table-row">
                  <span>Dashboard RH</span><span>Fintech</span><span>4.9 ★</span>
                </div>
              </div>
            </div>
          </div>
          <aside class="client-side-column">
            <div class="dashboard-panel glass-card">
              <div class="panel-header">
                <div>
                  <span class="section-chip">Statistiques</span>
                  <h2>Performance</h2>
                </div>
              </div>
              <div class="progress-block">
                <div class="progress-meta"><span>Satisfaction</span><span>98%</span></div>
                <div class="progress-bar"><span style="width: 98%"></span></div>
              </div>
              <div class="progress-block">
                <div class="progress-meta"><span>Délais respectés</span><span>100%</span></div>
                <div class="progress-bar"><span style="width: 100%"></span></div>
              </div>
            </div>
            <div class="dashboard-panel glass-card">
              <div class="panel-header">
                <div>
                  <span class="section-chip">Badges</span>
                  <h2>Reconnaissance</h2>
                </div>
              </div>
              <div class="badge-list">
                <span class="badge-pill">Top Rated</span>
                <span class="badge-pill">Data Expert</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  </main>
{FOOTER_HOME}
  <script src="./js/main.js"></script>
  <script>
    document.addEventListener("DOMContentLoaded", () => {{
      const el = document.getElementById("typed-profile");
      if (el) {{
        let phrase = "Ilyas Bejja";
        let charIndex = 0;
        function type() {{
          if (charIndex < phrase.length) {{
            el.textContent += phrase.charAt(charIndex);
            charIndex++;
            setTimeout(type, 50);
          }} else {{
            el.classList.add("typed-cursor-effect");
          }}
        }}
        setTimeout(type, 300);
      }}
    }});
  </script>
</body>
</html>'''

files = {
    'login.html': login_html,
    'register.html': register_html,
    'post-project.html': post_project_html,
    'student-profile.html': student_profile_html,
}

for fname, content in files.items():
    path = os.path.join(BASE, fname)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
