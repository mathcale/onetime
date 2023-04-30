import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

import type { CreateAccountRequest, Account } from '../../../../../types';
import { connectToDatabase } from '../../../../../utils/mongodb';

const isRequestBodyValid = (body: CreateAccountRequest): boolean => {
  if (body?.account === '') {
    return false;
  }

  if (body?.secret === '') {
    return false;
  }

  return true;
};

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void | never> => {
  const session = await getSession({ req });

  if (!session) {
    res.status(401).json({ message: 'Unauthorized!' });
  }

  const {
    query: { userId },
  } = req;

  // @ts-ignore
  if (session.user.id !== userId) {
    res.status(401).json({ message: 'Unauthorized!' });
    return;
  }

  const { db } = await connectToDatabase();

  if (req.method === 'GET') {
    const accounts = await db.collection('keys').find({ userId }).toArray();

    res.status(200).json(accounts);
  } else if (req.method === 'POST') {
    const body: CreateAccountRequest = req.body;

    if (!isRequestBodyValid(body)) {
      res.status(422).json({ message: 'Invalid request body!' });
      return;
    }

    const accountExists = await db.collection('keys').findOne({ userId, secret: body.secret });

    if (accountExists) {
      res.status(409).json({
        message: 'This secret is already linked to an account!',
        code: 'DUPLICATED_SECRET',
      });

      return;
    }

    const newAccount = {
      userId,
      account: body.account,
      secret: body.secret,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Account;

    const result = await db.collection('keys').insertOne(newAccount);

    res.status(201).json(result.ops[0]);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }
};
