import { BrowserRouter as Router, Routes, Route } from "react-router";
import HomePage from "./Components/HomePage";
import AdminLoginModal from "./Components/AdminLoginModal";
import AdminComponent from "./Components/AdminComponent";
import ProtectedRoute from "./Components/ProtectedRoute";
import { Toaster } from "react-hot-toast";
import AdminProducts from "./Components/AdminProducts";
import AdminCategory from "./Components/AdminCategory";
import AdminUnit from "./Components/AdminUnit";
import PageNotFound from "./Components/PageNotFound";

function App() {
  return (
    <Router>
      <Toaster position="top-center" />
      <Routes>

        {/* Main page */}
        <Route path="/" element={<HomePage />} />

        {/* Login page */}
        <Route path="/admin-login" element={<AdminLoginModal />} />
        
        {/* Protected admin route */}
        <Route
          path="/admin-panel"
          element={
            <ProtectedRoute>
              <AdminComponent />
            </ProtectedRoute>
          }
        >
          <Route path="products" element={<AdminProducts/>}/>
          <Route path="category" element={<AdminCategory/>}/>
          <Route path="units" element={<AdminUnit/>}/>
          <Route path="*" element={<PageNotFound/>}/>
        </Route>
        <Route path="*" element={<PageNotFound/>}/>
      </Routes>
    </Router>
  );
}

export default App;
