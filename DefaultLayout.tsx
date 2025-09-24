'use client';
import { SessionProvider } from 'next-auth/react';

type DefaultLayoutProps = {
  children: React.ReactNode;
};

export default function DefaultLayout({ children }: DefaultLayoutProps) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}
