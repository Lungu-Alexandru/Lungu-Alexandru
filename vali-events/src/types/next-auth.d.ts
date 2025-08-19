import NextAuth, { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      role?: 'ADMIN' | 'CLIENT';
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: 'ADMIN' | 'CLIENT';
  }
}

