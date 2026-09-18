import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  ShoppingBag,
  Menu,
  X,
  Plus,
  Minus,
  ChevronDown,
  Sparkles,
  Star,
  Award,
  Crown,
  Gift,
  Phone,
  HelpCircle,
  Info,
  User,
  ShieldCheck,
  Truck
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { openWhatsApp, WHATSAPP_PHONE_DISPLAY } from '../utils/whatsapp';
import brandLogo from '../assets/logo.png';
import { MAIN_CATEGORIES, ABAYA_STYLES, ABAYA_WORKS, WHOLESALE_TYPES } from '../data/products';

export default function Navbar() {
  const {
    currentView,
    navigateTo,
    cart,
    isCartOpen,
    setIsCartOpen,
    isSearchOpen,
    setIsSearchOpen,
    searchQuery,
    setSearchQuery,
    selectedBadgeFilter,
    adminEnabled,
    PRODUCTS
  } = useShop();

  const [searchTerm, setSearchTerm] = useState('');
  const searchInputRef = useRef(null);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const shopMenuRef = useRef(null);

  // Dynamic catalog-aware categories
  const dynamicCategories = React.useMemo(() => {
    const baseCats = [
      { id: 'Abaya', name: 'Abaya' },
      { id: 'Shaila/Shawl', name: 'Shaila / Shawl' },
      { id: 'Hijab', name: 'Hijab, Niqab & Gloves' },
      { id: 'Inner & Prayer dress', name: 'Inner & Prayer Dress' },
      { id: 'Kids abaya', name: 'Kids Abaya' },
    ];
    if (Array.isArray(PRODUCTS)) {
      PRODUCTS.forEach(p => {
        if (p.category && !baseCats.some(c => c.id.toLowerCase() === p.category.toLowerCase()) && p.category.toLowerCase() !== 'wholesale') {
          baseCats.push({ id: p.category, name: p.category });
        }
      });
    }
    return baseCats;
  }, [PRODUCTS]);

  // Complete Abaya Styles (all 7 silhouettes + catalog custom)
  const allStyles = React.useMemo(() => {
    const list = [...ABAYA_STYLES];
    if (Array.isArray(PRODUCTS)) {
      PRODUCTS.forEach(p => {
        if (p.defaultStyle && !list.some(s => s.name.toLowerCase() === p.defaultStyle.toLowerCase())) {
          list.push({ id: p.defaultStyle.toLowerCase().replace(/\s+/g, '-'), name: p.defaultStyle });
        }
      });
    }
    return list;
  }, [PRODUCTS]);

  // Complete Artisan Works (all 7 craftsmanship works + catalog custom)
  const allWorks = React.useMemo(() => {
    const list = [...ABAYA_WORKS];
    if (Array.isArray(PRODUCTS)) {
      PRODUCTS.forEach(p => {
        if (p.defaultWork && !list.some(w => w.name.toLowerCase() === p.defaultWork.toLowerCase())) {
          list.push({ id: p.defaultWork.toLowerCase().replace(/\s+/g, '-'), name: p.defaultWork });
        }
      });
    }
    return list;
  }, [PRODUCTS]);

  // Complete Wholesale Types (all 6 types + catalog custom)
  const allWholesaleTypes = React.useMemo(() => {
    const list = [...WHOLESALE_TYPES];
    if (Array.isArray(PRODUCTS)) {
      PRODUCTS.forEach(p => {
        if (p.wholesaleType && !list.some(wt => (wt.name || wt).toLowerCase() === p.wholesaleType.toLowerCase())) {
          list.push({ id: p.wholesaleType.toLowerCase().replace(/\s+/g, '-'), name: p.wholesaleType });
        }
      });
    }
    return list;
  }, [PRODUCTS]);
  const [openAccordions, setOpenAccordions] = useState({
    category: true,
    work: false,
    wholesale: false,
    help: false
  });
  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Sync search input when opened and autofocus
  useEffect(() => {
    if (isSearchOpen) {
      setSearchTerm(searchQuery || '');
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 50);
    }
  }, [isSearchOpen, searchQuery]);

  // Handle ESC key to close search & menus
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (isSearchOpen) setIsSearchOpen(false);
        if (shopDropdownOpen) setShopDropdownOpen(false);
        if (mobileMenuOpen) setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, shopDropdownOpen, mobileMenuOpen, setIsSearchOpen]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const cleanTerm = searchTerm.trim();
    setSearchQuery(cleanTerm);
    setIsSearchOpen(false);
    navigateTo('shop', null, null, null, null, null, null, false, cleanTerm);
  };

  // Prevent background scrolling when menu drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutside = (e) => {
      if (shopMenuRef.current && !shopMenuRef.current.contains(e.target)) {
        setShopDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const toggleAccordion = (key) => {
    setOpenAccordions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleNav = (view, category = null, collectionsTab = null, color = null, style = null, work = null, wishlistOnly = false, search = null, subcategory = null, wholesaleType = null, badge = null) => {
    console.log('[Navbar] handleNav triggered:', { view, category, collectionsTab, color, style, work, subcategory, wholesaleType, badge });
    navigateTo(view, null, category, collectionsTab, color, style, work, wishlistOnly, search, subcategory, wholesaleType, badge);
    setMobileMenuOpen(false);
    setShopDropdownOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 w-full z-[60] bg-[#7A0648]/95 backdrop-blur-md border-b border-white/20 transition-all duration-300 text-white font-semibold">
        <div className="flex justify-between items-center px-4 sm:px-6 lg:px-8 py-3.5 md:py-4 max-w-7xl mx-auto relative">
          
          {/* Left: Desktop Navigation Links + Full-Screen Drawer Trigger */}
          <div className="flex items-center gap-3 sm:gap-6 lg:gap-7 z-10 shrink-0">
            <button
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open Navigation Menu"
              className="text-white focus:outline-none p-1.5 -ml-1 hover:bg-white/10 transition-colors flex items-center gap-2 group cursor-pointer"
            >
              <Menu className="w-5 h-5 text-white transition-transform group-hover:scale-110" strokeWidth={1.5} />
              <span className="text-[11px] font-bold tracking-[0.14em] uppercase">Menu</span>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-7 text-[12px] font-medium tracking-[0.08em] uppercase">
              <button
                onClick={() => {
                  setOpenAccordions(prev => ({ ...prev, category: true }));
                  setMobileMenuOpen(true);
                }}
                className={`transition-colors py-1 relative cursor-pointer ${
                  currentView === 'shop' && selectedBadgeFilter !== 'Limited Edition' ? 'text-white font-semibold' : 'text-white/85 hover:text-white'
                }`}
              >
                <span>Shop</span>
                {currentView === 'shop' && selectedBadgeFilter !== 'Limited Edition' && (
                  <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-white" />
                )}
              </button>

              <button
                onClick={() => handleNav('collections')}
                className={`transition-colors py-1 relative cursor-pointer ${
                  currentView === 'collections' ? 'text-white font-semibold' : 'text-white/85 hover:text-white'
                }`}
              >
                Collections
                {currentView === 'collections' && (
                  <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-white" />
                )}
              </button>

              <button
                onClick={() => handleNav('story')}
                className={`transition-colors py-1 relative cursor-pointer ${
                  currentView === 'story' ? 'text-white font-semibold' : 'text-white/85 hover:text-white'
                }`}
              >
                Our Story
                {currentView === 'story' && (
                  <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-white" />
                )}
              </button>

              <button
                onClick={() => handleNav('contact')}
                className={`transition-colors py-1 relative cursor-pointer ${
                  currentView === 'contact' ? 'text-white font-semibold' : 'text-white/85 hover:text-white'
                }`}
              >
                Contact
                {currentView === 'contact' && (
                  <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-white" />
                )}
              </button>
            </nav>
          </div>

          {/* Center: Brand Name */}
          <div className="absolute left-1/2 -translate-x-1/2 text-center flex items-center group cursor-pointer z-20">
            <button
              onClick={() => handleNav('home')}
              className="flex items-center focus:outline-none"
              aria-label="NOOR AL DHUHA - Home"
            >
              <span className="text-sm sm:text-base md:text-lg font-semibold tracking-[0.18em] text-white uppercase whitespace-nowrap transition-transform duration-300 group-hover:scale-105 drop-shadow-xs">
                NOOR AL DHUHA
              </span>
            </button>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 sm:gap-3.5 text-white z-10 shrink-0">
            {/* Search Icon */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              aria-label="Search"
              className={`p-1.5 transition-colors cursor-pointer text-white ${
                isSearchOpen ? 'text-[#FFF0A0]' : 'hover:text-white/80'
              }`}
            >
              <Search className="w-4.5 h-4.5" strokeWidth={1.5} />
            </button>

            {/* Admin Portal Button */}
            {adminEnabled && (
              <button
                onClick={() => handleNav('admin')}
                aria-label="Admin Portal"
                title="Admin Portal"
                className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-none border border-white/40 text-white hover:bg-white hover:text-[#7A0648] text-[11px] font-bold tracking-wider uppercase transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" strokeWidth={1.5} />
                <span>Admin</span>
              </button>
            )}
            
            {/* Shopping Bag */}
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label="Shopping Bag"
              className="text-white hover:text-white/80 transition-colors p-1.5 relative cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-1.5 bg-white text-[#7A0648] text-[10px] min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center font-bold shadow-sm leading-none">
                  {totalCartCount}
                </span>
              )}
            </button>
          </div>

        </div>

        {/* Top Search Bar Directly Under the Top Section */}
        {isSearchOpen && (
          <div className="w-full border-t border-white/20 bg-[#7A0648] animate-fade-in shadow-md">
            <form
              onSubmit={handleSearchSubmit}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4 flex items-center gap-3 sm:gap-4"
            >
              {/* Left Search Icon */}
              <button
                type="submit"
                aria-label="Search"
                className="text-white hover:opacity-70 transition-opacity p-0.5 cursor-pointer shrink-0"
              >
                <Search className="w-5 h-5 text-white" strokeWidth={1.5} />
              </button>

              {/* Search Input */}
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="SEARCH FOR ABAYAS, HIJABS, SHAWLS, WHOLESALE..."
                className="w-full bg-transparent text-sm sm:text-base text-white placeholder-white/70 font-medium tracking-[0.08em] uppercase focus:outline-none"
                aria-label="Search abayas and collections"
              />

              {/* Clear button if text typed */}
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    searchInputRef.current?.focus();
                  }}
                  className="p-1 text-white/80 hover:text-white transition-colors cursor-pointer"
                  title="Clear input"
                  aria-label="Clear search input"
                >
                  <X className="w-4 h-4" strokeWidth={1.5} />
                </button>
              )}

              {/* Close button */}
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="p-1 text-white hover:opacity-60 transition-opacity cursor-pointer shrink-0 ml-1"
                title="Close search"
                aria-label="Close search"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.5} />
              </button>
            </form>
          </div>
        )}
      </header>

      {/* Backdrop below the fixed top header when search is open */}
      {isSearchOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-40 animate-fade-in"
          onClick={() => setIsSearchOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ========================================================================= */}
      {/* FULL LUXURY NAVIGATION DRAWER (Logo Violet Edition - All Screens) */}
      {/* ========================================================================= */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[70] flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-fade-in cursor-pointer"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative flex flex-col w-[85%] sm:w-[380px] md:w-[420px] max-w-md bg-[#68043D] text-white h-full shadow-2xl z-10 overflow-hidden animate-slide-in-left border-r border-white/20 font-semibold">
            
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/20 bg-[#7A0648]">
              <button
                onClick={() => { handleNav('home'); setMobileMenuOpen(false); }}
                className="flex items-center gap-2.5 text-left focus:outline-none"
                aria-label="Go to Home"
              >
                <img
                  src={brandLogo}
                  alt="NOOR AL DHUHA Logo"
                  className="h-9 w-auto object-contain brightness-200"
                />
                <div className="flex flex-col">
                  <span className="font-serif text-sm sm:text-base tracking-[0.16em] font-semibold text-white leading-tight">
                    NOOR AL DHUHA
                  </span>
                  <span className="text-[7px] tracking-[0.28em] text-white/80 uppercase font-light">
                    DUBAI HAUTE COUTURE
                  </span>
                </div>
              </button>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-full text-white hover:bg-white/15 transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Navigation Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5 divide-y divide-white/20 text-sm">
              
              {/* Accordion: SHOP BY CATEGORY (Abaya Silhouettes) */}
              <div className="pt-1">
                <button
                  onClick={() => toggleAccordion('category')}
                  className="w-full flex items-center justify-between text-left text-xs uppercase tracking-wider font-semibold text-white py-1 hover:text-white/80 transition-colors cursor-pointer"
                >
                  <span>Shop by Category</span>
                  {openAccordions.category ? (
                    <Minus className="w-4 h-4 text-white" strokeWidth={1.5} />
                  ) : (
                    <Plus className="w-4 h-4 text-white" strokeWidth={1.5} />
                  )}
                </button>

                {openAccordions.category && (
                  <div className="mt-2.5 pl-3 space-y-2 border-l border-white/30 animate-fade-in">
                    {allStyles.map((style) => (
                      <button
                        key={style.id}
                        onClick={() => handleNav('shop', 'Abaya', null, null, style.name)}
                        className="block w-full text-left py-1 text-xs text-white/85 hover:text-white transition-colors uppercase tracking-wide cursor-pointer"
                      >
                        {style.name}
                      </button>
                    ))}
                    <button
                      onClick={() => handleNav('shop', 'Abaya')}
                      className="block w-full text-left py-1 text-xs text-white font-bold hover:text-white/80 transition-colors uppercase tracking-wide cursor-pointer"
                    >
                      View All Abayas
                    </button>
                  </div>
                )}
              </div>

              {/* Accordion: SHOP BY WORK */}
              <div className="pt-4">
                <button
                  onClick={() => toggleAccordion('work')}
                  className="w-full flex items-center justify-between text-left text-xs uppercase tracking-wider font-semibold text-white py-1 hover:text-white/80 transition-colors cursor-pointer"
                >
                  <span>Shop by Work</span>
                  {openAccordions.work ? (
                    <Minus className="w-4 h-4 text-white" strokeWidth={1.5} />
                  ) : (
                    <Plus className="w-4 h-4 text-white" strokeWidth={1.5} />
                  )}
                </button>

                {openAccordions.work && (
                  <div className="mt-2.5 pl-3 space-y-2 border-l border-white/30 animate-fade-in">
                    {allWorks.map((work) => (
                      <button
                        key={work.id}
                        onClick={() => handleNav('shop', 'Abaya', null, null, null, work.name)}
                        className="block w-full text-left py-1 text-xs text-white/85 hover:text-white transition-colors uppercase tracking-wide cursor-pointer"
                      >
                        {work.name}
                      </button>
                    ))}
                    <button
                      onClick={() => handleNav('collections')}
                      className="block w-full text-left py-1 text-xs text-white font-bold hover:text-white/80 transition-colors uppercase tracking-wide cursor-pointer"
                    >
                      View All Work Styles
                    </button>
                  </div>
                )}
              </div>

              {/* DYNAMIC & MAIN CATEGORIES */}
              {dynamicCategories.map((cat) => (
                <div key={cat.id} className="pt-4">
                  <button
                    onClick={() => handleNav('shop', cat.id)}
                    className="w-full flex items-center justify-between text-left text-xs uppercase tracking-wider font-semibold text-white py-1 hover:text-white/80 transition-colors cursor-pointer"
                  >
                    <span>{cat.name}</span>
                  </button>
                </div>
              ))}

              {/* Accordion: WHOLESALE */}
              <div className="pt-4">
                <button
                  onClick={() => toggleAccordion('wholesale')}
                  className="w-full flex items-center justify-between text-left text-xs uppercase tracking-wider font-semibold text-white py-1 hover:text-white/80 transition-colors cursor-pointer"
                >
                  <span>Wholesale (B2B Hub)</span>
                  {openAccordions.wholesale ? (
                    <Minus className="w-4 h-4 text-white" strokeWidth={1.5} />
                  ) : (
                    <Plus className="w-4 h-4 text-white" strokeWidth={1.5} />
                  )}
                </button>

                {openAccordions.wholesale && (
                  <div className="mt-2.5 pl-3 space-y-2 border-l border-white/30 animate-fade-in">
                    {allWholesaleTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => handleNav('shop', 'Wholesale', null, null, null, null, false, null, null, type.name)}
                        className="block w-full text-left py-1 text-xs text-white/85 hover:text-white transition-colors uppercase tracking-wide cursor-pointer"
                      >
                        Wholesale {type.name}
                      </button>
                    ))}
                    <button
                      onClick={() => handleNav('shop', 'Wholesale')}
                      className="block w-full text-left py-1 text-xs text-white font-bold hover:text-white/80 transition-colors uppercase tracking-wide cursor-pointer"
                    >
                      Explore Full Wholesale Hub
                    </button>
                  </div>
                )}
              </div>

              {/* LIMITED EDITION */}
              <div className="pt-4">
                <button
                  onClick={() => handleNav('shop', null, null, null, null, null, false, null, null, null, 'Limited Edition')}
                  className="w-full flex items-center justify-between text-left text-xs uppercase tracking-wider font-semibold text-white py-1 hover:text-white/80 transition-colors cursor-pointer"
                >
                  <span>Limited Edition</span>
                </button>
              </div>

              {/* COLLECTIONS */}
              <div className="pt-4">
                <button
                  onClick={() => handleNav('collections')}
                  className="w-full flex items-center justify-between text-left text-xs uppercase tracking-wider font-semibold text-white py-1 hover:text-white/80 transition-colors cursor-pointer"
                >
                  <span>Collections</span>
                </button>
              </div>

              {/* OUR STORY */}
              <div className="pt-4">
                <button
                  onClick={() => handleNav('story')}
                  className="w-full flex items-center justify-between text-left text-xs uppercase tracking-wider font-semibold text-white py-1 hover:text-white/80 transition-colors cursor-pointer"
                >
                  <span>Our Story</span>
                </button>
              </div>

              {/* CONTACT */}
              <div className="pt-4">
                <button
                  onClick={() => handleNav('contact')}
                  className="w-full flex items-center justify-between text-left text-xs uppercase tracking-wider font-semibold text-white py-1 hover:text-white/80 transition-colors cursor-pointer"
                >
                  <span>Contact</span>
                </button>
              </div>

              {/* HELP CENTER */}
              <div className="pt-4 pb-2">
                <button
                  onClick={() => toggleAccordion('help')}
                  className="w-full flex items-center justify-between text-left text-xs uppercase tracking-wider font-semibold text-white py-1 hover:text-white/80 transition-colors"
                >
                  <span>Help Center & Concierge</span>
                  {openAccordions.help ? (
                    <Minus className="w-4 h-4 text-white" strokeWidth={1.5} />
                  ) : (
                    <Plus className="w-4 h-4 text-white" strokeWidth={1.5} />
                  )}
                </button>

                {openAccordions.help && (
                  <div className="mt-2.5 pl-3 space-y-2 border-l border-white/30 animate-fade-in text-xs text-white/85">
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        openWhatsApp('Salam / Hello! I would like to speak with the NOOR AL DHUHA Atelier concierge.');
                      }}
                      className="block w-full text-left py-1 hover:text-white transition-colors uppercase tracking-wide"
                    >
                      WhatsApp Concierge ({WHATSAPP_PHONE_DISPLAY})
                    </button>
                    <button
                      onClick={() => handleNav('offers')}
                      className="block w-full text-left py-1 hover:text-white transition-colors uppercase tracking-wide"
                    >
                      Atelier Privileges & Gifting
                    </button>
                    <button
                      onClick={() => handleNav('refund-policy')}
                      className="block w-full text-left py-1 hover:text-white transition-colors uppercase tracking-wide"
                    >
                      Returns & Exchanges Policy
                    </button>
                    <button
                      onClick={() => handleNav('terms')}
                      className="block w-full text-left py-1 hover:text-white transition-colors uppercase tracking-wide"
                    >
                      Terms of Service & Privacy
                    </button>
                  </div>
                )}
              </div>

            </div>

            {/* Drawer Footer: Account & Currency Selector */}
            <div className="p-6 bg-[#580233] border-t border-white/20 space-y-4 text-white font-semibold">
              
              {/* Quick Links */}
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-white">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsSearchOpen(true);
                  }}
                  className="hover:text-white/80 transition-colors flex items-center gap-1.5 py-1"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Search Catalog</span>
                </button>
                {adminEnabled && (
                  <button
                    onClick={() => handleNav('admin')}
                    className="text-white font-bold hover:text-white/80 transition-colors flex items-center gap-1.5 py-1"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Admin</span>
                  </button>
                )}
              </div>

              <div className="text-[10px] text-white/80 text-center font-light leading-snug">
                Complimentary luxury keepsake box & bespoke atelier craftsmanship.
              </div>

            </div>

          </div>
        </div>
      )}
    </>
  );
}

