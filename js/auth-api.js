/**
 * Authentication API Service
 * Handles all communication with the backend authentication endpoints
 */

const API_BASE = (window.api && window.api.API_BASE_URL) ? `${window.api.API_BASE_URL}/auth` : 'https://devearn-backend.onrender.com/auth';

/**
 * Show notification message
 */
function showNotification(message, type = 'info') {
  const messageEl = document.getElementById('auth-message');
  if (!messageEl) return;
  
  messageEl.textContent = message;
  messageEl.className = `auth-message auth-message-${type}`;
  messageEl.style.display = 'block';
  
  // Auto-hide success messages after 3 seconds
  if (type === 'success') {
    setTimeout(() => {
      messageEl.style.display = 'none';
    }, 3000);
  }
}

/**
 * Register user and initiate email verification
 */
async function registerUser(fullName, email, password, role = 'student') {
  try {
    showNotification('Création du compte...', 'info');
    
    const response = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        full_name: fullName,
        email: email,
        password: password,
        role: role
      })
    });
    
    if (response.ok) {
      const user = await response.json();
      localStorage.setItem('pendingEmail', email);
      showNotification('Compte créé ! Veuillez vérifier vos e-mails pour le code.', 'success');
      
      // Redirect to verification page after 1 second
      setTimeout(() => {
        window.location.href = './verify-email.html';
      }, 1000);
      return true;
    } else {
      const error = await response.json();
      showNotification(`${error.detail || 'L\'inscription a échoué'}`, 'error');
      return false;
    }
  } catch (error) {
    showNotification(`Erreur réseau: ${error.message}`, 'error');
    return false;
  }
}

/**
 * Verify email with code
 */
async function verifyEmail(email, code) {
  try {
    showNotification('Vérification du code...', 'info');
    
    const response = await fetch(`${API_BASE}/verify-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email,
        code: code
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      localStorage.removeItem('pendingEmail');
      showNotification('E-mail vérifié ! Redirection vers la page de connexion...', 'success');
      
      setTimeout(() => {
        window.location.href = './login.html';
      }, 1500);
      return true;
    } else {
      showNotification(`${result.message}`, 'error');
      return false;
    }
  } catch (error) {
    showNotification(`La vérification a échoué: ${error.message}`, 'error');
    return false;
  }
}

/**
 * Resend verification code
 */
async function resendVerificationCode(email) {
  try {
    const response = await fetch(`${API_BASE}/resend-verification-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email })
    });
    
    const result = await response.json();
    
    if (result.success) {
      showNotification('Code envoyé à votre adresse e-mail !', 'success');
      return true;
    } else {
      showNotification(`${result.message}`, 'error');
      return false;
    }
  } catch (error) {
    showNotification(`Erreur: ${error.message}`, 'error');
    return false;
  }
}

/**
 * Request password reset code
 */
async function requestPasswordReset(email) {
  try {
    showNotification('Envoi du code de réinitialisation...', 'info');
    
    const response = await fetch(`${API_BASE}/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email })
    });
    
    const result = await response.json();
    
    if (result.success) {
      localStorage.setItem('resetEmail', email);
      showNotification('Consultez vos e-mails pour le code de réinitialisation !', 'success');
      
      setTimeout(() => {
        window.location.href = './reset-password.html';
      }, 1500);
      return true;
    } else {
      showNotification(`${result.message}`, 'error');
      return false;
    }
  } catch (error) {
    showNotification(`Erreur: ${error.message}`, 'error');
    return false;
  }
}

/**
 * Reset password with code
 */
async function resetPassword(email, resetCode, newPassword, confirmPassword) {
  try {
    // Frontend validation
    if (newPassword !== confirmPassword) {
      showNotification('Les mots de passe ne correspondent pas', 'error');
      return false;
    }
    
    if (newPassword.length < 8) {
      showNotification('Le mot de passe doit contenir au moins 8 caractères', 'error');
      return false;
    }
    
    if (!/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      showNotification('Le mot de passe doit contenir une majuscule, une minuscule et un chiffre', 'error');
      return false;
    }
    
    showNotification('Réinitialisation du mot de passe...', 'info');
    
    const response = await fetch(`${API_BASE}/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email,
        reset_code: resetCode,
        new_password: newPassword,
        confirm_password: confirmPassword
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      localStorage.removeItem('resetEmail');
      showNotification('Mot de passe réinitialisé ! Redirection vers la page de connexion...', 'success');
      
      setTimeout(() => {
        window.location.href = './login.html';
      }, 1500);
      return true;
    } else {
      showNotification(`${result.message}`, 'error');
      return false;
    }
  } catch (error) {
    showNotification(`Erreur: ${error.message}`, 'error');
    return false;
  }
}

/**
 * Login user
 */
async function loginUser(email, password) {
  try {
    showNotification('Connexion en cours...', 'info');
    
    const response = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `username=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
    });
    
    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('devearn_token', data.access_token);
      localStorage.setItem('role', data.role);
      localStorage.setItem('userEmail', email);
      
      showNotification('Connexion réussie ! Redirection...', 'success');
      
      setTimeout(() => {
        window.location.href = './dashboard.html';
      }, 1000);
      return true;
    } else {
      const error = await response.json();
      showNotification(`${error.detail || 'Échec de la connexion'}`, 'error');
      return false;
    }
  } catch (error) {
    showNotification(`Erreur réseau: ${error.message}`, 'error');
    return false;
  }
}

/**
 * Get stored authentication token
 */
function getAuthToken() {
  return localStorage.getItem('devearn_token');
}

/**
 * Check if user is authenticated
 */
function isAuthenticated() {
  return !!getAuthToken();
}

/**
 * Logout user
 */
function logout() {
  localStorage.removeItem('devearn_token');
  localStorage.removeItem('role');
  localStorage.removeItem('userEmail');
  window.location.href = './index.html';
}
