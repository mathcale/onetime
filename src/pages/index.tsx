import Link from 'next/link';
import { useSession, signOut } from 'next-auth/client';

const IndexPage = (): JSX.Element => {
  const [session] = useSession();

  const handleLogout = e => {
    e.preventDefault();
    signOut();
  };

  return (
    <div>
      <p>Index</p>

      {session ? (
        <Link href="/accounts">My Accounts</Link>
      ) : (
        <Link href="/auth/signin">Sign In</Link>
      )}
    </div>
  );
};

export default IndexPage;
