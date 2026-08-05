"use client";

import { useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="container mx-auto grid gap-10 px-4 py-16 md:grid-cols-2">
      <div>
        <h1 className="text-3xl font-bold text-[#14231A]">Contact Us</h1>
        <p className="mt-2 text-sm text-[#7C9284]">
          Questions about the platform, a booking, or an order? Reach out.
        </p>

        <div className="mt-6 space-y-4 text-sm text-[#4C5F52]">
          <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" /> support@communiconserve.org</p>
          <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" /> +268 2404 0000</p>
          <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> Lubombo Corridor, Eswatini</p>
        </div>
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
        className="space-y-4 rounded-2xl border border-black/5 bg-white p-6 shadow-sm"
      >
        {submitted ? (
          <p className="text-sm text-primary">Thanks for reaching out — we will get back to you soon.</p>
        ) : (
          <>
            <div>
              <label className="text-sm font-medium">Name</label>
              <input required className="input mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <input type="email" required className="input mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Message</label>
              <textarea required rows={4} className="input mt-1" />
            </div>
            <button type="submit" className="w-full rounded-lg bg-primary px-5 py-3 font-semibold text-white hover:bg-[#26662A]">
              Send Message
            </button>
          </>
        )}
      </form>
    </div>
  );
}
