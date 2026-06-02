document.addEventListener("DOMContentLoaded", () => {
  // ── Glow effect on mouse move ──
  const heroSection = document.querySelector(".hero-section");
  if (heroSection) {
    heroSection.addEventListener("mousemove", (e) => {
      const rect = heroSection.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      heroSection.style.setProperty("--mouse-x", `${x}px`);
      heroSection.style.setProperty("--mouse-y", `${y}px`);
    });
  }

  function renderRealStudents(students) {
    const tbody = document.getElementById("students-ranking-tbody");
    if (!tbody) return;
    
    if (students.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 40px; color: var(--text-muted);">Aucun étudiant trouvé.</td></tr>`;
        return;
    }

    tbody.innerHTML = "";
    students.forEach((student, index) => {
        const tr = document.createElement("tr");
        
        const avatar = student.profile_picture 
            ? `<img src="${window.api.API_BASE_URL || 'https://devearn-backend.onrender.com'}${student.profile_picture}" style="width:32px; height:32px; border-radius:50%; object-fit:cover;" />`
            : `<div class="student-row-avatar">${student.full_name.substring(0,2).toUpperCase()}</div>`;
            
        const skills = student.skills_tags ? student.skills_tags.split(',').slice(0,2).map(s => `<span class="badge-tag">${s.trim()}</span>`).join('') : '<span class="badge-tag">Nouveau</span>';
        
        tr.innerHTML = `
          <td style="font-weight: 700; color: var(--primary);">#${index + 1}</td>
          <td>
            <div class="student-row-info">
              ${avatar}
              <span class="student-row-name">${student.full_name}</span>
            </div>
          </td>
          <td>${student.bio ? student.bio.substring(0, 30) + '...' : 'Étudiant DevEarn'}</td>
          <td style="text-align: center; font-weight: 600;">-</td>
          <td style="text-align: center; color: var(--primary); font-weight: 700;">Nouveau</td>
          <td>${skills}</td>
          <td style="text-align: right; font-weight: 700;">- XP</td>
        `;
        tbody.appendChild(tr);
    });
  }

  document.addEventListener("devearn:session-ready", async (e) => {
      // Fetch real students if user is connected
      try {
          const students = await window.api.get("/users/?role=Étudiant");
          renderRealStudents(students);
      } catch (err) {
          console.error("Erreur récupération étudiants", err);
      }
  });
});