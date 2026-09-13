// ======================================================
// Sri Lanka Delivery Zones — configurable, stored in Firestore
// Defaults used for local cart fee calculation
// ======================================================

export const DELIVERY_ZONES = [
  {
    id: 'colombo',
    name: 'Colombo City',
    districts: ['Colombo'],
    fee: 200,
    estimatedDays: '1-2 Business Days',
  },
  {
    id: 'western',
    name: 'Western Province',
    districts: ['Gampaha', 'Kalutara'],
    fee: 350,
    estimatedDays: '1-2 Business Days',
  },
  {
    id: 'central',
    name: 'Central Province',
    districts: ['Kandy', 'Matale', 'Nuwara Eliya'],
    fee: 450,
    estimatedDays: '2-3 Business Days',
  },
  {
    id: 'southern',
    name: 'Southern Province',
    districts: ['Galle', 'Matara', 'Hambantota'],
    fee: 450,
    estimatedDays: '2-3 Business Days',
  },
  {
    id: 'northern',
    name: 'Northern Province',
    districts: ['Jaffna', 'Kilinochchi', 'Mannar', 'Mullaitivu', 'Vavuniya'],
    fee: 550,
    estimatedDays: '3-5 Business Days',
  },
  {
    id: 'eastern',
    name: 'Eastern Province',
    districts: ['Trincomalee', 'Batticaloa', 'Ampara'],
    fee: 550,
    estimatedDays: '3-5 Business Days',
  },
  {
    id: 'north_western',
    name: 'North Western Province',
    districts: ['Kurunegala', 'Puttalam'],
    fee: 450,
    estimatedDays: '2-3 Business Days',
  },
  {
    id: 'north_central',
    name: 'North Central Province',
    districts: ['Anuradhapura', 'Polonnaruwa'],
    fee: 500,
    estimatedDays: '2-4 Business Days',
  },
  {
    id: 'uva',
    name: 'Uva Province',
    districts: ['Badulla', 'Monaragala'],
    fee: 500,
    estimatedDays: '2-4 Business Days',
  },
  {
    id: 'sabaragamuwa',
    name: 'Sabaragamuwa Province',
    districts: ['Ratnapura', 'Kegalle'],
    fee: 450,
    estimatedDays: '2-3 Business Days',
  },
];

export const ALL_DISTRICTS = DELIVERY_ZONES.flatMap((z) => z.districts).sort();

export function getDeliveryFee(district: string): number {
  const zone = DELIVERY_ZONES.find((z) =>
    z.districts.some((d) => d.toLowerCase() === district.toLowerCase())
  );
  return zone?.fee ?? 500; // fallback
}

export function getDeliveryEstimate(district: string): string {
  const zone = DELIVERY_ZONES.find((z) =>
    z.districts.some((d) => d.toLowerCase() === district.toLowerCase())
  );
  return zone?.estimatedDays ?? '3-5 Business Days';
}

export const WHATSAPP_NUMBER = '94752369613';
export const STORE_PHONE = '0752369613';
export const STORE_EMAIL = 'lillyumfragrance@gmail.com';
export const STORE_ADDRESS = 'Colombo, 01200, Sri Lanka';

export const SOCIAL_LINKS = {
  facebook: 'https://www.facebook.com/share/1CU55pATL3/',
  instagram: 'https://www.instagram.com/lillyum_fragrance',
  tiktok: 'https://www.tiktok.com/@lilyumfragrance',
  whatsapp: `https://wa.me/94752369613`,
};

export const LOW_STOCK_THRESHOLD = 5;
export const FREE_DELIVERY_THRESHOLD = 15000; // LKR
