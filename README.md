# MyTripTab

MyTripTab is a production-ready web app for travelers who want to record and understand the real cost of trips.

## Tech Stack

- Next.js (App Router)
- TypeScript
- TailwindCSS

## Core Features

- Create a trip
- Set number of travelers
- Add expenses for:
  - Flights
  - Hotels
  - Food
  - Transportation
  - Activities
  - Misc
- Automatically calculate:
  - Total trip cost
  - Cost per person

## Pages

- **Homepage**: Product overview and value proposition
- **Create Trip**: Card-based form for entering trip details and costs
- **Trip Summary**: Full breakdown by category with total and per-person cost

The app also includes:

- Basic top navigation
- Responsive layout
- Built-in dummy trip data for quick exploration

## Run Locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Build for Production

```bash
npm run build
npm run start
```
