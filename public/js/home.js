// ===== Home Page - Featured Products =====

(async function () {
  const container = document.getElementById('featured-products');
  if (!container) return;

  const { data, error } = await apiFetch('/products?limit=6');

  if (error || !data || !data.products) {
    container.innerHTML = '<p style="text-align:center; color: var(--color-text-light);">Unable to load products right now.</p>';
    return;
  }

  if (data.products.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column: 1/-1;">
        <div class="empty-icon">&#x1F331;</div>
        <h3>No products yet</h3>
        <p>Farmers are still setting up their shops. Check back soon!</p>
      </div>
    `;
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
            ${product.farmer ? product.farmer.name : 'Local Farmer'}
          </span>
          <a href="/product-detail.html?id=${product._id}" class="btn btn-primary btn-sm">View Details</a>
        </div>
      </div>
    </div>
  `).join('');
})();
