import { PrismaClient } from '@prisma/client';
import { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';


const prisma = new PrismaClient();

declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            email: string | null;
            name: string | null;
            image: string | null;
        };
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        userId?: string;
    }
}

export const authOptions: AuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
        }),

    ],

    callbacks: {
        /**
         * Runs on login → ensures user exists, stores userId in token
         */
        async jwt({ token, user }) {
            if (user?.email) {
                let dbUser = await prisma.user.findUnique({
                    where: { email: user.email },
                });

                if (!dbUser) {
                    dbUser = await prisma.user.create({
                        data: {
                            email: user.email,
                            name: user.name || 'Unknown',
                            image: user.image,
                        },
                    });
                }

                token.userId = dbUser.id;
            }
            return token;
        },

        /**
         * Runs on every session check → pulls active subscription + usage
         */
        async session({ session, token }) {
            if (token.userId) {
                const dbUser = await prisma.user.findUnique({
                    where: { id: token.userId },

                });

                if (dbUser) {
                    session.user = {
                        id: dbUser.id,
                        email: dbUser.email,
                        name: dbUser.name,
                        image: dbUser.image,

                    };
                }
            }
            return session;
        },
    },
};
