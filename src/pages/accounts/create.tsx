import { useState } from 'react';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getSession, Session } from 'next-auth/client';

import { AccountService } from '../../services';

interface CreateAccountPageProps {
  session: Session;
}

const CreateAccountPage = ({ session }: CreateAccountPageProps): JSX.Element => {
  const [account, setAccount] = useState<string>('');
  const [secret, setSecret] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const saveAccount = async (e: React.MouseEvent): Promise<void | boolean> => {
    e.preventDefault();

    if (account === '' || secret === '') {
      return false;
    }

    setIsLoading(true);

    try {
      //@ts-ignore
      await AccountService.saveAccount(session.user.id, account, secret);
      router.push('/accounts');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>Add new account</h1>
      <Link href="/accounts">Go back</Link>

      <div>
        <form>
          <input
            type="text"
            onChange={e => setAccount(e.target.value)}
            placeholder="Account name"
            disabled={isLoading}
            required
          />

          <input
            type="text"
            onChange={e => setSecret(e.target.value)}
            placeholder="Secret"
            disabled={isLoading}
            required
          />

          <button type="button" onClick={saveAccount} disabled={isLoading}>
            Create
          </button>
        </form>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  const session = await getSession(context);

  return {
    props: {
      session,
    },
  };
};

export default CreateAccountPage;
