// app/layout.tsx — Root layout de Next.js App Router
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SiteBuilder AI — Crea tu sitio web en minutos',
  description: 'Genera un sitio web profesional con inteligencia artificial. Sin código, sin diseñador.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
