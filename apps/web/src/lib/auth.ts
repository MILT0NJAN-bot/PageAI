import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { adminRateLimit, getRequestIp, verifyAdminChallenge, verifyAdminPassword } from './adminSecurity';

const secureCookies = process.env.NODE_ENV === 'production';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email:    { label: 'Email',      type: 'email'    },
        password: { label: 'Contrasena', type: 'password' },
        otp:       { label: 'Codigo',     type: 'text'     },
        challenge: { label: 'Challenge', type: 'text'     },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password || !credentials?.otp || !credentials?.challenge) return null;
        if (credentials.email.length > 254 || credentials.password.length > 200 || !/^\d{6}$/.test(credentials.otp)) return null;
        const ip = getRequestIp(req.headers);
        const rate = await adminRateLimit(credentials.email, ip, 'check');
        if (!rate.allowed) return null;
        const passwordValid = await verifyAdminPassword(credentials.email, credentials.password);
        const challengeValid = verifyAdminChallenge(credentials.challenge, credentials.email, credentials.otp);
        if (!passwordValid || !challengeValid) {
          await adminRateLimit(credentials.email, ip, 'failure');
          return null;
        }
        await adminRateLimit(credentials.email, ip, 'success');
        return { id: 'admin', name: 'Administrador', email: credentials.email.trim().toLowerCase() };
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 8 * 60 * 60,
  },
  jwt: { maxAge: 8 * 60 * 60 },
  useSecureCookies: secureCookies,
  cookies: {
    sessionToken: {
      name: secureCookies ? '__Secure-pageai.session-token' : 'pageai.session-token',
      options: { httpOnly: true, sameSite: 'lax', path: '/', secure: secureCookies },
    },
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) { token.id = user.id; token.role = 'admin'; }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) { (session.user as any).id = token.id; (session.user as any).role = token.role; }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      try { return new URL(url).origin === baseUrl ? url : baseUrl; } catch { return baseUrl; }
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
