"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function AuthCallbackPage() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const token_hash = searchParams.get("token_hash");
    const type = searchParams.get("type");

    if (!token_hash || !type) return;

    const deepLink = `endura://callback?token_hash=${encodeURIComponent(token_hash)}&type=${encodeURIComponent(type)}`;
    window.location.href = deepLink;
  }, [searchParams]);

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#12100E",
      color: "#FFF8F0",
      fontFamily: "sans-serif",
      gap: "16px",
      padding: "32px",
      textAlign: "center",
    }}>
      <p style={{ fontSize: "16px", fontWeight: 300, opacity: 0.7 }}>
        Opening Endura…
      </p>
      <a
        href={`endura://callback?token_hash=${searchParams.get("token_hash") ?? ""}&type=${searchParams.get("type") ?? ""}`}
        style={{
          marginTop: "8px",
          padding: "14px 32px",
          backgroundColor: "rgba(180,120,80,0.15)",
          border: "1px solid rgba(180,120,80,0.3)",
          borderRadius: "999px",
          color: "#C8956C",
          fontSize: "15px",
          textDecoration: "none",
        }}
      >
        Open in Endura
      </a>
    </div>
  );
}
