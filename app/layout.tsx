import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ST Chicagoland Mobile Detailing",
  description: "Premium mobile auto detailing across Downtown Chicago and surrounding suburbs.",
  metadataBase: new URL("https://stchicagolanddetailing.com")
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
