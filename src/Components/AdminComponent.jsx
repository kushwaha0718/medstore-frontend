import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router";
import AdminNavBar from "./AdminNavBar";

export default function AdminComponent() {
  return (
    <div className="min-h-screen bg-admin-pattern">
      <div className="green-glow glow-3"></div>
      <AdminNavBar />

      <div className="max-w-7xl mx-auto px-4 py-4">
        <Outlet />
      </div>
    </div>
  );
}
