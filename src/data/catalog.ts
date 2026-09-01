import imigongo from "@/assets/collection-imigongo.jpg";
import umukenyero from "@/assets/collection-umukenyero.jpg";
import umugara from "@/assets/collection-umugara.jpg";
import hero from "@/assets/hero-imigongo.jpg";

/** A5/A6 remain in the type so historical orders keep rendering, but are never purchasable. */
export type SizeCode = "A0" | "A1" | "A2" | "A3" | "A4" | "A5" | "A6" | "CUSTOM";

export interface SizeTier {
  code: SizeCode;
  collection: string;
  dimensions: string;
  targetClient: string;
  price: number | null;
  /** Relative wall footprint used by the visual configurator. */
  scale: number;
}

/** Retired sizes — kept only to label historical orders. Never shown as purchasable. */
export const RETIRED_SIZE_TIERS: SizeTier[] = [
  {
    code: "A5",
    collection: "A5 Signature Collection (retired)",
    dimensions: "35 × 25 cm",
    targetClient: "Collectors",
    price: 700_000,
    scale: 0.34,
  },
  {
    code: "A6",
    collection: "A6 Collector Edition (retired)",
    dimensions: "25 × 18 cm",
    targetClient: "Luxury gifts",
    price: 350_000,
    scale: 0.26,
  },
];

/** Official Rwanda pricing (luxury brand) — 3D production. Customer-facing sizes only. */
export const SIZE_TIERS: SizeTier[] = [
  {
    code: "A0",
    collection: "A0 Presidential Collection",
    dimensions: "180 × 120 cm",
    targetClient: "Presidency, Ministries, 5-Star Hotels",
    price: 5_500_000,
    scale: 1,
  },
  {
    code: "A1",
    collection: "A1 Executive Collection",
    dimensions: "120 × 90 cm",
    targetClient: "CEOs, Banks, Luxury Offices",
    price: 4_200_000,
    scale: 0.78,
  },
  {
    code: "A2",
    collection: "A2 Prestige Collection",
    dimensions: "90 × 60 cm",
    targetClient: "Embassies, Hotels",
    price: 3_000_000,
    scale: 0.62,
  },
  {
    code: "A3",
    collection: "A3 Heritage Collection",
    dimensions: "70 × 50 cm",
    targetClient: "Luxury Homes",
    price: 2_000_000,
    scale: 0.5,
  },
  {
    code: "A4",
    collection: "A4 Premium Collection",
    dimensions: "50 × 35 cm",
    targetClient: "Executive Apartments",
    price: 1_200_000,
    scale: 0.4,
  },
  {
    code: "CUSTOM",
    collection: "Bespoke Commission",
    dimensions: "Your specification",
    targetClient: "Custom projects",
    price: null,
    scale: 0.9,
  },
];

/** Any size tier, including retired ones — for reading historical records. */
export function findSizeTier(code: string): SizeTier | undefined {
  return [...SIZE_TIERS, ...RETIRED_SIZE_TIERS].find((t) => t.code === code);
}

export const MDF_TIERS = [
  { label: "Standard MDF decorative wall frame", range: "50,000 – 150,000 RWF" },
  { label: "Premium imported decorative frame", range: "150,000 – 400,000 RWF" },
  { label: "Large luxury wall panel (custom)", range: "400,000 – 1,200,000 RWF" },
  { label: "Imported luxury European wall panel", range: "1,200,000 – 3,000,000 RWF" },
  { label: "Museum-quality commissioned artwork", range: "3,000,000 – 8,000,000+ RWF" },
];

export interface FrameOption {
  id: string;
  label: string;
  multiplier: number;
  /** CSS background for the frame moulding. */
  frameCss: string;
  /** Inner lip colour. */
  lip: string;
  /** Frame thickness in px at full scale. */
  width: number;
  swatch: string;
}

export const FRAME_OPTIONS: FrameOption[] = [
  {
    id: "gold-leaf",
    label: "Hand-gilded gold leaf",
    multiplier: 1.18,
    frameCss:
      "linear-gradient(135deg,#4a3410 0%,#c9a227 18%,#f7e7a1 38%,#c9a227 58%,#6b4c15 80%,#e8cf7d 100%)",
    lip: "rgba(247,231,161,0.85)",
    width: 26,
    swatch: "linear-gradient(135deg,#c9a227,#f7e7a1,#8a6c1d)",
  },
  {
    id: "premium-gold",
    label: "Premium gold (museum moulding)",
    multiplier: 1.26,
    frameCss:
      "linear-gradient(150deg,#3a2a08 0%,#e3bf46 20%,#fff4c2 42%,#d8ab2c 62%,#5c410f 85%,#f2dd93 100%)",
    lip: "rgba(255,244,194,0.9)",
    width: 34,
    swatch: "linear-gradient(135deg,#e3bf46,#fff4c2,#5c410f)",
  },
  {
    id: "obsidian",
    label: "Obsidian hardwood",
    multiplier: 1.08,
    frameCss: "linear-gradient(135deg,#0b0b0d 0%,#26262b 45%,#0f0f12 100%)",
    lip: "rgba(255,255,255,0.12)",
    width: 24,
    swatch: "linear-gradient(135deg,#0b0b0d,#33333a)",
  },
  {
    id: "ivory",
    label: "Ivory lacquer",
    multiplier: 1.06,
    frameCss: "linear-gradient(135deg,#e7e2d6 0%,#fffdf7 45%,#d8d2c4 100%)",
    lip: "rgba(0,0,0,0.14)",
    width: 22,
    swatch: "linear-gradient(135deg,#fffdf7,#d8d2c4)",
  },
  {
    id: "natural-wood",
    label: "Natural African wood",
    multiplier: 1.05,
    frameCss: "linear-gradient(135deg,#8b5e34 0%,#c68f5d 40%,#7a4f2a 100%)",
    lip: "rgba(0,0,0,0.2)",
    width: 24,
    swatch: "linear-gradient(135deg,#c68f5d,#7a4f2a)",
  },
  {
    id: "dark-wood",
    label: "Dark walnut",
    multiplier: 1.09,
    frameCss: "linear-gradient(135deg,#2c1a10 0%,#5a3721 45%,#26160d 100%)",
    lip: "rgba(255,255,255,0.08)",
    width: 26,
    swatch: "linear-gradient(135deg,#5a3721,#26160d)",
  },
  {
    id: "brushed-brass",
    label: "Brushed brass",
    multiplier: 1.12,
    frameCss: "linear-gradient(135deg,#6b5520 0%,#b99a4a 40%,#8a7130 70%,#d9c07c 100%)",
    lip: "rgba(217,192,124,0.7)",
    width: 20,
    swatch: "linear-gradient(135deg,#b99a4a,#d9c07c)",
  },
  {
    id: "silver",
    label: "Polished silver",
    multiplier: 1.1,
    frameCss: "linear-gradient(135deg,#6e737a 0%,#d7dde3 40%,#9aa2aa 70%,#f2f5f8 100%)",
    lip: "rgba(242,245,248,0.75)",
    width: 20,
    swatch: "linear-gradient(135deg,#d7dde3,#6e737a)",
  },
  {
    id: "frameless",
    label: "Frameless gallery mount",
    multiplier: 1,
    frameCss: "transparent",
    lip: "transparent",
    width: 0,
    swatch: "linear-gradient(135deg,#1b1b1f,#2a2a30)",
  },
];

export interface MaterialOption {
  id: string;
  label: string;
  multiplier: number;
  /** Texture overlay for the artwork surface. */
  textureCss: string;
  textureOpacity: number;
  blend: string;
  /** Relief depth (drop shadow strength) 0–1. */
  relief: number;
}

export const MATERIAL_OPTIONS: MaterialOption[] = [
  {
    id: "premium-mdf",
    label: "Premium MDF",
    multiplier: 1.14,
    textureCss:
      "repeating-linear-gradient(115deg, rgba(255,255,255,0.09) 0 3px, rgba(0,0,0,0.1) 3px 7px)",
    textureOpacity: 0.65,
    blend: "overlay",
    relief: 0.8,
  },
  {
    id: "luxury-mdf",
    label: "Luxury MDF",
    multiplier: 1.26,
    textureCss:
      "repeating-linear-gradient(115deg, rgba(255,255,255,0.11) 0 4px, rgba(0,0,0,0.12) 4px 8px)",
    textureOpacity: 0.7,
    blend: "overlay",
    relief: 0.9,
  },
  {
    id: "decorative-mdf",
    label: "Decorative MDF",
    multiplier: 1.08,
    textureCss:
      "repeating-linear-gradient(115deg, rgba(255,255,255,0.07) 0 2px, rgba(0,0,0,0.07) 2px 5px)",
    textureOpacity: 0.55,
    blend: "overlay",
    relief: 0.55,
  },
  {
    id: "moisture-mdf",
    label: "Moisture Resistant MDF",
    multiplier: 1.18,
    textureCss:
      "repeating-linear-gradient(110deg, rgba(120,160,200,0.1) 0 3px, rgba(0,0,0,0.06) 3px 6px)",
    textureOpacity: 0.5,
    blend: "soft-light",
    relief: 0.6,
  },
  {
    id: "high-density-mdf",
    label: "High Density MDF",
    multiplier: 1.32,
    textureCss:
      "repeating-linear-gradient(115deg, rgba(255,255,255,0.12) 0 2px, rgba(0,0,0,0.14) 2px 4px)",
    textureOpacity: 0.75,
    blend: "overlay",
    relief: 0.85,
  },
];

/** Design style options — drive the "Design Complexity" pricing factor. */
export interface DesignOption {
  id: string;
  label: string;
  /** Complexity multiplier applied to the price. */
  multiplier: number;
}

export const DESIGN_OPTIONS: DesignOption[] = [
  { id: "modern", label: "Modern Design", multiplier: 1.05 },
  { id: "luxury", label: "Luxury Design", multiplier: 1.18 },
  { id: "minimalist", label: "Minimalist Design", multiplier: 1.02 },
  { id: "executive", label: "Executive Design", multiplier: 1.12 },
  { id: "classic", label: "Classic Design", multiplier: 1.08 },
  { id: "contemporary", label: "Contemporary Design", multiplier: 1.1 },
];

export interface FinishOption {
  id: string;
  label: string;
  multiplier: number;
  /** Specular highlight strength 0–1. */
  gloss: number;
  saturate: number;
  contrast: number;
}

export const FINISH_OPTIONS: FinishOption[] = [
  { id: "matte", label: "Museum matte", multiplier: 1, gloss: 0.05, saturate: 0.96, contrast: 1 },
  { id: "satin", label: "Satin lacquer", multiplier: 1.05, gloss: 0.22, saturate: 1.04, contrast: 1.03 },
  { id: "gloss", label: "High gloss", multiplier: 1.12, gloss: 0.5, saturate: 1.12, contrast: 1.08 },
  {
    id: "textured",
    label: "Textured artisan",
    multiplier: 1.08,
    gloss: 0.1,
    saturate: 1,
    contrast: 1.06,
  },
  {
    id: "metallic",
    label: "Metallic sheen",
    multiplier: 1.16,
    gloss: 0.4,
    saturate: 1.1,
    contrast: 1.1,
  },
  {
    id: "gilded",
    label: "24k gilded highlights",
    multiplier: 1.2,
    gloss: 0.34,
    saturate: 1.18,
    contrast: 1.06,
  },
];

export const COLOR_OPTIONS = [
  "Obsidian & Gold",
  "Ivory & Ebony",
  "Sunset Ochre",
  "Terracotta & Sage",
  "Royal Indigo",
];

/** Hue treatment applied to the preview per colourway. */
export const COLOR_TREATMENTS: Record<string, { hue: number; overlay: string }> = {
  "Obsidian & Gold": { hue: 0, overlay: "rgba(201,162,39,0.12)" },
  "Ivory & Ebony": { hue: -12, overlay: "rgba(240,235,222,0.14)" },
  "Sunset Ochre": { hue: 12, overlay: "rgba(214,120,44,0.16)" },
  "Terracotta & Sage": { hue: -24, overlay: "rgba(122,146,104,0.16)" },
  "Royal Indigo": { hue: 150, overlay: "rgba(63,68,150,0.2)" },
};

export type OrientationName = "Portrait" | "Landscape" | "Square" | "Panoramic";

export const ORIENTATION_OPTIONS: OrientationName[] = [
  "Portrait",
  "Landscape",
  "Square",
  "Panoramic",
];

export const ORIENTATION_RATIO: Record<string, number> = {
  Portrait: 3 / 4,
  Landscape: 4 / 3,
  Square: 1,
  Panoramic: 21 / 9,
};

export const SHIPPING_OPTIONS = [
  { id: "kigali", label: "Kigali white-glove delivery", price: 0 },
  { id: "rwanda", label: "Rwanda nationwide", price: 120_000 },
  { id: "africa", label: "Pan-African freight", price: 480_000 },
  { id: "global", label: "Global crated air freight", price: 950_000 },
];

/** Optional services — priced as a share of the artwork value or a flat fee. */
export const SERVICE_OPTIONS = [
  { id: "installation", label: "Professional installation", rate: 0.04, flat: 150_000 },
  { id: "insurance", label: "Transit & value insurance", rate: 0.025, flat: 0 },
  { id: "rush", label: "Rush production (priority atelier)", rate: 0.12, flat: 0 },
  { id: "artist", label: "Named lead artist signature", rate: 0.08, flat: 0 },
  { id: "customization", label: "Bespoke customisation studio", rate: 0.1, flat: 0 },
];

export const TAX_RATE = 0.18;

/**
 * Frame pricing rules. Standard (non-luxury) pieces are clamped into the
 * 100,000 – 1,000,000 RWF band. Luxury pieces honour the floor but may exceed
 * the ceiling. VAT is already included in all displayed prices.
 */
export const FRAME_PRICE_MIN = 100_000;
export const FRAME_PRICE_MAX = 1_000_000;

/**
 * Standard (non-luxury) collections are priced inside the 100,000 – 1,000,000
 * RWF band. The size tiers below carry the luxury/masterpiece base price, so
 * standard pieces are scaled down before the band clamp is applied.
 */
export const STANDARD_PRICE_SCALE = 0.16;

/** Base price for a size tier, for standard or luxury pieces. */
export function tierBasePrice(price: number | null, luxury = false): number | null {
  if (price === null) return null;
  return luxury ? price : clampFramePrice(price * STANDARD_PRICE_SCALE, false);
}

export function clampFramePrice(value: number, luxury: boolean): number {
  if (value < FRAME_PRICE_MIN) return FRAME_PRICE_MIN;
  if (!luxury && value > FRAME_PRICE_MAX) return FRAME_PRICE_MAX;
  return value;
}

export type ProductBadge =
  | "LUXURY"
  | "LIMITED EDITION"
  | "MASTERPIECE"
  | "BESPOKE"
  | "COLLECTOR'S EDITION"
  | "MUSEUM QUALITY";

export type LuxuryCategory =
  | "Presidential Collection"
  | "Heritage Masterpieces"
  | "African Legacy Collection"
  | "Executive Collection"
  | "Museum Collection"
  | "Limited Edition"
  | "Bespoke Masterpiece";

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
  /** Luxury tier products carry a price premium and badges. */
  tier?: "standard" | "luxury";
  luxuryCategory?: LuxuryCategory;
  badges?: ProductBadge[];
  /** Multiplier applied to the size price for this piece. */
  priceMultiplier?: number;
  edition?: string;
  country?: string;
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
    tier: "standard",
    country: "Rwanda",
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
    tier: "standard",
    country: "Rwanda",
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
    tier: "standard",
    country: "Rwanda",
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
    tier: "standard",
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
    tier: "standard",
    country: "Rwanda",
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
    tier: "standard",
  },
];

/** LUXURY COLLECTION — premium tier, priced above the standard collections. */
export const LUXURY_PRODUCTS: Product[] = [
  {
    slug: "presidential-sovereign-seal",
    name: "The Sovereign Seal",
    collection: "Presidential Collection",
    luxuryCategory: "Presidential Collection",
    artworkType: "Monumental state relief",
    image: hero,
    tagline: "Commissioned for the rooms where nations are decided.",
    description:
      "A monumental gilded relief conceived for presidential offices, cabinet halls and state residences. Hand-gilded across 180 cm of deep Imigongo geometry, mounted on a museum-grade aluminium substrate with concealed suspension and a signed certificate of provenance.",
    origin: "Kigali State Atelier, Rwanda",
    artist: "SAFIA Master Atelier — Presidential Division",
    leadTime: "60 – 90 working days",
    rating: 5,
    reviews: 12,
    materials: ["Premium MDF deep relief", "24k gold leaf", "Aluminium substrate"],
    stock: "Commissioned per institution",
    tier: "luxury",
    badges: ["LUXURY", "MASTERPIECE", "MUSEUM QUALITY"],
    priceMultiplier: 3.6,
    edition: "Institutional commission",
    country: "Rwanda",
  },
  {
    slug: "heritage-masterpiece-nyarubuye",
    name: "Nyarubuye Masterpiece",
    collection: "Heritage Masterpieces",
    luxuryCategory: "Heritage Masterpieces",
    artworkType: "Large handcrafted cultural relief",
    image: imigongo,
    tagline: "Six hundred hours of hand-built heritage.",
    description:
      "The atelier's most demanding Imigongo work: every ridge is built by hand in traditional clay before gilding, then sealed for a century of display. Reserved for collectors and cultural institutions.",
    origin: "Nyarubuye, Rwanda",
    artist: "Master artisans of the Nyarubuye lineage",
    leadTime: "55 – 80 working days",
    rating: 5,
    reviews: 18,
    materials: ["Traditional Imigongo clay", "Carved hardwood", "Gold leaf"],
    stock: "Limited annual production",
    tier: "luxury",
    badges: ["LUXURY", "MASTERPIECE"],
    priceMultiplier: 2.8,
    edition: "24 pieces per year",
    country: "Rwanda",
  },
  {
    slug: "african-legacy-continental",
    name: "Continental Legacy",
    collection: "African Legacy Collection",
    luxuryCategory: "African Legacy Collection",
    artworkType: "Historical narrative relief",
    image: umugara,
    tagline: "The African century, told in relief.",
    description:
      "An extraordinarily detailed narrative panel tracing African civilisations, trade routes and independence movements through layered symbolic geometry. Each edition is documented with a printed cultural dossier.",
    origin: "Pan-African research commission",
    artist: "SAFIA Legacy Studio",
    leadTime: "50 – 75 working days",
    rating: 4.9,
    reviews: 21,
    materials: ["Brass inlay on hardwood", "Mineral pigment", "Museum matte seal"],
    stock: "Limited edition",
    tier: "luxury",
    badges: ["LUXURY", "COLLECTOR'S EDITION"],
    priceMultiplier: 2.4,
    edition: "Only 25 pieces worldwide",
  },
  {
    slug: "executive-boardroom-obsidian",
    name: "Obsidian Boardroom",
    collection: "Executive Collection",
    luxuryCategory: "Executive Collection",
    artworkType: "Executive statement relief",
    image: umukenyero,
    tagline: "Authority, in obsidian and brass.",
    description:
      "Restrained, architectural and unmistakably expensive — designed for bank headquarters, CEO suites and boardrooms. Brushed brass ridges over obsidian relief, engineered for large-format lighting.",
    origin: "Kigali, Rwanda",
    artist: "SAFIA Executive Atelier",
    leadTime: "40 – 60 working days",
    rating: 4.9,
    reviews: 27,
    materials: ["Anodised metal", "Brushed brass", "Obsidian hardwood frame"],
    stock: "Made to order",
    tier: "luxury",
    badges: ["LUXURY"],
    priceMultiplier: 2,
  },
  {
    slug: "museum-collection-archive",
    name: "Museum Archive Commission",
    collection: "Museum Collection",
    luxuryCategory: "Museum Collection",
    artworkType: "Museum-quality commission",
    image: imigongo,
    tagline: "Built to be catalogued, conserved and exhibited.",
    description:
      "Produced to conservation standards for museums, foundations and national archives: archival substrates, reversible mounting, documented pigments and a full condition report at delivery.",
    origin: "Commissioned, Pan-African",
    artist: "SAFIA Conservation Atelier",
    leadTime: "70 – 110 working days",
    rating: 5,
    reviews: 9,
    materials: ["Archival panel", "Conservation pigments", "Reversible mount"],
    stock: "Institutional commission",
    tier: "luxury",
    badges: ["LUXURY", "MUSEUM QUALITY", "MASTERPIECE"],
    priceMultiplier: 3.1,
  },
  {
    slug: "limited-edition-ten",
    name: "Edition of Ten — Gold Meridian",
    collection: "Limited Edition",
    luxuryCategory: "Limited Edition",
    artworkType: "Numbered limited relief",
    image: umugara,
    tagline: "Only ten pieces available worldwide.",
    description:
      "A numbered edition of ten, each hand-finished with a distinct gilding pattern and accompanied by a signed certificate. Once the tenth piece is released, the edition is closed permanently.",
    origin: "Kigali, Rwanda",
    artist: "SAFIA Master Atelier",
    leadTime: "45 – 65 working days",
    rating: 5,
    reviews: 10,
    materials: ["Premium MDF deep relief", "24k gold leaf", "Museum glass option"],
    stock: "10 pieces worldwide",
    tier: "luxury",
    badges: ["LUXURY", "LIMITED EDITION", "COLLECTOR'S EDITION"],
    priceMultiplier: 2.6,
    edition: "Only 10 pieces available worldwide",
  },
  {
    slug: "bespoke-masterpiece",
    name: "Bespoke Masterpiece Commission",
    collection: "Bespoke Masterpiece",
    luxuryCategory: "Bespoke Masterpiece",
    artworkType: "One-of-one commission",
    image: hero,
    tagline: "One artwork. One owner. One story.",
    description:
      "A completely bespoke masterpiece created for a single client: private consultation, concept sketches, material prototyping and an exclusive right to the finished design. Never reproduced.",
    origin: "Client-defined",
    artist: "Assigned SAFIA master artist",
    leadTime: "90 – 150 working days",
    rating: 5,
    reviews: 6,
    materials: ["Client-selected", "Master atelier build", "Signed provenance"],
    stock: "One-of-one",
    tier: "luxury",
    badges: ["LUXURY", "BESPOKE", "MASTERPIECE"],
    priceMultiplier: 4.2,
    edition: "Unique — never reproduced",
  },
];

export const ALL_PRODUCTS: Product[] = [...LUXURY_PRODUCTS, ...PRODUCTS];

export const LUXURY_CATEGORIES: { name: LuxuryCategory; blurb: string }[] = [
  {
    name: "Presidential Collection",
    blurb: "Ultra-premium artwork for presidencies, ministries, embassies and royal residences.",
  },
  { name: "Heritage Masterpieces", blurb: "Large handcrafted cultural artworks, built entirely by hand." },
  {
    name: "African Legacy Collection",
    blurb: "Extremely detailed pieces inspired by African history and cultural identity.",
  },
  { name: "Executive Collection", blurb: "For CEOs, banks, corporations, boardrooms and luxury offices." },
  { name: "Museum Collection", blurb: "Museum-quality commissioned artwork to conservation standards." },
  { name: "Limited Edition", blurb: "Numbered editions in very limited quantities." },
  { name: "Bespoke Masterpiece", blurb: "Completely customised artwork created for one customer." },
];

export function isLuxury(product: Product | null | undefined) {
  return product?.tier === "luxury";
}

export function productMultiplier(product: Product | null | undefined) {
  return product?.priceMultiplier ?? 1;
}

export const formatRWF = (value: number) =>
  new Intl.NumberFormat("en-RW", { maximumFractionDigits: 0 }).format(Math.round(value)) + " RWF";

export interface PriceInput {
  sizeCode: SizeCode;
  quantity: number;
  frameId: string;
  materialId: string;
  finishId: string;
  shippingId: string;
  /** Luxury premium / per-product multiplier. */
  productMultiplier?: number;
  /** Ids from SERVICE_OPTIONS. */
  serviceIds?: string[];
  /** Design style id from DESIGN_OPTIONS (drives complexity pricing). */
  designId?: string;
  /** Whether the product is a luxury tier — exempt from the price ceiling. */
  luxury?: boolean;
}

export interface PriceBreakdown {
  quotable: boolean;
  basePrice: number;
  unitPrice: number;
  services: { id: string; label: string; amount: number }[];
  servicesTotal: number;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
}

export function calculatePrice(input: PriceInput): PriceBreakdown {
  const tier = findSizeTier(input.sizeCode);
  const base = tier?.price ?? null;
  const empty: PriceBreakdown = {
    quotable: false,
    basePrice: 0,
    unitPrice: 0,
    services: [],
    servicesTotal: 0,
    subtotal: 0,
    tax: 0,
    shipping: 0,
    discount: 0,
    total: 0,
  };
  if (base === null) return empty;

  const luxury = input.luxury ?? false;
  const scaledBase = luxury ? base : base * STANDARD_PRICE_SCALE;
  const frame = FRAME_OPTIONS.find((f) => f.id === input.frameId)?.multiplier ?? 1;
  const material = MATERIAL_OPTIONS.find((m) => m.id === input.materialId)?.multiplier ?? 1;
  const finish = FINISH_OPTIONS.find((f) => f.id === input.finishId)?.multiplier ?? 1;
  const design = DESIGN_OPTIONS.find((d) => d.id === input.designId)?.multiplier ?? 1;
  const shipping = SHIPPING_OPTIONS.find((s) => s.id === input.shippingId)?.price ?? 0;
  const premium = input.productMultiplier ?? 1;

  const quantity = Math.max(1, Math.min(99, Math.round(input.quantity || 1)));
  // All prices are VAT-inclusive (VAT is embedded, never shown separately).
  const unitPrice = clampFramePrice(scaledBase * premium * frame * material * finish * design, luxury);
  const gross = unitPrice * quantity;
  // Volume courtesy for collectors and corporate orders.
  const discountRate = quantity >= 10 ? 0.1 : quantity >= 5 ? 0.05 : 0;
  const discount = gross * discountRate;
  const net = gross - discount;

  const services = (input.serviceIds ?? []).flatMap((id) => {
    const svc = SERVICE_OPTIONS.find((s) => s.id === id);
    if (!svc) return [];
    return [{ id: svc.id, label: svc.label, amount: net * svc.rate + svc.flat }];
  });
  const servicesTotal = services.reduce((sum, s) => sum + s.amount, 0);

  const subtotal = net + servicesTotal;
  // VAT portion embedded inside the VAT-inclusive subtotal (kept for records only).
  const tax = subtotal - subtotal / (1 + TAX_RATE);

  return {
    quotable: true,
    basePrice: clampFramePrice(scaledBase * premium, luxury),
    unitPrice,
    services,
    servicesTotal,
    subtotal,
    tax,
    shipping,
    discount,
    total: subtotal + shipping,
  };
}

/** Subtle, premium configuration suggestions shown in the studio. */
export function configurationAdvice(opts: {
  product: Product | null;
  sizeCode: SizeCode;
  frameId: string;
  finishId: string;
  materialId: string;
}): string[] {
  const tips: string[] = [];
  if (isLuxury(opts.product) && opts.frameId !== "premium-gold" && opts.frameId !== "gold-leaf") {
    tips.push("For this luxury piece, a premium gold moulding is recommended.");
  }
  if (opts.sizeCode === "A0" && opts.finishId !== "matte") {
    tips.push("At A0 scale, a museum matte finish controls glare in lit halls.");
  }
  if (opts.materialId === "acrylic" && opts.finishId === "gloss") {
    tips.push("Acrylic already reflects — satin keeps the relief readable.");
  }
  if (opts.sizeCode === "CUSTOM") {
    tips.push("Bespoke dimensions are quoted individually within 24 hours.");
  }
  if (opts.frameId === "frameless" && opts.sizeCode === "A0") {
    tips.push("Frameless mounts above 150 cm benefit from a concealed steel batten.");
  }
  return tips.slice(0, 2);
}
