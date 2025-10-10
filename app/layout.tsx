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
        <script src="https://chat-admin-silk.vercel.app/embed/956b63c2-a3b7-4fbe-8032-8270f12c4d37/widget.js"></script> 
      </head>
      <body className={`${inter.className} bg-zinc-900`}><DefaultLayout>{children}</DefaultLayout></body>
    </html>
  );
}