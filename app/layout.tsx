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
        <script src="https://chat-admin-silk.vercel.app/embed/c1be22dc-3454-4560-8a8f-ead6f43c4817/widget.js"></script>  
      </head>
      <body className={`${inter.className} bg-zinc-900`}><DefaultLayout>{children}</DefaultLayout></body>
    </html>
  );
}