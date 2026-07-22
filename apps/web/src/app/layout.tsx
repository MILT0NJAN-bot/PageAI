// app/layout.tsx — Root layout de Next.js App Router
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CraftPage — Crea tu sitio web en minutos',
  description: 'Genera un sitio web profesional con inteligencia artificial. Sin código, sin diseñador.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        {children}
      </body>
    </html>
  );
}
