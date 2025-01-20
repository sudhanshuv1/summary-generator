import GitHubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import dbConnect from '@/lib/dbConnect';
import { User } from '../../../../models/User';
import { NextAuthOptions } from 'next-auth';

const homepageUrl = process.env.HOMEPAGE_URL as string;

export const options: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email:',
          type: 'email',
          placeholder: 'abc@email.com',
        },
        password: {
          label: 'Password:',
          type: 'password',
          placeholder: '',
        },
      },
      async authorize(credentials) {
        try {
          if (!credentials) {
            throw new Error('No credentials provided');
          }
          await dbConnect();
          const user = await User.findOne({ email: credentials.email });
          if (!user) {
            throw new Error('No user found with this email');
          }
          const isValidPassword = await bcrypt.compare(credentials.password, user.password);
          if (!isValidPassword) {
            throw new Error('Invalid password');
          }
          return user;
        } catch (error) {
          if (error instanceof Error) {
            throw new Error(error.message);
          } else {
            throw new Error('An unknown error occurred');
          }
        }
      },
    }),
  ],
  debug: true,
  pages: {
    signIn: '/auth/login', 
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url === baseUrl) {
        return homepageUrl;
      }
      return `${baseUrl}/dashboard`;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture; 
      }
      return session;
    },
    async jwt({ token, user, account, profile }) {
      if (account?.provider === 'github' && profile) {
        token.picture = (profile as { avatar_url: string }).avatar_url; 
      }
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};