import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(() => {

    const savedUser =
      localStorage.getItem("user");

    return savedUser
      ? JSON.parse(savedUser)
      : null;
  });

  useEffect(() => {

    const savedUser =
      localStorage.getItem("user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

  }, []);

  const login = (userData) => {

    setUser(userData);

    localStorage.setItem(
      "user",
      JSON.stringify(userData)
    );
  };


const logout = async () => {
  const email = localStorage.getItem("email");

  await axios.post(
    "http://127.0.0.1:8000/logout",
    { email }
  );

  setUser(null);
  localStorage.clear();
};

  return (

    <AuthContext.Provider
      value={{
        user,
        login,
        logout
      }}
    >

      {children}

    </AuthContext.Provider>

  );
};