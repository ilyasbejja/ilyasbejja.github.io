$dir = "c:\Users\ilyas\OneDrive\Desktop\java2\web\devearn"
$files = Get-ChildItem "$dir\*.html" | Where-Object { $_.Name -ne "index.html" }

foreach ($file in $files) {
    $content = [System.IO.File]::ReadAllText($file.FullName)
    
    # 1. Update navigation
    $newNav = @"
<ul class="nav-list">
          <li><a href="./index.html">Accueil</a></li>
          <li><a href="./projects.html">Projets</a></li>
          <li><a href="./student-space.html">Étudiants</a></li>
          <li><a href="./client-space.html">Entreprises</a></li>
          <li><a href="./dashboard.html">Dashboard</a></li>
        </ul>
"@
    $content = [regex]::Replace($content, '(?s)<ul class="nav-list">.*?</ul>', $newNav)
    
    # 2. Add is-current class
    if ($file.Name -eq 'student-space.html' -or $file.Name -eq 'student-profile.html') {
        $content = $content.Replace('href="./student-space.html"', 'href="./student-space.html" class="is-current"')
    } elseif ($file.Name -eq 'client-space.html' -or $file.Name -eq 'post-project.html') {
        $content = $content.Replace('href="./client-space.html"', 'href="./client-space.html" class="is-current"')
    } elseif ($file.Name -eq 'projects.html') {
        $content = $content.Replace('href="./projects.html"', 'href="./projects.html" class="is-current"')
    } elseif ($file.Name -eq 'dashboard.html') {
        $content = $content.Replace('href="./dashboard.html"', 'href="./dashboard.html" class="is-current"')
    }
    
    # 3. Simplify header actions
    $newActions = @"
<div class="header-actions">
        <button class="theme-toggle" type="button" aria-label="Basculer le thème">
          <span class="theme-toggle-icon">◐</span>
        </button>
        <a href="./login.html" class="btn btn-ghost">Connexion</a>
        <a href="./register.html" class="btn btn-primary">Inscription</a>
      </div>
"@
    $content = [regex]::Replace($content, '(?s)<div class="header-actions">.*?</div>', $newActions)

    [System.IO.File]::WriteAllText($file.FullName, $content)
    Write-Host "Updated $($file.Name)"
}
