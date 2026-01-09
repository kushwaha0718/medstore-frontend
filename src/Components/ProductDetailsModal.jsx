import { X, Phone, MessageCircleMore } from 'lucide-react';

export default function ProductDetailsModal({ product, onClose }) {
    if (!product) return null;

    const getImageSrc = (imageData) =>
        imageData ? `data:image/jpeg;base64,${imageData}` : '/api/placeholder/300/300';

    return (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-lg flex items-center justify-center">
            <div
                className="
                    relative w-full h-full md:h-auto md:max-h-[90vh]
                    md:max-w-5xl bg-white
                    md:rounded-3xl shadow-2xl
                    overflow-hidden
                    flex flex-col
                "
            >

                {/* CLOSE BUTTON */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 p-2 rounded-full
                    bg-white shadow hover:bg-gray-100 transition"
                >
                    <X />
                </button>

                {/* CONTENT */}
                <div className="flex-1 overflow-y-auto">
                    <div className="grid md:grid-cols-2">

                        {/* IMAGE */}
                        <div className="bg-gray-100 p-4 md:p-6 flex justify-center">
                            <img
                                src={getImageSrc(product.productImageData)}
                                alt={product.productName}
                                className="
                                    w-full max-w-xs md:max-w-sm
                                    aspect-square
                                    object-cover
                                    rounded-2xl shadow-lg
                                "
                            />
                        </div>

                        {/* DETAILS */}
                        <div className="p-5 md:p-8 flex flex-col gap-6">

                            {/* TITLE */}
                            <div>
                                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                                    {product.productName}
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    {product.productStrength} • {product.productUnit}
                                </p>
                            </div>

                            {/* PRICE */}
                            <div className="flex items-end gap-2">
                                <span className="text-3xl font-bold text-emerald-600">
                                    ₹{product.productPrice}
                                </span>
                                <span className="text-sm text-gray-500 mb-1">
                                    / {product.productUnit}
                                </span>
                            </div>

                            {/* META DETAILS */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="rounded-xl border p-3">
                                    <p className="text-xs text-gray-500">Strength</p>
                                    <p className="font-medium">{product.productStrength}</p>
                                </div>

                                <div className="rounded-xl border p-3">
                                    <p className="text-xs text-gray-500">Unit</p>
                                    <p className="font-medium">{product.productUnit}</p>
                                </div>

                                <div className="col-span-2 rounded-xl border p-3">
                                    <p className="text-xs text-gray-500">Manufacturer</p>
                                    <p className="font-medium">
                                        {product.productManufacturer}
                                    </p>
                                </div>
                            </div>

                            {/* CATEGORIES (NEW) */}
                            {product.categoryNames && product.categoryNames.length > 0 && (
                                <div>
                                    <p className="text-sm font-semibold text-gray-700 mb-1">
                                        Categories
                                    </p>

                                    <div className="flex flex-wrap gap-2">
                                        {product.categoryNames.map((cat, index) => (
                                            <span
                                                key={index}
                                                className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm"
                                            >
                                                {cat}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* DESCRIPTION */}
                            <div>
                                <p className="text-sm font-semibold text-gray-700 mb-1">
                                    Description
                                </p>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    {product.productDescription}
                                </p>
                            </div>

                            {/* CALL + WHATSAPP BUTTONS */}
                            <div className="mt-auto flex flex-col gap-3">
                                <a
                                    href="tel:+918100620066"
                                    className="
                                        w-full flex items-center justify-center gap-2
                                        bg-emerald-600 text-white py-3 rounded-xl
                                        hover:bg-emerald-700 transition
                                    "
                                >
                                    <Phone size={18} />
                                    Call Now
                                </a>

                                <a
                                    href={`https://wa.me/918100620066?text=Hello,%20I%20want%20to%20order%20${encodeURIComponent(product.productName)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="
                                        w-full flex items-center justify-center gap-2
                                        bg-green-500 text-white py-3 rounded-xl
                                        hover:bg-green-600 transition
                                    "
                                >
                                    <MessageCircleMore size={18} />
                                    WhatsApp Order
                                </a>
                            </div>

                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
