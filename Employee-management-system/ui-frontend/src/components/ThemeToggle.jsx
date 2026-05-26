import { useEffect, useState } from "react";

function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <button className="btn" onClick={() => setDarkMode(!darkMode)}>
      {darkMode ? "Light" : "Dark"}
    </button>
  );
}

export default ThemeToggle;