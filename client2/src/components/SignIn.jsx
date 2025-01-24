import React from 'react';

const SignIn = () => {
  const handleGitHubSignIn = () => {
    window.location.href = 'http://localhost:5000/auth/github'; // Your backend GitHub Auth URL
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Welcome to CommitBuddy</h1>
        <p className="text-gray-600 mb-6">Sign in to access your account.</p>
        <button
          onClick={handleGitHubSignIn}
          className="w-full py-2 px-4 bg-black text-white rounded-md flex items-center justify-center hover:bg-gray-800 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 .5C5.649.5.5 5.656.5 12.09c0 5.137 3.438 9.484 8.205 11.02.6.105.82-.261.82-.581v-2.26c-3.335.731-4.043-1.61-4.043-1.61-.546-1.395-1.334-1.768-1.334-1.768-1.09-.75.083-.734.083-.734 1.205.084 1.84 1.243 1.84 1.243 1.069 1.868 2.803 1.328 3.487 1.016.108-.761.419-1.328.761-1.634-2.666-.309-5.468-1.356-5.468-6.029 0-1.337.482-2.434 1.268-3.292-.13-.309-.548-1.548.119-3.223 0 0 1.003-.326 3.283 1.253a11.388 11.388 0 0 1 2.989-.402c1.013.005 2.037.136 2.99.402 2.28-1.578 3.283-1.253 3.283-1.253.667 1.675.249 2.914.12 3.223.786.858 1.268 1.955 1.268 3.292 0 4.688-2.81 5.717-5.487 6.026.43.368.812 1.093.812 2.21v3.281c0 .327.22.693.825.573C20.064 21.571 23.5 17.224 23.5 12.09 23.5 5.656 18.351.5 12 .5z" />
          </svg>
          Sign in with GitHub
        </button>
      </div>
    </div>
  );
};

export default SignIn;

