"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { getCommunities } from "@/services/communities";
import { submitSellerApplication } from "@/services/seller-applications";

const schema = z.object({
  full_name: z.string().min(2, "Full name is required"),
  organization_name: z.string().optional(),
  community: z.string().min(1, "Please select a community"),
  district: z.string().min(1, "District is required"),
  phone_number: z.string().min(6, "A valid phone number is required"),
  email: z.string().email("Enter a valid email address"),
  business_type: z.string().min(1, "Business type is required"),
  products_to_sell: z.string().min(3, "Tell us what you'd like to sell"),
  business_description: z.string().min(10, "Please describe your business (10+ characters)"),
});

type FormValues = z.infer<typeof schema>;

export default function BecomeASellerPage() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: communities } = useQuery({ queryKey: ["communities"], queryFn: getCommunities });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    setError(null);
    try {
      await submitSellerApplication(values);
      setSubmitted(true);
    } catch {
      setError("Something went wrong submitting your application. Please try again.");
    }
  };

  if (submitted) {
    return (
      <div className="container mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-primary">Application submitted</h1>
        <p className="mt-2 text-sm text-[#4C5F52]">
          Thanks for applying. An administrator will review your application and follow up by email.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-bold text-[#14231A]">Become a Seller</h1>
      <p className="mt-1 text-sm text-[#7C9284]">
        Tell us about your business. Our team reviews every application before publishing listings.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
        <Field label="Full Name" error={errors.full_name?.message}>
          <input {...register("full_name")} className="input" />
        </Field>
        <Field label="Organization / Cooperative Name (optional)">
          <input {...register("organization_name")} className="input" />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Community" error={errors.community?.message}>
            <select {...register("community")} className="input">
              <option value="">Select a community</option>
              {communities?.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </Field>
          <Field label="District" error={errors.district?.message}>
            <input {...register("district")} className="input" />
          </Field>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Phone Number" error={errors.phone_number?.message}>
            <input {...register("phone_number")} className="input" />
          </Field>
          <Field label="Email Address" error={errors.email?.message}>
            <input type="email" {...register("email")} className="input" />
          </Field>
        </div>
        <Field label="Business Type" error={errors.business_type?.message}>
          <input {...register("business_type")} placeholder="e.g. Cooperative, Sole Trader" className="input" />
        </Field>
        <Field label="Products to Sell" error={errors.products_to_sell?.message}>
          <textarea {...register("products_to_sell")} rows={2} className="input" />
        </Field>
        <Field label="Business Description" error={errors.business_description?.message}>
          <textarea {...register("business_description")} rows={4} className="input" />
        </Field>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-primary px-5 py-3 font-semibold text-white hover:bg-[#26662A] disabled:opacity-60"
        >
          {isSubmitting ? "Submitting…" : "Submit Application"}
        </button>
      </form>
    </div>
  );
}

function Field({
  label, error, children,
}: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-[#14231A]">{label}</span>
      <div className="mt-1">{children}</div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </label>
  );
}
