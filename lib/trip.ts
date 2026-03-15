export const EXPENSE_CATEGORIES = [
  { key: "flights", label: "Flights" },
  { key: "hotels", label: "Hotels" },
  { key: "food", label: "Food" },
  { key: "transportation", label: "Transportation" },
  { key: "activities", label: "Activities" },
  { key: "misc", label: "Misc" },
] as const;

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number]["key"];

export type TripExpenses = Record<ExpenseCategory, number>;

export interface TripData {
  name: string;
  destination: string;
  travelers: number;
  expenses: TripExpenses;
}

export const dummyTrip: TripData = {
  name: "Weekend in Lisbon",
  destination: "Lisbon, Portugal",
  travelers: 2,
  expenses: {
    flights: 760,
    hotels: 540,
    food: 260,
    transportation: 95,
    activities: 180,
    misc: 70,
  },
};

export function emptyExpenses(): TripExpenses {
  return {
    flights: 0,
    hotels: 0,
    food: 0,
    transportation: 0,
    activities: 0,
    misc: 0,
  };
}

export function calculateTripTotals(trip: Pick<TripData, "travelers" | "expenses">) {
  const totalCost = Object.values(trip.expenses).reduce(
    (sum, expense) => sum + expense,
    0,
  );
  const safeTravelers = Math.max(trip.travelers, 1);
  const costPerPerson = totalCost / safeTravelers;

  const breakdown = EXPENSE_CATEGORIES.map((category) => {
    const amount = trip.expenses[category.key];
    const share = totalCost > 0 ? (amount / totalCost) * 100 : 0;

    return {
      ...category,
      amount,
      share,
    };
  });

  return {
    totalCost,
    costPerPerson,
    breakdown,
  };
}

export function toCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

function parseNumber(value: string | null): number {
  if (!value) {
    return 0;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

export function tripToSearchParams(trip: TripData): URLSearchParams {
  const params = new URLSearchParams();
  params.set("name", trip.name);
  params.set("destination", trip.destination);
  params.set("travelers", String(Math.max(1, Math.floor(trip.travelers))));

  for (const category of EXPENSE_CATEGORIES) {
    params.set(category.key, String(Math.max(0, trip.expenses[category.key])));
  }

  return params;
}

export function tripFromSearchParams(searchParams: URLSearchParams): TripData | null {
  const hasParams = searchParams.toString().length > 0;

  if (!hasParams) {
    return null;
  }

  const expenses = emptyExpenses();
  for (const category of EXPENSE_CATEGORIES) {
    expenses[category.key] = parseNumber(searchParams.get(category.key));
  }

  const travelersRaw = Number(searchParams.get("travelers") ?? "");
  const travelers = Number.isFinite(travelersRaw)
    ? Math.max(1, Math.floor(travelersRaw))
    : 1;

  return {
    name: searchParams.get("name")?.trim() || "Untitled Trip",
    destination: searchParams.get("destination")?.trim() || "Unknown destination",
    travelers,
    expenses,
  };
}
