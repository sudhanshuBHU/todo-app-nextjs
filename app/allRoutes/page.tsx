"use client";

import React, { useEffect, useState } from 'react';
import { url } from '../url';
import { useRouter } from 'next/navigation';

interface Route {
    name: string;
    path: string;
    type: string;
}

const ListOfRoutes: React.FC = () => {
    const [routes, setRoutes] = useState<Route[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchRoutes = async () => {
            try {
                const response = await fetch(`${url}/api/allRoutes`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                // const res = data?.routes as { routes: Route[] };
                // console.log(data.routes);
                setRoutes(data?.routes);
            } catch (err) {
                console.error(err);
                setError('Failed to fetch routes');
            } finally {
                setLoading(false);
            }
        };

        fetchRoutes();
    }, []);

    return (
        <div className="mt-4 p-4">
            <div className='text-2xl font-bold mb-4 flex justify-between'>
                <h1 className="">List of Routes</h1>

                {/* <Link href={'/'}> */}
                    <button onClick={()=>{
                        router.push('/');
                    }} className='px-4 py-2 bg-green-500 text-white rounded'>Home</button>
                {/* </Link> */}
            </div>
            {loading ? (
                <div className="text-center">Loading...</div>
            ) : error ? (
                <div className="text-red-500">{error}</div>
            ) : (
                <ul className="list-disc pl-5">
                    {routes && routes.map((route, id) => (
                        <li key={id} className="mb-2 border-b">
                            <strong className="font-semibold">{route.name} <span className="text-sm text-red-500">({route.type})</span> </strong>: <span className='text-green-800'>{route.path} </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ListOfRoutes;