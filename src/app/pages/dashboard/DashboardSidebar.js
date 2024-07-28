import React, { useState } from 'react';
import { FaHome, FaPlus, FaBox, FaTags, FaClipboardList, FaUser, FaStream, FaTicketAlt } from 'react-icons/fa'; // Import icons
import withAdminAuth from '../Admin/withAdminAuth';
import { useRouter } from 'next/navigation';

const DashboardSidebar = ({ onItemClick, onLogout }) => {
    const [expanded, setExpanded] = useState(false);
    const [activePage, setActivePage] = useState('overview');
    const router = useRouter();

    const handleItemClick = (page) => {
        setActivePage(page);
        onItemClick(page);
    };

    const toggleSidebar = () => {
        setExpanded(!expanded);
    };

    const getButtonClasses = (page) => (
        `btn btn-block w-full mb-2 transition-all duration-300 ease-in-out ${
        activePage === page ? 'bg-[#02457A] text-white' : 'bg-[#ffffff] text-black hover:bg-[#e2e8f0]'
        }`
    );

    const handleLogout = () => {
        if (typeof onLogout === 'function') {
            onLogout(); // Call the logout function passed from parent component
        } else {
            console.error('Logout function not provided');
        }
    };

    return (
        <div
            className={`p-4 fixed top-0 left-0 ${expanded ? 'w-54' : 'w-20'} h-screen z-50 bg-gray-800 shadow-lg transition-all duration-300`}
            onMouseEnter={() => setExpanded(true)}
            onMouseLeave={() => setExpanded(false)}
        >
            <ul>
                <li>
                    <button
                        className={getButtonClasses('overview')}
                        onClick={() => handleItemClick('overview')}
                    >
                        {expanded ? <><FaHome className="inline-block mr-2 text-lg" /> Overview</> : <FaHome className="mx-auto text-lg" />}
                    </button>
                </li>
                <li>
                    <button
                        className={getButtonClasses('inputProductForm')}
                        onClick={() => handleItemClick('inputProductForm')}
                    >
                        {expanded ? <><FaPlus className="inline-block mr-2 text-lg" /> Add Product</> : <FaPlus className="mx-auto text-lg" />}
                    </button>
                </li>
                <li>
                    <button
                        className={getButtonClasses('products')}
                        onClick={() => handleItemClick('products')}
                    >
                        {expanded ? <><FaBox className="inline-block mr-2 text-lg" /> Products</> : <FaBox className="mx-auto text-lg" />}
                    </button>
                </li>
                <li>
                    <button
                        className={getButtonClasses('category')}
                        onClick={() => handleItemClick('category')}
                    >
                        {expanded ? <><FaTags className="inline-block mr-2 text-lg" /> Categories</> : <FaTags className="mx-auto text-lg" />}
                    </button>
                </li>
                <li>
                    <button
                        className={getButtonClasses('subcategory')}
                        onClick={() => handleItemClick('subcategory')}
                    >
                        {expanded ? <><FaStream className="inline-block mr-2 text-lg" /> Sub Category</> : <FaStream className="mx-auto text-lg" />}
                    </button>
                </li>
                <li>
                    <button
                        className={getButtonClasses('orders')}
                        onClick={() => handleItemClick('orders')}
                    >
                        {expanded ? <><FaClipboardList className="inline-block mr-2 text-lg" /> Orders</> : <FaClipboardList className="mx-auto text-lg" />}
                    </button>
                </li>
                <li>
                    <button
                        className={getButtonClasses('coupons')}
                        onClick={() => handleItemClick('coupons')}
                    >
                        {expanded ? <><FaTicketAlt className="inline-block mr-2 text-lg" /> Coupon</> : <FaTicketAlt className="mx-auto text-lg" />}
                    </button>
                </li>
                <li>
                    <button
                        className="btn btn-block w-full mb-2 bg-red-600 text-white hover:bg-red-700"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </li>
            </ul>
        </div>
    );
};

export default withAdminAuth(DashboardSidebar);
