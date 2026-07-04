import { useEffect, useState } from 'react';
import Layout from './components/Layout';
import DashboardCard from './components/DashboardCard';
import FoodKnowledgeAutocomplete from './components/FoodKnowledgeAutocomplete';
import { CATEGORIES, getCategoryColor } from './constants/categories';
import { getProductStatus, formatDaysRemaining } from './utils/dateHelpers';
import {
  applyFoodKnowledgeDefaults,
  createEmptyFoodFormState,
  createFoodOverrideState,
  resolveFoodKnowledgeMatch,
} from './services/foodKnowledgeFormService';
import { STORAGE_LOCATIONS } from './data/foodKnowledge';

const STORAGE_KEY = 'expiry-go-products';

function App() {
  const [products, setProducts] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [form, setForm] = useState(() => createEmptyFoodFormState(CATEGORIES[0]));
  const [fieldOverrides, setFieldOverrides] = useState(() => createFoodOverrideState());
  const [foodSuggestions, setFoodSuggestions] = useState([]);

  // Edit state
  const [editingId, setEditingId] = useState(null);

  const resetForm = () => {
    setForm(createEmptyFoodFormState(CATEGORIES[0]));
    setFieldOverrides(createFoodOverrideState());
    setFoodSuggestions([]);
  };

  const updateFormField = (field, value, { markOverride = false } = {}) => {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));

    if (!markOverride) return;

    setFieldOverrides((currentOverrides) => ({
      ...currentOverrides,
      [field]: true,
    }));
  };

  const handleNameChange = (value) => {
    const lookup = resolveFoodKnowledgeMatch(value);

    setForm((currentForm) => {
      const nextForm = {
        ...currentForm,
        name: value,
        matchedFoodId: '',
        matchedFoodName: '',
      };

      return lookup.shouldAutoPopulate && lookup.matchedFood
        ? applyFoodKnowledgeDefaults(nextForm, lookup.matchedFood, fieldOverrides)
        : nextForm;
    });

    setFoodSuggestions(lookup.suggestions);

    if (lookup.shouldAutoPopulate && lookup.matchedFood) {
      setFieldOverrides(createFoodOverrideState());
    }
  };

  const handleSuggestionSelect = (food) => {
    setForm((currentForm) =>
      applyFoodKnowledgeDefaults({ ...currentForm, name: food.name }, food, createFoodOverrideState())
    );
    setFieldOverrides(createFoodOverrideState());
    setFoodSuggestions(resolveFoodKnowledgeMatch(food.name).suggestions);
  };

  const getQuantityValue = () => {
    const parsedQuantity = parseInt(form.quantity, 10);
    return Number.isFinite(parsedQuantity) && parsedQuantity > 0 ? parsedQuantity : 1;
  };

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
    if (!form.name.trim() || !form.expiryDate) return;

    const newProduct = {
      category: form.category,
      quantity: getQuantityValue(),
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      name: form.name.trim(),
      expiryDate: form.expiryDate,
      notes: form.notes.trim(),
      unit: form.unit.trim(),
      pantryShelfLife: form.pantryShelfLife.trim(),
      refrigeratorShelfLife: form.refrigeratorShelfLife.trim(),
      freezerShelfLife: form.freezerShelfLife.trim(),
      storageLocation: form.storageLocation.trim(),
      storageTemperature: form.storageTemperature.trim(),
      storageTips: form.storageTips.trim(),
      spoilageSigns: form.spoilageSigns.trim(),
      matchedFoodId: form.matchedFoodId,
      matchedFoodName: form.matchedFoodName,
      createdAt: new Date().toISOString(),
    };

    setProducts([newProduct, ...products]);
    resetForm();
  };

  const handleDeleteProduct = (id) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  const handleStartEdit = (product) => {
    setEditingId(product.id);
    setForm({
      ...createEmptyFoodFormState(CATEGORIES[0]),
      name: product.name,
      expiryDate: product.expiryDate,
      category: product.category,
      quantity: String(product.quantity ?? 1),
      unit: product.unit || '',
      pantryShelfLife: product.pantryShelfLife || '',
      refrigeratorShelfLife: product.refrigeratorShelfLife || '',
      freezerShelfLife: product.freezerShelfLife || '',
      storageLocation: product.storageLocation || '',
      storageTemperature: product.storageTemperature || '',
      storageTips: product.storageTips || '',
      spoilageSigns: product.spoilageSigns || '',
      notes: product.notes || '',
      matchedFoodId: product.matchedFoodId || '',
      matchedFoodName: product.matchedFoodName || '',
    });
    setFieldOverrides(createFoodOverrideState());
    setFoodSuggestions([]);
  };

  const handleSaveEdit = () => {
    if (!form.name.trim() || !form.expiryDate) return;

    setProducts(
      products.map((product) =>
        product.id === editingId
          ? {
              ...product,
              name: form.name.trim(),
              category: form.category,
              quantity: getQuantityValue(),
              unit: form.unit.trim(),
              expiryDate: form.expiryDate,
              notes: form.notes.trim(),
              pantryShelfLife: form.pantryShelfLife.trim(),
              refrigeratorShelfLife: form.refrigeratorShelfLife.trim(),
              freezerShelfLife: form.freezerShelfLife.trim(),
              storageLocation: form.storageLocation.trim(),
              storageTemperature: form.storageTemperature.trim(),
              storageTips: form.storageTips.trim(),
              spoilageSigns: form.spoilageSigns.trim(),
              matchedFoodId: form.matchedFoodId,
              matchedFoodName: form.matchedFoodName,
            }
          : product
      )
    );

    setEditingId(null);
    resetForm();
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    resetForm();
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
            <FoodKnowledgeAutocomplete
              label="Product name"
              value={form.name}
              placeholder="e.g. Milk, Millet, Pain killer"
              suggestions={foodSuggestions}
              onChange={handleNameChange}
              onSelectSuggestion={handleSuggestionSelect}
              helperText="Suggestions appear while typing. Selecting one fills the form."
            />

            {form.matchedFoodName && (
              <div className="match-banner field-full">
                <strong>Matched food</strong>
                <span>{form.matchedFoodName}</span>
              </div>
            )}

            <label className="field">
              <span>Category</span>
              <select
                value={form.category}
                onChange={(e) => updateFormField('category', e.target.value, { markOverride: true })}
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
                value={form.quantity}
                onChange={(e) => updateFormField('quantity', e.target.value, { markOverride: true })}
              />
            </label>

            <label className="field">
              <span>Default unit</span>
              <input
                type="text"
                value={form.unit}
                onChange={(e) => updateFormField('unit', e.target.value, { markOverride: true })}
                placeholder="e.g. piece, g, bottle"
              />
            </label>

            <label className="field">
              <span>Expiry date</span>
              <input
                type="date"
                value={form.expiryDate}
                onChange={(e) => updateFormField('expiryDate', e.target.value)}
              />
            </label>

            <label className="field">
              <span>Pantry shelf life</span>
              <input
                type="text"
                value={form.pantryShelfLife}
                onChange={(e) => updateFormField('pantryShelfLife', e.target.value, { markOverride: true })}
                placeholder="e.g. 2-7 days"
              />
            </label>

            <label className="field">
              <span>Refrigerator shelf life</span>
              <input
                type="text"
                value={form.refrigeratorShelfLife}
                onChange={(e) =>
                  updateFormField('refrigeratorShelfLife', e.target.value, { markOverride: true })
                }
                placeholder="e.g. 1-2 weeks"
              />
            </label>

            <label className="field">
              <span>Freezer shelf life</span>
              <input
                type="text"
                value={form.freezerShelfLife}
                onChange={(e) => updateFormField('freezerShelfLife', e.target.value, { markOverride: true })}
                placeholder="e.g. 3 months"
              />
            </label>

            <label className="field">
              <span>Storage location</span>
              <select
                value={form.storageLocation}
                onChange={(e) => updateFormField('storageLocation', e.target.value, { markOverride: true })}
              >
                <option value="">Select storage</option>
                {Object.values(STORAGE_LOCATIONS).map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>Ideal storage temperature</span>
              <input
                type="text"
                value={form.storageTemperature}
                onChange={(e) =>
                  updateFormField('storageTemperature', e.target.value, { markOverride: true })
                }
                placeholder="e.g. 0-4 C"
              />
            </label>

            <label className="field field-full">
              <span>Spoilage signs</span>
              <textarea
                value={form.spoilageSigns}
                onChange={(e) => updateFormField('spoilageSigns', e.target.value, { markOverride: true })}
                placeholder="Separate with commas or new lines"
                rows="3"
              />
            </label>

            <label className="field field-full">
              <span>Storage tips</span>
              <textarea
                value={form.storageTips}
                onChange={(e) => updateFormField('storageTips', e.target.value, { markOverride: true })}
                placeholder="Food-specific storage guidance"
                rows="3"
              />
            </label>

            <label className="field field-full">
              <span>Notes (optional)</span>
              <textarea
                value={form.notes}
                onChange={(e) => updateFormField('notes', e.target.value)}
                placeholder="Store instructions, batch info, or location"
                rows="3"
              />
            </label>

            <button
              className="primary-button"
              type="button"
              onClick={editingId ? handleSaveEdit : handleAddProduct}
              disabled={!form.name.trim() || !form.expiryDate}
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
                      <p className="product-meta">
                        Qty: {product.quantity}
                        {product.unit ? ` ${product.unit}` : ''}
                      </p>
                      <p className="product-meta">Expiry: {product.expiryDate}</p>
                      {(product.storageLocation || product.pantryShelfLife || product.refrigeratorShelfLife || product.freezerShelfLife || product.storageTemperature) && (
                        <div className="storage-summary">
                          {product.storageLocation && <span>{product.storageLocation}</span>}
                          {product.storageTemperature && <span>{product.storageTemperature}</span>}
                          {product.pantryShelfLife && <span>Pantry: {product.pantryShelfLife}</span>}
                          {product.refrigeratorShelfLife && <span>Fridge: {product.refrigeratorShelfLife}</span>}
                          {product.freezerShelfLife && <span>Freezer: {product.freezerShelfLife}</span>}
                        </div>
                      )}
                      <p className="product-days" style={{ color: status.color }}>
                        {formatDaysRemaining(status.daysRemaining)}
                      </p>
                      {product.storageTips && <p className="product-tips">{product.storageTips}</p>}
                      {product.spoilageSigns && <p className="product-notes">Spoilage signs: {product.spoilageSigns}</p>}
                      {product.matchedFoodName && <p className="product-notes">Matched food: {product.matchedFoodName}</p>}
                      {product.notes && <p className="product-notes">{product.notes}</p>}
                    </div>
                    <div className="product-actions">
                      <button
                        className="edit-button"
                        onClick={() => handleStartEdit(product)}
                        title="Edit this product"
                      >
                        Edit
                      </button>
                      <button
                        className="delete-button"
                        onClick={() => handleDeleteProduct(product.id)}
                        title="Delete this product"
                      >
                        Delete
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
