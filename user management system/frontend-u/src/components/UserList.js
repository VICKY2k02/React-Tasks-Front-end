import React from "react";
import UserCard from "./UserCard";

function UserList({ users, deleteUser, setEditingUser }) {

  return (
    <div className="user-list">

      {
        users.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            deleteUser={deleteUser}
            setEditingUser={setEditingUser}
          />
        ))
      }

    </div>
  );
}

export default UserList;