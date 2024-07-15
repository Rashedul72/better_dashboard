import React, { useState } from 'react';

const AddUser = ({ addUser }) => {
  const [user, setUser] = useState({
    name: '',
    password: '',
    phone: '',
    email: '',
    address: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addUser(user);
    setUser({ name: '', password: '', phone: '', email: '', address: '' });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Add User</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={user.name}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            name="password"
            value={user.password}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Phone</label>
          <input
            type="text"
            name="phone"
            value={user.phone}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Address</label>
          <input
            type="text"
            name="address"
            value={user.address}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Add User</button>
      </form>
    </div>
  );
};

export default AddUser;
