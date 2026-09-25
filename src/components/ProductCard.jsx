import React, { useState, useRef, useEffect } from 'react';
import { Star } from 'lucide-react';
import { useShop } from '../context/ShopContext';

function ProductTitle({ name, onClick, isHovered }) {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const [overflow, setOverflow] = useState(0);

  useEffect(() => {
    const measure = () => {
      if (containerRef.current && textRef.current) {
        const diff = textRef.current.scrollWidth - containerRef.current.clientWidth;
        setOverflow(diff > 4 ? diff : 0);
      }
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [name]);

  const durationSec = Math.max(3.5, (overflow * 0.05) + 2.5);

  return (
    <div
      ref={containerRef}
      onClick={onClick}
      className="w-full max-w-full overflow-hidden whitespace-nowrap text-center cursor-pointer px-1 relative select-none"
      title={name}
    >
      <span
        ref={textRef}
        style={{
          '--marquee-overflow': `-${overflow + 8}px`,
          '--marquee-duration': `${durationSec}s`
        }}
        className={`text-[12px] sm:text-[13px] md:text-[14px] font-bold text-[#1E141B] uppercase tracking-[0.04em] hover:text-[#7A0648] transition-colors leading-snug ${
          overflow > 0
            ? isHovered
              ? 'title-marquee-ticker font-bold'
              : 'inline-block truncate max-w-full'
            : 'inline-block'
        }`}
      >
        {name}
      </span>
    </div>
  );
}

export default function ProductCard({ product }) {
  const {
    formatPrice,
    currency,
    navigateTo
  } = useShop();

  const [isHovered, setIsHovered] = useState(false);

  // Image handling
  const gallery = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];
  const primaryImage = gallery[0] || product.image;
  const secondaryImage = gallery.length > 1 ? gallery[1] : primaryImage;

  const handleCardClick = () => {
    navigateTo('product-detail', product.id);
  };

  return (
    <div
      className="group flex flex-col bg-transparent text-center transition-all duration-300 relative select-none product-card-defer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Box (Aspect Tall / 3:4) */}
      <div
        className="relative aspect-[3/4] bg-stone-100 overflow-hidden cursor-pointer shadow-sm border border-stone-200/80"
        onClick={handleCardClick}
      >
        {/* Primary Image */}
        <img
          src={primaryImage}
          alt={product.name}
          className={`w-full h-full object-cover absolute inset-0 transition-opacity duration-500 ease-out ${
            isHovered && secondaryImage !== primaryImage ? 'opacity-0' : 'opacity-100'
          }`}
          loading="lazy"
          decoding="async"
        />

        {/* Secondary Hover Image */}
        {secondaryImage && secondaryImage !== primaryImage && (
          <img
            src={secondaryImage}
            alt={`${product.name} - view 2`}
            className={`w-full h-full object-cover absolute inset-0 transition-opacity duration-500 ease-out ${
              isHovered ? 'opacity-100 scale-105' : 'opacity-0'
            }`}
            loading="lazy"
            decoding="async"
          />
        )}

        {/* Badges (Top Left) */}
        {(product.badge || (product.originalPrice && product.originalPrice > product.price)) && (
          <div className="absolute top-2.5 left-2.5 z-10 pointer-events-none flex flex-col items-start gap-1">
            {product.badge && (
              <span className="bg-[#7A0648] text-white text-[8.5px] sm:text-[9.5px] tracking-[0.12em] uppercase font-bold px-2 py-0.5 shadow-sm">
                {product.badge}
              </span>
            )}
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="bg-[#E32C2B] text-white text-[8.5px] sm:text-[9.5px] tracking-[0.14em] uppercase font-bold px-2 py-0.5 shadow-sm">
                Sale
              </span>
            )}
          </div>
        )}
      </div>

      {/* Product Card Details (Centered) */}
      <div className="pt-3 pb-2 px-1 flex flex-col items-center justify-center space-y-1 bg-transparent w-full overflow-hidden">
        
        {/* Rotating / Marquee Title */}
        <ProductTitle
          name={product.name}
          onClick={handleCardClick}
          isHovered={isHovered}
        />

        {/* Price display */}
        <div className="flex items-center justify-center gap-1.5 text-[12px] sm:text-[13px]">
          {currency === 'AED' && product.originalPrice && product.originalPrice > product.price && (
            <span className="text-stone-400 line-through tabular-nums text-[11px]">
              {formatPrice(product.originalPrice)}
            </span>
          )}
          <span className="font-bold tabular-nums tracking-tight text-[#7A0648]">
            {formatPrice(product)}
          </span>
        </div>

        {/* Star Rating Badge */}
        <div className="flex items-center justify-center gap-1 pt-0.5">
          <div className="flex items-center text-[#FFD700]">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-2.5 h-2.5 fill-[#FFD700] text-[#FFD700]" strokeWidth={0} />
            ))}
          </div>
          <span className="text-[10px] text-stone-500 tracking-wider font-semibold">
            ({Number(product.rating || 5.0).toFixed(1)})
          </span>
        </div>

      </div>
    </div>
  );
}



