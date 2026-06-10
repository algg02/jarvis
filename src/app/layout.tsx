import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "J.A.R.V.I.S — Personal Intelligence Dashboard",
  description: "Just A Rather Very Intelligent System",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" style={{ height: '100%', overflow: 'hidden' }}>
      <body style={{ height: '100%', overflow: 'hidden', margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}
