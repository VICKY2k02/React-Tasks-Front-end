import React, { useEffect, useState } from "react";
import UserCard from "./UserCard";

export default function App() {
  const [userId, setUserId] = useState(1);
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `https://jsonplaceholder.typicode.com/users/${userId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const prevUser = () => {
    if (userId > 1){
      setUserId(userId - 1);
    }
  }

  const nextUser = () => {
    if (userId < 5) {
      setUserId(userId + 1);
    }
  };



  return (
    <div className="app-container">
      <h1>Dynamic User Profile Card</h1>

      <div className="button-group">
        <button onClick={prevUser}>Previous</button>
        <button onClick={nextUser}>Next</button>
      </div>

      {loading && <h2>Loading user data...</h2>}

      {error && <h2>{error}</h2>}

      {!loading && !error && user && <UserCard user={user} />}
    </div>
  );
}




