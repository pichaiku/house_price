import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "House Lens | ประเมินราคาบ้าน",
  description: "ประเมินราคาบ้านได้ง่ายด้วย House Lens",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}
