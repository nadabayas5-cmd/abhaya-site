import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import EditableSection from '../components/cms/EditableSection';
import ProductCard from '../components/ProductCard';
import { getAssetUrl } from '../lib/cms';

/* ──────────────────────────────────────────────
   Image maps for Style & Work collection cards
   (re-using existing product / collection images)
   ────────────────────────────────────────────── */

const STYLE_IMAGES = {
  'Open abaya':              getAssetUrl('collection-images/style_open_abaya.jpg'),
  'Closed cut':              getAssetUrl('collection-images/style_closed_cut.jpg'),
  'Kimono or kaftan':        getAssetUrl('collection-images/style_kimono_kaftan.jpg'),
  'Butterfly or farasha':    getAssetUrl('collection-images/style_butterfly_farasha.jpg'),
  'umbrella cut or Flare':   getAssetUrl('collection-images/style_umbrella_flare.jpg'),
  '2 piece abaya (with inner)': getAssetUrl('collection-images/style_two_piece.jpg'),
  'Coat abaya':              getAssetUrl('collection-images/style_coat_abaya.jpg'),
};

const WORK_IMAGES = {
  'Embroidery Abaya':        getAssetUrl('collection-images/work_embroidery.jpg'),
  'Handwork Abaya':          getAssetUrl('collection-images/work_handwork.jpg'),
  'Stonework Abaya':         getAssetUrl('collection-images/work_stonework.jpg'),
  'Threadwork Abaya':        getAssetUrl('collection-images/work_threadwork.jpg'),
  'Printed Abaya':           getAssetUrl('collection-images/work_printed.jpg'),
  'Lace Work Abaya':         getAssetUrl('collection-images/work_lacework.jpg'),
  'plain':                   getAssetUrl('collection-images/work_plain.jpg'),
  'Others':                  getAssetUrl('collection-images/work_others.jpg'),
};

const STYLES_LIST = [
  'Open abaya',
  'Closed cut',
  'Kimono or kaftan',
  'Butterfly or farasha',
  'umbrella cut or Flare',
  '2 piece abaya (with inner)',
  'Coat abaya',
];

const WORKS_LIST = [
  'Embroidery Abaya',
  'Handwork Abaya',
  'Stonework Abaya',
  'Threadwork Abaya',
  'Printed Abaya',
  'Lace Work Abaya',
  'plain',
  'Others',
];

export default function HomePage() {
  const { PRODUCTS, navigateTo, formatPrice, siteContent } = useShop();

  // ── Category Products (Latest 6 listings per category) ──
  const shailaProducts = useMemo(() => {
    return PRODUCTS.filter(p => p.category === 'Shaila/Shawl' || (p.category && p.category.toLowerCase().includes('shaila'))).slice(0, 6);
  }, [PRODUCTS]);

  const hijabProducts = useMemo(() => {
    return PRODUCTS.filter(p => p.category === 'Hijaab' || (p.category && (p.category.toLowerCase().includes('hijaab') || p.category.toLowerCase().includes('hijab')))).slice(0, 6);
  }, [PRODUCTS]);

  const innerPrayerProducts = useMemo(() => {
    return PRODUCTS.filter(p => p.category === 'Inner and Prayer dress' || (p.category && (p.category.toLowerCase().includes('inner') || p.category.toLowerCase().includes('prayer')))).slice(0, 6);
  }, [PRODUCTS]);

  const kidsProducts = useMemo(() => {
    return PRODUCTS.filter(p => p.category === 'Kids abaya' || (p.category && p.category.toLowerCase().includes('kids'))).slice(0, 6);
  }, [PRODUCTS]);

  const wholesaleProducts = useMemo(() => {
    return PRODUCTS.filter(p => p.category === 'WHOLESALE' || (p.category && p.category.toLowerCase().includes('wholesale'))).slice(0, 6);
  }, [PRODUCTS]);

  // ── Hero Carousel ──
  const heroSlides = siteContent?.hero_slides || [];
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (heroSlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((p) => (p + 1) % heroSlides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const prevSlide = () =>
    setCurrentSlide((p) => (p - 1 + heroSlides.length) % heroSlides.length);
  const nextSlide = () =>
    setCurrentSlide((p) => (p + 1) % heroSlides.length);

  return (
    <div className="bg-[#FAF8F5] text-[#1E141B] font-sans antialiased overflow-x-hidden font-semibold">

      {/* ═══════════════════════════════════════════════
          SECTION 1 — HERO / SHOP NOW
          ═══════════════════════════════════════════════ */}
      <EditableSection cmsKey="hero_slides" label="Hero Carousel">
        <section id="hero-shop-now" className="relative w-full overflow-hidden">
          {/* Slides */}
          <div
            className="flex transition-transform duration-[800ms] ease-[cubic-bezier(0.77,0,0.175,1)]"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {heroSlides.map((slide, i) => (
              <div key={slide.id} className="relative w-full shrink-0">
                {/* Full-width image */}
                <div className="relative w-full h-[75vh] sm:h-[82vh] md:h-[88vh] min-h-[480px] overflow-hidden">
                  <img
                    src={getAssetUrl(slide.image)}
                    alt={slide.title}
                    className="w-full h-full object-cover object-top"
                    loading={i === 0 ? 'eager' : 'lazy'}
                  />

                  {/* Dark gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />

                  {/* Content over image — bottom-left */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6 pb-24 sm:p-10 md:p-16 lg:p-20 max-w-2xl">
                    {slide.badge && (
                      <span className="inline-block w-fit text-[10px] sm:text-xs tracking-[0.25em] font-bold text-[#FFF0A0] uppercase mb-2 drop-shadow-sm">
                        {slide.badge}
                      </span>
                    )}
                    <h1 className="text-2xl sm:text-4xl md:text-5xl text-white font-bold uppercase tracking-[0.06em] leading-[1.15] mb-2 sm:mb-3 drop-shadow-lg">
                      {slide.title}
                    </h1>
                    <p className="text-white text-xs sm:text-sm max-w-md leading-relaxed mb-4 sm:mb-6 drop-shadow-md font-semibold">
                      {slide.description}
                    </p>
                    <button
                      onClick={() => (
                        slide.productId
                          ? navigateTo('product-detail', slide.productId)
                          : navigateTo('shop')
                      )}
                      className="inline-flex items-center justify-center w-fit bg-white text-[#7A0648] hover:bg-white/90 uppercase tracking-[0.18em] font-bold text-xs py-3.5 px-8 shadow-2xl transition-all duration-300 hover:scale-[1.02] cursor-pointer rounded-none border border-white"
                    >
                      Shop Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Slide indicators */}
          {heroSlides.length > 1 && (
            <div className="absolute bottom-5 sm:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {heroSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`cursor-pointer h-[3px] transition-all duration-300 ${
                    currentSlide === i
                      ? 'w-8 bg-white shadow-sm'
                      : 'w-3 bg-white/50 hover:bg-white/90'
                  }`}
                />
              ))}
            </div>
          )}
        </section>
      </EditableSection>


      {/* ═══════════════════════════════════════════════
          SECTION 2 — SHOP BY CATEGORY
          ═══════════════════════════════════════════════ */}
      <section id="shop-by-category" className="py-14 sm:py-20 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Centered Section Title */}
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-2xl sm:text-3xl md:text-4xl text-[#1E141B] font-bold uppercase tracking-[0.06em]">
              Shop by Category
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
            {STYLES_LIST.map((styleName) => (
              <div
                key={styleName}
                onClick={() => {
                  console.log('[HomePage] Selected Shop by Category:', styleName);
                  navigateTo('shop', null, null, null, null, styleName);
                }}
                className="group cursor-pointer"
              >
                {/* Card Image */}
                <div className="relative aspect-[3/4] overflow-hidden bg-stone-100 mb-2.5 shadow-sm border border-stone-200/80">
                  <img
                    src={STYLE_IMAGES[styleName]}
                    alt={styleName}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </div>
                {/* Card Label */}
                <h4 className="text-xs sm:text-[13px] font-bold text-[#1E141B] uppercase tracking-wider text-center group-hover:text-[#7A0648] transition-colors duration-200">
                  {styleName}
                </h4>
              </div>
            ))}
          </div>

        </div>
      </section>


      {/* ═══════════════════════════════════════════════
          SECTION 3 — SHOP BY WORK
          ═══════════════════════════════════════════════ */}
      <section id="shop-by-work" className="py-14 sm:py-20 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Centered Section Title */}
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-2xl sm:text-3xl md:text-4xl text-[#1E141B] font-bold uppercase tracking-[0.06em]">
              Shop by Work
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
            {WORKS_LIST.map((workName) => (
              <div
                key={workName}
                onClick={() => {
                  console.log('[HomePage] Selected Shop by Work:', workName);
                  navigateTo('shop', null, null, null, null, null, workName);
                }}
                className="group cursor-pointer"
              >
                {/* Card Image */}
                <div className="relative aspect-[3/4] overflow-hidden bg-stone-100 mb-2.5 shadow-sm border border-stone-200/80">
                  <img
                    src={WORK_IMAGES[workName]}
                    alt={workName}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </div>
                {/* Card Label */}
                <h4 className="text-xs sm:text-[13px] font-bold text-[#1E141B] uppercase tracking-wider text-center group-hover:text-[#7A0648] transition-colors duration-200 capitalize">
                  {workName}
                </h4>
              </div>
            ))}
          </div>

        </div>
      </section>


      {/* ═══════════════════════════════════════════════
          SECTION 4 — 2. SHAILA / SHAWL
          ═══════════════════════════════════════════════ */}
      {shailaProducts.length > 0 && (
        <section id="shaila-shawl-section" className="py-14 sm:py-20 bg-white border-t border-stone-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 sm:mb-14">
              <div className="text-center sm:text-left">
                <div className="text-[11px] tracking-[0.25em] uppercase font-bold text-[#7A0648] mb-1.5">
                  Haute Drapes & Accessories
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl text-[#1E141B] font-bold uppercase tracking-[0.06em]">
                  SHAILA / SHAWL
                </h2>
              </div>
              <button
                onClick={() => navigateTo('shop', null, 'Shaila/Shawl')}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-[#7A0648] hover:text-[#5E0336] transition-colors cursor-pointer group"
              >
                <span>View All Shailas</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
              {shailaProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}


      {/* ═══════════════════════════════════════════════
          SECTION 5 — 3. HIJAAB
          ═══════════════════════════════════════════════ */}
      {hijabProducts.length > 0 && (
        <section id="hijab-section" className="py-14 sm:py-20 bg-[#FAF8F5] border-t border-stone-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 sm:mb-14">
              <div className="text-center sm:text-left">
                <div className="text-[11px] tracking-[0.25em] uppercase font-bold text-[#7A0648] mb-1.5">
                  Niqabs, Caps, Gloves & Essential Sets
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl text-[#1E141B] font-bold uppercase tracking-[0.06em]">
                  HIJAAB
                </h2>
              </div>
              <button
                onClick={() => navigateTo('shop', null, 'Hijaab')}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-[#7A0648] hover:text-[#5E0336] transition-colors cursor-pointer group"
              >
                <span>View All Hijaabs</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
              {hijabProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}


      {/* ═══════════════════════════════════════════════
          SECTION 6 — 4. INNER & PRAYER DRESS
          ═══════════════════════════════════════════════ */}
      {innerPrayerProducts.length > 0 && (
        <section id="inner-prayer-section" className="py-14 sm:py-20 bg-white border-t border-stone-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 sm:mb-14">
              <div className="text-center sm:text-left">
                <div className="text-[11px] tracking-[0.25em] uppercase font-bold text-[#7A0648] mb-1.5">
                  Comfort Underdresses & Blessed Prayer Wear
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl text-[#1E141B] font-bold uppercase tracking-[0.06em]">
                  INNER & PRAYER DRESS
                </h2>
              </div>
              <button
                onClick={() => navigateTo('shop', null, 'Inner and Prayer dress')}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-[#7A0648] hover:text-[#5E0336] transition-colors cursor-pointer group"
              >
                <span>View All Inners & Prayer Wear</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
              {innerPrayerProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}


      {/* ═══════════════════════════════════════════════
          SECTION 7 — 5. KIDS ABAYA
          ═══════════════════════════════════════════════ */}
      {kidsProducts.length > 0 && (
        <section id="kids-abaya-section" className="py-14 sm:py-20 bg-[#FAF8F5] border-t border-stone-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 sm:mb-14">
              <div className="text-center sm:text-left">
                <div className="text-[11px] tracking-[0.25em] uppercase font-bold text-[#7A0648] mb-1.5">
                  Gentle Modest Cuts for Little Princesses
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl text-[#1E141B] font-bold uppercase tracking-[0.06em]">
                  KIDS ABAYA
                </h2>
              </div>
              <button
                onClick={() => navigateTo('shop', null, 'Kids abaya')}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-[#7A0648] hover:text-[#5E0336] transition-colors cursor-pointer group"
              >
                <span>View All Kids Abayas</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
              {kidsProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}


      {/* ═══════════════════════════════════════════════
          SECTION 8 — 6. WHOLESALE
          ═══════════════════════════════════════════════ */}
      {wholesaleProducts.length > 0 && (
        <section id="wholesale-section" className="py-14 sm:py-20 bg-white border-t border-stone-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 sm:mb-14">
              <div className="text-center sm:text-left">
                <div className="text-[11px] tracking-[0.25em] uppercase font-bold text-[#7A0648] mb-1.5">
                  B2B Boutique Supply & Bulk Orders
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl text-[#1E141B] font-bold uppercase tracking-[0.06em]">
                  WHOLESALE
                </h2>
              </div>
              <button
                onClick={() => navigateTo('shop', null, 'WHOLESALE')}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-[#7A0648] hover:text-[#5E0336] transition-colors cursor-pointer group"
              >
                <span>Explore Wholesale Catalog</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
              {wholesaleProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
