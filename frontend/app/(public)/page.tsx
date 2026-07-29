import Link from "next/link";
import { Compass, Leaf, ShoppingBag } from "lucide-react";

export default function HomePage() {
  return (
    <div>
      <section className="relative overflow-hidden bg-[#12271A] text-white">
        <div className="container relative mx-auto grid gap-10 px-4 py-20 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-secondary">
              Lubombo Corridor, Eswatini
            </p>
            <h1 className="mt-3 text-4xl font-bold leading-tight md:text-5xl">
              Support Local. Protect Nature. Build Our Future.
            </h1>
            <p className="mt-4 max-w-lg text-[#C7D8CC]">
              Discover local products, explore amazing destinations, and be
              part of conservation in the Lubombo Corridor.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/marketplace" className="rounded-lg bg-secondary px-5 py-3 font-semibold text-[#0F1F14] hover:opacity-90">
                Explore Marketplace
              </Link>
              <Link href="/tourism" className="rounded-lg border border-white/30 px-5 py-3 font-semibold hover:bg-white/10">
                Explore Destinations
              </Link>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { icon: ShoppingBag, label: "Verified local producers" },
              { icon: Compass, label: "Curated eco-tourism" },
              { icon: Leaf, label: "Community conservation" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="rounded-xl bg-white/10 p-4 backdrop-blur">
                <Icon className="h-6 w-6 text-secondary" />
                <p className="mt-2 text-sm">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-[#14231A]">Featured Products</h2>
          <Link href="/marketplace" className="text-sm font-medium text-primary hover:underline">
            View all →
          </Link>
        </div>
        <p className="text-sm text-[#7C9284]">
          {/* TODO: fetch and render <ProductCard /> grid via TanStack Query once running against a live API */}
          Featured products load here once the API is running — see the Marketplace page for the full implementation.
        </p>
      </section>

      <section className="bg-white py-16">
        <div className="container mx-auto grid gap-8 px-4 md:grid-cols-3">
          {[
            { title: "Marketplace", desc: "Browse and buy from verified local producers across the Lubombo Corridor.", href: "/marketplace" },
            { title: "Tourism", desc: "Book eco-tourism experiences at nature reserves and cultural sites.", href: "/tourism" },
            { title: "Conservation", desc: "See the conservation projects communities are running right now.", href: "/conservation" },
          ].map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="rounded-2xl border border-black/5 p-6 transition hover:border-primary/40 hover:shadow-sm"
            >
              <h3 className="text-lg font-semibold text-primary">{card.title}</h3>
              <p className="mt-2 text-sm text-[#4C5F52]">{card.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-[#14231A]">Join Our Mission</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-[#4C5F52]">
          Apply to become a verified seller and grow with your community.
        </p>
        <Link
          href="/become-a-seller"
          className="mt-6 inline-block rounded-lg bg-primary px-6 py-3 font-semibold text-white hover:bg-[#26662A]"
        >
          Apply Now
        </Link>
      </section>
    </div>
  );
}
