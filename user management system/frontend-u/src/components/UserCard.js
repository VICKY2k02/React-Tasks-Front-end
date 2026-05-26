import React from "react";

function UserCard({ user, deleteUser, setEditingUser }) {

  return (
    <div className="card">


      <h2><strong>{user.name}</strong></h2>

      <p><b>Email:</b> {user.email}</p>

      <p><b>Role:</b> {user.role}</p>

      <p><b>Company:</b> {user.company}</p>

      <p><b>Website:</b> {user.website}</p>

      <p><b>Bio:</b> {user.bio}</p>

      <div className="buttons">

        <button className="btn" onClick={() => setEditingUser(user)}>
          Edit
        </button>

        <button className="btn" onClick={() => deleteUser(user.id)}>
          Delete
        </button>

      </div>

    </div>
  );
}

export default UserCard;