"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { url } from '../url';
import { useRouter } from 'next/navigation';

interface Todo {
    _id: string;
    title: string;
    description: string;
    completed: boolean;
}

const ProfileDashboard = () => {
    const [name, setName] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const [count, setCount] = useState('');
    const [countDone, setCountDone] = useState('');
    const [countUndone, setCountUndone] = useState('');
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setName(localStorage.getItem('name'));
            setEmail(localStorage.getItem('email'));
            const token = localStorage.getItem('token');
            let user = localStorage.getItem('user') as string;
            user = user.slice(1, -1);
            if (!token || !user) {
                router.push('/');
                return;
            }
            fetch(`${url}/api/todos/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'user': user
                }
            })
                .then(response => response.json())
                .then(data => {
                    const temp: Todo[] = [];
                    (data?.todos as Todo[]).forEach((todo) => {
                        temp.push(todo);
                    });
                    setCount(temp.length.toString());
                    let c = 0;
                    temp.forEach(todo => {
                        if (todo.completed) {
                            c++;
                        }
                    });
                    setCountDone(c.toString());
                    setCountUndone((temp.length - c).toString());
                })
                .catch(error => {
                    console.error('Error fetching todos:', error);
                });
        }
    }, [router]);

    return (
        <div className="p-5 font-sans flex flex-col items-center">
            <div>
                <h1 className="text-4xl font-bold text-gray-800">Profile Dashboard</h1>
            </div>
            <div className="mb-5 mt-8 text-gray-700 text-2xl">
                <p className=''>Name: <span className='text-slate-800 font-bold'>{name || 'Loading...'}</span></p>
                <p className=''>Email: <span className='text-blue-600'>{email || 'Loading...'}</span></p>
            </div>
            <div className='mt-6 mb-6 flex flex-col items-center'>
                <h2 className="text-3xl text-gray-600">Activity</h2>
                <p>Total Tasks: <span className='text-3xl text-blue-700'>{count ? count : '...'}</span></p>
                <div className='flex gap-6'>
                    <p>Undone task: <span className='text-red-600 text-3xl'>{countUndone ? countUndone : "..."}</span></p> <p> Done task: <span className='text-green-600 text-3xl'>{countDone ? countDone : '...'}</span></p>
                </div>
            </div>
            <div className="mt-6 flex flex-col items-center mb-6">
                <h2 className="text-2xl text-gray-600">Account Settings</h2>
                <div className='flex mt-2'>
                    {/* <Link href={'/profile/changePassword'}> */}
                        <button onClick={()=>{
                            router.push('/profile/changePassword');
                        }} className="mr-2 px-4 py-2 bg-blue-500 text-white rounded">Change Password</button>
                    {/* </Link> */}
                    {/* <Link href={'/profile/changeEmail'}> */}
                        <button onClick={()=>{
                            router.push('/profile/changeEmail');
                        }} className="mr-2 px-4 py-2 bg-green-500 text-white rounded">Update Email</button>
                    {/* </Link> */}
                    {/* <Link href={'/'}> */}
                        <button
                            onClick={() => {
                                localStorage.removeItem('user');
                                localStorage.removeItem('token');
                                localStorage.removeItem('name');
                                localStorage.removeItem('email');
                                router.push('/');
                            }}
                            className="px-4 py-2 bg-red-500 text-white rounded"
                        >
                            Logout
                        </button>
                    {/* </Link> */}
                </div>
            </div>
            <div className='mt-8'>
                <Link href={'/todo'}
                    className='px-4 py-2 bg-orange-500 text-white rounded'>
                    Go Home
                </Link>
            </div>
        </div>
    );
};

export default ProfileDashboard;