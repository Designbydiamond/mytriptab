import Link from "next/link";
import { calculateTripTotals, dummyTrip, toCurrency } from "@/lib/trip";

export default function Home() {
  const totals = calculateTripTotals(dummyTrip);

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="space-y-4">
          <p className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
            Travel Cost Tracker
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Plan smarter trips with full cost clarity.
          </h1>
          <p className="max-w-2xl text-slate-600">
            MyTripTab helps you capture every major travel expense, calculate
            the total trip cost, and instantly understand how much each
            traveler should budget.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/create-trip"
            className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            Create Your Trip
          </Link>
          <Link
            href="/trip-summary"
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            View Example Summary
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">Create a trip</h2>
          <p className="mt-2 text-sm text-slate-600">
            Add trip details and the number of travelers in under a minute.
          </p>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">
            Track key expense categories
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Flights, hotels, food, transportation, activities, and misc are all
            included.
          </p>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">
            Understand real trip costs
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Instantly see the total trip cost and split it per person.
          </p>
        </article>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Example trip snapshot
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              {dummyTrip.name} • {dummyTrip.destination}
            </p>
          </div>
          <Link
            href="/trip-summary"
            className="text-sm font-medium text-slate-700 underline underline-offset-4 hover:text-slate-900"
          >
            Open full summary
          </Link>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Travelers
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {dummyTrip.travelers}
            </p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Total Cost
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {toCurrency(totals.totalCost)}
            </p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Cost / Person
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {toCurrency(totals.costPerPerson)}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
