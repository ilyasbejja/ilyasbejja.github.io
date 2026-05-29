# 🚀 Frontend Authentication - Quick Start

## Files Created/Updated

### ✨ New Files
- `js/auth-api.js` - API service layer for all authentication endpoints
- `verify-email.html` - Email verification code entry page
- `forgot-password.html` - Password reset request page  
- `reset-password.html` - Password reset form page

### ✅ Updated Files
- `register.html` - Added form submission to auth API
- `login.html` - Added form submission + "forgot password" link
- `css/auth.css` - Added notification styling + floating labels

---

## 📋 Testing the Complete Flow

### 1️⃣ Signup + Email Verification

**Step 1: Go to Register**
```
http://localhost:5500/register.html
(or if using index.html, click "Inscription")
```

**Step 2: Fill the form**
- Prénom: John
- Nom: Doe
- Email: test@example.com
- Type de profil: Étudiant
- Mot de passe: MySecurePass123
- Confirmer: MySecurePass123
- ✓ Accept terms
- Click "Créer mon compte"

**Step 3: You'll be redirected to verify-email.html**
- Enter the 6-digit code from the email
- Or click "Renvoyer le code" to resend

**Step 4: After verification**
- Redirected to login page
- Can now login with your credentials

---

### 2️⃣ Forgot Password + Reset

**Step 1: Go to Login**
```
http://localhost:5500/login.html
(or if using index.html#login)
```

**Step 2: Click "Oublié ?" link**
- Taken to forgot-password.html

**Step 3: Enter your email**
- System sends reset code to email
- Redirects to reset-password.html

**Step 4: Fill reset form**
- Enter 6-digit code from email
- New password (must meet requirements)
- Confirm password
- Click "Réinitialiser le mot de passe"

**Step 5: After reset**
- Password updated
- Redirected to login
- Login with new password

---

## ✋ Before Testing

### 1. Backend Must Be Running

```bash
cd devearn-backend
python -m venv venv
source venv/Scripts/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Server runs at: `http://localhost:8000`

### 2. Frontend Server Running

Make sure you're serving the frontend files:

```bash
cd devearn
python -m http.server 5500  # Or use Live Server in VS Code
```

Access at: `http://localhost:5500`

### 3. CORS Configuration

If you get CORS errors, the backend needs CORS middleware. Add to `app/main.py`:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5500", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 🧪 Test Scenarios

### ✅ Success Cases

1. **Register with valid data**
   - Account created ✓
   - Verification email sent ✓
   - Code entry works ✓
   - Redirected to login ✓

2. **Login after verification**
   - Token stored in localStorage ✓
   - Redirected to dashboard ✓

3. **Forgot password**
   - Reset code sent ✓
   - Reset form appears ✓
   - Password updated ✓
   - Can login with new password ✓

### ❌ Error Cases

1. **Register with weak password**
   - "Password must contain..." message ✓

2. **Register with existing email**
   - "Email already registered" ✓

3. **Verify with wrong code**
   - "Invalid verification code" ✓

4. **Verify after 5 attempts**
   - "Too many incorrect attempts" ✓

5. **Resend code rate limiting**
   - "Please wait 60 seconds..." ✓

---

## 📊 Browser Console Checks

Open DevTools (F12) → Console to verify:

```javascript
// Check if auth-api.js loaded
console.log(typeof registerUser)  // Should show: "function"
console.log(typeof verifyEmail)   // Should show: "function"

// Check localStorage
localStorage.getItem('token')      // Should exist after login
localStorage.getItem('pendingEmail') // Should exist during verification
```

---

## 🔧 Debugging

### If signup redirects with error:
1. Check browser console for error message
2. Check backend server logs (`http://localhost:8000/docs` for API)
3. Verify email field is valid

### If email not received:
1. Check backend console - code should be logged
2. Verify RESEND_API_KEY in .env is correct
3. For development: codes are printed to console

### If verification fails:
1. Check the code matches exactly (case-sensitive, 6 digits)
2. Code might have expired (10 minute limit)
3. May have exceeded 5 attempts - request new code

### If password reset fails:
1. Check reset code is correct (6 digits)
2. New password must meet all requirements
3. Passwords must match

---

## 🎯 Feature Checklist

- [ ] Signup page works and creates account
- [ ] Email verification code received
- [ ] Code verification works (redirects to login)
- [ ] Resend code works (with rate limiting message)
- [ ] Login page works with verified account
- [ ] Forgot password page accessible from login
- [ ] Password reset code received
- [ ] Password reset form works
- [ ] New password works for login
- [ ] Error messages display properly
- [ ] Success messages show
- [ ] Redirects work correctly
- [ ] localStorage stores token after login
- [ ] Logout clears localStorage

---

## 📱 Mobile Testing

All pages are responsive:
- Test on mobile viewport (DevTools)
- Code input on verify page has mobile-friendly keyboard
- Forms stack properly on small screens

---

## 🔐 Security Verification

- [ ] Passwords are never logged
- [ ] Tokens stored in localStorage (consider httpOnly for production)
- [ ] API returns generic error messages
- [ ] Rate limiting works (60-second delays)
- [ ] Codes expire (10-30 minutes)
- [ ] Failed attempts tracked

---

## 🚢 Deployment Checklist

Before going to production:

- [ ] Update `API_BASE` in `js/auth-api.js` to production URL
- [ ] Use production Resend API key
- [ ] Enable HTTPS
- [ ] Configure CORS for production domain
- [ ] Test with real email accounts
- [ ] Set up error logging
- [ ] Use httpOnly cookies instead of localStorage for tokens
- [ ] Enable email verification requirement in login (uncomment in backend)

---

## 📞 Quick Command Reference

```bash
# Start backend
cd devearn-backend
uvicorn app.main:app --reload

# Start frontend
cd devearn
python -m http.server 5500

# Test API directly
curl http://localhost:8000/docs  # Swagger UI
```

---

## ✅ After Verification

Once everything works:

1. **Create user accounts** for testing
2. **Store test credentials** for QA
3. **Update documentation** if making changes
4. **Configure** for production (see checklist above)
5. **Deploy** when ready!

---

**Happy testing! 🎉**
