import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import { ToastContainer } from "./components/Toast";
import Dashboard from "./pages/Dashboard";
import Console1Products from "./pages/Console1Products";
import Console1Content from "./pages/Console1Content";
import Console2Marketing from "./pages/Console2Marketing";
import ProductDetail from "./pages/ProductDetail";
import Architecture from "./pages/Architecture";

export default function App() {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/console1/products" element={<Console1Products />} />
          <Route path="/console1/content" element={<Console1Content />} />
          <Route path="/console2/marketing" element={<Console2Marketing />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/architecture" element={<Architecture />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </>
  );
}
