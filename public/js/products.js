// ===== Products Listing Page =====

(function () {
  const container = document.getElementById('products-container');
  const pagination = document.getElementById('pagination');
  const searchInput = document.getElementById('search-input');
  const filterBtns = document.querySelectorAll('.filter-btn');

  if (!container) return;

  let currentCategory = 'all';
  let currentSearch = '';
  let currentPage = 1;
  let debounceTimer;

  async function loadProducts() {
    container.innerHTML = '<div class="spinner"></div>';

    let endpoint = `/products?page=${currentPage}&limit=12`;
    if (currentCategory !== 'all') {
      endpoint += `&category=${currentCategory}`;
    }
    if (currentSearch) {
      endpoint += `&search=${encodeURIComponent(currentSearch)}`;
    }

    const { data, error } = await apiFetch(endpoint);

    if (error || !data) {
      container.innerHTML = '<p style="text-align:center; color: var(--color-text-light); grid-column: 1/-1;">Failed to load products.</p>';
      return;
    }

    if (data.products.length === 0) {
      container.innerHTML = `
        <div class="empty-state" style="grid-column: 1/-1;">
          <div class="empty-icon">&#x1F50D;</div>
          <h3>No products found</h3>
          <p>Try a different search term or category.</p>
        </div>
      `;
      pagination.innerHTML = '';
      return;
    }

    container.innerHTML = data.products.map(product => `
      <div class="card product-card">
        <img class="card-img" src="${product.imageUrl || 'https://placehold.co/400x300/e9ecef/666?text=' + encodeURIComponent(product.name)}" alt="${product.name}" onerror="this.src='https://placehold.co/400x300/e9ecef/666?text=Product'">
        <div class="card-body">
          <h3 class="card-title">${product.name}</h3>
          <span class="badge badge-category">${product.category}</span>
          <p class="card-price">${formatPrice(product.price)} / ${product.unit}</p>
          <div class="card-footer">
            <span style="color: var(--color-text-light); font-size: 0.85rem;">
              ${product.quantity > 0 ? `${product.quantity} ${product.unit} available` : '<span style="color: var(--color-danger);">Out of stock</span>'}
            </span>
            <a href="/product-detail.html?id=${product._id}" class="btn btn-primary btn-sm">View Details</a>
          </div>
        </div>
      </div>
    `).join('');

    // Pagination
    if (data.pages > 1) {
      let paginationHTML = '';
      for (let i = 1; i <= data.pages; i++) {
        paginationHTML += `<button class="btn ${i === currentPage ? 'btn-primary' : 'btn-outline'} btn-sm" onclick="goToPage(${i})" style="margin: 0 4px;">${i}</button>`;
      }
      pagination.innerHTML = paginationHTML;
    } else {
      pagination.innerHTML = '';
    }
  }

  // Make goToPage globally accessible
  window.goToPage = function (page) {
    currentPage = page;
    loadProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Category filter
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.dataset.category;
      currentPage = 1;
      loadProducts();
    });
  });

  // Search with debounce
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        currentSearch = searchInput.value.trim();
        currentPage = 1;
        loadProducts();
      }, 400);
    });
  }

  loadProducts();
})();
