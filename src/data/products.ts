import { Product } from '@/types';

// ======================================================
// Lillyum Fragrance — Sample Product Catalog
// All 56 images from public/images/ are used across products
// Replace descriptions, notes, and prices with actual client data
// ======================================================

export const SAMPLE_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    slug: 'armaf-club-de-nuit-intense-man-edp-105ml',
    title: 'Club de Nuit Intense Man',
    brand: 'Armaf',
    fragranceName: 'Club de Nuit Intense Man',
    description: 'A bold, masculine fragrance that opens with bergamot and apple before revealing a heart of birch, jasmine, and pineapple. The drydown is rich with amber, musk, and vetiver — making it one of the most complimented fragrances on the market. Long-lasting performance perfect for evening wear and special occasions.',
    fragranceType: 'EDP',
    fragranceFamily: 'Woody',
    gender: 'Men',
    notes: {
      top: ['Bergamot', 'Apple', 'Lemon'],
      middle: ['Birch', 'Jasmine', 'Pineapple', 'Rose'],
      base: ['Ambergris', 'Musk', 'Vanilla', 'Vetiver'],
    },
    variants: [
      { size: 105, price: 6500, salePrice: 5800, stock: 12, sku: 'ARM-CDNI-105', lowStockThreshold: 5 },
    ],
    images: [
      '/images/0058f985846f5d72fa882910e61518fd.jpg',
      '/images/047fac99f5e264d07c230a33fb3b2db1.jpg',
    ],
    status: 'active',
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
    categories: ['men', 'edp', 'best-sellers'],
    authenticityInfo: '100% authentic, imported from Dubai. Batch code verifiable.',
    orderCount: 48,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-06-01T00:00:00Z',
  },
  {
    id: 'prod-002',
    slug: 'lattafa-oud-for-glory-edp-100ml',
    title: 'Oud For Glory',
    brand: 'Lattafa',
    fragranceName: 'Oud For Glory',
    description: 'A majestic oriental fragrance for the modern connoisseur. Oud For Glory opens with a smoky, resinous oud note combined with saffron, then transitions into a rich heart of rose and leather. The base is anchored with sandalwood and amber, creating an opulent trail that lasts all day.',
    fragranceType: 'EDP',
    fragranceFamily: 'Oriental',
    gender: 'Unisex',
    notes: {
      top: ['Saffron', 'Oud', 'Bergamot'],
      middle: ['Rose', 'Leather', 'Incense'],
      base: ['Sandalwood', 'Amber', 'Musk', 'Vanilla'],
    },
    variants: [
      { size: 100, price: 7200, stock: 8, sku: 'LAT-OFG-100', lowStockThreshold: 5 },
    ],
    images: [
      '/images/0771edee4246abc5f034c3be2e739e74.jpg',
      '/images/08e49d283a7feed445a7a7e0bf124f8c.jpg',
    ],
    status: 'active',
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
    categories: ['unisex', 'edp', 'best-sellers'],
    authenticityInfo: '100% authentic, original Lattafa product.',
    orderCount: 35,
    createdAt: '2024-02-10T00:00:00Z',
    updatedAt: '2024-06-01T00:00:00Z',
  },
  {
    id: 'prod-003',
    slug: 'rasasi-hawas-edt-100ml',
    title: 'Hawas',
    brand: 'Rasasi',
    fragranceName: 'Hawas',
    description: 'A fresh aquatic masculine fragrance that captures the essence of the ocean breeze. Hawas opens with bright citrus and mint, blooms into a floral aquatic heart, and settles on a woody, musky base. Perfect for daily wear, office, and outdoor activities.',
    fragranceType: 'EDT',
    fragranceFamily: 'Aquatic',
    gender: 'Men',
    notes: {
      top: ['Mint', 'Bergamot', 'Coconut'],
      middle: ['Jasmine', 'Freesia', 'Ambrette'],
      base: ['Musk', 'Woods', 'Amber'],
    },
    variants: [
      { size: 100, price: 5500, salePrice: 4800, stock: 15, sku: 'RAS-HAW-100', lowStockThreshold: 5 },
    ],
    images: [
      '/images/0bdcdcee7a28ae6b154324cf77b4a45b.jpg',
      '/images/0f1335e388535d48b99c24c0e4894fc2.jpg',
    ],
    status: 'active',
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: true,
    categories: ['men', 'edt', 'best-sellers'],
    authenticityInfo: '100% authentic Rasasi, imported from UAE.',
    orderCount: 42,
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-06-01T00:00:00Z',
  },
  {
    id: 'prod-004',
    slug: 'lattafa-khamrah-edp-100ml',
    title: 'Khamrah',
    brand: 'Lattafa',
    fragranceName: 'Khamrah',
    description: 'A luxurious and addictive oriental fragrance that has taken the world by storm. Khamrah opens with a heady blend of rum and praline, warming into a gourmand heart of oud and vanilla. The base is a rich, opulent blend of sandalwood and musk. An absolute crowd-pleaser.',
    fragranceType: 'EDP',
    fragranceFamily: 'Oriental',
    gender: 'Unisex',
    notes: {
      top: ['Rum', 'Praline', 'Bergamot'],
      middle: ['Oud', 'Rose', 'Jasmine'],
      base: ['Sandalwood', 'Vanilla', 'Tonka Bean', 'Musk'],
    },
    variants: [
      { size: 100, price: 7800, stock: 10, sku: 'LAT-KHM-100', lowStockThreshold: 5 },
    ],
    images: [
      '/images/1306d835e1b3f131d775bd3581fbc463.jpg',
      '/images/1c726f4603ada87bb1abeef8f1cad381.jpg',
    ],
    status: 'active',
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: false,
    categories: ['unisex', 'edp', 'new-arrivals', 'gift-sets'],
    authenticityInfo: '100% authentic Lattafa product.',
    orderCount: 22,
    createdAt: '2024-05-01T00:00:00Z',
    updatedAt: '2024-06-01T00:00:00Z',
  },
  {
    id: 'prod-005',
    slug: 'ajmal-evoke-silver-edition-edp-75ml',
    title: 'Evoke Silver Edition',
    brand: 'Ajmal',
    fragranceName: 'Evoke Silver Edition',
    description: 'A sophisticated and contemporary women\'s fragrance from Ajmal. Evoke Silver opens with sparkling top notes of citrus and aldehydes, leading to a floral heart of rose and lily, and a soft base of white musk and cedarwood. Feminine, elegant, and office-ready.',
    fragranceType: 'EDP',
    fragranceFamily: 'Floral',
    gender: 'Women',
    notes: {
      top: ['Aldehydes', 'Citrus', 'Bergamot'],
      middle: ['Rose', 'Lily', 'Iris'],
      base: ['White Musk', 'Cedarwood', 'Sandalwood'],
    },
    variants: [
      { size: 75, price: 5200, salePrice: 4500, stock: 7, sku: 'AJM-EVS-75', lowStockThreshold: 5 },
    ],
    images: [
      '/images/1dc9d3caa49629dcf553b591e815fcb9.jpg',
      '/images/233a5b36a9d3a70bd8866e9d74c9b5a6.jpg',
    ],
    status: 'active',
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: false,
    categories: ['women', 'edp'],
    authenticityInfo: '100% authentic Ajmal fragrance.',
    orderCount: 18,
    createdAt: '2024-03-01T00:00:00Z',
    updatedAt: '2024-06-01T00:00:00Z',
  },
  {
    id: 'prod-006',
    slug: 'al-rehab-silver-edt-50ml',
    title: 'Silver',
    brand: 'Al-Rehab',
    fragranceName: 'Silver',
    description: 'A light and refreshing Arabic fragrance that offers excellent value for money. Silver by Al-Rehab is a fresh, clean scent with hints of melon, citrus, and soft white musk. Perfect for daily wear and hot Sri Lankan weather. A great introduction to Arabic fragrances.',
    fragranceType: 'EDT',
    fragranceFamily: 'Fresh',
    gender: 'Men',
    notes: {
      top: ['Melon', 'Citrus', 'Green Notes'],
      middle: ['Floral', 'Spices'],
      base: ['White Musk', 'Sandalwood'],
    },
    variants: [
      { size: 50, price: 2500, stock: 25, sku: 'ALR-SLV-50', lowStockThreshold: 5 },
    ],
    images: [
      '/images/29d72228b8254853126e1f8c0074c08d.jpg',
      '/images/2b05a7e1f1f041990e1609899c7d991d.jpg',
    ],
    status: 'active',
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: false,
    categories: ['men', 'edt'],
    authenticityInfo: '100% authentic Al-Rehab product.',
    orderCount: 29,
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-06-01T00:00:00Z',
  },
  {
    id: 'prod-007',
    slug: 'armaf-venetian-deluxe-edp-100ml',
    title: 'Venetian Deluxe',
    brand: 'Armaf',
    fragranceName: 'Venetian Deluxe',
    description: 'Inspired by the romance and grandeur of Venice, this fragrance opens with vibrant citrus notes and transitions to a floral heart with jasmine and rose petals. The base offers a sophisticated blend of sandalwood, musk, and tonka bean — perfect for special occasions.',
    fragranceType: 'EDP',
    fragranceFamily: 'Floral',
    gender: 'Women',
    notes: {
      top: ['Bergamot', 'Mandarin', 'Peach'],
      middle: ['Jasmine', 'Rose', 'Violet'],
      base: ['Sandalwood', 'Tonka Bean', 'Musk', 'Amber'],
    },
    variants: [
      { size: 100, price: 6800, stock: 6, sku: 'ARM-VDX-100', lowStockThreshold: 5 },
    ],
    images: [
      '/images/2dfa0283537a04e2f601b2556d3cbe5a.jpg',
      '/images/2e515b013ce09861900e85d837efa80f.jpg',
    ],
    status: 'active',
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: false,
    categories: ['women', 'edp', 'new-arrivals'],
    authenticityInfo: '100% authentic Armaf fragrance.',
    orderCount: 14,
    createdAt: '2024-05-15T00:00:00Z',
    updatedAt: '2024-06-01T00:00:00Z',
  },
  {
    id: 'prod-008',
    slug: 'lattafa-asad-edp-100ml',
    title: 'Asad',
    brand: 'Lattafa',
    fragranceName: 'Asad',
    description: 'Named after the Arabic word for lion, Asad is a powerhouse masculine fragrance that commands respect. It opens with sharp bergamot and violet, heart of oud and leather, and settles into a rich base of amber and vetiver. A statement fragrance for confident men.',
    fragranceType: 'EDP',
    fragranceFamily: 'Woody',
    gender: 'Men',
    notes: {
      top: ['Bergamot', 'Violet', 'Pepper'],
      middle: ['Oud', 'Leather', 'Cardamom'],
      base: ['Amber', 'Vetiver', 'Musk', 'Sandalwood'],
    },
    variants: [
      { size: 100, price: 6200, stock: 9, sku: 'LAT-ASD-100', lowStockThreshold: 5 },
    ],
    images: [
      '/images/32c994b607a95343e835fe2316b7ce88.jpg',
      '/images/35a20c4306790e921f02ced9c1eb67cb.jpg',
    ],
    status: 'active',
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: false,
    categories: ['men', 'edp'],
    authenticityInfo: '100% authentic Lattafa product.',
    orderCount: 20,
    createdAt: '2024-02-20T00:00:00Z',
    updatedAt: '2024-06-01T00:00:00Z',
  },
  {
    id: 'prod-009',
    slug: 'ajmal-wisal-edp-50ml',
    title: 'Wisal',
    brand: 'Ajmal',
    fragranceName: 'Wisal',
    description: 'Wisal by Ajmal is a charming, feminine floral fragrance. The opening bursts with lush florals of rose and peony, leading to a warm heart of gardenia and jasmine. The base is a delicate blend of musk and vanilla, leaving a beautiful, lingering sillage.',
    fragranceType: 'EDP',
    fragranceFamily: 'Floral',
    gender: 'Women',
    notes: {
      top: ['Rose', 'Peony', 'Citrus'],
      middle: ['Gardenia', 'Jasmine', 'Lily of the Valley'],
      base: ['Musk', 'Vanilla', 'Amber'],
    },
    variants: [
      { size: 50, price: 4500, stock: 11, sku: 'AJM-WSL-50', lowStockThreshold: 5 },
    ],
    images: [
      '/images/3bd88a8cf8ac69f5828a961141baacc7.jpg',
      '/images/3ec46e7a59ba6e1dc7e79cfb9d32ea2a.jpg',
    ],
    status: 'active',
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: false,
    categories: ['women', 'edp'],
    authenticityInfo: '100% authentic Ajmal product.',
    orderCount: 16,
    createdAt: '2024-03-10T00:00:00Z',
    updatedAt: '2024-06-01T00:00:00Z',
  },
  {
    id: 'prod-010',
    slug: 'rasasi-la-yuqawam-edp-75ml',
    title: 'La Yuqawam',
    brand: 'Rasasi',
    fragranceName: 'La Yuqawam',
    description: 'La Yuqawam by Rasasi is a luxurious Arabic EDP, beloved for its intense oud and rose combination. Opens with sharp oud and pepper, mellows into a rosy, floral heart, and closes with deep amber and musk. Extraordinary longevity and projection. A true statement in Arabian perfumery.',
    fragranceType: 'EDP',
    fragranceFamily: 'Oriental',
    gender: 'Men',
    notes: {
      top: ['Oud', 'Pepper', 'Bergamot'],
      middle: ['Rose', 'Geranium', 'Labdanum'],
      base: ['Amber', 'Musk', 'Sandalwood', 'Oud'],
    },
    variants: [
      { size: 75, price: 7500, stock: 4, sku: 'RAS-LYQ-75', lowStockThreshold: 5 },
    ],
    images: [
      '/images/3f5a9b3d7d07ab1203b5a753c37bbf5b.jpg',
      '/images/440ffe895171256286ad489ca83ba45c.jpg',
    ],
    status: 'active',
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: false,
    categories: ['men', 'edp'],
    authenticityInfo: '100% authentic Rasasi product.',
    orderCount: 11,
    createdAt: '2024-02-05T00:00:00Z',
    updatedAt: '2024-06-01T00:00:00Z',
  },
  {
    id: 'prod-011',
    slug: 'armaf-club-de-nuit-women-edp-105ml',
    title: 'Club de Nuit Women',
    brand: 'Armaf',
    fragranceName: 'Club de Nuit Women',
    description: 'The feminine counterpart to the iconic Club de Nuit line, this EDP is an exquisite floral fragrance for the modern woman. The opening is a vibrant blend of citrus and berries, followed by a lush floral heart, and a soft base of musk, sandalwood and peach.',
    fragranceType: 'EDP',
    fragranceFamily: 'Floral',
    gender: 'Women',
    notes: {
      top: ['Pink Pepper', 'Bergamot', 'Raspberry'],
      middle: ['Rose', 'Peony', 'Jasmine'],
      base: ['Peach', 'Sandalwood', 'White Musk'],
    },
    variants: [
      { size: 105, price: 6200, salePrice: 5500, stock: 8, sku: 'ARM-CDNW-105', lowStockThreshold: 5 },
    ],
    images: [
      '/images/48a77d77e921c618bfadc133cd05e67a.jpg',
      '/images/4c5b01a0b0e55ebd22d84bb5ea4c6be2.jpg',
    ],
    status: 'active',
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: true,
    categories: ['women', 'edp', 'best-sellers'],
    authenticityInfo: '100% authentic Armaf fragrance.',
    orderCount: 31,
    createdAt: '2024-01-25T00:00:00Z',
    updatedAt: '2024-06-01T00:00:00Z',
  },
  {
    id: 'prod-012',
    slug: 'lattafa-ramz-gold-edp-100ml',
    title: 'Ramz Gold',
    brand: 'Lattafa',
    fragranceName: 'Ramz Gold',
    description: 'Ramz Gold is a dazzling unisex oriental fragrance that radiates warmth and luxury. The golden opening combines saffron and bergamot, leading to a heart of rose and oud. The base is rich with amber, musk, and warm woods. A fragrance that makes a statement wherever you go.',
    fragranceType: 'EDP',
    fragranceFamily: 'Oriental',
    gender: 'Unisex',
    notes: {
      top: ['Saffron', 'Bergamot', 'Cardamom'],
      middle: ['Rose', 'Oud', 'Jasmine'],
      base: ['Amber', 'Musk', 'Woods', 'Vanilla'],
    },
    variants: [
      { size: 100, price: 8500, stock: 3, sku: 'LAT-RMZ-100', lowStockThreshold: 5 },
    ],
    images: [
      '/images/4ed73906dc55b3491b3fc80daba6b528.jpg',
      '/images/4f020950166fe0a71c84afd34021eec8.jpg',
    ],
    status: 'active',
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: false,
    categories: ['unisex', 'edp', 'gift-sets'],
    authenticityInfo: '100% authentic Lattafa product.',
    orderCount: 9,
    createdAt: '2024-03-20T00:00:00Z',
    updatedAt: '2024-06-01T00:00:00Z',
  },
  {
    id: 'prod-013',
    slug: 'rasasi-al-wisam-day-edt-100ml',
    title: 'Al Wisam Day',
    brand: 'Rasasi',
    fragranceName: 'Al Wisam Day',
    description: 'Al Wisam Day is a fresh, masculine daytime fragrance from Rasasi. Perfect for the Sri Lankan climate, it opens with bright citrus notes of bergamot and lime, transitions to a clean, aquatic floral heart, and dries down to a refreshing woody-musk base.',
    fragranceType: 'EDT',
    fragranceFamily: 'Fresh',
    gender: 'Men',
    notes: {
      top: ['Bergamot', 'Lime', 'Mint'],
      middle: ['Marine', 'Geranium', 'Rose'],
      base: ['Sandalwood', 'Musk', 'Cedar'],
    },
    variants: [
      { size: 100, price: 5000, stock: 14, sku: 'RAS-AWD-100', lowStockThreshold: 5 },
    ],
    images: [
      '/images/51f5a0c44c5e1cd2aa61c2054f8b0753.jpg',
      '/images/52182b05c088f9d613694f857bb632ad.jpg',
    ],
    status: 'active',
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: false,
    categories: ['men', 'edt'],
    authenticityInfo: '100% authentic Rasasi product.',
    orderCount: 19,
    createdAt: '2024-02-15T00:00:00Z',
    updatedAt: '2024-06-01T00:00:00Z',
  },
  {
    id: 'prod-014',
    slug: 'ajmal-amber-wood-edp-50ml',
    title: 'Amber Wood',
    brand: 'Ajmal',
    fragranceName: 'Amber Wood',
    description: 'A warm, comforting fragrance that wraps you in amber and wood. Perfect for cooler evenings, Amber Wood opens with spicy cardamom and nutmeg, transitions to a heart of precious woods, and closes with a rich, honeyed amber base. Unisex and versatile.',
    fragranceType: 'EDP',
    fragranceFamily: 'Woody',
    gender: 'Unisex',
    notes: {
      top: ['Cardamom', 'Nutmeg', 'Bergamot'],
      middle: ['Oud', 'Cedar', 'Vetiver'],
      base: ['Amber', 'Honey', 'Musk', 'Labdanum'],
    },
    variants: [
      { size: 50, price: 5800, stock: 6, sku: 'AJM-AWD-50', lowStockThreshold: 5 },
    ],
    images: [
      '/images/5a19e7b5213b09631d36e73cf9492163.jpg',
      '/images/5e1b757b33b35277b7acb47514c20e05.jpg',
    ],
    status: 'active',
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: false,
    categories: ['unisex', 'edp', 'new-arrivals'],
    authenticityInfo: '100% authentic Ajmal product.',
    orderCount: 12,
    createdAt: '2024-05-10T00:00:00Z',
    updatedAt: '2024-06-01T00:00:00Z',
  },
  {
    id: 'prod-015',
    slug: 'armaf-niche-oud-extrait-60ml',
    title: 'Niche Oud',
    brand: 'Armaf',
    fragranceName: 'Niche Oud',
    description: 'A luxurious Extrait de Parfum that explores the full depth and complexity of Oud. The opening is a smoky, resinous oud layered with saffron and rose. The drydown is incredibly long-lasting with notes of sandalwood, amber, and incense. A true connoisseur\'s fragrance.',
    fragranceType: 'Extrait',
    fragranceFamily: 'Oriental',
    gender: 'Unisex',
    notes: {
      top: ['Oud', 'Saffron', 'Rose'],
      middle: ['Incense', 'Leather', 'Geranium'],
      base: ['Sandalwood', 'Amber', 'Musk', 'Patchouli'],
    },
    variants: [
      { size: 60, price: 9500, stock: 5, sku: 'ARM-NOD-60', lowStockThreshold: 3 },
    ],
    images: [
      '/images/64831624888527e667d28311ed393062.jpg',
      '/images/6659c3a1f2f34a6d4e1f2638305790a7.jpg',
    ],
    status: 'active',
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: false,
    categories: ['unisex', 'new-arrivals', 'extrait'],
    authenticityInfo: '100% authentic Armaf niche collection product.',
    orderCount: 7,
    createdAt: '2024-06-01T00:00:00Z',
    updatedAt: '2024-06-01T00:00:00Z',
  },
  {
    id: 'prod-016',
    slug: 'lattafa-yara-edp-100ml',
    title: 'Yara',
    brand: 'Lattafa',
    fragranceName: 'Yara',
    description: 'Yara is a sweet and irresistible feminine fragrance that has captured the hearts of fragrance lovers worldwide. It opens with bright citrus and juicy fruits, transitions to a romantic floral heart, and settles on a warm, sweet base of vanilla and caramel. Perfect for young women.',
    fragranceType: 'EDP',
    fragranceFamily: 'Floral',
    gender: 'Women',
    notes: {
      top: ['Bergamot', 'Pineapple', 'Strawberry'],
      middle: ['Rose', 'Jasmine', 'Lily'],
      base: ['Vanilla', 'Caramel', 'Musk', 'Sandalwood'],
    },
    variants: [
      { size: 100, price: 6500, stock: 13, sku: 'LAT-YRA-100', lowStockThreshold: 5 },
    ],
    images: [
      '/images/69f53618e3087b573beb2a5514c24473.jpg',
      '/images/6cc76743dc3d4fb21d032cdd79fe59ef.jpg',
    ],
    status: 'active',
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
    categories: ['women', 'edp', 'best-sellers'],
    authenticityInfo: '100% authentic Lattafa product.',
    orderCount: 38,
    createdAt: '2024-01-30T00:00:00Z',
    updatedAt: '2024-06-01T00:00:00Z',
  },
  {
    id: 'prod-017',
    slug: 'rasasi-dhanal-oudh-abiyad-edp-75ml',
    title: 'Dhanal Oudh Abiyad',
    brand: 'Rasasi',
    fragranceName: 'Dhanal Oudh Abiyad',
    description: 'A beautifully crafted white oud fragrance from Rasasi, featuring a clean and sophisticated interpretation of oud. The fragrance opens with aldehydes and rose, transitions to a heart of white oud and sandalwood, and closes with a creamy musk base. Elegant and versatile.',
    fragranceType: 'EDP',
    fragranceFamily: 'Woody',
    gender: 'Unisex',
    notes: {
      top: ['Aldehydes', 'Rose', 'Bergamot'],
      middle: ['White Oud', 'Sandalwood', 'Jasmine'],
      base: ['Musk', 'Amber', 'Cream', 'Cedar'],
    },
    variants: [
      { size: 75, price: 7000, stock: 7, sku: 'RAS-DOA-75', lowStockThreshold: 5 },
    ],
    images: [
      '/images/73528511139f8885db87ae3403dc2b21.jpg',
      '/images/8423c27bcaa266352739036edb161145.jpg',
    ],
    status: 'active',
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: false,
    categories: ['unisex', 'edp'],
    authenticityInfo: '100% authentic Rasasi product.',
    orderCount: 13,
    createdAt: '2024-02-25T00:00:00Z',
    updatedAt: '2024-06-01T00:00:00Z',
  },
  {
    id: 'prod-018',
    slug: 'ajmal-aurum-edp-75ml',
    title: 'Aurum',
    brand: 'Ajmal',
    fragranceName: 'Aurum',
    description: 'Aurum by Ajmal is a radiant, luxurious women\'s EDP. This golden fragrance opens with bright floral notes of orange blossom and peach, transitions to a rich heart of jasmine and rose, and dries to a warm base of amber, musk, and precious woods. A true gem.',
    fragranceType: 'EDP',
    fragranceFamily: 'Floral',
    gender: 'Women',
    notes: {
      top: ['Orange Blossom', 'Peach', 'Bergamot'],
      middle: ['Jasmine', 'Rose', 'Ylang-Ylang'],
      base: ['Amber', 'Musk', 'Sandalwood', 'Vetiver'],
    },
    variants: [
      { size: 75, price: 6000, salePrice: 5200, stock: 9, sku: 'AJM-AUR-75', lowStockThreshold: 5 },
    ],
    images: [
      '/images/86a7ea608b0155b8935a22efa8a9c12f.jpg',
      '/images/8a9a7313bb27e5a998c3f427bf0a7ba2.jpg',
    ],
    status: 'active',
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: false,
    categories: ['women', 'edp', 'new-arrivals', 'offers'],
    authenticityInfo: '100% authentic Ajmal product.',
    orderCount: 17,
    createdAt: '2024-05-05T00:00:00Z',
    updatedAt: '2024-06-01T00:00:00Z',
  },
  {
    id: 'prod-019',
    slug: 'lattafa-bade-al-oud-edp-100ml',
    title: 'Bade\'e Al Oud',
    brand: 'Lattafa',
    fragranceName: 'Bade\'e Al Oud',
    description: 'Bade\'e Al Oud is a magnificent Oriental fragrance that presents oud in its most opulent form. The opening is intense with smoky oud and exotic spices. The heart reveals rose and saffron, while the base settles to a deeply sensual blend of amber, sandalwood, and musk.',
    fragranceType: 'EDP',
    fragranceFamily: 'Oriental',
    gender: 'Unisex',
    notes: {
      top: ['Oud', 'Smoky Notes', 'Saffron'],
      middle: ['Rose', 'Geranium', 'Patchouli'],
      base: ['Amber', 'Sandalwood', 'Musk', 'Vanilla'],
    },
    variants: [
      { size: 100, price: 8000, stock: 5, sku: 'LAT-BAO-100', lowStockThreshold: 5 },
    ],
    images: [
      '/images/8b0d5a0aaadbdc13f3f5a4404dee0ab3.jpg',
      '/images/8d6a98f51a93f8dffa2bdb53224a866d.jpg',
    ],
    status: 'active',
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: false,
    categories: ['unisex', 'edp', 'gift-sets'],
    authenticityInfo: '100% authentic Lattafa product.',
    orderCount: 15,
    createdAt: '2024-03-05T00:00:00Z',
    updatedAt: '2024-06-01T00:00:00Z',
  },
  {
    id: 'prod-020',
    slug: 'rasasi-blue-lady-edt-45ml',
    title: 'Blue Lady',
    brand: 'Rasasi',
    fragranceName: 'Blue Lady',
    description: 'Blue Lady by Rasasi is a captivating feminine fragrance at an exceptional price point. Fresh aquatic top notes give way to a delicate floral heart of iris and violet, before settling into a smooth musky base. Light, elegant, and perfect for everyday wear.',
    fragranceType: 'EDT',
    fragranceFamily: 'Floral',
    gender: 'Women',
    notes: {
      top: ['Aquatic Notes', 'Bergamot', 'Melon'],
      middle: ['Iris', 'Violet', 'Rose'],
      base: ['White Musk', 'Cedar', 'Sandalwood'],
    },
    variants: [
      { size: 45, price: 3200, stock: 18, sku: 'RAS-BLL-45', lowStockThreshold: 5 },
    ],
    images: [
      '/images/9866f4bd3b6472002a034ac600421008.jpg',
      '/images/9a20cf806ebc3389900ad615844ec5a2.jpg',
    ],
    status: 'active',
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: false,
    categories: ['women', 'edt'],
    authenticityInfo: '100% authentic Rasasi product.',
    orderCount: 23,
    createdAt: '2024-01-18T00:00:00Z',
    updatedAt: '2024-06-01T00:00:00Z',
  },
  {
    id: 'prod-021',
    slug: 'armaf-tres-nuit-edp-100ml',
    title: 'Tres Nuit',
    brand: 'Armaf',
    fragranceName: 'Tres Nuit',
    description: 'Tres Nuit is a sophisticated, versatile masculine EDP inspired by premium designer fragrances. Opens with bright bergamot and apple, heart of geranium and jasmine, and a woody, mossy drydown with hints of amber. Excellent performance and sillage. Outstanding value.',
    fragranceType: 'EDP',
    fragranceFamily: 'Woody',
    gender: 'Men',
    notes: {
      top: ['Bergamot', 'Apple', 'Aldehydes'],
      middle: ['Geranium', 'Jasmine', 'Iris'],
      base: ['Vetiver', 'Oakmoss', 'Amber', 'Musk'],
    },
    variants: [
      { size: 100, price: 5800, salePrice: 5000, stock: 10, sku: 'ARM-TRN-100', lowStockThreshold: 5 },
    ],
    images: [
      '/images/9afd16303b123b8c4cad4f80caf72d1a.jpg',
      '/images/9c28189393abda7779570775d90af746.jpg',
    ],
    status: 'active',
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: true,
    categories: ['men', 'edp', 'best-sellers', 'offers'],
    authenticityInfo: '100% authentic Armaf fragrance.',
    orderCount: 33,
    createdAt: '2024-01-12T00:00:00Z',
    updatedAt: '2024-06-01T00:00:00Z',
  },
  {
    id: 'prod-022',
    slug: 'lattafa-taraf-oud-edp-90ml',
    title: 'Taraf Oud',
    brand: 'Lattafa',
    fragranceName: 'Taraf Oud',
    description: 'Taraf Oud is a premium oud fragrance designed for those who love the authentic Arabian oud experience. Rich and complex, it opens with precious oud wood and rose, deepens with incense and leather, and finishes with amber and musk. Exceptional longevity, 12+ hours.',
    fragranceType: 'EDP',
    fragranceFamily: 'Oriental',
    gender: 'Unisex',
    notes: {
      top: ['Oud', 'Rose', 'Bergamot'],
      middle: ['Incense', 'Leather', 'Saffron'],
      base: ['Amber', 'Musk', 'Sandalwood', 'Vetiver'],
    },
    variants: [
      { size: 90, price: 9000, stock: 4, sku: 'LAT-TRO-90', lowStockThreshold: 3 },
    ],
    images: [
      '/images/a376ce28b5f76a94a0676caaf7c2958e.jpg',
      '/images/a7586458494c058476ec975af85980ed.jpg',
    ],
    status: 'active',
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: false,
    categories: ['unisex', 'edp', 'new-arrivals'],
    authenticityInfo: '100% authentic Lattafa product.',
    orderCount: 8,
    createdAt: '2024-05-20T00:00:00Z',
    updatedAt: '2024-06-01T00:00:00Z',
  },
  {
    id: 'prod-023',
    slug: 'ajmal-shadow-diwan-edp-75ml',
    title: 'Shadow Diwan',
    brand: 'Ajmal',
    fragranceName: 'Shadow Diwan',
    description: 'Shadow Diwan by Ajmal is a mysterious and captivating unisex fragrance from their Diwan collection. It opens with smoky frankincense and oud, reveals a heart of rose and patchouli, and settles on a rich base of amber, vanilla, and musk. Perfect for evening wear.',
    fragranceType: 'EDP',
    fragranceFamily: 'Oriental',
    gender: 'Unisex',
    notes: {
      top: ['Frankincense', 'Oud', 'Saffron'],
      middle: ['Rose', 'Patchouli', 'Leather'],
      base: ['Amber', 'Vanilla', 'Musk', 'Sandalwood'],
    },
    variants: [
      { size: 75, price: 7200, stock: 6, sku: 'AJM-SDW-75', lowStockThreshold: 5 },
    ],
    images: [
      '/images/a994a1f160cb86e58f9443a13681ae01.jpg',
      '/images/aa02afa60106e378c945dfca5282471e.jpg',
    ],
    status: 'active',
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: false,
    categories: ['unisex', 'edp'],
    authenticityInfo: '100% authentic Ajmal product.',
    orderCount: 10,
    createdAt: '2024-03-15T00:00:00Z',
    updatedAt: '2024-06-01T00:00:00Z',
  },
  {
    id: 'prod-024',
    slug: 'rasasi-nafaeis-al-shaghaf-edp-100ml',
    title: 'Nafaeis Al Shaghaf',
    brand: 'Rasasi',
    fragranceName: 'Nafaeis Al Shaghaf',
    description: 'A powerful and long-lasting oriental men\'s EDP from Rasasi. Nafaeis Al Shaghaf opens with smoky oud and resins, heart of floral oud and rose, and settles to an incredibly warm and sensual base of ambergris and musk. Known for its tenacious performance.',
    fragranceType: 'EDP',
    fragranceFamily: 'Oriental',
    gender: 'Men',
    notes: {
      top: ['Oud', 'Resins', 'Smoky Notes'],
      middle: ['Rose', 'Geranium', 'Oud'],
      base: ['Ambergris', 'Musk', 'Sandalwood'],
    },
    variants: [
      { size: 100, price: 7800, stock: 5, sku: 'RAS-NAS-100', lowStockThreshold: 5 },
    ],
    images: [
      '/images/aaec7ba3f2ceec73c1fd6205d7c2b8ab.jpg',
      '/images/baf9ab4b9adfd3ab70ba23265ccf29b8.jpg',
    ],
    status: 'active',
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: false,
    categories: ['men', 'edp'],
    authenticityInfo: '100% authentic Rasasi product.',
    orderCount: 14,
    createdAt: '2024-02-28T00:00:00Z',
    updatedAt: '2024-06-01T00:00:00Z',
  },
  {
    id: 'prod-025',
    slug: 'lattafa-oud-mood-elixir-edp-100ml',
    title: 'Oud Mood Elixir',
    brand: 'Lattafa',
    fragranceName: 'Oud Mood Elixir',
    description: 'Oud Mood Elixir is the most intense and concentrated fragrance in the Oud Mood collection. A bold opening of black oud and smoky incense gives way to floral notes of damask rose. The base is extraordinarily rich with amber, sandalwood, and tonka bean.',
    fragranceType: 'Extrait',
    fragranceFamily: 'Oriental',
    gender: 'Unisex',
    notes: {
      top: ['Black Oud', 'Incense', 'Bergamot'],
      middle: ['Damask Rose', 'Saffron', 'Leather'],
      base: ['Amber', 'Sandalwood', 'Tonka Bean', 'Musk'],
    },
    variants: [
      { size: 100, price: 11000, stock: 3, sku: 'LAT-OME-100', lowStockThreshold: 3 },
    ],
    images: [
      '/images/c011c8c4754ba7a75e6e577d680f9835.jpg',
      '/images/cf83eb566d398a6d39840b586ae0294f.jpg',
    ],
    status: 'active',
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: false,
    categories: ['unisex', 'new-arrivals', 'extrait', 'gift-sets'],
    authenticityInfo: '100% authentic Lattafa product.',
    orderCount: 5,
    createdAt: '2024-06-01T00:00:00Z',
    updatedAt: '2024-06-01T00:00:00Z',
  },
  {
    id: 'prod-026',
    slug: 'ajmal-aristocrat-platinum-edp-75ml',
    title: 'Aristocrat Platinum',
    brand: 'Ajmal',
    fragranceName: 'Aristocrat Platinum',
    description: 'Aristocrat Platinum by Ajmal is a sophisticated masculine fragrance designed for the modern gentleman. Fresh bergamot and pepper open, transition to a heart of leather and cardamom, and settle into a warm base of amber and precious woods. Versatile for office and evenings.',
    fragranceType: 'EDP',
    fragranceFamily: 'Woody',
    gender: 'Men',
    notes: {
      top: ['Bergamot', 'Pepper', 'Cardamom'],
      middle: ['Leather', 'Incense', 'Geranium'],
      base: ['Amber', 'Sandalwood', 'Cedar', 'Musk'],
    },
    variants: [
      { size: 75, price: 6500, salePrice: 5700, stock: 7, sku: 'AJM-ARP-75', lowStockThreshold: 5 },
    ],
    images: [
      '/images/cfa382c8267a9d7edc7522006db33e79.jpg',
      '/images/d3e4fffd3916527c906886e015694aff.jpg',
    ],
    status: 'active',
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: false,
    categories: ['men', 'edp', 'offers'],
    authenticityInfo: '100% authentic Ajmal product.',
    orderCount: 16,
    createdAt: '2024-03-25T00:00:00Z',
    updatedAt: '2024-06-01T00:00:00Z',
  },
  {
    id: 'prod-027',
    slug: 'rasasi-faqat-lil-rijal-edt-75ml',
    title: 'Faqat Lil Rijal',
    brand: 'Rasasi',
    fragranceName: 'Faqat Lil Rijal',
    description: '"Only For Men" — Faqat Lil Rijal is a bold, citrusy-woody men\'s fragrance from Rasasi. The fresh, spicy opening of grapefruit and ginger gives way to a clean aromatic heart, and the base is a warm, woody musky accord. Great for daytime and casual wear.',
    fragranceType: 'EDT',
    fragranceFamily: 'Fresh',
    gender: 'Men',
    notes: {
      top: ['Grapefruit', 'Ginger', 'Bergamot'],
      middle: ['Lavender', 'Cardamom', 'Geranium'],
      base: ['Cedar', 'Vetiver', 'Musk', 'Amber'],
    },
    variants: [
      { size: 75, price: 4800, stock: 11, sku: 'RAS-FLR-75', lowStockThreshold: 5 },
    ],
    images: [
      '/images/d5a1b4186f71e956ebce14c9ae398f01.jpg',
      '/images/e29283c1d0b74a97917d967723bf7009.jpg',
    ],
    status: 'active',
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: false,
    categories: ['men', 'edt'],
    authenticityInfo: '100% authentic Rasasi product.',
    orderCount: 21,
    createdAt: '2024-02-08T00:00:00Z',
    updatedAt: '2024-06-01T00:00:00Z',
  },
  {
    id: 'prod-028',
    slug: 'lattafa-hayaati-edp-60ml',
    title: 'Hayaati',
    brand: 'Lattafa',
    fragranceName: 'Hayaati',
    description: 'Hayaati, meaning "My Life" in Arabic, is a romantic and floral women\'s EDP. It opens with fresh citrus and peach, blooms into a lush bouquet of rose and jasmine, and closes on a warm, sensual base of sandalwood and vanilla. A fragrance to be worn close to the heart.',
    fragranceType: 'EDP',
    fragranceFamily: 'Floral',
    gender: 'Women',
    notes: {
      top: ['Bergamot', 'Peach', 'Pear'],
      middle: ['Rose', 'Jasmine', 'Peony'],
      base: ['Sandalwood', 'Vanilla', 'Musk', 'Amber'],
    },
    variants: [
      { size: 60, price: 5500, stock: 9, sku: 'LAT-HYT-60', lowStockThreshold: 5 },
    ],
    images: [
      '/images/f4f75331a4fe2c1c2f5d2193ac5f6462.jpg',
      '/images/f93721f9faebc6228088602a8ccf59fd.jpg',
    ],
    status: 'active',
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: false,
    categories: ['women', 'edp', 'new-arrivals'],
    authenticityInfo: '100% authentic Lattafa product.',
    orderCount: 10,
    createdAt: '2024-05-25T00:00:00Z',
    updatedAt: '2024-06-01T00:00:00Z',
  },
];

export const CATEGORIES = [
  { id: 'women', name: 'Women', slug: 'women', parent: 'fragrances' },
  { id: 'men', name: 'Men', slug: 'men', parent: 'fragrances' },
  { id: 'unisex', name: 'Unisex', slug: 'unisex', parent: 'fragrances' },
  { id: 'gift-sets', name: 'Gift Sets', slug: 'gift-sets', parent: 'fragrances' },
  { id: 'edp', name: 'Eau de Parfum (EDP)', slug: 'edp', parent: 'fragrances' },
  { id: 'edt', name: 'Eau de Toilette (EDT)', slug: 'edt', parent: 'fragrances' },
  { id: 'extrait', name: 'Extrait de Parfum', slug: 'extrait', parent: 'fragrances' },
  { id: 'new-arrivals', name: 'New Arrivals', slug: 'new-arrivals', parent: undefined },
  { id: 'best-sellers', name: 'Best Sellers', slug: 'best-sellers', parent: undefined },
  { id: 'offers', name: 'Offers & Sale', slug: 'offers', parent: undefined },
];

export const BRANDS = ['Armaf', 'Lattafa', 'Rasasi', 'Ajmal', 'Al-Rehab'];

// ─── Local Storage & In-Memory Sync for Products ──────────────────
const LOCAL_PRODUCTS_KEY = 'lillyum_products';

export function getStoredProducts(): Product[] {
  if (typeof window === 'undefined') return SAMPLE_PRODUCTS;
  try {
    const raw = localStorage.getItem(LOCAL_PRODUCTS_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(SAMPLE_PRODUCTS));
      return SAMPLE_PRODUCTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(SAMPLE_PRODUCTS));
    return SAMPLE_PRODUCTS;
  } catch {
    return SAMPLE_PRODUCTS;
  }
}

export function saveStoredProducts(products: Product[]): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(products));
      window.dispatchEvent(new Event('lillyum_products_updated'));
    } catch (e) {
      console.error('Failed to save products to localStorage:', e);
    }
  }
  // Sync in-memory SAMPLE_PRODUCTS array
  SAMPLE_PRODUCTS.length = 0;
  SAMPLE_PRODUCTS.push(...products);
}

export function saveProduct(updatedProduct: Product): void {
  const all = getStoredProducts();
  const idx = all.findIndex((p) => p.id === updatedProduct.id || p.slug === updatedProduct.slug);
  if (idx >= 0) {
    all[idx] = { ...all[idx], ...updatedProduct };
  } else {
    all.unshift(updatedProduct);
  }
  saveStoredProducts(all);
}

export function deleteProduct(id: string): void {
  const all = getStoredProducts();
  const filtered = all.filter((p) => p.id !== id);
  saveStoredProducts(filtered);
}

// ─── Helper query functions ───────────────────────────────────────
export function getFeaturedProducts(limit = 8) {
  return getStoredProducts()
    .filter((p) => p.isFeatured && p.status === 'active')
    .slice(0, limit);
}

export function getBestSellers(limit = 4) {
  return getStoredProducts()
    .filter((p) => p.isBestSeller && p.status === 'active')
    .sort((a, b) => (b.orderCount ?? 0) - (a.orderCount ?? 0))
    .slice(0, limit);
}

export function getNewArrivals(limit = 4) {
  return getStoredProducts()
    .filter((p) => p.isNewArrival && p.status === 'active')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}

export function getProductBySlug(slug: string) {
  return getStoredProducts().find((p) => p.slug === slug) ?? null;
}

export function getProductById(id: string) {
  return getStoredProducts().find((p) => p.id === id) ?? null;
}

export function getProductsByCategory(categorySlug: string, limit?: number) {
  const filtered = getStoredProducts().filter(
    (p) => p.status === 'active' && p.categories.includes(categorySlug)
  );
  return limit ? filtered.slice(0, limit) : filtered;
}

export function getRelatedProducts(product: Product, limit = 4) {
  return getStoredProducts()
    .filter(
      (p) =>
        p.id !== product.id &&
        p.status === 'active' &&
        (p.gender === product.gender || p.fragranceFamily === product.fragranceFamily)
    )
    .slice(0, limit);
}

export function getSaleProducts() {
  return getStoredProducts().filter(
    (p) => p.status === 'active' && p.variants.some((v) => !!v.salePrice)
  );
}

