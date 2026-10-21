import type { Metadata } from "next";
import { Geist_Mono, Inter, Space_Grotesk } from "next/font/google";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Muhammad Nur Uddin | Backend-Focused Full-Stack Developer",
    template: "%s | Muhammad Nur Uddin",
  },
  description:
    "Portfolio of Muhammad Nur Uddin, a backend-focused full-stack developer building web applications with TypeScript, Next.js, Node.js, and PostgreSQL.",
  openGraph: {
    title: "Muhammad Nur Uddin | Backend-Focused Full-Stack Developer",
    description:
      "Portfolio of Muhammad Nur Uddin, a backend-focused full-stack developer building web applications with TypeScript, Next.js, Node.js, and PostgreSQL.",
    siteName: "Muhammad Nur Uddin",
    locale: "en_US",
    type: "website",
    // TBD: metadataBase / canonical URL and Open Graph image — deferred
    // until the deployment domain and assets are confirmed (blueprint §3.5).
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Footer />
      </body>
    </html>
  );
}
