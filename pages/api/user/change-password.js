import { getSession } from "next-auth/react";
import { hashPassword, verifyPassword } from "../../../lib/auth";
import { connectToDatabase } from "../../../lib/db";

async function handler(req, res) {
  if (req.method !== 'PATCH') {
    return;
  }

  const session = await getSession({ req: req });

  if (!session) {
    res.status(401).json({ message: 'Not authenticated!' })
    return;
  }

  const userEmail = session.user.email;
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;
  const client = await connectToDatabase();

  const db = client.db('auth-site');

  const user = await db.collection('users').findOne({ email: userEmail });

  if (!user) {
    res.status(404).json({ message: 'User not found.' });
    client.close();
    return;
  }

  const currentPassword = user.password;
  console.log(user)

  const passwordAreEqual = await verifyPassword(oldPassword, currentPassword);
  if (!passwordAreEqual) {
    res.status(403).json({ message: 'Invalid Password.' });
    client.close();
    return;
  }

  const hashedPassword = await hashPassword(newPassword);
  const result = await db.collection('users').updateOne({ email: userEmail }, { $set: { password: hashedPassword } });
  client.close();
  res.status(200).json({ message: 'Password updated!' });
}

export default handler;