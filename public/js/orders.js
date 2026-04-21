// ===== Orders Page =====

(function () {
  if (!requireAuth()) return;

  const container = document.getElementById('orders-content');
  if (!container) return;

  loadOrders();

  async function loadOrders() {
    container.innerHTML = '<div class="spinner"></div>';

    const { data, error } = await apiFetch('/orders');

    if (error || !data) {
      container.innerHTML = '<div class="alert alert-error">Failed to load orders.</div>';
      return;
    }

    const orders = data.orders || [];

    if (orders.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">&#x1F4E6;</div>
          <h3>No orders yet</h3>
          <p>You haven't placed any orders yet. Start shopping!</p>
          <a href="/products.html" class="btn btn-primary">Browse Products</a>
        </div>
      `;
      return;
    }

    container.innerHTML = orders.map(order => {
      const date = new Date(order.createdAt).toLocaleDateString('en-IN', {
        year: 'numeric', month: 'short', day: 'numeric'
      });
      const itemsHTML = order.items.map(item => `
        <div class="order-item">
          <span>${item.name} x ${item.quantity}</span>
          <span>${formatPrice(item.price * item.quantity)}</span>
        </div>
      `).join('');

      return `
        <div class="order-card">
          <div class="order-header" onclick="this.nextElementSibling.classList.toggle('show')">
            <div>
              <strong>Order #${order._id.slice(-8).toUpperCase()}</strong>
              <span style="color: var(--color-text-light); margin-left: 12px;">${date}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 16px;">
              <span class="badge badge-status badge-${order.status}">${order.status}</span>
              <strong>${formatPrice(order.totalAmount)}</strong>
            </div>
          </div>
          <div class="order-details">
            <p style="margin-bottom: 12px; color: var(--color-text-light);"><strong>Ship to:</strong> ${order.shippingAddress}</p>
            ${itemsHTML}
            <div class="order-item" style="font-weight: 700; border-top: 2px solid #eee; margin-top: 8px; padding-top: 12px;">
              <span>Total</span>
              <span>${formatPrice(order.totalAmount)}</span>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }
})();
