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
            workspace: string | null;
            bio: string | null;
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
    async jwt({ token, user }) {
      if (user?.email) {
        let dbUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        // If user doesn't exist, create one
        if (!dbUser) {
          // Generate a unique tenant_id for the Python backend
          const tenantId = `${crypto.randomUUID()}`;
          const tenantName = `${user.name || "User"}'s tenant`;
          const username = user.name || "user";

          // Call Python backend to create the tenant
          try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/tenants`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "x-internal-secret": process.env.INTERNAL_API_KEY || "", // optional for backend auth
              },
              body: JSON.stringify({
                tenant_id: tenantId,
                tenant_name: tenantName,
                username: username,
              }),
            });

            if (!res.ok) {
              const err = await res.json();
              console.error("Failed to create tenant in backend:", err);
            } else {
              console.log("Tenant created successfully in backend");
            }
          } catch (error) {
            console.error("Tenant creation failed:", error);
          }

          // Store tenant_id in your Next.js DB user table
          dbUser = await prisma.user.create({
            data: {
              email: user.email,
              name: user.name || "Unknown",
              image: user.image,
              workspace: `${user.name || "User"}'s workspace`,
              bio: "",
            
            },
          });
        }

        token.userId = dbUser.id;
      }

      return token;
    },

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
            workspace: dbUser.workspace,
            bio: dbUser.bio,
           
          };
        }
      }
      return session;
    },
  },
};
