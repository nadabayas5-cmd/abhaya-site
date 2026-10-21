import React, { useState, useEffect } from 'react';
import {
  X,
  Upload,
  Image as ImageIcon,
  Plus,
  Trash2,
  Check,
  Sparkles,
  Layers,
  Palette,
  AlertCircle,
  HelpCircle,
  Scissors,
  Star
} from 'lucide-react';
import {
  MAIN_CATEGORIES,
  ABAYA_STYLES,
  ABAYA_WORKS,
  ABAYA_SIZES,
  ABAYA_SIZE_LABELS,
  WHOLESALE_TYPES
} from '../../data/products';
import { uploadProductImage } from '../../lib/supabase';
import { getAssetUrl } from '../../lib/cms';

const PRESET_CATEGORIES = ['Abaya', 'Shaila/Shawl', 'Hijab', 'Inner & Prayer dress', 'Kids abaya', 'Wholesale'];
const PRESET_BADGES = ['', 'Signature Bestseller', 'Limited Edition', 'Staff Pick', 'Artisan Atelier', 'Trending', 'Exclusive'];

const LUXURY_PALETTE_PRESETS = [
  { name: 'Midnight Espresso', hex: '#2E1C1A' },
  { name: 'Royal Violet', hex: '#982476' },
  { name: 'Plum Noir', hex: '#260A22' },
  { name: 'Amethyst Soft', hex: '#C76AA9' },
  { name: 'Lavender Mist', hex: '#D4C5DD' },
  { name: 'Dusty Rose', hex: '#C49A99' },
  { name: 'Antique Blush', hex: '#E2C3C1' },
  { name: 'Serene Sage', hex: '#7D8B79' },
  { name: 'Ivory Pearl', hex: '#FBF6EE' },
  { name: 'Oat Cream', hex: '#ECE2D4' },
  { name: 'Charcoal Slate', hex: '#3D3F43' },
  { name: 'Pure Onyx', hex: '#111111' }
];

export default function AdminProductModal({
  isOpen,
  onClose,
  product = null,
  onSave
}) {
  const isEditing = Boolean(product && product.id);

  // Form State
  const [name, setName] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [price, setPrice] = useState('');
  const [priceInr, setPriceInr] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [category, setCategory] = useState('Abaya');
  const [subcategory, setSubcategory] = useState('');
  const [wholesaleType, setWholesaleType] = useState('Simple/Basic');
  const [wholesaleMinQty, setWholesaleMinQty] = useState(10);
  const [customCategory, setCustomCategory] = useState('');
  const [badge, setBadge] = useState('');
  const [targetRegion, setTargetRegion] = useState('all'); // 'all' | 'india' | 'arab'
  const [rating, setRating] = useState('4.8');
  const [reviewsCount, setReviewsCount] = useState('74');
  const [isVioletEdition, setIsVioletEdition] = useState(false);
  const [stockCount, setStockCount] = useState(10);
  
  // Media State
  const [image, setImage] = useState('');
  const [gallery, setGallery] = useState([]);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);

  // Colors State
  const [color, setColor] = useState('');
  const [colors, setColors] = useState([
    { name: 'Midnight Espresso', hex: '#2E1C1A', imageIndex: 0 }
  ]);

  // Silhouettes / Styles State
  const [styles, setStyles] = useState(['Open abaya']);
  const [defaultStyle, setDefaultStyle] = useState(ABAYA_STYLES[0].name);

  // Works / Craftsmanship State
  const [works, setWorks] = useState(['Plain/Basic']);
  const [defaultWork, setDefaultWork] = useState('Plain/Basic');

  // Sizes are fixed to the standard abaya chart

  // Editorial fields
  const [fabricDetails, setFabricDetails] = useState('');
  const [stylingAdvice, setStylingAdvice] = useState('');
  const [careInstructions, setCareInstructions] = useState('');

  // UI Tabs inside modal
  const [activeTab, setActiveTab] = useState('basic'); // 'basic' | 'media' | 'variants' | 'editorial'
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Populate form on product change
  useEffect(() => {
    if (product) {
      setName(product.name || '');
      setSubtitle(product.subtitle || '');
      setPrice(product.price !== undefined ? String(product.price) : '');
      setPriceInr(product.priceInr != null ? String(product.priceInr) : '');
      setOriginalPrice(product.originalPrice ? String(product.originalPrice) : '');
      if (PRESET_CATEGORIES.includes(product.category)) {
        setCategory(product.category);
        setCustomCategory('');
      } else {
        setCategory('Other');
        setCustomCategory(product.category || '');
      }
      setSubcategory(product.subcategory || '');
      setWholesaleType(product.wholesaleType || 'Simple/Basic');
      setWholesaleMinQty(product.wholesaleMinQty !== undefined ? Number(product.wholesaleMinQty) : 10);
      setBadge(product.badge || '');
      setTargetRegion(product.targetRegion || 'all');
      setRating(product.rating !== undefined ? String(product.rating) : '5.0');
      setReviewsCount(product.reviewsCount !== undefined ? String(product.reviewsCount) : '0');
      setIsVioletEdition(Boolean(product.isVioletEdition));
      setStockCount(product.stockCount ?? 10);
      setImage(product.image || '');
      setGallery(Array.isArray(product.gallery) && product.gallery.length > 0 ? product.gallery : (product.image ? [product.image] : []));
      setColor(product.color || (Array.isArray(product.colors) && product.colors[0]?.name) || (typeof product.colors === 'string' ? product.colors : '') || '');
      setColors(Array.isArray(product.colors) && product.colors.length > 0 ? product.colors : [{ name: 'Midnight Espresso', hex: '#2E1C1A', imageIndex: 0 }]);
      setStyles(Array.isArray(product.styles) && product.styles.length > 0 ? product.styles : [product.defaultStyle || ABAYA_STYLES[0].name]);
      setDefaultStyle(product.defaultStyle || ABAYA_STYLES[0].name);
      setWorks(Array.isArray(product.works) && product.works.length > 0 ? product.works : [product.defaultWork || ABAYA_WORKS[0].name]);
      setDefaultWork(product.defaultWork || ABAYA_WORKS[0].name);
      setFabricDetails(product.fabricDetails || '');
      setStylingAdvice(product.stylingAdvice || '');
      setCareInstructions(product.careInstructions || '');
    } else {
      // Reset to pristine defaults
      setName('');
      setSubtitle('');
      setPrice('');
      setOriginalPrice('');
      setColor('');
      setCategory('Abaya');
      setSubcategory('');
      setWholesaleType('Simple/Basic');
      setWholesaleMinQty(10);
      setCustomCategory('');
      setBadge('');
      setTargetRegion('all');
      setRating('4.8');
      setReviewsCount('74');
      setIsVioletEdition(false);
      setStockCount(10);
      setImage('');
      setGallery([]);
      setColors([]);
      setStyles(['Open abaya']);
      setDefaultStyle('Open abaya');
      setWorks(['Plain/Basic']);
      setDefaultWork('Plain/Basic');
      setFabricDetails('');
      setStylingAdvice('');
      setCareInstructions('');
      setPriceInr('');
    }
    setActiveTab('basic');
    setErrorMessage('');
  }, [product, isOpen]);

  if (!isOpen) return null;

  // Handle Main Hero Image Upload
  const handleMainImageUpload = async (e) => {
    const file = e.target.files?.[0];
    console.log('[AdminProductModal] handleMainImageUpload triggered:', file?.name);
    if (!file) return;
    setIsUploadingImage(true);
    setErrorMessage('');
    try {
      const { url, error } = await uploadProductImage(file, 'hero');
      console.log('[AdminProductModal] Main image upload result:', { url, error });
      if (error || !url) {
        setErrorMessage(`Image upload failed: ${error || 'Unknown error'}`);
      }
      if (url) {
        setImage(url);
        if (!gallery.includes(url)) {
          setGallery(prev => [url, ...prev]);
        }
      }
    } catch (err) {
      console.error('[AdminProductModal] Exception uploading main image:', err);
      setErrorMessage(`Failed to upload image: ${err.message || 'Unknown error'}`);
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Handle Additional Gallery Image Upload
  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    console.log('[AdminProductModal] handleGalleryUpload triggered with files:', files.map(f => f.name));
    if (files.length === 0) return;
    setIsUploadingGallery(true);
    setErrorMessage('');
    try {
      for (const file of files) {
        const { url, error } = await uploadProductImage(file, 'gallery');
        console.log('[AdminProductModal] Gallery upload result for', file.name, '=>', { url, error });
        if (url) {
          setGallery(prev => [...prev, url]);
        } else if (error) {
          setErrorMessage(`Gallery upload error: ${error}`);
        }
      }
    } catch (err) {
      console.error('[AdminProductModal] Exception uploading gallery images:', err);
      setErrorMessage(`Some gallery images could not be uploaded: ${err.message || 'Unknown error'}`);
    } finally {
      setIsUploadingGallery(false);
    }
  };

  const removeGalleryImage = (indexToRemove) => {
    setGallery(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const setAsMainImage = (url) => {
    setImage(url);
  };



  // Style Toggle
  const toggleStyle = (styleName) => {
    if (styles.includes(styleName)) {
      if (styles.length > 1) {
        setStyles(styles.filter(s => s !== styleName));
        if (defaultStyle === styleName) {
          const remaining = styles.filter(s => s !== styleName);
          setDefaultStyle(remaining[0] || 'Open abaya');
        }
      }
    } else {
      setStyles([...styles, styleName]);
    }
  };

  // Work Toggle
  const toggleWork = (workName) => {
    if (works.includes(workName)) {
      if (works.length > 1) {
        setWorks(works.filter(w => w !== workName));
        if (defaultWork === workName) {
          const remaining = works.filter(w => w !== workName);
          setDefaultWork(remaining[0] || 'plain');
        }
      }
    } else {
      setWorks([...works, workName]);
    }
  };

  // Save Submission
  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage('Product title is required.');
      setActiveTab('basic');
      return;
    }
    const needsAed = targetRegion === 'arab' || targetRegion === 'all';
    const needsInr = targetRegion === 'india' || targetRegion === 'all';
    if (needsAed && (!price || isNaN(Number(price)) || Number(price) <= 0)) {
      setErrorMessage('Please enter a valid AED price.');
      setActiveTab('basic');
      return;
    }
    if (needsInr && (!priceInr || isNaN(Number(priceInr)) || Number(priceInr) <= 0)) {
      setErrorMessage('Please enter a valid INR price.');
      setActiveTab('basic');
      return;
    }

    setIsSaving(true);
    setErrorMessage('');

    const fallbackImage = image.trim() || (gallery.length > 0 ? gallery[0] : getAssetUrl('collection-images/work_others.jpg'));

    // Generate unique slug id if new
    const finalCategory = category === 'Other' ? (customCategory.trim() || 'Abaya') : (category || 'Abaya');
    const slugId = isEditing
      ? product.id
      : name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '') + `-${Date.now().toString().slice(-4)}`;

    const productPayload = {
      id: slugId,
      name: name.trim(),
      subtitle: subtitle.trim(),
      price: needsAed ? Number(price) : 0,
      priceInr: needsInr ? Number(priceInr) : null,
      originalPrice: originalPrice ? Number(originalPrice) : null,
      category: finalCategory,
      subcategory: subcategory ? subcategory.trim() : null,
      wholesaleType: finalCategory === 'Wholesale' ? (wholesaleType ? wholesaleType.trim() : null) : null,
      wholesaleMinQty: finalCategory === 'Wholesale' ? Number(wholesaleMinQty) || 1 : 1,
      badge: badge.trim(),
      targetRegion: targetRegion || 'all',
      rating: Number(rating) || 4.8,
      reviewsCount: Number(reviewsCount) || 74,
      isVioletEdition,
      defaultStyle: defaultStyle ? defaultStyle.trim() : null,
      defaultWork: defaultWork ? defaultWork.trim() : null,
      styles: defaultStyle ? [defaultStyle.trim()] : (styles.length > 0 ? styles : []),
      works: defaultWork ? [defaultWork.trim()] : (works.length > 0 ? works : []),
      image: fallbackImage,
      gallery: gallery.length > 0 ? gallery : [fallbackImage],
      color: color.trim(),
      colors,
      sizes: ABAYA_SIZE_LABELS,
      stockCount: Number(stockCount) || 10,
      description: '',
      fabricDetails: fabricDetails.trim(),
      stylingAdvice: stylingAdvice.trim(),
      careInstructions: careInstructions.trim()
    };

    console.group(`%c[AdminProductModal 💾] Saving Product: "${productPayload.name}"`, 'color: #982476; font-weight: bold;');
    console.log('Product Category:', productPayload.category);
    console.log('Wholesale Sub-Type:', productPayload.wholesaleType);
    console.log('Wholesale MOQ:', productPayload.wholesaleMinQty);
    console.log('Target Region / Audience:', productPayload.targetRegion);
    console.log('Full Payload:', productPayload);
    if (productPayload.category === 'Wholesale' && productPayload.targetRegion === 'arab') {
      console.warn(
        `%c[AdminProductModal ⚠️ NOTE] You are saving this Wholesale product with Target Audience = "Arab / UAE (AED)".\n` +
        `It will ONLY be visible when users browse in AED (Arab region).\n` +
        `Users browsing from India (INR) will NOT see it unless Target Audience is set to "Global / All Markets" with an INR price.`,
        'background: #fff3cd; color: #856404; font-weight: bold; padding: 4px;'
      );
    }
    console.groupEnd();

    try {
      await onSave(productPayload);
      console.log('%c[AdminProductModal] ✅ onSave completed successfully!', 'color: #16a34a; font-weight: bold;');
      onClose();
    } catch (err) {
      setErrorMessage(err.message || 'Failed to save product.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-[#fff7fc] rounded-2xl w-full max-w-4xl shadow-2xl border border-secondary/20 flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-6 py-4.5 bg-white border-b border-surface-container-highest flex items-center justify-between shrink-0">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] font-semibold text-royal-violet">
              <Sparkles className="w-3.5 h-3.5 text-gold-accent" />
              <span>{isEditing ? 'Bespoke Item Editor' : 'New Haute Couture Creation'}</span>
            </div>
            <h2 className="font-serif text-xl sm:text-2xl text-primary font-medium">
              {isEditing ? `Edit: ${name || 'Product'}` : 'Create New Abaya Listing'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-surface-container text-stone-500 hover:text-stone-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-surface-container-highest bg-[#fff9fd] px-6 gap-2 sm:gap-6 overflow-x-auto shrink-0">
          {[
            { id: 'basic', label: '1. Basic Info & Pricing' },
            { id: 'media', label: '2. Images & Gallery' },
            { id: 'variants', label: '3. Lengths & Sizing' },
            { id: 'editorial', label: '4. Editorial & Care' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 text-xs sm:text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'border-royal-violet text-royal-violet font-semibold'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form Body (Scrollable) */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* TAB 1: BASIC INFO */}
          {activeTab === 'basic' && (
            <div className="space-y-5 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Midnight Espresso Silk Abaya"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-secondary/30 bg-white focus:outline-none focus:ring-2 focus:ring-royal-violet/30 text-sm font-medium"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                    Subtitle / Tagline
                  </label>
                  <p className="text-[11px] text-stone-400 font-medium">
                    Tagline or intro for the product page. Pair with Fabric &amp; Styling fields in Editorial tab.
                  </p>
                  <textarea
                    rows={2}
                    placeholder="e.g. Premium Korean Nidha · Thread & Stone Work"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-secondary/30 bg-white focus:outline-none focus:ring-2 focus:ring-royal-violet/30 text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                    Product Color (Manually Entered)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Midnight Espresso, Royal Violet, Pure Black..."
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-secondary/30 bg-white focus:outline-none focus:ring-2 focus:ring-royal-violet/30 text-sm"
                  />
                </div>

                {(targetRegion === 'arab' || targetRegion === 'all') && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                      Price (AED د.إ) *
                    </label>
                    <div className="flex rounded-xl border border-secondary/30 bg-[#fff9fd] focus-within:bg-white focus-within:ring-2 focus-within:ring-royal-violet/40 overflow-hidden transition-all">
                      <span className="inline-flex items-center px-3.5 bg-stone-100/80 text-xs font-bold text-stone-600 border-r border-secondary/20 select-none">
                        AED
                      </span>
                      <input
                        type="number"
                        required
                        min="1"
                        step="1"
                        placeholder="650"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-transparent focus:outline-none text-sm font-bold text-stone-900"
                      />
                    </div>
                  </div>
                )}

                {(targetRegion === 'india' || targetRegion === 'all') && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                      Price (INR ₹) *
                    </label>
                    <div className="flex rounded-xl border border-secondary/30 bg-[#fff9fd] focus-within:bg-white focus-within:ring-2 focus-within:ring-royal-violet/40 overflow-hidden transition-all">
                      <span className="inline-flex items-center px-3.5 bg-stone-100/80 text-xs font-bold text-stone-600 border-r border-secondary/20 select-none">
                        ₹
                      </span>
                      <input
                        type="number"
                        required
                        min="1"
                        step="1"
                        placeholder="4200"
                        value={priceInr}
                        onChange={(e) => setPriceInr(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-transparent focus:outline-none text-sm font-bold text-stone-900"
                      />
                    </div>
                  </div>
                )}

                {/* Target Audience / Market Selection */}
                <div className="space-y-2 col-span-full">
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 block">
                    Target Market / Audience *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setTargetRegion('india')}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        targetRegion === 'india'
                          ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20 shadow-xs'
                          : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xl">🇮🇳</span>
                        {targetRegion === 'india' && <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">Active</span>}
                      </div>
                      <div className="mt-2">
                        <div className="text-xs font-bold text-stone-900">India Users Only</div>
                        <div className="text-[11px] text-stone-500">Priced & shown in INR (₹)</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTargetRegion('arab')}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        targetRegion === 'arab'
                          ? 'border-amber-600 bg-amber-50/70 ring-2 ring-amber-500/20 shadow-xs'
                          : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xl">🇦🇪</span>
                        {targetRegion === 'arab' && <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">Active</span>}
                      </div>
                      <div className="mt-2">
                        <div className="text-xs font-bold text-stone-900">Arab & UAE Users</div>
                        <div className="text-[11px] text-stone-500">Priced & shown in AED (د.إ)</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTargetRegion('all')}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        targetRegion === 'all'
                          ? 'border-royal-violet bg-royal-violet/5 ring-2 ring-royal-violet/20 shadow-xs'
                          : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xl">🌐</span>
                        {targetRegion === 'all' && <span className="text-[10px] font-bold uppercase tracking-wider text-royal-violet bg-royal-violet/15 px-2 py-0.5 rounded-full">Active</span>}
                      </div>
                      <div className="mt-2">
                        <div className="text-xs font-bold text-stone-900">Both / Global Market</div>
                        <div className="text-[11px] text-stone-500">Shown in both INR & AED</div>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                    Primary Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-secondary/30 bg-white focus:outline-none focus:ring-2 focus:ring-royal-violet/30 text-sm font-medium cursor-pointer"
                  >
                    {PRESET_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {category === 'Wholesale' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 bg-amber-50/60 border border-amber-200 rounded-xl">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                        Wholesale Sub-Type
                      </label>
                      <select
                        value={wholesaleType}
                        onChange={(e) => setWholesaleType(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-secondary/30 bg-white text-xs font-bold"
                      >
                        {WHOLESALE_TYPES.map(t => (
                          <option key={t.id} value={t.name}>{t.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                        Minimum Order Qty (MOQ)
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={wholesaleMinQty}
                        onChange={(e) => setWholesaleMinQty(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-lg border border-secondary/30 bg-white text-xs font-bold"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                    Editorial Badge (Optional)
                  </label>
                  <select
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-secondary/30 bg-white focus:outline-none focus:ring-2 focus:ring-royal-violet/30 text-sm"
                  >
                    {PRESET_BADGES.map(b => (
                      <option key={b} value={b}>{b ? b : 'None (No badge)'}</option>
                    ))}
                  </select>
                </div>

                {/* Rating & Reviews Count */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span>Star Rating (1.0 – 5.0)</span>
                    </span>
                    <span className="text-[10px] text-stone-400 font-normal">e.g. 4.9</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1.0"
                    max="5.0"
                    placeholder="5.0"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-secondary/30 bg-white focus:outline-none focus:ring-2 focus:ring-royal-violet/30 text-sm font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 flex items-center justify-between">
                    <span>Reviews Count</span>
                    <span className="text-[10px] text-stone-400 font-normal">e.g. 128</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    placeholder="0"
                    value={reviewsCount}
                    onChange={(e) => setReviewsCount(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-secondary/30 bg-white focus:outline-none focus:ring-2 focus:ring-royal-violet/30 text-sm font-medium"
                  />
                </div>
              </div>

              {/* Badges & Special Features */}
              <div className="p-4 rounded-xl bg-white border border-secondary/20 space-y-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-700 block">
                  Promotions & Capsule Flags
                </span>
                <div>
                  <label className="flex items-center gap-3 p-3 rounded-xl border border-surface-container hover:bg-surface-container-low cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={isVioletEdition}
                      onChange={(e) => setIsVioletEdition(e.target.checked)}
                      className="w-4 h-4 text-royal-violet rounded focus:ring-royal-violet"
                    />
                    <div>
                      <div className="text-xs font-semibold text-royal-violet">The Violet Edition Capsule</div>
                      <div className="text-[11px] text-stone-500">Appears in dedicated Violet Edition lookbook</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: IMAGES & GALLERY */}
          {activeTab === 'media' && (
            <div className="space-y-6 animate-fade-in">
              {/* Primary Image Upload */}
              <div className="p-5 rounded-2xl bg-white border border-secondary/20 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-primary">Primary Hero Image *</h3>
                    <p className="text-xs text-stone-500">The main image displayed across catalog and product cards</p>
                  </div>
                  {isUploadingImage && <span className="text-xs text-royal-violet animate-pulse font-medium">Uploading to Supabase...</span>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  <div className="sm:col-span-4 aspect-[3/4] rounded-xl bg-surface-container overflow-hidden border border-secondary/20 relative group flex items-center justify-center">
                    {image ? (
                      <img src={image} alt="Hero preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center p-4 text-stone-400">
                        <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <span className="text-xs">No image selected</span>
                      </div>
                    )}
                  </div>

                  <div className="sm:col-span-8 space-y-3">
                    <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-royal-violet/40 rounded-xl hover:bg-royal-violet/5 cursor-pointer transition-colors text-center">
                      <Upload className="w-6 h-6 text-royal-violet mb-2" />
                      <span className="text-xs font-semibold text-primary">Click to upload photo to Supabase Storage</span>
                      <span className="text-[10px] text-stone-500 mt-1">Supports PNG, JPG, WEBP up to 10MB</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleMainImageUpload}
                        className="hidden"
                      />
                    </label>

                    <div className="space-y-1">
                      <span className="text-[11px] font-medium text-stone-600">Or Paste Direct Image URL:</span>
                      <input
                        type="url"
                        placeholder="https://..."
                        value={image}
                        onChange={(e) => {
                          setImage(e.target.value);
                          if (!gallery.includes(e.target.value)) {
                            setGallery(prev => [e.target.value, ...prev]);
                          }
                        }}
                        className="w-full px-3.5 py-2 rounded-lg border border-secondary/30 bg-white text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Gallery Images */}
              <div className="p-5 rounded-2xl bg-white border border-secondary/20 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-primary">Multi-Angle Gallery & Lookbook</h3>
                    <p className="text-xs text-stone-500">Additional angles, craftsmanship closeups, and drape photos</p>
                  </div>
                  <label className="px-3 py-1.5 rounded-lg bg-royal-violet/10 hover:bg-royal-violet/20 text-royal-violet text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5" />
                    <span>Upload Angles</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleGalleryUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {isUploadingGallery && (
                  <p className="text-xs text-royal-violet animate-pulse font-medium">Uploading gallery images...</p>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {gallery.map((url, idx) => (
                    <div key={idx} className="relative aspect-[3/4] rounded-xl bg-surface-container overflow-hidden border border-secondary/20 group">
                      <img src={url} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                      
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                        <span className="text-[10px] text-white bg-black/60 px-1.5 py-0.5 rounded self-start">
                          Index #{idx}
                        </span>
                        
                        <div className="flex items-center justify-between gap-1">
                          {image !== url && (
                            <button
                              type="button"
                              onClick={() => setAsMainImage(url)}
                              className="text-[10px] bg-white text-primary px-2 py-1 rounded font-medium shadow hover:bg-stone-100"
                            >
                              Make Hero
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => removeGalleryImage(idx)}
                            className="p-1 rounded bg-red-600 text-white hover:bg-red-700 ml-auto"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {image === url && (
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-royal-violet text-white text-[9px] font-semibold uppercase tracking-wider shadow">
                          Main Hero
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: LENGTHS & SIZING */}
          {activeTab === 'variants' && (
            <div className="space-y-6 animate-fade-in">

              {/* Fixed Standard Sizes */}
              <div className="p-5 rounded-2xl bg-white border border-secondary/20 space-y-3">
                <h3 className="text-sm font-semibold text-primary">Standard Abaya Sizes (Fixed)</h3>
                <p className="text-xs text-stone-500">All products use the Noor al dhuha abaya size chart.</p>
                <div className="overflow-x-auto rounded-xl border border-secondary/20">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-100 uppercase tracking-wider text-[10px] text-stone-700 font-bold">
                      <tr>
                        <th className="p-2.5 border-b border-stone-200">Size &amp; (No)</th>
                        <th className="p-2.5 border-b border-stone-200">Height</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200">
                      {ABAYA_SIZES.filter((size) => size.size !== 'Custom').map((size) => (
                        <tr key={size.size}>
                          <td className="p-2.5 font-bold text-primary">{size.name} {size.size}</td>
                          <td className="p-2.5 text-stone-600">{size.height}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex flex-wrap gap-2">
                  {ABAYA_SIZE_LABELS.map((label) => (
                    <span
                      key={label}
                      className="px-3 py-1.5 rounded-xl bg-primary/10 text-primary border border-primary/20 text-xs font-medium"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: EDITORIAL & CARE */}
          {activeTab === 'editorial' && (
            <div className="space-y-4 animate-fade-in">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                  Fabric Details & Density
                </label>
                <textarea
                  rows={2}
                  value={fabricDetails}
                  onChange={(e) => setFabricDetails(e.target.value)}
                  placeholder="Premium Korean Nidha"
                  className="w-full px-4 py-2.5 rounded-xl border border-secondary/30 bg-white focus:outline-none focus:ring-2 focus:ring-royal-violet/30 text-xs sm:text-sm leading-relaxed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                  Styling & Atelier Advice
                </label>
                <p className="text-[11px] text-stone-400 font-medium">
                  Design, Fit, Style, Occasion lines for &quot;About This Piece&quot;.
                </p>
                <textarea
                  rows={4}
                  value={stylingAdvice}
                  onChange={(e) => setStylingAdvice(e.target.value)}
                  placeholder={`Design: Elegant back detailing with delicate embellishments\nFit: Flowing, graceful and modest\nStyle: Sophisticated, luxurious & effortlessly elegant\nOccasion: Perfect for everyday elegance, gatherings & special events`}
                  className="w-full px-4 py-2.5 rounded-xl border border-secondary/30 bg-white focus:outline-none focus:ring-2 focus:ring-royal-violet/30 text-xs sm:text-sm leading-relaxed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                  Care Instructions
                </label>
                <textarea
                  rows={2}
                  value={careInstructions}
                  onChange={(e) => setCareInstructions(e.target.value)}
                  placeholder="Dry clean or gentle hand wash cold with pH-neutral silk detergent. Lay flat on dry towel..."
                  className="w-full px-4 py-2.5 rounded-xl border border-secondary/30 bg-white focus:outline-none focus:ring-2 focus:ring-royal-violet/30 text-xs sm:text-sm leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-4 border-t border-surface-container-highest flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-secondary/30 hover:bg-surface-container text-stone-700 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>

            <div className="flex items-center gap-3">
              {activeTab !== 'basic' && (
                <button
                  type="button"
                  onClick={() => {
                    if (activeTab === 'media') setActiveTab('basic');
                    if (activeTab === 'variants') setActiveTab('media');
                    if (activeTab === 'editorial') setActiveTab('variants');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-stone-700 text-xs font-medium"
                >
                  Previous Step
                </button>
              )}

              {activeTab !== 'editorial' ? (
                <button
                  type="button"
                  onClick={() => {
                    if (activeTab === 'basic') setActiveTab('media');
                    else if (activeTab === 'media') setActiveTab('variants');
                    else if (activeTab === 'variants') setActiveTab('editorial');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-royal-violet text-white text-xs font-semibold hover:bg-royal-violet/90 transition-colors shadow"
                >
                  Next Step &rarr;
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary via-royal-violet to-primary text-white text-xs font-semibold tracking-wider uppercase hover:opacity-95 transition-all shadow-luxury flex items-center gap-2"
                >
                  {isSaving ? (
                    <span>Saving to Supabase...</span>
                  ) : (
                    <>
                      <Check className="w-4 h-4 text-gold-soft" />
                      <span>{isEditing ? 'Save Changes' : 'Publish Abaya'}</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </form>

      </div>
    </div>
  );
}
