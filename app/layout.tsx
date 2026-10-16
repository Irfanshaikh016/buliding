import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BuildSmart AI — AI-Based Building Construction Management Platform',
  description: 'Production-ready AI-powered construction management SaaS: Deterministic cost estimation, AI material selector, CPM schedule generation, task progress tracking, and BuildSmart AI Assistant.',
  keywords: 'construction management, building estimation, civil engineering, AI construction, material recommendation, construction schedule, project tracking',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased font-sans selection:bg-orange-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
