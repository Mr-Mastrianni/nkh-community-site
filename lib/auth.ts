import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "./db"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "admin@example.com",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        })

        if (!user) {
          return null
        }

        // For now, we'll use a simple password check
        // In production, you should hash passwords with bcrypt
        const isPasswordValid = credentials.password === "admin123" // Temporary for development

        if (!isPasswordValid) {
          return null
        }

        // Update last login
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        })

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub!
        session.user.role = token.role as string
      }
      return session
    },
  },
}

// Helper function to get server session
export async function getServerSession() {
  const { getServerSession } = await import("next-auth/next")
  return getServerSession(authOptions)
}

// Helper function to check if user is admin
export async function isAdmin() {
  const session = await getServerSession()
  return session?.user?.role === "SUPER_ADMIN" || session?.user?.role === "EDITOR"
}

// Helper function to require admin access
export async function requireAdmin() {
  const session = await getServerSession()
  if (!session?.user || !["SUPER_ADMIN", "EDITOR", "AUTHOR"].includes(session.user.role)) {
    throw new Error("Unauthorized")
  }
  return session
}