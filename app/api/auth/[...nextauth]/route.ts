import NextAuth, { NextAuthOptions, DefaultSession } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import prisma from '@/lib/prismadb';
import bcrypt from 'bcryptjs';
import { sign, verify } from 'jsonwebtoken';
import { randomBytes } from 'crypto';

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

const cleanupExpiredTokens = async () => {
  try {
    const result = await prisma.refreshToken.deleteMany({
      where: {
        OR: [
          { expiresAt: { lt: new Date() } },
          { revoked: true, updatedAt: { lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } }
        ]
      }
    });
    console.log(`Cleaned up ${result.count} expired/revoked refresh tokens`);
  } catch (error) {
    console.error('Token cleanup error:', error);
  }
};

const createTokens = async (user: { id: string }) => {
  await cleanupExpiredTokens();

  const accessToken = sign(
    { userId: user.id },
    Buffer.from(process.env.JWT_PRIVATE_KEY!, 'base64').toString('ascii'),
    { algorithm: 'RS256', expiresIn: '15m' }
  );

  const refreshTokenValue = randomBytes(32).toString('hex');

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  const refreshToken = await prisma.refreshToken.create({
    data: {
      userId: user.id,
      hashedToken: bcrypt.hashSync(refreshTokenValue, 10),
      expiresAt: expiresAt,
    },
  });

  return { 
    accessToken, 
    refreshTokenId: refreshToken.id,
    refreshTokenValue
  };
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
        const { accessToken, refreshTokenId, refreshTokenValue } = await createTokens(user);
        
        return {
          ...token,
          accessToken,
          refreshTokenId,
          refreshTokenValue,
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
          where: { 
            id: token.refreshTokenId as string,
            revoked: false 
          },
        });

        if (!storedRefreshToken || storedRefreshToken.expiresAt < new Date()) {
          console.log('Refresh token not found or expired');
          return {
            ...token,
            accessToken: undefined,
            refreshTokenId: undefined,
            refreshTokenValue: undefined,
            accessTokenExp: undefined,
          };
        }

        // Validate the refresh token value
        const isValidRefreshToken = await bcrypt.compare(
          token.refreshTokenValue as string, 
          storedRefreshToken.hashedToken
        );

        if (!isValidRefreshToken) {
          console.log('Invalid refresh token');
          return {
            ...token,
            accessToken: undefined,
            refreshTokenId: undefined,
            refreshTokenValue: undefined,
            accessTokenExp: undefined,
          };
        }
        
        await prisma.refreshToken.update({
          where: { id: storedRefreshToken.id },
          data: { revoked: true },
        });

        const { accessToken, refreshTokenId, refreshTokenValue } = await createTokens({ 
          id: token.userId as string 
        });
        
        return {
          ...token,
          accessToken,
          refreshTokenId,
          refreshTokenValue,
          accessTokenExp: Math.floor(Date.now() / 1000) + (15 * 60),
        };

      } catch (refreshError) {
        console.error('Token refresh error:', refreshError);
        return {
          ...token,
          accessToken: undefined,
          refreshTokenId: undefined,
          refreshTokenValue: undefined,
          accessTokenExp: undefined,
        };
      }
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.userId as string;
        //session.accessToken = token.accessToken as string;
        //session.refreshTokenId = token.refreshTokenId as string;
      }
      return session;
    },
  },
  events: {
    async signOut({ session, token }) {
      if (token?.userId) {
        await prisma.refreshToken.updateMany({
          where: { 
            userId: token.userId as string,
            revoked: false 
          },
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