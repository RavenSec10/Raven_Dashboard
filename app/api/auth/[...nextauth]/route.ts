import NextAuth, { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import prisma from '@/lib/prismadb';
import bcrypt from 'bcryptjs';
import { sign, verify } from 'jsonwebtoken';
import { JWT } from 'next-auth/jwt';

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
    async encode({ token, secret }) {
      if (!token) {
        throw new Error('No token to encode');
      }
      return sign(
        token, 
        Buffer.from(process.env.JWT_PRIVATE_KEY!, 'base64').toString('ascii'), 
        { algorithm: 'RS256' }
      );
    },
    async decode({ token, secret }) {
      if (!token) {
        throw new Error('No token to decode');
      }
      return verify(
        token,
        Buffer.from(process.env.JWT_PUBLIC_KEY!, 'base64').toString('ascii'),
        { algorithms: ['RS256'] }
      ) as JWT;
    },
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
        };
      }
      
      try {
        verify(
          token.accessToken as string,
          Buffer.from(process.env.JWT_PUBLIC_KEY!, 'base64').toString('ascii')
        );
        return token;
      } catch (error) {
        if ((error as any).name !== 'TokenExpiredError') {
            console.error('JWT validation error:', error);
            return { ...token, error: "JsonWebTokenError" };
        }
        
        console.log("Access Token has expired, attempting to refresh...");

        try {
          const storedRefreshToken = await prisma.refreshToken.findUnique({
            where: { id: token.refreshTokenId as string, revoked: false },
          });

          if (!storedRefreshToken) {
             console.log("Refresh token not found or revoked.");
             return { ...token, error: "RefreshAccessTokenError" };
          }
          
          // Check if refresh token has expired
          if (storedRefreshToken.expiresAt < new Date()) {
            console.log("Refresh token has expired.");
            return { ...token, error: "RefreshAccessTokenError" };
          }
          
          // Invalidate the old refresh token (ROTATION)
          await prisma.refreshToken.update({
            where: { id: storedRefreshToken.id },
            data: { revoked: true },
          });

          const { accessToken, refreshTokenId } = await createTokens({ id: token.userId as string });
          
          console.log("Successfully refreshed token.");
          
          return {
            ...token,
            accessToken,
            refreshTokenId,
            error: null,
          };

        } catch (refreshError) {
          console.error("Error refreshing token: ", refreshError);
          return { ...token, error: "RefreshAccessTokenError" };
        }
      }
    },
    async session({ session, token }) {
      // Check if session.user exists before accessing it
      if (token && session.user) {
        session.user.id = token.userId as string;
        if (token.error) {
            session.error = token.error as string;
        }
      }
      return session;
    },
  },
  events: {
    async signOut({ session, token }) {
      // On sign-out, revoke all refresh tokens for the user
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