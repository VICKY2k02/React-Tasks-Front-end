import React, { useEffect, useState } from "react";

function UserForm({ addUser, editingUser, updateUser }) {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    bio: "",
    company: "",
    website: ""
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

    if (!formData.name || !formData.email || !formData.role) {
      alert("Please fill required fields");
      return;
    }

    if (editingUser) {

      updateUser(editingUser.id, formData);

    } else {

      addUser(formData);
    }

    setFormData({
      name: "",
      email: "",
      role: "",
      bio: "",
      company: "",
      website: ""
    });
  };

  return (
    <form onSubmit={handleSubmit} className="form">

      <input
        type="text"
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
      />

      <input
        type="text"
        name="role"
        placeholder="Role"
        value={formData.role}
        onChange={handleChange}
      />

      <input
        type="text"
        name="company"
        placeholder="Company"
        value={formData.company}
        onChange={handleChange}
      />

      <input
        type="text"
        name="website"
        placeholder="Website"
        value={formData.website}
        onChange={handleChange}
      />

      <textarea
        name="bio"
        placeholder="Bio"
        value={formData.bio}
        onChange={handleChange}
      />

      <button type="submit">
        {editingUser ? "Update User" : "Add User"}
      </button>

    </form>
  );
}

export default UserForm;