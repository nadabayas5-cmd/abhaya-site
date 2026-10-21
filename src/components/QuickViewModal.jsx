import React, { useState, useEffect } from 'react';
import { X, Star, ShoppingBag, Sparkles, Check, ArrowRight, Scissors } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ABAYA_STYLES, ABAYA_WORKS, ABAYA_SIZE_LABELS, DEFAULT_ABAYA_SIZE } from '../data/products';

function QuickViewModalContent({ product, onClose }) {
  const {
    formatPrice,
    getProductPrice,
    currency,
    addToCart,
    navigateTo
  } = useShop();

  const [selectedStyle, setSelectedStyle] = useState(product.defaultStyle || ABAYA_STYLES[0].name);
  const [selectedWork, setSelectedWork] = useState(product.defaultWork || ABAYA_WORKS[0].name);
  const [selectedSize, setSelectedSize] = useState(DEFAULT_ABAYA_SIZE);
  const [customMeasurements, setCustomMeasurements] = useState({ height: '', bust: '', length: '' });
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const isWholesale = (product.category || '').toLowerCase().includes('wholesale');
  const [quantity, setQuantity] = useState(isWholesale ? (product.wholesaleMinQty || 10) : 1);

  const images = product.gallery && product.gallery.length > 0
    ? product.gallery
    : (product.image ? [product.image] : []);

  const isAbayaCategory = !product.category || product.category === 'ABAYA' || product.category === 'Kids abaya';

  const sizeOptions = isAbayaCategory ? ABAYA_SIZE_LABELS : (product.sizes || ABAYA_SIZE_LABELS);

  useEffect(() => {
    setSelectedSize(isAbayaCategory ? DEFAULT_ABAYA_SIZE : (product.sizes?.[0] || DEFAULT_ABAYA_SIZE));
  }, [product, isAbayaCategory]);

  const handleAddToCart = () => {
    const isCustom = selectedSize === 'Custom';
    addToCart(
      product,
      product.color || 'Standard',
      '#1c1c1c',
      selectedSize,
      quantity,
      images[activeImageIdx],
      isAbayaCategory ? selectedStyle : null,
      isAbayaCategory ? selectedWork : null,
      isCustom ? customMeasurements : null
    );
    onClose();
  };

  const handleFullDetail = () => {
    navigateTo('product-detail', product.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/65 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="relative bg-white text-[#1E141B] rounded-none max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl z-10 border border-stone-200 animate-fade-in my-auto font-semibold">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 w-8 h-8 rounded-none bg-[#7A0648] text-white hover:bg-[#68043D] flex items-center justify-center transition-colors cursor-pointer shadow-md"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" strokeWidth={1.8} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12">
          
          {/* Left: Gallery (5 cols) */}
          <div className="md:col-span-5 p-4 sm:p-6 bg-stone-50 flex flex-col justify-between border-b md:border-b-0 md:border-r border-stone-200">
            <div className="relative aspect-[3/4] max-h-[320px] md:max-h-none bg-stone-100 rounded-none overflow-hidden shadow-xs border border-stone-200">
              <img
                src={images[activeImageIdx] || images[0]}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-300"
              />
              {(product.badge || (product.originalPrice && product.originalPrice > product.price)) && (
                <div className="absolute top-3 left-3 z-10 pointer-events-none flex flex-col items-start gap-1">
                  {product.badge && (
                    <span className="badge-custom text-[9px] px-2 py-0.5 uppercase tracking-wider font-bold shadow-xs">
                      {product.badge}
                    </span>
                  )}
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="badge-sale text-[9px] px-2 py-0.5 uppercase tracking-wider font-bold shadow-xs">
                      Sale
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Thumbnail selector */}
            {images.length > 1 && (
              <div className="flex gap-2 pt-3 overflow-x-auto no-scrollbar">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`w-12 h-14 sm:w-14 sm:h-16 rounded-none overflow-hidden border transition-all shrink-0 cursor-pointer ${
                      activeImageIdx === idx ? 'border-[#7A0648] ring-2 ring-[#7A0648]' : 'border-stone-300 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Micro Badge */}
            <div className="mt-3 p-2.5 bg-white border border-stone-200 flex items-center gap-2 text-[11px] uppercase tracking-wide text-stone-700">
              <Scissors className="w-3.5 h-3.5 text-[#7A0648] shrink-0" strokeWidth={1.5} />
              <span className="font-bold">Bespoke Customization Options Available</span>
            </div>
          </div>

          {/* Right: Info & Selectors (7 cols) */}
          <div className="md:col-span-7 p-4 sm:p-6 flex flex-col justify-between space-y-4 bg-white text-[#1E141B] font-semibold">
            
            <div className="space-y-3.5">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.14em] font-bold text-stone-500">
                    {product.category || 'Abaya'} {product.subcategory ? `• ${product.subcategory}` : product.wholesaleType ? `• ${product.wholesaleType}` : isAbayaCategory && selectedStyle ? `• ${selectedStyle}` : ''}
                  </span>
                  <div className="flex items-center gap-1 text-[#FFD700] text-xs">
                    <Star className="w-3.5 h-3.5 fill-[#FFD700] text-[#FFD700]" strokeWidth={1} />
                    <span className="font-bold text-[#1E141B]">{product.rating}</span>
                  </div>
                </div>

                <h2 className="text-base sm:text-xl font-bold uppercase tracking-wider text-[#1E141B] leading-tight">
                  {product.name}
                </h2>

                <div className="flex items-baseline gap-2.5 pt-0.5">
                  <span className="text-lg sm:text-xl font-bold text-[#7A0648] tabular-nums tracking-tight">
                    {formatPrice(product)}
                  </span>
                  {currency === 'AED' && product.originalPrice && (
                    <span className="text-xs sm:text-sm text-stone-400 line-through tabular-nums font-medium">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
              </div>

              {/* Wholesale MOQ Card */}
              {product.category === 'WHOLESALE' && (
                <div className="p-3 bg-amber-50 rounded border border-amber-200 text-xs text-amber-900 space-y-1">
                  <div className="flex justify-between font-bold">
                    <span>Wholesale Bulk Lot</span>
                    <span>MOQ: {product.wholesaleMinQty || 10} pcs</span>
                  </div>
                  {product.wholesaleType && <div className="text-amber-800">Sub-type: {product.wholesaleType}</div>}
                </div>
              )}

              {/* Color Section */}
              {(product.color || (product.colors && product.colors.length > 0)) && (
                <div className="space-y-1.5 pt-2 border-t border-stone-200">
                  <div className="flex justify-between text-xs uppercase tracking-wider">
                    <span className="font-bold text-stone-600">Color:</span>
                    <span className="font-bold text-[#1E141B]">{product.color || (product.colors && product.colors[0]?.name)}</span>
                  </div>
                  <div className="px-3 py-2 bg-stone-50 border border-stone-200 text-xs font-bold text-[#1E141B] flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full border border-stone-300 bg-[#7A0648] shrink-0" />
                    <span>{product.color || (product.colors && product.colors[0]?.name)}</span>
                  </div>
                </div>
              )}

              {/* 1. Category Style Selector (Only for Abayas) */}
              {isAbayaCategory && (
                <div className="space-y-1.5 pt-2 border-t border-stone-200">
                  <div className="flex justify-between text-xs uppercase tracking-wider">
                    <span className="font-bold text-stone-600">1. Style:</span>
                    <span className="font-bold text-[#1E141B]">{selectedStyle}</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                    {ABAYA_STYLES.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setSelectedStyle(s.name)}
                        className={`px-2.5 py-2 text-[11px] uppercase tracking-wide font-bold rounded-none text-left transition-all border leading-tight cursor-pointer ${
                          selectedStyle.toLowerCase() === s.name.toLowerCase()
                            ? 'bg-[#7A0648] text-white border-[#7A0648] shadow-xs'
                            : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        {s.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. Work Selector (Only for Abayas) */}
              {isAbayaCategory && (
                <div className="space-y-1.5 pt-2 border-t border-stone-200">
                  <div className="flex justify-between text-xs uppercase tracking-wider">
                    <span className="font-bold text-stone-600">2. Work:</span>
                    <span className="font-bold text-[#1E141B]">{selectedWork}</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                    {ABAYA_WORKS.map((w) => (
                      <button
                        key={w.id}
                        onClick={() => setSelectedWork(w.name)}
                        className={`px-2.5 py-2 text-[11px] uppercase tracking-wide font-bold rounded-none text-left transition-all border leading-tight capitalize cursor-pointer ${
                          selectedWork.toLowerCase() === w.name.toLowerCase()
                            ? 'bg-[#7A0648] text-white border-[#7A0648] shadow-xs'
                            : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        {w.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. Abaya Length & Sizing */}
              <div className="space-y-1.5 pt-2 border-t border-stone-200">
                <span className="block text-xs uppercase tracking-wider font-bold text-stone-600">3. Length / Size:</span>
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="w-full text-xs py-2 px-2.5 bg-white border border-stone-300 rounded-none font-bold focus:outline-none focus:border-[#7A0648] uppercase text-[#1E141B] cursor-pointer"
                >
                  {(sizeOptions).map((s) => (
                    <option key={s} value={s} className="bg-white text-[#1E141B] font-semibold">
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {selectedSize === 'Custom' && (
                <div className="p-2.5 bg-stone-50 rounded-none border border-stone-200 space-y-1.5 animate-fade-in text-[11px]">
                  <div className="flex items-center gap-1 font-bold uppercase tracking-wider text-[#1E141B]">
                    <Scissors className="w-3 h-3 text-[#7A0648]" strokeWidth={1.5} />
                    <span>Custom Measurements:</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    <input
                      type="text"
                      placeholder="Height (e.g. 164cm)"
                      value={customMeasurements.height}
                      onChange={(e) => setCustomMeasurements(prev => ({ ...prev, height: e.target.value }))}
                      className="bg-white border border-stone-300 text-[#1E141B] placeholder-stone-400 font-semibold rounded-none px-2 py-1 text-[11px] focus:outline-none focus:border-[#7A0648]"
                    />
                    <input
                      type="text"
                      placeholder="Bust (e.g. 38in)"
                      value={customMeasurements.bust}
                      onChange={(e) => setCustomMeasurements(prev => ({ ...prev, bust: e.target.value }))}
                      className="bg-white border border-stone-300 text-[#1E141B] placeholder-stone-400 font-semibold rounded-none px-2 py-1 text-[11px] focus:outline-none focus:border-[#7A0648]"
                    />
                    <input
                      type="text"
                      placeholder="Length (e.g. 56in)"
                      value={customMeasurements.length}
                      onChange={(e) => setCustomMeasurements(prev => ({ ...prev, length: e.target.value }))}
                      className="bg-white border border-stone-300 text-[#1E141B] placeholder-stone-400 font-semibold rounded-none px-2 py-1 text-[11px] focus:outline-none focus:border-[#7A0648]"
                    />
                  </div>
                </div>
              )}

            </div>

            {/* Actions */}
            <div className="space-y-2 pt-3 border-t border-stone-200">
              <div className="flex gap-2.5">
                <button
                  onClick={handleAddToCart}
                  className="w-full py-3.5 bg-[#7A0648] hover:bg-[#68043D] text-white text-xs uppercase tracking-[0.14em] font-bold transition-colors flex items-center justify-center gap-2 border border-[#7A0648] shadow-md cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 text-white" strokeWidth={1.5} />
                  <span>Add to Bag • {formatPrice(getProductPrice(product) * quantity)}</span>
                </button>
              </div>

              <button
                onClick={handleFullDetail}
                className="w-full text-center text-xs text-[#7A0648] hover:text-[#68043D] font-bold uppercase tracking-wider flex items-center justify-center gap-1 py-1 cursor-pointer"
              >
                <span>View Full Product Details</span>
                <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default function QuickViewModal() {
  const { quickViewProduct, setQuickViewProduct } = useShop();

  // Prevent background scroll when quick view modal is open
  useEffect(() => {
    if (quickViewProduct) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [quickViewProduct]);

  if (!quickViewProduct) return null;

  return (
    <QuickViewModalContent
      product={quickViewProduct}
      onClose={() => setQuickViewProduct(null)}
    />
  );
}

