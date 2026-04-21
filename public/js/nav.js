// ===== Dynamic Navbar =====

(function () {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const user = getUser();
  const authenticated = isAuthenticated();

  let navLinksHTML = '';

  navLinksHTML += `<a href="/index.html">Home</a>`;
  navLinksHTML += `<a href="/products.html">Products</a>`;
  navLinksHTML += `<a href="/about.html">About</a>`;
  navLinksHTML += `<a href="/contact.html">Contact</a>`;

  if (authenticated && user) {
    if (user.role === 'customer') {
      navLinksHTML += `<a href="/cart.html" class="cart-badge">Cart</a>`;
      navLinksHTML += `<a href="/orders.html">My Orders</a>`;
    }
    if (user.role === 'farmer') {
      navLinksHTML += `<a href="/farmer-dashboard.html">Dashboard</a>`;
    }
    navLinksHTML += `<a href="#" class="btn-nav" id="logout-btn">Logout</a>`;
  } else {
    navLinksHTML += `<a href="/login.html">Login</a>`;
    navLinksHTML += `<a href="/signup.html" class="btn-nav">Sign Up</a>`;
  }

  navbar.innerHTML = `
    <div class="container">
      <a href="/index.html" class="logo">FarmKart</a>
      <nav class="nav-links" id="nav-links">${navLinksHTML}</nav>
      <button class="hamburger" id="hamburger" aria-label="Toggle menu">
        <span></span><span></span><span></span>
      </button>
    </div>
  `;

  // Highlight active link
  const currentPage = window.location.pathname;
  navbar.querySelectorAll('.nav-links a').forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });

  // Hamburger toggle
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('show');
    });
  }

  // Logout
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      logout();
    });
  }

  // Update cart badge count
  if (authenticated && user && user.role === 'customer') {
    updateCartBadge();
  }
})();

async function updateCartBadge() {
  const cartLink = document.querySelector('.cart-badge');
  if (!cartLink) return;

  const { data } = await apiFetch('/cart');
  if (data && data.cart && data.cart.items) {
    const count = data.cart.items.reduce((sum, item) => sum + item.quantity, 0);
    if (count > 0) {
      let badge = cartLink.querySelector('.badge-count');
      if (!badge) {
        badge = document.createElement('span');
        badge.className = 'badge-count';
        cartLink.appendChild(badge);
      }
      badge.textContent = count;
    }
  }
}
