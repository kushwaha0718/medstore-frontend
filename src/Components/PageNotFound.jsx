import { Home, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';

export default function PageNotFound() {

    const navigate = useNavigate();

    const handleLogin = ()=>{
        localStorage.removeItem("adminInfo");
        navigate("/admin-login", { replace: true });
    }

    return (
        <div className="min-h-[70vh] bg-white flex items-center justify-center p-6">
            <div className="max-w-md w-full text-center">
                {/* Medical cross icon */}
                <div className="mb-8 inline-flex items-center justify-center">
                    <div className="relative">
                        <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center">
                            <svg
                                className="w-10 h-10 text-emerald-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* 404 */}
                <h1 className="text-6xl font-bold text-gray-900 mb-4">
                    404
                </h1>

                {/* Message */}
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                    Page Not Found
                </h2>
                <p className="text-gray-600 mb-8 leading-relaxed">
                    The page you're looking for doesn't exist or has been moved.
                </p>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                        onClick={() => window.history.back()}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Go back
                    </button>

                    <button
                        onClick={() => handleLogin()}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                        <Home className="w-4 h-4" />
                        Login
                    </button>
                </div>

                {/* Support text */}
                <p className="mt-8 text-sm text-gray-500">
                    Need help? Contact our support team
                </p>
            </div>
        </div>
    );
}