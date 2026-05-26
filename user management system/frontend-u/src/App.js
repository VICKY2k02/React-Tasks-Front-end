import React, { useEffect, useState } from "react";
import API from "./api";
import UserForm from "./components/UserForm"
import UserList from "./components/UserList"
import "./style.css";

function App() {

  const [users, setUsers] = useState([]);

  const [editingUser, setEditingUser] = useState(null);

  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");

  const [message, setMessage] = useState("");



  // -----------------------------
  // Fetch Users
  // -----------------------------
  const fetchUsers = async () => {

    try {

      setLoading(true);

      const response = await API.get(`/users?search=${search}`);

      setUsers(response.data);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
    }
  };



  useEffect(() => {
    fetchUsers();
  }, [search]);

  const showMessage = (text) => {

  setMessage(text);

  setTimeout(() => {
    setMessage("");
  }, 3000);
};

  // -----------------------------
  // Add User
  // -----------------------------
  const addUser = async (userData) => {

    try {

      const response = await API.post("/users", userData);

      showMessage(response.data.message);

      fetchUsers();

    } catch (error) {

      showMessage(error.response.data.error);
    }
  };



  // -----------------------------
  // Update User
  // -----------------------------
  const updateUser = async (id, userData) => {

    try {

      const response = await API.put(`/users/${id}`, userData);

      showMessage(response.data.message);

      setEditingUser(null);

      fetchUsers();

    } catch (error) {

      console.log(error);
    }
  };



  // -----------------------------
  // Delete User
  // -----------------------------
  const deleteUser = async (id) => {

    try {

      const response = await API.delete(`/users/${id}`);

      showMessage(response.data.message);

      fetchUsers();

    } catch (error) {

      console.log(error);
    }
  };



  return (
    <div className="container">

      <h1>User Management System</h1>

      {/* Success/Error Message */}
      {
        message && (
          <div className="message-box">
            {message}
          </div>
        )
      }

      <input
        type="text"
        placeholder="Search users..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />

      <UserForm
        addUser={addUser}
        editingUser={editingUser}
        updateUser={updateUser}
      />

      {
        loading
          ? <p>Loading...</p>
          : (
              <UserList
                users={users}
                deleteUser={deleteUser}
                setEditingUser={setEditingUser}
              />
            )
      }

    </div>
  );
}

export default App;
