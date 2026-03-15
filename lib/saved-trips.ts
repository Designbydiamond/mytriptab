import { calculateTripTotals, type TripData } from "@/lib/trip";

export interface SavedTrip extends TripData {
  id: string;
  createdAt: string;
}

const STORAGE_KEY = "mytriptab:saved-trips";

function isTripData(value: unknown): value is TripData {
  if (!value || typeof value !== "object") {
    return false;
  }

  const trip = value as Partial<TripData>;
  return (
    typeof trip.name === "string" &&
    typeof trip.destination === "string" &&
    typeof trip.travelers === "number" &&
    !!trip.expenses &&
    typeof trip.expenses === "object"
  );
}

function canUseLocalStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function getSavedTrips(): SavedTrip[] {
  if (!canUseLocalStorage()) {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((item): item is SavedTrip => {
      if (!item || typeof item !== "object") {
        return false;
      }

      const candidate = item as Partial<SavedTrip>;
      return (
        typeof candidate.id === "string" &&
        typeof candidate.createdAt === "string" &&
        isTripData(candidate)
      );
    });
  } catch {
    return [];
  }
}

function writeSavedTrips(trips: SavedTrip[]) {
  if (!canUseLocalStorage()) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
}

export function saveTrip(trip: TripData): SavedTrip {
  const nextTrip: SavedTrip = {
    ...trip,
    id:
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `${Date.now()}`,
    createdAt: new Date().toISOString(),
  };

  const previousTrips = getSavedTrips();
  writeSavedTrips([nextTrip, ...previousTrips]);
  return nextTrip;
}

export function deleteSavedTrip(id: string): SavedTrip[] {
  const nextTrips = getSavedTrips().filter((trip) => trip.id !== id);
  writeSavedTrips(nextTrips);
  return nextTrips;
}

export function getTripPreview(savedTrip: SavedTrip) {
  const totals = calculateTripTotals(savedTrip);
  return {
    totalCost: totals.totalCost,
    costPerPerson: totals.costPerPerson,
  };
}
