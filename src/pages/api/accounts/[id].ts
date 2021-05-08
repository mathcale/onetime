import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';

import type { CreateAccountRequest, Account } from '../../../types';
import { connectToDatabase } from '../../../utils/mongodb';

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
    query: { id },
  } = req;

  // @ts-ignore
  if (session.user.id !== id) {
    res.status(401).json({ message: 'Unauthorized!' });
  }

  const { db } = await connectToDatabase();

  if (req.method === 'GET') {
    const accounts = await db.collection('keys').find({ userId: id }).toArray();

    res.status(200).json(accounts);
  } else if (req.method === 'POST') {
    const body: CreateAccountRequest = req.body;

    if (!isRequestBodyValid(body)) {
      res.status(422).json({ message: 'Invalid request body!' });
      return;
    }

    const accountExists = await db.collection('keys').findOne({ userId: id, secret: body.secret });

    if (accountExists) {
      res.status(409).json({
        message: 'This secret is already linked to an account!',
        code: 'DUPLICATED_SECRET',
      });

      return;
    }

    const newAccount = {
      userId: id,
      account: body.account,
      secret: body.secret,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Account;

    const result = await db.collection('keys').insertOne(newAccount);

    res.status(201).json(result.ops[0]);
  }
};
