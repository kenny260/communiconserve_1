"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { apiClient } from "@/lib/api-client";

const schema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});
type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: FormValues) => {
    setError(null);
    try {
      const { data } = await apiClient.post("/auth/login/", values);
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);

      const { data: me } = await apiClient.get("/auth/me/", {
        headers: { Authorization: `Bearer ${data.access}` },
      });
      router.push(me.role === "visitor" ? "/" : "/admin");
    } catch {
      setError("Invalid username or password.");
    }
  };

  return (
    <div className="container mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-12">
      <h1 className="text-2xl font-bold text-primary">Welcome back</h1>
      <p className="mt-1 text-sm text-[#7C9284]">Log in to CommuniConserve.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
        <div>
          <label className="text-sm font-medium">Username</label>
          <input {...register("username")} className="input mt-1" />
          {errors.username && <p className="mt-1 text-xs text-red-600">{errors.username.message}</p>}
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
          {isSubmitting ? "Logging in…" : "Log In"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[#7C9284]">
        Don't have an account?{" "}
        <Link href="/auth/register" className="font-medium text-primary hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
}
