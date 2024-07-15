"use client"
import React, { useState } from 'react';
import axios from 'axios';
import 'tailwindcss/tailwind.css';

const AddAdmin = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const [password, setPassword] = useState('');
    const [role, setRole] = useState('admin');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('https://better-server-blush.vercel.app/addadmin', { name, email, password, role });
            console.log(response.data);
            // Optionally, reset the form or display a success message
        } catch (error) {
            console.error('Error adding user:', error);
            // Optionally, display an error message
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
                <h2 className="text-2xl font-semibold text-center mb-6">Add Admin</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="input input-bordered w-full mt-1"
                        />
                    </div>
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
                    <button type="submit" className="btn btn-primary w-full">Add Admin</button>
                </form>
            </div>
        </div>
    );
};

export default AddAdmin;
