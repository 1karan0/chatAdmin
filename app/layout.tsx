import DefaultLayout from '@/DefaultLayout';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BotAgent - AI Chatbot Platform',
  description: 'Create, train, and deploy intelligent chatbots in minutes',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
       <script src="http://localhost:3000/embed/6434c17d-357e-439f-a299-434797595b3b/widget.js"></script>
      </head>
      <body className={`${inter.className} bg-zinc-900`}><DefaultLayout>{children}</DefaultLayout></body>
    </html>
  );
}