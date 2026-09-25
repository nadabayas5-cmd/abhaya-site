import { createClient } from '@supabase/supabase-js';
import { PRODUCTS as DEFAULT_PRODUCTS } from '../data/products.js';
import { cache } from './cache.js';

const DEFAULT_SUPABASE_URL = 'https://gbqusurpixzwhqrpnity.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdicXVzdXJwaXh6d2hxcnBuaXR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc2Njk2MTQsImV4cCI6MjEwMzI0NTYxNH0.8-wjpH4d4I4L48dlTcPkCBtAq-sao74U_wpYcRpkEco';

const supabaseUrl = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) || DEFAULT_SUPABASE_ANON_KEY;

// Check if valid credentials are provided
export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('http') &&
  !supabaseUrl.includes('your-project-id')
);

// Initialize Supabase client
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      }
    })
  : null;

console.log('[Supabase Init] isSupabaseConfigured:', isSupabaseConfigured, 'URL:', supabaseUrl);

const STORAGE_BUCKET = 'product-images';
const LOCAL_STORAGE_PRODUCTS_KEY = 'noor_admin_products';
const LOCAL_STORAGE_ORDERS_KEY = 'noor_admin_orders';

/**
 * Format raw database row to UI product model
 */
export function formatProductFromDB(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name || 'Untitled Abaya',
    subtitle: row.subtitle || '',
    price: Number(row.price) || 0,
    priceInr: row.price_inr != null ? Number(row.price_inr) : null,
    originalPrice: row.original_price ? Number(row.original_price) : null,
    category: row.category || 'Abaya',
    badge: row.badge || '',
    targetRegion: row.target_region || 'all',
    rating: Number(row.rating) || 5.0,
    reviewsCount: Number(row.reviews_count) || 0,
    isVioletEdition: Boolean(row.is_violet_edition),
    defaultStyle: row.default_style || null,
    defaultWork: row.default_work || null,
    styles: Array.isArray(row.styles) && row.styles.length > 0 ? row.styles : (row.default_style ? [row.default_style] : []),
    works: Array.isArray(row.works) && row.works.length > 0 ? row.works : (row.default_work ? [row.default_work] : []),
    subcategory: row.subcategory || null,
    wholesaleType: row.wholesale_type || null,
    wholesaleMinQty: Number(row.wholesale_min_qty) || 1,
    color: row.color || (Array.isArray(row.colors) && row.colors[0]?.name) || (typeof row.colors === 'string' ? row.colors : '') || '',
    colors: Array.isArray(row.colors) ? row.colors : [],
    image: row.image || '',
    gallery: Array.isArray(row.gallery) ? row.gallery : (row.image ? [row.image] : []),
    sizes: Array.isArray(row.sizes) ? row.sizes : [],
    description: row.description || '',
    fabricDetails: row.fabric_details || '',
    stylingAdvice: row.styling_advice || '',
    careInstructions: row.care_instructions || '',
    reviews: Array.isArray(row.reviews) ? row.reviews : []
  };
}

/**
 * Format UI product model to database row
 */
export function formatProductForDB(product) {
  const payload = {
    id: product.id,
    name: product.name,
    subtitle: product.subtitle || '',
    price: Number(product.price) || 0,
    price_inr: product.priceInr != null ? Number(product.priceInr) : null,
    original_price: product.originalPrice ? Number(product.originalPrice) : null,
    category: product.category || 'Abaya',
    badge: product.badge || null,
    target_region: product.targetRegion || 'all',
    rating: Number(product.rating) || 5.0,
    reviews_count: Number(product.reviewsCount) || 0,
    is_violet_edition: Boolean(product.isVioletEdition),
    default_style: product.defaultStyle || null,
    default_work: product.defaultWork || null,
    styles: Array.isArray(product.styles) && product.styles.length > 0 ? product.styles : (product.defaultStyle ? [product.defaultStyle] : []),
    works: Array.isArray(product.works) && product.works.length > 0 ? product.works : (product.defaultWork ? [product.defaultWork] : []),
    subcategory: product.subcategory || null,
    wholesale_type: product.wholesaleType || null,
    wholesale_min_qty: Number(product.wholesaleMinQty) || 1,
    color: product.color || '',
    image: product.image,
    gallery: product.gallery || [],
    sizes: product.sizes || [],
    description: product.description || '',
    fabric_details: product.fabricDetails || '',
    styling_advice: product.stylingAdvice || '',
    care_instructions: product.careInstructions || '',
    reviews: product.reviews || [],
    updated_at: new Date().toISOString()
  };

  if (product.colors && Array.isArray(product.colors)) {
    payload.colors = product.colors;
  }

  return payload;
}

/**
 * Fetch all products from Supabase (with smart caching & stale-while-revalidate)
 */
export async function fetchProductsFromSupabase(options = {}) {
  const { forceRefresh = false } = options;

  return await cache.getOrFetch('products_catalog', async () => {
    const timestamp = new Date().toISOString();
    console.group(`[Supabase DB] 🔍 fetchProductsFromSupabase @ ${timestamp}`);
    console.log('[Supabase DB] Config status:', { isSupabaseConfigured, hasClient: Boolean(supabase) });

    if (isSupabaseConfigured && supabase) {
      try {
        console.log('[Supabase DB] Executing query: supabase.from("products").select("*").order("created_at", { ascending: false })...');
        const { data, error, status, statusText } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        console.log(`[Supabase DB] Query response status: ${status} ${statusText || ''}`);

        if (error) {
          console.error('[Supabase DB ERROR] Query failed:', {
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint
          });
        } else if (Array.isArray(data)) {
          console.log(`[Supabase DB SUCCESS] Fetched ${data.length} rows from 'products' table:`, data);
          const formatted = data.map(formatProductFromDB);
          console.log(`[Supabase DB] Formatted ${formatted.length} UI product objects:`, formatted);

          // Cache to localStorage for fast initial reloads
          try {
            localStorage.setItem(LOCAL_STORAGE_PRODUCTS_KEY, JSON.stringify(formatted));
          } catch (storageErr) {
            console.warn('[Supabase DB] Failed to write to localStorage cache:', storageErr);
          }
          console.groupEnd();
          return { data: formatted, source: 'supabase', error: null };
        }
      } catch (err) {
        console.error('[Supabase DB CATCH] Uncaught exception during fetch:', err);
      }
    }

    // Fallback to local storage or bundled curated items ONLY when Supabase is not configured
    if (!isSupabaseConfigured) {
      console.warn('[Supabase DB] Supabase is NOT configured. Checking localStorage fallback...');
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_PRODUCTS_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            console.log(`[Supabase DB FALLBACK] Loaded ${parsed.length} products from localStorage cache:`, parsed);
            console.groupEnd();
            return { data: parsed, source: 'localStorage', error: null };
          }
        }
      } catch (storageErr) {
        console.warn('[Supabase DB] Error reading local cache:', storageErr);
      }

      console.log('[Supabase DB FALLBACK] Using DEFAULT_PRODUCTS (17 demo items):', DEFAULT_PRODUCTS);
      console.groupEnd();
      return { data: DEFAULT_PRODUCTS, source: 'default', error: null };
    }

    console.warn('[Supabase DB] Returning empty array due to fetch failure.');
    console.groupEnd();
    return { data: [], source: 'supabase', error: 'Failed to fetch from Supabase' };
  }, { ttlMs: 5 * 60 * 1000, persist: true, forceRefresh });
}

/**
 * Insert or Update a product in Supabase with auto-retry for missing schema columns
 */
export async function upsertProductToSupabase(product) {
  cache.invalidate('products_catalog');
  const timestamp = new Date().toISOString();
  console.group(`[Supabase DB] 💾 upsertProductToSupabase @ ${timestamp}`);
  console.log('[Supabase DB] Product input:', { id: product?.id, name: product?.name, category: product?.category, image: product?.image });

  let dbPayload = formatProductForDB(product);
  console.log('[Supabase DB] Formatted database payload:', dbPayload);

  if (isSupabaseConfigured && supabase) {
    let attempts = 0;
    const maxAttempts = 5;

    while (attempts < maxAttempts) {
      attempts++;
      console.log(`[Supabase DB] Attempt ${attempts}/${maxAttempts} saving product ID '${dbPayload.id}'...`);
      try {
        const { data, error, status } = await supabase
          .from('products')
          .upsert(dbPayload, { onConflict: 'id' })
          .select();

        if (error) {
          console.warn(`[Supabase DB] Attempt ${attempts} returned error:`, {
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint
          });

          // If a column is missing in the database table (PGRST204), extract column name and retry without it
          if (error.code === 'PGRST204' || (error.message && error.message.includes("Could not find the '"))) {
            const match = error.message.match(/Could not find the '([^']+)' column/);
            const missingCol = match ? match[1] : null;

            if (missingCol && dbPayload[missingCol] !== undefined) {
              console.warn(`[Supabase DB RECOVERY] Schema column '${missingCol}' not found in 'products' table. Stripping '${missingCol}' and retrying...`);
              delete dbPayload[missingCol];
              continue; // retry loop
            }
          }

          console.error('[Supabase DB ERROR] Failed to upsert product:', error);
          throw error;
        }

        console.log('[Supabase DB SUCCESS] Product successfully saved to Supabase (Status: ' + status + '):', data);
        const returnedItem = Array.isArray(data) ? data[0] : data;
        saveProductLocally(product);
        console.groupEnd();
        return { data: formatProductFromDB(returnedItem) || product, error: null };
      } catch (err) {
        console.error(`[Supabase DB CATCH] Attempt ${attempts} exception:`, err);
        if (attempts >= maxAttempts) {
          saveProductLocally(product);
          console.groupEnd();
          return { data: product, error: err.message };
        }
      }
    }
  }

  console.warn('[Supabase DB WARN] Supabase not active. Saved to localStorage only.');
  saveProductLocally(product);
  console.groupEnd();
  return { data: product, error: null };
}

/**
 * Delete a product from Supabase
 */
export async function deleteProductFromSupabase(productId) {
  cache.invalidate('products_catalog');
  const timestamp = new Date().toISOString();
  console.group(`[Supabase DB] 🗑️ deleteProductFromSupabase @ ${timestamp}`);
  console.log('[Supabase DB] Deleting product ID:', productId);

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error, status } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) {
        console.error('[Supabase DB ERROR] Failed to delete product from Supabase:', error);
        throw error;
      }
      console.log(`[Supabase DB SUCCESS] Deleted product '${productId}' from Supabase (Status: ${status}):`, data);
    } catch (err) {
      console.error('[Supabase DB CATCH] Exception during product delete:', err);
    }
  }

  deleteProductLocally(productId);
  console.log('[Supabase DB] Removed from local cache.');
  console.groupEnd();
  return { success: true };
}

/**
 * Upload an image to Supabase Storage
 */
export async function uploadProductImage(file, subFolder = 'general') {
  const timestamp = new Date().toISOString();
  console.group(`[Supabase Storage] 📤 uploadProductImage @ ${timestamp}`);
  console.log('[Supabase Storage] File details:', {
    name: file?.name,
    type: file?.type,
    sizeBytes: file?.size,
    sizeKB: file?.size ? Math.round(file.size / 1024) + ' KB' : 'N/A',
    subFolder,
    targetBucket: STORAGE_BUCKET,
    isConfigured: isSupabaseConfigured
  });

  if (!file) {
    console.error('[Supabase Storage ERROR] No file provided.');
    console.groupEnd();
    return { url: null, error: 'No file provided' };
  }

  if (!isSupabaseConfigured || !supabase) {
    console.error('[Supabase Storage ERROR] Supabase is not configured.');
    console.groupEnd();
    return {
      url: null,
      error: 'Supabase storage is not configured. Please verify your Supabase environment variables.'
    };
  }

  try {
    const fileExt = file.name ? file.name.split('.').pop() : 'jpg';
    const cleanFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const filePath = `products/${subFolder}/${cleanFileName}`;

    console.log(`[Supabase Storage] Uploading to bucket '${STORAGE_BUCKET}' at path '${filePath}'...`);

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) {
      console.error('[Supabase Storage ERROR] Upload rejected:', {
        message: uploadError.message,
        statusCode: uploadError.statusCode,
        error: uploadError
      });
      console.groupEnd();
      return { url: null, error: uploadError.message };
    }

    console.log('[Supabase Storage SUCCESS] Upload response received:', uploadData);
    const { data: publicUrlData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filePath);

    if (publicUrlData && publicUrlData.publicUrl) {
      console.log('[Supabase Storage SUCCESS] Public CDN URL generated:', publicUrlData.publicUrl);
      console.groupEnd();
      return { url: publicUrlData.publicUrl, error: null };
    }

    console.error('[Supabase Storage ERROR] Failed to obtain public URL.');
    console.groupEnd();
    return { url: null, error: 'Could not generate public URL for uploaded file.' };
  } catch (err) {
    console.error('[Supabase Storage CATCH] Exception during storage upload:', err);
    console.groupEnd();
    return { url: null, error: err.message || 'Error uploading image to Supabase' };
  }
}

/**
 * Seed initial catalog to Supabase
 */
export async function seedInitialProductsToSupabase() {
  cache.invalidate('products_catalog');
  const productsToSeed = DEFAULT_PRODUCTS.map(formatProductForDB);

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .upsert(productsToSeed, { onConflict: 'id' })
        .select();

      if (error) throw error;
      return { success: true, count: data?.length || productsToSeed.length, error: null };
    } catch (err) {
      return { success: false, count: 0, error: err.message };
    }
  }

  // Local storage seed
  try {
    localStorage.setItem(LOCAL_STORAGE_PRODUCTS_KEY, JSON.stringify(DEFAULT_PRODUCTS));
    return { success: true, count: DEFAULT_PRODUCTS.length, error: null };
  } catch (err) {
    return { success: false, count: 0, error: err.message };
  }
}

/**
 * Helper to save product to localStorage
 */
function saveProductLocally(product) {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_PRODUCTS_KEY);
    let list = saved ? JSON.parse(saved) : [...DEFAULT_PRODUCTS];
    const index = list.findIndex(p => p.id === product.id);
    if (index >= 0) {
      list[index] = product;
    } else {
      list.unshift(product);
    }
    localStorage.setItem(LOCAL_STORAGE_PRODUCTS_KEY, JSON.stringify(list));
  } catch (_) {}
}

/**
 * Helper to delete product from localStorage
 */
function deleteProductLocally(productId) {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_PRODUCTS_KEY);
    let list = saved ? JSON.parse(saved) : [...DEFAULT_PRODUCTS];
    list = list.filter(p => p.id !== productId);
    localStorage.setItem(LOCAL_STORAGE_PRODUCTS_KEY, JSON.stringify(list));
  } catch (_) {}
}

/**
 * Fetch orders from Supabase or local storage
 */
export async function fetchOrdersFromSupabase() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        return { data, error: null };
      }
    } catch (err) {
      console.warn('Orders fetch error:', err);
    }
  }

  // Return local stored or default sample order
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_ORDERS_KEY);
    if (saved) return { data: JSON.parse(saved), error: null };
  } catch (_) {}

  const defaultOrders = [
    {
      id: '#ABH-88421',
      customer_name: 'Sarah Al-Mansoor',
      email: 'sarah.mansoor@example.com',
      phone: '+971 50 123 4567',
      delivery_address: 'Villa 14, Jumeirah 2, Dubai, UAE',
      carrier: 'DHL Express Luxury Courier',
      tracking_number: 'DHL-EX-994820194US',
      status: 'In Transit via Express Courier',
      total_amount: 395,
      items: [
        { name: 'Midnight Espresso Silk Abaya', price: 185, quantity: 1, style: 'Open abaya', work: 'Handwork Abaya' },
        { name: 'Royal Violet Mulberry Silk Abaya', price: 210, quantity: 1, style: 'Butterfly or farasha', work: 'Stonework Abaya' }
      ],
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];
  return { data: defaultOrders, error: null };
}

/**
 * Update order in Supabase
 */
export async function upsertOrderToSupabase(order) {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .upsert(order, { onConflict: 'id' })
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      console.error('Error saving order to Supabase:', err);
    }
  }

  // Local storage update
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_ORDERS_KEY);
    let list = saved ? JSON.parse(saved) : [];
    const idx = list.findIndex(o => o.id === order.id);
    if (idx >= 0) list[idx] = order;
    else list.unshift(order);
    localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify(list));
  } catch (_) {}

  return { data: order, error: null };
}
