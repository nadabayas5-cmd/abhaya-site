export const MAIN_CATEGORIES = [
  { id: "Abaya", name: "Abaya", subtitle: "Dubai Haute Couture Silhouettes", path: "abaya" },
  { id: "Shaila/Shawl", name: "Shaila / Shawl", subtitle: "Lustrous Mulberry Silk & Chiffon Wraps", path: "shaila-shawl" },
  { id: "Hijab", name: "Hijab & Niqab", subtitle: "Premium Hijabs, Caps & Gentle Gloves", path: "hijab" },
  { id: "Inner & Prayer dress", name: "Inner & Prayer Dress", subtitle: "Sleeveless Slips & Devotion Sets", path: "inner-prayer-dress" },
  { id: "Kids abaya", name: "Kids Abaya", subtitle: "Graceful Modest Couture for Young Girls", path: "kids-abaya" },
  { id: "Wholesale", name: "Wholesale (B2B)", subtitle: "Direct Factory Wholesale & Bulk Carton Export", path: "wholesale" }
];

export const ABAYA_STYLES = [
  {
    id: "open-abaya",
    name: "Open abaya",
    description: "Classic front-open silhouette, versatile for layering with internal snap buttons",
    tag: "Versatile Classic"
  },
  {
    id: "closed-cut",
    name: "Closed cut",
    description: "Traditional full-length continuous modest cut with clean refined drape",
    tag: "Modest Essential"
  },
  {
    id: "kimono-kaftan",
    name: "Kimono or kaftan",
    description: "Relaxed wide-sleeved drape offering fluid motion and contemporary elegance",
    tag: "Modern Flow"
  },
  {
    id: "butterfly-farasha",
    name: "Butterfly or farasha",
    description: "Grand sweeping winged silhouette with majestic volume and regal presence",
    tag: "Regal Statement"
  },
  {
    id: "umbrella-flare",
    name: "umbrella cut or Flare",
    description: "Fitted bodice gracefully flaring into a full circular sweep at the hemline",
    tag: "Graceful Flare"
  },
  {
    id: "two-piece-inner",
    name: "2 piece abaya (with inner)",
    description: "Includes matching sleeveless slip dress under an ethereal open outer robe",
    tag: "Complete Set"
  },
  {
    id: "coat-abaya",
    name: "Coat abaya",
    description: "Tailored architectural lapels and structured cuffs for formal occasion wear",
    tag: "Structured Luxury"
  }
];

export const ABAYA_WORKS = [
  {
    id: "embroidery-abaya",
    name: "Embroidery Abaya",
    description: "Intricate artisanal floral and geometric embroidery along cuffs, collar, and hem",
    tag: "Artisanal"
  },
  {
    id: "handwork-abaya",
    name: "Handwork Abaya",
    description: "Bespoke handcrafted needlework with delicate beads, zardozi, and micro-crystals",
    tag: "Haute Couture"
  },
  {
    id: "stonework-abaya",
    name: "Stonework Abaya",
    description: "Lustrous high-clarity crystal and rhinestone stone embellishments catching ambient light",
    tag: "Luminous Glamour"
  },
  {
    id: "threadwork-abaya",
    name: "Threadwork Abaya",
    description: "Tonal silk and metallic thread work woven seamlessly into modest borders",
    tag: "Subtle Elegance"
  },
  {
    id: "printed-abaya",
    name: "Printed Abaya",
    description: "Artistic botanical, marble, and abstract prints on luxury flowy fabrics",
    tag: "Contemporary"
  },
  {
    id: "lacework-abaya",
    name: "Lace Work Abaya",
    description: "Delicate French and Chantilly lace trims along cuffs, lapels, and hemlines",
    tag: "Romantic Vintage"
  },
  {
    id: "plain-basic",
    name: "Plain/Basic",
    description: "Pure unembellished minimalist luxury focusing on fabric drape and clean cuts",
    tag: "Minimalist"
  },
  {
    id: "others",
    name: "Others",
    description: "Bespoke handcrafted cutwork, patchwork, origami pleats, and unique mixed artisanal crafts",
    tag: "Eclectic Artisan"
  }
];

export const WHOLESALE_TYPES = [
  { id: "Abaya", name: "Abaya", description: "Full wholesale cartons of assorted luxury abayas" },
  { id: "Simple/Basic", name: "Simple/Basic", description: "High-demand everyday minimalist abayas for retail shops" },
  { id: "Embroidery", name: "Embroidery", description: "Bespoke embroidered abaya cartons for boutiques" },
  { id: "Handwork", name: "Handwork", description: "Haute couture hand-beaded bridal & party abaya stock" },
  { id: "Lace", name: "Lace", description: "French & Chantilly lace detailed abaya sets" },
  { id: "Kids", name: "Kids", description: "Assorted girls and junior modest abaya carton packs" }
];

export const ABAYA_SIZES = [
  {
    size: "52",
    name: "Small",
    label: "Small (52)",
    height: "5' & Below"
  },
  {
    size: "54",
    name: "Medium",
    label: "Medium (54)",
    height: "5.1' – 5.3'"
  },
  {
    size: "56",
    name: "Large",
    label: "Large (56)",
    height: "5.4' – 5.6'"
  },
  {
    size: "58",
    name: "XL",
    label: "XL (58)",
    height: "5.7' – 5.8'"
  },
  {
    size: "60",
    name: "2 XL",
    label: "2 XL (60)",
    height: "5.9' – 6.0'"
  },
  {
    size: "Custom",
    name: "Custom",
    label: "Custom",
    height: "Bespoke measurements"
  }
];

export const ABAYA_SIZE_LABELS = ABAYA_SIZES.map((s) => s.label);

export const DEFAULT_ABAYA_SIZE = ABAYA_SIZES.find((s) => s.size === "54")?.label || "Medium (54)";

export function getAbayaSizeByLabel(label) {
  return ABAYA_SIZES.find((s) => s.label === label) || null;
}

export const PRODUCTS = [
  // ── 1. ABAYA CATEGORY PRODUCTS ──
  {
    id: "midnight-espresso-silk",
    name: "Midnight Espresso Silk Abaya",
    subtitle: "100% Pure Mulberry Silk | Hand-Rolled Hems",
    price: 185,
    priceInr: 4209,
    originalPrice: 240,
    category: "Abaya",
    badge: "Signature Bestseller",
    targetRegion: "all",
    rating: 4.9,
    reviewsCount: 128,
    isVioletEdition: true,
    defaultStyle: "Open abaya",
    defaultWork: "Handwork Abaya",
    styles: ABAYA_STYLES.map(s => s.name),
    works: ABAYA_WORKS.map(w => w.name),
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB1pd9NiCkfaDXafhb_-Uh3AA4XfN_AwnHEOOx0x2g2ngtcqCTGLjvTaBkKb-K-NzQCG24IEz1UecYCkOoBZQCz8Noq1fcMtAEZXyLpJZs8oZaOU9p5FhAShjG20FoGotY7Q5RtZ_fkUFk2HiRAkqY7a_y5R8pdolKPAtOtdjB3HFdhHKgY2Vfkv8U7Mfjej74-_slJxvP0a9gXoTwEPOLi7mSF52g0Nz5NZjvjyQzAgbD45y67GOUWkw",
    gallery: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB1pd9NiCkfaDXafhb_-Uh3AA4XfN_AwnHEOOx0x2g2ngtcqCTGLjvTaBkKb-K-NzQCG24IEz1UecYCkOoBZQCz8Noq1fcMtAEZXyLpJZs8oZaOU9p5FhAShjG20FoGotY7Q5RtZ_fkUFk2HiRAkqY7a_y5R8pdolKPAtOtdjB3HFdhHKgY2Vfkv8U7Mfjej74-_slJxvP0a9gXoTwEPOLi7mSF52g0Nz5NZjvjyQzAgbD45y67GOUWkw",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCM9j8LFvsTmyHWo5yGhiGKS4opH62nBHZu4Lnul0WiG75kp7G1fV5dduJL4yYrG6_QYii5EqU5qDdmPAZiVayTHk_MHdZUS1PFH7Vmu_PQ9NkTiImB1yySXaGzznzAIt50MMuSleDfR4BGxIDRWpxTH8KdOc8n4QYbwkzpgvIpNykc3t2HhuojjULBjDgRwn0AHkSBSCprFC4hYTmO1dhYVgvdl_4PWcpnE9_BIc9Mbcupjf6jLWTvZA"
    ],
    colors: [
      { name: "Midnight Espresso", hex: "#2E1C1A", imageIndex: 0 },
      { name: "Plum Noir", hex: "#260A22", imageIndex: 1 },
      { name: "Amethyst Soft", hex: "#C76AA9", imageIndex: 0 },
      { name: "Lavender Mist", hex: "#D4C5DD", imageIndex: 0 }
    ],
    color: "Midnight Espresso",
    sizes: ABAYA_SIZES.map(s => s.label),
    stockCount: 4,
    description: "An ode to quiet luxury. Handcrafted from luminous 19-momme pure mulberry silk with masterfully tailored cuts, offering an ethereal drape that stays flawlessly in place for both everyday refinement and gala evenings.",
    fabricDetails: "100% Grade 6A Organic Mulberry Silk. 19 Momme density for high opacity, natural thermo-regulation, and non-slip velvet inner friction weave.",
    stylingAdvice: "Customizable across 7 silhouette cuts and 7 artisan craftworks. Pairs impeccably with tailored inner slips and silk wraps.",
    careInstructions: "Dry clean or gentle hand wash cold with pH-neutral silk detergent. Lay flat on dry towel. Cool iron on reverse side under protective cloth."
  },
  {
    id: "royal-violet-silk",
    name: "Royal Violet Mulberry Silk Abaya",
    subtitle: "Limited Ethereal Edition | Regal Luster",
    price: 210,
    priceInr: 4778,
    originalPrice: 265,
    category: "Abaya",
    badge: "Limited Edition",
    targetRegion: "arab",
    rating: 5.0,
    reviewsCount: 62,
    isVioletEdition: true,
    defaultStyle: "Butterfly or farasha",
    defaultWork: "Stonework Abaya",
    styles: ABAYA_STYLES.map(s => s.name),
    works: ABAYA_WORKS.map(w => w.name),
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBYEamtzjpK7ME6SNcwB_Dm777cIG9hjrlL-HktMD3xXRRagPMwnPzQ6iQe0viQ-TzLh4QmpxHcu3NVanxe3hDnC2QRxOeS2lYJYUCj57wjk6s6zQPxuGfRymUJvAtpdqSxQyOCVxYVVXZeKjX1PtHzUwTdxLxRFkQ-uy0Wkdt9PLVSix-WW_Yhj9Q-7vckCUPA1NjfPSGWo1RpBTx4655Eg32yHhxICDT7wKDiG-eqw4hPAEADpyQ5vA",
    gallery: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBYEamtzjpK7ME6SNcwB_Dm777cIG9hjrlL-HktMD3xXRRagPMwnPzQ6iQe0viQ-TzLh4QmpxHcu3NVanxe3hDnC2QRxOeS2lYJYUCj57wjk6s6zQPxuGfRymUJvAtpdqSxQyOCVxYVVXZeKjX1PtHzUwTdxLxRFkQ-uy0Wkdt9PLVSix-WW_Yhj9Q-7vckCUPA1NjfPSGWo1RpBTx4655Eg32yHhxICDT7wKDiG-eqw4hPAEADpyQ5vA"
    ],
    colors: [
      { name: "Royal Violet", hex: "#982476", imageIndex: 0 },
      { name: "Amethyst Soft", hex: "#C76AA9", imageIndex: 0 }
    ],
    color: "Royal Violet",
    sizes: ABAYA_SIZES.map(s => s.label),
    stockCount: 7,
    description: "Dyed in bespoke artisanal small-batches, this Royal Violet silk abaya captures ambient light like liquid amethyst. Richly saturated, featherlight, and available in all bespoke cuts and embroidery works.",
    fabricDetails: "100% Mulberry Silk, Momme 19. Certified Oeko-Tex Standard 100 non-toxic natural pigment dye.",
    stylingAdvice: "Choose the Butterfly cut for ceremonial drama or the 2-Piece set for modern layering.",
    careInstructions: "Hand wash cold with silk elixir, lay flat to dry in shade."
  },
  {
    id: "dusty-rose-chiffon",
    name: "Ethereal Rose Petal Chiffon Abaya",
    subtitle: "Featherlight Airy Drape | Non-Slip Weave",
    price: 135,
    priceInr: 3071,
    originalPrice: 170,
    category: "Abaya",
    badge: "Trending",
    targetRegion: "india",
    rating: 4.8,
    reviewsCount: 84,
    isVioletEdition: false,
    defaultStyle: "umbrella cut or Flare",
    defaultWork: "Embroidery Abaya",
    styles: ABAYA_STYLES.map(s => s.name),
    works: ABAYA_WORKS.map(w => w.name),
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAZVub0VhEbfZ42RjVHsOuVG7wBCgHLelkGY6dOel_gT0hCj9B2RVezHENmxJ_Y2puqMuVud0p4ezu2BAO-tDYec2p7u7R0BrlAnxqF8-sj5o6hzp952ZimvWdQMJ27T2bnI0izDnupYarV-4dSCuZNTV4ZI5LIGSBrB7x8UtRvKe2pzAHzOircRZsc5QdPR8BNHP9tTFY1_m7T5pjTpfYw7dLDbvqK7NRWpybaJqeALvz9q6tLOqfhTQ",
    gallery: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAZVub0VhEbfZ42RjVHsOuVG7wBCgHLelkGY6dOel_gT0hCj9B2RVezHENmxJ_Y2puqMuVud0p4ezu2BAO-tDYec2p7u7R0BrlAnxqF8-sj5o6hzp952ZimvWdQMJ27T2bnI0izDnupYarV-4dSCuZNTV4ZI5LIGSBrB7x8UtRvKe2pzAHzOircRZsc5QdPR8BNHP9tTFY1_m7T5pjTpfYw7dLDbvqK7NRWpybaJqeALvz9q6tLOqfhTQ"
    ],
    colors: [
      { name: "Dusty Rose", hex: "#C49A99", imageIndex: 0 },
      { name: "Antique Blush", hex: "#E2C3C1", imageIndex: 0 }
    ],
    color: "Dusty Rose",
    sizes: ABAYA_SIZES.map(s => s.label),
    stockCount: 12,
    description: "Delicately sheer yet fully lined and opaque, our premium matte chiffon abaya provides breathable, floaty grace that stays put all day with seamless tailored lines.",
    fabricDetails: "100% Fine Microfiber Chiffon with soft matte pebble finish. High durability against snagging.",
    stylingAdvice: "Choose Lace Work for wedding occasions or Plain/Basic for graceful minimalist everyday wear.",
    careInstructions: "Machine wash cold on delicate cycle inside laundry mesh bag. Hang dry."
  },
  {
    id: "sage-haven-modal",
    name: "Sage Haven Modal Luxe Abaya",
    subtitle: "Ultra-Soft Cloud Touch | Four-Way Elasticity",
    price: 120,
    priceInr: 2730,
    originalPrice: 155,
    category: "Abaya",
    badge: "Staff Pick",
    targetRegion: "all",
    rating: 5.0,
    reviewsCount: 96,
    isVioletEdition: false,
    defaultStyle: "Kimono or kaftan",
    defaultWork: "Threadwork Abaya",
    styles: ABAYA_STYLES.map(s => s.name),
    works: ABAYA_WORKS.map(w => w.name),
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD6VCCXcrsIQMHcP3Y2cwPwjMw26HSpdXZRpo1lY76HCdTo-vZ5b4M8do6PcZ7DqQvXu3-GlMe2pgswNgngMTx9SsTOZ72uI6VKzR9AO30LImVq-vABf8hOJGP7ROTu8ggWAFYVzo2IbWQV-aYchjycdwCWyhodCmGPBoTo_aAcIjMZuF8wfHjLz_fQt_sGTpPBO2Ddgqm5H07QGTDc4ZBfNS_nT9uyWZncjWeLoA1KPl20JxdlmW11w",
    gallery: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD6VCCXcrsIQMHcP3Y2cwPwjMw26HSpdXZRpo1lY76HCdTo-vZ5b4M8do6PcZ7DqQvXu3-GlMe2pgswNgngMTx9SsTOZ72uI6VKzR9AO30LImVq-vABf8hOJGP7ROTu8ggWAFYVzo2IbWQV-aYchjycdwCWyhodCmGPBoTo_aAcIjMZuF8wfHjLz_fQt_sGTpPBO2Ddgqm5H07QGTDc4ZBfNS_nT9uyWZncjWeLoA1KPl20JxdlmW11w"
    ],
    colors: [
      { name: "Serene Sage", hex: "#7D8B79", imageIndex: 0 },
      { name: "Warm Sand", hex: "#C8B89F", imageIndex: 0 }
    ],
    color: "Serene Sage",
    sizes: ABAYA_SIZES.map(s => s.label),
    stockCount: 15,
    description: "Crafted from Austrian beechwood modal yarn, this jersey abaya offers butter-soft touch, four-way mechanical stretch, and unparalleled everyday comfort.",
    fabricDetails: "95% TENCEL™ Modal, 5% Spandex. Hypoallergenic, eco-certified biodegradable fibers.",
    stylingAdvice: "Effortless casual elegance for travel, daily routine, and modest lounge refinement.",
    careInstructions: "Machine wash cold, tumble dry low or dry flat."
  },
  {
    id: "bridal-pebble-georgette",
    name: "Ivory Pebble Georgette Atelier Abaya",
    subtitle: "Subtle Pebble Grain | Flawless Architecture",
    price: 195,
    priceInr: 4436,
    originalPrice: 250,
    category: "Abaya",
    badge: "Artisan Atelier",
    targetRegion: "arab",
    rating: 4.9,
    reviewsCount: 53,
    isVioletEdition: false,
    defaultStyle: "2 piece abaya (with inner)",
    defaultWork: "Lace Work Abaya",
    styles: ABAYA_STYLES.map(s => s.name),
    works: ABAYA_WORKS.map(w => w.name),
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCnqkoPTiUDviPUgD5wOYrSVBgUqgYocEhMRfjaPR0AEGQLNSU0reQ8ubR7uxH960qrPF_FqZly7nHa6M1eLYxa5g-5swQgYvy9Z47DR5Ph3pItsJjdCgLs1rkJOUsw_YtUrEPMsYWIosdqamteTBxBFcTP3dxNNOMXvIUzzwnK72cUnoROgWljIfcYMCZlhKDCFJZAJAexcU4FPc2ghiwZ4a4GWa-zXbuRhhx6hDiAwUFdTToqcj62cg",
    gallery: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCnqkoPTiUDviPUgD5wOYrSVBgUqgYocEhMRfjaPR0AEGQLNSU0reQ8ubR7uxH960qrPF_FqZly7nHa6M1eLYxa5g-5swQgYvy9Z47DR5Ph3pItsJjdCgLs1rkJOUsw_YtUrEPMsYWIosdqamteTBxBFcTP3dxNNOMXvIUzzwnK72cUnoROgWljIfcYMCZlhKDCFJZAJAexcU4FPc2ghiwZ4a4GWa-zXbuRhhx6hDiAwUFdTToqcj62cg"
    ],
    colors: [
      { name: "Ivory Pearl", hex: "#FBF6EE", imageIndex: 0 },
      { name: "Soft Amethyst", hex: "#C76AA9", imageIndex: 0 }
    ],
    color: "Ivory Pearl",
    sizes: ABAYA_SIZES.map(s => s.label),
    stockCount: 9,
    description: "Designed for special celebrations, Nikah ceremonies, and gala banquets. Features a crisp pebbled texture that sculpts sharply while cascading in romantic, structured ripples.",
    fabricDetails: "High-twist premium Japanese georgette filament with laser-cut delicate rolled edges.",
    stylingAdvice: "Order with Stonework or French Lace Work for unforgettable bridal presence.",
    careInstructions: "Dry clean recommended or gentle hand wash."
  },
  {
    id: "lavender-mist-satin",
    name: "Lavender Mist Luminous Silk Abaya",
    subtitle: "Ethereal Pastel Sheen | Ultra Lightweight",
    price: 175,
    priceInr: 3981,
    originalPrice: 220,
    category: "Abaya",
    badge: "Trending",
    targetRegion: "india",
    rating: 4.9,
    reviewsCount: 41,
    isVioletEdition: true,
    defaultStyle: "Coat abaya",
    defaultWork: "Printed Abaya",
    styles: ABAYA_STYLES.map(s => s.name),
    works: ABAYA_WORKS.map(w => w.name),
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCaxkyIqLmyOOOYWe4t17RXa7iRSCynbDrN6ywtJPf_xfaZiQGiTrejAu_Y_jqoa5NK9NtZTqNASt0n7GYiMTOvuZi_xPbW_YEfybM1GEZ94_QdPMo5CXKUwTJqQtTsaGYducUj0ebdjb6CCa_VJ7nazh54quuGFSOALMq9e9LVwMVGfLN3NthKYvgJjKK8pxisrSBk20C56m3SqGRkW9HmYuXUcCRYBR5w0nTDqakaeh2oYXKWKIq1UA",
    gallery: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCaxkyIqLmyOOOYWe4t17RXa7iRSCynbDrN6ywtJPf_xfaZiQGiTrejAu_Y_jqoa5NK9NtZTqNASt0n7GYiMTOvuZi_xPbW_YEfybM1GEZ94_QdPMo5CXKUwTJqQtTsaGYducUj0ebdjb6CCa_VJ7nazh54quuGFSOALMq9e9LVwMVGfLN3NthKYvgJjKK8pxisrSBk20C56m3SqGRkW9HmYuXUcCRYBR5w0nTDqakaeh2oYXKWKIq1UA"
    ],
    colors: [
      { name: "Lavender Mist", hex: "#D4C5DD", imageIndex: 0 },
      { name: "Soft Amethyst", hex: "#C76AA9", imageIndex: 0 }
    ],
    color: "Lavender Mist",
    sizes: ABAYA_SIZES.map(s => s.label),
    stockCount: 6,
    description: "Soft ambient lilac undertones meet pure mulberry silk. Glides effortlessly with a subtle radiant luster under both candlelight and sunlight.",
    fabricDetails: "100% 19-Momme Grade 6A Silk with anti-snag finish.",
    stylingAdvice: "Pair with Coat abaya cut for tailored grandeur or Open abaya with a matching inner.",
    careInstructions: "Hand wash cold with silk detergent, steam gently on low heat."
  },
  {
    id: "soft-amethyst-satin",
    name: "Soft Amethyst Draped Silk Abaya",
    subtitle: "Lustrous Violet Nuance | Editorial Classic",
    price: 190,
    priceInr: 4323,
    originalPrice: 245,
    category: "Abaya",
    badge: "Violet Edition",
    targetRegion: "all",
    rating: 5.0,
    reviewsCount: 38,
    isVioletEdition: true,
    defaultStyle: "Closed cut",
    defaultWork: "Plain/Basic",
    styles: ABAYA_STYLES.map(s => s.name),
    works: ABAYA_WORKS.map(w => w.name),
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC62Pubod6uVtguy05UptSBB8reu4JabPY0PwbiPYPXlEDpfoyvWWm_LbQNVVa2vA_XcMhrFIIBFxe-w0OoW5jrkDOfsMuBpdvFb1KE8yOvQP3elB3A6xfTzLB8rTL6U3551DMCeA9q2oMYmOIJbZpUDr1DlrwerOph-ZxGnsRCoO8TEijtBJqZUIeWwRen9k_MtD_Br7xdakBcNQjnRMRcXfgOBFn60si3c_yt84p0f1dKFD9kqRq06g",
    gallery: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC62Pubod6uVtguy05UptSBB8reu4JabPY0PwbiPYPXlEDpfoyvWWm_LbQNVVa2vA_XcMhrFIIBFxe-w0OoW5jrkDOfsMuBpdvFb1KE8yOvQP3elB3A6xfTzLB8rTL6U3551DMCeA9q2oMYmOIJbZpUDr1DlrwerOph-ZxGnsRCoO8TEijtBJqZUIeWwRen9k_MtD_Br7xdakBcNQjnRMRcXfgOBFn60si3c_yt84p0f1dKFD9kqRq06g"
    ],
    colors: [
      { name: "Amethyst Soft", hex: "#C76AA9", imageIndex: 0 },
      { name: "Royal Violet", hex: "#982476", imageIndex: 0 }
    ],
    color: "Amethyst Soft",
    sizes: ABAYA_SIZES.map(s => s.label),
    stockCount: 5,
    description: "An understated jewel-toned masterpiece. The Soft Amethyst silk creates a dreamy contour that frames the silhouette with warmth, modesty, and distinction.",
    fabricDetails: "100% Grade 6A Pure Mulberry Silk with artisanal finished edges.",
    stylingAdvice: "Perfect for daytime diplomacy and evening cocktail gatherings.",
    careInstructions: "Specialist silk hand wash only."
  },
  {
    id: "bespoke-pleated-craft-abaya",
    name: "Artisanal Pleated Espresso Abaya",
    subtitle: "Architectural Origami Pleating & Hand-Beaded Cuffs",
    price: 198,
    priceInr: 4500,
    originalPrice: 260,
    category: "Abaya",
    badge: "Atelier Bespoke",
    targetRegion: "all",
    rating: 5.0,
    reviewsCount: 34,
    isVioletEdition: true,
    defaultStyle: "Open abaya",
    defaultWork: "Others",
    styles: ABAYA_STYLES.map(s => s.name),
    works: ABAYA_WORKS.map(w => w.name),
    image: "/collection-images/work_others.jpg",
    gallery: [
      "/collection-images/work_others.jpg"
    ],
    colors: [
      { name: "Midnight Espresso", hex: "#2E1C1A", imageIndex: 0 },
      { name: "Plum Noir", hex: "#260A22", imageIndex: 0 }
    ],
    color: "Midnight Espresso",
    sizes: ABAYA_SIZES.map(s => s.label),
    stockCount: 8,
    description: "A testament to experimental atelier craftsmanship. Features bespoke geometric origami sleeve pleats bordered by tone-on-tone hand beading, offering a contemporary couture statement for discerning collectors.",
    fabricDetails: "100% Ultra-Fine Crepe de Chine & Structured Mulberry Silk Organza. Non-crease bespoke pleat setting.",
    stylingAdvice: "Wear open over high-contrast silk under-slips or fasten at the collar for a minimalist architectural column silhouette.",
    careInstructions: "Professional dry clean only to preserve artisanal pleating structure."
  },

  // ── 2. SHAILA / SHAWL CATEGORY PRODUCTS ──
  {
    id: "pure-silk-shaila-shawl",
    name: "Pure Mulberry Silk Shaila Shawl",
    subtitle: "Non-Slip Lightweight Weave | Hand-Finished Edges",
    price: 45,
    priceInr: 1024,
    originalPrice: 65,
    category: "Shaila/Shawl",
    badge: "Essential Luxury",
    targetRegion: "all",
    rating: 4.9,
    reviewsCount: 76,
    isVioletEdition: true,
    styles: [],
    works: [],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD-Sf1dgvSxQEdIcuInSxcRUwW6B-nBrZnNrAlOjxmNSTXEgqHvgbTWfGWkg5QYKVY0d9lsnGmuQwBuPf3yXH71nFMwMaVjxwvCixfo4u7HOgAOx-Z-drovy_YH-5MOgACvt0Pwe1icr3mK9M_bxXtmzzaUPFW_vyPfmx1GGDVrW_F2AgYUY40fBuNWPQElc5LbqXQuB_wLdkClmmrvrK6lHW6RI2zefAzNng6DUsYCen2Ggb06fdIVoA",
    gallery: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD-Sf1dgvSxQEdIcuInSxcRUwW6B-nBrZnNrAlOjxmNSTXEgqHvgbTWfGWkg5QYKVY0d9lsnGmuQwBuPf3yXH71nFMwMaVjxwvCixfo4u7HOgAOx-Z-drovy_YH-5MOgACvt0Pwe1icr3mK9M_bxXtmzzaUPFW_vyPfmx1GGDVrW_F2AgYUY40fBuNWPQElc5LbqXQuB_wLdkClmmrvrK6lHW6RI2zefAzNng6DUsYCen2Ggb06fdIVoA"
    ],
    colors: [
      { name: "Midnight Espresso", hex: "#2E1C1A", imageIndex: 0 },
      { name: "Royal Violet", hex: "#982476", imageIndex: 0 },
      { name: "Ivory Pearl", hex: "#FBF6EE", imageIndex: 0 }
    ],
    color: "Midnight Espresso",
    sizes: ["Standard (75 x 200 cm)", "Maxi (100 x 220 cm)"],
    stockCount: 25,
    description: "Exquisitely woven from 100% natural pure mulberry silk with micro-textured inner weave that stays firmly in place without constant readjustments. Fluid, breathable, and opulent.",
    fabricDetails: "100% Grade 6A Pure Mulberry Silk (75cm x 200cm).",
    stylingAdvice: "Drape loosely over shoulders or style as an elegant evening wrap.",
    careInstructions: "Hand wash cold, air dry flat in shade."
  },
  {
    id: "chantilly-lace-chiffon-shaila",
    name: "Chantilly Lace Edge Chiffon Shaila",
    subtitle: "French Floral Lace Trim | Featherlight Flow",
    price: 38,
    priceInr: 865,
    originalPrice: 50,
    category: "Shaila/Shawl",
    badge: "Atelier Classic",
    targetRegion: "all",
    rating: 4.9,
    reviewsCount: 43,
    isVioletEdition: false,
    styles: [],
    works: [],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAZVub0VhEbfZ42RjVHsOuVG7wBCgHLelkGY6dOel_gT0hCj9B2RVezHENmxJ_Y2puqMuVud0p4ezu2BAO-tDYec2p7u7R0BrlAnxqF8-sj5o6hzp952ZimvWdQMJ27T2bnI0izDnupYarV-4dSCuZNTV4ZI5LIGSBrB7x8UtRvKe2pzAHzOircRZsc5QdPR8BNHP9tTFY1_m7T5pjTpfYw7dLDbvqK7NRWpybaJqeALvz9q6tLOqfhTQ",
    gallery: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAZVub0VhEbfZ42RjVHsOuVG7wBCgHLelkGY6dOel_gT0hCj9B2RVezHENmxJ_Y2puqMuVud0p4ezu2BAO-tDYec2p7u7R0BrlAnxqF8-sj5o6hzp952ZimvWdQMJ27T2bnI0izDnupYarV-4dSCuZNTV4ZI5LIGSBrB7x8UtRvKe2pzAHzOircRZsc5QdPR8BNHP9tTFY1_m7T5pjTpfYw7dLDbvqK7NRWpybaJqeALvz9q6tLOqfhTQ"
    ],
    colors: [
      { name: "Dusty Rose", hex: "#C49A99", imageIndex: 0 },
      { name: "Ivory Pearl", hex: "#FBF6EE", imageIndex: 0 },
      { name: "Charcoal Slate", hex: "#3D3F43", imageIndex: 0 }
    ],
    color: "Dusty Rose",
    sizes: ["Standard (75 x 200 cm)"],
    stockCount: 18,
    description: "An airy chiffon shawl bordered with imported delicate French Chantilly lace for a touch of romantic elegance.",
    fabricDetails: "Premium matte Korean chiffon with French lace borders.",
    stylingAdvice: "Perfect pairing with formal and celebratory abayas.",
    careInstructions: "Delicate hand wash cold."
  },

  // ── 3. HIJAB (NIQAB, CAP, GLOVE ETC) CATEGORY PRODUCTS ──
  {
    id: "breathable-chiffon-niqab",
    name: "Aura Breathable Half & Full Niqab Set",
    subtitle: "Ultra-Light Breathable Chiffon | Anti-Friction Ear Tie",
    price: 25,
    priceInr: 569,
    originalPrice: 35,
    category: "Hijab",
    badge: "Bestseller",
    targetRegion: "arab",
    rating: 5.0,
    reviewsCount: 92,
    isVioletEdition: false,
    styles: [],
    works: [],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB1pd9NiCkfaDXafhb_-Uh3AA4XfN_AwnHEOOx0x2g2ngtcqCTGLjvTaBkKb-K-NzQCG24IEz1UecYCkOoBZQCz8Noq1fcMtAEZXyLpJZs8oZaOU9p5FhAShjG20FoGotY7Q5RtZ_fkUFk2HiRAkqY7a_y5R8pdolKPAtOtdjB3HFdhHKgY2Vfkv8U7Mfjej74-_slJxvP0a9gXoTwEPOLi7mSF52g0Nz5NZjvjyQzAgbD45y67GOUWkw",
    gallery: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB1pd9NiCkfaDXafhb_-Uh3AA4XfN_AwnHEOOx0x2g2ngtcqCTGLjvTaBkKb-K-NzQCG24IEz1UecYCkOoBZQCz8Noq1fcMtAEZXyLpJZs8oZaOU9p5FhAShjG20FoGotY7Q5RtZ_fkUFk2HiRAkqY7a_y5R8pdolKPAtOtdjB3HFdhHKgY2Vfkv8U7Mfjej74-_slJxvP0a9gXoTwEPOLi7mSF52g0Nz5NZjvjyQzAgbD45y67GOUWkw"
    ],
    colors: [
      { name: "Pure Onyx Black", hex: "#111111", imageIndex: 0 },
      { name: "Midnight Espresso", hex: "#2E1C1A", imageIndex: 0 }
    ],
    color: "Pure Onyx Black",
    sizes: ["One Size (Tie-Back Adjustable)"],
    stockCount: 30,
    description: "Designed for all-day breathability and modest comfort with premium microfiber chiffon and concealed soft tie cords.",
    fabricDetails: "Double-layered breathable soft touch georgette chiffon.",
    stylingAdvice: "Pairs seamlessly with any headscarf or abaya.",
    careInstructions: "Machine wash cold in mesh bag."
  },
  {
    id: "satin-lined-undercap-gloves-kit",
    name: "Satin-Lined Undercap & Modest Touch Gloves Set",
    subtitle: "Hair-Protecting Silk Satin | Touchscreen Modesty Gloves",
    price: 30,
    priceInr: 683,
    originalPrice: 42,
    category: "Hijab",
    badge: "Hair Care Essential",
    targetRegion: "all",
    rating: 4.9,
    reviewsCount: 51,
    isVioletEdition: false,
    styles: [],
    works: [],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD6VCCXcrsIQMHcP3Y2cwPwjMw26HSpdXZRpo1lY76HCdTo-vZ5b4M8do6PcZ7DqQvXu3-GlMe2pgswNgngMTx9SsTOZ72uI6VKzR9AO30LImVq-vABf8hOJGP7ROTu8ggWAFYVzo2IbWQV-aYchjycdwCWyhodCmGPBoTo_aAcIjMZuF8wfHjLz_fQt_sGTpPBO2Ddgqm5H07QGTDc4ZBfNS_nT9uyWZncjWeLoA1KPl20JxdlmW11w",
    gallery: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD6VCCXcrsIQMHcP3Y2cwPwjMw26HSpdXZRpo1lY76HCdTo-vZ5b4M8do6PcZ7DqQvXu3-GlMe2pgswNgngMTx9SsTOZ72uI6VKzR9AO30LImVq-vABf8hOJGP7ROTu8ggWAFYVzo2IbWQV-aYchjycdwCWyhodCmGPBoTo_aAcIjMZuF8wfHjLz_fQt_sGTpPBO2Ddgqm5H07QGTDc4ZBfNS_nT9uyWZncjWeLoA1KPl20JxdlmW11w"
    ],
    colors: [
      { name: "Onyx Black", hex: "#111111", imageIndex: 0 },
      { name: "Ivory Pearl", hex: "#FBF6EE", imageIndex: 0 },
      { name: "Serene Sage", hex: "#7D8B79", imageIndex: 0 }
    ],
    color: "Onyx Black",
    sizes: ["One Size Stretch"],
    stockCount: 40,
    description: "Preserve your hair moisture with our 100% silk satin lined undercap, accompanied by ultra-soft stretch modest gloves with smartphone conductive fingertip embroidery.",
    fabricDetails: "Bamboo Modal exterior with 100% Mulberry Silk interior lining.",
    stylingAdvice: "Wear under all chiffon and silk hijabs for zero friction.",
    careInstructions: "Hand wash cold."
  },

  // ── 4. INNER AND PRAYER DRESS CATEGORY PRODUCTS ──
  {
    id: "silk-touch-inner-slip",
    name: "Silk-Touch Sleeveless Abaya Inner Slip Dress",
    subtitle: "Opaque Foundation Layer | Anti-Static Cooling Finish",
    price: 55,
    priceInr: 1251,
    originalPrice: 75,
    category: "Inner & Prayer dress",
    badge: "Foundation Staple",
    targetRegion: "all",
    rating: 4.9,
    reviewsCount: 88,
    isVioletEdition: false,
    styles: [],
    works: [],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCnqkoPTiUDviPUgD5wOYrSVBgUqgYocEhMRfjaPR0AEGQLNSU0reQ8ubR7uxH960qrPF_FqZly7nHa6M1eLYxa5g-5swQgYvy9Z47DR5Ph3pItsJjdCgLs1rkJOUsw_YtUrEPMsYWIosdqamteTBxBFcTP3dxNNOMXvIUzzwnK72cUnoROgWljIfcYMCZlhKDCFJZAJAexcU4FPc2ghiwZ4a4GWa-zXbuRhhx6hDiAwUFdTToqcj62cg",
    gallery: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCnqkoPTiUDviPUgD5wOYrSVBgUqgYocEhMRfjaPR0AEGQLNSU0reQ8ubR7uxH960qrPF_FqZly7nHa6M1eLYxa5g-5swQgYvy9Z47DR5Ph3pItsJjdCgLs1rkJOUsw_YtUrEPMsYWIosdqamteTBxBFcTP3dxNNOMXvIUzzwnK72cUnoROgWljIfcYMCZlhKDCFJZAJAexcU4FPc2ghiwZ4a4GWa-zXbuRhhx6hDiAwUFdTToqcj62cg"
    ],
    colors: [
      { name: "Ivory Pearl", hex: "#FBF6EE", imageIndex: 0 },
      { name: "Midnight Espresso", hex: "#2E1C1A", imageIndex: 0 },
      { name: "Oat Cream", hex: "#ECE2D4", imageIndex: 0 }
    ],
    color: "Ivory Pearl",
    sizes: ["Size 52", "Size 54", "Size 56", "Size 58", "Size 60"],
    stockCount: 22,
    description: "The ultimate foundational slip dress for open abayas and sheer fabrics. Tailored with a modest scoop neckline and cooling breathable micro-satin fabric.",
    fabricDetails: "Breathable Cooling Viscose & Rayon Satin.",
    stylingAdvice: "Essential base layer under open and lace abayas.",
    careInstructions: "Machine wash cold on gentle cycle."
  },
  {
    id: "ethereal-travel-prayer-dress",
    name: "Ethereal 2-Piece Travel Prayer Dress Set with Pouch",
    subtitle: "Attached Hijab & Full Skirt | Wrinkle-Resistant Modal",
    price: 68,
    priceInr: 1547,
    originalPrice: 90,
    category: "Inner & Prayer dress",
    badge: "Travel Favorite",
    targetRegion: "all",
    rating: 5.0,
    reviewsCount: 67,
    isVioletEdition: false,
    styles: [],
    works: [],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDkdZL0iJiKpH_RGkCIR3KLu-FRwu0VNrwd0AKjbEC4LKeHX81c_gdKTa-2u50NIw6c-dk9UQ8TRmm6yQbZjQgiuwIUEEBUp9SCT7pU4TIddCWVvd0w4wOIz4ajtmoc3h3NpKqeI5t9diUWGGVfWCntFu7hYs6yRdpT2QuyTJlISHeDi11u6Nxth4Z0XBlgtoUTQyhGy2lgNyNAECYG-szSx1NYT-9CsllGhOybxhSgFYV5PtfVnL0aWA",
    gallery: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDkdZL0iJiKpH_RGkCIR3KLu-FRwu0VNrwd0AKjbEC4LKeHX81c_gdKTa-2u50NIw6c-dk9UQ8TRmm6yQbZjQgiuwIUEEBUp9SCT7pU4TIddCWVvd0w4wOIz4ajtmoc3h3NpKqeI5t9diUWGGVfWCntFu7hYs6yRdpT2QuyTJlISHeDi11u6Nxth4Z0XBlgtoUTQyhGy2lgNyNAECYG-szSx1NYT-9CsllGhOybxhSgFYV5PtfVnL0aWA"
    ],
    colors: [
      { name: "Serene Sage", hex: "#7D8B79", imageIndex: 0 },
      { name: "Dusty Rose", hex: "#C49A99", imageIndex: 0 },
      { name: "Soft Amethyst", hex: "#C76AA9", imageIndex: 0 }
    ],
    color: "Serene Sage",
    sizes: ["Free Size (Full Length Coverage)"],
    stockCount: 16,
    description: "Complete modesty for prayer, travel, and spiritual tranquility. Includes an attached headpiece with flexible elastic and a matching portable travel drawstring pouch.",
    fabricDetails: "Ultra-soft Modal Rayon blend.",
    stylingAdvice: "Folds compactly into the travel pouch for handbag carrying.",
    careInstructions: "Machine wash cold, hang to dry."
  },

  // ── 5. KIDS ABAYA CATEGORY PRODUCTS ──
  {
    id: "little-princess-farasha-kids",
    name: "Little Princess Butterfly Farasha Kids Abaya",
    subtitle: "Ages 4–14 | Matching Miniature Hijab Included",
    price: 85,
    priceInr: 1934,
    originalPrice: 110,
    category: "Kids abaya",
    badge: "Princess Favorite",
    targetRegion: "all",
    rating: 5.0,
    reviewsCount: 34,
    isVioletEdition: true,
    styles: [],
    works: [],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBYEamtzjpK7ME6SNcwB_Dm777cIG9hjrlL-HktMD3xXRRagPMwnPzQ6iQe0viQ-TzLh4QmpxHcu3NVanxe3hDnC2QRxOeS2lYJYUCj57wjk6s6zQPxuGfRymUJvAtpdqSxQyOCVxYVVXZeKjX1PtHzUwTdxLxRFkQ-uy0Wkdt9PLVSix-WW_Yhj9Q-7vckCUPA1NjfPSGWo1RpBTx4655Eg32yHhxICDT7wKDiG-eqw4hPAEADpyQ5vA",
    gallery: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBYEamtzjpK7ME6SNcwB_Dm777cIG9hjrlL-HktMD3xXRRagPMwnPzQ6iQe0viQ-TzLh4QmpxHcu3NVanxe3hDnC2QRxOeS2lYJYUCj57wjk6s6zQPxuGfRymUJvAtpdqSxQyOCVxYVVXZeKjX1PtHzUwTdxLxRFkQ-uy0Wkdt9PLVSix-WW_Yhj9Q-7vckCUPA1NjfPSGWo1RpBTx4655Eg32yHhxICDT7wKDiG-eqw4hPAEADpyQ5vA"
    ],
    colors: [
      { name: "Royal Violet", hex: "#982476", imageIndex: 0 },
      { name: "Soft Amethyst", hex: "#C76AA9", imageIndex: 0 },
      { name: "Dusty Rose", hex: "#C49A99", imageIndex: 0 }
    ],
    color: "Royal Violet",
    sizes: ["Size 36 (Age 4-6)", "Size 40 (Age 7-9)", "Size 44 (Age 10-12)", "Size 48 (Age 13-14)"],
    stockCount: 14,
    description: "Designed with love for young girls with whimsical sweeping butterfly sleeves, crystal accents, and comfortable lightweight fabrics that allow full freedom to play.",
    fabricDetails: "Featherlight breathable chiffon with soft hypoallergenic lining.",
    stylingAdvice: "Perfect for Eid celebrations, weddings, and Friday gatherings.",
    careInstructions: "Hand wash cold, air dry."
  },

  // ── 6. WHOLESALE CATEGORY PRODUCTS ──
  {
    id: "wholesale-basic-abaya-carton",
    name: "Wholesale Simple & Basic Abaya Master Carton",
    subtitle: "Factory Bulk Export | Pack of 10 Assorted Sizes",
    price: 490,
    priceInr: 11148,
    originalPrice: 850,
    category: "Wholesale",
    wholesaleType: "Simple/Basic",
    wholesaleMinQty: 10,
    badge: "B2B Bulk Export",
    targetRegion: "all",
    rating: 5.0,
    reviewsCount: 19,
    isVioletEdition: false,
    styles: [],
    works: [],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDkdZL0iJiKpH_RGkCIR3KLu-FRwu0VNrwd0AKjbEC4LKeHX81c_gdKTa-2u50NIw6c-dk9UQ8TRmm6yQbZjQgiuwIUEEBUp9SCT7pU4TIddCWVvd0w4wOIz4ajtmoc3h3NpKqeI5t9diUWGGVfWCntFu7hYs6yRdpT2QuyTJlISHeDi11u6Nxth4Z0XBlgtoUTQyhGy2lgNyNAECYG-szSx1NYT-9CsllGhOybxhSgFYV5PtfVnL0aWA",
    gallery: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDkdZL0iJiKpH_RGkCIR3KLu-FRwu0VNrwd0AKjbEC4LKeHX81c_gdKTa-2u50NIw6c-dk9UQ8TRmm6yQbZjQgiuwIUEEBUp9SCT7pU4TIddCWVvd0w4wOIz4ajtmoc3h3NpKqeI5t9diUWGGVfWCntFu7hYs6yRdpT2QuyTJlISHeDi11u6Nxth4Z0XBlgtoUTQyhGy2lgNyNAECYG-szSx1NYT-9CsllGhOybxhSgFYV5PtfVnL0aWA"
    ],
    colors: [
      { name: "Assorted Core Neutrals (Black, Espresso, Sage, Rose)", hex: "#111111", imageIndex: 0 }
    ],
    color: "Assorted Core Neutrals",
    sizes: ["Assorted Master Pack (Sizes 52, 54, 56, 58)"],
    stockCount: 100,
    description: "Direct wholesale carton for retail boutiques, modest fashion shops, and commercial distributors. Includes 10 pieces of high-density Nida / Chiffon basic abayas with standard retail packaging.",
    fabricDetails: "Export-grade premium Korean Nida fabric.",
    stylingAdvice: "Ideal wholesale stock ready for retail display.",
    careInstructions: "Bulk carton export with individual cellophane polybags."
  },
  {
    id: "wholesale-embroidery-handwork-bundle",
    name: "Wholesale Embroidery & Handwork Haute Boutique Pack",
    subtitle: "Artisan Beaded & Embroidered Abayas | Pack of 10 Pieces",
    price: 780,
    priceInr: 17745,
    originalPrice: 1200,
    category: "Wholesale",
    wholesaleType: "Handwork",
    wholesaleMinQty: 10,
    badge: "B2B Luxury Tier",
    targetRegion: "arab",
    rating: 5.0,
    reviewsCount: 12,
    isVioletEdition: true,
    styles: [],
    works: [],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBwpGHDV5eQMWi71D4mWI7voUd6mXcXo_PTliCl6CQhvIaRrMlarXpn-r-525bSjOEkrsbyu3U7zZ3JfTBvpB1PziSsHKFHFWb1xFFEQtM58gz89WscIgS3NH2jdY_eFZxTxxxrRFRGKiDDZH_8lWjYSE3li5ix01zdBOA6n6y2CzPMacxyx_52_efpx2AoC7zECpL3lIaGkhpz1fdqaUX_xVKePZtVBnB94cljTFvCuTw-g707mRks_g",
    gallery: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBwpGHDV5eQMWi71D4mWI7voUd6mXcXo_PTliCl6CQhvIaRrMlarXpn-r-525bSjOEkrsbyu3U7zZ3JfTBvpB1PziSsHKFHFWb1xFFEQtM58gz89WscIgS3NH2jdY_eFZxTxxxrRFRGKiDDZH_8lWjYSE3li5ix01zdBOA6n6y2CzPMacxyx_52_efpx2AoC7zECpL3lIaGkhpz1fdqaUX_xVKePZtVBnB94cljTFvCuTw-g707mRks_g"
    ],
    colors: [
      { name: "Atelier Palette (Espresso, Violet, Amethyst, Ivory)", hex: "#982476", imageIndex: 0 }
    ],
    color: "Atelier Palette",
    sizes: ["Assorted Sizes 52–58"],
    stockCount: 50,
    description: "Commercial wholesale bundle of premium artisan embroidered and hand-beaded abayas curated for high-end modest boutiques and bridal shops.",
    fabricDetails: "Silk-feel crepe and georgette with genuine hand-worked embellishments.",
    stylingAdvice: "Contact concierge on WhatsApp for custom bulk color selections.",
    careInstructions: "Ships with protective hanging garment bags."
  },
  {
    id: "wholesale-kids-assorted-pack",
    name: "Wholesale Kids Abaya Boutique Assortment",
    subtitle: "Ages 4 to 14 | Pack of 12 Pieces with Matching Shailas",
    price: 420,
    priceInr: 9555,
    originalPrice: 650,
    category: "Wholesale",
    wholesaleType: "Kids",
    wholesaleMinQty: 12,
    badge: "B2B Kids Pack",
    targetRegion: "all",
    rating: 4.8,
    reviewsCount: 15,
    isVioletEdition: false,
    styles: [],
    works: [],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBYEamtzjpK7ME6SNcwB_Dm777cIG9hjrlL-HktMD3xXRRagPMwnPzQ6iQe0viQ-TzLh4QmpxHcu3NVanxe3hDnC2QRxOeS2lYJYUCj57wjk6s6zQPxuGfRymUJvAtpdqSxQyOCVxYVVXZeKjX1PtHzUwTdxLxRFkQ-uy0Wkdt9PLVSix-WW_Yhj9Q-7vckCUPA1NjfPSGWo1RpBTx4655Eg32yHhxICDT7wKDiG-eqw4hPAEADpyQ5vA",
    gallery: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBYEamtzjpK7ME6SNcwB_Dm777cIG9hjrlL-HktMD3xXRRagPMwnPzQ6iQe0viQ-TzLh4QmpxHcu3NVanxe3hDnC2QRxOeS2lYJYUCj57wjk6s6zQPxuGfRymUJvAtpdqSxQyOCVxYVVXZeKjX1PtHzUwTdxLxRFkQ-uy0Wkdt9PLVSix-WW_Yhj9Q-7vckCUPA1NjfPSGWo1RpBTx4655Eg32yHhxICDT7wKDiG-eqw4hPAEADpyQ5vA"
    ],
    colors: [
      { name: "Pastel & Jewel Mix (Violet, Amethyst, Rose, Black)", hex: "#C76AA9", imageIndex: 0 }
    ],
    color: "Pastel & Jewel Mix",
    sizes: ["Assorted Ages 4, 6, 8, 10, 12, 14"],
    stockCount: 80,
    description: "Bespoke wholesale carton of 12 young girl farashas and modest cut abayas complete with mini headscarves.",
    fabricDetails: "Comfort soft nida & chiffon.",
    stylingAdvice: "Fast-selling seasonal stock for Eid and modest youth collections.",
    careInstructions: "Individually polybagged."
  }
];

export const COLLECTIONS = [
  {
    id: "everyday-essentials",
    name: "Everyday Abaya Essentials",
    description: "Breathable open and closed cut silhouettes designed for effortless all-day wear.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDkdZL0iJiKpH_RGkCIR3KLu-FRwu0VNrwd0AKjbEC4LKeHX81c_gdKTa-2u50NIw6c-dk9UQ8TRmm6yQbZjQgiuwIUEEBUp9SCT7pU4TIddCWVvd0w4wOIz4ajtmoc3h3NpKqeI5t9diUWGGVfWCntFu7hYs6yRdpT2QuyTJlISHeDi11u6Nxth4Z0XBlgtoUTQyhGy2lgNyNAECYG-szSx1NYT-9CsllGhOybxhSgFYV5PtfVnL0aWA",
    styleFilter: "Open abaya",
    itemCount: "18 Styles"
  },
  {
    id: "pure-silk-atelier",
    name: "Pure Mulberry Silk Atelier",
    description: "Artisanal sweeping butterfly and kimono silhouettes in rich espresso and delicate amethyst hues.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD-Sf1dgvSxQEdIcuInSxcRUwW6B-nBrZnNrAlOjxmNSTXEgqHvgbTWfGWkg5QYKVY0d9lsnGmuQwBuPf3yXH71nFMwMaVjxwvCixfo4u7HOgAOx-Z-drovy_YH-5MOgACvt0Pwe1icr3mK9M_bxXtmzzaUPFW_vyPfmx1GGDVrW_F2AgYUY40fBuNWPQElc5LbqXQuB_wLdkClmmrvrK6lHW6RI2zefAzNng6DUsYCen2Ggb06fdIVoA",
    styleFilter: "Butterfly or farasha",
    itemCount: "12 Styles"
  },
  {
    id: "bridal-atelier",
    name: "Occasion & 2-Piece Atelier",
    description: "High-twist elegant cuts with delicate stonework, embroidery, and bespoke handwork.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBwpGHDV5eQMWi71D4mWI7voUd6mXcXo_PTliCl6CQhvIaRrMlarXpn-r-525bSjOEkrsbyu3U7zZ3JfTBvpB1PziSsHKFHFWb1xFFEQtM58gz89WscIgS3NH2jdY_eFZxTxxxrRFRGKiDDZH_8lWjYSE3li5ix01zdBOA6n6y2CzPMacxyx_52_efpx2AoC7zECpL3lIaGkhpz1fdqaUX_xVKePZtVBnB94cljTFvCuTw-g707mRks_g",
    styleFilter: "2 piece abaya (with inner)",
    itemCount: "8 Styles"
  }
];

export const FABRICS = [
  {
    name: "Pure Mulberry Silk",
    subtitle: "Grade 6A • 19 Momme",
    description: "Naturally hypoallergenic with an unmistakable liquid luster and breathability.",
    icon: "sparkles"
  },
  {
    name: "Pebble Georgette",
    subtitle: "Japanese High-Twist",
    description: "Slightly textured hand-feel for architectural volume, wrinkle-resistance, and sharp clean folds.",
    icon: "feather"
  },
  {
    name: "Airy Chiffon",
    subtitle: "Ultra Microfiber",
    description: "Breathable featherlight drape that provides effortless floaty movement with matte refinement.",
    icon: "wind"
  },
  {
    name: "TENCEL™ Modal",
    subtitle: "Austrian Beechwood",
    description: "Cloud-soft four-way mechanical stretch that frames the silhouette with zero constriction.",
    icon: "shield"
  }
];

export const REVIEWS = [
  {
    id: 1,
    author: "Zaynab Al-Mansoor",
    location: "London, UK",
    rating: 5,
    title: "Unrivaled quality and customized cut",
    comment: "The 2-Piece Abaya with Stonework in Midnight Espresso silk is easily the finest piece in my wardrobe. The custom length 56 was tailored to perfection.",
    product: "Midnight Espresso Silk Abaya",
    date: "2 weeks ago"
  },
  {
    id: 2,
    author: "Dr. Maryam Khan",
    location: "Dubai, UAE",
    rating: 5,
    title: "Breathtaking Violet Farasha",
    comment: "I chose the Butterfly / Farasha cut with Handwork embroidery for an international gala and received endless compliments. The craftsmanship is bespoke haute couture.",
    product: "Royal Violet Mulberry Silk Abaya",
    date: "1 month ago"
  },
  {
    id: 3,
    author: "Safiya Nour",
    location: "New York, USA",
    rating: 5,
    title: "Kimono style in Modal jersey",
    comment: "I love the Kimono cut with subtle threadwork. Zero fuss, pure luxury comfort through all-day events.",
    product: "Sage Haven Modal Luxe Abaya",
    date: "3 weeks ago"
  }
];
