import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import DemoPersonaBanner from "@/components/shared/DemoPersonaBanner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "ResourceHub | Unlock Underused Equipment & Spaces",
  description: "A complete resource-sharing ecosystem for Indian academic and research institutions. Discover, book, and share high-value laboratories, computing nodes, robotic testbeds, and collaborative facilities.",
  keywords: ["resource sharing", "academic equipment", "lab booking", "CodeVerse India 2026", "DGX A100", "3D printing", "SLA", "robotics"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased font-sans selection:bg-blue-600 selection:text-white">
        <AuthProvider>
          <DemoPersonaBanner />
          <Navbar />
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
