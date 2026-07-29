import Link from "next/link";
import { Leaf, Menu } from "lucide-react";

const links = [
  { href: "/about", label: "About" },
  { href: "/marketplace", label: "Marketplace" },
  { href: "/tourism", label: "Tourism" },
  { href: "/conservation", label: "Conservation" },
  { href: "/communities", label: "Communities" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/90 backdrop-blur">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-semibold text-primary">
          <Leaf className="h-6 w-6" />
          <span>
            CommuniConserve
            <span className="block text-[11px] font-normal tracking-wide text-secondary">
              Conserve. Connect. Prosper.
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-[#37493E] hover:text-primary">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link href="/auth/login" className="text-sm font-medium text-[#37493E] hover:text-primary">
            Login
          </Link>
          <Link
            href="/auth/register"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-[#26662A]"
          >
            Register
          </Link>
        </div>

        <button className="md:hidden" aria-label="Open menu">
          <Menu className="h-6 w-6 text-primary" />
        </button>
      </div>
    </header>
  );
}
