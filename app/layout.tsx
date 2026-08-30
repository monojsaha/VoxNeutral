import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "@/components/layout/Navigation";
import { AuthGuard } from "@/components/layout/AuthGuard";

export const metadata: Metadata = {
  title: "VoicePresence",
  description: "Executive English Pronunciation & Boardroom Speech Coach",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "VoicePresence",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "theme-color": "#0d0f12",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-neutral-950 text-gray-100 min-h-screen">
        <AuthGuard>
          <div className="flex min-h-screen">
            <Navigation />
            <main className="flex-1 lg:ml-64 pb-20 lg:pb-0">
              {children}
            </main>
          </div>
        </AuthGuard>
      </body>
    </html>
  );
}
