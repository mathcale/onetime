import { useContext } from 'react';
import NotyfContext from '../../context/NotyfContext';

interface AccountCardProps {
  accountName: string;
  token: string;
}

export const AccountCard = ({ accountName, token }: AccountCardProps): JSX.Element => {
  const notyf = useContext(NotyfContext);

  const copy = async (token: string): Promise<void> => {
    await navigator.clipboard.writeText(token);
    notyf.success('Token copied to clipboard!');
  };

  return (
    <div className="flex items-center p-4 pb-8 bg-white rounded-lg shadow-xs dark:bg-gray-800 shadow">
      <div className="relative w-full">
        <p className="mb-2 text-sm font-medium text-gray-400 dark:text-gray-400">{accountName}</p>
        <p className="text-3xl font-semibold text-gray-700 dark:text-gray-200">{token}</p>

        <div className="absolute w-full flex items-center justify-center mt-2">
          <button
            type="button"
            className="border border-gray-400 bg-gray-400 text-white text-sm rounded-full px-4 py-2 mr-2 transition duration-300 ease select-none hover:bg-gray-500 focus:outline-none focus:shadow-outline"
            onClick={() => copy(token)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
              ></path>
            </svg>
          </button>

          <button
            type="button"
            className="border border-red-500 bg-red-500 text-white text-sm rounded-full px-4 py-2 transition duration-500 ease select-none hover:bg-red-600 focus:outline-none focus:shadow-outline"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
