import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import { verifyPassword } from '../../../lib/auth';
import { connectToDatabase } from '../../../lib/db';

export default NextAuth({
  session: {
    jwt: true,
  },
  providers: [
    CredentialsProvider({
      authorize: async (credentials) => {
        const client = await connectToDatabase();

        const db = client.db('auth-site');
    
        const user = await db.collection('users').findOne({ email: credentials.email });
        if (!user) {
          client.close();
          throw new Error('No user found!');
        }

        const isValid = await verifyPassword(
          credentials.password,
          user.password
        );
        
        if (!isValid) {
          client.close();
          throw new Error('Could not log you in!');
        }
        client.close();
        return { email: user.email };

      }
    }),
  ],
});