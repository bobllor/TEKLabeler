import { useEffect } from "react";
import { createContext, useContext, useState } from "react";

const ThemeContext = createContext();

export const useThemeContext = () => useContext(ThemeContext);

export const ThemeProvider = ({children}) => {
    const [darkTheme, setDarkTheme] = useState(false);

    // grab theme on load.
    useEffect(() => {
        const theme = localStorage.getItem('themeType');
        
        if(theme === null){
            setDarkTheme(false);
            localStorage.setItem('themeType', false);
        }else{
            localStorage.setItem('themeType', theme);
        }
    }, [darkTheme])

    const value = { darkTheme, setDarkTheme };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    )
}