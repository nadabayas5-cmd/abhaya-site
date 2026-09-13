import React, { useEffect } from 'react';
import { Outlet, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ShopProvider } from './context/ShopContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import QuickViewModal from './components/QuickViewModal';
import SearchModal from './components/SearchModal';
import MobileBottomNav from './components/MobileBottomNav';
import AdminFloatingDock from './components/AdminFloatingDock';
import FloatingRegionSelector from './components/FloatingRegionSelector';
import CMSEditDrawer from './components/cms/CMSEditDrawer';
import SocialProofToast from './components/SocialProofToast';
import { shouldRedirectLegacyAdmin } from './lib/routing';

import HomePage from './pages/HomePage';
import CollectionsPage from './pages/CollectionsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import StoryPage from './pages/StoryPage';
import ContactPage from './pages/ContactPage';
import OffersPage from './pages/OffersPage';
import RefundPolicyPage from './pages/RefundPolicyPage';
import TermsPage from './pages/TermsPage';
import AdminPage from './pages/AdminPage';

function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === '/admin') return;
    if (shouldRedirectLegacyAdmin(location.search, location.hash)) {
      navigate('/admin', { replace: true });
    }
  }, [location.pathname, location.search, location.hash, navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#1E141B] font-medium">
      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
      <MobileBottomNav />
      <FloatingRegionSelector />
      <SocialProofToast />
      <CartDrawer />
      <QuickViewModal />
      <SearchModal />
      <AdminFloatingDock />
      <CMSEditDrawer />
    </div>
  );
}

export default function App() {
  return (
    <ShopProvider>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<CollectionsPage />} />
          <Route path="/collections" element={<CollectionsPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/story" element={<StoryPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/offers" element={<OffersPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/refund-policy" element={<RefundPolicyPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </ShopProvider>
  );
}
