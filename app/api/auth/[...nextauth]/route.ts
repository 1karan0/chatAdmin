import { authOptions } from '@/lib/utils-server';
import NextAuth from 'next-auth';

const handler = NextAuth(authOptions);

export async function GET(request: Request, context: any) {
  return handler(request, context);
}

export async function POST(request: Request, context: any) {
  return handler(request, context);
}