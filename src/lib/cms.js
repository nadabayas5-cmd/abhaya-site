import { supabase, isSupabaseConfigured } from './supabase';

// ─────────────────────────────────────────────────────────────────────────────
// DEFAULT CONTENT — used if Supabase/localStorage are empty so site never breaks
// ─────────────────────────────────────────────────────────────────────────────

export function getAssetUrl(path) {
  if (!path || typeof path !== 'string') return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:') || path.startsWith('blob:')) {
    return path;
  }

  const rawBase = (typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL) || '/';
  const base = rawBase.endsWith('/') ? rawBase : `${rawBase}/`;
  const baseTrimmed = base.replace(/^\/+|\/+$/g, '');

  let clean = path.trim();

  // Strip repeated or duplicated base path or repo names (e.g. /abhaya-site/abhaya-site/...)
  if (baseTrimmed) {
    const dupRegex = new RegExp(`^(\\/?${baseTrimmed}\\/)+`, 'i');
    clean = clean.replace(dupRegex, '');
  }

  clean = clean.replace(/^\/+/, '');
  return `${base}${clean}`;
}

export const DEFAULT_CONTENT = {
  announcement: {
    enabled: true,
    leftText: 'Complimentary Silk Gift Box on Orders $150+',
    centerBadge: 'The Violet Edition:',
    centerText: 'Limited Mulberry Silk & Amethyst Drapes',
    rightBadge: 'Worldwide Express',
    thresholdAmount: 150,
  },

  hero_slides: [
    {
      id: 1,
      badge: 'NEW ARRIVAL',
      title: 'Midnight Espresso Silk',
      description: 'Iridescent 100% Grade 6A mulberry silk, a whisper of pure haute couture on your skin.',
      image: getAssetUrl('hero-images/hero_midnight_espresso_silk.jpg'),
      cta: 'SHOP NOW',
      productId: 'midnight-espresso-silk',
    },
    {
      id: 2,
      badge: 'AUTUMN / WINTER EDITION',
      title: 'Royal Amethyst Chiffon',
      description: 'Bold, regal tones woven from Japanese pebble georgette for effortless everyday luxury.',
      image: getAssetUrl('hero-images/hero_royal_amethyst_chiffon.jpg'),
      cta: 'EXPLORE COLLECTION',
      productId: 'royal-violet-silk',
    },
    {
      id: 3,
      badge: 'SIGNATURE BESPOKE',
      title: 'Austrian Modal Jersey',
      description: 'Cloud-soft micro-modal weave that stays flawlessly in place without undercaps or pins.',
      image: getAssetUrl('hero-images/hero_austrian_modal_jersey.jpg'),
      cta: 'DISCOVER MODAL',
      productId: 'sage-haven-modal',
    },
  ],

  testimonials: [
    {
      id: 1,
      review: 'I am continually amazed by how majestic these bespoke abayas drape once worn. The pure silk Farasha with delicate stonework is pure perfection, and I received non-stop compliments at every event.',
      author: 'Sarah Al-Mansoor',
      location: 'Dubai',
    },
    {
      id: 2,
      review: 'The Austrian Modal Jersey Abaya in Kimono cut has completely elevated my wardrobe. Incredibly breathable, fluid movement, and the packaging feels like opening high jewellery.',
      author: 'Priya Nair',
      location: 'London',
    },
    {
      id: 3,
      review: 'NOOR AL DHUHA Atelier brings true Parisian and Milanese haute couture standards to modest fashion. From the magnetic keepsake box to the pure mulberry silk sheen, it is unmatched.',
      author: 'Tania Rahman',
      location: 'Toronto',
    },
  ],

  newsletter: {
    badge: 'EXCLUSIVE ATELIER ACCESS',
    title: 'Receive Editorial Privileges & First Access',
    subtitle: 'Sign up for private capsule lookbooks, secret archive previews, and bespoke styling advice.',
    ctaText: 'Subscribe',
  },

  features_section: [
    {
      id: 1,
      badge: 'EXCLUSIVE PRIVILEGE',
      badgeColor: 'text-royal-violet',
      title: 'Complimentary Silk Keepsake Box',
      description: 'Signature presentation box with every creation',
      link: 'offers',
    },
    {
      id: 2,
      badge: 'COMPLIMENTARY ACCESSORY',
      badgeColor: 'text-emerald-700',
      title: 'Matching Shayla & Silk Keepsake Box',
      description: 'Included complimentary with every abaya creation',
      link: 'shop',
    },
    {
      id: 3,
      badge: 'BESPOKE CONCIERGE',
      badgeColor: 'text-secondary',
      title: 'Personal Styling & Sizing',
      description: 'Consult with our master atelier stylist',
      link: 'contact',
    },
  ],

  story_page: {
    tagline: 'Heritage & Manifesto',
    headline: 'The House of NOOR AL DHUHA',
    subheading: '"Noor in Every Thread, Wear It with Pride."',
    about_label: 'About Us',
    about_title: 'Elegance, Precision & Accessible Luxury',
    about_text: 'At NOOR AL DHUHA, we bring you premium-quality abayas and hijabs at accessible prices. Designed with elegance and crafted with precision, our collections are trusted by both individual retail customers and wholesale partners across the region.',
    motto: 'Noor in Every Thread, Wear It with Pride.',
    genesis_label: 'The Genesis',
    genesis_title: 'Crafted in Reverence of Detail',
    genesis_paragraphs: [
      'For decades, modest fashion was forced to choose between synthetic polyester blends that slipped and snagged, or heavy fabrics that suffocated. We sought to re-imagine the bespoke abaya and modest silhouette as a piece of haute couture sculpture.',
      'We spent three years testing over 40 distinct silk weights before settling on our proprietary 19-Momme Grade 6A Mulberry Silk—which features a luminous, fluid face and a micro-textured matte reverse weave that eliminates slippage without pins.',
    ],
    stat1_value: '100%',
    stat1_label: 'Grade 6A Long-Fiber Mulberry Silk',
    stat2_value: '0%',
    stat2_label: 'Synthetic Plastic Fillers or Harsh Chemicals',
    what_we_do_label: 'What We Do',
    what_we_do_title: 'Tailored Excellence from Atelier to Wardrobe',
    services: [
      {
        icon: 'scissors',
        title: 'Bespoke Design & Craftsmanship',
        description: 'Designing and tailoring modern, high-quality abayas and modest wear.',
      },
      {
        icon: 'layers',
        title: 'Curated Contemporary Fashion',
        description: 'Offering a versatile stock of on-trend, comfortable, and elegant styles for everyday and special occasions.',
      },
      {
        icon: 'store',
        title: 'Wholesale & Retail Services',
        description: 'Providing flexible purchasing options for individual shoppers, boutique retailers, and bulk buyers across the UAE and beyond.',
      },
    ],
    mission_label: 'Mission & Vision',
    mission_title: 'Our Mission',
    mission_text: 'To empower women through stylish, comfortable, and modest clothing while delivering exceptional quality, affordability, and outstanding customer service.',
    vision_title: 'Our Vision',
    vision_text: 'To become a leading, trusted abaya and modest fashion brand across the UAE and international markets—celebrated for timeless style, superior craftsmanship, and customer satisfaction.',
    founders_label: 'Meet Our Co-Founders',
    founders_names: 'Rafique & Kamarunnisa',
    founders_role: 'Founders & Visionaries',
    founders_image: '',
    founders_quote: 'Abayas are more than just garments—they are an expression of pride, grace, and tradition.',
    founders_bio: 'For Rafique M U and Kamarunnisa K A, abayas are more than just garments—they are an expression of pride, grace, and tradition. With years of dedication to Islamic fashion, they set out to make timeless, modern designs reachable to every woman. By combining premium craftsmanship with honest, reasonable pricing, they continue to inspire confidence and bring elegant modest fashion into everyday life.',
    founders_subtext: 'Combining premium craftsmanship with honest, reasonable pricing to inspire confidence in everyday modest fashion.',
    pillars_label: 'Guiding Principles',
    pillars_title: 'The Four Pillars of NOOR AL DHUHA',
    pillars: [
      { icon: 'sparkles', title: 'Organic Fiber Purity', description: 'We use organic Mulberry silk and FSC-certified Austrian TENCEL™ modal that nurture hair and skin naturally.' },
      { icon: 'feather', title: 'Architectural Drape', description: 'Precision edge rolls and balanced weights ensure effortless hold without bunching or collapsing.' },
      { icon: 'shield', title: 'Hypoallergenic Safety', description: 'No chemical bonding agents, no formaldehyde finishing, no synthetic plasticizers — safe for the most sensitive skin.' },
      { icon: 'globe', title: 'Artisan Handcraft', description: 'Each piece is finished by hand in our certified atelier using traditional embroidery and couture stitching methods.' },
    ],
  },

  contact_info: {
    phone: '+971 56 701 3083',
    whatsapp_url: 'https://wa.me/971567013083',
    email: 'atelier@nooraldhuha.com',
    address: 'NOOR AL DHUHA Atelier, Luxury Apparel District, India',
    hours: 'Mon – Sat, 9:00 AM – 8:00 PM GST',
    faqs: [
      {
        q: 'What is Grade 6A Mulberry Silk and why is it superior?',
        a: 'Grade 6A represents the pinnacle of raw silk quality, woven from long, unbroken natural mulberry fibers. It provides unmatched featherlight drape, natural temperature regulation, hypoallergenic touch, and hair protection without slipping.',
      },
      {
        q: 'How do I care for and wash my silk & chiffon hijabs?',
        a: 'We recommend gentle hand washing in cool water with pH-neutral silk wash or delicate detergent. Lay flat on a clean towel to air dry out of direct sunlight. Use a low-temperature silk iron or garment steamer.',
      },
      {
        q: 'What are your international delivery times & shipping rates?',
        a: 'We provide express worldwide courier delivery. Domestic GCC delivery takes 1-2 business days. UK, EU, US, and international express deliveries take 3-5 business days via DHL/FedEx.',
      },
      {
        q: 'What is your exchange and return policy?',
        a: 'We offer hassle-free 14-day returns and exchanges for all unworn garments in their original keepsake packaging with security ribbon intact.',
      },
    ],
  },

  offers_page: [
    {
      id: 'welcome10',
      code: 'ELEGANCE10',
      badge: 'WELCOME OFFER',
      title: '10% Off Your First Atelier Order',
      description: 'Experience pure Grade 6A mulberry silk and bespoke modest silhouettes with an exclusive introductory privilege.',
      discount: '10% OFF',
      minSpend: 'No Minimum',
      expires: 'Ongoing',
      category: 'All',
      color: 'from-[#982476] to-[#180516]',
      accentBg: 'bg-royal-violet/10 text-royal-violet border-royal-violet/20',
    },
    {
      id: 'vip20',
      code: 'NOORVIP',
      badge: 'VIP PATRON TIER',
      title: '20% Off Luxury Silk Bundles & Ensembles',
      description: 'Enjoy elevated savings on any order of 3 or more handcrafted creations. Includes complimentary bespoke gift packaging.',
      discount: '20% OFF',
      minSpend: 'Orders above $150',
      expires: 'Valid this week',
      category: 'Silk',
      color: 'from-[#670A1E] to-[#40121C]',
      accentBg: 'bg-primary/10 text-primary border-primary/20',
    },
    {
      id: 'violet15',
      code: 'VIOLET15',
      badge: 'LIMITED EDITION',
      title: '15% Off The Royal Violet Edition Lookbook',
      description: 'Exclusive seasonal access to our signature Royal Amethyst and Deep Plum silk chiffon collections.',
      discount: '15% OFF',
      minSpend: 'Select Violet items',
      expires: 'Limited Stock',
      category: 'Violet Edition',
      color: 'from-[#982476] to-[#260A22]',
      accentBg: 'bg-amethyst-soft/10 text-royal-violet border-amethyst-soft/30',
    },
  ],

  footer_content: {
    copyright: '© 2024 NOOR AL DHUHA. ALL RIGHTS RESERVED.',
    brand_name: 'NOOR AL DHUHA',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Section metadata for Admin CMS panel display
// ─────────────────────────────────────────────────────────────────────────────
export const CMS_SECTIONS = [
  { key: 'announcement', label: 'Announcement Bar', section: 'global', icon: '📢', description: 'Top promo bar text, badge, and gift threshold' },
  { key: 'hero_slides', label: 'Hero Carousel', section: 'home', icon: '🖼️', description: 'Homepage hero slides: images, titles, badges, CTAs' },
  { key: 'features_section', label: 'Features Banner', section: 'home', icon: '✨', description: 'Three feature/promo cards below the hero' },
  { key: 'testimonials', label: 'Testimonials', section: 'home', icon: '💬', description: 'Customer review carousel on the homepage' },
  { key: 'newsletter', label: 'Newsletter Section', section: 'home', icon: '📧', description: 'VIP newsletter section title and subtitle' },
  { key: 'story_page', label: 'Our Story Page', section: 'story', icon: '📖', description: 'Heritage manifesto, paragraphs, pillars of excellence' },
  { key: 'contact_info', label: 'Contact & FAQs', section: 'contact', icon: '📞', description: 'Phone, WhatsApp, email, address, hours, FAQ Q&As' },
  { key: 'offers_page', label: 'Atelier Privileges', section: 'offers', icon: '🎁', description: 'Curated privileges, packaging, and services' },
  { key: 'footer_content', label: 'Footer', section: 'global', icon: '🔗', description: 'Copyright text and brand name' },
];

const LS_KEY = 'noor_cms_content';

// ─────────────────────────────────────────────────────────────────────────────
// Fetch all site content (Supabase → localStorage → defaults)
// ─────────────────────────────────────────────────────────────────────────────
export async function fetchAllSiteContent() {
  console.log('[CMS DB] fetchAllSiteContent called. isSupabaseConfigured:', isSupabaseConfigured);
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('key, content');

      if (error) {
        console.error('[CMS DB ERROR] Failed to fetch site_content from Supabase:', error);
      } else if (data && data.length > 0) {
        console.log(`[CMS DB SUCCESS] Loaded ${data.length} CMS sections from Supabase table 'site_content':`, data);
        const result = {};
        for (const row of data) {
          result[row.key] = row.content;
        }
        // Merge with defaults to guarantee all keys exist
        const merged = mergeWithDefaults(result);
        try { localStorage.setItem(LS_KEY, JSON.stringify(merged)); } catch (_) {}
        return merged;
      } else {
        console.warn('[CMS DB] site_content table is empty (0 rows).');
      }
    } catch (err) {
      console.error('[CMS DB CATCH] Network or query error:', err);
    }
  }

  // Fallback: localStorage
  try {
    const saved = localStorage.getItem(LS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      console.log('[CMS DB FALLBACK] Loaded CMS content from localStorage:', parsed);
      return mergeWithDefaults(parsed);
    }
  } catch (_) {}

  console.log('[CMS DB FALLBACK] Loaded default static CMS content:', DEFAULT_CONTENT);
  return { ...DEFAULT_CONTENT };
}

// ─────────────────────────────────────────────────────────────────────────────
// Save a single content key to Supabase (upsert)
// ─────────────────────────────────────────────────────────────────────────────
export async function upsertSiteContent(key, content) {
  console.log('[CMS DB] upsertSiteContent called for section key:', key, 'content:', content);
  const section = CMS_SECTIONS.find(s => s.key === key)?.section || 'global';
  const label = CMS_SECTIONS.find(s => s.key === key)?.label || key;

  const payload = {
    key,
    section,
    label,
    content,
    updated_at: new Date().toISOString(),
  };
  console.log('[CMS DB] Payload to write into table site_content:', payload);

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('site_content')
        .upsert(payload, { onConflict: 'key' })
        .select();

      if (error) {
        console.error('[CMS DB ERROR] Failed to upsert into Supabase site_content:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }
      console.log('[CMS DB SUCCESS] CMS section saved successfully to Supabase:', data);
    } catch (err) {
      console.error('[CMS DB CATCH] Exception during CMS save:', err);
    }
  } else {
    console.warn('[CMS DB WARN] Supabase is not configured. Saved to localStorage only.');
  }

  // Always update localStorage as well
  try {
    const saved = localStorage.getItem(LS_KEY);
    const existing = saved ? JSON.parse(saved) : { ...DEFAULT_CONTENT };
    existing[key] = content;
    localStorage.setItem(LS_KEY, JSON.stringify(existing));
    console.log('[CMS LOCAL] Updated localStorage for key:', key);
  } catch (err) {
    console.error('[CMS LOCAL ERROR] Error updating localStorage:', err);
  }

  return { key, content };
}

// ─────────────────────────────────────────────────────────────────────────────
// Merge fetched data with defaults (defaults fill any missing keys/fields)
// ─────────────────────────────────────────────────────────────────────────────
function mergeWithDefaults(fetched) {
  const result = {};
  for (const key of Object.keys(DEFAULT_CONTENT)) {
    if (fetched[key] !== undefined) {
      // For arrays, prefer fetched if non-empty
      if (Array.isArray(DEFAULT_CONTENT[key])) {
        if (key === 'hero_slides' && Array.isArray(fetched[key])) {
          result[key] = fetched[key].map((slide, idx) => {
            const defSlide = DEFAULT_CONTENT.hero_slides[idx] || DEFAULT_CONTENT.hero_slides[0];
            if (!slide.image || slide.image.includes('googleusercontent.com')) {
              return { ...slide, image: defSlide.image };
            }
            return { ...slide, image: getAssetUrl(slide.image) };
          });
        } else {
          result[key] = Array.isArray(fetched[key]) && fetched[key].length > 0
            ? fetched[key]
            : DEFAULT_CONTENT[key];
        }
      } else {
        result[key] = { ...DEFAULT_CONTENT[key], ...fetched[key] };
      }
    } else {
      result[key] = DEFAULT_CONTENT[key];
    }
  }
  return result;
}
