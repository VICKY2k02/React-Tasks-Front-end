import { useEffect, useState } from "react";
import axios from "axios";
import UserForm from "./components/EmployeeForm";
import UserCard from "./components/EmployeeCard";
import FilterRole from "./components/Filter";
import SearchBar from './components/SearchBar';


function App() {

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("All");
  const [editingUser, setEditingUser] = useState(null);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const API = "http://127.0.0.1:5000/users";

  // -----------------------------
  // Fetch Users
  // -----------------------------
  const fetchUsers = async () => {

    try {

      setLoading(true);

      const response = await axios.get(API);

      setUsers(response.data);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // -----------------------------
  // Add User
  // -----------------------------
  const addUser = async (userData) => {

    try {

      await axios.post(API, userData);

      setMessage("User Added Successfully");

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

      await axios.delete(`${API}/${id}`);

      setMessage("User Deleted");

      fetchUsers();

    } catch (error) {

      console.log(error);
    }
  };

  // -----------------------------
  // Edit User
  // -----------------------------
  const editUser = (user) => {
    setEditingUser(user);
  };

  // -----------------------------
  // Update User
  // -----------------------------
  const updateUser = async (userData) => {

    try {

      await axios.put(
        `${API}/${editingUser.id}`,
        userData
      );

      setMessage("User Updated");

      setEditingUser(null);

      fetchUsers();

    } catch (error) {

      console.log(error);
    }
  };

  // -----------------------------
  // Filter Users
  // -----------------------------
  const filteredUsers = users.filter((user) => {

    const searchMatch =
      user.name.toLowerCase().includes(search.toLowerCase());

    const roleMatch =
      role === "All" || user.role === role;

    return searchMatch && roleMatch;
  });

  return (
    <div className="container">

      <h1>User Management Dashboard</h1>

      {message && (
        <p className="message">{message}</p>
      )}

      <SearchBar
        search={search}
        setSearch={setSearch}
      />

      <FilterRole
        role={role}
        setRole={setRole}
      />

      <UserForm
        addUser={addUser}
        editingUser={editingUser}
        updateUser={updateUser}
      />

      {
        loading
          ? <h2>Loading...</h2>
          : (
            <div className="grid">

              {
                filteredUsers.map((user) => (
                  <UserCard
                    key={user.id}
                    user={user}
                    deleteUser={deleteUser}
                    editUser={editUser}
                  />
                ))
              }

            </div>
          )
      }

    </div>
  );
}

export default App;