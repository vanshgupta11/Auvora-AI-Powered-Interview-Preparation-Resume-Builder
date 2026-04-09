import React from 'react';
import { Outlet } from 'react-router';
import Header from './Header';

const MainLayout = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main>
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;
