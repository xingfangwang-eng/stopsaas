import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  weight: ['400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: "StopSaaS - Kill the bloat, save your money",
  description: "Paste your SaaS regret, get a free DIY alternative and a cancellation template in 2 seconds.",
  keywords: [
    "SaaS alternatives",
    "save money on SaaS",
    "bloatware alternative",
    "alternative to Salesforce",
    "alternative to HubSpot",
    "alternative to Microsoft 365",
    "alternative to Adobe Creative Cloud",
    "alternative to Slack",
    "alternative to Zoom",
    "alternative to Dropbox",
    "DIY SaaS alternative",
    "free SaaS alternative",
    "cancel SaaS subscription",
    "SaaS cost reduction"
  ],
  authors: [{ name: "StopSaaS" }],
  openGraph: {
    title: "STOP PAYING FOR SAAS",
    description: "Paste your SaaS regret, get a free DIY alternative and a cancellation template in 2 seconds.",
    url: "https://stopsaas.com",
    siteName: "StopSaaS",
    type: "website",
    images: [
      {
        url: "https://stopsaas.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "StopSaaS - Stop paying for bloatware",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "STOP PAYING FOR SAAS",
    description: "Paste your SaaS regret, get a free DIY alternative and a cancellation template in 2 seconds.",
    images: ["https://stopsaas.com/og-image.png"],
  },
  verification: {
    google: "uTT2vLHXrvh44esSpln_EMc1QEFjkN0vjJZ04UgI0Qc",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'StopSaaS',
              applicationCategory: 'Productivity',
              operatingSystem: 'All',
              url: 'https://stopsaas.com',
              description: 'Paste your SaaS regret, get a free DIY alternative and a cancellation template in 2 seconds.',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
                availability: 'https://schema.org/InStock'
              },
              review: {
                '@type': 'Review',
                ratingValue: '5',
                bestRating: '5',
                reviewCount: '1000'
              }
            })
          }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
