const fs = require('fs');
const path = require('path');

const dir = 'c:\\Users\\ilyas\\OneDrive\\Desktop\\java2\\web\\devearn';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html') && f !== 'index.html');

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace nav
  const navRegex = /<ul class="nav-list">[\s\S]*?<\/ul>/;
  const newNav = `<ul class="nav-list">
          <li><a href="./index.html">Accueil</a></li>
          <li><a href="./projects.html">Projets</a></li>
          <li><a href="./student-space.html">Étudiants</a></li>
          <li><a href="./client-space.html">Entreprises</a></li>
          <li><a href="./dashboard.html">Dashboard</a></li>
        </ul>`;
  
  content = content.replace(navRegex, newNav);

  // Re-add is-current
  if (file === 'student-space.html' || file === 'student-profile.html') {
    content = content.replace('href="./student-space.html"', 'href="./student-space.html" class="is-current"');
  } else if (file === 'client-space.html' || file === 'post-project.html') {
    content = content.replace('href="./client-space.html"', 'href="./client-space.html" class="is-current"');
  } else if (file === 'projects.html') {
    content = content.replace('href="./projects.html"', 'href="./projects.html" class="is-current"');
  } else if (file === 'dashboard.html') {
    content = content.replace('href="./dashboard.html"', 'href="./dashboard.html" class="is-current"');
  }

  // Replace header actions
  const actionsRegex = /<div class="header-actions">[\s\S]*?<\/div>/;
  let newActions = `<div class="header-actions">
        <button class="theme-toggle" type="button" aria-label="Basculer le thème">
          <span class="theme-toggle-icon">◐</span>
        </button>
        <a href="./login.html" class="btn btn-ghost">Connexion</a>
        <a href="./register.html" class="btn btn-primary">Inscription</a>
      </div>`;
  
  // Actually, we should link directly to login and register on other pages
  content = content.replace(actionsRegex, newActions);

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${file}`);
}
