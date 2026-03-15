import Link from "next/link";
import {
  calculateTripTotals,
  dummyTrip,
  toCurrency,
  tripFromSearchParams,
} from "@/lib/trip";

interface TripSummaryPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function toUrlSearchParams(
  source: Record<string, string | string[] | undefined>,
): URLSearchParams {
  const urlSearchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(source)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        urlSearchParams.append(key, item);
      }
      continue;
    }

    if (typeof value === "string") {
      urlSearchParams.set(key, value);
    }
  }

  return urlSearchParams;
}

export default async function TripSummaryPage({
  searchParams,
}: TripSummaryPageProps) {
  const params = toUrlSearchParams(await searchParams);
  const parsedTrip = tripFromSearchParams(params);
  const trip = parsedTrip ?? dummyTrip;
  const totals = calculateTripTotals(trip);
  const showingDummyData = !parsedTrip;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          Trip Summary
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Review your full cost breakdown and per-person budget.
        </p>
        {showingDummyData ? (
          <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700">
            No trip data was provided, so you are viewing the built-in example
            trip.
          </p>
        ) : null}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">{trip.name}</h2>
            <p className="text-sm text-slate-600">{trip.destination}</p>
          </div>
          <p className="text-sm text-slate-600">{trip.travelers} travelers</p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
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
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-lg font-semibold text-slate-900">Cost breakdown</h2>

        <div className="mt-4 space-y-4">
          {totals.breakdown.map((item) => (
            <article key={item.key} className="rounded-xl border border-slate-200 p-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-medium text-slate-900">{item.label}</h3>
                <div className="text-right">
                  <p className="font-semibold text-slate-900">
                    {toCurrency(item.amount)}
                  </p>
                  <p className="text-xs text-slate-500">{item.share.toFixed(1)}%</p>
                </div>
              </div>
              <div className="mt-3 h-2 w-full rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-slate-700"
                  style={{ width: `${item.share}%` }}
                />
              </div>
            </article>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/create-trip"
            className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            Create or Edit Trip
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Back to Homepage
          </Link>
        </div>
      </section>
    </div>
  );
}
