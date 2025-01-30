import React from 'react';

const BlockedPage: React.FC = () => {
    return (
        <div className="p-6 bg-gray-100 min-h-screen flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold mb-4">Access Blocked</h1>
            <p className="text-lg text-gray-700">You have exceeded the request limit of 10 per second.</p>
            <p className="text-lg text-gray-700">Please wait for 10 seconds and try again.</p>
        </div>
    );
};

export default BlockedPage;
