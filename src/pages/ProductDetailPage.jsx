import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {
  Star,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  Truck,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Check,
  CheckCircle2,
  ArrowRight,
  Share2,
  PackageCheck,
  ChevronLeft,
  ChevronRight,
  Scissors,
  Layers,
  Sparkle,
  Info,
  Maximize2,
  X,
  Ruler,
  Globe,
  Award,
  Flame,
  MessageCircle,
  HelpCircle
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import ProductCard from '../components/ProductCard';
import { ABAYA_STYLES, ABAYA_WORKS, ABAYA_SIZES, DEFAULT_ABAYA_SIZE } from '../data/products';
import { formatSingleProductWhatsAppMessage, openWhatsApp } from '../utils/whatsapp';

function AbayaSizeChartTable() {
  const standardSizes = ABAYA_SIZES.filter((s) => s.size !== 'Custom');

  return (
    <table className="w-full text-left text-xs border border-stone-200">
      <thead className="bg-stone-100 uppercase tracking-wider text-[10px] text-[#1E141B] font-bold">
        <tr>
          <th className="p-2.5 border-b border-stone-200">Size &amp; (No)</th>
          <th className="p-2.5 border-b border-stone-200">Height</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-stone-200">
        {standardSizes.map((size) => (
          <tr key={size.size}>
            <td className="p-2.5 font-bold text-[#7A0648]">
              {size.name} {size.size}
            </td>
            <td className="p-2.5 text-stone-600 font-medium">{size.height}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const TAGLINE_MAX_LENGTH = 90;

function ProductDetailLine({ label, value }) {
  if (!value?.trim()) return null;
  return (
    <p>
      <strong>{label}:</strong> {value.trim()}
    </p>
  );
}

function ProductDetailsSummary({ product, excludeSubtitle = false }) {
  const subtitleText = product.subtitle?.trim() || '';
  const fabric = (product.fabricDetails || product.fabric)?.trim() || '';
  const work = product.defaultWork?.trim() || '';
  const color = product.color?.trim() || '';
  const styling = product.stylingAdvice?.trim() || '';
  const care = product.careInstructions?.trim() || '';
  const wholesale = product.wholesaleType?.trim() || '';

  const primaryText = !excludeSubtitle ? subtitleText : '';
  const textIncludes = (value) => value && primaryText.toLowerCase().includes(value.toLowerCase());

  const structuredLines = [
    fabric && !textIncludes(fabric) ? ['Fabric', fabric] : null,
    work && !textIncludes(work) ? ['Work', work] : null,
    color && !textIncludes(color) ? ['Color', color] : null,
    care && !textIncludes(care) ? ['Garment Care', care] : null,
    wholesale && !textIncludes(wholesale) ? ['Wholesale Lot', wholesale] : null,
  ].filter(Boolean);

  const showStylingBlock = styling && !textIncludes(styling.slice(0, 24));

  if (primaryText || structuredLines.length > 0 || showStylingBlock) {
    return (
      <div className="space-y-3 text-xs sm:text-sm text-stone-600 leading-relaxed font-medium">
        {primaryText && (
          <p className="whitespace-pre-line text-stone-700 leading-relaxed">{primaryText}</p>
        )}

        {(structuredLines.length > 0 || showStylingBlock) && (
          <div className="p-3 bg-stone-50 border border-stone-200 space-y-1.5 text-xs text-[#1E141B]">
            {structuredLines.map(([label, value]) => (
              <ProductDetailLine key={label} label={label} value={value} />
            ))}
            {showStylingBlock && (
              <div className="whitespace-pre-line leading-relaxed">
                {styling}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-medium">
      Handcrafted bespoke artisan piece from the NOOR AL DHUHA collection.
    </p>
  );
}

const EMPTY_PRODUCT = {
  id: '',
  name: '',
  gallery: [],
  colors: [],
  styles: [],
  works: [],
  sizes: [],
};

export default function ProductDetailPage() {
  const { id: routeProductId } = useParams();
  const {
    PRODUCTS,
    selectedProductId,
    formatPrice,
    getProductPrice,
    addToCart,
    navigateTo,
    isProductsLoading,
    showToast,
    currency,
    freeShippingThreshold,
    deliverySettings,
    activeRegion
  } = useShop();

  const productId = routeProductId || selectedProductId;
  const product = PRODUCTS.find((p) => p.id === productId) || PRODUCTS[0] || EMPTY_PRODUCT;

  useEffect(() => {
    if (isProductsLoading) return;
    const isVisible = PRODUCTS.some((p) => p.id === productId);
    if (!isVisible && PRODUCTS.length > 0) {
      showToast('This product is not available in your selected market.');
      navigateTo('shop');
    }
  }, [productId, PRODUCTS, isProductsLoading, navigateTo, showToast]);

  // Options state
  const [selectedSize, setSelectedSize] = useState(DEFAULT_ABAYA_SIZE);
  const [customNotes, setCustomNotes] = useState('');
  const [selectedStyle, setSelectedStyle] = useState(product.defaultStyle || ABAYA_STYLES[0].name);
  const [selectedWork, setSelectedWork] = useState(product.defaultWork || ABAYA_WORKS[0].name);

  // Gallery & Purchase states
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [showSizeGuideModal, setShowSizeGuideModal] = useState(false);
  const [showLightboxModal, setShowLightboxModal] = useState(false);
  const [isAddedAnimation, setIsAddedAnimation] = useState(false);
  const buyBoxRef = useRef(null);
  const reviewsSectionRef = useRef(null);

  // Accordion state (Prestige / Basic Abaya layout)
  const [openAccordions, setOpenAccordions] = useState({
    sizeChart: false,
    deliveryReturn: false,
    garmentCare: false,
  });

  // Customer Reviews state (Judge.me style)
  const [reviewsList, setReviewsList] = useState([
    {
      id: 1,
      author: 'Hissa A.',
      location: 'Dubai, UAE',
      rating: 5,
      date: 'Verified Buyer • 3 days ago',
      title: 'Flawless Tafetta Drape',
      comment: 'Love it .. Thanks! The fabric quality is immaculate and the cut is modest yet supremely elegant. The drape flows effortlessly.'
    },
    {
      id: 2,
      author: 'Fatima Z.',
      location: 'Abu Dhabi, UAE',
      rating: 5,
      date: 'Verified Buyer • 1 week ago',
      title: 'As advertised. Supreme Quality',
      comment: 'As advertised. Good quality tafetta and candy crepe lining. Perfect length 54, sleeves are tailored just right.'
    },
    {
      id: 3,
      author: 'Mariam K.',
      location: 'Riyadh, KSA',
      rating: 5,
      date: 'Verified Buyer • 2 weeks ago',
      title: 'Bespoke fit & fast delivery',
      comment: 'Arrived in the signature keepsake box in under 3 days to Riyadh. The stitching detail along the cuffs is pure couture.'
    }
  ]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewTitle, setNewReviewTitle] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);

  useEffect(() => {
    const initialQty = product?.category === 'WHOLESALE' ? (product.wholesaleMinQty || 10) : 1;
    setSelectedSize(DEFAULT_ABAYA_SIZE);
    setCustomNotes('');
    setSelectedStyle(product.defaultStyle || ABAYA_STYLES[0].name);
    setSelectedWork(product.defaultWork || ABAYA_WORKS[0].name);
    if (product?.reviews && Array.isArray(product.reviews) && product.reviews.length > 0) {
      setReviewsList(product.reviews);
    }
    setActiveImageIdx(0);
    setQuantity(initialQty);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product]);

  // Monitor scroll position for mobile sticky purchase bar
  useEffect(() => {
    const handleScroll = () => {
      if (buyBoxRef.current) {
        const rect = buyBoxRef.current.getBoundingClientRect();
        setShowStickyBar(rect.bottom < 100);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const productColor = product.color?.trim() || product.colors?.[0]?.name || '';
  const currentColor = product.colors?.[0] || (productColor ? { name: productColor, hex: '#1C1C1C' } : { name: 'Standard', hex: '#1C1C1C' });
  const images = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];
  const relatedProducts = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 4);
  const regionDeliveryFee = deliverySettings?.[activeRegion]?.deliveryFee ?? 0;
  const subtitleText = product.subtitle?.trim() || '';
  const isShortTagline = subtitleText.length > 0 && subtitleText.length <= TAGLINE_MAX_LENGTH;
  const showTaglineUnderTitle = isShortTagline;

  const nextImage = () => {
    setActiveImageIdx((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setActiveImageIdx((prev) => (prev - 1 + images.length) % images.length);
  };

  const toggleAccordion = (key) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const scrollToReviews = () => {
    if (reviewsSectionRef.current) {
      reviewsSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAddToCart = () => {
    const isCustom = selectedSize === 'Custom';
    const chosenSizeFormatted = isCustom && customNotes.trim()
      ? `Custom — ${customNotes.trim()}`
      : selectedSize;

    addToCart(
      product,
      product.color?.trim() || currentColor?.name || 'Standard',
      currentColor?.hex || '#1C1C1C',
      chosenSizeFormatted,
      quantity,
      images[activeImageIdx],
      selectedStyle,
      selectedWork,
      isCustom ? { customDetails: customNotes } : null
    );

    setIsAddedAnimation(true);
    setTimeout(() => setIsAddedAnimation(false), 2000);
  };

  const handleWhatsAppInstantOrder = () => {
    const isCustom = selectedSize === 'Custom';
    const chosenSizeFormatted = isCustom && customNotes.trim()
      ? `Custom — ${customNotes.trim()}`
      : selectedSize;
    const activeImage = images[activeImageIdx] || product.image;
    const productUrl = typeof window !== 'undefined' ? window.location.href : '';
    const msg = formatSingleProductWhatsAppMessage({
      product,
      colorName: product.color?.trim() || currentColor?.name || 'Standard',
      size: chosenSizeFormatted,
      style: selectedStyle,
      work: selectedWork,
      quantity,
      customMeasurements: isCustom ? { customDetails: customNotes } : null,
      formatPrice,
      unitPrice: getProductPrice(product),
      imageUrl: activeImage,
      productUrl: productUrl
    });
    showToast(`Opening WhatsApp order for "${product.name}"...`);
    openWhatsApp(msg);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Product link copied to clipboard!');
    }
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!newReviewAuthor || !newReviewComment) return;
    const newEntry = {
      id: Date.now(),
      author: newReviewAuthor,
      location: 'Verified Buyer',
      rating: newReviewRating,
      date: 'Verified Buyer • Just now',
      title: newReviewTitle || 'Exquisite Abaya Quality',
      comment: newReviewComment
    };
    setReviewsList([newEntry, ...reviewsList]);
    setShowReviewForm(false);
    setNewReviewAuthor('');
    setNewReviewTitle('');
    setNewReviewComment('');
    showToast('Thank you! Your verified review has been published.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-6 space-y-10 sm:space-y-16 animate-fade-in pb-28 lg:pb-16 text-[#1E141B]">
      
      {/* 1. Breadcrumbs Navigation */}
      <nav className="flex items-center space-x-2 text-[11px] sm:text-xs uppercase tracking-widest text-stone-500 overflow-x-auto no-scrollbar py-1">
        <button onClick={() => navigateTo('home')} className="hover:text-[#7A0648] transition-colors shrink-0 cursor-pointer">
          Home
        </button>
        <span className="text-stone-300">/</span>
        <button
          onClick={() => navigateTo('shop', null, null, null, null, null, product.category || 'ABAYA')}
          className="hover:text-[#7A0648] transition-colors shrink-0 cursor-pointer font-semibold text-stone-700"
        >
          {product.category || 'Abayas'}
        </button>
        {product.subcategory && (
          <>
            <span className="text-stone-300">/</span>
            <span className="text-stone-500 font-medium shrink-0">{product.subcategory}</span>
          </>
        )}
        {product.wholesaleType && (
          <>
            <span className="text-stone-300">/</span>
            <span className="text-amber-800 font-semibold shrink-0">{product.wholesaleType}</span>
          </>
        )}
        <span className="text-stone-300">/</span>
        <span className="text-[#7A0648] font-bold truncate max-w-[200px] sm:max-w-none">
          {product.name}
        </span>
      </nav>

      {/* 2. Main 2-Column Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
        
        {/* ========================================================================= */}
        {/* LEFT COLUMN: PRODUCT GALLERY (Prestige Stacked / Lightbox)                */}
        {/* ========================================================================= */}
        <div className="lg:col-span-6 space-y-4 lg:sticky lg:top-24">
          
          {/* Main Large Image Container */}
          <div className="relative aspect-[3/4] bg-stone-100 overflow-hidden shadow-sm border border-stone-200 group">
            <img
              src={images[activeImageIdx] || images[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02] cursor-zoom-in"
              onClick={() => setShowLightboxModal(true)}
            />

            {/* Badges Overlay */}
            {(product.badge || (currency === 'AED' && product.originalPrice && product.originalPrice > product.price)) && (
              <div className="absolute top-3 left-3 z-10 pointer-events-none flex flex-col items-start gap-1.5">
                {product.badge && (
                  <span className="badge-custom text-[10px] tracking-widest uppercase shadow-xs">
                    {product.badge}
                  </span>
                )}
                {currency === 'AED' && product.originalPrice && product.originalPrice > product.price && (
                  <span className="badge-sale text-[10px] tracking-widest uppercase shadow-xs">
                    Sale
                  </span>
                )}
              </div>
            )}

            {/* Top Right Quick Actions (Share & Lightbox Zoom & Wishlist) */}
            <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
              <button
                onClick={() => setShowLightboxModal(true)}
                className="w-8 h-8 rounded-full bg-white text-[#7A0648] flex items-center justify-center transition-all hover:bg-stone-50 shadow-sm cursor-pointer border border-stone-200"
                title="Zoom picture"
                aria-label="Zoom image"
              >
                <Maximize2 className="w-3.5 h-3.5" strokeWidth={1.5} />
              </button>
              <button
                onClick={handleShare}
                className="w-8 h-8 rounded-full bg-white text-[#7A0648] flex items-center justify-center transition-all hover:bg-stone-50 shadow-sm cursor-pointer border border-stone-200"
                title="Share product"
                aria-label="Share link"
              >
                <Share2 className="w-3.5 h-3.5" strokeWidth={1.5} />
              </button>
            </div>

            {/* Mobile Carousel Arrow Controls */}
            {images.length > 1 && (
              <div className="sm:hidden absolute inset-y-0 inset-x-2 flex items-center justify-between pointer-events-none z-10">
                <button
                  onClick={(e) => { e.stopPropagation(); prevImage(); }}
                  className="w-8 h-8 rounded-none bg-black/60 text-white border border-white/30 flex items-center justify-center pointer-events-auto shadow-md"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-4 h-4" strokeWidth={2} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); nextImage(); }}
                  className="w-8 h-8 rounded-none bg-black/60 text-white border border-white/30 flex items-center justify-center pointer-events-auto shadow-md"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-4 h-4" strokeWidth={2} />
                </button>
              </div>
            )}

            {/* Indicator Dots on Mobile */}
            {images.length > 1 && (
              <div className="sm:hidden absolute bottom-3 inset-x-0 flex justify-center gap-1.5 z-10">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      activeImageIdx === idx ? 'w-5 bg-[#7A0648]' : 'w-1.5 bg-black/30'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Desktop & Tablet Thumbnail Slider Bar */}
          {images.length > 1 && (
            <div className="hidden sm:grid grid-cols-5 gap-2.5">
              {images.map((imgUrl, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`aspect-[3/4] bg-stone-100 overflow-hidden cursor-pointer border transition-all ${
                    activeImageIdx === idx
                      ? 'border-[#7A0648] ring-2 ring-[#7A0648] shadow-sm'
                      : 'border-stone-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`${product.name} thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}

        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: PRODUCT TITLE, PRICING, SELECTORS & CTAS                    */}
        {/* ========================================================================= */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Header Block (Rating, Title, Price) */}
          <div className="space-y-2 border-b border-stone-200 pb-5">
            
            {/* Star Rating summary (Scrolls to reviews on click) */}
            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={scrollToReviews}
                className="flex items-center gap-1.5 text-stone-600 hover:text-[#7A0648] transition-colors cursor-pointer group"
              >
                <div className="flex items-center text-[#FFD700]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#FFD700] text-[#FFD700]" strokeWidth={1} />
                  ))}
                </div>
                <span className="font-bold text-stone-800">{product.rating || '5.0'}</span>
                <span className="text-stone-500 group-hover:underline">({product.reviewsCount || '118'} reviews)</span>
              </button>
            </div>

            {/* Product Title */}
            <h1 className="text-xl sm:text-2xl lg:text-3xl text-[#1E141B] font-bold uppercase tracking-wider leading-tight">
              {product.name}
            </h1>

            {/* Optional short tagline under title; longer copy shows in About This Piece */}
            {showTaglineUnderTitle && (
              <p className="text-xs sm:text-sm text-stone-500 font-medium leading-relaxed pt-0.5">
                {subtitleText}
              </p>
            )}

            {/* Price Row */}
            <div className="flex items-baseline gap-3 pt-1">
              <span className="text-xl sm:text-2xl text-[#7A0648] font-bold tabular-nums tracking-tight">
                {formatPrice(product)}
              </span>
              {currency === 'AED' && product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm sm:text-base text-stone-400 line-through tabular-nums">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            {freeShippingThreshold > 0 && (
              <div className="flex items-start gap-2 pt-2.5 text-xs text-stone-600 font-medium leading-relaxed">
                <Truck className="w-4 h-4 text-[#7A0648] shrink-0 mt-0.5" strokeWidth={1.75} />
                <span>
                  Free delivery on orders above{' '}
                  <strong className="text-[#1E141B]">{formatPrice(freeShippingThreshold)}</strong>
                  {regionDeliveryFee > 0 && (
                    <>
                      {' '}
                      · Below that, {formatPrice(regionDeliveryFee)} flat shipping
                    </>
                  )}
                </span>
              </div>
            )}
          </div>

          {/* Product description — visible above size & purchase options */}
          <div className="space-y-2 border-b border-stone-200 pb-5">
            <p className="text-xs uppercase tracking-wider font-bold text-[#1E141B]">
              About This Piece
            </p>
            <ProductDetailsSummary product={product} excludeSubtitle={showTaglineUnderTitle} />
          </div>

          {/* ========================================================================= */}
          {/* OPTION: COLOR SECTION                                                     */}
          {/* ========================================================================= */}
          {Boolean(product.color?.trim() || (product.colors && product.colors.length > 0)) && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs uppercase tracking-wider">
                <span className="text-stone-600 font-medium">
                  Color: <strong className="text-[#1E141B] font-bold">{product.color?.trim() || (currentColor && currentColor.name)}</strong>
                </span>
              </div>
              <div className="flex items-center justify-between px-3.5 py-2.5 bg-stone-50 border border-stone-200 text-xs font-bold uppercase tracking-wider text-[#1E141B]">
                <div className="flex items-center gap-2.5">
                  <span className="w-3.5 h-3.5 rounded-full border border-stone-300 bg-[#7A0648] shrink-0" />
                  <span>{product.color?.trim() || (currentColor && currentColor.name)}</span>
                </div>
                <span className="text-[10px] text-stone-500 font-medium tracking-normal lowercase first-letter:uppercase">atelier piece shade</span>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SIZE SELECTOR + SIZE CHART LINK                                           */}
          {/* ========================================================================= */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs uppercase tracking-wider">
              <span className="text-stone-600 font-medium">
                Size: <strong className="text-[#1E141B] font-bold">{selectedSize}</strong>
              </span>
              <button
                onClick={() => setShowSizeGuideModal(true)}
                className="flex items-center gap-1 text-[11px] text-[#7A0648] hover:underline uppercase tracking-wider font-bold cursor-pointer"
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>Size Chart</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {ABAYA_SIZES.map((sizeOption) => {
                const isSelected = selectedSize === sizeOption.label;
                return (
                  <button
                    key={sizeOption.label}
                    onClick={() => setSelectedSize(sizeOption.label)}
                    className={`py-2.5 px-2 text-center text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#7A0648] text-white border-2 border-[#7A0648] shadow-xs'
                        : 'bg-white text-stone-700 border border-stone-300 hover:bg-stone-100'
                    }`}
                  >
                    {sizeOption.label}
                  </button>
                );
              })}
            </div>

            {selectedSize === 'Custom' && (
              <div className="pt-2 animate-fade-in">
                <textarea
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  placeholder="Enter custom measurements (e.g., height, bust, sleeve, length in inches)..."
                  rows={2}
                  className="w-full bg-white text-[#1E141B] placeholder-stone-400 text-xs p-2.5 border border-stone-300 focus:outline-none focus:border-[#7A0648] transition-colors resize-none shadow-xs"
                />
              </div>
            )}
          </div>

          {/* Wholesale B2B MOQ Callout Card */}
          {product.category === 'WHOLESALE' && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200/80 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-700" />
                  B2B Wholesale Lot
                </span>
                <span className="text-[11px] font-bold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-full border border-amber-300/60">
                  MOQ: {product.wholesaleMinQty || 10} Pieces
                </span>
              </div>
              <p className="text-xs text-amber-800 leading-relaxed font-medium">
                {product.wholesaleType && <span className="font-bold block">Type: {product.wholesaleType}</span>}
                Special bulk pricing applied. Custom branding and bespoke manufacturing available on WhatsApp inquiries.
              </p>
            </div>
          )}

          {/* Social Proof Live Badge */}
          <div className="flex items-center gap-2 text-xs text-stone-600 py-1 font-medium">
            <Flame className="w-4 h-4 text-[#7A0648] fill-[#7A0648] animate-pulse" />
            <span>
              <strong className="text-[#1E141B]">24 people</strong> have added this product to cart in the past week
            </span>
          </div>

          {/* ========================================================================= */}
          {/* QUANTITY & PRIMARY ACTION BUTTONS                                         */}
          {/* ========================================================================= */}
          <div className="space-y-3 pt-2">
            <div className="flex gap-3">
              
              {/* Quantity Counter */}
              <div className="flex items-center border border-stone-300 bg-white shrink-0">
                <button
                  onClick={() => setQuantity((q) => Math.max(product.category === 'WHOLESALE' ? (product.wholesaleMinQty || 10) : 1, q - 1))}
                  className="w-10 h-12 flex items-center justify-center text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer text-base font-bold"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="w-10 text-center text-sm font-bold text-[#1E141B]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-10 h-12 flex items-center justify-center text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer text-base font-bold"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-6 uppercase text-xs sm:text-sm font-bold tracking-[0.1em] transition-all duration-200 cursor-pointer shadow-md ${
                  isAddedAnimation
                    ? 'bg-emerald-600 text-white border-2 border-emerald-500 scale-[1.01]'
                    : 'bg-[#7A0648] text-white hover:bg-[#68043D] active:scale-[0.99]'
                }`}
              >
                {isAddedAnimation ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>
            </div>

            {/* Instant WhatsApp Order Button */}
            <button
              onClick={handleWhatsAppInstantOrder}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 uppercase text-xs sm:text-sm font-bold tracking-[0.08em] bg-white text-[#7A0648] border border-[#7A0648]/40 hover:bg-[#7A0648] hover:text-white transition-all duration-200 cursor-pointer shadow-xs"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Order via WhatsApp</span>
            </button>
          </div>

          {/* ========================================================================= */}
          {/* ACCORDIONS / DETAILS SECTION                                              */}
          {/* ========================================================================= */}
          <div className="divide-y divide-stone-200 border-y border-stone-200 pt-2 text-[#1E141B]">
            
            {/* 1. Size Guide & Measurements Table Accordion */}
            <div className="py-3">
              <button
                onClick={() => toggleAccordion('sizeChart')}
                className="w-full flex items-center justify-between text-xs uppercase tracking-wider font-bold text-[#1E141B] py-1 cursor-pointer hover:text-[#7A0648] transition-colors"
              >
                <span>Size Guide & Measurements</span>
                {openAccordions.sizeChart ? <ChevronUp className="w-4 h-4 text-[#7A0648]" /> : <ChevronDown className="w-4 h-4 text-stone-500" />}
              </button>
              {openAccordions.sizeChart && (
                <div className="pt-3 pb-2 space-y-3 text-xs text-stone-600">
                  <p className="text-[11px] text-stone-500 font-medium">
                    Noor al dhuha abaya size chart — select your size based on height:
                  </p>
                  <div className="overflow-x-auto">
                    <AbayaSizeChartTable />
                  </div>
                  <p className="text-[11px] text-stone-500 font-medium">
                    Need a bespoke fit? Select <strong>Custom</strong> and enter your measurements above.
                  </p>
                </div>
              )}
            </div>

            {/* 2. Delivery & Returns Accordion */}
            <div className="py-3">
              <button
                onClick={() => toggleAccordion('deliveryReturn')}
                className="w-full flex items-center justify-between text-xs uppercase tracking-wider font-bold text-[#1E141B] py-1 cursor-pointer hover:text-[#7A0648] transition-colors"
              >
                <span>Delivery & Return Policy</span>
                {openAccordions.deliveryReturn ? <ChevronUp className="w-4 h-4 text-[#7A0648]" /> : <ChevronDown className="w-4 h-4 text-stone-500" />}
              </button>
              {openAccordions.deliveryReturn && (
                <div className="pt-3 pb-2 space-y-2 text-xs sm:text-sm text-stone-600 leading-relaxed font-medium">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 bg-stone-50 border border-stone-200">
                      <p className="font-bold text-[#1E141B]">🇦🇪 UAE Delivery</p>
                      <p className="text-stone-500">Express delivery within 1 - 3 business days.</p>
                    </div>
                    <div className="p-2.5 bg-stone-50 border border-stone-200">
                      <p className="font-bold text-[#1E141B]">🌍 Worldwide Shipping</p>
                      <p className="text-stone-500">DHL Express delivery in 3 - 7 business days.</p>
                    </div>
                  </div>
                  <p className="text-xs text-stone-500 pt-1">
                    Standard chart sizes can be exchanged within 7 days of delivery. Custom-tailored pieces are made to order and non-refundable.
                  </p>
                </div>
              )}
            </div>

            {/* 3. Garment Care Accordion */}
            <div className="py-3">
              <button
                onClick={() => toggleAccordion('garmentCare')}
                className="w-full flex items-center justify-between text-xs uppercase tracking-wider font-bold text-[#1E141B] py-1 cursor-pointer hover:text-[#7A0648] transition-colors"
              >
                <span>Garment Care & Steaming</span>
                {openAccordions.garmentCare ? <ChevronUp className="w-4 h-4 text-[#7A0648]" /> : <ChevronDown className="w-4 h-4 text-stone-500" />}
              </button>
              {openAccordions.garmentCare && (
                <div className="pt-3 pb-2 space-y-2 text-xs text-stone-600 leading-relaxed font-medium">
                  <ul className="list-disc list-inside space-y-1 text-stone-600">
                    <li>Dry clean strictly recommended for silk, tafetta, and crepe abayas.</li>
                    <li>Use a vertical garment steamer instead of hot contact iron.</li>
                    <li>Store in breathable garment bags away from direct sunlight.</li>
                  </ul>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 3. REVIEWS SECTION ("Let customers speak for us")                         */}
      {/* ========================================================================= */}
      <section ref={reviewsSectionRef} className="pt-8 sm:pt-14 border-t border-stone-200 space-y-8 text-[#1E141B]">
        
        <div className="text-center space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] font-bold text-[#7A0648]">
            Verified Customer Reviews
          </p>
          <h2 className="text-xl sm:text-3xl font-bold tracking-wider uppercase text-[#1E141B]">
            Let Customers Speak For Us
          </h2>
          <div className="flex items-center justify-center gap-2 pt-1 text-sm">
            <div className="flex items-center text-[#FFD700]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-[#FFD700] text-[#FFD700]" strokeWidth={1} />
              ))}
            </div>
            <span className="font-bold text-[#1E141B]">5.0 / 5</span>
            <span className="text-stone-500 font-medium">based on {reviewsList.length + 115} reviews</span>
          </div>
        </div>

        {/* Rating Breakdown Bars & Write a Review Action */}
        <div className="max-w-3xl mx-auto p-4 sm:p-6 bg-white border border-stone-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="w-full sm:w-1/2 space-y-1.5 text-xs text-stone-600">
            <div className="flex items-center gap-2">
              <span className="w-12 text-stone-600 font-medium">5 star</span>
              <div className="flex-1 h-2 bg-stone-200 overflow-hidden">
                <div className="h-full bg-[#7A0648] w-[96%]" />
              </div>
              <span className="w-8 text-right font-bold text-[#1E141B]">96%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-12 text-stone-600 font-medium">4 star</span>
              <div className="flex-1 h-2 bg-stone-200 overflow-hidden">
                <div className="h-full bg-[#7A0648] w-[4%]" />
              </div>
              <span className="w-8 text-right font-bold text-[#1E141B]">4%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-12 text-stone-600 font-medium">3 star</span>
              <div className="flex-1 h-2 bg-stone-200 overflow-hidden">
                <div className="h-full bg-[#7A0648] w-[0%]" />
              </div>
              <span className="w-8 text-right font-bold text-[#1E141B]">0%</span>
            </div>
          </div>

          <div className="text-center sm:text-right shrink-0">
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="py-2.5 px-6 bg-[#7A0648] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#68043D] transition-all cursor-pointer shadow-xs"
            >
              {showReviewForm ? 'Cancel Review' : 'Write a Review'}
            </button>
          </div>
        </div>

        {/* Interactive Review Form */}
        {showReviewForm && (
          <form onSubmit={handleReviewSubmit} className="max-w-2xl mx-auto p-6 bg-white border border-stone-300 shadow-md space-y-4 animate-fade-in">
            <h3 className="text-sm uppercase tracking-wider font-bold text-[#1E141B] text-center">
              Write Your Verified Review
            </h3>

            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-600 font-bold mb-1">
                Rating
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewReviewRating(star)}
                    className="cursor-pointer text-[#FFD700]"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= newReviewRating ? 'fill-[#FFD700]' : 'text-stone-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-600 font-bold mb-1">
                Your Name
              </label>
              <input
                type="text"
                required
                value={newReviewAuthor}
                onChange={(e) => setNewReviewAuthor(e.target.value)}
                placeholder="E.g., Hissa Al-Maktoum"
                className="w-full bg-white text-[#1E141B] placeholder-stone-400 text-xs p-2.5 border border-stone-300 focus:outline-none focus:border-[#7A0648]"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-600 font-bold mb-1">
                Review Title
              </label>
              <input
                type="text"
                value={newReviewTitle}
                onChange={(e) => setNewReviewTitle(e.target.value)}
                placeholder="E.g., Beautiful flow & fabric"
                className="w-full bg-white text-[#1E141B] placeholder-stone-400 text-xs p-2.5 border border-stone-300 focus:outline-none focus:border-[#7A0648]"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-600 font-bold mb-1">
                Review Content
              </label>
              <textarea
                required
                rows={3}
                value={newReviewComment}
                onChange={(e) => setNewReviewComment(e.target.value)}
                placeholder="Share your experience with the cut, fabric, and fit..."
                className="w-full bg-white text-[#1E141B] placeholder-stone-400 text-xs p-2.5 border border-stone-300 focus:outline-none focus:border-[#7A0648] resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#7A0648] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#68043D] transition-all cursor-pointer shadow-md"
            >
              Submit Review
            </button>
          </form>
        )}

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-6xl mx-auto">
          {reviewsList.map((rev) => (
            <div key={rev.id} className="p-5 bg-white border border-stone-200 shadow-xs space-y-2.5 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-[#FFD700]">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#FFD700] text-[#FFD700]" strokeWidth={1} />
                    ))}
                  </div>
                  <span className="text-[10px] text-stone-400 uppercase tracking-wider font-semibold">{rev.date}</span>
                </div>

                <h4 className="text-xs uppercase font-bold tracking-wider text-[#1E141B]">
                  {rev.title}
                </h4>

                <p className="text-xs text-stone-600 leading-relaxed font-medium">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px]">
                <span className="font-bold text-[#1E141B]">{rev.author}</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-[#F5EAF1] text-[#7A0648] uppercase tracking-wider font-bold">
                  Verified Buyer
                </span>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 4. RELATED PRODUCTS / "YOU MAY ALSO LIKE" SECTION                         */}
      {/* ========================================================================= */}
      <section className="pt-8 sm:pt-14 border-t border-stone-200 space-y-6 text-[#1E141B]">
        <div className="text-center space-y-1">
          <p className="text-xs uppercase tracking-[0.2em] font-bold text-[#7A0648]">
            Complementary Pieces
          </p>
          <h2 className="text-xl sm:text-2xl font-bold tracking-wider uppercase text-[#1E141B]">
            You May Also Like
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
          {relatedProducts.map((relProd) => (
            <ProductCard key={relProd.id} product={relProd} />
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. STICKY BOTTOM ACTION BAR (Mobile & Tablet)                             */}
      {/* ========================================================================= */}
      {showStickyBar && (
        <div className="fixed bottom-0 inset-x-0 bg-[#7A0648] border-t border-[#68043D] p-3 z-40 lg:hidden shadow-2xl flex items-center justify-between gap-3 animate-slide-up text-white">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <img
              src={images[activeImageIdx] || images[0]}
              alt=""
              className="w-11 h-13 object-cover border border-white/30 shrink-0 bg-stone-100"
            />
            <div className="truncate">
              <p className="text-xs font-bold uppercase text-white truncate">{product.name}</p>
              <p className="text-xs font-bold text-[#FFF0A0] tabular-nums">{formatPrice(product)}</p>
            </div>
          </div>
          <button
            onClick={handleAddToCart}
            className="py-2.5 px-4 bg-white text-[#7A0648] font-bold text-xs uppercase tracking-wider hover:bg-white/90 transition-all shrink-0 cursor-pointer shadow-md flex items-center gap-1.5"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add to Cart</span>
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. MODAL: SIZE CHART DIALOG                                               */}
      {/* ========================================================================= */}
      {showSizeGuideModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-stone-200 text-[#1E141B] max-w-lg w-full p-6 space-y-4 relative shadow-2xl animate-scale-up max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowSizeGuideModal(false)}
              className="absolute top-4 right-4 text-stone-500 hover:text-[#1E141B] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-base uppercase tracking-widest font-bold text-[#1E141B]">
                Abaya Size Guide
              </h3>
              <p className="text-xs text-stone-600 font-medium">
                Find your recommended abaya length based on your overall height.
              </p>
            </div>

            <div className="overflow-x-auto pt-2">
              <AbayaSizeChartTable />
            </div>

            <div className="p-3 bg-stone-50 border border-stone-200 text-xs space-y-1">
              <p className="font-bold text-[#1E141B]">Need a custom tailored fit?</p>
              <p className="text-stone-600 text-[11px] font-medium">
                Choose <strong>Custom</strong> and specify your exact bust, sleeve, and shoulder measurements in the order notes.
              </p>
            </div>

            <button
              onClick={() => setShowSizeGuideModal(false)}
              className="w-full py-2.5 bg-[#7A0648] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#68043D] transition-colors cursor-pointer shadow-sm"
            >
              Close Size Guide
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. MODAL: LIGHTBOX FULL IMAGE ZOOM                                        */}
      {/* ========================================================================= */}
      {showLightboxModal && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setShowLightboxModal(false)}
        >
          <button
            onClick={() => setShowLightboxModal(false)}
            className="absolute top-5 right-5 text-white bg-black/50 p-2 rounded-full hover:bg-black transition-colors cursor-pointer z-50"
          >
            <X className="w-6 h-6" />
          </button>

          <div
            className="relative max-w-4xl max-h-[90vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[activeImageIdx] || images[0]}
              alt=""
              className="max-h-[85vh] w-auto object-contain shadow-2xl"
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors cursor-pointer"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors cursor-pointer"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
