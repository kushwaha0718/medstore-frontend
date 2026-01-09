import { useState, useEffect } from "react";
import { Pencil, Trash2, Star, Search, X, Plus, ImageIcon } from "lucide-react";
import AddProductModal from "./AddProductModal";

export default function AdminProducts() {
    const API_URL = import.meta.env.VITE_API_BASE_URL;

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("All");

    const [allCategories, setAllCategories] = useState([]); // {id, name}
    const [categoryMap, setCategoryMap] = useState({}); // id → name cache

    const [editingProduct, setEditingProduct] = useState(null);
    const [editForm, setEditForm] = useState({});

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

    // ---- Pagination ----
    const [currentPage, setCurrentPage] = useState(1);
    const PRODUCTS_PER_PAGE = 10;

    const [editSelectedCategories, setEditSelectedCategories] = useState([]);
    const [editImage, setEditImage] = useState(null);
    const [editImagePreview, setEditImagePreview] = useState(null);
    const [editSubmitting, setEditSubmitting] = useState(false);
    const [editError, setEditError] = useState("");
    const [editSuccess, setEditSuccess] = useState(false);
    const [units, setUnits] = useState([]);
    const [categories, setCategories] = useState([]);



    useEffect(() => {
        fetchUnits();
        fetchCategories();
        fetchProducts();
    }, []);

    const fetchUnits = async () => {
        try {
            const res = await fetch(`${API_URL}/unit/get-all-units`);
            const data = await res.json();
            setUnits(data);
        } catch (err) {
            console.error("Error fetching units:", err);
        }
    };


    // ---------------------------------------------------------------
    // FETCH ALL PRODUCTS
    // ---------------------------------------------------------------
    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetch(`${API_URL}/product/get-all-products`);
            const data = await res.json();
            setProducts(data);
        } catch (err) {
            console.error("Error fetching products:", err);
        } finally {
            setLoading(false);
        }
    };

    // ---------------------------------------------------------------
    // FETCH ALL CATEGORY DETAILS (categoryId → categoryName)
    // ---------------------------------------------------------------
    const fetchCategories = async () => {
        try {
            const res = await fetch(`${API_URL}/category/get-all`);
            const data = await res.json(); // [{categoryId, categoryName}]
            setAllCategories(data);
            setCategories(data)

            const cmap = {};
            data.forEach(c => (cmap[c.categoryId] = c.categoryName));
            setCategoryMap(cmap);

        } catch (err) {
            console.error("Error fetching categories:", err);
        }
    };

    // ---------------------------------------------------------------
    // FILTER & PAGINATION
    // ---------------------------------------------------------------
    const resolveCategoryNames = (product) => {
        if (!product.categories) return [];
        return product.categories.map(id => categoryMap[id] || "Unknown");
    };

    let filteredProducts = products.filter((p) => {
        const matchSearch =
            p.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.productManufacturer?.toLowerCase().includes(searchTerm.toLowerCase());

        const catNames = resolveCategoryNames(p);
        const matchCategory =
            categoryFilter === "All" || catNames.includes(categoryFilter);

        return matchSearch && matchCategory;
    });

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, categoryFilter]);

    const indexOfLast = currentPage * PRODUCTS_PER_PAGE;
    const indexOfFirst = indexOfLast - PRODUCTS_PER_PAGE;
    const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };

    // ---------------------------------------------------------------
    // DELETE PRODUCT
    // ---------------------------------------------------------------
    const handleDelete = async () => {
        try {
            await fetch(`${API_URL}/product/delete-product/${productToDelete.productId}`, {
                method: "DELETE",
            });

            setProducts(products.filter(p => p.productId !== productToDelete.productId));
            setProductToDelete(null);

        } catch (err) {
            console.error("Error deleting:", err);
        }
    };

    // ---------------------------------------------------------------
    // TOGGLE STAR (Featured Product)
    // ---------------------------------------------------------------
    const handleToggleMarked = async (productId) => {
        try {
            await fetch(`${API_URL}/product/toggle-marked?productId=${productId}`, {
                method: "PUT",
            });

            setProducts(
                products.map((p) =>
                    p.productId === productId
                        ? { ...p, productMarkedStar: !p.productMarkedStar }
                        : p
                )
            );
        } catch (err) {
            console.error("Error toggling featured:", err);
        }
    };

    // ---------------------------------------------------------------
    // EDIT PRODUCT
    // ---------------------------------------------------------------
    const openEditModal = (product) => {
        setEditingProduct(product);

        // convert selected category IDs to objects
        const selected = product.categories.map(id =>
            categories.find(c => c.categoryId === id)
        );

        setEditSelectedCategories(selected);

        setEditForm({
            productName: product.productName,
            productDescription: product.productDescription,
            productPrice: product.productPrice,
            productUnit: product.productUnit,
            productManufacturer: product.productManufacturer,
            productStrength: product.productStrength,
        });

        if (product.productImageData) {
            setEditImagePreview(`data:image/jpeg;base64,${product.productImageData}`);
        }
    };


    const handleEditChange = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
        setEditError("");
    };

    const handleEditCategorySelect = (e) => {
        const id = Number(e.target.value);
        if (!id) return;

        const cat = categories.find(c => c.categoryId === id);
        setEditSelectedCategories(prev => [...prev, cat]);

        e.target.value = "";
    };

    const handleEditImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024)
            return setEditError("Image must be < 5MB");

        if (!file.type.startsWith("image/"))
            return setEditError("Invalid image");

        setEditImage(file);
        setEditImagePreview(URL.createObjectURL(file));
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setEditSubmitting(true);

        const data = new FormData();

        Object.entries(editForm).forEach(([key, value]) => {
            data.append(key, value);
        });

        // add category IDs array
        data.append("categories", editSelectedCategories.map(c => c.categoryId));

        // add image if changed
        if (editImage) data.append("productImage", editImage);

        try {
            const res = await fetch(
                `${API_URL}/product/update-product/${editingProduct.productId}`,
                { method: "PATCH", body: data }
            );

            if (!res.ok) throw new Error("Update failed");

            setEditSuccess(true);
            setTimeout(() => {
                fetchProducts();
                setEditingProduct(null);
            }, 1200);

        } catch (err) {
            setEditError(err.message);
        } finally {
            setEditSubmitting(false);
        }
    };



    // ---------------------------------------------------------------
    // LOADING SCREEN
    // ---------------------------------------------------------------
    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-lg text-gray-600">Loading products...</div>
            </div>
        );
    }

    // ---------------------------------------------------------------
    // UI MARKUP
    // ---------------------------------------------------------------
    return (
        <div className="p-1 md:p-4 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">

                {/* HEADER */}
                <div className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">Product Management</h1>
                        <p className="text-gray-600">Manage your product inventory</p>
                    </div>

                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 w-full md:w-auto"
                    >
                        <Plus className="w-5 h-5" />
                        Add Product
                    </button>
                </div>

                {/* ADD PRODUCT MODAL */}
                <AddProductModal
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                />

                {/* SEARCH + CATEGORY FILTER */}
                <div className="flex gap-4 mb-6 flex-col md:flex-row">

                    {/* SEARCH */}
                    <div className="relative w-full md:w-1/2">
                        <Search className="absolute left-3 top-3 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name or manufacturer..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border rounded-lg"
                        />
                    </div>

                    {/* CATEGORY FILTER */}
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="w-full md:w-1/3 px-4 py-3 border rounded-lg"
                    >
                        <option value="All">All Categories</option>
                        {allCategories.map((cat) => (
                            <option key={cat.categoryId} value={cat.categoryName}>
                                {cat.categoryName}
                            </option>
                        ))}
                    </select>
                </div>

                {/* TABLE */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-100 border-b">
                                <tr>
                                    <th className="px-6 py-3">Image</th>
                                    <th className="px-6 py-3">Name</th>
                                    <th className="px-6 py-3">Categories</th>
                                    <th className="px-6 py-3">Price</th>
                                    <th className="px-6 py-3">Manufacturer</th>
                                    <th className="px-6 py-3">Strength</th>
                                    <th className="px-6 py-3">Upload Date</th>
                                    <th className="px-6 py-3 text-center">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y">
                                {currentProducts.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="text-center py-6 text-gray-500">
                                            No products found
                                        </td>
                                    </tr>
                                ) : (
                                    currentProducts.map((product) => {
                                        const catNames = resolveCategoryNames(product);

                                        return (
                                            <tr key={product.productId} className="hover:bg-gray-50">
                                                <td className="px-6 py-4">
                                                    {product.productImageData ? (
                                                        <img
                                                            src={`data:image/jpeg;base64,${product.productImageData}`}
                                                            className="w-16 h-16 rounded object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                                                            No Img
                                                        </div>
                                                    )}
                                                </td>

                                                <td className="px-6 py-4">
                                                    <div className="font-medium">{product.productName}</div>
                                                    <div className="text-xs text-gray-500">{product.productUnit}</div>
                                                </td>

                                                {/* CATEGORY LIST */}
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-800">
                                                        {catNames.join(", ")}
                                                    </div>
                                                </td>

                                                <td className="px-6 py-4">₹{product.productPrice}</td>
                                                <td className="px-6 py-4">{product.productManufacturer}</td>
                                                <td className="px-6 py-4">{product.productStrength}</td>
                                                <td className="px-6 py-4 text-gray-500">
                                                    {product.productUploadDate}
                                                </td>

                                                <td className="px-6 py-4">
                                                    <div className="flex justify-center gap-2">

                                                        <label className="flex items-center justify-center cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={product.productMarkedStar}
                                                                onChange={() => handleToggleMarked(product.productId)}
                                                                className="custom-checkbox"
                                                            />
                                                        </label>



                                                        {/* EDIT */}
                                                        <button
                                                            onClick={() => openEditModal(product)}
                                                            className="p-2 text-blue-600"
                                                        >
                                                            <Pencil />
                                                        </button>

                                                        {/* DELETE */}
                                                        <button
                                                            onClick={() => setProductToDelete(product)}
                                                            className="p-2 text-red-600"
                                                        >
                                                            <Trash2 />
                                                        </button>

                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* PAGINATION */}
                <div className="flex justify-center mt-6 gap-1">
                    <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-2 border rounded disabled:opacity-40"
                    >
                        Prev
                    </button>

                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => goToPage(i + 1)}
                            className={`px-3 py-2 border rounded ${currentPage === i + 1 ? "bg-blue-600 text-white" : ""
                                }`}
                        >
                            {i + 1}
                        </button>
                    ))}

                    <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-2 border rounded disabled:opacity-40"
                    >
                        Next
                    </button>
                </div>

                {/* DELETE CONFIRM MODAL */}
                {productToDelete && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-xl max-w-sm w-full">
                            <h3 className="text-xl font-semibold mb-4">Delete Product?</h3>
                            <p className="text-gray-600 mb-6">
                                Delete{" "}
                                <span className="font-semibold">{productToDelete.productName}</span>?
                            </p>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setProductToDelete(null)}
                                    className="w-full py-2 rounded bg-gray-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="w-full py-2 rounded bg-red-600 text-white"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* EDIT PRODUCT MODAL */}
                {editingProduct && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

                            {/* HEADER */}
                            <div className="flex justify-between items-center p-5 border-b">
                                <h2 className="text-xl font-bold">Update Product</h2>
                                <button onClick={() => {
                                    setEditingProduct(null);
                                    setEditImagePreview(null);
                                    setEditSelectedCategories([]);
                                }}>
                                    <X className="text-gray-600" />
                                </button>
                            </div>

                            {/* ERROR */}
                            {editError && (
                                <p className="bg-red-100 text-red-700 p-3 m-4 rounded">{editError}</p>
                            )}

                            {/* SUCCESS */}
                            {editSuccess && (
                                <p className="bg-green-100 text-green-700 p-3 m-4 rounded">
                                    Product updated successfully!
                                </p>
                            )}

                            {/* FORM */}
                            <form
                                onSubmit={handleEditSubmit}
                                className="p-6 space-y-4"
                                encType="multipart/form-data"
                            >

                                {/* NAME */}
                                <input
                                    className="w-full p-3 border rounded"
                                    name="productName"
                                    value={editForm.productName}
                                    onChange={handleEditChange}
                                    placeholder="Product Name"
                                />

                                {/* DESCRIPTION */}
                                <textarea
                                    className="w-full p-3 border rounded"
                                    name="productDescription"
                                    rows={4}
                                    value={editForm.productDescription}
                                    onChange={handleEditChange}
                                    placeholder="Product Description"
                                />

                                {/* PRICE */}
                                <input
                                    className="w-full p-3 border rounded"
                                    type="number"
                                    name="productPrice"
                                    value={editForm.productPrice}
                                    onChange={handleEditChange}
                                    placeholder="Price (₹)"
                                />

                                {/* MANUFACTURER */}
                                <input
                                    className="w-full p-3 border rounded"
                                    name="productManufacturer"
                                    value={editForm.productManufacturer}
                                    onChange={handleEditChange}
                                    placeholder="Manufacturer"
                                />

                                {/* STRENGTH */}
                                <input
                                    className="w-full p-3 border rounded"
                                    name="productStrength"
                                    value={editForm.productStrength}
                                    onChange={handleEditChange}
                                    placeholder="Strength (e.g. 500mg)"
                                />

                                {/* UNITS DROPDOWN */}
                                <select
                                    className="w-full p-3 border rounded"
                                    name="productUnit"
                                    value={editForm.productUnit}
                                    onChange={handleEditChange}
                                >
                                    <option value="">Select Unit</option>
                                    {units.map(u => (
                                        <option key={u.unitId} value={u.unitName}>{u.unitName}</option>
                                    ))}
                                </select>

                                {/* CATEGORY SELECT */}
                                <select
                                    className="w-full p-3 border rounded"
                                    onChange={handleEditCategorySelect}
                                >
                                    <option value="">Select Category</option>
                                    {categories
                                        .filter(c => !editSelectedCategories.some(s => s.categoryId === c.categoryId))
                                        .map(c => (
                                            <option key={c.categoryId} value={c.categoryId}>
                                                {c.categoryName}
                                            </option>
                                        ))}
                                </select>

                                {/* CATEGORY TAGS */}
                                <div className="flex flex-wrap gap-2">
                                    <h1>Selected Category : </h1>

                                    {editSelectedCategories.map(cat => (
                                        <span
                                            key={cat.categoryId}
                                            className="flex items-center gap-2 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm"
                                        >
                                            {cat.categoryName}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setEditSelectedCategories(prev =>
                                                        prev.filter(c => c.categoryId !== cat.categoryId)
                                                    )
                                                }
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </span>
                                    ))}
                                </div>

                                {/* IMAGE UPLOAD */}
                                {editImagePreview ? (
                                    <div className="relative">
                                        <img
                                            src={editImagePreview}
                                            className="w-full h-56 object-cover rounded"
                                        />
                                        <button
                                            type="button"
                                            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded"
                                            onClick={() => {
                                                setEditImagePreview(null);
                                                setEditImage(null);
                                            }}
                                        >
                                            <X />
                                        </button>
                                    </div>
                                ) : (
                                    <label className="border-dashed border-2 rounded p-10 text-center cursor-pointer block">
                                        <ImageIcon className="mx-auto text-gray-400 mb-2" />
                                        <p>Click to upload product image</p>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            hidden
                                            onChange={handleEditImageChange}
                                        />
                                    </label>
                                )}

                                {/* BUTTONS */}
                                <button
                                    disabled={editSubmitting}
                                    className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700"
                                >
                                    {editSubmitting ? "Updating..." : "Update Product"}
                                </button>

                            </form>
                        </div>
                    </div>
                )}


            </div>
        </div>
    );
}
