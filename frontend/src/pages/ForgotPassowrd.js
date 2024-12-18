import React, { useState } from 'react';
import SummaryApi from '../common';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(SummaryApi.forgotPassword.url, {
                method: SummaryApi.forgotPassword.method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                setMessage('Password reset link sent to your email.');
            } else {
                const error = await response.json();
                setMessage(error.message || 'An error occurred.');
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('Failed to connect to the server.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white rounded shadow-md">
                <h2 className="text-2xl font-semibold text-center text-gray-700">
                    Forgot Password
                </h2>
                <form onSubmit={handleSubmit} className="mt-6">
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-600"
                    >
                        Email Address
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 mt-2 text-gray-700 bg-gray-100 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Enter your email"
                        required
                    />
                    <button
                        type="submit"
                        className="w-full px-4 py-2 mt-4 font-semibold text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        Send Reset Link
                    </button>
                </form>
                {message && (
                    <p className="mt-4 text-center text-sm text-red-600">
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
