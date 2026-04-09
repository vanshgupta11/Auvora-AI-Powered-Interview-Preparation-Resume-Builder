import React from 'react';
import { Link } from 'react-router';
import { useAuth } from '../features/auth/hooks/useAuth';

const Header = () => {
    const { handleLogout, user } = useAuth();

    return (
        <header className="bg-black backdrop-blur-md sticky top-0 z-50 border-b border-white/[0.1]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="text-xl font-semibold tracking-tight text-white flex items-center gap-2 group">
                            {/* Simple abstract logo mimicking Vercel's triangle slightly */}
                            <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-white group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300">
                                <path d="M12 2L2 22h20L12 2z"></path>
                            </svg>
                            <span className="group-hover:text-zinc-300 transition-colors">Auvora</span>
                        </Link>
                    </div>
                    <div className="flex items-center gap-6">
                        {user && <span className="text-sm font-medium text-zinc-400">Welcome, {user.username}</span>}
                        <button
                            onClick={handleLogout}
                            className='flex items-center justify-center gap-2 px-3 py-1.5 bg-transparent border border-white/[0.1] text-red-400 rounded-md text-sm font-medium transition-all hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 active:scale-95'
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z" />
                                <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z" />
                            </svg>
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
