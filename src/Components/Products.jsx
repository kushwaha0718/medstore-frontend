import { useState, useEffect } from 'react';
import { Search, ShoppingCart, Package, AlertCircle, Plus, X, Upload, ImageIcon, Phone, MessageCircleMore, ArrowDownRightFromSquare } from 'lucide-react';
import AddProductModal from './AddProductModal';


export default function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Fetch products from API
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/product/get-all-products');

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await response.json();
      setProducts(data);
      setFilteredProducts(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProductAdded = () => {
    fetchProducts();
  };

  // Handle search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProducts(products);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = products.filter(product =>
      product.productName?.toLowerCase().includes(query) ||
      product.productDescription?.toLowerCase().includes(query)
    );

    setFilteredProducts(filtered);
  }, [searchQuery, products]);

  // Convert byte array to base64 image
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
            <button
              onClick={fetchProducts}
              className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
            >
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

        {/* Header with Add Button */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              Our <span className="text-emerald-600">Products</span>
            </h2>
            <p className="text-gray-600">Browse our collection of quality medicines and healthcare products</p>
          </div>

          {/* Add Product Button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 transition-colors shadow-md hover:shadow-lg"
          >
            <Plus className="h-5 w-5" />
            Add Product
          </button>
        </div>

        {/* Add Product Modal */}
        <AddProductModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onProductAdded={handleProductAdded}
        />

        {/* Search Bar */}
        <div className="mb-8 max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for medicines, healthcare products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:outline-none transition-colors bg-white shadow-sm"
            />
          </div>

          {/* Search Results Count */}
          {searchQuery && (
            <p className="mt-2 text-sm text-gray-600">
              Found {filteredProducts.length} result{filteredProducts.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Products Found</h3>
            <p className="text-gray-500">
              {searchQuery
                ? "Try adjusting your search terms"
                : "No products available at the moment"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-1 md:gap-2">
            {filteredProducts.map((product, index) => (
              <div
                key={index}
                className="group bg-white rounded-xl border-2 border-gray-200 overflow-hidden hover:border-emerald-500 hover:shadow-xl transition-all duration-300"
              >
                {/* Product Image */}
                <div className="relative h-48 bg-gray-100 overflow-hidden">
                  <img
                    src={getImageSrc(product.productImageData)}
                    alt={product.productName}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {product.productUploadDate && (
                    <span className="absolute top-2 right-2 bg-emerald-500 text-white text-xs px-2 py-1 rounded-full">
                      New
                    </span>
                  )}
                </div>

                {/* Product Details */}
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-800 mb-2 line-clamp-1">
                    {product.productName}
                  </h3>

                  <p className="text-sm text-gray-600 mb-3 line-clamp-2 h-10">
                    {product.productDescription}
                  </p>

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-bold text-emerald-600">
                      ₹{product.productPrice}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 underline flex items-center gap-1">
                    place Order <ArrowDownRightFromSquare size={15}/>
                  </p>
                  {/* Call & WhatsApp Buttons */}
                  <div className="
  mt-1
  grid grid-cols-2 gap-2
  sm:flex sm:justify-center sm:gap-4
">

                    {/* Call Button */}
                    <a
                      href="tel:+918100620066"
                      className="
                                flex items-center justify-center gap-1 
                                rounded-xl bg-green-500/70 px-4 py-2.5  text-white font-medium shadow-md hover:bg-green-500 hover:scale-105 transition-all duration-300 "
                    >
                      <Phone className="h-5 w-5" />
                      <span className="hidden sm:inline">Call</span>
                      <span className="sm:hidden">Call</span>
                    </a>

                    {/* WhatsApp Button */}
                    <a
                      href="https://wa.me/918100620066"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="
                                flex items-center justify-center gap-1
                                rounded-xl
                                bg-green-500/70
                                px-4 py-2.5
                                text-white font-medium
                                shadow-md
                                hover:bg-green-500 hover:scale-105
                                transition-all duration-300
                            "
                    >
                      <MessageCircleMore className="h-5 w-5" />
                      <span className="hidden sm:inline">WhatsApp</span>
                      <span className="sm:hidden">WhatsApp</span>
                    </a>

                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}