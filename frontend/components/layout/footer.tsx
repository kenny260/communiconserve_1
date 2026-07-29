import Link from "next/link";

const columns = [
  { title: "Explore", links: [["Marketplace", "/marketplace"], ["Tourism", "/tourism"], ["Conservation", "/conservation"]] },
  { title: "Community", links: [["Communities", "/communities"], ["Become a Seller", "/become-a-seller"], ["Contact", "/contact"]] },
  { title: "Account", links: [["Login", "/auth/login"], ["Register", "/auth/register"]] },
];

export function Footer() {
  return (
    <footer className="mt-16 border-t border-black/5 bg-[#0F1F14] text-[#D8E4DC]">
      <div className="container mx-auto grid gap-8 px-4 py-12 md:grid-cols-4">
        <div>
          <p className="text-lg font-semibold text-white">CommuniConserve</p>
          <p className="mt-2 max-w-xs text-sm text-[#9FB3A6]">
            Community-led conservation, local commerce, and eco-tourism in the
            Lubombo Corridor, Eswatini.
          </p>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <p className="text-sm font-semibold text-white">{col.title}</p>
            <ul className="mt-3 space-y-2 text-sm">
              {col.links.map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-[#9FB3A6] hover:text-white">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-[#7C9284]">
        © {new Date().getFullYear()} CommuniConserve. All rights reserved.
      </div>
    </footer>
  );
}
