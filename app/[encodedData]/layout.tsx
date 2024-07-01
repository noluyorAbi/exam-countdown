import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Custom Countdown App",
  description: "Create custom countdowns for any event and display them on your MacBook screen using the Plash app.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="overflow-hidden">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
