import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [dark, setDark] = useState(() => localStorage.getItem("theme") === "dark");

  useEffect(() => {
    const html = document.documentElement;
    if (dark) {
      html.classList.add("dark");
      document.body.style.backgroundColor = "#030712";
      document.body.style.color = "#f1f5f9";
      localStorage.setItem("theme", "dark");
    } else {
      html.classList.remove("dark");
      document.body.style.backgroundColor = "";
      document.body.style.color = "";
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <ThemeContext.Provider value={{ dark, toggle: () => setDark((d) => !d) }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
