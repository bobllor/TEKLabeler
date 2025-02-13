export default function ToggleTheme( {darkTheme, setDarkTheme} ){
    const handleThemeClick = () => {
        setDarkTheme(!darkTheme);
    }

    return (
        <>
            <div className={`w-11 h-[24px] p-0.5 rounded-[30px] bg-gray-400 text-black flex items-center relative group`}
             onClick={handleThemeClick}>
                <div className={`w-[20px] h-[20px] rounded-[50px] absolute bg-white
                transition-all duration-300 ${darkTheme && 'group-only:translate-x-full'}`}>
                    
                </div>
            </div>
        </>
    )
}