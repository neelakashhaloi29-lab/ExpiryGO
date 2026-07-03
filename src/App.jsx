import { useEffect, useState } from 'react';
import Layout from './components/Layout';
import DashboardCard from './components/DashboardCard';
import { CATEGORIES, getCategoryColor } from './constants/categories';
import { getProductStatus, formatDaysRemaining } from './utils/dateHelpers';

const STORAGE_KEY = 'expiry-go-products';

function App() {
  const [products, setProducts] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Add form state
  const [name, setName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  
  // Edit state
  const [editingId, setEditingId] = useState(null);

  // Load products from storage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setProducts(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to read saved products', error);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save products to storage whenever they change (but not on initial load)
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    }
  }, [products, isLoaded]);

  const handleAddProduct = () => {
    if (!name.trim() || !expiryDate) return;

    const newProduct = {
      category,
      quantity: parseInt(quantity, 10),
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      name: name.trim(),
      expiryDate,
      notes: notes.trim(),
      createdAt: new Date().toISOString(),
    };

    setCategory(CATEGORIES[0]);
    setQuantity(1);
    setProducts([newProduct, ...products]);
    setName('');
    setExpiryDate('');
    setNotes('');
  };

  const handleDeleteProduct = (id) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  const handleStartEdit = (product) => {
    setEditingId(product.id);
    setName(product.name);
    setCategory(product.category);
    setQuantity(product.quantity);
    setExpiryDate(product.expiryDate);
    setNotes(product.notes);
  };

  const handleSaveEdit = () => {
    if (!name.trim() || !expiryDate) return;

    setProducts(
      products.map((product) =>
        product.id === editingId
          ? {
              ...product,
              name: name.trim(),
              category,
              quantity: parseInt(quantity, 10),
              expiryDate,
              notes: notes.trim(),
            }
          : product
      )
    );

    setEditingId(null);
    setName('');
    setCategory(CATEGORIES[0]);
    setQuantity(1);
    setExpiryDate('');
    setNotes('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setName('');
    setCategory(CATEGORIES[0]);
    setQuantity(1);
    setExpiryDate('');
    setNotes('');
  };

  return (
    <Layout>
      <header className="app-header">
        <p className="eyebrow">ExpiryGo</p>
        <div>
          <h1 className="app-title">Never forget an expiry date</h1>
          <p className="app-copy">
            Add products and expiry dates. Data is saved locally so your list stays
            after refresh, browser restart, or computer reboot.
          </p>
        </div>
      </header>

      <div className="app-grid">
        <DashboardCard
          title={editingId ? "Edit product" : "Add product"}
          description={editingId ? "Update product details and save changes." : "Save a new item with expiry date and optional notes."}
        >
          <div className="form-grid">
            <label className="field">
              <span>Product name</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Milk, Yogurt, Pain killer"
              />
            </label>

            <label className="field">
              <span>Category</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>Quantity</span>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </label>

            <label className="field">
              <span>Expiry date</span>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
              />
            </label>

            <label className="field field-full">
              <span>Notes (optional)</span>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Store instructions, batch info, or location"
                rows="3"
              />
            </label>

            <button
              className="primary-button"
              type="button"
              onClick={editingId ? handleSaveEdit : handleAddProduct}
              disabled={!name.trim() || !expiryDate}
            >
              {editingId ? "Save changes" : "Add product"}
            </button>
            {editingId && (
              <button
                className="secondary-button"
                type="button"
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
            )}
          </div>
        </DashboardCard>

        <DashboardCard
          title="Your shelf"
          description="Products stored locally and available offline."
        >
          <div className="stat-card">
            <strong>{products.length}</strong>
            <span>Items being tracked</span>
          </div>
        </DashboardCard>

        <DashboardCard
          title="Saved products"
          description="Review products added to the tracker."
          className="card-full"
        >
          {products.length === 0 ? (
            <div className="placeholder">
              <p className="placeholder-box">No products yet. Add one to start tracking expiry dates.</p>
            </div>
          ) : (
            <div className="product-list">
              {products.map((product) => {
                const status = getProductStatus(product.expiryDate);
                return (
                  <article key={product.id} className="product-card" style={{ borderLeftColor: status.color }}>
                    <div>
                      <div className="product-header">
                        <h3>{product.name}</h3>
                        <span
                          className="status-badge"
                          style={{
                            backgroundColor: status.backgroundColor,
                            color: status.color,
                          }}
                        >
                          {status.label}
                        </span>
                      </div>
                      <p className="product-meta" style={{ color: getCategoryColor(product.category) }}>{product.category}</p>
                      <p className="product-meta">Qty: {product.quantity}</p>
                      <p className="product-meta">Expiry: {product.expiryDate}</p>
                      <p className="product-days" style={{ color: status.color }}>
                        {formatDaysRemaining(status.daysRemaining)}
                      </p>
                      {product.notes && <p className="product-notes">{product.notes}</p>}
                    </div>
                    <div className="product-actions">
                      <button
                        className="edit-button"
                        onClick={() => handleStartEdit(product)}
                        title="Edit this product"
                      >
                        ✎
                      </button>
                      <button
                        className="delete-button"
                        onClick={() => handleDeleteProduct(product.id)}
                        title="Delete this product"
                      >
                        ✕
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </DashboardCard>
      </div>
    </Layout>
  );
}

export default App;