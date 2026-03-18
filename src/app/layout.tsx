import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const nostalgicaReg = localFont({
  src: "./fonts/SeriouslyNostalgicFnIt-Reg.otf",
  variable: "--font-nostalgica-reg",
});

export const metadata: Metadata = {
  title: "Abierto - Open briefs for designers.",
  description: "Get real client briefs delivered weekly. Build portfolio work that actually feels real.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${nostalgicaReg.variable}`}>
        {children}
      </body>
    </html>
  );
}
