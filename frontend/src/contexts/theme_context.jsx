import { createContext, useContext, useState, React, useEffect, useMemo } from 'react';
const ThemeContext = createContext()
export const ThemeProvider = ({children}) => {
    const [theme, setTheme] = useState(() => {
        const stored = localStorage.getItem("theme")
        if(stored)
            return stored
        return "light"
    })
    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => (prev === "light" ? "dark" : "light"));
    };
    const themeContextVal = useMemo(() => ({
        theme,
        toggleTheme
    }),[theme, toggleTheme])
    return (
        <ThemeContext.Provider value={themeContextVal}>
            {children}
        </ThemeContext.Provider>
    )
}
export const useTheme = () => useContext(ThemeContext);