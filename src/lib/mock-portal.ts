import { useSyncExternalStore } from "react";

/**
 * Mockup-only store for the Artisan / Admin portal demo interfaces.
 * Everything lives in memory — no database calls, no interaction with the
 * live ordering system.
 */

export type ArtisanStatus = "Pending" | "Approved" | "Dismissed";

export type MockArtisan = {
  id: string;
  fullName: string;
  email: string;
  password: string;
  biography: string;
  profilePhoto: string | null;
  gallery: string[];
  status: ArtisanStatus;
  submittedAt: string;
};

export type OrderStatus = "Pending" | "Shipping Complete" | "Completed" | "Cancelled";
export type OrderOrigin = "Artisan's Art" | "Company Stock";

export type MockOrder = {
  id: string;
  reference: string;
  customer: string;
  item: string;
  origin: OrderOrigin;
  total: number;
  status: OrderStatus;
  placedAt: string;
};

type State = { artisans: MockArtisan[]; orders: MockOrder[] };

const uid = () => Math.random().toString(36).slice(2, 10);

let state: State = {
  artisans: [
    {
      id: uid(),
      fullName: "Aline Uwase",
      email: "aline@example.com",
      password: "artisan123",
      biography:
        "Imigongo painter from Nyanza working with cow-dung relief and natural ochre pigments for eleven years.",
      profilePhoto: null,
      gallery: [],
      status: "Pending",
      submittedAt: new Date(Date.now() - 3 * 864e5).toISOString(),
    },
    {
      id: uid(),
      fullName: "Kwame Mensah",
      email: "kwame@example.com",
      password: "artisan123",
      biography: "Accra-based woodcarver blending Adinkra symbolism with contemporary 3D relief panels.",
      profilePhoto: null,
      gallery: [],
      status: "Approved",
      submittedAt: new Date(Date.now() - 12 * 864e5).toISOString(),
    },
  ],
  orders: [
    {
      id: uid(),
      reference: "SAF-10241",
      customer: "Diane Karenzi",
      item: "Imigongo Relief — A2, Gold Frame",
      origin: "Company Stock",
      total: 640000,
      status: "Pending",
      placedAt: new Date(Date.now() - 2 * 864e5).toISOString(),
    },
    {
      id: uid(),
      reference: "SAF-10242",
      customer: "Yusuf Abdallah",
      item: "Adinkra Carved Panel — A1",
      origin: "Artisan's Art",
      total: 910000,
      status: "Shipping Complete",
      placedAt: new Date(Date.now() - 5 * 864e5).toISOString(),
    },
    {
      id: uid(),
      reference: "SAF-10243",
      customer: "Chiamaka Obi",
      item: "Umukenyero Heritage Series — A3",
      origin: "Artisan's Art",
      total: 380000,
      status: "Completed",
      placedAt: new Date(Date.now() - 9 * 864e5).toISOString(),
    },
    {
      id: uid(),
      reference: "SAF-10244",
      customer: "Thabo Nkosi",
      item: "Luxury Obsidian Masterpiece — A0",
      origin: "Company Stock",
      total: 2450000,
      status: "Cancelled",
      placedAt: new Date(Date.now() - 14 * 864e5).toISOString(),
    },
  ],
};

const listeners = new Set<() => void>();
function emit(next: State) {
  state = next;
  listeners.forEach((l) => l());
}

export function useMockPortal() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => state,
    () => state,
  );
}

export const mockPortal = {
  submitRequest(input: {
    fullName: string;
    email: string;
    password: string;
    biography: string;
    profilePhoto: string | null;
    gallery: string[];
  }) {
    const artisan: MockArtisan = {
      id: uid(),
      ...input,
      email: input.email.toLowerCase(),
      status: "Pending",
      submittedAt: new Date().toISOString(),
    };
    emit({ ...state, artisans: [artisan, ...state.artisans] });
    return artisan;
  },
  setArtisanStatus(id: string, status: ArtisanStatus) {
    emit({ ...state, artisans: state.artisans.map((a) => (a.id === id ? { ...a, status } : a)) });
  },
  setOrderStatus(id: string, status: OrderStatus) {
    emit({ ...state, orders: state.orders.map((o) => (o.id === id ? { ...o, status } : o)) });
  },
  findArtisan(email: string, password: string) {
    return (
      state.artisans.find((a) => a.email === email.trim().toLowerCase() && a.password === password) ?? null
    );
  },
};

export const ORDER_STATUSES: OrderStatus[] = ["Pending", "Shipping Complete", "Completed", "Cancelled"];

export function orderStatusClasses(status: OrderStatus) {
  switch (status) {
    case "Completed":
      return "border-emerald-500/40 bg-emerald-500/15 text-emerald-300";
    case "Shipping Complete":
      return "border-sky-500/40 bg-sky-500/15 text-sky-300";
    case "Cancelled":
      return "border-destructive/40 bg-destructive/15 text-destructive";
    default:
      return "border-gold/40 bg-gold/15 text-gold";
  }
}

export function artisanStatusClasses(status: ArtisanStatus) {
  switch (status) {
    case "Approved":
      return "border-emerald-500/40 bg-emerald-500/15 text-emerald-300";
    case "Dismissed":
      return "border-destructive/40 bg-destructive/15 text-destructive";
    default:
      return "border-gold/40 bg-gold/15 text-gold";
  }
}

/** Reads a device-gallery file into a data URL for preview inside the mockup. */
export function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
