document.addEventListener("DOMContentLoaded", () => {
  // Animation des métriques textuelles
  const scoreBoxes = document.querySelectorAll(".kpi-value, .ranking-score");
  scoreBoxes.forEach((box, index) => {
    box.style.opacity = "0";
    box.style.transform = "translateY(10px)";
    setTimeout(() => {
      box.style.transition = "opacity 600ms ease, transform 600ms ease";
      box.style.opacity = "1";
      box.style.transform = "translateY(0)";
    }, 180 + index * 80);
  });

  // Graphiques Chart.js
  const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#00df9a';
  const textColor = getComputedStyle(document.documentElement).getPropertyValue('--text').trim() || '#ffffff';
  const textFaintColor = getComputedStyle(document.documentElement).getPropertyValue('--text-faint').trim() || '#a1a1aa';
  const gridColor = 'rgba(255, 255, 255, 0.05)';

  Chart.defaults.color = textFaintColor;
  Chart.defaults.font.family = "'Inter', sans-serif";

  // 1. Line Chart pour l'évolution
  const activityCtx = document.getElementById('activityChart');
  if (activityCtx) {
    new Chart(activityCtx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai'],
        datasets: [{
          label: 'Projets publiés',
          data: [12, 19, 25, 38, 45],
          borderColor: primaryColor,
          backgroundColor: 'rgba(0, 223, 154, 0.1)',
          borderWidth: 3,
          tension: 0.4,
          fill: true,
          pointBackgroundColor: '#000',
          pointBorderColor: primaryColor,
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6
        },
        {
          label: 'Étudiants actifs',
          data: [30, 45, 60, 85, 120],
          borderColor: '#4dabf7',
          backgroundColor: 'rgba(77, 171, 247, 0.0)',
          borderWidth: 2,
          borderDash: [5, 5],
          tension: 0.4,
          fill: false,
          pointBackgroundColor: '#000',
          pointBorderColor: '#4dabf7',
          pointBorderWidth: 2,
          pointRadius: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              usePointStyle: true,
              boxWidth: 8
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#fff',
            bodyColor: '#fff',
            borderColor: gridColor,
            borderWidth: 1,
            padding: 12,
            displayColors: true
          }
        },
        scales: {
          x: {
            grid: {
              display: false,
              drawBorder: false
            }
          },
          y: {
            grid: {
              color: gridColor,
              drawBorder: false
            },
            beginAtZero: true
          }
        }
      }
    });
  }

  // 2. Doughnut Chart pour la répartition
  const sourcesCtx = document.getElementById('sourcesChart');
  if (sourcesCtx) {
    new Chart(sourcesCtx, {
      type: 'doughnut',
      data: {
        labels: ['PME', 'Startups', 'Particuliers', 'ONG / autres'],
        datasets: [{
          data: [46, 28, 16, 10],
          backgroundColor: [
            primaryColor,
            '#ff922b', // orange
            '#4dabf7', // blue
            '#868e96'  // gray
          ],
          borderWidth: 0,
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '75%',
        plugins: {
          legend: {
            position: 'right',
            labels: {
              usePointStyle: true,
              color: textColor,
              padding: 20,
              font: {
                size: 13
              }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 12,
            callbacks: {
              label: function(context) {
                return ' ' + context.label + ': ' + context.raw + '%';
              }
            }
          }
        }
      }
    });
  }
});