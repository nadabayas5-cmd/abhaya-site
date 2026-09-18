import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  SlidersHorizontal,
  Sparkles,
  RotateCcw,
  X,
  Check,
  Search,
  ChevronDown,
  LayoutGrid,
  Square,
  Filter,
  PackageCheck,
  MessageCircle
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import ProductCard from '../components/ProductCard';
import {
  MAIN_CATEGORIES,
  ABAYA_STYLES,
  ABAYA_WORKS,
  WHOLESALE_TYPES
} from '../data/products';
import { openWhatsApp, formatSingleProductWhatsAppMessage } from '../utils/whatsapp';

export default function ShopPage() {
  const {
    PRODUCTS,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
    selectedStyleFilter: contextStyleFilter,
    setSelectedStyleFilter: setContextStyleFilter,
    selectedWorkFilter: contextWorkFilter,
    setSelectedWorkFilter: setContextWorkFilter,
    selectedColorFilter: contextColorFilter,
    setSelectedColorFilter: setContextColorFilter,
    selectedSubcategoryFilter: contextSubcategoryFilter,
    setSelectedSubcategoryFilter: setContextSubcategoryFilter,
    selectedWholesaleTypeFilter: contextWholesaleTypeFilter,
    setSelectedWholesaleTypeFilter: setContextWholesaleTypeFilter,
    selectedBadgeFilter: contextBadgeFilter,
    setSelectedBadgeFilter: setContextBadgeFilter,
    formatPrice,
    searchQuery,
    setSearchQuery
  } = useShop();

  // Price calculations
  const maxPriceLimit = useMemo(() => {
    return Math.max(...PRODUCTS.map(p => Number(p.price) || 0), 850);
  }, [PRODUCTS]);

  const minPriceLimit = 0;

  // Primary Category Selection (e.g. 'All', 'Abaya', 'Shaila/Shawl', 'Hijab', 'Inner & Prayer dress', 'Kids abaya', 'Wholesale')
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Sub-filter states
  const [selectedStyleFilter, setSelectedStyleFilter] = useState('All');
  const [selectedWorkFilter, setSelectedWorkFilter] = useState('All');
  const [selectedWholesaleType, setSelectedWholesaleType] = useState('All');
  const [selectedSubcategory, setSelectedSubcategory] = useState('All');
  const [selectedShade, setSelectedShade] = useState('All');
  const [selectedBadge, setSelectedBadge] = useState('All');
  const [maxPrice, setMaxPrice] = useState(maxPriceLimit);
  const [sortBy, setSortBy] = useState('featured');
  // UI state
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [mobileGridCols, setMobileGridCols] = useState(2);
  const [activeDrawerTab, setActiveDrawerTab] = useState('category'); // 'category' | 'style' | 'work' | 'wholesale' | 'shade'

  const sortDropdownRef = useRef(null);

  // Sync maxPrice when catalog changes
  useEffect(() => {
    setMaxPrice(prev => Math.max(prev, maxPriceLimit));
  }, [maxPriceLimit]);

  // Sync external filters from context
  useEffect(() => {
    console.log('[ShopPage] Syncing context filters:', {
      selectedCategoryFilter,
      contextStyleFilter,
      contextWorkFilter,
      contextColorFilter,
      contextSubcategoryFilter,
      contextWholesaleTypeFilter,
      contextBadgeFilter
    });

    if (selectedCategoryFilter) {
      setSelectedCategory(selectedCategoryFilter);
    }
    if (contextStyleFilter) {
      setSelectedStyleFilter(contextStyleFilter);
    }
    if (contextWorkFilter) {
      setSelectedWorkFilter(contextWorkFilter);
    }
    if (contextColorFilter) {
      setSelectedShade(contextColorFilter);
    }
    if (contextSubcategoryFilter) {
      setSelectedSubcategory(contextSubcategoryFilter);
    }
    if (contextWholesaleTypeFilter) {
      setSelectedWholesaleType(contextWholesaleTypeFilter);
    }
    if (contextBadgeFilter) {
      setSelectedBadge(contextBadgeFilter);
    }
  }, [
    selectedCategoryFilter,
    contextStyleFilter,
    contextWorkFilter,
    contextColorFilter,
    contextSubcategoryFilter,
    contextWholesaleTypeFilter,
    contextBadgeFilter
  ]);

  // Close sort dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(e.target)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Prevent background scroll when mobile filter drawer is open
  useEffect(() => {
    if (mobileFilterOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileFilterOpen]);

  // Main Category Tabs (dynamically includes any custom category from products + Limited Edition)
  const categoryTabs = useMemo(() => {
    const baseTabs = [
      { id: 'All', label: 'All Collections' },
      { id: 'Abaya', label: 'Abaya' },
      { id: 'Shaila/Shawl', label: 'Shaila / Shawl' },
      { id: 'Hijab', label: 'Hijab, Niqab & Gloves' },
      { id: 'Inner & Prayer dress', label: 'Inner & Prayer Dress' },
      { id: 'Kids abaya', label: 'Kids Abaya' },
      { id: 'Wholesale', label: 'Wholesale (B2B)' },
      { id: 'Limited Edition', label: 'Limited Edition' }
    ];
    PRODUCTS.forEach(p => {
      if (p.category && !baseTabs.some(t => t.id.toLowerCase() === p.category.toLowerCase())) {
        baseTabs.push({ id: p.category, label: p.category });
      }
    });
    return baseTabs;
  }, [PRODUCTS]);

  // Dynamic Shades Palette
  const shades = useMemo(() => {
    const baseShades = [
      { name: 'All', hex: null },
      { name: 'Espresso', hex: '#2E1C1A' },
      { name: 'Violet', hex: '#982476' },
      { name: 'Amethyst', hex: '#C76AA9' },
      { name: 'Rose', hex: '#C49A99' },
      { name: 'Sage', hex: '#7D8B79' },
      { name: 'Ivory', hex: '#FBF6EE' }
    ];
    PRODUCTS.forEach(p => {
      if (p.color && p.color.trim()) {
        const cTrim = p.color.trim();
        if (!baseShades.some(s => s.name.toLowerCase() === cTrim.toLowerCase())) {
          baseShades.push({ name: cTrim, hex: '#4A3B32' });
        }
      }
      if (Array.isArray(p.colors)) {
        p.colors.forEach(c => {
          const cName = typeof c === 'string' ? c : c?.name;
          const cHex = typeof c === 'object' && c?.hex ? c.hex : '#4A3B32';
          if (cName && !baseShades.some(s => s.name.toLowerCase() === cName.toLowerCase())) {
            baseShades.push({ name: cName, hex: cHex });
          }
        });
      }
    });
    return baseShades;
  }, [PRODUCTS]);

  const sortOptions = [
    { id: 'featured', label: 'Featured' },
    { id: 'price-low', label: 'Price: Low to High' },
    { id: 'price-high', label: 'Price: High to Low' },
    { id: 'rating', label: 'Highest Rated' }
  ];

  const currentSortLabel = sortOptions.find(o => o.id === sortBy)?.label || 'Featured';

  // Filter products algorithm
  const filteredProducts = useMemo(() => {
    const result = PRODUCTS.filter((product) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = product.name ? product.name.toLowerCase().includes(q) : false;
        const matchesCategory = product.category ? product.category.toLowerCase().includes(q) : false;
        const matchesSubtitle = product.subtitle ? product.subtitle.toLowerCase().includes(q) : false;
        const matchesStyle =
          (product.defaultStyle && product.defaultStyle.toLowerCase().includes(q)) ||
          (Array.isArray(product.styles) && product.styles.some(s => s.toLowerCase().includes(q)));
        const matchesWork =
          (product.defaultWork && product.defaultWork.toLowerCase().includes(q)) ||
          (Array.isArray(product.works) && product.works.some(w => w.toLowerCase().includes(q)));
        const matchesWholesale = product.wholesaleType ? product.wholesaleType.toLowerCase().includes(q) : false;
        const matchesSubcategory = product.subcategory ? product.subcategory.toLowerCase().includes(q) : false;
        const matchesColor = (product.color && product.color.toLowerCase().includes(q)) ||
          (Array.isArray(product.colors) && product.colors.some(c => (typeof c === 'string' ? c : c?.name || '').toLowerCase().includes(q)));
        const matchesBadge = product.badge ? product.badge.toLowerCase().includes(q) : false;
        const matchesDesc = product.description ? product.description.toLowerCase().includes(q) : false;

        if (!matchesName && !matchesCategory && !matchesSubtitle && !matchesStyle && !matchesWork && !matchesWholesale && !matchesSubcategory && !matchesColor && !matchesBadge && !matchesDesc) {
          return false;
        }
      }

      // 2. Primary Category Filter
      if (selectedCategory !== 'All') {
        const catLower = selectedCategory.toLowerCase();
        const prodCatLower = (product.category || '').toLowerCase();
        
        // Exact match or sub-token match for compound labels
        const matchesCat = prodCatLower === catLower ||
          prodCatLower.includes(catLower) ||
          catLower.includes(prodCatLower) ||
          (catLower === 'hijab' && prodCatLower.includes('hijab')) ||
          (catLower === 'inner & prayer dress' && (prodCatLower.includes('inner') || prodCatLower.includes('prayer'))) ||
          (catLower === 'kids abaya' && prodCatLower.includes('kids')) ||
          (catLower === 'wholesale' && prodCatLower.includes('wholesale'));

        if (!matchesCat) return false;
      }

      // 3. Max Price Slider
      if (product.price > maxPrice) {
        return false;
      }

      // 4. Style Filter (For Abayas)
      if (selectedStyleFilter !== 'All') {
        const styleLower = selectedStyleFilter.toLowerCase();
        const primaryStyle = (product.defaultStyle || '').toLowerCase();
        let matchesStyle = false;

        if (primaryStyle) {
          matchesStyle = primaryStyle === styleLower || primaryStyle.includes(styleLower) || styleLower.includes(primaryStyle);
        }
        if (!matchesStyle && Array.isArray(product.styles) && product.styles.length > 0) {
          matchesStyle = product.styles.some(s => {
            const sl = s.toLowerCase();
            return sl === styleLower || sl.includes(styleLower) || styleLower.includes(sl);
          });
        }

        if (!matchesStyle) return false;
      }

      // 5. Work / Craftsmanship Filter (For Abayas)
      if (selectedWorkFilter !== 'All') {
        const workLower = selectedWorkFilter.toLowerCase();
        const primaryWork = (product.defaultWork || '').toLowerCase();
        const isPlainFilter = workLower === 'plain/basic' || workLower === 'plain' || workLower === 'basic';
        const isOthersFilter = workLower === 'others' || workLower === 'other';
        let matchesWork = false;

        if (primaryWork) {
          matchesWork = primaryWork === workLower ||
            (isPlainFilter && (primaryWork === 'plain' || primaryWork === 'plain/basic' || primaryWork === 'basic')) ||
            (isOthersFilter && (primaryWork === 'others' || primaryWork === 'other'));
        }
        if (!matchesWork && Array.isArray(product.works) && product.works.length > 0) {
          matchesWork = product.works.some(w => {
            const wLower = w.toLowerCase();
            return wLower === workLower ||
              (isPlainFilter && (wLower === 'plain' || wLower === 'plain/basic' || wLower === 'basic')) ||
              (isOthersFilter && (wLower === 'others' || wLower === 'other'));
          });
        }

        if (!matchesWork) return false;
      }

      // 6. Wholesale Type Filter
      if (selectedWholesaleType !== 'All') {
        const wtLower = selectedWholesaleType.toLowerCase();
        const matchesWt =
          (product.wholesaleType && product.wholesaleType.toLowerCase() === wtLower) ||
          (product.name && product.name.toLowerCase().includes(wtLower));
        if (!matchesWt) return false;
      }

      // 7. Subcategory Filter (For Hijab / Inner)
      if (selectedSubcategory !== 'All') {
        const subLower = selectedSubcategory.toLowerCase();
        const matchesSub =
          (product.subcategory && product.subcategory.toLowerCase() === subLower) ||
          (product.name && product.name.toLowerCase().includes(subLower));
        if (!matchesSub) return false;
      }

      // 8. Shade / Color Filter
      if (selectedShade !== 'All') {
        const sLower = selectedShade.toLowerCase();
        const matchesDirectColor = product.color && (product.color.toLowerCase() === sLower || product.color.toLowerCase().includes(sLower) || sLower.includes(product.color.toLowerCase()));
        const matchesColorsArray = Array.isArray(product.colors) && product.colors.some(c => {
          const cName = (typeof c === 'string' ? c : c?.name || '').toLowerCase();
          return cName === sLower || cName.includes(sLower) || sLower.includes(cName);
        });
        if (!matchesDirectColor && !matchesColorsArray) return false;
      }

      // 9. Badge Filter (e.g. 'Limited Edition')
      if (selectedBadge !== 'All') {
        const bLower = selectedBadge.toLowerCase();
        let matchesBadge = false;
        if (bLower === 'limited edition' || bLower === 'limited') {
          matchesBadge = (product.badge && product.badge.toLowerCase().includes('limited')) ||
            product.isLimitedEdition === true ||
            (product.name && product.name.toLowerCase().includes('limited edition')) ||
            (product.subtitle && product.subtitle.toLowerCase().includes('limited edition'));
        } else {
          matchesBadge = (product.badge && (product.badge.toLowerCase() === bLower || product.badge.toLowerCase().includes(bLower)));
        }
        if (!matchesBadge) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return (b.rating || 5) - (a.rating || 5);
      return 0; // featured default
    });

    console.log(`[ShopPage] Filtered products: ${result.length} shown of ${PRODUCTS.length} total in catalog. Active filters:`, {
      selectedCategory,
      selectedStyleFilter,
      selectedWorkFilter,
      selectedShade,
      selectedBadge,
      searchQuery,
      maxPrice
    });

    return result;
  }, [
    PRODUCTS,
    searchQuery,
    selectedCategory,
    maxPrice,
    selectedStyleFilter,
    selectedWorkFilter,
    selectedWholesaleType,
    selectedSubcategory,
    selectedShade,
    selectedBadge,
    sortBy
  ]);

  const handleCategoryChange = (catId) => {
    if (catId === 'Limited Edition') {
      setSelectedCategory('All');
      if (setSelectedCategoryFilter) setSelectedCategoryFilter('All');
      setSelectedBadge('Limited Edition');
      if (setContextBadgeFilter) setContextBadgeFilter('Limited Edition');
      setSelectedStyleFilter('All');
      if (setContextStyleFilter) setContextStyleFilter('All');
      setSelectedWorkFilter('All');
      if (setContextWorkFilter) setContextWorkFilter('All');
      setSelectedWholesaleType('All');
      if (setContextWholesaleTypeFilter) setContextWholesaleTypeFilter('All');
      setSelectedSubcategory('All');
      if (setContextSubcategoryFilter) setContextSubcategoryFilter('All');
      setSelectedShade('All');
      if (setContextColorFilter) setContextColorFilter('All');
      return;
    }

    setSelectedCategory(catId);
    if (setSelectedCategoryFilter) setSelectedCategoryFilter(catId);
    setSelectedBadge('All');
    if (setContextBadgeFilter) setContextBadgeFilter('All');
    setSelectedStyleFilter('All');
    if (setContextStyleFilter) setContextStyleFilter('All');
    setSelectedWorkFilter('All');
    if (setContextWorkFilter) setContextWorkFilter('All');
    setSelectedWholesaleType('All');
    if (setContextWholesaleTypeFilter) setContextWholesaleTypeFilter('All');
    setSelectedSubcategory('All');
    if (setContextSubcategoryFilter) setContextSubcategoryFilter('All');
    setSelectedShade('All');
    if (setContextColorFilter) setContextColorFilter('All');
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    if (setSelectedCategoryFilter) setSelectedCategoryFilter('All');
    setSelectedStyleFilter('All');
    if (setContextStyleFilter) setContextStyleFilter('All');
    setSelectedWorkFilter('All');
    if (setContextWorkFilter) setContextWorkFilter('All');
    setSelectedWholesaleType('All');
    if (setContextWholesaleTypeFilter) setContextWholesaleTypeFilter('All');
    setSelectedSubcategory('All');
    if (setContextSubcategoryFilter) setContextSubcategoryFilter('All');
    setSelectedShade('All');
    if (setContextColorFilter) setContextColorFilter('All');
    setSelectedBadge('All');
    if (setContextBadgeFilter) setContextBadgeFilter('All');
    setMaxPrice(maxPriceLimit);
  };

  const isFiltered =
    selectedCategory !== 'All' ||
    selectedStyleFilter !== 'All' ||
    selectedWorkFilter !== 'All' ||
    selectedWholesaleType !== 'All' ||
    selectedSubcategory !== 'All' ||
    selectedShade !== 'All' ||
    selectedBadge !== 'All' ||
    maxPrice < maxPriceLimit ||
    Boolean(searchQuery.trim());

  const secondaryFiltersActiveCount =
    (selectedStyleFilter !== 'All' ? 1 : 0) +
    (selectedWorkFilter !== 'All' ? 1 : 0) +
    (selectedWholesaleType !== 'All' ? 1 : 0) +
    (selectedSubcategory !== 'All' ? 1 : 0) +
    (selectedShade !== 'All' ? 1 : 0) +
    (selectedBadge !== 'All' ? 1 : 0) +
    (maxPrice < maxPriceLimit ? 1 : 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6 sm:space-y-8 font-sans">
      
      {/* 1. Header Bar: Title, Count, and Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase font-bold text-[#7A0648]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>NOOR AL DHUHA ATELIER CATALOG</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#1E141B] font-bold tracking-tight uppercase mt-1">
            {selectedBadge !== 'All' 
              ? `${selectedBadge} Collection`
              : (selectedCategory === 'All' ? 'All Modest Collections' : selectedCategory)}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 font-medium">
            Showing {filteredProducts.length} curated luxury pieces with bespoke sizing & global courier.
          </p>
        </div>

        {/* Search Input on Shop Page */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search catalog..."
            className="w-full bg-stone-100 border border-stone-200 pl-9 pr-8 py-2 text-xs font-semibold uppercase tracking-wider text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#7A0648] focus:bg-white transition-all rounded-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 2. Primary Category Tabs (All Categories) */}
      <div className="border-b border-stone-200 bg-white">
        <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar py-1 -mx-4 px-4 sm:mx-0 sm:px-0">
          {categoryTabs.map((tab) => {
            const isActive = tab.id === 'Limited Edition'
              ? (selectedBadge === 'Limited Edition')
              : (selectedCategory === tab.id && selectedBadge !== 'Limited Edition');
            return (
              <button
                key={tab.id}
                onClick={() => handleCategoryChange(tab.id)}
                className={`relative pb-3 text-xs uppercase tracking-wider font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'text-[#7A0648] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2.5px] after:bg-[#7A0648]'
                    : 'text-stone-600 hover:text-[#1E141B]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Contextual Sub-Filters Bar */}
      {/* 3.A: For Abaya (or All) — By Category Style & By Work */}
      {(selectedCategory === 'Abaya' || selectedCategory === 'All') && (
        <div className="bg-[#FAF8F5] border border-stone-200/80 p-4 sm:p-5 space-y-3.5 animate-fade-in">
          
          {/* Row 1: By Category Style */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-700 min-w-[130px] shrink-0">
              By Category Style:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => {
                  setSelectedStyleFilter('All');
                  if (setContextStyleFilter) setContextStyleFilter('All');
                }}
                className={`px-3 py-1 text-[11px] uppercase tracking-wider font-bold border transition-colors cursor-pointer ${
                  selectedStyleFilter === 'All'
                    ? 'bg-[#7A0648] text-white border-[#7A0648]'
                    : 'bg-white text-stone-700 border-stone-300 hover:border-stone-400'
                }`}
              >
                All Styles
              </button>
              {ABAYA_STYLES.map((style) => (
                <button
                  key={style.id}
                  onClick={() => {
                    const next = selectedStyleFilter === style.name ? 'All' : style.name;
                    setSelectedStyleFilter(next);
                    if (setContextStyleFilter) setContextStyleFilter(next);
                  }}
                  className={`px-3 py-1 text-[11px] uppercase tracking-wider font-bold border transition-colors cursor-pointer ${
                    selectedStyleFilter.toLowerCase() === style.name.toLowerCase()
                      ? 'bg-[#7A0648] text-white border-[#7A0648]'
                      : 'bg-white text-stone-700 border-stone-300 hover:border-stone-400'
                  }`}
                >
                  {style.name}
                </button>
              ))}
            </div>
          </div>

          {/* Row 2: By Work */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 pt-2 border-t border-stone-200/60">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-700 min-w-[130px] shrink-0">
              By Work:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => {
                  setSelectedWorkFilter('All');
                  if (setContextWorkFilter) setContextWorkFilter('All');
                }}
                className={`px-3 py-1 text-[11px] uppercase tracking-wider font-bold border transition-colors cursor-pointer ${
                  selectedWorkFilter === 'All'
                    ? 'bg-[#7A0648] text-white border-[#7A0648]'
                    : 'bg-white text-stone-700 border-stone-300 hover:border-stone-400'
                }`}
              >
                All Works
              </button>
              {ABAYA_WORKS.map((work) => (
                <button
                  key={work.id}
                  onClick={() => {
                    const next = selectedWorkFilter === work.name ? 'All' : work.name;
                    setSelectedWorkFilter(next);
                    if (setContextWorkFilter) setContextWorkFilter(next);
                  }}
                  className={`px-3 py-1 text-[11px] uppercase tracking-wider font-bold border transition-colors cursor-pointer capitalize ${
                    selectedWorkFilter.toLowerCase() === work.name.toLowerCase()
                      ? 'bg-[#7A0648] text-white border-[#7A0648]'
                      : 'bg-white text-stone-700 border-stone-300 hover:border-stone-400'
                  }`}
                >
                  {work.name}
                </button>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* 3.B: For Wholesale — Subtypes */}
      {selectedCategory === 'Wholesale' && (
        <div className="bg-[#FAF8F5] border border-[#FFD700]/40 p-4 sm:p-5 space-y-3 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-2.5">
            <div className="flex items-center gap-2">
              <PackageCheck className="w-4 h-4 text-[#7A0648]" />
              <span className="text-xs uppercase font-bold tracking-wider text-[#1E141B]">
                B2B Factory Wholesale & Master Carton Hub
              </span>
            </div>
            <button
              onClick={() => openWhatsApp('Salam / Hello! I would like to inquire about NOOR AL DHUHA Wholesale Catalog & Pricing.')}
              className="text-[11px] text-[#7A0648] hover:underline font-bold flex items-center gap-1 cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Inquire Custom Carton on WhatsApp</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-700 min-w-[130px] shrink-0">
              Wholesale Type:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => {
                  setSelectedWholesaleType('All');
                  if (setContextWholesaleTypeFilter) setContextWholesaleTypeFilter('All');
                }}
                className={`px-3 py-1 text-[11px] uppercase tracking-wider font-bold border transition-colors cursor-pointer ${
                  selectedWholesaleType === 'All'
                    ? 'bg-[#7A0648] text-white border-[#7A0648]'
                    : 'bg-white text-stone-700 border-stone-300 hover:border-stone-400'
                }`}
              >
                All Wholesale
              </button>
              {WHOLESALE_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => {
                    const next = selectedWholesaleType === type.name ? 'All' : type.name;
                    setSelectedWholesaleType(next);
                    if (setContextWholesaleTypeFilter) setContextWholesaleTypeFilter(next);
                  }}
                  className={`px-3 py-1 text-[11px] uppercase tracking-wider font-bold border transition-colors cursor-pointer ${
                    selectedWholesaleType.toLowerCase() === type.name.toLowerCase()
                      ? 'bg-[#7A0648] text-white border-[#7A0648]'
                      : 'bg-white text-stone-700 border-stone-300 hover:border-stone-400'
                  }`}
                >
                  {type.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}



      {/* 4. Controls Bar: Filter Drawer Trigger, Price Slider, Sort Dropdown & Grid Layout */}
      <div className="flex items-center justify-between gap-4 py-2 border-b border-stone-200 text-xs">
        
        {/* Left: Mobile/Desktop Filter Drawer Button */}
        <button
          onClick={() => setMobileFilterOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-900 font-bold uppercase tracking-wider cursor-pointer"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Faceted Filters</span>
          {secondaryFiltersActiveCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-[#7A0648] text-white text-[9px] flex items-center justify-center font-bold">
              {secondaryFiltersActiveCount}
            </span>
          )}
        </button>

        {/* Right: Sort Dropdown & Grid View Toggle */}
        <div className="flex items-center gap-3">
          
          {/* Sort Dropdown */}
          <div className="relative" ref={sortDropdownRef}>
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="flex items-center gap-1.5 px-3 py-2 border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 font-bold uppercase tracking-wider cursor-pointer text-xs"
            >
              <span className="text-stone-500 font-normal">Sort:</span>
              <span>{currentSortLabel}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
            </button>

            {isSortOpen && (
              <div className="absolute right-0 mt-1 w-44 bg-white border border-stone-200 shadow-xl py-1 z-30 animate-fade-in font-semibold">
                {sortOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setSortBy(opt.id);
                      setIsSortOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between cursor-pointer ${
                      sortBy === opt.id ? 'bg-stone-100 text-[#7A0648] font-bold' : 'text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {sortBy === opt.id && <Check className="w-3.5 h-3.5 text-[#7A0648]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Grid Layout Toggle for Mobile */}
          <div className="sm:hidden flex items-center border border-stone-300">
            <button
              onClick={() => setMobileGridCols(1)}
              className={`p-1.5 ${mobileGridCols === 1 ? 'bg-[#7A0648] text-white' : 'text-stone-600 bg-white'}`}
              aria-label="Single column view"
            >
              <Square className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileGridCols(2)}
              className={`p-1.5 ${mobileGridCols === 2 ? 'bg-[#7A0648] text-white' : 'text-stone-600 bg-white'}`}
              aria-label="Two column view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

      {/* 5. Active Filter Tags (if any active) */}
      {isFiltered && (
        <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-stone-200">
          <span className="text-[10px] uppercase tracking-wider font-bold text-stone-500 mr-1">
            Active:
          </span>

          {searchQuery && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-none bg-white border border-stone-300 text-[11px] text-[#7A0648] font-bold shadow-xs">
              "{searchQuery}"
              <button onClick={() => setSearchQuery('')} className="hover:text-red-600 p-0.5 cursor-pointer">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedCategory !== 'All' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-none bg-white border border-stone-300 text-[11px] text-[#7A0648] font-bold shadow-xs">
              Cat: {selectedCategory}
              <button onClick={() => handleCategoryChange('All')} className="hover:text-red-600 p-0.5 cursor-pointer">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedStyleFilter !== 'All' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-none bg-white text-[#7A0648] border border-stone-300 text-[11px] font-bold shadow-xs">
              Style: {selectedStyleFilter}
              <button onClick={() => setSelectedStyleFilter('All')} className="hover:text-red-600 p-0.5 cursor-pointer">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedWorkFilter !== 'All' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-none bg-white text-[#7A0648] border border-stone-300 text-[11px] font-bold shadow-xs capitalize">
              Work: {selectedWorkFilter}
              <button onClick={() => setSelectedWorkFilter('All')} className="hover:text-red-600 p-0.5 cursor-pointer">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedWholesaleType !== 'All' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-none bg-white text-[#7A0648] border border-stone-300 text-[11px] font-bold shadow-xs">
              Wholesale: {selectedWholesaleType}
              <button onClick={() => setSelectedWholesaleType('All')} className="hover:text-red-600 p-0.5 cursor-pointer">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedShade !== 'All' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-none bg-white border border-stone-300 text-[11px] text-[#7A0648] font-bold shadow-xs">
              Shade: {selectedShade}
              <button onClick={() => setSelectedShade('All')} className="hover:text-red-600 p-0.5 cursor-pointer">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedBadge !== 'All' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-none bg-[#7A0648] text-white border border-[#7A0648] text-[11px] font-bold shadow-xs">
              Edition: {selectedBadge}
              <button 
                onClick={() => {
                  setSelectedBadge('All');
                  if (setContextBadgeFilter) setContextBadgeFilter('All');
                }} 
                className="hover:text-amber-200 p-0.5 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          <button
            onClick={resetFilters}
            className="text-[11px] text-stone-500 hover:text-stone-900 underline font-bold ml-2 cursor-pointer"
          >
            Clear All
          </button>
        </div>
      )}

      {/* 6. Products Grid Showcase */}
      {filteredProducts.length > 0 ? (
        <div className={`grid gap-4 sm:gap-6 lg:gap-8 ${
          mobileGridCols === 1 ? 'grid-cols-1' : 'grid-cols-2'
        } sm:grid-cols-3 lg:grid-cols-4`}>
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-stone-50 border border-stone-200 p-8 space-y-4">
          <p className="text-stone-600 font-serif text-lg uppercase tracking-wider">
            No products matched your exact filter combination.
          </p>
          <button
            onClick={resetFilters}
            className="px-6 py-2.5 bg-[#7A0648] text-white text-xs uppercase font-bold tracking-wider hover:bg-[#68043D] transition-colors cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      )}

      {/* 7. Faceted Filter Modal / Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileFilterOpen(false)}
          />

          <div className="fixed inset-x-0 bottom-0 max-h-[85vh] bg-white text-[#1E141B] rounded-t-3xl shadow-2xl flex flex-col z-10 animate-slide-in-up border-t border-stone-200 font-semibold">
            
            <div className="w-12 h-1.5 bg-stone-300 rounded-full mx-auto mt-3 mb-1" />

            <div className="flex items-center justify-between px-5 py-3.5 border-b border-stone-200 bg-[#7A0648] text-white">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-white" />
                <h3 className="font-serif text-lg font-bold text-white uppercase tracking-wider">Atelier Filters</h3>
              </div>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1.5 rounded-full text-white hover:bg-white/15 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Tabs in Drawer */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar px-4 py-2 border-b border-stone-200 bg-[#FAF8F5]">
              {[
                { id: 'category', label: 'Categories' },
                { id: 'style', label: 'By Category Style' },
                { id: 'work', label: 'By Work' },
                { id: 'wholesale', label: 'Wholesale' },
                { id: 'shade', label: 'Colors' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveDrawerTab(tab.id)}
                  className={`px-3.5 py-1.5 rounded-none text-xs font-bold shrink-0 transition-all uppercase tracking-wider cursor-pointer ${
                    activeDrawerTab === tab.id
                      ? 'bg-[#7A0648] text-white shadow-xs'
                      : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Drawer Body Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 text-[#1E141B]">
              
              {/* Category */}
              {activeDrawerTab === 'category' && (
                <div className="space-y-2.5 animate-fade-in">
                  <div className="grid grid-cols-1 gap-2">
                    {categoryTabs.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => handleCategoryChange(cat.id)}
                        className={`p-3 text-xs font-semibold rounded-none text-left border flex items-center justify-between transition-all cursor-pointer ${
                          selectedCategory === cat.id
                            ? 'bg-[#F5EAF1] text-[#7A0648] border-[#7A0648] font-bold'
                            : 'bg-white text-stone-800 border-stone-200 hover:bg-stone-50'
                        }`}
                      >
                        <span>{cat.label}</span>
                        {selectedCategory === cat.id && <Check className="w-4 h-4 text-[#7A0648]" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Styles */}
              {activeDrawerTab === 'style' && (
                <div className="space-y-2.5 animate-fade-in">
                  <div className="grid grid-cols-1 gap-2">
                    <button
                      onClick={() => setSelectedStyleFilter('All')}
                      className={`p-3 text-xs font-semibold rounded-none text-left border flex items-center justify-between cursor-pointer ${
                        selectedStyleFilter === 'All' ? 'bg-[#F5EAF1] text-[#7A0648] border-[#7A0648] font-bold' : 'bg-white'
                      }`}
                    >
                      <span>All Styles</span>
                      {selectedStyleFilter === 'All' && <Check className="w-4 h-4 text-[#7A0648]" />}
                    </button>
                    {ABAYA_STYLES.map((style) => (
                      <button
                        key={style.id}
                        onClick={() => setSelectedStyleFilter(style.name)}
                        className={`p-3 text-xs font-semibold rounded-none text-left border flex items-center justify-between cursor-pointer ${
                          selectedStyleFilter.toLowerCase() === style.name.toLowerCase() ? 'bg-[#F5EAF1] text-[#7A0648] border-[#7A0648] font-bold' : 'bg-white'
                        }`}
                      >
                        <div>
                          <div className="font-bold">{style.name}</div>
                          <div className="text-[10px] text-stone-500">{style.description}</div>
                        </div>
                        {selectedStyleFilter.toLowerCase() === style.name.toLowerCase() && <Check className="w-4 h-4 text-[#7A0648]" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Works */}
              {activeDrawerTab === 'work' && (
                <div className="space-y-2.5 animate-fade-in">
                  <div className="grid grid-cols-1 gap-2">
                    <button
                      onClick={() => setSelectedWorkFilter('All')}
                      className={`p-3 text-xs font-semibold rounded-none text-left border flex items-center justify-between cursor-pointer ${
                        selectedWorkFilter === 'All' ? 'bg-[#F5EAF1] text-[#7A0648] border-[#7A0648] font-bold' : 'bg-white'
                      }`}
                    >
                      <span>All Works</span>
                      {selectedWorkFilter === 'All' && <Check className="w-4 h-4 text-[#7A0648]" />}
                    </button>
                    {ABAYA_WORKS.map((work) => (
                      <button
                        key={work.id}
                        onClick={() => setSelectedWorkFilter(work.name)}
                        className={`p-3 text-xs font-semibold rounded-none text-left border flex items-center justify-between cursor-pointer capitalize ${
                          selectedWorkFilter.toLowerCase() === work.name.toLowerCase() ? 'bg-[#F5EAF1] text-[#7A0648] border-[#7A0648] font-bold' : 'bg-white'
                        }`}
                      >
                        <div>
                          <div className="font-bold">{work.name}</div>
                          <div className="text-[10px] text-stone-500">{work.description}</div>
                        </div>
                        {selectedWorkFilter.toLowerCase() === work.name.toLowerCase() && <Check className="w-4 h-4 text-[#7A0648]" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Wholesale */}
              {activeDrawerTab === 'wholesale' && (
                <div className="space-y-2.5 animate-fade-in">
                  <div className="grid grid-cols-1 gap-2">
                    {WHOLESALE_TYPES.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setSelectedWholesaleType(type.name)}
                        className={`p-3 text-xs font-semibold rounded-none text-left border flex items-center justify-between cursor-pointer ${
                          selectedWholesaleType === type.name ? 'bg-[#F5EAF1] text-[#7A0648] border-[#7A0648] font-bold' : 'bg-white'
                        }`}
                      >
                        <div>
                          <div className="font-bold">Wholesale {type.name}</div>
                          <div className="text-[10px] text-stone-500">{type.description}</div>
                        </div>
                        {selectedWholesaleType === type.name && <Check className="w-4 h-4 text-[#7A0648]" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Colors */}
              {activeDrawerTab === 'shade' && (
                <div className="grid grid-cols-2 gap-2 animate-fade-in">
                  {shades.map((shade) => (
                    <button
                      key={shade.name}
                      onClick={() => setSelectedShade(shade.name)}
                      className={`p-3 rounded-none border flex items-center gap-2.5 text-xs font-bold cursor-pointer ${
                        selectedShade === shade.name ? 'bg-[#F5EAF1] text-[#7A0648] border-[#7A0648]' : 'bg-white'
                      }`}
                    >
                      {shade.hex ? (
                        <span className="w-4 h-4 rounded-full border shrink-0" style={{ backgroundColor: shade.hex }} />
                      ) : (
                        <span className="w-4 h-4 rounded-full bg-gradient-to-tr from-amber-200 to-indigo-400 shrink-0" />
                      )}
                      <span>{shade.name}</span>
                    </button>
                  ))}
                </div>
              )}

            </div>

            {/* Footer */}
            <div className="p-4 border-t border-stone-200 bg-[#FAF8F5] flex items-center gap-3">
              <button
                onClick={resetFilters}
                className="flex-1 py-3 border border-stone-300 text-stone-700 text-xs uppercase tracking-wider font-bold rounded-none hover:bg-stone-100"
              >
                Reset All
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-[2] py-3 bg-[#7A0648] text-white text-xs uppercase tracking-wider font-bold rounded-none shadow-md hover:bg-[#68043D]"
              >
                View {filteredProducts.length} Items
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
