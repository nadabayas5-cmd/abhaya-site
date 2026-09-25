import React, { useState, useMemo, useEffect } from 'react';
import {
  Sparkles,
  Plus,
  Search,
  Filter,
  SlidersHorizontal,
  Edit2,
  Trash2,
  Copy,
  Eye,
  CheckCircle2,
  AlertCircle,
  Package,
  Layers,
  CloudCheck,
  LogOut,
  Lock,
  ArrowRight,
  LayoutGrid,
  List,
  ShieldCheck,
  Check,
  RefreshCw,
  Palette,
  ExternalLink,
  ToggleLeft,
  ToggleRight,
  Settings2
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { isSupabaseConfigured } from '../lib/supabase';
import { CMS_SECTIONS } from '../lib/cms';
import { MAIN_CATEGORIES, ABAYA_STYLES, ABAYA_WORKS } from '../data/products';
import AdminProductEditor from '../components/admin/AdminProductEditor';
import Pagination from '../components/Pagination';
import { rateLimiter } from '../lib/rateLimit';
import brandLogo from '../assets/logo.png';

export default function AdminPage() {
  const {
    products,
    allProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    refreshProducts,
    formatPrice,
    navigateTo,
    showToast,
    isAdminLoggedIn,
    loginAdmin,
    logoutAdmin,
    siteContent,
    setCmsDrawerOpen,
    isAdminEditMode,
    setIsAdminEditMode,
    adminEnabled,
    setAdminEnabledRemote,
    deliverySettings,
    setDeliverySettingsRemote,
  } = useShop();

  const baseProducts = allProducts && allProducts.length > 0 ? allProducts : products;

  // Admin Login State
  const [pinInput, setPinInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // Active Admin Section
  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'cms' | 'settings'
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'cards'
  const [isTogglingAdmin, setIsTogglingAdmin] = useState(false);
  const [deliveryForm, setDeliveryForm] = useState(deliverySettings);
  const [isSavingDelivery, setIsSavingDelivery] = useState(false);

  useEffect(() => {
    setDeliveryForm(deliverySettings);
  }, [deliverySettings]);

  // Product Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStyle, setSelectedStyle] = useState('All');
  const [selectedWork, setSelectedWork] = useState('All');
  const [selectedMarketFilter, setSelectedMarketFilter] = useState('all'); // 'all' | 'india' | 'arab'
  const [stockFilter, setStockFilter] = useState('all'); // 'all' | 'low' | 'out'

  // Pagination State for Admin Products Table/Cards
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Full-page Editor State
  const [isProductEditorOpen, setIsProductEditorOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedStyle, selectedWork, selectedMarketFilter, stockFilter]);

  // Handle PIN Login with Rate Limiting (Prevent Brute-Force)
  const handlePinSubmit = (e) => {
    e.preventDefault();
    const limitCheck = rateLimiter.check('admin_pin', { maxRequests: 5, windowMs: 60000 });
    if (!limitCheck.allowed) {
      setLoginError(`Too many incorrect attempts. Please wait ${limitCheck.retryAfterSec} seconds.`);
      return;
    }

    const success = loginAdmin(pinInput);
    if (!success) {
      setLoginError(`Incorrect administrative PIN. (${limitCheck.remainingAttempts} attempts remaining)`);
    } else {
      rateLimiter.reset('admin_pin');
      setLoginError('');
      setPinInput('');
    }
  };

  // Metrics Calculations
  const stats = useMemo(() => {
    const total = baseProducts.length;
    const styleCounts = {};
    const workCounts = {};
    baseProducts.forEach(p => {
      const s = p.defaultStyle || 'Open abaya';
      const w = p.defaultWork || 'plain';
      styleCounts[s] = (styleCounts[s] || 0) + 1;
      workCounts[w] = (workCounts[w] || 0) + 1;
    });

    const uniqueStyles = Object.keys(styleCounts).length;
    const uniqueWorks = Object.keys(workCounts).length;
    const violetCount = baseProducts.filter(p => p.isVioletEdition).length;
    const lowStockCount = baseProducts.filter(p => (p.stockCount ?? 10) <= 5 && (p.stockCount ?? 10) > 0).length;
    const outOfStockCount = baseProducts.filter(p => (p.stockCount ?? 10) === 0).length;

    return {
      total,
      uniqueStyles,
      uniqueWorks,
      styleCounts,
      workCounts,
      violetCount,
      lowStockCount,
      outOfStockCount
    };
  }, [baseProducts]);

  // Filtered Products List
  const filteredProducts = useMemo(() => {
    return baseProducts.filter(p => {
      // Search across name, subtitle, category, badge, styles, works, colors, description
      const q = searchQuery.toLowerCase().trim();
      let matchesSearch = true;
      if (q) {
        matchesSearch =
          (p.name && p.name.toLowerCase().includes(q)) ||
          (p.subtitle && p.subtitle.toLowerCase().includes(q)) ||
          (p.category && p.category.toLowerCase().includes(q)) ||
          (p.badge && p.badge.toLowerCase().includes(q)) ||
          (p.defaultStyle && p.defaultStyle.toLowerCase().includes(q)) ||
          (Array.isArray(p.styles) && p.styles.some(s => s.toLowerCase().includes(q))) ||
          (p.defaultWork && p.defaultWork.toLowerCase().includes(q)) ||
          (Array.isArray(p.works) && p.works.some(w => w.toLowerCase().includes(q))) ||
          (Array.isArray(p.colors) && p.colors.some(c => c.name.toLowerCase().includes(q))) ||
          (p.description && p.description.toLowerCase().includes(q));
      }

      // Category Filter
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;

      // Style / Silhouette
      const matchesStyle = selectedStyle === 'All' ||
        p.defaultStyle === selectedStyle ||
        (Array.isArray(p.styles) && p.styles.includes(selectedStyle));

      // Work / Craftsmanship
      const matchesWork = selectedWork === 'All' ||
        p.defaultWork === selectedWork ||
        (Array.isArray(p.works) && p.works.includes(selectedWork));

      // Market / Region Filter
      let matchesMarket = true;
      if (selectedMarketFilter === 'india') {
        matchesMarket = p.targetRegion === 'india';
      } else if (selectedMarketFilter === 'arab') {
        matchesMarket = p.targetRegion === 'arab';
      }

      // Stock
      const stock = p.stockCount ?? 10;
      let matchesStock = true;
      if (stockFilter === 'low') matchesStock = stock <= 5 && stock > 0;
      if (stockFilter === 'out') matchesStock = stock === 0;

      return matchesSearch && matchesCategory && matchesStyle && matchesWork && matchesMarket && matchesStock;
    });
  }, [baseProducts, searchQuery, selectedCategory, selectedStyle, selectedWork, selectedMarketFilter, stockFilter]);

  // Paginated slice for current page
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, currentPage, pageSize]);

  // Handlers
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setIsProductEditorOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setIsProductEditorOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDuplicateProduct = async (product) => {
    const duplicated = {
      ...product,
      id: `${product.id}-copy-${Date.now().toString().slice(-4)}`,
      name: `${product.name} (Copy)`
    };
    await createProduct(duplicated);
    showToast(`Created duplicate copy of "${product.name}".`);
  };

  const handleDelete = async (productId) => {
    await deleteProduct(productId);
    setDeleteConfirmId(null);
    showToast('Product listing removed.');
  };

  const handleSaveProductModal = async (productData) => {
    if (editingProduct) {
      await updateProduct(editingProduct.id, productData);
      showToast(`Updated "${productData.name}" successfully.`);
    } else {
      await createProduct(productData);
      showToast(`Published "${productData.name}" to catalog.`);
    }
    setIsProductEditorOpen(false);
    setEditingProduct(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If Admin is not logged in, render the luxury login gate
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 animate-fade-in">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-secondary/20 space-y-6 text-center">
          
          <div className="flex justify-center">
            <img
              src={brandLogo}
              alt="NOOR AL DHUHA Logo"
              className="h-20 sm:h-24 w-auto object-contain mx-auto drop-shadow-md"
            />
          </div>

          <div className="space-y-1">
            <h1 className="font-serif text-2xl sm:text-3xl text-primary font-medium">
              Admin Portal
            </h1>
          </div>

          {loginError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 text-left">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handlePinSubmit} className="space-y-4 text-left">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                Security PIN Code
              </label>
              <input
                type="password"
                required
                autoFocus
                placeholder="Enter 4-digit PIN (default: 1234)"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-secondary/30 bg-[#fff9fd] focus:outline-none focus:ring-2 focus:ring-royal-violet/40 text-center font-mono text-lg tracking-widest"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary via-royal-violet to-primary text-white text-xs font-semibold uppercase tracking-widest hover:opacity-95 transition-all shadow-luxury flex items-center justify-center gap-2"
            >
              <span>Unlock Admin Panel</span>
              <ArrowRight className="w-4 h-4 text-gold-soft" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  // If currently in full-page Abaya Editor Studio (creating or editing)
  if (isProductEditorOpen) {
    return (
      <AdminProductEditor
        product={editingProduct}
        onSave={handleSaveProductModal}
        onCancel={() => {
          setIsProductEditorOpen(false);
          setEditingProduct(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-28 sm:py-12 space-y-8 animate-fade-in">
      
      {/* Top Banner & Supabase Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-secondary/20 shadow-luxury">
        <div className="flex items-center gap-3">
          <h1 className="font-serif text-xl sm:text-2xl text-primary font-bold">
            Abaya Catalog Management
          </h1>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleOpenAddModal}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary via-royal-violet to-primary text-white text-xs font-semibold uppercase tracking-wider hover:opacity-95 transition-all shadow-luxury flex items-center gap-2"
          >
            <Plus className="w-4 h-4 text-gold-soft" />
            <span>Add New Abaya</span>
          </button>

          <button
            onClick={logoutAdmin}
            className="p-2.5 rounded-xl border border-secondary/20 hover:bg-red-50 hover:text-red-600 text-stone-500 transition-colors"
            title="Sign out of Admin"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-secondary/20 shadow-subtle space-y-1">
          <div className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-stone-500">Total Abayas</div>
          <div className="font-serif text-2xl sm:text-3xl font-bold text-primary">{stats.total}</div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-secondary/20 shadow-subtle space-y-1">
          <div className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-stone-500">Catalog Reviews</div>
          <div className="font-serif text-2xl sm:text-3xl font-bold text-royal-violet">
            {baseProducts.reduce((acc, p) => acc + (p.reviewsCount || p.reviews?.length || 0), 0)} Verified
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex border-b border-surface-container-highest gap-4 sm:gap-8 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 text-sm font-serif font-medium border-b-2 transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'products'
              ? 'border-royal-violet text-royal-violet font-semibold'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Product Catalog ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('cms')}
          className={`pb-3 text-sm font-serif font-medium border-b-2 transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'cms'
              ? 'border-yellow-500 text-yellow-700 font-semibold'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>🎨 Content Management ({CMS_SECTIONS.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`pb-3 text-sm font-serif font-medium border-b-2 transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'settings'
              ? 'border-stone-700 text-stone-900 font-semibold'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Settings2 className="w-4 h-4" />
          <span>Site Settings</span>
        </button>
      </div>

      {/* TAB CONTENT: PRODUCTS */}
      {activeTab === 'products' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Controls Bar: Search, Category Pills, Style/Work Dropdowns, View Mode */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-secondary/20 shadow-subtle space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
              
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search abayas by name, style, work, color..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-secondary/30 bg-[#fff9fd] text-xs focus:outline-none focus:ring-2 focus:ring-royal-violet/30"
                />
              </div>

              {/* View Switcher */}
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <div className="flex items-center border border-secondary/30 rounded-xl p-0.5 bg-[#fff9fd]">
                  <button
                    onClick={() => setViewMode('table')}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      viewMode === 'table' ? 'bg-royal-violet text-white' : 'text-stone-500 hover:text-stone-800'
                    }`}
                    title="Table View"
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('cards')}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      viewMode === 'cards' ? 'bg-royal-violet text-white' : 'text-stone-500 hover:text-stone-800'
                    }`}
                    title="Cards View"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Category Pills Bar */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 px-1 shrink-0">Category:</span>
              <button
                onClick={() => setSelectedCategory('All')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                  selectedCategory === 'All'
                    ? 'bg-royal-violet text-white shadow-xs'
                    : 'bg-surface-container hover:bg-stone-200 text-stone-700'
                }`}
              >
                All Categories
              </button>
              {MAIN_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                    selectedCategory === cat.name
                      ? 'bg-royal-violet text-white shadow-xs'
                      : 'bg-surface-container hover:bg-stone-200 text-stone-700'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Filter Dropdowns Row: Silhouette, Craftsmanship, Stock Status */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-surface-container-highest">
              {/* Silhouette / Category Style Filter */}
              <div className="flex items-center gap-2 bg-[#fff9fd] px-3 py-1.5 rounded-xl border border-secondary/20">
                <span className="text-[10px] font-bold uppercase tracking-wider text-royal-violet shrink-0">Style:</span>
                <select
                  value={selectedStyle}
                  onChange={(e) => setSelectedStyle(e.target.value)}
                  className="w-full bg-transparent text-xs text-stone-700 font-semibold focus:outline-none cursor-pointer"
                >
                  <option value="All">All Styles</option>
                  {ABAYA_STYLES.map(s => (
                    <option key={s.id} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>

              {/* Craftsmanship / Work Filter */}
              <div className="flex items-center gap-2 bg-[#fff9fd] px-3 py-1.5 rounded-xl border border-secondary/20">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 shrink-0">Work:</span>
                <select
                  value={selectedWork}
                  onChange={(e) => setSelectedWork(e.target.value)}
                  className="w-full bg-transparent text-xs text-stone-700 font-semibold focus:outline-none cursor-pointer"
                >
                  <option value="All">All Works</option>
                  {ABAYA_WORKS.map(w => (
                    <option key={w.id} value={w.name}>{w.name}</option>
                  ))}
                </select>
              </div>

              {/* Stock Status Filter */}
              <div className="flex items-center gap-2 bg-[#fff9fd] px-3 py-1.5 rounded-xl border border-secondary/20">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 shrink-0">Stock:</span>
                <select
                  value={stockFilter}
                  onChange={(e) => setStockFilter(e.target.value)}
                  className="w-full bg-transparent text-xs text-stone-700 font-medium focus:outline-none cursor-pointer"
                >
                  <option value="all">All Stock Statuses</option>
                  <option value="low">Low Stock (≤ 5 pieces)</option>
                  <option value="out">Out of Stock (0 pieces)</option>
                </select>
              </div>
            </div>

            {/* Market Filter Row */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-surface-container-highest">
              {/* Market pills */}
              <div className="flex items-center gap-1.5 bg-surface-container/60 p-1 rounded-xl">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 px-2">Market:</span>
                {[
                  { id: 'all', label: 'All' },
                  { id: 'india', label: 'India' },
                  { id: 'arab', label: 'Arab / UAE' }
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedMarketFilter(m.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      selectedMarketFilter === m.id
                        ? 'bg-white text-primary shadow-xs ring-1 ring-black/5 font-bold'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <span>{m.label}</span>
                  </button>
                ))}
              </div>

              {/* Reset Filters button if active */}
              {(searchQuery || selectedCategory !== 'All' || selectedStyle !== 'All' || selectedWork !== 'All' || selectedMarketFilter !== 'all' || stockFilter !== 'all') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                    setSelectedStyle('All');
                    setSelectedWork('All');
                    setSelectedMarketFilter('all');
                    setStockFilter('all');
                  }}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  Reset Filters
                </button>
              )}
            </div>
          </div>

          {/* Product Items Rendering */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-secondary/20 space-y-4">
              <Package className="w-12 h-12 text-stone-300 mx-auto" />
              <h3 className="font-serif text-lg text-primary font-medium">No Products Found</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                No items matched your current search filters. Try clearing your filters or adding a new piece to the atelier.
              </p>
              <button
                onClick={handleOpenAddModal}
                className="px-4 py-2 rounded-xl bg-royal-violet text-white text-xs font-semibold shadow hover:bg-royal-violet/90 cursor-pointer"
              >
                + Add Product Now
              </button>
            </div>
          ) : viewMode === 'table' ? (
            /* Table View */
            <div className="bg-white rounded-2xl border border-secondary/20 shadow-subtle overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#fff9fd] border-b border-surface-container-highest text-stone-500 font-semibold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3.5 px-4">Product Creation</th>
                      <th className="py-3.5 px-4">Category & Details</th>
                      <th className="py-3.5 px-4">Market & Rating</th>
                      <th className="py-3.5 px-4">Price</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container-highest">
                    {paginatedProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-[#fff7fc]/60 transition-colors">
                        
                        {/* Thumbnail & Title */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-12 h-16 rounded-lg object-cover border border-secondary/20 shrink-0 bg-surface-container shadow-xs"
                            />
                            <div>
                              <div className="font-serif font-medium text-sm text-primary">{p.name}</div>
                              <div className="text-[11px] text-stone-500 truncate max-w-xs">{p.subtitle || '100% Luxury Modest Wear'}</div>
                              <div className="flex items-center gap-1.5 mt-1">
                                {p.badge && (
                                  <span className="inline-block px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[9px] font-semibold">
                                    {p.badge}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Category & Details */}
                        <td className="py-3.5 px-4">
                          <div className="space-y-1">
                            <span className="inline-block px-2 py-0.5 rounded-md bg-royal-violet/10 text-royal-violet text-[10px] font-bold border border-royal-violet/20">
                              {p.category || 'Abaya'}
                            </span>
                            {p.category === 'WHOLESALE' ? (
                              <div className="text-[10px] text-stone-600 font-semibold">
                                {p.wholesaleType && <span className="text-amber-800">Type: {p.wholesaleType}</span>}
                                {p.wholesaleMinQty && <span className="text-stone-500 block">MOQ: {p.wholesaleMinQty} pcs</span>}
                              </div>
                            ) : p.category === 'ABAYA' ? (
                              <div className="text-[10px] text-stone-500">
                                {p.defaultStyle && <span className="font-medium text-stone-700">{p.defaultStyle}</span>}
                                {p.defaultWork && <span className="text-stone-400"> • {p.defaultWork}</span>}
                              </div>
                            ) : p.subcategory ? (
                              <div className="text-[10px] text-stone-500 font-medium">
                                {p.subcategory}
                              </div>
                            ) : null}
                            {p.color && (
                              <div className="text-[10px] text-stone-600 font-medium pt-0.5">
                                Color: <span className="font-semibold text-stone-800">{p.color}</span>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Market & Rating */}
                        <td className="py-3.5 px-4">
                          <div className="space-y-1">
                            <div>
                              {p.targetRegion === 'india' ? (
                                <span className="inline-block px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[10px] font-semibold border border-emerald-200/50">
                                  India
                                </span>
                              ) : p.targetRegion === 'arab' ? (
                                <span className="inline-block px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 text-[10px] font-semibold border border-amber-200/50">
                                  Arab / UAE
                                </span>
                              ) : (
                                <span className="inline-block px-2 py-0.5 rounded-md bg-purple-50 text-purple-800 text-[10px] font-semibold border border-purple-200/50">
                                  Global
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1 text-[10px] text-amber-700">
                              <span className="font-semibold">★ {Number(p.rating || 5.0).toFixed(1)}</span>
                              <span className="text-stone-400">({p.reviewsCount || 0} reviews)</span>
                            </div>
                          </div>
                        </td>

                        {/* Price */}
                        <td className="py-3.5 px-4 font-medium">
                          {(p.targetRegion === 'arab' || p.targetRegion === 'all') && (
                            <div className="font-sans text-sm font-bold text-primary tabular-nums">
                              AED {Number(p.price || 0).toLocaleString('en-US')}
                            </div>
                          )}
                          {(p.targetRegion === 'india' || p.targetRegion === 'all') && p.priceInr != null && (
                            <div className="font-sans text-sm font-bold text-emerald-800 tabular-nums">
                              ₹{Number(p.priceInr).toLocaleString('en-IN')}
                            </div>
                          )}
                          {p.originalPrice && p.targetRegion !== 'india' && (
                            <div className="text-[10px] text-stone-400 line-through font-sans tabular-nums">
                              AED {Number(p.originalPrice).toLocaleString('en-US')}
                            </div>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => navigateTo('product-detail', p.id)}
                              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-800 hover:bg-surface-container transition-colors cursor-pointer"
                              title="View in Customer Store"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleDuplicateProduct(p)}
                              className="p-1.5 rounded-lg text-stone-400 hover:text-royal-violet hover:bg-royal-violet/10 transition-colors cursor-pointer"
                              title="Duplicate Listing"
                            >
                              <Copy className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleOpenEditModal(p)}
                              className="p-1.5 rounded-lg text-stone-400 hover:text-royal-violet hover:bg-royal-violet/10 transition-colors cursor-pointer"
                              title="Edit Abaya"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>

                            {deleteConfirmId === p.id ? (
                              <div className="flex items-center gap-1 bg-red-50 p-1 rounded-lg border border-red-200">
                                <button
                                  onClick={() => handleDelete(p.id)}
                                  className="px-2 py-0.5 rounded bg-red-600 text-white text-[10px] font-semibold cursor-pointer"
                                >
                                  Delete
                                </button>
                                <button
                                  onClick={() => setDeleteConfirmId(null)}
                                  className="px-1 text-stone-500 text-[10px] cursor-pointer"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setDeleteConfirmId(p.id)}
                                className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                                title="Delete Abaya"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* Cards View */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedProducts.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-2xl overflow-hidden border border-secondary/20 shadow-subtle hover:shadow-luxury transition-all flex flex-col"
                >
                  <div className="aspect-[3/4] relative bg-surface-container overflow-hidden">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                    
                    {p.badge && (
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-royal-violet/90 backdrop-blur-md text-white text-[10px] font-semibold">
                        {p.badge}
                      </div>
                    )}
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="text-[11px] text-stone-500 font-medium truncate max-w-[180px]">
                          {p.subtitle || p.category || 'Luxury Abaya'}
                        </span>
                        <span className="font-serif font-bold text-sm text-primary text-right">
                          {(p.targetRegion === 'arab' || p.targetRegion === 'all') && (
                            <span className="block">AED {Number(p.price || 0).toLocaleString('en-US')}</span>
                          )}
                          {(p.targetRegion === 'india' || p.targetRegion === 'all') && p.priceInr != null && (
                            <span className="block text-emerald-800">₹{Number(p.priceInr).toLocaleString('en-IN')}</span>
                          )}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <h3 className="font-serif text-base text-primary font-medium">
                          {p.name}
                        </h3>
                        <div className="flex items-center gap-1 text-[11px] text-amber-700 font-semibold shrink-0">
                          <span>★ {Number(p.rating || 5.0).toFixed(1)}</span>
                          <span className="text-stone-400 font-normal">({p.reviewsCount || 0})</span>
                        </div>
                      </div>

                      <p className="text-xs text-stone-500 line-clamp-2 mt-1">
                        {p.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-surface-container-highest flex items-center justify-between">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[11px] font-semibold text-royal-violet">
                          {p.defaultStyle || 'Abaya'}
                        </span>
                        {p.color && (
                          <span className="inline-block px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[10px] font-semibold border border-stone-200">
                            {p.color}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => navigateTo('product-detail', p.id)}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-stone-800 hover:bg-surface-container transition-colors cursor-pointer"
                          title="View Live in Store"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenEditModal(p)}
                          className="px-3 py-1 rounded-lg bg-surface-container hover:bg-royal-violet hover:text-white text-stone-700 text-xs font-medium transition-colors cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDuplicateProduct(p)}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-royal-violet cursor-pointer"
                          title="Duplicate"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Admin Table/Cards Pagination */}
          {filteredProducts.length > 0 && (
            <div className="bg-white rounded-2xl p-4 border border-secondary/20 shadow-xs">
              <Pagination
                currentPage={currentPage}
                totalItems={filteredProducts.length}
                pageSize={pageSize}
                onPageChange={(p) => {
                  setCurrentPage(p);
                  window.scrollTo({ top: 350, behavior: 'smooth' });
                }}
                onPageSizeChange={(s) => {
                  setPageSize(s);
                  setCurrentPage(1);
                }}
                pageSizeOptions={[10, 25, 50, 100]}
                itemLabel="inventory products"
              />
            </div>
          )}

        </div>
      )}

      {/* TAB CONTENT: CMS CONTENT MANAGEMENT */}
      {activeTab === 'cms' && (
        <div className="space-y-6 animate-fade-in">

          {/* CMS Header */}
          <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-yellow-600" />
                <h2 className="font-serif text-xl font-medium text-stone-800">Visual Content Management</h2>
              </div>
              <p className="text-xs text-stone-500 max-w-lg">
                Edit any section of your website here. All changes are saved to Supabase instantly and reflected live for all visitors.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAdminEditMode(!isAdminEditMode)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                  isAdminEditMode
                    ? 'bg-yellow-400 text-yellow-900 shadow-md'
                    : 'bg-stone-100 text-stone-600 hover:bg-yellow-100'
                }`}
              >
                <span>{isAdminEditMode ? '✏️ Edit Mode: ON' : 'Edit Mode: OFF'}</span>
              </button>
              <button
                onClick={() => navigateTo('home')}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-stone-200 text-xs font-semibold text-stone-600 hover:bg-stone-50 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>View Site</span>
              </button>
            </div>
          </div>

          {/* CMS Sections Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CMS_SECTIONS.map((section) => (
              <div
                key={section.key}
                className="bg-white rounded-2xl border border-secondary/20 shadow-subtle p-5 flex flex-col justify-between gap-4 hover:shadow-md transition-shadow"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{section.icon}</span>
                      <div>
                        <h3 className="font-serif text-base font-medium text-stone-800">{section.label}</h3>
                        <span className="text-[10px] uppercase tracking-widest text-stone-400 font-semibold">{section.section}</span>
                      </div>
                    </div>
                    {isSupabaseConfigured && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1 shrink-0" title="Synced to Supabase" />
                    )}
                  </div>
                  <p className="text-[11px] text-stone-500 leading-relaxed">{section.description}</p>
                </div>

                <button
                  onClick={() => setCmsDrawerOpen({ key: section.key, label: section.label })}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#180516] to-[#982476] text-white text-xs font-bold uppercase tracking-wider hover:opacity-95 transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <Edit2 className="w-3.5 h-3.5 text-yellow-400" />
                  <span>Edit {section.label}</span>
                </button>
              </div>
            ))}
          </div>

          {/* Info Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3 text-xs text-blue-800">
            <span className="text-lg shrink-0">ℹ️</span>
            <div>
              <strong className="font-semibold">How it works:</strong> Click "Edit" on any section to open the visual editor. Changes are saved to Supabase and go live immediately — no deployment needed. Enable <strong>Edit Mode</strong> to see edit buttons directly on the live website as you browse.
            </div>
          </div>

        </div>
      )}

      {/* TAB CONTENT: SITE SETTINGS */}
      {activeTab === 'settings' && (
        <div className="space-y-6 animate-fade-in">

          {/* Settings Header */}
          <div className="bg-white border border-secondary/20 rounded-2xl p-6 shadow-subtle">
            <div className="flex items-center gap-3 mb-1">
              <Settings2 className="w-5 h-5 text-stone-600" />
              <h2 className="font-serif text-xl font-medium text-stone-800">Site Settings</h2>
            </div>
            <p className="text-xs text-stone-500">
              Control global site behaviours. Changes are persisted to the Supabase <code className="font-mono bg-stone-100 px-1 rounded">app_settings</code> table and take effect immediately.
            </p>
          </div>

          {/* Admin Panel Visibility Toggle Card */}
          <div className="bg-white border border-secondary/20 rounded-2xl p-6 shadow-subtle space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-royal-violet" />
                  <h3 className="font-serif text-base font-semibold text-stone-800">Admin Panel Visibility</h3>
                </div>
                <p className="text-xs text-stone-500 max-w-md">
                  When <strong>ON</strong>, the Admin button appears in the navbar and the Admin portal is accessible to authorised staff.
                  Turn <strong>OFF</strong> to hide all admin entry points from the public-facing site.
                </p>
                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mt-1 ${
                  adminEnabled
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${adminEnabled ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                  {adminEnabled ? 'Admin Access: Enabled' : 'Admin Access: Hidden'}
                </div>
              </div>

              {/* Big Toggle Switch */}
              <button
                onClick={async () => {
                  setIsTogglingAdmin(true);
                  const next = !adminEnabled;
                  await setAdminEnabledRemote(next);
                  showToast(
                    next
                      ? 'Admin panel enabled — navbar button is now visible.'
                      : 'Admin panel hidden — admin button removed from navbar.',
                    next ? 'success' : 'info'
                  );
                  setIsTogglingAdmin(false);
                }}
                disabled={isTogglingAdmin}
                className={`relative flex items-center gap-3 px-5 py-3 rounded-2xl border-2 font-semibold text-sm transition-all ${
                  adminEnabled
                    ? 'border-emerald-400 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                    : 'border-red-300 bg-red-50 text-red-800 hover:bg-red-100'
                } ${isTogglingAdmin ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                title={adminEnabled ? 'Click to hide Admin from navbar' : 'Click to show Admin in navbar'}
              >
                {adminEnabled ? (
                  <ToggleRight className="w-8 h-8 text-emerald-600" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-red-400" />
                )}
                <span>{isTogglingAdmin ? 'Saving…' : adminEnabled ? 'ON' : 'OFF'}</span>
              </button>
            </div>

            {/* Info box */}
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 text-xs text-stone-600 space-y-1">
              <p>📌 <strong>Note:</strong> Turning admin OFF only hides the navbar button — this settings page remains accessible to already-logged-in admins.</p>
              <p>🔒 The Supabase <code className="font-mono bg-stone-100 px-1 rounded">app_settings</code> table stores this flag. Run the SQL snippet in your Supabase dashboard if the table does not yet exist.</p>
            </div>
          </div>

          {/* Pricing & Regional Market */}
          <div className="bg-white border border-secondary/20 rounded-2xl p-6 shadow-subtle space-y-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-royal-violet" />
                <h3 className="font-serif text-base font-semibold text-stone-800">Pricing &amp; Regional Market</h3>
              </div>
              <p className="text-xs text-stone-500 max-w-2xl">
                Set free-delivery thresholds and delivery fees per market. Orders at or above the threshold get free delivery; below it, the flat fee applies.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4 p-4 border border-stone-200 rounded-xl bg-stone-50/50">
                <h4 className="text-sm font-semibold text-stone-800 flex items-center gap-2">
                  <span>🇦🇪</span> UAE / Arab (AED)
                </h4>
                <label className="block space-y-1">
                  <span className="text-xs font-medium text-stone-600">Free delivery threshold (AED)</span>
                  <input
                    type="number"
                    min="0"
                    value={deliveryForm.arab.freeDeliveryThreshold}
                    onChange={(e) => setDeliveryForm(prev => ({
                      ...prev,
                      arab: { ...prev.arab, freeDeliveryThreshold: Number(e.target.value) }
                    }))}
                    className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg bg-white"
                  />
                </label>
                <label className="block space-y-1">
                  <span className="text-xs font-medium text-stone-600">Delivery fee below threshold (AED)</span>
                  <input
                    type="number"
                    min="0"
                    value={deliveryForm.arab.deliveryFee}
                    onChange={(e) => setDeliveryForm(prev => ({
                      ...prev,
                      arab: { ...prev.arab, deliveryFee: Number(e.target.value) }
                    }))}
                    className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg bg-white"
                  />
                </label>
              </div>

              <div className="space-y-4 p-4 border border-stone-200 rounded-xl bg-stone-50/50">
                <h4 className="text-sm font-semibold text-stone-800 flex items-center gap-2">
                  <span>🇮🇳</span> India (INR)
                </h4>
                <label className="block space-y-1">
                  <span className="text-xs font-medium text-stone-600">Free delivery threshold (INR)</span>
                  <input
                    type="number"
                    min="0"
                    value={deliveryForm.india.freeDeliveryThreshold}
                    onChange={(e) => setDeliveryForm(prev => ({
                      ...prev,
                      india: { ...prev.india, freeDeliveryThreshold: Number(e.target.value) }
                    }))}
                    className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg bg-white"
                  />
                </label>
                <label className="block space-y-1">
                  <span className="text-xs font-medium text-stone-600">Delivery fee below threshold (INR)</span>
                  <input
                    type="number"
                    min="0"
                    value={deliveryForm.india.deliveryFee}
                    onChange={(e) => setDeliveryForm(prev => ({
                      ...prev,
                      india: { ...prev.india, deliveryFee: Number(e.target.value) }
                    }))}
                    className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg bg-white"
                  />
                </label>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 pt-2 border-t border-stone-100">
              <p className="text-xs text-stone-500">
                UAE example: orders ≥ {deliveryForm.arab.freeDeliveryThreshold} AED ship free; below that, {deliveryForm.arab.deliveryFee} AED fee.
              </p>
              <button
                onClick={async () => {
                  setIsSavingDelivery(true);
                  await setDeliverySettingsRemote(deliveryForm);
                  showToast('Delivery settings saved.', 'success');
                  setIsSavingDelivery(false);
                }}
                disabled={isSavingDelivery}
                className={`px-5 py-2.5 rounded-xl bg-royal-violet text-white text-sm font-semibold transition-all ${
                  isSavingDelivery ? 'opacity-60 cursor-not-allowed' : 'hover:bg-royal-violet/90 cursor-pointer'
                }`}
              >
                {isSavingDelivery ? 'Saving…' : 'Save Delivery Settings'}
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
