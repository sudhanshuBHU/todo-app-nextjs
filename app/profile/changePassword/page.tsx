"use client";

import React, { useEffect, useState } from 'react';
import { url } from '../../url';
import { useRouter } from 'next/navigation';

const ChangePassword: React.FC = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
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
        setError('');
        setSuccess('');

        if (newPassword !== confirmPassword) {
            setError('New passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const email = localStorage.getItem('email');
            await fetch(`${url}/api/changepassword`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    email,
                    currentPassword,
                    newPassword
                })
            });
            setNewPassword('');
            setConfirmPassword('');
            setCurrentPassword('');
        } catch (error) {
            console.log(error);
            setError('An error occurred. Please try again.');
            setLoading(false);
            return;
        } finally {
            setLoading(false);
        }
        setSuccess('Password changed successfully');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Change Password</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="currentPassword" className="block text-gray-700 font-medium mb-2">Current Password</label>
                        <input
                            type="password"
                            id="currentPassword"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="newPassword" className="block text-gray-700 font-medium mb-2">New Password</label>
                        <input
                            type="password"
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2">Confirm New Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                    {success && <p className="text-green-500 text-sm mb-4">{success}</p>}
                    <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600" disabled={loading}>
                        {loading ? "Changing..." : "Change Password"}
                    </button>
                    {/* <Link href={'/profile'}> */}
                        <button onClick={()=>{
                            router.push('/profile');
                        }} type="submit" className="mt-5 w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">Goto Profile</button>
                    {/* </Link> */}
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;