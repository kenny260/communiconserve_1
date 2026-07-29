import type { Metadata } from "next";
import "../styles/globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "CommuniConserve | Conserve. Connect. Prosper.",
  description:
    "Community-led conservation, local commerce, and eco-tourism in the Lubombo Corridor, Eswatini.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#F7FAF7] text-[#14231A] antialiased" suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
