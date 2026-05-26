function UserCard({
  user,
  deleteUser,
  editUser
}) {

  return (
    <div className="card">

      <h2>{user.name}</h2>
      
      <p>
        <strong>Name:</strong> {user.name}
      </p>

      <p>
        <strong>Role:</strong> {user.role}
      </p>

      <p>
        <strong>Email:</strong> {user.email}
      </p>


      <div className="buttons">

        <button
          className="edit"
          onClick={() => editUser(user)}
        >
          Edit
        </button>

        <button
          className="delete"
          onClick={() => deleteUser(user.id)}
        >
          Delete
        </button>

      </div>

    </div>
  );
}

export default UserCard;