// ===== API Utility Module =====

const API_BASE = '/api';

async function apiFetch(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers
    });

    const data = await res.json();

    if (res.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = './login.html';
      return { data: null, error: 'Session expired. Please login again.' };
    }

    if (!res.ok) {
      return { data: null, error: data.error || 'Something went wrong' };
    }

    return { data, error: null };
  } catch (err) {
    return { data: null, error: 'Connection error. Please try again.' };
  }
}

function getToken() {
  return localStorage.getItem('token');
}

function getUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

function isAuthenticated() {
  return !!getToken();
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = './index.html';
}

function requireAuth(role) {
  if (!isAuthenticated()) {
    window.location.href = './login.html';
    return false;
  }
  if (role) {
    const user = getUser();
    if (!user || user.role !== role) {
      window.location.href = './index.html';
      return false;
    }
  }
  return true;
}

// Toast notifications
function showToast(message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
    if (container.children.length === 0) {
      container.remove();
    }
  }, 3000);
}

// Format currency
function formatPrice(price) {
  return '\u20B9' + Number(price).toFixed(2);
}

