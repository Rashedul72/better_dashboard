import React, { useState } from 'react';
import AddUser from './AddUser';
import UserTable from './UserTable';

const User = () => {
  const [users, setUsers] = useState([]);

  const addUser = (newUser) => {
    setUsers([...users, newUser]);
  };

  return (
    <div>
      <AddUser addUser={addUser} />
      <UserTable users={users} />
    </div>
  );
};

export default User;
