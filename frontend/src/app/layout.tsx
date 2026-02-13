import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FR8 Tools — Intermodal Rail Freight Intelligence",
  description:
    "AI-powered platform for querying European intermodal train connections, analyzing CO2 emissions, and optimizing freight routes.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
