import { Phone, Mail, MapPin, Clock, LucideCompass, UserCircle2Icon, LocateFixedIcon } from "lucide-react";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[#EFFFF4] py-2">
            <div className="max-w-7xl mx-auto px-2">
                <div className="bg-white shadow-xl rounded-2xl border border-green-200 p-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

                        {/* Contact */}
                        <div>
                            <h4 className="text-xl font-semibold text-green-700 border-b-2 border-green-300 pb-1 mb-4">
                                Contact Us
                            </h4>
                            <div className="space-y-3 text-gray-700">
                                <div className="flex gap-1">
                                    <span><MapPin className="w-5 h-5 text-green-600" /></span>
                                    <p>Ground Floor, <strong>6/1</strong>,West Ghosh Para Road, Jagaddal, Bhatpara, North 24 Parganas-<strong>743125</strong>, West Bengal, India</p>
                                </div>

                                <p className="flex gap-3"><Phone className="w-5 h-5 text-green-600" /><a href="tel:+918100620066" className="hover:text-green-800">+91 81006 20066</a></p>
                                <p className="flex gap-3"><Mail className="w-5 h-5 text-green-600" /><a href="mailto:info@medstore.com" className="hover:text-green-800">info@medstore.com</a></p>
                                <div className="flex gap-3">
                                    <Clock className="w-5 h-5 text-green-600" />
                                    <ul>
                                        <li>Mon-Sat: 9AM–9PM</li>
                                        <li>Sun: 10AM–2PM</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="flex items-center justify-center md:justify-normal gap-6 mt-4">
                                <a href="https://facebook.com" target="_blank"
                                    className="text-blue-600 hover:text-blue-800 transition text-4xl">
                                    <i className="fab fa-facebook"></i>
                                </a>
                                <a href="https://linkedin.com" target="_blank"
                                    className="text-blue-700 hover:text-blue-900 transition text-4xl">
                                    <i className="fab fa-linkedin"></i>
                                </a>
                                <a href="https://youtube.com" target="_blank"
                                    className="text-red-600 hover:text-red-800 transition text-4xl">
                                    <i className="fab fa-youtube"></i>
                                </a>
                            </div>

                        </div>

                        {/* About */}
                        <div>
                            <h3 className="text-3xl font-bold mb-3 text-green-700">MedIndia<span className="text-green-500">HealthCare</span></h3>
                            <p className="text-gray-600">Medindia Healthcare – Trusted Pharmacy in Kolkata for Speciality Medicines | PAN India Delivery Welcome to Medindia Healthcare, a leading pharmacy and medical store in Kolkata providing speciality medicines across India. We specialize in supplying hard-to-find and life-saving drugs such as Erythropoietin, Adalimumab, Denosumab, Darbepoetin, Teriparatide, and more — all sourced from trusted and certified pharmaceutical manufacturers.</p>
                            <p 
                                className="flex gap-2 items-center mt-3 text-gray-600 cursor-pointer"
                                onClick={()=>window.open("admin-login","_blank")}
                            >
                                <UserCircle2Icon className="w-5 h-5 text-green-600" /> Nitish Kushwaha (Director)
                            </p>
                        </div>

                        {/* Map */}
                        <div className="rounded-xl overflow-hidden border-2 border-green-300">
                            <iframe
                                className="w-full h-74"
                                src="https://www.google.com/maps?q=MedIndia+HealthCare+W+Ghosh+Para+Rd&output=embed"
                            ></iframe>
                            <a
                                href="https://www.google.com/maps/dir/?api=1&destination=MedIndia+HealthCare"
                                target="_blank"
                                className="flex items-center justify-center gap-2 bg-green-100 text-green-700 text-center py-2 font-semibold hover:bg-green-200"
                            >
                                <LocateFixedIcon />Get Directions
                            </a>
                        </div>

                    </div>

                    <div className="pt-8 text-center text-gray-600 border-t mt-8">
                        © {new Date().getFullYear()} MedIndia Healthcare. All rights reserved.
                    </div>
                </div>
            </div>
        </footer>


    );
}
