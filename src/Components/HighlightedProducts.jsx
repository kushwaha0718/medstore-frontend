import { useEffect, useRef, useState } from "react";
import {
    AlertCircle,
    ChevronLeft,
    ChevronRight,
    Phone,
    MessageCircleMore,
} from "lucide-react";
import ProductDetailsModal from "./ProductDetailsModal";

export default function HighlightedProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showLeftFade, setShowLeftFade] = useState(false);
    const [showRightFade, setShowRightFade] = useState(true);

    const API_URL = import.meta.env.VITE_API_BASE_URL;
    const scrollRef = useRef(null);

    const fetchHighlightedProducts = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/product/get-all-marked-products`);
            if (!response.ok) throw new Error("Failed to load highlighted products");
            const data = await response.json();
            setProducts(data);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHighlightedProducts();
    }, []);

    const getImageSrc = (img) =>
        img ? `data:image/jpeg;base64,${img}` : "/api/placeholder/300/300";

    const handleScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setShowLeftFade(scrollLeft > 10);
            setShowRightFade(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    const scrollLeft = () => scrollRef.current?.scrollBy({ left: -220, behavior: "smooth" });
    const scrollRight = () => scrollRef.current?.scrollBy({ left: 220, behavior: "smooth" });

    if (loading) {
        return (
            <div className="flex justify-center items-center py-16">
                <div className="animate-spin h-12 w-12 rounded-full border-b-2 border-emerald-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className=" rounded-xl p-6 flex items-center justify-center gap-3 max-w-xl mx-auto my-10 bg-emerald-200/20">
                
                <div className="flex flex-col items-center">
                    <h3 className="flex  gap-2 font-semibold"><AlertCircle className="h-6 w-6 text-emerald-500" />No Bestseller product Found</h3>
                    <button onClick={fetchHighlightedProducts} className="mt-2 text-sm  underline text-emerald-500">
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <section className="relative w-full py-4 px-2 bg-emerald-500/15">

            {/* FORCE HIDE SCROLLBAR */}
            <style>
                {`
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
        `}
            </style>

            <div className="max-w-7xl mx-auto relative">

                <div className="text-center md:text-start mb-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                        BestSelling <span className="text-emerald-600">Products <i class="fa-solid fa-arrow-trend-up"></i></span>
                    </h2>
                    <p className="text-gray-600 mt-2">Specially selected medicines and top-sellers</p>
                </div>

                {/* LEFT FADE - with dynamic visibility */}
                <div
                    className={`pointer-events-none absolute rounded-2xl left-0 top-25 md:top-26 w-10 md:w-20 h-75 md:h-79 bg-linear-to-r from-black/40 via-black/5 to-transparent z-10 transition-opacity duration-300 ${showLeftFade ? 'opacity-100' : 'opacity-0'
                        }`}
                />

                {/* RIGHT FADE - with dynamic visibility */}
                <div
                    className={`pointer-events-none absolute rounded-2xl right-0 top-25 md:top-26 w-10 md:w-20 md:h-79 h-75 bg-linear-to-l from-black/40 via-black/5 to-transparent z-10 transition-opacity duration-300 ${showRightFade ? 'opacity-100' : 'opacity-0'
                        }`}
                />

                {/* ARROWS */}
                <button
                    onClick={scrollLeft}
                    className="absolute left-0 top-60 -translate-y-1/2 z-20 bg-emerald-200/50 shadow-md p-2 rounded-full border border-emerald-400 hover:bg-emerald-600 hover:text-white transition"
                >
                    <ChevronLeft className="h-5 w-5" />
                </button>

                {/* SCROLL ROW */}
                <div
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className="no-scrollbar flex gap-1 md:gap-2 overflow-x-auto px-2 py-2 scroll-smooth bg-white/50 rounded-2xl"
                >
                    {products.map((product, i) => (
                        <div
                            key={i}
                            onClick={() => setSelectedProduct(product)}
                            className="min-w-33.75 md:min-w-38.75 bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-emerald-500 hover:shadow-xl transition-all cursor-pointer"
                        >
                            <div className="relative h-28 md:h-32 bg-gray-100 overflow-hidden">
                                <img
                                    src={getImageSrc(product.productImageData)}
                                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                                />
                            </div>

                            <div className="p-3 space-y-1">
                                <h3 className="font-semibold text-gray-800 text-sm line-clamp-1">
                                    {product.productName}
                                </h3>

                                <p className="text-xs text-gray-500 line-clamp-1">
                                    <span className="font-medium">Strength:</span> {product.productStrength}
                                </p>

                                <p className="text-xs text-gray-500 line-clamp-1">
                                    <span className="font-medium">Manufacturer:</span> {product.productManufacturer}
                                </p>

                                <div className="flex items-end gap-1 pt-1">
                                    <span className="text-base font-bold text-emerald-600">₹{product.productPrice}</span>
                                    <span className="text-[10px] text-gray-500 mb-1">/ {product.productUnit}</span>
                                </div>

                                <div className="flex gap-2 pt-2">
                                    <a
                                        href="tel:+918100620066"
                                        onClick={(e) => e.stopPropagation()}
                                        className="flex-1 flex items-center justify-center bg-emerald-600 text-white py-1.5 rounded-lg hover:bg-emerald-700"
                                    >
                                        <Phone size={14} />
                                    </a>

                                    <a
                                        href={`https://wa.me/918100620066?text=Hello,%20I%20want%20to%20order%20${encodeURIComponent(
                                            product.productName
                                        )}`}
                                        target="_blank"
                                        onClick={(e) => e.stopPropagation()}
                                        className="flex-1 flex items-center justify-center bg-green-500 text-white py-1.5 rounded-lg hover:bg-green-600"
                                    >
                                        <MessageCircleMore size={14} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    onClick={scrollRight}
                    className="absolute right-0 top-60 -translate-y-1/2 z-20 bg-emerald-200/50 shadow-lg p-2 rounded-full border border-emerald-400 hover:bg-emerald-600 hover:text-white transition"
                >
                    <ChevronRight className="h-5 w-5" />
                </button>

                <ProductDetailsModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
            </div>
        </section>
    );
}