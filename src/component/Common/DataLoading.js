import React from 'react';

function LoadingPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="flex flex-col items-center space-y-6">
                <div className="h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xl font-semibold text-gray-800">
                    कृपया धैर्य रखें।
                </p>
            </div>
        </div>
    );
}

export default LoadingPage;