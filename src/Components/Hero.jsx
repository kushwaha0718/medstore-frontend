import { Contact, MessageCircleMore, Phone } from "lucide-react";

export default function Hero() {
    return (
        <section className="relative w-full my-2 lg:my-5 px-2">
            {/* Shared container */}
            <div className="relative mx-auto max-w-7xl flex justify-center">

                {/* Glass Card */}
                <div className="relative z-10 max-w-7xl w-full rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/40 shadow-[0_20px_60px_rgba(0,0,0,0.15)] lg:px-10 lg:py-2 px-2 py-2 text-center">

                    {/* Badge */}
                    <span className="inline-block mb-3 rounded-full bg-emerald-100/60 px-4 py-1 text-sm font-medium text-emerald-700">
                        Trusted Online Medical Store
                    </span>

                    {/* Heading */}
                    <h1 className="text-3xl md:text-6xl font-bold leading-tight text-gray-800 w-full">
                        Stock Smarter, 
                        <span className="bg-linear-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                            Sell Better
                        </span>
                    </h1>

                    {/* Description */}
                    <p className="mt-1 md:mt-3 text-sm text-gray-600 max-w-2xl mx-auto px-2">
                        Discover genuine medicines, healthcare products, and wellness
                        essentials available at MedIndia.
                    </p>

                    {/* Call & WhatsApp Buttons */}
                    <div className="
  mt-5
  grid grid-cols-2 gap-2
  sm:flex sm:justify-center sm:gap-4
">

                        {/* Call Button */}
                        <a
                            href="tel:+918100620066"
                            className="
                                flex items-center justify-center gap-1 
                                rounded-xl bg-emerald-600 px-4 py-2.5 sm:px-6 sm:py-3 text-white font-medium shadow-md hover:bg-emerald-700 hover:scale-105 transition-all duration-300 "
                        >
                            <Phone className="h-5 w-5" />
                            <span className="hidden sm:inline">Call us to Order</span>
                            <span className="sm:hidden">Call us to Order</span>
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
                                sm:px-6 sm:py-3
                                text-white font-medium
                                shadow-md
                                hover:bg-green-600 hover:scale-105
                                transition-all duration-300
                            "
                        >
                            <MessageCircleMore className="h-5 w-5" />
                            <span className="hidden sm:inline">Order on WhatsApp</span>
                            <span className="sm:hidden">WhatsApp Order</span>
                        </a>

                    </div>

                </div>
            </div>
        </section>
    );
}
