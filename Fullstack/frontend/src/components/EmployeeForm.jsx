import { useEffect, useState } from "react";

function UserForm({
  addUser,
  editingUser,
  updateUser
}) {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: ""
  });

  useEffect(() => {

    if (editingUser) {
      setFormData(editingUser);
    }

  }, [editingUser]);

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {

    e.preventDefault();

    if (editingUser) {

      updateUser(formData);

    } else {

      addUser(formData);
    }

    setFormData({
      name: "",
      email: "",
      role: "Developer"
    });
  };

  return (

    <form
      className="form"
      onSubmit={handleSubmit}
    >

      <input
        type="text"
        name="name"
        placeholder="Enter Name"
        value={formData.name}
        onChange={handleChange}
        required
      />

      <input
        type="email"
        name="email"
        placeholder="Enter Email"
        value={formData.email}
        onChange={handleChange}
        required
      />

      <select
        name="role"
        value={formData.role}
        onChange={handleChange}
      >

        <option>Developer</option>
        <option>Designer</option>
        <option>Manager</option>

      </select>

      <button type="submit">

        {
          editingUser
            ? "Update User"
            : "Add User"
        }

      </button>

    </form>
  );
}

export default UserForm;