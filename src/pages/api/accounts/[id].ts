import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';

import { connectToDatabase } from '../../../utils/mongodb';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });

  if (!session) {
    res.status(401).json({ message: 'Unauthorized!' });
  }

  const {
    query: { id },
  } = req;

  // @ts-ignore
  if (session.user.id !== id) {
    res.status(401).json({ message: 'Unauthorized!' });
  }

  const { db } = await connectToDatabase();

  const accounts = await db.collection('keys').find({ userId: id }).toArray();

  res.status(200).json(accounts);
};
