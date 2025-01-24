
// export default CheckContributions;
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

function CheckContributions() {
  const { search } = useLocation(); // Get query params from URL
  const query = new URLSearchParams(search);

  const username = query.get('username');
  const token = query.get('token');
  console.log('Parsed Query Params:', { username, token });

  const [status, setStatus] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!username || !token) {
      // Redirect to the home page if params are missing
      navigate('/');
    }
  }, [username, token, navigate]);

  const handleCheck = async () => {
    try {
      const response = await axios.post('http://localhost:5000/contributions/check', {
        username,
        accessToken: token, // Use the token from query params
      });

      setStatus(response.data.hasContributed ? 'Contributed' : 'No Contribution Today');
    } catch (error) {
      console.error('Error checking contributions:', error);
      setStatus('Error checking contributions');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="bg-white p-6 shadow-md rounded-md text-center w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Check Daily Contribution</h1>
        <p className="text-lg text-gray-600 mb-6">Username: <span className="text-gray-900 font-semibold">{username}</span></p>
        <button
          onClick={handleCheck}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition duration-300"
        >
          Check Contribution
        </button>
        {status && (
          <p
            className={`mt-4 text-lg font-semibold ${
              status === 'Contributed' ? 'text-green-500' : 'text-red-500'
            }`}
          >
            Status: {status}
          </p>
        )}
      </div>
    </div>
  );
}

export default CheckContributions;
