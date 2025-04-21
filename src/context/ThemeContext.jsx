import { useEffect } from "react";
import { createContext, useContext, useState } from "react";

const ThemeContext = createContext();

export const useThemeContext = () => useContext(ThemeContext);

export const ThemeProvider = ({children}) => {
    const [darkTheme, setDarkTheme] = useState(null);

    // cheap trick to hide the screen while it loads the settings.
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
    
    // 
    useEffect(() => {
        if(darkTheme != null){
            window.pywebview.api.set_theme(darkTheme);
        }

        if(darkTheme === true){
            document.body.classList.toggle('dark');
        }else{
            document.body.classList.remove('dark');
        }
    }, [darkTheme])

    const value = { darkTheme, setDarkTheme };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    )
}