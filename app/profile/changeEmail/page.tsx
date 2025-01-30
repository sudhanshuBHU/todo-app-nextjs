"use client";

import React, { useEffect, useState } from 'react';
import { url } from '../../url';
import { useRouter } from 'next/navigation';

const ChangeEmail = () => {
    const [email, setEmail] = useState('');
    const [confirmEmail, setConfirmEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const user = localStorage.getItem('user') as string;
            const token = localStorage.getItem('token');
            if (!user || !token) {
                router.push('/');
                return;
            }
        }
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // console.log(email, confirmEmail);
        setLoading(true);

        if (email === confirmEmail) {
            try {
                const currEmail = localStorage.getItem('email');
                const token = localStorage.getItem('token');
                const response = await fetch(`${url}/api/changeemail`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        email: currEmail,
                        newEmail: confirmEmail
                    })
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                setSuccess(true);
                setMessage('Email changed successfully!');
            } catch (error) {
                setSuccess(false);
                console.log(error);
                setMessage('An error occurred. Please try again.');
            } finally {
                setLoading(false);
            }
        } else {
            setSuccess(false);
            setMessage('Emails do not match. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Change Email</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 font-medium mb-2">New Email:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="confirmEmail" className="block text-gray-700 font-medium mb-2">Confirm New Email:</label>
                        <input
                            type="email"
                            id="confirmEmail"
                            value={confirmEmail}
                            onChange={(e) => setConfirmEmail(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                        />
                    </div>
                    <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600" disabled={loading}>{loading ? "Changing..." : "Change Email"}</button>
                </form>
                {/* <Link href={'/profile'}> */}
                    <button onClick={()=>{
                        router.push('/profile');
                    }} type="submit" className="mt-5 w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">Goto Profile</button>
                {/* </Link> */}
                {message && <p className={`mt-4 text-center ${success ? 'text-green-500' : 'text-red-500'}`}>{message}</p>}
            </div>
        </div>
    );
};

export default ChangeEmail;