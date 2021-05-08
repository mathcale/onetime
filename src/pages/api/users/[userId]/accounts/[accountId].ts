import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';
import { ObjectId } from 'mongodb';

import { connectToDatabase } from '../../../../../utils/mongodb';

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void | never> => {
  const session = await getSession({ req });

  if (!session) {
    res.status(401).json({ message: 'Unauthorized!' });
  }

  const {
    query: { userId, accountId },
  } = req;

  // @ts-ignore
  if (session.user.id !== userId) {
    res.status(401).json({ message: 'Unauthorized!' });
  }

  const { db } = await connectToDatabase();

  if (req.method === 'GET') {
    const accounts = await db.collection('keys').find({ _id: accountId, userId }).toArray();

    res.status(200).json(accounts);
  } else if (req.method === 'DELETE') {
    const account = await db.collection('keys').findOne({ _id: ObjectId(accountId) });

    if (!account) {
      res.status(404).json({
        message: 'Account not found!',
        code: 'ACCOUNT_NOT_FOUND',
      });

      return;
    }

    await db.collection('keys').deleteOne({ _id: ObjectId(accountId) });

    res.status(200).json({ message: 'Account successfully deleted!' });
  }
};
