import React from 'react';
import { Outlet } from 'react-router-dom';
import ShopHeader from './ShopHeader';

export default function ShopLayout() {
    return (
        <div className="min-h-screen bg-[#FAF8FF] font-inter text-[#191B23]">
            <ShopHeader />
            <div className="pt-20">
                <Outlet />
            </div>
        </div>
    );
}
