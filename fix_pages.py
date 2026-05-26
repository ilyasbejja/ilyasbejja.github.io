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

client_html = f'''<!DOCTYPE html>
<html lang="fr" data-theme="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>DevEarn — Espace Client</title>
  <meta name="description" content="Espace client DevEarn pour publier des projets et piloter les missions." />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="./css/global.css" />
  <link rel="stylesheet" href="./css/client.css" />
</head>
<body class="client-space-page">
  <a href="#main-content" class="skip-link">Aller au contenu principal</a>
{nav_for('client')}
  <main id="main-content">
    <section class="page-hero">
      <div class="container page-hero-inner">
        <p class="page-hero-eyebrow">Cockpit Recruteur</p>
        <div class="page-typed-box">
          <h1 id="typed-client" class="page-typed-slogan"></h1>
        </div>
        <p class="page-hero-sub">Pilotez vos projets et recrutez les meilleurs talents IT vérifiés du Maroc.</p>
      </div>
    </section>
    
    <section class="client-board section-spacing">
      <div class="container client-board-grid">
        <div class="client-main-column">
          <div class="dashboard-panel glass-card">
            <div class="panel-header">
              <div>
                <span class="section-chip">Mes projets</span>
                <h2>Suivi des missions publiées</h2>
              </div>
              <a href="./post-project.html" class="text-link">Nouveau projet</a>
            </div>
            <div class="project-table">
              <div class="table-row table-head">
                <span>Projet</span><span>Catégorie</span><span>Statut</span><span>Candidats</span>
              </div>
              <div class="table-row">
                <span>Dashboard KPI Retail</span><span>Data / BI</span><span class="status-badge active">En cours</span><span>12</span>
              </div>
              <div class="table-row">
                <span>Prototype UX santé</span><span>Design</span><span class="status-badge pending">En revue</span><span>08</span>
              </div>
              <div class="table-row">
                <span>Audit sécurité portail</span><span>Cybersécurité</span><span class="status-badge accepted">Shortlist faite</span><span>05</span>
              </div>
            </div>
          </div>

          <div class="dashboard-panel glass-card">
            <div class="panel-header">
              <div>
                <span class="section-chip">Top candidatures</span>
                <h2>Profils recommandés</h2>
              </div>
              <a href="./student-space.html" class="text-link">Explorer les talents</a>
            </div>
            <div class="candidate-list">
              <article class="candidate-card">
                <div class="candidate-top">
                  <div class="candidate-avatar">IB</div>
                  <div>
                    <h3>Ilyas Bejja</h3>
                    <p>ML Engineer · NLP · Data Science</p>
                  </div>
                  <span class="match-pill">95% match</span>
                </div>
                <div class="candidate-meta">
                  <span>4.94 ★</span><span>18 projets livrés</span><span>Top 2%</span>
                </div>
              </article>
              <article class="candidate-card">
                <div class="candidate-top">
                  <div class="candidate-avatar alt">SA</div>
                  <div>
                    <h3>Salma Ait</h3>
                    <p>UX/UI Designer · Product Thinking</p>
                  </div>
                  <span class="match-pill">91% match</span>
                </div>
                <div class="candidate-meta">
                  <span>4.88 ★</span><span>12 projets livrés</span><span>Fast delivery</span>
                </div>
              </article>
            </div>
          </div>
        </div>

        <aside class="client-side-column">
          <div class="dashboard-panel glass-card">
            <div class="panel-header">
              <div>
                <span class="section-chip">Workflow</span>
                <h2>Étapes de gestion</h2>
              </div>
            </div>
            <div class="workflow-list">
              <article class="workflow-item">
                <span class="workflow-step">01</span>
                <div>
                  <h3>Publier un besoin</h3>
                  <p>Décrire le projet et le budget.</p>
                </div>
              </article>
              <article class="workflow-item">
                <span class="workflow-step">02</span>
                <div>
                  <h3>Comparer les profils</h3>
                  <p>Analyser réputation et portfolio.</p>
                </div>
              </article>
              <article class="workflow-item">
                <span class="workflow-step">03</span>
                <div>
                  <h3>Suivre les livrables</h3>
                  <p>Valider les étapes et clôturer.</p>
                </div>
              </article>
            </div>
          </div>

          <div class="dashboard-panel glass-card">
            <div class="panel-header">
              <div>
                <span class="section-chip">Financier</span>
                <h2>Monétisation</h2>
              </div>
            </div>
            <div class="payment-box">
              <strong>10% commission plateforme</strong>
              <p>Le modèle DevEarn prévoit une commission automatique sur chaque projet réalisé.</p>
            </div>
            <a href="./post-project.html" class="btn btn-primary payout-btn">Créer un nouveau projet</a>
          </div>
        </aside>
      </div>
    </section>
  </main>
{FOOTER_HOME}
  <script src="./js/main.js"></script>
</body>
</html>'''

dashboard_html = f'''<!DOCTYPE html>
<html lang="fr" data-theme="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>DevEarn — Dashboard</title>
  <meta name="description" content="Dashboard analytique DevEarn avec statistiques d'utilisation." />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="./css/global.css" />
  <link rel="stylesheet" href="./css/dashboard.css" />
</head>
<body class="dashboard-page">
  <a href="#main-content" class="skip-link">Aller au contenu principal</a>
{nav_for('dashboard')}
  <main id="main-content">
    <section class="page-hero">
      <div class="container page-hero-inner">
        <p class="page-hero-eyebrow">Analytics Cockpit</p>
        <div class="page-typed-box">
          <h1 id="typed-dashboard" class="page-typed-slogan"></h1>
        </div>
        <p class="page-hero-sub">Suivez la croissance de la plateforme et l'impact de nos talents.</p>
      </div>
    </section>
    
    <section class="analytics-kpis section-spacing">
      <div class="container">
        <div class="analytics-kpi-grid">
          <article class="analytics-kpi-card glass-card">
            <span class="kpi-label">Étudiants inscrits</span>
            <strong class="kpi-value">214</strong>
            <small class="kpi-trend positive">+18 cette semaine</small>
          </article>
          <article class="analytics-kpi-card glass-card">
            <span class="kpi-label">Projets publiés</span>
            <strong class="kpi-value">126</strong>
            <small class="kpi-trend positive">+9 nouveaux</small>
          </article>
          <article class="analytics-kpi-card glass-card">
            <span class="kpi-label">Taux de matching</span>
            <strong class="kpi-value">87%</strong>
            <small class="kpi-trend positive">Très bon alignement</small>
          </article>
          <article class="analytics-kpi-card glass-card">
            <span class="kpi-label">Livrables validés</span>
            <strong class="kpi-value">93%</strong>
            <small class="kpi-trend positive">Qualité soutenue</small>
          </article>
        </div>
      </div>
    </section>

    <section class="dashboard-main section-spacing">
      <div class="container dashboard-main-grid">
        <div class="dashboard-left">
          <div class="dashboard-card glass-card">
            <div class="card-head">
              <div>
                <span class="section-chip">Performance étudiants</span>
                <h2>Segments les plus performants</h2>
              </div>
            </div>
            <div class="ranking-list">
              <article class="ranking-row">
                <div>
                  <strong>Data / IA</strong>
                  <p>Forte demande et impact métier visible.</p>
                </div>
                <span class="ranking-score">95</span>
              </article>
              <article class="ranking-row">
                <div>
                  <strong>NLP / LLM</strong>
                  <p>Catégorie premium avec projets spécialisés.</p>
                </div>
                <span class="ranking-score">93</span>
              </article>
              <article class="ranking-row">
                <div>
                  <strong>Dashboard / BI</strong>
                  <p>Très bonne traction côté PME.</p>
                </div>
                <span class="ranking-score">89</span>
              </article>
            </div>
          </div>
        </div>

        <aside class="dashboard-right">
          <div class="dashboard-card glass-card">
            <div class="card-head">
              <div>
                <span class="section-chip">Matching engine</span>
                <h2>Qualité du matching</h2>
              </div>
            </div>
            <div class="progress-block">
              <div class="progress-meta">
                <span>Compétences</span><span>92%</span>
              </div>
              <div class="progress-bar"><span style="width: 92%"></span></div>
            </div>
            <div class="progress-block">
              <div class="progress-meta">
                <span>Disponibilités</span><span>84%</span>
              </div>
              <div class="progress-bar"><span style="width: 84%"></span></div>
            </div>
            <div class="progress-block">
              <div class="progress-meta">
                <span>Évaluations</span><span>88%</span>
              </div>
              <div class="progress-bar"><span style="width: 88%"></span></div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  </main>
{FOOTER_HOME}
  <script src="./js/main.js"></script>
</body>
</html>'''

files = {
    'client-space.html': client_html,
    'dashboard.html': dashboard_html,
}

for fname, content in files.items():
    path = os.path.join(BASE, fname)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
