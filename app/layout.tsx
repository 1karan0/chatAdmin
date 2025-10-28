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
        <link rel="icon" href="/chatbot-logo.png" />
        <script src="https://chat-admin-silk.vercel.app/embed/78bdc7ba-fb78-4a70-a623-229d4bb8a7f4/widget.js"></script> 
      </head>
      <body className={`${inter.className} bg-zinc-900`}><DefaultLayout>{children}</DefaultLayout></body>
    </html>
  );
}
