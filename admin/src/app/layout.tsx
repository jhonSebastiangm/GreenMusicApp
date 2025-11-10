import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Green Music Admin',
  description: 'Panel de administración para Green Music',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}

