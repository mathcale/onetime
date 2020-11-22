import React from 'react';
import { signOut } from 'next-auth/client';

export const Navbar = (): JSX.Element => (
  <div className="relative bg-white shadow">
    <header className="px-6 py-2 lg:px-16 lg:py-0 bg-white flex flex-wrap items-center">
      <div className="flex-1 flex justify-between items-center">
        <a href="#">
          <h3 className="text-2xl font-bold">OneTime</h3>
        </a>
      </div>

      <label htmlFor="menu-toggle" className="pointer-cursor lg:hidden block">
        <svg
          className="fill-current text-gray-900"
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 20 20"
        >
          <title>menu</title>
          <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
        </svg>
      </label>

      <input className="hidden" type="checkbox" id="menu-toggle" />

      <div className="hidden lg:flex lg:items-center lg:w-auto w-full" id="menu">
        <nav>
          <ul className="lg:flex items-center justify-between text-base text-gray-700 pt-4 lg:pt-0">
            <li>
              <a
                className="lg:p-4 py-3 px-0 block border-b-2 border-transparent hover:border-indigo-400 cursor-pointer"
                onClick={() => signOut({ callbackUrl: process.env.NEXT_PUBLIC_BASE_URL })}
              >
                Sign Out
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  </div>
);
