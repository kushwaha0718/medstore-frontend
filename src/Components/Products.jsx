import { useState, useEffect, useRef } from 'react';
import {
  Search,
  AlertCircle,
  Plus,
  Phone,
  MessageCircleMore,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
} from 'lucide-react';

import AddProductModal from './AddProductModal';
import ProductDetailsModal from './ProductDetailsModal';

const PRODUCTS_PER_PAGE = 12;

export default function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null); // ⭐ NEW

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('default');

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [allCategories, setAllCategories] = useState([]); // Loaded from API
  const scrollRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_BASE_URL;

  /* ---------------- INITIAL LOAD ---------------- */
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  /* ---------------- FETCH PRODUCTS ---------------- */
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/product/get-all-products`);
      if (!response.ok) throw new Error('Failed to fetch products');

      const data = await response.json();
      setProducts(data);
      setFilteredProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- FETCH CATEGORIES ---------------- */
  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/category/get-all`);
      if (!response.ok) throw new Error('Failed to fetch categories');

      const data = await response.json();
      setAllCategories(data);
    } catch (err) {
      console.error("Category loading failed", err);
    }
  };

  const handleProductAdded = () => {
    fetchProducts();
  };

  /* ---------------- FILTERING + SEARCH + SORT ---------------- */
  useEffect(() => {
    let filtered = [...products];

    /* 🔍 Search Filter */
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(prod =>
        prod.productName?.toLowerCase().includes(q) ||
        prod.productDescription?.toLowerCase().includes(q) ||
        prod.productStrength?.toLowerCase().includes(q) ||
        prod.productManufacturer?.toLowerCase().includes(q)
      );
    }

    /* 📌 CATEGORY FILTER */
    if (selectedCategory !== null) {
      filtered = filtered.filter(prod =>
        prod.categories?.includes(selectedCategory)
      );
    }

    /* ↕ Sorting */
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => (a.productPrice || 0) - (b.productPrice || 0));
        break;
      case "price-high":
        filtered.sort((a, b) => (b.productPrice || 0) - (a.productPrice || 0));
        break;
      case "name-asc":
        filtered.sort((a, b) => (a.productName || "").localeCompare(b.productName || ""));
        break;
      case "name-desc":
        filtered.sort((a, b) => (b.productName || "").localeCompare(a.productName || ""));
        break;
      case "newest":
        filtered.sort((a, b) => {
          const dateA = new Date(a.productUploadDate || 0);
          const dateB = new Date(b.productUploadDate || 0);
          return dateB - dateA;
        });
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, products, sortBy]);

  /* ---------------- PAGINATION ---------------- */
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  /* ---------------- IMAGE FORMATTER ---------------- */
  const getImageSrc = (imageData) =>
    imageData ? `data:image/jpeg;base64,${imageData}` : "/api/placeholder/300/300";

  /* ---------------- UI ---------------- */
  return (
    <section className="w-full py-8 px-4">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              Explore <span className="text-emerald-600">Products</span>
            </h2>
            <p className="text-gray-600">
              Browse our collection of quality medicines and healthcare products
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 shadow-md"
          >
            <Plus className="h-5 w-5" />
            Add Product
          </button>
        </div>

        <AddProductModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onProductAdded={handleProductAdded}
        />



        {/* SEARCH + SORT */}
        <div className="mb-8 max-w-2xl mx-auto flex flex-col md:flex-row md:items-center md:justify-center gap-4 md:gap-6">

          <div className="relative w-full md:w-auto flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <ArrowUpDown className="h-5 w-5 text-gray-600" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full md:w-auto px-4 py-3 rounded-lg border-2 border-gray-200"
            >
              <option value="default">Default</option>
              <option value="price-low">Price: Low → High</option>
              <option value="price-high">Price: High → Low</option>
              <option value="name-asc">Name: A → Z</option>
              <option value="name-desc">Name: Z → A</option>
              <option value="newest">Newest First</option>
            </select>
          </div>
        </div>

        {/* ⭐ CATEGORY FILTER BAR */}
        {/* CATEGORY FILTER BAR WITH ARROWS */}
        <div className="relative mb-6">
        
          {/* Left Arrow */}
          <button
            onClick={() => scrollRef.current.scrollBy({ left: -150, behavior: "smooth" })}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10
           bg-white p-2 rounded-full
           shadow-[0_2px_12px_rgba(0,0,0,0.7)]
           border border-gray-200
           hover:bg-gray-100 active:scale-90 transition"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>

          {/* Scrollable Category Row */}
          <div
            ref={scrollRef}
            className="flex gap-2 overflow-x-auto scrollbar-hide px-12"
          >
            {/* ALL Button */}
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full border text-sm shrink-0 transition ${selectedCategory === null
                ? "bg-emerald-600 text-white"
                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
            >
              All
            </button>

            {/* Category Buttons */}
            {allCategories.map((cat) => (
              <button
                key={cat.categoryId}
                onClick={() =>
                  setSelectedCategory((prev) =>
                    prev === cat.categoryId ? null : cat.categoryId
                  )
                }
                className={`px-4 py-2 rounded-full border text-sm shrink-0 transition ${selectedCategory === cat.categoryId
                  ? "bg-emerald-600 text-white"
                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-100"
                  }`}
              >
                {cat.categoryName}
              </button>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => scrollRef.current.scrollBy({ left: 150, behavior: "smooth" })}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10
           bg-white p-2 rounded-2xl
           shadow-[0_2px_12px_rgba(0,0,0,0.7)]
           hover:bg-gray-100 active:scale-90 transition"

          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>
        </div>



        {/* NO PRODUCT FOUND */}
        {filteredProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-gray-600">
            <img src="/public/nothing_found.png" className="w-40 opacity-70" />
            <p className="mt-4 text-lg font-medium">No products found</p>
          </div>
        )}

        {/* PRODUCT GRID */}
        {filteredProducts.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-3 md:gap-4">
            {currentProducts.map((product, index) => (
              <div
                key={index}
                onClick={() => {
                  const categoryNames =
                    product.categories?.map(id => {
                      const c = allCategories.find(cat => cat.categoryId === id);
                      return c ? c.categoryName : "Unknown";
                    }) || [];

                  setSelectedProduct({ ...product, categoryNames });
                }}
                className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-emerald-500 hover:shadow-xl transition cursor-pointer"
              >
                <div className="relative h-44 bg-gray-100 overflow-hidden">
                  <img
                    src={getImageSrc(product.productImageData)}
                    alt={product.productName}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="font-semibold text-gray-800 line-clamp-1">
                    {product.productName}
                  </h3>

                  <div className="text-xs text-gray-500 space-y-0.5">
                    <p><span className="font-medium">Strength:</span> {product.productStrength}</p>
                    <p className="line-clamp-1"><span className="font-medium">Manufacturer:</span> {product.productManufacturer}</p>
                  </div>

                  <div className="flex items-end gap-1 pt-1">
                    <span className="text-2xl font-bold text-emerald-600">
                      ₹{product.productPrice}
                    </span>
                    <span className="text-sm text-gray-500 mb-0.5">/ {product.productUnit}</span>
                  </div>

                  <div className="flex gap-2 pt-2" onClick={(e) => e.stopPropagation()}>
                    <a
                      href="tel:+918100620066"
                      className="flex-1 flex items-center justify-center bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700"
                    >
                      <Phone size={18} />
                    </a>

                    <a
                      href={`https://wa.me/918100620066?text=Hello,%20I%20want%20to%20order%20${encodeURIComponent(product.productName)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
                    >
                      <MessageCircleMore size={18} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PAGINATION */}
        {filteredProducts.length > 0 && totalPages > 1 && (
          <div className="mt-10 flex flex-col items-center gap-4">
            <p className="text-sm text-gray-500">
              Showing <b>{startIndex + 1}</b>–<b>{Math.min(endIndex, filteredProducts.length)}</b> of{" "}
              <b>{filteredProducts.length}</b> products
            </p>

            <div className="flex items-center gap-1 rounded-xl bg-white border border-gray-200 px-2 py-1 shadow-sm">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg transition ${currentPage === 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-emerald-50 hover:text-emerald-600"
                  }`}
              >
                <ChevronLeft size={18} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`min-w-9 px-3 py-1.5 rounded-lg text-sm font-medium transition ${currentPage === page
                    ? "bg-emerald-600 text-white shadow"
                    : "text-gray-600 hover:bg-emerald-50 hover:text-emerald-600"
                    }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg transition ${currentPage === totalPages ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-emerald-50 hover:text-emerald-600"
                  }`}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}

        <ProductDetailsModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      </div>
    </section>
  );
}
