import React from 'react';

const UserTable = ({ users }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">User List</h2>
      <table className="table-auto w-full border-collapse border border-gray-200">
        <thead>
          <tr>
            <th className="p-3 font-semibold uppercase bg-gray-100 border border-gray-200">Name</th>
            <th className="p-3 font-semibold uppercase bg-gray-100 border border-gray-200">Phone</th>
            <th className="p-3 font-semibold uppercase bg-gray-100 border border-gray-200">Email</th>
            <th className="p-3 font-semibold uppercase bg-gray-100 border border-gray-200">Address</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index} className="border-t border-gray-200">
              <td className="p-3 border border-gray-200">{user.name}</td>
              <td className="p-3 border border-gray-200">{user.phone}</td>
              <td className="p-3 border border-gray-200">{user.email}</td>
              <td className="p-3 border border-gray-200">{user.address}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
