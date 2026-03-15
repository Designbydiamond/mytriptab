import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/create-trip", label: "Create Trip" },
  { href: "/saved-trips", label: "Saved Trips" },
  { href: "/trip-summary", label: "Trip Summary" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-slate-800 bg-black">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-white"
        >
          MyTripTab
        </Link>

        <nav aria-label="Main navigation">
          <ul className="flex items-center gap-2 sm:gap-3">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="rounded-md px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
