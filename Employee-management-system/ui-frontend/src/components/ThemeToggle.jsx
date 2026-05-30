import { FaSun, FaMoon } from "react-icons/fa";
import { useEffect, useState } from "react";

function ThemeToggle() {

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {

    if (darkMode) {

      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");

    } else {

      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");

    }

  }, [darkMode]);

  return (
    <button
      className="btn"
      onClick={() => setDarkMode(!darkMode)}
    >
     {darkMode ? <FaSun /> : <FaMoon />}
    </button>
  );
}

export default ThemeToggle;