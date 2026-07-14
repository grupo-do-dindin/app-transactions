"use client";

import { useEffect, Suspense } from "react";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const accountId = searchParams.get("accountId");

    if (token && accountId) {
      Cookies.set("token", token, {
        secure: true,
        sameSite: "lax",
        expires: 1/3,
        path: "/",
      });

      Cookies.set("accountId", accountId, {
        secure: true,
        sameSite: "lax",
        expires: 1/3,
        path: "/",
      });

      redirect("/");
    } else {
      const authUrl = process.env.NEXT_PUBLIC_AUTH_URL ?? "http://localhost:3001";
      router.push(`${authUrl}/login?error=invalid_callback`);
    }
  }, [searchParams, router]);

  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100vh", fontFamily: "sans-serif" }}>
      <h2>Conectando sua conta...</h2>
      <p style={{ color: "#666" }}>Por favor, aguarde um instante.</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <AuthCallbackContent />
    </Suspense>
  );
}