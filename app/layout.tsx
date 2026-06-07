import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'RL Cockpit',
  description: 'Operator cockpit for the oobbot trading engine',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
