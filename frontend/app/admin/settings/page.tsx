"use client";

import { useState } from "react";

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#14231A]">Settings</h1>
      <p className="text-sm text-[#7C9284]">Platform-level configuration.</p>

      <form
        onSubmit={(e) => { e.preventDefault(); setSaved(true); }}
        className="mt-6 max-w-lg space-y-4 rounded-2xl border border-black/5 bg-white p-6 shadow-sm"
      >
        <div>
          <label className="text-sm font-medium">Platform name</label>
          <input defaultValue="CommuniConserve" className="input mt-1" />
        </div>
        <div>
          <label className="text-sm font-medium">Support email</label>
          <input defaultValue="support@communiconserve.org" className="input mt-1" />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" defaultChecked id="dark-mode" />
          <label htmlFor="dark-mode" className="text-sm">Allow dark mode on the public site</label>
        </div>
        <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-[#26662A]">
          Save Settings
        </button>
        {saved && <p className="text-xs text-primary">Saved locally — wire this form up to a real settings endpoint when one exists.</p>}
      </form>
    </div>
  );
}
