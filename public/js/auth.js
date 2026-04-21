// ===== Auth Page Logic (Login & Signup) =====

(function () {
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');
  const alertContainer = document.getElementById('alert-container');

  function showAlert(message, type = 'error') {
    if (!alertContainer) return;
    alertContainer.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
  }

  function clearAlert() {
    if (alertContainer) alertContainer.innerHTML = '';
  }

  // Redirect if already authenticated
  if (isAuthenticated()) {
    const user = getUser();
    if (user && user.role === 'farmer') {
      window.location.href = '/farmer-dashboard.html';
    } else {
      window.location.href = '/index.html';
    }
    return;
  }

  // Login form handler
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearAlert();

      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      const submitBtn = document.getElementById('submit-btn');

      if (!email || !password) {
        showAlert('Please fill in all fields');
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Logging in...';

      const { data, error } = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });

      submitBtn.disabled = false;
      submitBtn.textContent = 'Login';

      if (error) {
        showAlert(error);
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      if (data.user.role === 'farmer') {
        window.location.href = '/farmer-dashboard.html';
      } else {
        window.location.href = '/index.html';
      }
    });
  }

  // Signup form handler
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearAlert();

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirm-password').value;
      const role = document.querySelector('input[name="role"]:checked').value;
      const phone = document.getElementById('phone').value.trim();
      const address = document.getElementById('address').value.trim();
      const submitBtn = document.getElementById('submit-btn');

      if (!name || !email || !password || !confirmPassword) {
        showAlert('Please fill in all required fields');
        return;
      }

      if (password.length < 6) {
        showAlert('Password must be at least 6 characters');
        return;
      }

      if (password !== confirmPassword) {
        showAlert('Passwords do not match');
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Creating account...';

      const { data, error } = await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, role, phone, address })
      });

      submitBtn.disabled = false;
      submitBtn.textContent = 'Create Account';

      if (error) {
        showAlert(error);
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      if (data.user.role === 'farmer') {
        window.location.href = '/farmer-dashboard.html';
      } else {
        window.location.href = '/index.html';
      }
    });
  }
})();
