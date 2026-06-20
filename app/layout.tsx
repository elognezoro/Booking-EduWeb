import type { Metadata, Viewport } from "next";
import { Nunito_Sans } from "next/font/google";
import "./globals.css";

const nunito = Nunito_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-nunito",
  display: "swap",
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  title: {
    default: "EduWeb Booking — Réservation intelligente des ressources",
    template: "%s · EduWeb Booking",
  },
  description:
    "EduWeb Booking centralise les réservations de salles, matériels, véhicules, services, documents et espaces pour les organisations modernes.",
  applicationName: "EduWeb Booking",
  authors: [{ name: "EduWeb" }],
  keywords: [
    "réservation",
    "salles multimédias",
    "ressources",
    "EduWeb",
    "ENS Abidjan",
    "Côte d'Ivoire",
  ],
  icons: {
    icon: "/brand/logo-eduweb-booking.png",
    apple: "/brand/logo-eduweb-booking.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#064B3A",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover", // active env(safe-area-inset-*) sur mobile (encoche / barre gestuelle)
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${nunito.variable} font-sans`}>{children}</body>
    </html>
  );
}
