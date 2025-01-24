import React, { useState } from 'react';
import axios from 'axios';

export default function SetReminder({ username, email }) {
  const [targetDate, setTargetDate] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async () => {
    try {
      await axios.post('http://localhost:5000/reminder/set-reminder', {
        username,
        email,
        targetDate,
      });
      setSuccessMessage('Reminder and email notification set successfully!');
      setErrorMessage('');
    } catch (err) {
      setSuccessMessage('');
      setErrorMessage('Failed to set reminder. Please try again.');
      console.error('Error setting reminder:', err);
    }
  };
  return (
    <div>
      <h2 className="text-2xl font-bold">Set Reminder</h2>
      <div className="my-4">
        <label htmlFor="targetDate" className="block text-lg mb-2">
          Select a target date for the reminder:
        </label>
        <input
          type="date"
          id="targetDate"
          value={targetDate}
          onChange={(e) => setTargetDate(e.target.value)}
          className="w-full p-2 border rounded-md"
        />
      </div>
      <button
        onClick={handleSubmit}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
      >
        Set Reminder
      </button>
      {successMessage && <p className="mt-4 text-green-500">{successMessage}</p>}
      {errorMessage && <p className="mt-4 text-red-500">{errorMessage}</p>}
    </div>
  );
}
