"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  EXPENSE_CATEGORIES,
  calculateTripTotals,
  dummyTrip,
  toCurrency,
  tripToSearchParams,
  type ExpenseCategory,
  type TripData,
} from "@/lib/trip";
import { saveTrip } from "@/lib/saved-trips";

function cloneDummyTrip(): TripData {
  return {
    ...dummyTrip,
    expenses: { ...dummyTrip.expenses },
  };
}

export default function CreateTripPage() {
  const router = useRouter();
  const [trip, setTrip] = useState<TripData>(cloneDummyTrip);

  const totals = useMemo(() => calculateTripTotals(trip), [trip]);

  function handleTripFieldChange(field: "name" | "destination", value: string) {
    setTrip((previousTrip) => ({
      ...previousTrip,
      [field]: value,
    }));
  }

  function handleTravelersChange(value: string) {
    const parsed = Number(value);
    const nextTravelers = Number.isFinite(parsed)
      ? Math.max(1, Math.floor(parsed))
      : 1;

    setTrip((previousTrip) => ({
      ...previousTrip,
      travelers: nextTravelers,
    }));
  }

  function handleExpenseChange(category: ExpenseCategory, value: string) {
    const parsed = Number(value);
    const nextValue = Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;

    setTrip((previousTrip) => ({
      ...previousTrip,
      expenses: {
        ...previousTrip.expenses,
        [category]: nextValue,
      },
    }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    saveTrip(trip);
    const params = tripToSearchParams(trip);
    router.push(`/trip-summary?${params.toString()}`);
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          Create Trip
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Enter your trip details and expenses to calculate the total and cost
          per traveler. The form starts with sample data so you can try it
          immediately.
        </p>
      </section>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-lg font-semibold text-slate-900">Trip details</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm text-slate-700">
              Trip name
              <input
                type="text"
                value={trip.name}
                onChange={(event) =>
                  handleTripFieldChange("name", event.target.value)
                }
                className="rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none ring-slate-300 transition focus:ring-2"
                placeholder="Summer in Italy"
                required
              />
            </label>

            <label className="flex flex-col gap-2 text-sm text-slate-700">
              Destination
              <input
                type="text"
                value={trip.destination}
                onChange={(event) =>
                  handleTripFieldChange("destination", event.target.value)
                }
                className="rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none ring-slate-300 transition focus:ring-2"
                placeholder="Rome, Italy"
                required
              />
            </label>

            <label className="flex flex-col gap-2 text-sm text-slate-700 sm:col-span-2">
              Number of travelers
              <input
                type="number"
                min={1}
                step={1}
                value={trip.travelers}
                onChange={(event) => handleTravelersChange(event.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none ring-slate-300 transition focus:ring-2 sm:w-40"
                required
              />
            </label>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-lg font-semibold text-slate-900">
            Expense categories
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Add costs for all major categories.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {EXPENSE_CATEGORIES.map((category) => (
              <label
                key={category.key}
                className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700"
              >
                {category.label}
                <div className="flex items-center rounded-lg border border-slate-300 bg-white px-3">
                  <span className="text-slate-500">$</span>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={trip.expenses[category.key]}
                    onChange={(event) =>
                      handleExpenseChange(category.key, event.target.value)
                    }
                    className="w-full border-0 bg-transparent px-2 py-2 text-slate-900 outline-none"
                  />
                </div>
              </label>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-lg font-semibold text-slate-900">
            Live trip totals
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Total trip cost
              </p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">
                {toCurrency(totals.totalCost)}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Cost per person
              </p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">
                {toCurrency(totals.costPerPerson)}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700"
            >
              View Trip Summary
            </button>

            <button
              type="button"
              onClick={() => setTrip(cloneDummyTrip())}
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Reset to example data
            </button>
            <Link
              href="/saved-trips"
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              View Saved Trips
            </Link>
          </div>
        </section>
      </form>
    </div>
  );
}
