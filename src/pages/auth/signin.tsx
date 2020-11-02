import React from 'react';
import { signIn } from 'next-auth/client';

const SignInPage = (): JSX.Element => {
  const handleLogin = e => {
    e.preventDefault();
    signIn('github', { callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/accounts` });
  };

  return (
    <>
      <div>
        <button type="button" onClick={handleLogin}>
          Sign in with GitHub
        </button>
      </div>
    </>
  );
};

export default SignInPage;
