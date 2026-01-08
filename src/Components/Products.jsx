import { useState, useEffect } from 'react';
import {
  Search,
  AlertCircle,
  Plus,
  Phone,
  MessageCircleMore,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Boxes
} from 'lucide-react';

import AddProductModal from './AddProductModal';
import ProductDetailsModal from './ProductDetailsModal';

const PRODUCTS_PER_PAGE = 12;

export default function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('default');
  const API_URL = import.meta.env.VITE_API_BASE_URL;

  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/product/get-all-products`);
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data);
      setFilteredProducts(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProductAdded = () => {
    fetchProducts();
  };

  useEffect(() => {
    let filtered = [...products];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.productName?.toLowerCase().includes(query) ||
        product.productDescription?.toLowerCase().includes(query) ||
        product.productStrength?.toLowerCase().includes(query) ||
        product.productManufacturer.toLowerCase().includes(query)
      );
    }

    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => (a.productPrice || 0) - (b.productPrice || 0));
        break;
      case 'price-high':
        filtered.sort((a, b) => (b.productPrice || 0) - (a.productPrice || 0));
        break;
      case 'name-asc':
        filtered.sort((a, b) => (a.productName || '').localeCompare(b.productName || ''));
        break;
      case 'name-desc':
        filtered.sort((a, b) => (b.productName || '').localeCompare(a.productName || ''));
        break;
      case 'newest':
        filtered.sort((a, b) => {
          const dateA = a.productUploadDate ? new Date(a.productUploadDate) : new Date(0);
          const dateB = b.productUploadDate ? new Date(b.productUploadDate) : new Date(0);
          return dateB - dateA;
        });
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [searchQuery, products, sortBy]);

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) goToPage(currentPage - 1);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) goToPage(currentPage + 1);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  const getImageSrc = (imageData) => {
    if (!imageData) return '/api/placeholder/300/300';
    return `data:image/jpeg;base64,${imageData}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-center gap-3">
          <AlertCircle className="h-6 w-6 text-red-600" />
          <div>
            <h3 className="font-semibold text-red-900">Error Loading Products</h3>
            <p className="text-red-700">{error}</p>
            <button onClick={fetchProducts} className="mt-2 text-sm text-red-600 underline">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="w-full py-8 px-4">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              Explore <span className="text-emerald-600">Products <i class="fa-solid fa-box-open"></i></span>
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

        {/* SEARCH & SORT */}
        <div className="mb-8 max-w-2xl mx-auto flex flex-col md:flex-row md:items-center md:justify-center gap-4 md:gap-6">
          <div className="relative w-full md:w-auto flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for medicines, healthcare products..."
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
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
              <option value="newest">Newest First</option>
            </select>
          </div>
        </div>

        {/* NO PRODUCT FOUND */}
        {filteredProducts.length === 0 && (
          <div className="flex items-center justify-center text-center py-10 text-gray-600 text-lg font-medium">
            <img src="/public/nothing_found.png" alt="" />
            <span>
              No products found
            </span>
          </div>
        )}

        {/* GRID */}
        {filteredProducts.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-3 md:gap-4">
            {currentProducts.map((product, index) => (
              <div
                key={index}
                onClick={() => setSelectedProduct(product)}
                className="group bg-white rounded-2xl border border-gray-200 overflow-hidden
                hover:border-emerald-500 hover:shadow-2xl transition-all duration-300 cursor-pointer"
              >
                <div className="relative h-44 bg-gray-100 overflow-hidden">
                  <img
                    src={getImageSrc(product.productImageData)}
                    alt={product.productName}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="font-semibold text-gray-800 leading-tight line-clamp-2">
                    {product.productName}
                  </h3>

                  <div className="text-xs text-gray-500 space-y-0.5">
                    <p>
                      <span className="font-medium">Strength:</span> {product.productStrength}
                    </p>
                    <p className="line-clamp-1">
                      <span className="font-medium">Manufacturer:</span> {product.productManufacturer}
                    </p>
                  </div>

                  <div className="flex items-end gap-1 pt-1">
                    <span className="text-2xl font-bold text-emerald-600">₹{product.productPrice}</span>
                    <span className="text-sm text-gray-500 mb-0.5">/ {product.productUnit}</span>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <a
                      href="tel:+918100620066"
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 flex items-center justify-center bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700"
                    >
                      <Phone size={18} />
                    </a>

                    <a
                      href={`https://wa.me/918100620066?text=Hello,%20I%20want%20to%20order%20${encodeURIComponent(product.productName)}`}
                      onClick={(e) => e.stopPropagation()}
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
              Showing <span className="font-medium">{startIndex + 1}</span>–
              <span className="font-medium">{Math.min(endIndex, filteredProducts.length)}</span> of
              <span className="font-medium"> {filteredProducts.length}</span> products
            </p>

            <div className="flex items-center gap-1 rounded-xl bg-white border border-gray-200 px-2 py-1 shadow-sm">
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg transition ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-600'
                  }`}
              >
                <ChevronLeft size={18} />
              </button>

              {getPageNumbers().map((page, idx) =>
                page === '...' ? (
                  <span key={idx} className="px-2 text-gray-400 text-sm">…</span>
                ) : (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`min-w-9 px-3 py-1.5 rounded-lg text-sm font-medium transition ${currentPage === page ? 'bg-emerald-600 text-white shadow' : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-600'
                      }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg transition ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-600'
                  }`}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}

        <ProductDetailsModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      </div>
    </section>
  );
}
