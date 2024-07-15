"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DashboardSidebar from "./DashboardSidebar";
import Products from "./Products/Products";
import DashboardOverview from './DashboardOverview';
import CategoryManagement from './category/CategoryManagement';
import Orders from './order/Orders';
import User from './users/User';
import Subcategory from './category/Subcategory';
import InputProductsForm from './addproduct/InputProductsFrom';
import AddCoupon from './addCoupon/AddCoupon';
import { useRouter } from 'next/navigation';

const Dashboard = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('admin');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [displayComponent, setDisplayComponent] = useState('');
    const router = useRouter();

    useEffect(() => {
        // Check if user is already logged in (token exists in localStorage)
        const token = localStorage.getItem('token');
        if (token) {
            // Set displayComponent to show dashboard if token exists
            setDisplayComponent('overview');
        }
    }, []);

    const handleItemClick = (component) => {
        setDisplayComponent(component);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('https://better-server-blush.vercel.app/login', { email, password, role });

            if (response.data.message === 'Login successful') {
                setSuccessMessage('Login successful');
                setErrorMessage('');
                
                // Store token in localStorage
                localStorage.setItem('token', response.data.token);

                // Set displayComponent to show dashboard
                setDisplayComponent('overview');
            } else {
                setErrorMessage('Invalid email, password, or role');
                setSuccessMessage('');
            }
        } catch (error) {
            console.error('Error logging in:', error);
            setErrorMessage('Failed to log in');
            setSuccessMessage('');
        }
    };

    const handleLogout = () => {
        // Remove token from localStorage on logout
        localStorage.removeItem('token');
        // Optionally reset state or redirect to login page
        setDisplayComponent('');
    };

    return (
        <div>
            {!displayComponent ? (
                <div className="flex justify-center items-center min-h-screen bg-gray-100">
                    <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
                        <h2 className="text-2xl font-semibold text-center mb-6">Admin Login</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="input input-bordered w-full mt-1"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="input input-bordered w-full mt-1"
                                />
                            </div>
                            <div className="mb-6">
                                <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
                                <select
                                    id="role"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    required
                                    className="select select-bordered w-full mt-1"
                                >
                                    <option value="admin">Admin</option>
                                    <option value="employee">Employee</option>
                                </select>
                            </div>
                            {errorMessage && (
                                <div className="mb-4 text-red-500">
                                    {errorMessage}
                                </div>
                            )}
                            {successMessage && (
                                <div className="mb-4 text-green-500">
                                    {successMessage}
                                </div>
                            )}
                            <button type="submit" className="btn btn-primary w-full">Login</button>
                        </form>
                    </div>
                </div>
            ) : (
                <div>
                    {/* Left Sidebar */}
                    <div className="fixed top-0 left-0 h-screen w-54 z-50 bg-white shadow-md">
                        <DashboardSidebar onItemClick={handleItemClick} onLogout={handleLogout} />
                    </div>

                    {/* Right Content */}
                    <div className="flex-1 ml-20 h-screen overflow-y-auto">
                        <div className="mx-8 my-8">
                            {displayComponent === 'overview' && <DashboardOverview />}
                            {displayComponent === 'inputProductForm' && <InputProductsForm />}
                            {displayComponent === 'products' && <Products />}
                            {displayComponent === 'category' && <CategoryManagement />}
                            {displayComponent === 'subcategory' && <Subcategory />}
                            {displayComponent === 'orders' && <Orders />}
                            {displayComponent === 'user' && <User />}
                            {displayComponent === 'coupons' && <AddCoupon />}

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
