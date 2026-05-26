import os
import re

directory = r"c:\Users\ilyas\OneDrive\Desktop\java2\web\devearn"

original_nav = """        <ul class="nav-list">
          <li><a href="./index.html">Accueil</a></li>
          <li><a href="./student-space.html">Espace Étudiant</a></li>
          <li><a href="./client-space.html">Espace Client</a></li>
          <li><a href="./projects.html">Projets</a></li>
          <li><a href="./post-project.html">Publier un projet</a></li>
          <li><a href="./dashboard.html">Dashboard</a></li>
        </ul>"""

original_actions = """      <div class="header-actions">
        <button class="theme-toggle" type="button" aria-label="Basculer le thème">
          <span class="theme-toggle-icon">◐</span>
        </button>
        <a href="./login.html" class="btn btn-ghost">Connexion</a>
        <a href="./register.html" class="btn btn-primary">Inscription</a>
      </div>"""

files = [f for f in os.listdir(directory) if f.endswith(".html") and f != "index.html"]

for f in files:
    path = os.path.join(directory, f)
    # Read the file bytes, decode with utf-8 replacing errors, this gets rid of the corrupted chars
    with open(path, "rb") as file:
        content_bytes = file.read()
    
    # The powershell script wrote in UTF-8 BOM or ANSI. 
    # Let's try to decode as utf-8 first.
    try:
        content = content_bytes.decode('utf-8')
    except UnicodeDecodeError:
        content = content_bytes.decode('cp1252', errors='ignore')

    # Replace nav list
    content = re.sub(r'<ul class="nav-list">.*?</ul>', original_nav, content, flags=re.DOTALL)
    
    # Replace header actions
    content = re.sub(r'<div class="header-actions">.*?</div>', original_actions, content, flags=re.DOTALL)
    
    # Restore the `is-current` class for the respective active pages.
    if f == 'student-space.html' or f == 'student-profile.html':
        content = content.replace('href="./student-space.html"', 'href="./student-space.html" class="is-current"')
    elif f == 'client-space.html':
        content = content.replace('href="./client-space.html"', 'href="./client-space.html" class="is-current"')
    elif f == 'projects.html':
        content = content.replace('href="./projects.html"', 'href="./projects.html" class="is-current"')
    elif f == 'dashboard.html':
        content = content.replace('href="./dashboard.html"', 'href="./dashboard.html" class="is-current"')
    elif f == 'post-project.html':
        content = content.replace('href="./post-project.html"', 'href="./post-project.html" class="is-current"')

    with open(path, "w", encoding="utf-8") as file:
        file.write(content)
    print("Reverted", f)
