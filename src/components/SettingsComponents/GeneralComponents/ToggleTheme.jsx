import { useThemeContext } from "../../../context/ThemeContext";

export default function ToggleTheme({style}){
    const {darkTheme, setDarkTheme} = useThemeContext();
    const handleThemeClick = () => {
        setDarkTheme(!darkTheme);
    }

    return (
        <>
            <div className="flex">
                <div className="px-3 w-[50%]">
                    <p className="flex justify-center items-center"><strong>Dark Theme</strong></p>
                </div>
                <div className="bg-white border-1
                    rounded-[5px] w-35 max-h-8 flex items-center justify-between"
                    onClick={handleThemeClick}>
                    <span className={`flex justify-center items-center
                    rounded-l-[4px] w-full ${darkTheme ? "bg-blue-300" : "bg-gray-400"}`}>
                        On
                    </span>
                    <span className={`flex justify-center items-center
                    rounded-r-[4px] w-full ${darkTheme ? "bg-gray-400" : "bg-blue-300"}`}>
                        Off
                </span>
            </div>
            </div>
        </>
    )
}