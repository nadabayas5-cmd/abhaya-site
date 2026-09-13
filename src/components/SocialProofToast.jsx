import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle2, X, Sparkles, ShoppingBag } from 'lucide-react';
import { useShop } from '../context/ShopContext';

// Authentic UAE Locations & Neighborhoods
const UAE_LOCATIONS = [
  'Dubai',
  'Downtown Dubai',
  'Jumeirah, Dubai',
  'Dubai Marina',
  'Palm Jumeirah',
  'Al Barsha, Dubai',
  'Mirdif, Dubai',
  'Abu Dhabi',
  'Al Khalidiya, Abu Dhabi',
  'Al Reem Island, Abu Dhabi',
  'Corniche, Abu Dhabi',
  'Sharjah',
  'Al Majaz, Sharjah',
  'Muwaileh, Sharjah',
  'Ajman',
  'Al Ain',
  'Ras Al Khaimah',
  'Fujairah',
  'Umm Al Quwain',
];

// Popular customer names in the UAE
const BUYER_NAMES = [
  'Fatima',
  'Mariam',
  'Sara',
  'Noora',
  'Aisha',
  'Latifa',
  'Hessa',
  'Reem',
  'Shamsa',
  'Mahra',
  'Alyazia',
  'Salama',
  'Amna',
  'Khawla',
  'Rawdha',
  'Maitha',
  'Hind',
  'Dana',
  'Meera',
  'Laila',
];

const TIME_AGO = [
  'Just now',
  '2 mins ago',
  '4 mins ago',
  '6 mins ago',
  '11 mins ago',
  '17 mins ago',
  '24 mins ago',
  '32 mins ago',
];

export default function SocialProofToast() {
  const { allProducts, PRODUCTS, formatPrice, navigateTo } = useShop();
  const location = useLocation();
  const navigate = useNavigate();

  const [currentNotification, setCurrentNotification] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const timerRef = useRef(null);
  const hideTimerRef = useRef(null);
  const lastProductIndexRef = useRef(-1);

  // Pool of available products
  const productList = (PRODUCTS && PRODUCTS.length > 0) ? PRODUCTS : (allProducts || []);

  const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const showNextNotification = () => {
    if (!productList || productList.length === 0) return;

    // Pick a different product than the last one
    let nextIdx = Math.floor(Math.random() * productList.length);
    if (productList.length > 1 && nextIdx === lastProductIndexRef.current) {
      nextIdx = (nextIdx + 1) % productList.length;
    }
    lastProductIndexRef.current = nextIdx;

    const product = productList[nextIdx];
    if (!product) return;

    const name = getRandomItem(BUYER_NAMES);
    const uaeLocation = getRandomItem(UAE_LOCATIONS);
    const time = getRandomItem(TIME_AGO);

    setCurrentNotification({
      product,
      name,
      location: uaeLocation,
      time,
    });

    setIsVisible(true);

    // Auto-hide after 5.5 seconds unless hovered
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 5500);
  };

  useEffect(() => {
    // Hide notifications on Admin routes
    if (location.pathname.startsWith('/admin')) {
      setIsVisible(false);
      return;
    }

    // Initial popup after 6 seconds
    const initialTimeout = setTimeout(() => {
      showNextNotification();
    }, 6000);

    // Recurring interval: every 20-28 seconds
    const scheduleNext = () => {
      const delay = Math.floor(Math.random() * 8000) + 20000; // 20s to 28s
      timerRef.current = setTimeout(() => {
        if (!isPaused) {
          showNextNotification();
        }
        scheduleNext();
      }, delay);
    };

    scheduleNext();

    return () => {
      clearTimeout(initialTimeout);
      if (timerRef.current) clearTimeout(timerRef.current);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [productList.length, location.pathname, isPaused]);

  if (location.pathname.startsWith('/admin') || !currentNotification) {
    return null;
  }

  const { product, name, location: buyerLocation, time } = currentNotification;

  const handleCardClick = () => {
    setIsVisible(false);
    if (navigateTo) {
      navigateTo('product-detail', product.id);
    } else {
      navigate(`/product/${product.id}`);
    }
  };

  const handleDismiss = (e) => {
    e.stopPropagation();
    setIsVisible(false);
    // Pause for 45s if user manually closes
    setIsPaused(true);
    setTimeout(() => {
      setIsPaused(false);
    }, 45000);
  };

  const productImage = product.images?.[0] || product.image || '/images/placeholder.jpg';

  return (
    <div
      className={`fixed bottom-20 sm:bottom-6 left-3 sm:left-6 z-40 max-w-[340px] sm:max-w-sm w-[calc(100%-1.5rem)] sm:w-auto transition-all duration-500 ease-out transform ${
        isVisible
          ? 'translate-y-0 opacity-100 scale-100 pointer-events-auto'
          : 'translate-y-6 opacity-0 scale-95 pointer-events-none'
      }`}
      onMouseEnter={() => {
        // Pause auto-hide while mouse is hovering
        if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      }}
      onMouseLeave={() => {
        // Resume auto-hide after hover ends
        if (isVisible) {
          hideTimerRef.current = setTimeout(() => {
            setIsVisible(false);
          }, 3000);
        }
      }}
    >
      <div
        onClick={handleCardClick}
        className="group relative bg-[#FAF8F5] border border-[#E8DFE5] rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 p-3 sm:p-3.5 flex items-center gap-3 cursor-pointer overflow-hidden backdrop-blur-md bg-white/95"
      >
        {/* Subtle Luxury Left Accent Bar */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#7A0648]" />

        {/* Product Thumbnail */}
        <div className="relative w-14 h-18 sm:w-16 sm:h-20 shrink-0 bg-stone-100 rounded-md overflow-hidden border border-stone-200">
          <img
            src={productImage}
            alt={product.name || 'Abhaya Product'}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300&q=80';
            }}
          />
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-0.5 text-center">
            <span className="text-[9px] font-bold text-white uppercase tracking-tighter">UAE 🇦🇪</span>
          </div>
        </div>

        {/* Info & Details */}
        <div className="flex-1 min-w-0 pr-4">
          {/* Buyer Name & Location */}
          <div className="flex items-center gap-1.5 text-[11px] text-stone-600 font-medium leading-tight">
            <span className="font-bold text-[#1E141B]">{name}</span>
            <span>in</span>
            <span className="font-semibold text-[#7A0648] truncate">{buyerLocation}</span>
          </div>

          {/* Action text */}
          <p className="text-[10px] text-stone-500 font-medium">just purchased this abaya</p>

          {/* Product Title */}
          <h4 className="text-xs font-bold text-[#1E141B] truncate mt-0.5 group-hover:text-[#7A0648] transition-colors">
            {product.name}
          </h4>

          {/* Price & Time info */}
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs font-extrabold text-[#7A0648]">
              {formatPrice ? formatPrice(product) : `AED ${product.price || ''}`}
            </span>
            <span className="text-[10px] text-stone-400 font-medium">• {time}</span>
          </div>

          {/* Verified Purchase Tag */}
          <div className="flex items-center gap-1 mt-1 text-[9px] font-bold text-emerald-700 bg-emerald-50 w-fit px-1.5 py-0.5 rounded border border-emerald-200/60">
            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
            <span>Verified Order</span>
          </div>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute top-2 right-2 p-1 text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 rounded-full transition-colors cursor-pointer"
          title="Dismiss notification"
          aria-label="Dismiss notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
