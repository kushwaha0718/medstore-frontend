import { useEffect, useState } from 'react';
import { X, ImageIcon } from 'lucide-react';

export default function AddProductModal({ isOpen, onClose, onProductAdded }) {

  const [formData, setFormData] = useState({
    productName: '',
    productDescription: '',
    productPrice: '',
    productManufacturer: '',
    productStrength: '',
    productUnit: ''
  });

  const [units, setUnits] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const [productImage, setProductImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState(false);

  const API_URL = import.meta.env.VITE_API_BASE_URL;

  /* ---------------- FETCH UNITS + CATEGORIES ---------------- */
  useEffect(() => {
    if (!isOpen) return;

    fetch(`${API_URL}/unit/get-all-units`)
      .then(res => res.json())
      .then(data => setUnits(data))
      .catch(() => setFormError('Failed to load units'));

    fetch(`${API_URL}/category/get-all`)
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(() => setFormError('Failed to load categories'));

  }, [isOpen]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormError('');
  };


  const handleCategorySelect = (e) => {
    const id = Number(e.target.value);
    if (!id) return;

    const category = categories.find(c => c.categoryId === id);
    setSelectedCategories(prev => [...prev, category]);

    e.target.value = "";
  };


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024)
      return setFormError('Image must be less than 5MB');
    if (!file.type.startsWith('image/'))
      return setFormError('Select a valid image');

    setProductImage(file);
    setImagePreview(URL.createObjectURL(file));
  };


  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      productName,
      productDescription,
      productPrice,
      productManufacturer,
      productStrength,
      productUnit
    } = formData;

    if (
      !productName ||
      !productDescription ||
      !productPrice ||
      !productManufacturer ||
      !productStrength ||
      !productUnit ||
      !productImage ||
      selectedCategories.length === 0
    ) {
      return setFormError('All fields including categories are required');
    }

    setSubmitting(true);

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) =>
      data.append(key, value)
    );

    // Add category IDs as array → Spring handles it correctly
    data.append("categories", selectedCategories.map(c => c.categoryId));

    data.append('productImage', productImage);

    try {
      const res = await fetch(`${API_URL}/product/add-product`, {
        method: 'POST',
        body: data
      });

      if (!res.ok) throw new Error('Failed to add product');

      setSuccess(true);
      setTimeout(() => {
        onProductAdded();
        handleClose();
      }, 1200);

    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };


  const handleClose = () => {
    setFormData({
      productName: '',
      productDescription: '',
      productPrice: '',
      productManufacturer: '',
      productStrength: '',
      productUnit: ''
    });
    setProductImage(null);
    setImagePreview(null);
    setSelectedCategories([]);
    setFormError('');
    setSuccess(false);
    onClose();
  };


  if (!isOpen) return null;


  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-xl font-bold">Add Product</h2>
          <button onClick={handleClose}>
            <X className="text-gray-600" />
          </button>
        </div>

        {success && (
          <p className="bg-green-100 text-green-700 p-3 m-4 rounded">
            Product added successfully!
          </p>
        )}

        {formError && (
          <p className="bg-red-100 text-red-700 p-3 m-4 rounded">
            {formError}
          </p>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          {/* Product Name */}
          <input className="w-full p-3 border rounded"
            name="productName"
            placeholder="Product Name"
            value={formData.productName}
            onChange={handleInputChange}
          />

          {/* Product Description */}
          <textarea className="w-full p-3 border rounded"
            name="productDescription"
            rows={4}
            placeholder="Product Description"
            value={formData.productDescription}
            onChange={handleInputChange}
          />

          {/* Price */}
          <input className="w-full p-3 border rounded"
            type="number"
            min="0"
            name="productPrice"
            placeholder="Price (₹)"
            value={formData.productPrice}
            onChange={handleInputChange}
          />

          {/* Manufacturer */}
          <input className="w-full p-3 border rounded"
            name="productManufacturer"
            placeholder="Manufacturer"
            value={formData.productManufacturer}
            onChange={handleInputChange}
          />

          {/* Strength */}
          <input className="w-full p-3 border rounded"
            name="productStrength"
            placeholder="Strength (e.g. 500mg, 10ml)"
            value={formData.productStrength}
            onChange={handleInputChange}
          />

          {/* Unit Dropdown */}
          <select
            className="w-full p-3 border rounded"
            name="productUnit"
            value={formData.productUnit}
            onChange={handleInputChange}
          >
            <option value="">Select Unit</option>
            {units.map(unit => (
              <option key={unit.unitId} value={unit.unitName}>
                {unit.unitName}
              </option>
            ))}
          </select>

          

          {/* Category Select */}
          <select
            className="w-full p-3 border rounded"
            onChange={handleCategorySelect}
          >
            <option value="">Select Category</option>

            {categories
              .filter(cat => !selectedCategories.some(s => s.categoryId === cat.categoryId))
              .map(cat => (
                <option key={cat.categoryId} value={cat.categoryId}>
                  {cat.categoryName}
                </option>
              ))}
          </select>

          {/* CATEGORY TAGS */}
          <div className="flex flex-wrap gap-2">
            <h1>Selected Category : </h1>
            {selectedCategories.map(cat => (
              <span
                key={cat.categoryId}
                className="flex items-center gap-2 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm"
              >
                {cat.categoryName}
                <button
                  type="button"
                  onClick={() =>
                    setSelectedCategories(prev =>
                      prev.filter(c => c.categoryId !== cat.categoryId)
                    )
                  }
                >
                  <X className="w-4 h-4" />
                </button>
              </span>
            ))}
          </div>

          {/* Image Upload */}
          {imagePreview ? (
            <div className="relative">
              <img src={imagePreview} className="w-full h-56 object-cover rounded" />
              <button type="button"
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded"
                onClick={() => {
                  setImagePreview(null);
                  setProductImage(null);
                }}>
                <X />
              </button>
            </div>
          ) : (
            <label className="border-dashed border-2 rounded p-10 text-center cursor-pointer block">
              <ImageIcon className="mx-auto text-gray-400 mb-2" />
              <p>Click to upload product image</p>
              <input type="file" accept="image/*" hidden onChange={handleImageChange} />
            </label>
          )}

          <button
            disabled={submitting}
            className="w-full bg-emerald-600 text-white py-3 rounded hover:bg-emerald-700 transition"
          >
            {submitting ? 'Adding...' : 'Add Product'}
          </button>

        </form>
      </div>
    </div>
  );
}
