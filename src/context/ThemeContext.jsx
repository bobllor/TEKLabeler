import { useEffect } from "react";
import { createContext, useContext, useState } from "react";

const ThemeContext = createContext();

export const useThemeContext = () => useContext(ThemeContext);

export const ThemeProvider = ({children}) => {
    const [darkTheme, setDarkTheme] = useState(null);

    useEffect(() => {
        setTimeout(() => {
          window.pywebview.api.on_load().then(res => {
            if(res.theme === false){
                setDarkTheme(false);
            }else{
                setDarkTheme(true);
            }
          })
        }, 500)
    }, [])

    useEffect(() => {
        if(darkTheme != null){
            window.pywebview.api.set_theme(darkTheme);
        }
    }, [darkTheme])

    const value = { darkTheme, setDarkTheme };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    )
}