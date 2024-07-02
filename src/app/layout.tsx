import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader } from "@/components/ui/site-header";

export const metadata: Metadata = {
  title: "SocialPost-AI",
  description:
    "AI-powered social media content creation for Twitter, LinkedIn, Instagram, Reddit, and Medium",
  keywords: [
    "AI",
    "social media",
    "content creation",
    "automation",
    "Twitter",
    "LinkedIn",
    "Instagram",
    "Reddit",
    "Medium",
  ],
  authors: [{ name: "SocialPost-AI Team" }],
  creator: "SocialPost-AI",
  publisher: "SocialPost-AI Inc.",
  openGraph: {
    title: "SocialPost-AI: Revolutionize Your Social Media Presence",
    description:
      "Create engaging content for multiple platforms with the power of AI",
    url: "https://socialpost-ai.com",
    siteName: "SocialPost-AI",
    images: [
      {
        url: "https://socialpost-ai.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "SocialPost-AI Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SocialPost-AI: AI-Powered Social Media Content Creation",
    description:
      "Elevate your social media game with AI-generated posts for multiple platforms",
    creator: "@socialpostai",
    images: ["https://socialpost-ai.com/twitter-image.jpg"],
  },
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.className
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SiteHeader />
          <main className="mx-4 md:mx-8 mt-4">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
