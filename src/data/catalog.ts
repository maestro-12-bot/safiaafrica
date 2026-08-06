import imigongo from "@/assets/collection-imigongo.jpg";
import umukenyero from "@/assets/collection-umukenyero.jpg";
import umugara from "@/assets/collection-umugara.jpg";
import hero from "@/assets/hero-imigongo.jpg";

export type SizeCode = "A0" | "A1" | "A2" | "A3" | "A4" | "A5" | "A6" | "CUSTOM";

export interface SizeTier {
  code: SizeCode;
  collection: string;
  dimensions: string;
  targetClient: string;
  price: number | null;
}

/** Official Rwanda pricing (luxury brand) — 3D production. */
export const SIZE_TIERS: SizeTier[] = [
  {
    code: "A0",
    collection: "A0 Presidential Collection",
    dimensions: "180 × 120 cm",
    targetClient: "Presidency, Ministries, 5-Star Hotels",
    price: 5_500_000,
  },
  {
    code: "A1",
    collection: "A1 Executive Collection",
    dimensions: "120 × 90 cm",
    targetClient: "CEOs, Banks, Luxury Offices",
    price: 4_200_000,
  },
  {
    code: "A2",
    collection: "A2 Prestige Collection",
    dimensions: "90 × 60 cm",
    targetClient: "Embassies, Hotels",
    price: 3_000_000,
  },
  {
    code: "A3",
    collection: "A3 Heritage Collection",
    dimensions: "70 × 50 cm",
    targetClient: "Luxury Homes",
    price: 2_000_000,
  },
  {
    code: "A4",
    collection: "A4 Premium Collection",
    dimensions: "50 × 35 cm",
    targetClient: "Executive Apartments",
    price: 1_200_000,
  },
  {
    code: "A5",
    collection: "A5 Signature Collection",
    dimensions: "35 × 25 cm",
    targetClient: "Collectors",
    price: 700_000,
  },
  {
    code: "A6",
    collection: "A6 Collector Edition",
    dimensions: "25 × 18 cm",
    targetClient: "Luxury Gifts",
    price: 350_000,
  },
  {
    code: "CUSTOM",
    collection: "Bespoke Commission",
    dimensions: "Your specification",
    targetClient: "Custom projects",
    price: null,
  },
];

export const MDF_TIERS = [
  { label: "Standard MDF decorative wall frame", range: "50,000 – 150,000 RWF" },
  { label: "Premium imported decorative frame", range: "150,000 – 400,000 RWF" },
  { label: "Large luxury wall panel (custom)", range: "400,000 – 1,200,000 RWF" },
  { label: "Imported luxury European wall panel", range: "1,200,000 – 3,000,000 RWF" },
  { label: "Museum-quality commissioned artwork", range: "3,000,000 – 8,000,000+ RWF" },
];

/** Multipliers applied on top of the size price. */
export const FRAME_OPTIONS = [
  { id: "gold-leaf", label: "Hand-gilded gold leaf", multiplier: 1.18 },
  { id: "obsidian", label: "Obsidian hardwood", multiplier: 1.08 },
  { id: "brushed-brass", label: "Brushed brass", multiplier: 1.12 },
  { id: "frameless", label: "Frameless gallery mount", multiplier: 1 },
];

export const MATERIAL_OPTIONS = [
  { id: "mdf-3d", label: "MDF 3D relief", multiplier: 1 },
  { id: "hardwood", label: "Carved African hardwood", multiplier: 1.22 },
  { id: "brass-inlay", label: "Brass inlay on hardwood", multiplier: 1.35 },
  { id: "cow-dung", label: "Traditional Imigongo clay", multiplier: 1.1 },
];

export const FINISH_OPTIONS = [
  { id: "matte", label: "Museum matte", multiplier: 1 },
  { id: "satin", label: "Satin lacquer", multiplier: 1.05 },
  { id: "gilded", label: "24k gilded highlights", multiplier: 1.2 },
];

export const COLOR_OPTIONS = [
  "Obsidian & Gold",
  "Ivory & Ebony",
  "Sunset Ochre",
  "Terracotta & Sage",
  "Royal Indigo",
];

export const ORIENTATION_OPTIONS = ["Portrait", "Landscape", "Square", "Panoramic"];

export const SHIPPING_OPTIONS = [
  { id: "kigali", label: "Kigali white-glove delivery", price: 0 },
  { id: "rwanda", label: "Rwanda nationwide", price: 120_000 },
  { id: "africa", label: "Pan-African freight", price: 480_000 },
  { id: "global", label: "Global crated air freight", price: 950_000 },
];

export const TAX_RATE = 0.18;

export interface Product {
  slug: string;
  name: string;
  collection: string;
  artworkType: string;
  image: string;
  tagline: string;
  description: string;
  origin: string;
  artist: string;
  leadTime: string;
  rating: number;
  reviews: number;
  materials: string[];
  stock: string;
}

export const PRODUCTS: Product[] = [
  {
    slug: "imigongo-3d",
    name: "Imigongo 3D Sovereign",
    collection: "Imigongo 3D",
    artworkType: "Geometric relief panel",
    image: imigongo,
    tagline: "The sacred geometry of Rwanda, raised in gold.",
    description:
      "Hand-built spiral and chevron reliefs in the Imigongo tradition of Nyarubuye, finished with 24k gilded highlights. Each panel is drawn, moulded and burnished by a master artisan before being sealed for museum longevity.",
    origin: "Eastern Province, Rwanda",
    artist: "SAFIA Master Atelier — Nyarubuye lineage",
    leadTime: "18 – 32 working days",
    rating: 4.9,
    reviews: 128,
    materials: ["MDF 3D relief", "Traditional clay", "24k gold leaf"],
    stock: "Made to order",
  },
  {
    slug: "umukenyero",
    name: "Umukenyero Royale",
    collection: "Umukenyero Best Design",
    artworkType: "Sculptural textile relief",
    image: umukenyero,
    tagline: "Rwandan elegance, sculpted into permanence.",
    description:
      "A sculptural interpretation of the Umukenyero — the ceremonial dress of Rwandan women — rendered in flowing three-dimensional relief with gilded sash detailing. A statement of dignity for lobbies, residences and embassies.",
    origin: "Kigali, Rwanda",
    artist: "SAFIA Heritage Studio",
    leadTime: "21 – 35 working days",
    rating: 5,
    reviews: 74,
    materials: ["Carved hardwood", "Sculpted resin drapery", "Brass sash inlay"],
    stock: "Made to order",
  },
  {
    slug: "umugara",
    name: "Umugara Circle",
    collection: "Umugara Design",
    artworkType: "Circular woven relief",
    image: umugara,
    tagline: "The peace basket, reimagined at monumental scale.",
    description:
      "Concentric woven rhythms inspired by the Agaseke peace basket, translated into a deep-relief circular medallion. Available up to 180 cm for presidential and hospitality installations.",
    origin: "Southern Province, Rwanda",
    artist: "Cooperative of Women Weavers, SAFIA partner",
    leadTime: "20 – 30 working days",
    rating: 4.8,
    reviews: 96,
    materials: ["MDF 3D relief", "Sisal fibre", "Antique brass"],
    stock: "Made to order",
  },
  {
    slug: "emotional-attachments",
    name: "Emotional Attachments",
    collection: "Emotional Attachments",
    artworkType: "Portrait commission",
    image: hero,
    tagline: "Your story, carved into heritage.",
    description:
      "A bespoke commission programme: family lineage, national milestones or corporate legacy translated into SAFIA's signature 3D heritage language. Includes an artistic consultation and two design revisions.",
    origin: "Commissioned, Pan-African",
    artist: "Assigned SAFIA lead artist",
    leadTime: "30 – 55 working days",
    rating: 5,
    reviews: 41,
    materials: ["Carved hardwood", "Mixed media", "Gold leaf"],
    stock: "Commission only",
  },
  {
    slug: "sleeping-rooms",
    name: "Sleeping Rooms Suite",
    collection: "Sleeping Rooms",
    artworkType: "Interior art suite",
    image: umukenyero,
    tagline: "Serenity, in heritage relief.",
    description:
      "A curated suite of softly lit relief panels designed for master suites and five-star hotel rooms — calmer motifs, warmer palettes, acoustic backing for hospitality standards.",
    origin: "Kigali, Rwanda",
    artist: "SAFIA Interior Atelier",
    leadTime: "16 – 28 working days",
    rating: 4.7,
    reviews: 63,
    materials: ["MDF 3D relief", "Acoustic backing", "Satin lacquer"],
    stock: "Made to order",
  },
  {
    slug: "flowers",
    name: "Flowers of the Continent",
    collection: "Flowers",
    artworkType: "Botanical relief",
    image: umugara,
    tagline: "Africa's flora, in gilded bloom.",
    description:
      "Botanical reliefs drawn from indigenous African flora — protea, flame lily, desert rose — sculpted in layered petals and finished with sunset pigment gradients.",
    origin: "Pan-African studies",
    artist: "SAFIA Botanical Series",
    leadTime: "14 – 26 working days",
    rating: 4.8,
    reviews: 88,
    materials: ["MDF 3D relief", "Layered resin petals", "Mineral pigment"],
    stock: "In production",
  },
];

export const formatRWF = (value: number) =>
  new Intl.NumberFormat("en-RW", { maximumFractionDigits: 0 }).format(Math.round(value)) + " RWF";

export interface PriceInput {
  sizeCode: SizeCode;
  quantity: number;
  frameId: string;
  materialId: string;
  finishId: string;
  shippingId: string;
}

export interface PriceBreakdown {
  quotable: boolean;
  unitPrice: number;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
}

export function calculatePrice(input: PriceInput): PriceBreakdown {
  const tier = SIZE_TIERS.find((t) => t.code === input.sizeCode);
  const base = tier?.price ?? null;
  if (base === null) {
    return {
      quotable: false,
      unitPrice: 0,
      subtotal: 0,
      tax: 0,
      shipping: 0,
      discount: 0,
      total: 0,
    };
  }

  const frame = FRAME_OPTIONS.find((f) => f.id === input.frameId)?.multiplier ?? 1;
  const material = MATERIAL_OPTIONS.find((m) => m.id === input.materialId)?.multiplier ?? 1;
  const finish = FINISH_OPTIONS.find((f) => f.id === input.finishId)?.multiplier ?? 1;
  const shipping = SHIPPING_OPTIONS.find((s) => s.id === input.shippingId)?.price ?? 0;

  const quantity = Math.max(1, Math.min(99, Math.round(input.quantity || 1)));
  const unitPrice = base * frame * material * finish;
  const gross = unitPrice * quantity;
  // Volume courtesy for collectors and corporate orders.
  const discountRate = quantity >= 10 ? 0.1 : quantity >= 5 ? 0.05 : 0;
  const discount = gross * discountRate;
  const subtotal = gross - discount;
  const tax = subtotal * TAX_RATE;

  return {
    quotable: true,
    unitPrice,
    subtotal,
    tax,
    shipping,
    discount,
    total: subtotal + tax + shipping,
  };
}
