import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Upload,
  Image as ImageIcon,
  Plus,
  Trash2,
  Check,
  Sparkles,
  Palette,
  AlertCircle,
  Scissors,
  Eye,
  Layers,
  Save,
  CheckCircle2,
  Globe,
  Tag,
  DollarSign,
  Info,
  ExternalLink,
  Star,
  Edit,
  X,
  MessageSquareQuote,
  User
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
import { useShop } from '../../context/ShopContext';
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

export default function AdminProductEditor({
  product = null,
  onSave,
  onCancel
}) {
  const { formatPrice, selectedMarket: userMarket } = useShop();
  const isEditing = Boolean(product && product.id);

  // Form State
  const [name, setName] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [price, setPrice] = useState('180');
  const [priceInr, setPriceInr] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [category, setCategory] = useState('Abaya');
  const [color, setColor] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [wholesaleType, setWholesaleType] = useState('Simple/Basic');
  const [wholesaleMinQty, setWholesaleMinQty] = useState(10);
  const [customCategory, setCustomCategory] = useState('');
  const [badge, setBadge] = useState('');
  const [targetRegion, setTargetRegion] = useState('all'); // 'all' | 'india' | 'arab'
  const [rating, setRating] = useState('4.8');
  const [reviewsCount, setReviewsCount] = useState('74');
  const [stockCount, setStockCount] = useState(12);

  // Media State
  const [image, setImage] = useState('');
  const [gallery, setGallery] = useState([]);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);

  // Silhouettes / Styles State
  const [styles, setStyles] = useState(['Open abaya']);
  const [defaultStyle, setDefaultStyle] = useState('Open abaya');

  // Works / Craftsmanship State
  const [works, setWorks] = useState(['Plain/Basic']);
  const [defaultWork, setDefaultWork] = useState('Plain/Basic');

  // Sizes are fixed to the standard abaya chart

  // Editorial fields (subtitle + fabric / styling / care)
  const [fabricDetails, setFabricDetails] = useState('');
  const [stylingAdvice, setStylingAdvice] = useState('');
  const [careInstructions, setCareInstructions] = useState('');

  // Reviews State
  const [reviews, setReviews] = useState([]);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [editingReviewIndex, setEditingReviewIndex] = useState(null);
  const [reviewForm, setReviewForm] = useState({
    author: '',
    location: '',
    rating: 5,
    date: 'Verified Buyer • Today',
    title: '',
    comment: ''
  });

  // UI state
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Active section scroll tracking
  const [activeSection, setActiveSection] = useState('identity');

  // Initialize or populate form
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (product) {
      setName(product.name || '');
      setSubtitle(product.subtitle || '');
      setPrice(product.price !== undefined ? String(product.price) : '');
      setPriceInr(product.priceInr != null ? String(product.priceInr) : '');
      setOriginalPrice(product.originalPrice ? String(product.originalPrice) : '');
      setCategory(product.category || 'Abaya');
      setColor(product.color || (Array.isArray(product.colors) && product.colors[0]?.name) || (typeof product.colors === 'string' ? product.colors : '') || '');
      setSubcategory(product.subcategory || '');
      setWholesaleType(product.wholesaleType || 'Simple/Basic');
      setWholesaleMinQty(product.wholesaleMinQty !== undefined ? Number(product.wholesaleMinQty) : 10);
      setCustomCategory('');
      setBadge(product.badge || '');
      setTargetRegion(product.targetRegion || 'all');
      setRating(product.rating !== undefined ? String(product.rating) : '5.0');
      setReviewsCount(product.reviewsCount !== undefined ? String(product.reviewsCount) : '0');
      setImage(product.image || '');
      setGallery(Array.isArray(product.gallery) && product.gallery.length > 0 ? product.gallery : (product.image ? [product.image] : []));
      setStyles(Array.isArray(product.styles) && product.styles.length > 0 ? product.styles : [product.defaultStyle || ABAYA_STYLES[0].name]);
      setDefaultStyle(product.defaultStyle || ABAYA_STYLES[0].name);
      setWorks(Array.isArray(product.works) && product.works.length > 0 ? product.works : [product.defaultWork || ABAYA_WORKS[0].name]);
      setDefaultWork(product.defaultWork || ABAYA_WORKS[0].name);
      setFabricDetails(product.fabricDetails || '');
      setStylingAdvice(product.stylingAdvice || '');
      setCareInstructions(product.careInstructions || '');
      setReviews(Array.isArray(product.reviews) && product.reviews.length > 0 ? product.reviews : (Array.isArray(product.reviewsList) ? product.reviewsList : []));
    } else {
      // Pristine defaults for new product
      setName('');
      setSubtitle('');
      setPrice('');
      setPriceInr('');
      setOriginalPrice('');
      setCategory('Abaya');
      setColor('');
      setSubcategory('');
      setWholesaleType('Simple/Basic');
      setWholesaleMinQty(10);
      setCustomCategory('');
      setBadge('');
      setTargetRegion('all');
      setRating('4.8');
      setReviewsCount('74');
      setImage('');
      setGallery([]);
      setStyles(ABAYA_STYLES.map(s => s.name));
      setDefaultStyle('Open abaya');
      setWorks(ABAYA_WORKS.map(w => w.name));
      setDefaultWork('Plain/Basic');
      setFabricDetails('');
      setStylingAdvice('');
      setCareInstructions('');
      setStockCount(12);
      setReviews([]);
    }
  }, [product]);

  // Unified Images Upload
  const [directUrlInput, setDirectUrlInput] = useState('');

  const handleImagesUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    console.log('[AdminProductEditor] handleImagesUpload triggered with files:', files.map(f => ({ name: f.name, size: f.size, type: f.type })));
    if (files.length === 0) return;
    setIsUploadingGallery(true);
    setErrorMessage('');
    try {
      for (const file of files) {
        console.log('[AdminProductEditor] Uploading file:', file.name);
        const { url, error } = await uploadProductImage(file, 'product');
        console.log('[AdminProductEditor] Upload result for', file.name, '=> url:', url, 'error:', error);
        if (url) {
          setGallery(prev => {
            const next = [...prev, url];
            return next;
          });
          setImage(prev => prev || url);
        } else if (error) {
          console.error('[AdminProductEditor] Upload error:', error);
          setErrorMessage(`Upload error: ${error}`);
        }
      }
    } catch (err) {
      console.error('[AdminProductEditor] Exception during images upload:', err);
      setErrorMessage('Failed to upload some photos.');
    } finally {
      setIsUploadingGallery(false);
    }
  };

  const handleAddDirectUrl = (e) => {
    e?.preventDefault?.();
    const trimmed = directUrlInput.trim();
    if (!trimmed) return;
    setGallery(prev => [...prev, trimmed]);
    setImage(prev => prev || trimmed);
    setDirectUrlInput('');
  };

  const removeGalleryImage = (indexToRemove) => {
    const removedUrl = gallery[indexToRemove];
    const updated = gallery.filter((_, idx) => idx !== indexToRemove);
    setGallery(updated);
    if (image === removedUrl) {
      setImage(updated[0] || '');
    }
  };

  const setAsMainImage = (url) => {
    setImage(url);
  };

  // Review Handlers
  const handleOpenAddReview = () => {
    setEditingReviewIndex(null);
    setReviewForm({
      author: '',
      location: '',
      rating: 5,
      date: 'Verified Buyer • Today',
      title: '',
      comment: ''
    });
    setIsReviewModalOpen(true);
  };

  const handleOpenEditReview = (index) => {
    const rev = reviews[index];
    if (!rev) return;
    setEditingReviewIndex(index);
    setReviewForm({
      author: rev.author || '',
      location: rev.location || '',
      rating: Number(rev.rating) || 5,
      date: rev.date || 'Verified Buyer',
      title: rev.title || '',
      comment: rev.comment || ''
    });
    setIsReviewModalOpen(true);
  };

  const handleSaveReview = (e) => {
    e.preventDefault();
    if (!reviewForm.author.trim() || !reviewForm.comment.trim()) {
      alert('Please enter both reviewer name and review comment.');
      return;
    }

    const reviewPayload = {
      id: editingReviewIndex !== null && reviews[editingReviewIndex]?.id ? reviews[editingReviewIndex].id : Date.now(),
      author: reviewForm.author.trim(),
      location: reviewForm.location.trim(),
      rating: Number(reviewForm.rating) || 5,
      date: reviewForm.date.trim() || 'Verified Buyer • Today',
      title: reviewForm.title.trim(),
      comment: reviewForm.comment.trim()
    };

    if (editingReviewIndex !== null) {
      setReviews(prev => prev.map((r, idx) => idx === editingReviewIndex ? reviewPayload : r));
    } else {
      setReviews(prev => [reviewPayload, ...prev]);
    }
    setIsReviewModalOpen(false);
  };

  const handleDeleteReview = (index) => {
    setReviews(prev => prev.filter((_, idx) => idx !== index));
  };

  // Save Submission
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!name.trim()) {
      setErrorMessage('Product title is required.');
      scrollToSection('identity');
      return;
    }
    const needsAed = targetRegion === 'arab' || targetRegion === 'all';
    const needsInr = targetRegion === 'india' || targetRegion === 'all';
    if (needsAed && (!price || isNaN(Number(price)) || Number(price) <= 0)) {
      setErrorMessage('Please enter a valid AED price.');
      scrollToSection('pricing');
      return;
    }
    if (needsInr && (!priceInr || isNaN(Number(priceInr)) || Number(priceInr) <= 0)) {
      setErrorMessage('Please enter a valid INR price.');
      scrollToSection('pricing');
      return;
    }

    setIsSaving(true);
    setErrorMessage('');

    const fallbackImage = image.trim() || (gallery.length > 0 ? gallery[0] : getAssetUrl('collection-images/work_others.jpg'));

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
      category: category.trim() || 'Abaya',
      color: color.trim(),
      badge: badge.trim(),
      targetRegion: targetRegion || 'all',
      reviews: reviews,
      reviewsCount: Number(reviewsCount) || 74,
      rating: reviews.length > 0
        ? Number((reviews.reduce((acc, r) => acc + (Number(r.rating) || 4.8), 0) / reviews.length).toFixed(1))
        : (Number(rating) || 4.8),
      defaultStyle: defaultStyle ? defaultStyle.trim() : null,
      defaultWork: defaultWork ? defaultWork.trim() : null,
      styles: defaultStyle ? [defaultStyle.trim()] : (styles.length > 0 ? styles : []),
      works: defaultWork ? [defaultWork.trim()] : (works.length > 0 ? works : []),
      wholesaleType: category === 'Wholesale' ? (wholesaleType ? wholesaleType.trim() : null) : null,
      wholesaleMinQty: category === 'Wholesale' ? Number(wholesaleMinQty) || 1 : 1,
      image: fallbackImage,
      gallery: gallery.length > 0 ? gallery : [fallbackImage],
      sizes: ABAYA_SIZE_LABELS,
      description: '',
      fabricDetails: fabricDetails.trim(),
      stylingAdvice: stylingAdvice.trim(),
      careInstructions: careInstructions.trim()
    };

    console.group(`%c[AdminProductEditor 💾] Saving Product: "${productPayload.name}"`, 'color: #982476; font-weight: bold;');
    console.log('Product Category:', productPayload.category);
    console.log('Wholesale Sub-Type:', productPayload.wholesaleType);
    console.log('Wholesale MOQ:', productPayload.wholesaleMinQty);
    console.log('Target Region / Audience:', productPayload.targetRegion);
    console.log('Full Payload:', productPayload);
    if (productPayload.category === 'Wholesale' && productPayload.targetRegion === 'arab') {
      console.warn(
        `%c[AdminProductEditor ⚠️ NOTE] You are saving this Wholesale product with Target Audience = "Arab / UAE (AED)".\n` +
        `It will ONLY be visible when users browse in AED (Arab region).\n` +
        `Users browsing from India (INR) will NOT see it unless Target Audience is set to "Global / All Markets" with an INR price.`,
        'background: #fff3cd; color: #856404; font-weight: bold; padding: 4px;'
      );
    }
    console.groupEnd();
    try {
      await onSave(productPayload);
      console.log('%c[AdminProductEditor] ✅ onSave completed successfully!', 'color: #16a34a; font-weight: bold;');
    } catch (err) {
      console.error('[AdminProductEditor] Error during onSave:', err);
      setErrorMessage(err.message || 'Failed to save product listing.');
      setIsSaving(false);
    }
  };

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = -120;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const showAedPrice = targetRegion === 'arab' || targetRegion === 'all';
  const showInrPrice = targetRegion === 'india' || targetRegion === 'all';

  return (
    <div className="min-h-screen bg-[#fff7fc] pb-24 animate-fade-in text-on-background">

      {/* ── Sticky Top Action Bar ── */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-secondary/20 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">

          {/* Left: Back Link & Breadcrumb */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={onCancel}
              type="button"
              className="p-2 sm:px-3.5 sm:py-2 rounded-xl border border-secondary/30 bg-stone-50 hover:bg-surface-container text-stone-700 font-semibold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title="Return to Product Catalog"
            >
              <ArrowLeft className="w-4 h-4 text-royal-violet" />
              <span className="hidden sm:inline">Back to Catalog</span>
            </button>

            <div className="h-5 w-px bg-stone-200 hidden sm:block" />

            <div>
              <h1 className="font-serif text-lg sm:text-xl font-bold text-stone-900 truncate max-w-[280px] sm:max-w-md">
                {name || (isEditing ? 'Edit Abaya' : 'New Abaya')}
              </h1>
            </div>
          </div>

          {/* Right: Quick Actions */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onCancel}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
            >
              Discard
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSaving}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-primary via-royal-violet to-primary text-white text-xs font-semibold uppercase tracking-wider hover:opacity-95 transition-all shadow-luxury flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5 text-gold-soft" />
                  <span>{isEditing ? 'Save Changes' : 'Publish Abaya'}</span>
                </>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* ── Main Studio Layout ── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">

        {errorMessage && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs sm:text-sm flex items-center gap-3 shadow-xs">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
            <div className="flex-1 font-medium">{errorMessage}</div>
          </div>
        )}

        {/* 1. Basic Identity, Category Style & Work */}
        <div id="identity" className="bg-white rounded-3xl p-6 sm:p-7 border border-secondary/20 shadow-subtle space-y-6">
          <div className="border-b border-surface-container-highest pb-4">
            <h2 className="font-serif text-lg font-bold text-stone-900">Abaya Identity, Category Style & Work</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                Creation Title *
              </label>
              <input
                type="text"
                required
                placeholder="Abaya name..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-secondary/30 bg-[#fff9fd] focus:bg-white focus:outline-none focus:ring-2 focus:ring-royal-violet/40 text-sm font-semibold text-stone-900"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                Subtitle / Tagline
              </label>
              <p className="text-[11px] text-stone-400 font-medium">
                Short line under the title, or a longer intro shown in &quot;About This Piece&quot;. Pair with Fabric &amp; Styling fields below.
              </p>
              <textarea
                rows={3}
                placeholder="e.g. Premium Korean Nidha · Thread & Stone Work — or a brief product intro"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-secondary/30 bg-[#fff9fd] focus:bg-white focus:outline-none focus:ring-2 focus:ring-royal-violet/40 text-xs sm:text-sm text-stone-800 leading-relaxed"
              />
            </div>

            {/* Product Color (Manually Entered) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Product Color (Manually Entered)
                </label>
                <span className="text-[11px] text-stone-400 font-medium">Shown as a section on product page</span>
              </div>
              <input
                type="text"
                placeholder="e.g. Midnight Espresso, Royal Violet, Onyx Black, Dusty Rose..."
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-secondary/30 bg-[#fff9fd] focus:bg-white focus:outline-none focus:ring-2 focus:ring-royal-violet/40 text-xs sm:text-sm text-stone-800 font-medium"
              />
            </div>

            {/* 1. Primary Category Selector (Fixed Select Dropdown) */}
            <div className="space-y-1.5 pt-1">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-800">
                Primary Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-secondary/30 bg-[#fff9fd] focus:bg-white focus:outline-none focus:ring-2 focus:ring-royal-violet/40 text-xs sm:text-sm font-bold text-stone-900 cursor-pointer shadow-xs"
              >
                {PRESET_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Sub-Classifications / Styles / Craftsmanship (Only shown when Category is strictly Abaya) */}
            {category.trim().toLowerCase() === 'abaya' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 p-4 bg-stone-50/70 border border-stone-200 rounded-2xl animate-fade-in">
                {/* Category Style (Silhouette) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-800">
                    Category Style (Silhouette)
                  </label>
                  <select
                    value={defaultStyle || 'Open abaya'}
                    onChange={(e) => {
                      const newStyle = e.target.value;
                      setDefaultStyle(newStyle);
                      setStyles([newStyle]);
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-secondary/30 bg-white focus:outline-none focus:ring-2 focus:ring-royal-violet/40 text-xs sm:text-sm font-bold text-stone-900 cursor-pointer shadow-xs"
                  >
                    {ABAYA_STYLES.map(style => (
                      <option key={style.id} value={style.name}>
                        {style.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Craftsmanship / Work */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-800">
                    Craftsmanship / Work
                  </label>
                  <select
                    value={defaultWork || 'Plain/Basic'}
                    onChange={(e) => {
                      const newWork = e.target.value;
                      setDefaultWork(newWork);
                      setWorks([newWork]);
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-secondary/30 bg-white focus:outline-none focus:ring-2 focus:ring-royal-violet/40 text-xs sm:text-sm font-bold text-stone-900 cursor-pointer shadow-xs"
                  >
                    {ABAYA_WORKS.map(work => (
                      <option key={work.id} value={work.name}>
                        {work.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {category === 'Wholesale' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 p-4 bg-[#FFD700]/10 border border-[#FFD700]/40 rounded-2xl animate-fade-in">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-900">
                    Wholesale Sub-Type
                  </label>
                  <select
                    value={wholesaleType || WHOLESALE_TYPES[0]?.name || 'Simple/Basic'}
                    onChange={(e) => setWholesaleType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-secondary/30 bg-white text-xs sm:text-sm font-bold text-stone-900 cursor-pointer shadow-xs"
                  >
                    {WHOLESALE_TYPES.map(t => (
                      <option key={t.id} value={t.name}>{t.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-900">
                    Wholesale Minimum Order Qty (MOQ)
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={wholesaleMinQty}
                    onChange={(e) => setWholesaleMinQty(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-secondary/30 bg-white text-xs sm:text-sm font-bold text-stone-900"
                    placeholder="10"
                  />
                </div>
              </div>
            )}

            <div className="pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Editorial Badge
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    placeholder="Enter custom badge (e.g. Signature Bestseller, Limited Edition...)"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-secondary/30 bg-[#fff9fd] focus:bg-white focus:outline-none focus:ring-2 focus:ring-royal-violet/40 text-xs sm:text-sm font-semibold text-stone-800"
                  />
                  <select
                    value={PRESET_BADGES.includes(badge) ? badge : ''}
                    onChange={(e) => {
                      if (e.target.value !== undefined) setBadge(e.target.value);
                    }}
                    className="px-3 py-2.5 rounded-xl border border-secondary/30 bg-white text-xs font-semibold text-stone-700 cursor-pointer shrink-0"
                  >
                    <option value="">No Badge / Preset</option>
                    {PRESET_BADGES.filter(b => b).map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Rating & Reviews Count */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                  Star Rating (1.0 – 5.0)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="1.0"
                  max="5.0"
                  placeholder="5.0"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-secondary/30 bg-[#fff9fd] focus:bg-white focus:outline-none focus:ring-2 focus:ring-royal-violet/40 text-xs sm:text-sm font-semibold text-stone-800"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                  Reviews Count
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  placeholder="0"
                  value={reviewsCount}
                  onChange={(e) => setReviewsCount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-secondary/30 bg-[#fff9fd] focus:bg-white focus:outline-none focus:ring-2 focus:ring-royal-violet/40 text-xs sm:text-sm font-semibold text-stone-800"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 2. Pricing & Regional Audience */}
        <div id="pricing" className="bg-white rounded-3xl p-6 sm:p-7 border border-secondary/20 shadow-subtle space-y-6">
          <div className="border-b border-surface-container-highest pb-4">
            <h2 className="font-serif text-lg font-bold text-stone-900">Pricing & Regional Market</h2>
          </div>

          <div className="space-y-5">
            <div className={`grid grid-cols-1 ${showAedPrice && showInrPrice ? 'sm:grid-cols-2' : ''} gap-4`}>
              {showAedPrice && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                    Retail Price (AED د.إ) *
                  </label>
                  <div className="flex rounded-xl border border-secondary/30 bg-[#fff9fd] focus-within:bg-white focus-within:ring-2 focus-within:ring-royal-violet/40 overflow-hidden transition-all">
                    <span className="inline-flex items-center px-3.5 bg-stone-100/80 text-xs font-bold text-stone-600 border-r border-secondary/20 select-none">
                      AED
                    </span>
                    <input
                      type="number"
                      required={showAedPrice}
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

              {showInrPrice && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                    Retail Price (INR ₹) *
                  </label>
                  <div className="flex rounded-xl border border-secondary/30 bg-[#fff9fd] focus-within:bg-white focus-within:ring-2 focus-within:ring-royal-violet/40 overflow-hidden transition-all">
                    <span className="inline-flex items-center px-3.5 bg-stone-100/80 text-xs font-bold text-stone-600 border-r border-secondary/20 select-none">
                      ₹
                    </span>
                    <input
                      type="number"
                      required={showInrPrice}
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
            </div>

            {/* Target Audience Selector */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                Target Audience / Regional Display Rule
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setTargetRegion('all')}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${targetRegion === 'all'
                      ? 'border-royal-violet bg-royal-violet/5 ring-2 ring-royal-violet/20 shadow-xs'
                      : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50'
                    }`}
                >
                  <span className="text-xs font-bold text-stone-900">Global / All Markets</span>
                  {targetRegion === 'all' && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-royal-violet bg-royal-violet/15 px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setTargetRegion('india')}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${targetRegion === 'india'
                      ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20 shadow-xs'
                      : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50'
                    }`}
                >
                  <span className="text-xs font-bold text-stone-900">India (INR ₹)</span>
                  {targetRegion === 'india' && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setTargetRegion('arab')}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${targetRegion === 'arab'
                      ? 'border-amber-600 bg-amber-50/70 ring-2 ring-amber-500/20 shadow-xs'
                      : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50'
                    }`}
                >
                  <span className="text-xs font-bold text-stone-900">Arab / UAE (AED)</span>
                  {targetRegion === 'arab' && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Unified Product Images */}
        <div id="media" className="bg-white rounded-3xl p-6 sm:p-7 border border-secondary/20 shadow-subtle space-y-6">
          <div className="border-b border-surface-container-highest pb-4 flex items-center justify-between">
            <div>
              <h2 className="font-serif text-lg font-bold text-stone-900">Product Photography ({gallery.length})</h2>
            </div>

            <label className="px-4 py-2 rounded-xl bg-royal-violet text-white text-xs font-bold cursor-pointer hover:bg-royal-violet/90 transition-all flex items-center gap-2 shadow-2xs">
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Photos</span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImagesUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Upload Dropzone & Direct URL Row */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            <label className="sm:col-span-7 flex items-center justify-center gap-3 p-4 border-2 border-dashed border-royal-violet/30 hover:border-royal-violet bg-royal-violet/5 hover:bg-royal-violet/10 rounded-2xl cursor-pointer transition-all text-center group">
              <Upload className="w-5 h-5 text-royal-violet group-hover:-translate-y-0.5 transition-transform" />
              <div className="text-left">
                <span className="text-xs font-bold text-stone-900 block">Click or Drop photos here</span>
                <span className="text-[11px] text-stone-500">Supports multiple JPG, PNG, WEBP files</span>
              </div>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImagesUpload}
                className="hidden"
              />
            </label>

            <div className="sm:col-span-5 flex items-center gap-2">
              <input
                type="url"
                placeholder="Or paste image URL..."
                value={directUrlInput}
                onChange={(e) => setDirectUrlInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddDirectUrl();
                  }
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-secondary/30 bg-[#fff9fd] text-xs font-mono"
              />
              <button
                type="button"
                onClick={handleAddDirectUrl}
                className="px-3.5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold whitespace-nowrap cursor-pointer transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          {isUploadingGallery && (
            <div className="p-3 bg-royal-violet/10 border border-royal-violet/20 rounded-xl text-royal-violet text-xs font-semibold flex items-center gap-2 animate-pulse">
              <span className="w-3.5 h-3.5 border-2 border-royal-violet border-t-transparent rounded-full animate-spin" />
              <span>Uploading photos to cloud storage...</span>
            </div>
          )}

          {/* Photos Grid */}
          {gallery.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              {gallery.map((url, idx) => {
                const isMain = image === url || (!image && idx === 0);
                return (
                  <div
                    key={idx}
                    className={`relative aspect-[3/4] rounded-2xl bg-surface-container overflow-hidden border-2 transition-all group shadow-xs ${isMain ? 'border-royal-violet ring-2 ring-royal-violet/30' : 'border-secondary/20 hover:border-royal-violet/50'
                      }`}
                  >
                    <img src={url} alt={`Product angle ${idx + 1}`} className="w-full h-full object-cover" />

                    {isMain && (
                      <div className="absolute top-2 left-2 px-2.5 py-1 rounded-lg bg-royal-violet text-white text-[10px] font-bold uppercase tracking-wider shadow">
                        Main Cover
                      </div>
                    )}

                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                      <span className="text-[10px] text-white font-bold bg-black/60 px-2 py-0.5 rounded self-start">
                        Photo #{idx + 1}
                      </span>

                      <div className="flex items-center justify-between gap-1.5">
                        {!isMain && (
                          <button
                            type="button"
                            onClick={() => setAsMainImage(url)}
                            className="text-[11px] bg-white text-stone-900 px-2.5 py-1 rounded-lg font-bold shadow hover:bg-stone-100 cursor-pointer"
                          >
                            Set as Cover
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(idx)}
                          className="p-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 ml-auto cursor-pointer"
                          title="Remove photo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 px-4 border border-dashed border-stone-200 rounded-2xl text-stone-400">
              <ImageIcon className="w-10 h-10 mx-auto mb-2 opacity-30 text-stone-500" />
              <p className="text-xs font-semibold text-stone-600">No photos uploaded yet</p>
              <p className="text-[11px] text-stone-400 mt-0.5">Upload product photos or paste image links above</p>
            </div>
          )}
        </div>

        {/* 4. Sizes */}
        <div id="sizes" className="bg-white rounded-3xl p-6 sm:p-7 border border-secondary/20 shadow-subtle space-y-4">
          <div className="border-b border-surface-container-highest pb-4">
            <h2 className="font-serif text-lg font-bold text-stone-900">Abaya Lengths & Sizing</h2>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                Standard Abaya Sizes (Fixed)
              </label>
              <span className="text-[11px] text-stone-400 font-medium">All products use the Noor al dhuha size chart</span>
            </div>

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

            <div className="flex flex-wrap gap-2 pt-1">
              {ABAYA_SIZE_LABELS.map((label) => (
                <span
                  key={label}
                  className="px-3 py-1.5 rounded-xl bg-primary/10 text-primary border border-primary/20 text-xs font-bold"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 4. Narrative & Care */}
        <div id="editorial" className="bg-white rounded-3xl p-6 sm:p-7 border border-secondary/20 shadow-subtle space-y-6">
          <div className="border-b border-surface-container-highest pb-4">
            <h2 className="font-serif text-lg font-bold text-stone-900">Product Details & Care</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                Fabric Details & Density
              </label>
              <p className="text-[11px] text-stone-400 font-medium">
                Shown as Fabric in &quot;About This Piece&quot; (e.g. Premium Korean Nidha).
              </p>
              <textarea
                rows={2}
                value={fabricDetails}
                onChange={(e) => setFabricDetails(e.target.value)}
                placeholder="Premium Korean Nidha"
                className="w-full px-4 py-2.5 rounded-2xl border border-secondary/30 bg-[#fff9fd] focus:bg-white focus:outline-none focus:ring-2 focus:ring-royal-violet/40 text-xs sm:text-sm leading-relaxed text-stone-800"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                Styling & Atelier Advice
              </label>
              <p className="text-[11px] text-stone-400 font-medium">
                Design, Fit, Style, Occasion lines — shown in &quot;About This Piece&quot;.
              </p>
              <textarea
                rows={4}
                value={stylingAdvice}
                onChange={(e) => setStylingAdvice(e.target.value)}
                placeholder={`Design: Elegant back detailing with delicate embellishments\nFit: Flowing, graceful and modest\nStyle: Sophisticated, luxurious & effortlessly elegant\nOccasion: Perfect for everyday elegance, gatherings & special events`}
                className="w-full px-4 py-2.5 rounded-2xl border border-secondary/30 bg-[#fff9fd] focus:bg-white focus:outline-none focus:ring-2 focus:ring-royal-violet/40 text-xs sm:text-sm leading-relaxed text-stone-800"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                Garment Care Instructions
              </label>
              <textarea
                rows={2}
                value={careInstructions}
                onChange={(e) => setCareInstructions(e.target.value)}
                placeholder="Dry clean or gentle hand wash cold with pH-neutral silk detergent. Lay flat on dry towel..."
                className="w-full px-4 py-2.5 rounded-2xl border border-secondary/30 bg-[#fff9fd] focus:bg-white focus:outline-none focus:ring-2 focus:ring-royal-violet/40 text-xs sm:text-sm leading-relaxed text-stone-800"
              />
            </div>
          </div>
        </div>

        {/* 5. Customer Reviews Section */}
        <div id="reviews" className="bg-white rounded-3xl p-6 sm:p-7 border border-secondary/20 shadow-subtle space-y-6">
          <div className="border-b border-surface-container-highest pb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-lg font-bold text-stone-900">Customer Reviews ({reviews.length})</h2>
                {reviews.length > 0 && (
                  <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-xs font-bold text-amber-900">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>{(reviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0) / reviews.length).toFixed(1)}</span>
                  </div>
                )}
              </div>
              <p className="text-xs text-stone-500">Manage real customer reviews and testimonials displayed on this product page</p>
            </div>

            {!isReviewModalOpen && (
              <button
                type="button"
                onClick={handleOpenAddReview}
                className="px-4 py-2 rounded-xl bg-royal-violet hover:bg-royal-violet/90 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Review</span>
              </button>
            )}
          </div>

          {/* Inline Add / Edit Review Form */}
          {isReviewModalOpen && (
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#fff7fc] to-[#fff1f9] border-2 border-royal-violet/30 shadow-subtle space-y-4 animate-fade-in">
              <div className="flex items-center justify-between border-b border-royal-violet/20 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-royal-violet text-white flex items-center justify-center font-bold text-xs">
                    <Star className="w-3.5 h-3.5 fill-white text-white" />
                  </div>
                  <h3 className="font-serif text-base font-bold text-stone-900">
                    {editingReviewIndex !== null ? 'Edit Customer Review' : 'Add New Customer Review'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="p-1 rounded-lg hover:bg-black/5 text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveReview} className="space-y-4">
                {/* Rating Picker */}
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                    Rating (Stars)
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((starNum) => (
                      <button
                        key={starNum}
                        type="button"
                        onClick={() => setReviewForm(prev => ({ ...prev, rating: starNum }))}
                        className="p-0.5 cursor-pointer transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            starNum <= Number(reviewForm.rating)
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-stone-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-stone-700 ml-2">
                      {reviewForm.rating} / 5 Stars
                    </span>
                  </div>
                </div>

                {/* Author & Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                      Customer Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Fatima Al-Mansoor"
                      value={reviewForm.author}
                      onChange={(e) => setReviewForm(prev => ({ ...prev, author: e.target.value }))}
                      className="w-full px-3.5 py-2 rounded-xl border border-secondary/30 bg-white focus:bg-white text-xs sm:text-sm font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-royal-violet/40"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                      City / Country
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Dubai, UAE or London, UK"
                      value={reviewForm.location}
                      onChange={(e) => setReviewForm(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full px-3.5 py-2 rounded-xl border border-secondary/30 bg-white text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-royal-violet/40"
                    />
                  </div>
                </div>

                {/* Review Title & Date Tag */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                      Review Title / Headline
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Flawless Silk Drape & Tailoring"
                      value={reviewForm.title}
                      onChange={(e) => setReviewForm(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3.5 py-2 rounded-xl border border-secondary/30 bg-white text-xs sm:text-sm font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-royal-violet/40"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                      Verification Badge / Date
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Verified Buyer • 3 days ago"
                      value={reviewForm.date}
                      onChange={(e) => setReviewForm(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full px-3.5 py-2 rounded-xl border border-secondary/30 bg-white text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-royal-violet/40"
                    />
                  </div>
                </div>

                {/* Review Comment */}
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                    Review Comment / Body *
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Write the customer's testimonial or feedback..."
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                    className="w-full px-3.5 py-2 rounded-xl border border-secondary/30 bg-white text-xs sm:text-sm leading-relaxed text-stone-800 focus:outline-none focus:ring-2 focus:ring-royal-violet/40"
                  />
                </div>

                {/* Inline Action Buttons */}
                <div className="flex items-center justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsReviewModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-secondary/30 bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-royal-violet hover:bg-royal-violet/90 text-white text-xs font-bold cursor-pointer transition-all shadow-xs"
                  >
                    {editingReviewIndex !== null ? 'Save Changes' : 'Publish Review'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Reviews List */}
          {reviews.length > 0 ? (
            <div className="space-y-3">
              {reviews.map((rev, idx) => (
                <div
                  key={rev.id || idx}
                  className="p-4 sm:p-5 rounded-2xl bg-surface-container-low border border-surface-container hover:border-royal-violet/30 transition-all flex flex-col sm:flex-row items-start justify-between gap-4 group"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-stone-400" />
                        {rev.author}
                      </span>
                      {rev.location && (
                        <span className="text-xs text-stone-500">({rev.location})</span>
                      )}
                      <div className="flex items-center text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < (Number(rev.rating) || 5)
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-stone-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                        {rev.date || 'Verified Buyer'}
                      </span>
                    </div>

                    {rev.title && (
                      <h4 className="text-xs sm:text-sm font-bold text-stone-800">&ldquo;{rev.title}&rdquo;</h4>
                    )}

                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">{rev.comment}</p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-start pt-1 sm:pt-0">
                    <button
                      type="button"
                      onClick={() => handleOpenEditReview(idx)}
                      className="px-3 py-1.5 rounded-xl border border-secondary/30 bg-white hover:bg-stone-50 text-stone-700 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
                    >
                      <Edit className="w-3.5 h-3.5 text-royal-violet" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteReview(idx)}
                      className="p-1.5 rounded-xl text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      title="Delete review"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 px-4 border border-dashed border-stone-200 rounded-2xl text-stone-400 space-y-1">
              <MessageSquareQuote className="w-9 h-9 mx-auto mb-1 opacity-30 text-stone-500" />
              <p className="text-xs font-semibold text-stone-600">No customer reviews yet</p>
              <p className="text-[11px] text-stone-400">Click &apos;+ Add Review&apos; above to publish real client testimonials for this piece.</p>
            </div>
          )}
        </div>

        {/* Bottom Actions Bar */}
        <div className="flex items-center justify-between pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-3 rounded-2xl border border-secondary/30 bg-white hover:bg-stone-50 text-stone-700 text-xs font-bold transition-all shadow-2xs cursor-pointer"
          >
            ← Return to Catalog
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSaving}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-primary via-royal-violet to-primary text-white text-xs font-bold uppercase tracking-wider hover:opacity-95 transition-all shadow-luxury flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Publishing Abaya...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4 text-gold-soft" />
                <span>{isEditing ? 'Save Changes' : 'Publish Abaya to Catalog'}</span>
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
}
