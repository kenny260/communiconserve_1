"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { apiClient } from "@/lib/api-client";

const schema = z.object({
  username: z.string().min(3, "At least 3 characters"),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "At least 8 characters"),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
});
type FormValues = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: FormValues) => {
    setError(null);
    try {
      await apiClient.post("/auth/register/", values);
      router.push("/auth/login");
    } catch {
      setError("Couldn't create your account. That username or email may already be taken.");
    }
  };

  return (
    <div className="container mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-12">
      <h1 className="text-2xl font-bold text-primary">Create your account</h1>
      <p className="mt-1 text-sm text-[#7C9284]">Join CommuniConserve as a customer or tourist.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">First Name</label>
            <input {...register("first_name")} className="input mt-1" />
            {errors.first_name && <p className="mt-1 text-xs text-red-600">{errors.first_name.message}</p>}
          </div>
          <div>
            <label className="text-sm font-medium">Last Name</label>
            <input {...register("last_name")} className="input mt-1" />
            {errors.last_name && <p className="mt-1 text-xs text-red-600">{errors.last_name.message}</p>}
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">Username</label>
          <input {...register("username")} className="input mt-1" />
          {errors.username && <p className="mt-1 text-xs text-red-600">{errors.username.message}</p>}
        </div>
        <div>
          <label className="text-sm font-medium">Email</label>
          <input type="email" {...register("email")} className="input mt-1" />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
        </div>
        <div>
          <label className="text-sm font-medium">Password</label>
          <input type="password" {...register("password")} className="input mt-1" />
          {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-primary px-5 py-3 font-semibold text-white hover:bg-[#26662A] disabled:opacity-60"
        >
          {isSubmitting ? "Creating account…" : "Register"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[#7C9284]">
        Already have an account?{" "}
        <Link href="/auth/login" className="font-medium text-primary hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
