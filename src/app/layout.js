import localFont from "next/font/local";
import "./globals.css";
import { Poppins } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import Providers from "@/app/providers"


const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"]
})

export const metadata = {
  title: "Timur Outdoor",
  description: "Web Apps for Timur Outdoor",
  keywords: ["Rental", "Outdoor", "Gunung", "Jatinangor", "Liburan", "Hiking"]
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link rel="shortcut icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <meta name="apple-mobile-web-app-title" content="MyWebSite" />
      <link rel="manifest" href="/site.webmanifest" />
      <body
        className={`${poppins.className}`}
      >
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
