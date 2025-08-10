import React from 'react';
import { useAuth } from '../context/AuthContext';

const LoginPage: React.FC = () => {
    const { signInWithGoogle, signInWithMicrosoft } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        SyncFlow
                    </h1>
                </div>
            </div>
            
            {/* Login Form */}
            <div className="flex items-center justify-center flex-1 py-8">
                <div className="w-full max-w-sm p-8 space-y-8 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl text-center">
                    <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                        <h1 className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">SyncFlow</h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">Your agile collaboration hub.</p>
                    </div>

                    <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                        <p className="text-sm text-gray-500 dark:text-gray-300">Sign in to continue</p>
                        <button
                            onClick={signInWithGoogle}
                            className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 transition-all duration-200 transform hover:scale-105"
                            aria-label="Sign in with Google"
                        >
                            <svg className="w-5 h-5 mr-3" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <title>Google</title>
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                <path d="M1 1h22v22H1z" fill="none"/>
                            </svg>
                            Sign in with Google
                        </button>
                        <button
                            onClick={signInWithMicrosoft}
                            className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 transition-all duration-200 transform hover:scale-105"
                            aria-label="Sign in with Microsoft"
                        >
                            <svg className="w-5 h-5 mr-3" viewBox="0 0 23 23">
                                <path fill="#F35325" d="M1 1h10v10H1z"></path>
                                <path fill="#81BC06" d="M12 1h10v10H12z"></path>
                                <path fill="#05A6F0" d="M1 12h10v10H1z"></path>
                                <path fill="#FFBA08" d="M12 12h10v10H12z"></path>
                            </svg>
                            Sign in with Microsoft
                        </button>
                    </div>
                </div>
            </div>
            
            <style>{`
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.5s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default LoginPage;
