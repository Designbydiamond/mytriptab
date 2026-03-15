"use client";

import Link from "next/link";
import { useState } from "react";
import { toCurrency, tripToSearchParams } from "@/lib/trip";
import {
  deleteSavedTrip,
  getSavedTrips,
  getTripPreview,
  type SavedTrip,
} from "@/lib/saved-trips";

export default function SavedTripsPage() {
  const [savedTrips, setSavedTrips] = useState<SavedTrip[]>(() => getSavedTrips());

  function handleDelete(id: string) {
    setSavedTrips(deleteSavedTrip(id));
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          Saved Trips
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          View all saved trips and quickly open their summaries.
        </p>
      </section>

      {savedTrips.length === 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-8">
          <h2 className="text-lg font-semibold text-slate-900">
            No saved trips yet
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Create a trip and save it to build your travel history.
          </p>
          <Link
            href="/create-trip"
            className="mt-5 inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            Create Trip
          </Link>
        </section>
      ) : (
        <section className="grid gap-4 sm:grid-cols-2">
          {savedTrips.map((trip) => {
            const preview = getTripPreview(trip);
            const params = tripToSearchParams(trip);

            return (
              <article
                key={trip.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      {trip.name}
                    </h2>
                    <p className="text-sm text-slate-600">{trip.destination}</p>
                  </div>
                  <p className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
                    {trip.travelers} travelers
                  </p>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      Total
                    </p>
                    <p className="mt-1 text-base font-semibold text-slate-900">
                      {toCurrency(preview.totalCost)}
                    </p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      Per person
                    </p>
                    <p className="mt-1 text-base font-semibold text-slate-900">
                      {toCurrency(preview.costPerPerson)}
                    </p>
                  </div>
                </div>

                <p className="mt-3 text-xs text-slate-500">
                  Saved {new Date(trip.createdAt).toLocaleString()}
                </p>

                <div className="mt-4 flex gap-2">
                  <Link
                    href={`/trip-summary?${params.toString()}`}
                    className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
                  >
                    Open Summary
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(trip.id)}
                    className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                  >
                    Delete
                  </button>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
}
