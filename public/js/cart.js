// ===== Cart Page =====

(function () {
  if (!requireAuth()) return;

  const container = document.getElementById('cart-content');
  if (!container) return;

  loadCart();

  async function loadCart() {
    container.innerHTML = '<div class="spinner"></div>';

    const { data, error } = await apiFetch('/cart');

    if (error || !data || !data.cart) {
      container.innerHTML = '<div class="alert alert-error">Failed to load cart.</div>';
      return;
    }

    const items = data.cart.items || [];

    if (items.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">&#x1F6D2;</div>
          <h3>Your cart is empty</h3>
          <p>Browse our products and add some items to your cart.</p>
          <a href="/products.html" class="btn btn-primary">Browse Products</a>
        </div>
      `;
      return;
    }

    let total = 0;
    const itemsHTML = items.map(item => {
      const product = item.product;
      if (!product) return '';
      const subtotal = product.price * item.quantity;
      total += subtotal;
      return `
        <div class="cart-item">
          <img src="${product.imageUrl || 'https://placehold.co/80x80/e9ecef/666?text=P'}" alt="${product.name}" onerror="this.src='https://placehold.co/80x80/e9ecef/666?text=P'">
          <div class="item-info">
            <h3>${product.name}</h3>
            <p>${formatPrice(product.price)} / ${product.unit}</p>
          </div>
          <div class="quantity-selector" style="margin: 0;">
            <button onclick="updateQty('${item._id}', ${item.quantity - 1})">-</button>
            <input type="number" value="${item.quantity}" min="1" readonly style="width: 50px;">
            <button onclick="updateQty('${item._id}', ${item.quantity + 1})">+</button>
          </div>
          <span class="item-price">${formatPrice(subtotal)}</span>
          <button class="btn btn-danger btn-sm" onclick="removeItem('${item._id}')">Remove</button>
        </div>
      `;
    }).join('');

    container.innerHTML = `
      <div class="cart-items">${itemsHTML}</div>
      <div class="cart-summary">
        <div class="summary-row">
          <span>Items (${items.length})</span>
          <span>${formatPrice(total)}</span>
        </div>
        <div class="summary-row">
          <span>Total</span>
          <span>${formatPrice(total)}</span>
        </div>
        <div style="display: flex; gap: 12px; margin-top: 20px;">
          <button class="btn btn-danger btn-sm" onclick="clearEntireCart()">Clear Cart</button>
          <button class="btn btn-primary" style="flex:1;" onclick="checkout()">Proceed to Checkout</button>
        </div>
      </div>
    `;
  }

  window.updateQty = async function (itemId, newQty) {
    if (newQty < 1) {
      removeItem(itemId);
      return;
    }
    const { error } = await apiFetch(`/cart/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity: newQty })
    });
    if (error) {
      showToast(error, 'error');
      return;
    }
    loadCart();
    if (typeof updateCartBadge === 'function') updateCartBadge();
  };

  window.removeItem = async function (itemId) {
    const { error } = await apiFetch(`/cart/${itemId}`, { method: 'DELETE' });
    if (error) {
      showToast(error, 'error');
      return;
    }
    showToast('Item removed', 'success');
    loadCart();
    if (typeof updateCartBadge === 'function') updateCartBadge();
  };

  window.clearEntireCart = async function () {
    if (!confirm('Are you sure you want to clear your cart?')) return;
    const { error } = await apiFetch('/cart', { method: 'DELETE' });
    if (error) {
      showToast(error, 'error');
      return;
    }
    showToast('Cart cleared', 'success');
    loadCart();
    if (typeof updateCartBadge === 'function') updateCartBadge();
  };

  window.checkout = function () {
    // Show checkout modal
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal">
        <h3>Checkout</h3>
        <p style="margin-bottom: 16px; color: var(--color-text-light);">Enter your shipping address to place the order.</p>
        <div class="form-group">
          <label class="form-label" for="shipping-address">Shipping Address</label>
          <textarea id="shipping-address" class="form-textarea" placeholder="Enter your full shipping address" rows="3"></textarea>
        </div>
        <div class="modal-actions">
          <button class="btn btn-outline btn-sm" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
          <button class="btn btn-primary" id="place-order-btn" onclick="placeOrder()">Place Order</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.remove();
    });
  };

  window.placeOrder = async function () {
    const address = document.getElementById('shipping-address').value.trim();
    if (!address) {
      showToast('Please enter a shipping address', 'error');
      return;
    }

    const btn = document.getElementById('place-order-btn');
    btn.disabled = true;
    btn.textContent = 'Placing order...';

    const { data, error } = await apiFetch('/orders', {
      method: 'POST',
      body: JSON.stringify({ shippingAddress: address })
    });

    if (error) {
      btn.disabled = false;
      btn.textContent = 'Place Order';
      showToast(error, 'error');
      return;
    }

    document.querySelector('.modal-overlay').remove();
    showToast('Order placed successfully!', 'success');
    if (typeof updateCartBadge === 'function') updateCartBadge();

    setTimeout(() => {
      window.location.href = '/orders.html';
    }, 1500);
  };
})();
