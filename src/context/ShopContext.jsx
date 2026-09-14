import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PRODUCTS as STATIC_PRODUCTS, DEFAULT_ABAYA_SIZE } from '../data/products';
import {
  DEFAULT_FILTERS,
  parseLocation,
  parseFilterParams,
  buildFilterSearch,
  pathForView,
} from '../lib/routing';
import {
  fetchProductsFromSupabase,
  upsertProductToSupabase,
  deleteProductFromSupabase,
  seedInitialProductsToSupabase,
  isSupabaseConfigured,
} from '../lib/supabase';

import { fetchAllSiteContent, upsertSiteContent, DEFAULT_CONTENT } from '../lib/cms';
import { fetchAdminEnabled, setAdminEnabledRemote as _setAdminEnabledRemote } from '../lib/adminSettings';
import {
  fetchDeliverySettings,
  setDeliverySettingsRemote as _setDeliverySettingsRemote,
  DEFAULT_DELIVERY_SETTINGS,
  computeShippingFee,
  getRegionSubtotal,
} from '../lib/deliverySettings';
import { detectUserLocation } from '../utils/geo';

const ShopContext = createContext();

const CURRENCIES = {
  AED: { symbol: "AED ", name: "UAE / Arab (AED د.إ)", flag: "🇦🇪", region: "arab" },
  INR: { symbol: "₹", name: "India (₹ INR)", flag: "🇮🇳", region: "india" },
};

function isProductVisibleForRegion(product, region) {
  if (!product) return false;
  if (product.targetRegion === 'all') return true;
  return product.targetRegion === region;
}

function getProductPriceForCurrency(product, curr) {
  if (!product) return 0;
  return curr === 'INR' ? (product.priceInr ?? product.price ?? 0) : (product.price ?? 0);
}

const DEFAULT_ADMIN_PIN = import.meta.env.VITE_ADMIN_PIN || '1234';

export function ShopProvider({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const parsedLocation = useMemo(
    () => parseLocation(location.pathname, location.search),
    [location.pathname, location.search]
  );
  const currentView = parsedLocation.view;
  const selectedProductId = parsedLocation.productId;

  const [selectedCategoryFilter, setSelectedCategoryFilterState] = useState(DEFAULT_FILTERS.category);
  const [selectedCollectionsTab, setSelectedCollectionsTabState] = useState(DEFAULT_FILTERS.tab);
  const [selectedColorFilter, setSelectedColorFilterState] = useState(DEFAULT_FILTERS.color);
  const [selectedStyleFilter, setSelectedStyleFilterState] = useState(DEFAULT_FILTERS.style);
  const [selectedWorkFilter, setSelectedWorkFilterState] = useState(DEFAULT_FILTERS.work);
  const [selectedSubcategoryFilter, setSelectedSubcategoryFilterState] = useState(DEFAULT_FILTERS.subcategory);
  const [selectedWholesaleTypeFilter, setSelectedWholesaleTypeFilterState] = useState(DEFAULT_FILTERS.wholesale);
  const [selectedBadgeFilter, setSelectedBadgeFilterState] = useState(DEFAULT_FILTERS.badge);
  const [wishlistOnlyFilter, setWishlistOnlyFilterState] = useState(DEFAULT_FILTERS.wishlist);
  const [searchQuery, setSearchQueryState] = useState(DEFAULT_FILTERS.q);

  const filtersRef = useRef({
    category: DEFAULT_FILTERS.category,
    style: DEFAULT_FILTERS.style,
    work: DEFAULT_FILTERS.work,
    color: DEFAULT_FILTERS.color,
    subcategory: DEFAULT_FILTERS.subcategory,
    wholesale: DEFAULT_FILTERS.wholesale,
    badge: DEFAULT_FILTERS.badge,
    tab: DEFAULT_FILTERS.tab,
    wishlist: DEFAULT_FILTERS.wishlist,
    q: DEFAULT_FILTERS.q,
  });

  const applyFiltersToState = useCallback((filters) => {
    filtersRef.current = { ...filtersRef.current, ...filters };
    if (filters.category !== undefined) setSelectedCategoryFilterState(filters.category || 'All');
    if (filters.style !== undefined) setSelectedStyleFilterState(filters.style || 'All');
    if (filters.work !== undefined) setSelectedWorkFilterState(filters.work || 'All');
    if (filters.color !== undefined) setSelectedColorFilterState(filters.color || 'All');
    if (filters.subcategory !== undefined) setSelectedSubcategoryFilterState(filters.subcategory || 'All');
    if (filters.wholesale !== undefined) setSelectedWholesaleTypeFilterState(filters.wholesale || 'All');
    if (filters.badge !== undefined) setSelectedBadgeFilterState(filters.badge || 'All');
    if (filters.tab !== undefined) setSelectedCollectionsTabState(filters.tab || DEFAULT_FILTERS.tab);
    if (filters.wishlist !== undefined) setWishlistOnlyFilterState(Boolean(filters.wishlist));
    if (filters.q !== undefined) setSearchQueryState(filters.q || '');
  }, []);

  useEffect(() => {
    if (currentView === 'shop' || currentView === 'collections') {
      applyFiltersToState(parseFilterParams(location.search));
    }
  }, [currentView, location.search, applyFiltersToState]);

  const writeCatalogUrl = useCallback((nextFilters, { pathname, replace = false } = {}) => {
    const merged = { ...filtersRef.current, ...nextFilters };
    filtersRef.current = merged;
    applyFiltersToState(merged);
    const isCatalog = currentView === 'shop' || currentView === 'collections';
    const targetPath = pathname || (isCatalog ? location.pathname : '/shop');
    const nextUrl = `${targetPath}${buildFilterSearch(merged)}`;
    const currentUrl = `${location.pathname}${location.search}`;
    if (nextUrl !== currentUrl) {
      navigate(nextUrl, { replace });
    }
  }, [applyFiltersToState, currentView, location.pathname, location.search, navigate]);

  const setSelectedCategoryFilter = useCallback((value) => {
    writeCatalogUrl({ category: value });
  }, [writeCatalogUrl]);
  const setSelectedStyleFilter = useCallback((value) => {
    writeCatalogUrl({ style: value });
  }, [writeCatalogUrl]);
  const setSelectedWorkFilter = useCallback((value) => {
    writeCatalogUrl({ work: value });
  }, [writeCatalogUrl]);
  const setSelectedColorFilter = useCallback((value) => {
    writeCatalogUrl({ color: value });
  }, [writeCatalogUrl]);
  const setSelectedSubcategoryFilter = useCallback((value) => {
    writeCatalogUrl({ subcategory: value });
  }, [writeCatalogUrl]);
  const setSelectedWholesaleTypeFilter = useCallback((value) => {
    writeCatalogUrl({ wholesale: value });
  }, [writeCatalogUrl]);
  const setSelectedBadgeFilter = useCallback((value) => {
    writeCatalogUrl({ badge: value });
  }, [writeCatalogUrl]);
  const setSelectedCollectionsTab = useCallback((value) => {
    writeCatalogUrl({ tab: value });
  }, [writeCatalogUrl]);
  const setWishlistOnlyFilter = useCallback((value) => {
    writeCatalogUrl({ wishlist: Boolean(value) });
  }, [writeCatalogUrl]);
  const setSearchQuery = useCallback((value) => {
    if (currentView === 'shop' || currentView === 'collections') {
      writeCatalogUrl({ q: value || '' });
    } else {
      applyFiltersToState({ q: value || '' });
    }
  }, [applyFiltersToState, currentView, writeCatalogUrl]);
  const setSelectedProductId = useCallback((productId) => {
    if (productId) {
      navigate(pathForView('product-detail', productId));
    }
  }, [navigate]);
  const setCurrentView = useCallback((view) => {
    if (view === 'shop' || view === 'collections') {
      writeCatalogUrl({}, { pathname: pathForView(view) });
    } else {
      navigate(pathForView(view, selectedProductId));
    }
  }, [navigate, selectedProductId, writeCatalogUrl]);
  
  // Dynamic Products State
  const [products, setProducts] = useState(() => {
    try {
      const cached = localStorage.getItem('noor_admin_products');
      if (cached !== null) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (_) {}
    return isSupabaseConfigured ? [] : STATIC_PRODUCTS;
  });

  // CMS Site Content State
  const [siteContent, setSiteContent] = useState(() => {
    try {
      const saved = localStorage.getItem('noor_cms_content');
      if (saved) return { ...DEFAULT_CONTENT, ...JSON.parse(saved) };
    } catch (_) {}
    return { ...DEFAULT_CONTENT };
  });

  // Admin Edit Mode (on-page visual editing toggle)
  const [isAdminEditMode, setIsAdminEditMode] = useState(false);
  // Which CMS section drawer is open: null | { key, label }
  const [cmsDrawerOpen, setCmsDrawerOpen] = useState(null);
  const [isProductsLoading, setIsProductsLoading] = useState(false);

  // Admin Visibility Toggle (controlled via Supabase app_settings table)
  const [adminEnabled, setAdminEnabled] = useState(() => {
    try {
      const saved = localStorage.getItem('noor_admin_enabled');
      if (saved !== null) return JSON.parse(saved);
    } catch (_) {}
    return true; // default ON
  });

  // Delivery settings (per-region thresholds and fees)
  const [deliverySettings, setDeliverySettings] = useState(() => {
    try {
      const saved = localStorage.getItem('noor_delivery_settings');
      if (saved !== null) return JSON.parse(saved);
    } catch (_) {}
    return { ...DEFAULT_DELIVERY_SETTINGS };
  });

  // Admin Auth State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    try {
      return localStorage.getItem('noor_admin_auth') === 'true';
    } catch (_) {
      return false;
    }
  });

  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [whatsAppModalPayload, setWhatsAppModalPayload] = useState(null);

  const openWhatsAppModal = useCallback((payload) => {
    setWhatsAppModalPayload(payload);
    setIsWhatsAppModalOpen(true);
  }, []);

  const closeWhatsAppModal = useCallback(() => {
    setIsWhatsAppModalOpen(false);
    setWhatsAppModalPayload(null);
  }, []);

  // User Location (IP Geolocation via GeoJS)
  const [userLocation, setUserLocation] = useState({
    country: 'India',
    countryCode: 'IN',
    city: '',
    region: '',
    ip: '',
    flag: '🇮🇳',
    suggestedCurrency: 'INR',
    isDetected: false
  });
  const [isLocationLoading, setIsLocationLoading] = useState(true);

  const CURRENCY_PREF_KEY = 'noor_currency_pref';
  const CURRENCY_MANUAL_KEY = 'noor_currency_manual';

  const hasManualCurrencyPref = () => {
    try {
      return localStorage.getItem(CURRENCY_MANUAL_KEY) === '1';
    } catch (_) {
      return false;
    }
  };

  // Currency: manual choice persists; otherwise geo picks market on each visit
  const [currency, setCurrencyState] = useState(() => {
    try {
      if (hasManualCurrencyPref()) {
        const saved = localStorage.getItem(CURRENCY_PREF_KEY);
        if (saved && CURRENCIES[saved]) return saved;
      }
    } catch (_) {}
    return 'INR';
  });

  const applyCurrency = useCallback((newCurr, { manual = false } = {}) => {
    if (!CURRENCIES[newCurr]) return;
    const newRegion = newCurr === 'AED' ? 'arab' : 'india';
    setCurrencyState(newCurr);

    try {
      if (manual) {
        localStorage.setItem(CURRENCY_PREF_KEY, newCurr);
        localStorage.setItem(CURRENCY_MANUAL_KEY, '1');
      } else {
        localStorage.removeItem(CURRENCY_PREF_KEY);
        localStorage.removeItem(CURRENCY_MANUAL_KEY);
      }
    } catch (_) {}

    setCart((prev) => {
      return prev
        .filter((item) => {
          const product = products.find((p) => p.id === item.productId);
          return isProductVisibleForRegion(product, newRegion);
        })
        .map((item) => {
          const product = products.find((p) => p.id === item.productId);
          return { ...item, price: getProductPriceForCurrency(product, newCurr) };
        });
    });
  }, [products]);

  const setCurrency = useCallback((newCurr) => {
    applyCurrency(newCurr, { manual: true });
  }, [applyCurrency]);

  const applyCurrencyRef = useRef(applyCurrency);
  applyCurrencyRef.current = applyCurrency;

  // Detect country and auto-select market (India -> INR, UAE -> AED)
  useEffect(() => {
    let isMounted = true;
    async function initGeo() {
      try {
        const geo = await detectUserLocation();
        if (!isMounted) return;

        setUserLocation(geo);
        setIsLocationLoading(false);

        if (!hasManualCurrencyPref() && geo.suggestedCurrency && CURRENCIES[geo.suggestedCurrency]) {
          applyCurrencyRef.current(geo.suggestedCurrency, { manual: false });
        }
      } catch (err) {
        if (isMounted) setIsLocationLoading(false);
      }
    }
    initGeo();
    return () => { isMounted = false; };
  }, []);

  // Cart State (stored in localStorage)
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('noor_cart') || localStorage.getItem('hayat_cart');
      return saved ? JSON.parse(saved) : [
        {
          id: 'midnight-espresso-silk-Midnight Espresso-Large (56)-Open abaya-Handwork Abaya',
          productId: 'midnight-espresso-silk',
          name: 'Midnight Espresso Silk Abaya',
          price: 185,
          color: 'Midnight Espresso',
          hex: '#2E1C1A',
          size: 'Large (56)',
          style: 'Open abaya',
          work: 'Handwork Abaya',
          image: STATIC_PRODUCTS[0].image,
          quantity: 1
        }
      ];
    } catch {
      return [];
    }
  });

  // Wishlist State
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('noor_wishlist') || localStorage.getItem('hayat_wishlist');
      return saved ? JSON.parse(saved) : ['midnight-espresso-silk', 'royal-violet-silk'];
    } catch {
      return [];
    }
  });

  // Toast Notifications disabled
  const [toasts, setToasts] = useState([]);
  const showToast = useCallback(() => {}, []);

  // Fetch Products from Supabase on mount
  const refreshProducts = useCallback(async () => {
    setIsProductsLoading(true);
    console.log('[ShopContext] 🔄 refreshProducts triggered...');
    try {
      const { data, source, error } = await fetchProductsFromSupabase();
      console.log('[ShopContext] 📦 refreshProducts finished => count:', data?.length ?? 0, 'source:', source, 'error:', error);
      if (Array.isArray(data)) {
        setProducts(data);
      }
    } catch (err) {
      console.error('[ShopContext ERROR] Failed to load products:', err);
    } finally {
      setIsProductsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);

  // Fetch CMS site content from Supabase on mount
  const refreshSiteContent = useCallback(async () => {
    try {
      const content = await fetchAllSiteContent();
      setSiteContent(content);
    } catch (err) {
      console.warn('Failed to load site content:', err);
    }
  }, []);

  useEffect(() => {
    refreshSiteContent();
  }, [refreshSiteContent]);

  // Update a single CMS section key (optimistic + Supabase save)
  const updateSiteContent = useCallback(async (key, newContent) => {
    console.log('[ShopContext] updateSiteContent triggered for:', key, newContent);
    setSiteContent(prev => ({ ...prev, [key]: newContent }));
    await upsertSiteContent(key, newContent);
  }, []);

  // Fetch admin_enabled flag from Supabase on mount
  useEffect(() => {
    let isMounted = true;
    async function loadAdminEnabled() {
      try {
        const val = await fetchAdminEnabled();
        if (isMounted) setAdminEnabled(val);
      } catch (_) {}
    }
    loadAdminEnabled();
    return () => { isMounted = false; };
  }, []);

  // Fetch delivery settings from Supabase on mount
  useEffect(() => {
    let isMounted = true;
    async function loadDeliverySettings() {
      try {
        const val = await fetchDeliverySettings();
        if (isMounted) setDeliverySettings(val);
      } catch (_) {}
    }
    loadDeliverySettings();
    return () => { isMounted = false; };
  }, []);

  // Toggle admin visibility and persist to Supabase
  const setAdminEnabledRemote = useCallback(async (val) => {
    setAdminEnabled(val);
    await _setAdminEnabledRemote(val);
  }, []);

  // Update delivery settings and persist to Supabase
  const setDeliverySettingsRemote = useCallback(async (val) => {
    const normalized = await _setDeliverySettingsRemote(val);
    setDeliverySettings(normalized);
    return normalized;
  }, []);

  // Product CRUD Handlers
  const createProduct = async (newProduct) => {
    console.group(`[ShopContext] ➕ createProduct: ${newProduct?.name} (ID: ${newProduct?.id})`);
    console.log('[ShopContext] Product model:', newProduct);
    // Optimistic local update
    setProducts(prev => {
      const next = [newProduct, ...prev];
      try {
        localStorage.setItem('noor_admin_products', JSON.stringify(next));
      } catch (_) {}
      return next;
    });
    const result = await upsertProductToSupabase(newProduct);
    console.log('[ShopContext] Supabase upsert result:', result);
    if (result.data) {
      setProducts(prev => {
        const filtered = prev.filter(p => p.id !== newProduct.id);
        const next = [result.data, ...filtered];
        try {
          localStorage.setItem('noor_admin_products', JSON.stringify(next));
        } catch (_) {}
        return next;
      });
    }
    console.groupEnd();
    return result;
  };

  const updateProduct = async (id, updatedFields) => {
    console.group(`[ShopContext] ✏️ updateProduct ID: ${id}`);
    console.log('[ShopContext] Updated fields:', updatedFields);
    let merged = null;
    setProducts(prev => {
      const next = prev.map(p => {
        if (p.id === id) {
          merged = { ...p, ...updatedFields };
          return merged;
        }
        return p;
      });
      try {
        localStorage.setItem('noor_admin_products', JSON.stringify(next));
      } catch (_) {}
      return next;
    });
    if (merged) {
      console.log('[ShopContext] Saving merged product to Supabase:', merged);
      const res = await upsertProductToSupabase(merged);
      console.log('[ShopContext] Update result from Supabase:', res);
      console.groupEnd();
      return res;
    }
    console.groupEnd();
  };

  const deleteProduct = async (id) => {
    console.group(`[ShopContext] 🗑️ deleteProduct ID: ${id}`);
    setProducts(prev => {
      const next = prev.filter(p => p.id !== id);
      try {
        localStorage.setItem('noor_admin_products', JSON.stringify(next));
      } catch (_) {}
      return next;
    });
    const res = await deleteProductFromSupabase(id);
    console.log('[ShopContext] Delete result:', res);
    console.groupEnd();
  };

  const seedCatalog = async () => {
    console.log('[ShopContext] 🌱 seedCatalog triggered');
    const result = await seedInitialProductsToSupabase();
    console.log('[ShopContext] Seed result:', result);
    if (result.success) {
      await refreshProducts();
    }
    return result;
  };

  // Admin Auth Handlers
  const loginAdmin = (pin) => {
    if (String(pin).trim() === String(DEFAULT_ADMIN_PIN).trim()) {
      setIsAdminLoggedIn(true);
      try {
        localStorage.setItem('noor_admin_auth', 'true');
      } catch (_) {}
      showToast('Admin access granted.');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    try {
      localStorage.removeItem('noor_admin_auth');
    } catch (_) {}
    showToast('Signed out of admin portal.', 'info');
  };

  // Sync Cart & Wishlist to localStorage
  useEffect(() => {
    localStorage.setItem('noor_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('noor_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Window scroll to top on view change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView, selectedProductId]);

  const navigateTo = useCallback((view, productId = null, category = null, collectionsTab = null, color = null, style = null, work = null, wishlistOnly = false, search = null, subcategory = null, wholesaleType = null, badge = null) => {
    setIsSearchOpen(false);

    if (view === 'product-detail' || (productId && view !== 'shop' && view !== 'collections')) {
      if (productId) {
        navigate(pathForView('product-detail', productId));
        return;
      }
    }

    if (view === 'shop' || view === 'collections') {
      const resetSearch = search === null && !category && !style && !work && !color && !subcategory && !wholesaleType && !badge;
      writeCatalogUrl({
        category: category || 'All',
        style: style || 'All',
        work: work || 'All',
        color: color || 'All',
        subcategory: subcategory || 'All',
        wholesale: wholesaleType || 'All',
        badge: badge || 'All',
        tab: collectionsTab || filtersRef.current.tab,
        wishlist: Boolean(wishlistOnly),
        q: search !== null ? search : (resetSearch ? '' : filtersRef.current.q),
      }, { pathname: pathForView(view) });
      return;
    }

    if (category) applyFiltersToState({ category });
    if (color) applyFiltersToState({ color });
    if (style) applyFiltersToState({ style });
    if (work) applyFiltersToState({ work });
    if (subcategory) applyFiltersToState({ subcategory });
    if (wholesaleType) applyFiltersToState({ wholesale: wholesaleType });
    if (badge) applyFiltersToState({ badge });
    if (collectionsTab) applyFiltersToState({ tab: collectionsTab });
    if (search !== null) applyFiltersToState({ q: search });
    applyFiltersToState({ wishlist: Boolean(wishlistOnly) });

    navigate(pathForView(view, productId));
  }, [applyFiltersToState, navigate, writeCatalogUrl]);

  const addToCart = (
    product,
    colorName,
    hexCode,
    size,
    quantity = 1,
    imageOverride = null,
    style = null,
    work = null,
    customMeasurements = null
  ) => {
    const resolvedStyle = style || product.defaultStyle || (product.styles && product.styles[0]) || 'Open abaya';
    const resolvedWork = work || product.defaultWork || (product.works && product.works[0]) || 'Plain/Basic';
    const resolvedColor = colorName || product.color || (product.colors && product.colors[0]?.name) || 'Midnight Espresso';
    const resolvedHex = hexCode || (product.colors && product.colors[0]?.hex) || '#2E1C1A';
    const resolvedSize = size || (product.sizes && product.sizes[0]) || DEFAULT_ABAYA_SIZE;
    const customTag = customMeasurements ? `-${customMeasurements.height || ''}-${customMeasurements.bust || ''}-${customMeasurements.length || ''}` : '';

    const cartItemId = `${product.id}-${resolvedColor}-${resolvedSize}-${resolvedStyle}-${resolvedWork}${customTag}`;
    setCart(prev => {
      const existing = prev.find(item => item.id === cartItemId);
      if (existing) {
        return prev.map(item =>
          item.id === cartItemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          id: cartItemId,
          productId: product.id,
          name: product.name,
          price: getProductPriceForCurrency(product, currency),
          category: product.category,
          wholesaleType: product.wholesaleType,
          color: resolvedColor,
          hex: resolvedHex,
          size: resolvedSize,
          style: resolvedStyle,
          work: resolvedWork,
          customMeasurements,
          image: imageOverride || product.image,
          quantity
        }
      ];
    });
    showToast(`Added "${product.name}" (${resolvedStyle} • ${resolvedWork}) to your luxury bag.`);
    setIsCartOpen(true);
  };

  const updateCartQuantity = (cartItemId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart(prev =>
      prev.map(item => (item.id === cartItemId ? { ...item, quantity: newQty } : item))
    );
  };

  const removeFromCart = (cartItemId) => {
    setCart(prev => prev.filter(item => item.id !== cartItemId));
    showToast('Item removed from your bag.', 'info');
  };

  const clearCart = () => {
    setCart([]);
    setAppliedDiscount(0);
    setDiscountCodeName('');
  };

  const toggleWishlist = (productId) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      const product = products.find(p => p.id === productId);
      const name = product ? product.name : 'Item';
      if (exists) {
        showToast(`Removed "${name}" from Wishlist.`, 'info');
        return prev.filter(id => id !== productId);
      } else {
        showToast(`Saved "${name}" to your Wishlist.`);
        return [...prev, productId];
      }
    });
  };

  const isWishlisted = (productId) => wishlist.includes(productId);

  // Active Region mapping ('india' vs 'arab')
  const activeRegion = currency === 'AED' ? 'arab' : 'india';

  const visibleProducts = useMemo(() => {
    return products.filter((p) => isProductVisibleForRegion(p, activeRegion));
  }, [products, activeRegion]);

  const getProductPrice = useCallback(
    (product) => getProductPriceForCurrency(product, currency),
    [currency]
  );

  const formatPrice = useCallback((amountOrProduct) => {
    const info = CURRENCIES[currency] || CURRENCIES.AED;
    const amount = typeof amountOrProduct === 'object' && amountOrProduct !== null
      ? getProductPriceForCurrency(amountOrProduct, currency)
      : Number(amountOrProduct || 0);
    const num = Math.round(amount);
    const formatted = currency === 'INR'
      ? num.toLocaleString('en-IN')
      : num.toLocaleString('en-US');
    return `${info.symbol}${formatted}`;
  }, [currency]);

  const rawCartSubtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const cartSubtotal = rawCartSubtotal;
  const regionSettings = deliverySettings[activeRegion] || DEFAULT_DELIVERY_SETTINGS[activeRegion];
  const freeShippingThreshold = regionSettings.freeDeliveryThreshold;
  const regionSubtotal = getRegionSubtotal(rawCartSubtotal);
  const shippingFee = computeShippingFee(rawCartSubtotal, activeRegion, deliverySettings);
  const cartTotal = cartSubtotal + shippingFee;
  const freeShippingProgress = freeShippingThreshold > 0
    ? Math.min(100, Math.round((regionSubtotal / freeShippingThreshold) * 100))
    : 100;
  const freeShippingDifference = Math.max(0, freeShippingThreshold - regionSubtotal);

  return (
    <ShopContext.Provider
      value={{
        // Products dynamic state and alias
        products: visibleProducts,
        PRODUCTS: visibleProducts,
        allProducts: products,
        activeRegion,
        setActiveRegion: (region) => setCurrency(region === 'arab' ? 'AED' : 'INR'),
        isProductsLoading,
        createProduct,
        updateProduct,
        deleteProduct,
        refreshProducts,
        seedCatalog,

        // CMS Site Content
        siteContent,
        updateSiteContent,
        refreshSiteContent,

        // Admin Edit Mode (on-page visual editing)
        isAdminEditMode,
        setIsAdminEditMode,
        cmsDrawerOpen,
        setCmsDrawerOpen,

        // Admin Visibility Toggle
        adminEnabled,
        setAdminEnabledRemote,

        // Delivery Settings
        deliverySettings,
        setDeliverySettingsRemote,

        // Admin Auth
        isAdminLoggedIn,
        loginAdmin,
        logoutAdmin,

        // Navigation
        currentView,
        setCurrentView,
        navigateTo,
        selectedProductId,
        setSelectedProductId,
        selectedCategoryFilter,
        setSelectedCategoryFilter,
        selectedCollectionsTab,
        setSelectedCollectionsTab,
        selectedColorFilter,
        setSelectedColorFilter,
        selectedStyleFilter,
        setSelectedStyleFilter,
        selectedWorkFilter,
        setSelectedWorkFilter,
        selectedSubcategoryFilter,
        setSelectedSubcategoryFilter,
        selectedWholesaleTypeFilter,
        setSelectedWholesaleTypeFilter,
        selectedBadgeFilter,
        setSelectedBadgeFilter,
        wishlistOnlyFilter,
        setWishlistOnlyFilter,
        searchQuery,
        setSearchQuery,

        // Modals
        isCartOpen,
        setIsCartOpen,
        isSearchOpen,
        setIsSearchOpen,
        quickViewProduct,
        setQuickViewProduct,
        isWhatsAppModalOpen,
        setIsWhatsAppModalOpen,
        whatsAppModalPayload,
        openWhatsAppModal,
        closeWhatsAppModal,

        // User Location (IP Geolocation)
        userLocation,
        isLocationLoading,

        // Currencies
        currency,
        setCurrency,
        CURRENCIES,
        getProductPrice,
        formatPrice,

        // Cart
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        rawCartSubtotal,
        cartSubtotal,
        shippingFee,
        cartTotal,
        freeShippingThreshold,
        freeShippingProgress,
        freeShippingDifference,

        // Wishlist
        wishlist,
        toggleWishlist,
        isWishlisted,

        // Toasts
        toasts,
        showToast
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
}
