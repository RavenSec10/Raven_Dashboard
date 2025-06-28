import NextAuth, { NextAuthOptions, DefaultSession } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import prisma from '@/lib/prismadb';
import bcrypt from 'bcryptjs';
import { sign, verify } from 'jsonwebtoken';

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    refreshTokenId?: string;
    user: {
      id: string;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string;
    refreshTokenId?: string;  
    userId?: string;
    accessTokenExp?: number;
  }
}

const createTokens = async (user: { id: string }) => {
  const accessToken = sign(
    { userId: user.id },
    Buffer.from(process.env.JWT_PRIVATE_KEY!, 'base64').toString('ascii'),
    { algorithm: 'RS256', expiresIn: '15m' }
  );

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  const refreshToken = await prisma.refreshToken.create({
    data: {
      userId: user.id,
      hashedToken: bcrypt.hashSync(accessToken, 10),
      expiresAt: expiresAt,
    },
  });

  return { accessToken, refreshTokenId: refreshToken.id };
};

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error('Missing credentials');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error('Invalid credentials');
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);

        if (!isValid) {
          throw new Error('Invalid credentials');
        }

        return user;
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        const { accessToken, refreshTokenId } = await createTokens(user);
        
        return {
          ...token,
          accessToken,
          refreshTokenId,
          userId: user.id,
          accessTokenExp: Math.floor(Date.now() / 1000) + (15 * 60),
        };
      }

      if (!token.accessToken) {
        return token;
      }

      const currentTime = Math.floor(Date.now() / 1000);
      const tokenExp = token.accessTokenExp as number;

      if (currentTime < tokenExp) {
        return token;
      }

      try {
        const storedRefreshToken = await prisma.refreshToken.findUnique({
          where: { id: token.refreshTokenId as string, revoked: false },
        });

        if (!storedRefreshToken || storedRefreshToken.expiresAt < new Date()) {
          return token;
        }
        
        await prisma.refreshToken.update({
          where: { id: storedRefreshToken.id },
          data: { revoked: true },
        });

        const { accessToken, refreshTokenId } = await createTokens({ id: token.userId as string });
        
        return {
          ...token,
          accessToken,
          refreshTokenId,
          accessTokenExp: Math.floor(Date.now() / 1000) + (15 * 60),
        };

      } catch (refreshError) {
        return token;
      }
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.userId as string;
        session.accessToken = token.accessToken as string;
        session.refreshTokenId = token.refreshTokenId as string;
      }
      return session;
    },
  },
  events: {
    async signOut({ session, token }) {
      if (token?.userId) {
        await prisma.refreshToken.updateMany({
          where: { userId: token.userId as string },
          data: { revoked: true },
        });
      }
    },
  },
  pages: {
    signIn: '/sign-in',
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };