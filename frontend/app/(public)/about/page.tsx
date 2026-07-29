import { Handshake, Leaf, ShoppingBag } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-[#14231A]">About CommuniConserve</h1>
      <p className="mt-4 max-w-2xl text-sm text-[#4C5F52]">
        CommuniConserve is a platform designed to promote community-led
        conservation, local commerce, and eco-tourism in the Lubombo
        Corridor, Eswatini. We connect local communities, verified producers,
        tourists, customers, NGOs, and conservation officers through one
        secure digital ecosystem.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        {[
          { icon: Leaf, title: "Conservation", desc: "Promoting conservation initiatives and community projects across the corridor." },
          { icon: ShoppingBag, title: "Marketplace", desc: "Connecting verified local producers with buyers through a curated marketplace." },
          { icon: Handshake, title: "Eco-Tourism", desc: "Promoting eco-tourism destinations and enabling visitors to book experiences." },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
            <Icon className="h-6 w-6 text-primary" />
            <h2 className="mt-3 font-semibold text-[#14231A]">{title}</h2>
            <p className="mt-2 text-sm text-[#4C5F52]">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
