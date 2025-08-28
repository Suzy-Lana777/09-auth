// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { Roboto } from "next/font/google";

import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer"; // 👈 обов'язково імпорт
import TanStackProvider from "@/components/TanStackProvider/TanStackProvider";

const roboto = Roboto({
  weight: ["400", "700"],
  variable: "--font-roboto",
  display: "swap",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Home Page NoteHub",
  description: "Save, create, and manage your notes easily with NoteHub.",
  openGraph: {
    title: "Note Hub",
    description: "Save, create, and manage your notes easily with NoteHub.",
    url:  '/',
    images: [
              {
                url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
                width: 1200,
                height: 630,
                alt: "Home Page",
              }
            ]
  }
};


export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roboto.variable}>
        <TanStackProvider>
          <Header />
          <main>
            {children}
            {modal}
          </main>
          <Footer />
        </TanStackProvider>
      </body>
    </html>
  );
}
