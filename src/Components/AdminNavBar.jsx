import { useState } from 'react';
import {
    Menu,
    X,
    Bell,
    User,
    LogOut,
    Settings,
    LayoutDashboard,
    Package,
    Users,
    ShoppingCart,
    BarChart3,
    Tags,
    Tablets,
    Highlighter
} from 'lucide-react';

export default function AdminNavBar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

    // Get admin info from localStorage
    const admin = JSON.parse(localStorage.getItem("adminInfo")) || {
        adminName: "Admin",
        adminEmail: "admin@medstore.com",
        role: "Super Admin"
    };

    // 🔥 LOGOUT FUNCTION
    const handleLogout = () => {
        localStorage.removeItem("adminInfo");
        window.location.href = "/admin-login";
    };

    const navItems = [
        { icon: Package, label: 'Products', href: '/admin-panel/products' },
        { icon: Tags, label: 'Category', href: '/admin-panel/category' },
        { icon: Tablets, label: 'Unit', href: '/admin-panel/units' }
    ];

    return (
        <nav className="bg-white shadow-md border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    {/* Logo and Brand */}
                    <div className="flex items-center space-x-3">
                        <img src="/medstore_logo.png" alt="MedStore Logo" className="h-10 w-10" />
                        <div className="flex flex-col">
                            <h1 className="text-2xl lg:text-2xl font-logo font-bold text-emerald-700">
                                MedIndia <span className="text-emerald-500">HealthCare</span>
                            </h1>
                            <span className="text-xs text-gray-500">Admin Panel</span>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navItems.map((item) => (
                            <a
                                key={item.label}
                                href={item.href}
                                className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                            >
                                <item.icon className="h-4 w-4" />
                                <span>{item.label}</span>
                            </a>
                        ))}
                    </div>

                    {/* Right Side Actions */}
                    <div className="hidden md:flex items-center space-x-4">

                        {/* Profile Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <div className="h-8 w-8 bg-emerald-500 rounded-full flex items-center justify-center">
                                    <User className="h-5 w-5 text-white" />
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-medium text-gray-900">{admin.adminName}</p>
                                    <p className="text-xs text-gray-500">{admin.role}</p>
                                </div>
                            </button>

                            {/* Dropdown Menu */}
                            {profileDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                                    <div className="px-4 py-3 border-b border-gray-200">
                                        <p className="text-sm font-medium text-gray-900">{admin.adminName}</p>
                                        <p className="text-xs text-gray-500">{admin.adminEmail}</p>
                                    </div>

                                    {/* 🔥 Logout */}
                                    <button
                                        onClick={handleLogout}
                                        className="flex w-full items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
                    >
                        {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-200">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        {navItems.map((item) => (
                            <a
                                key={item.label}
                                href={item.href}
                                className="flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                            >
                                <item.icon className="h-5 w-5" />
                                <span>{item.label}</span>
                            </a>
                        ))}
                    </div>

                    {/* Mobile Profile + Logout */}
                    <div className="border-t border-gray-200 px-4 py-3">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="h-10 w-10 bg-emerald-500 rounded-full flex items-center justify-center">
                                <User className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">{admin.adminName}</p>
                                <p className="text-xs text-gray-500">{admin.adminEmail}</p>
                            </div>
                        </div>

                        {/* 🔥 Mobile Logout */}
                        <button
                            onClick={() => {
                                setMobileMenuOpen(false);
                                handleLogout();
                            }}
                            className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
                        >
                            <LogOut className="h-4 w-4" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
}
