// ===== Product Detail Page =====

(async function () {
  const container = document.getElementById('product-content');
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const productId = params.get('id');

  if (!productId) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">&#x2753;</div>
        <h3>Product not found</h3>
        <p>No product ID specified.</p>
        <a href="/products.html" class="btn btn-primary">Browse Products</a>
      </div>
    `;
    return;
  }

  const { data, error } = await apiFetch(`/products/${productId}`);

  if (error || !data || !data.product) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">&#x2753;</div>
        <h3>Product not found</h3>
        <p>${error || 'This product may have been removed.'}</p>
        <a href="/products.html" class="btn btn-primary">Browse Products</a>
      </div>
    `;
    return;
  }

  const product = data.product;
  const user = getUser();
  const isCustomer = user && user.role === 'customer';
  const inStock = product.quantity > 0;

  document.title = `${product.name} - FarmKart`;

  container.innerHTML = `
    <div class="product-detail">
      <img class="product-image" src="${product.imageUrl || 'https://placehold.co/600x500/e9ecef/666?text=' + encodeURIComponent(product.name)}" alt="${product.name}" onerror="this.src='https://placehold.co/600x500/e9ecef/666?text=Product'">
      <div class="product-info">
        <h1>${product.name}</h1>
        <span class="badge badge-category">${product.category}</span>
        <p class="product-price">${formatPrice(product.price)} / ${product.unit}</p>
        <div class="product-meta">
          <p><strong>Farmer:</strong> ${product.farmer ? product.farmer.name : 'Local Farmer'}</p>
          <p><strong>Stock:</strong> ${inStock ? `${product.quantity} ${product.unit} available` : '<span style="color: var(--color-danger);">Out of stock</span>'}</p>
        </div>
        <div class="product-description">
          <p>${product.description}</p>
        </div>
        ${isCustomer && inStock ? `
          <div class="quantity-selector">
            <label style="font-weight: 600;">Quantity:</label>
            <button onclick="changeQty(-1)">-</button>
            <input type="number" id="qty-input" value="1" min="1" max="${product.quantity}" readonly>
            <button onclick="changeQty(1)">+</button>
          </div>
          <button class="btn btn-primary btn-lg" id="add-to-cart-btn" onclick="addToCart('${product._id}')">Add to Cart</button>
        ` : !isAuthenticated() ? `
          <p style="margin-top: 24px;"><a href="/login.html" class="btn btn-primary">Login to Purchase</a></p>
        ` : !inStock ? `
          <p style="margin-top: 24px; color: var(--color-danger); font-weight: 600;">This product is currently out of stock.</p>
        ` : ''}
        <div style="margin-top: 24px;">
          <a href="/products.html" class="btn btn-outline btn-sm">&larr; Back to Products</a>
        </div>
      </div>
    </div>
  `;
})();

function changeQty(delta) {
  const input = document.getElementById('qty-input');
  if (!input) return;
  const newVal = parseInt(input.value) + delta;
  const max = parseInt(input.max);
  if (newVal >= 1 && newVal <= max) {
    input.value = newVal;
  }
}

async function addToCart(productId) {
  const qty = parseInt(document.getElementById('qty-input').value);
  const btn = document.getElementById('add-to-cart-btn');

  btn.disabled = true;
  btn.textContent = 'Adding...';

  const { data, error } = await apiFetch('/cart', {
    method: 'POST',
    body: JSON.stringify({ productId, quantity: qty })
  });

  btn.disabled = false;
  btn.textContent = 'Add to Cart';

  if (error) {
    showToast(error, 'error');
    return;
  }

  showToast('Added to cart!', 'success');
  // Update cart badge
  if (typeof updateCartBadge === 'function') {
    updateCartBadge();
  }
}
