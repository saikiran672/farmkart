// ===== Farmer Dashboard =====

(function () {
  if (!requireAuth('farmer')) return;

  const form = document.getElementById('product-form');
  const productsList = document.getElementById('products-list');
  const formTitle = document.getElementById('form-title');
  const submitBtn = document.getElementById('form-submit-btn');
  const cancelBtn = document.getElementById('cancel-edit-btn');
  const editIdField = document.getElementById('edit-id');

  if (!form || !productsList) return;

  loadMyProducts();

  async function loadMyProducts() {
    productsList.innerHTML = '<div class="spinner"></div>';

    const { data, error } = await apiFetch('/products/farmer/me');

    if (error || !data) {
      productsList.innerHTML = '<div class="alert alert-error" style="margin: 20px;">Failed to load products.</div>';
      return;
    }

    const products = data.products || [];

    if (products.length === 0) {
      productsList.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">&#x1F33E;</div>
          <h3>No products yet</h3>
          <p>Use the form to add your first product.</p>
        </div>
      `;
      return;
    }

    productsList.innerHTML = `
      <table class="table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${products.map(p => `
            <tr>
              <td><strong>${p.name}</strong></td>
              <td><span class="badge badge-category">${p.category}</span></td>
              <td>${formatPrice(p.price)}/${p.unit}</td>
              <td>${p.quantity > 0 ? p.quantity : '<span style="color: var(--color-danger);">0</span>'}</td>
              <td>
                <div class="actions">
                  <button class="btn btn-outline btn-sm" onclick="editProduct('${p._id}')">Edit</button>
                  <button class="btn btn-danger btn-sm" onclick="deleteProduct('${p._id}', '${p.name.replace(/'/g, "\\'")}')">Delete</button>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  // Form submit - Add or Update
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const productData = {
      name: document.getElementById('prod-name').value.trim(),
      description: document.getElementById('prod-desc').value.trim(),
      price: parseFloat(document.getElementById('prod-price').value),
      quantity: parseInt(document.getElementById('prod-quantity').value),
      category: document.getElementById('prod-category').value,
      unit: document.getElementById('prod-unit').value,
      imageUrl: document.getElementById('prod-image').value.trim()
    };

    if (!productData.name || !productData.description || !productData.category) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    submitBtn.disabled = true;
    const editId = editIdField.value;

    if (editId) {
      submitBtn.textContent = 'Updating...';
      const { error } = await apiFetch(`/products/${editId}`, {
        method: 'PUT',
        body: JSON.stringify(productData)
      });
      submitBtn.disabled = false;
      submitBtn.textContent = 'Update Product';

      if (error) {
        showToast(error, 'error');
        return;
      }
      showToast('Product updated!', 'success');
      cancelEdit();
    } else {
      submitBtn.textContent = 'Adding...';
      const { error } = await apiFetch('/products', {
        method: 'POST',
        body: JSON.stringify(productData)
      });
      submitBtn.disabled = false;
      submitBtn.textContent = 'Add Product';

      if (error) {
        showToast(error, 'error');
        return;
      }
      showToast('Product added!', 'success');
      form.reset();
    }

    loadMyProducts();
  });

  // Edit product - populate form
  window.editProduct = async function (id) {
    const { data, error } = await apiFetch(`/products/${id}`);
    if (error || !data || !data.product) {
      showToast('Failed to load product', 'error');
      return;
    }

    const p = data.product;
    editIdField.value = p._id;
    document.getElementById('prod-name').value = p.name;
    document.getElementById('prod-desc').value = p.description;
    document.getElementById('prod-price').value = p.price;
    document.getElementById('prod-quantity').value = p.quantity;
    document.getElementById('prod-category').value = p.category;
    document.getElementById('prod-unit').value = p.unit;
    document.getElementById('prod-image').value = p.imageUrl || '';

    formTitle.textContent = 'Edit Product';
    submitBtn.textContent = 'Update Product';
    cancelBtn.style.display = 'block';

    document.getElementById('product-form-container').scrollIntoView({ behavior: 'smooth' });
  };

  // Delete product
  window.deleteProduct = async function (id, name) {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    const { error } = await apiFetch(`/products/${id}`, { method: 'DELETE' });
    if (error) {
      showToast(error, 'error');
      return;
    }
    showToast('Product deleted', 'success');
    loadMyProducts();
  };

  // Cancel edit
  window.cancelEdit = function () {
    editIdField.value = '';
    form.reset();
    formTitle.textContent = 'Add New Product';
    submitBtn.textContent = 'Add Product';
    cancelBtn.style.display = 'none';
  };
})();
