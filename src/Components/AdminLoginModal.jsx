import { useState, useEffect } from "react";
import { Eye, EyeOff, Lock, User, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router";

export default function AdminLoginModal() {
    // Form states
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [usernameError, setUsernameError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    // Login behavior states
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    // Toast Notification
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("");

    // Login attempts & lockout states
    const [attempts, setAttempts] = useState(0);
    const MAX_ATTEMPTS = 3;
    const [locked, setLocked] = useState(false);
    const [closingTimer, setClosingTimer] = useState(null);

    const API_URL = import.meta.env.VITE_API_BASE_URL;

    const navigate = useNavigate();

    // Custom Toast
    const showToast = (message, type) => {
        setToastMessage(message);
        setToastType(type);
        setTimeout(() => setToastMessage(""), 3000);
    };

    // Auto-login if admin already authenticated
    useEffect(() => {
        const adminData = localStorage.getItem("adminInfo");
        if (adminData) {
            showToast("Welcome back!", "success");
            setTimeout(() => {
                window.location.href = "/admin-panel";
            }, 600);
        }
    }, []);

    // Validation
    const validate = () => {
        let valid = true;

        if (username.trim() === "") {
            setUsernameError("Username is required");
            valid = false;
        } else {
            setUsernameError("");
        }

        if (password.trim() === "") {
            setPasswordError("Password is required");
            valid = false;
        } else {
            setPasswordError("");
        }

        if (username.trim() !== "" && username.trim().length < 3) {
            showToast("Username must be at least 3 characters!", "error");
            valid = false;
        }

        if (password.trim() !== "" && password.trim().length < 4) {
            showToast("Password must be at least 4 characters!", "error");
            valid = false;
        }

        return valid;
    };

    // Login with backend validation
    const handleLogin = async () => {
        if (!validate() || locked) return;

        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/admin/verification`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    adminUsername: username,
                    adminPassword: password,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem("adminInfo", JSON.stringify(data));

                showToast("Login successful!", "success");

                setTimeout(() => {
                    navigate("/admin-panel/products", { replace: true });
                }, 800);
            } else {
                // Increase failed attempts
                setAttempts((prev) => {
                    const newCount = prev + 1;

                    if (newCount >= MAX_ATTEMPTS) {
                        setLocked(true);
                        showToast("Too many failed attempts! Login locked.", "error");

                        let counter = 5;
                        setClosingTimer(counter);

                        const interval = setInterval(() => {
                            counter -= 1;
                            setClosingTimer(counter);
                            if (counter === 0) {
                                clearInterval(interval);
                                showToast("Please refresh or close tab manually.", "error");
                            }
                        }, 1000);
                    } else {
                        showToast(`Invalid credentials (${newCount}/3 attempts used)`, "error");
                    }

                    return newCount;
                });
            }
        } catch (error) {
            showToast("Server not reachable!", "error");
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-emerald-50 via-white to-teal-50 p-4 relative overflow-hidden">

            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <style>{`
                    @keyframes float {0%,100%{transform:translate(0,0)scale(1);}33%{transform:translate(30px,-30px)scale(1.1);}66%{transform:translate(-20px,20px)scale(0.9);} }
                    @keyframes float-reverse {0%,100%{transform:translate(0,0)scale(1);}33%{transform:translate(-40px,30px)scale(1.15);}66%{transform:translate(30px,-20px)scale(0.85);} }
                    @keyframes float-slow {0%,100%{transform:translate(0,0)rotate(0deg)scale(1);}50%{transform:translate(20px,-40px)rotate(180deg)scale(1.2);} }
                    .float-1 { animation: float 20s ease-in-out infinite; }
                    .float-2 { animation: float-reverse 25s ease-in-out infinite; }
                    .float-3 { animation: float-slow 30s ease-in-out infinite; }
                `}</style>

                <div className="absolute top-20 -left-20 w-96 h-96 bg-linear-to-br from-emerald-300 to-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 float-1"></div>
                <div className="absolute -bottom-20 -right-20 w-md h-112 bg-linear-to-br from-green-300 to-emerald-400 rounded-full mix-blend-multiply filter blur-3xl opacity-35 float-2"></div>
                <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-linear-to-br from-teal-200 to-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 float-3"></div>
            </div>

            {/* Toast */}
            {toastMessage && (
                <div
                    className={`fixed top-6 left-1/2 -translate-x-1/2 px-5 py-3 rounded-full z-50 text-sm font-medium shadow-lg ${toastType === "success" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
                        }`}
                >
                    {toastMessage}
                </div>
            )}

            {/* LOGIN CARD */}
            <div className="w-full max-w-md space-y-8 relative z-10">



                <div className="relative">
                    <div className="absolute inset-0 bg-linear-to-br from-emerald-400 to-teal-400 rounded-2xl blur-xl opacity-20"></div>


                    <div className="relative backdrop-blur-xl bg-white bg-opacity-70 border border-white border-opacity-50 rounded-2xl shadow-2xl p-4">
                        <div className="text-center space-y-2 mb-5 flex items-center justify-center gap-3">
                            <div className="inline-flex items-center justify-center w-16 h-16 p-2 rounded-2xl bg-emerald-100 border border-emerald-400 mb-3 shadow-lg shadow-emerald-200">
                                <img src="/medstore_logo.png" alt="" />
                            </div>
                            <div className="flex flex-col items-center justify-center">
                                <h1 className="text-3xl font-semibold text-gray-900">Welcome back</h1>
                                <p className="text-gray-600 text-sm">Sign in to your admin account</p>
                            </div>
                        </div>
                        <div className="space-y-5">

                            {/* Username */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Username</label>
                                <div className="relative">
                                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Enter username"
                                        value={username}
                                        onChange={(e) => {
                                            setUsername(e.target.value);
                                            setUsernameError("");
                                        }}
                                        disabled={locked}
                                        className={`w-full pl-11 pr-4 py-3 border rounded-lg text-gray-900 placeholder-gray-400 outline-none transition-all ${usernameError
                                            ? "border-red-300 focus:border-red-500 focus:ring-red-50"
                                            : "border-gray-200 focus:border-emerald-500 focus:ring-emerald-50"
                                            }`}
                                    />
                                </div>
                                {usernameError && <p className="text-red-600 text-xs">{usernameError}</p>}
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter password"
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            setPasswordError("");
                                        }}
                                        disabled={locked}
                                        className={`w-full pl-11 pr-11 py-3 border rounded-lg text-gray-900 placeholder-gray-400 outline-none transition-all ${passwordError
                                            ? "border-red-300 focus:border-red-500 focus:ring-red-50"
                                            : "border-gray-200 focus:border-emerald-500 focus:ring-emerald-50"
                                            }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        disabled={locked}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {passwordError && <p className="text-red-600 text-xs">{passwordError}</p>}
                            </div>

                            {/* LOGIN BUTTON */}
                            <button
                                onClick={handleLogin}
                                disabled={loading || locked}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-medium transition-all shadow-lg flex justify-center items-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        Sign in
                                        <ArrowRight size={18} />
                                    </>
                                )}
                            </button>

                            {/* LOCKOUT MESSAGE */}
                            {locked && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                                    <p className="text-red-600 text-sm font-medium">
                                        Too many failed attempts — Login locked!
                                    </p>

                                    {closingTimer !== null && (
                                        <p className="text-red-500 text-xs mt-1">
                                            Please refresh or close tab in {closingTimer}s
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="text-center">
                    <p className="text-xs text-gray-400">
                        MedIndia HealthCare admin portal
                    </p>
                </div>

            </div>
        </div>
    );
}
