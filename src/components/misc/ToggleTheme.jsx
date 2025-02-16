import Sun from '../../svgs/Sun';
import Moon from '../../svgs/Moon'

export default function ToggleTheme( {darkTheme, setDarkTheme} ){
    const handleThemeClick = () => {
        setDarkTheme(!darkTheme);
    }

    const bgStyle = !darkTheme ? "bg-blue-500" : "dark:bg-[#3700B3]";
    const textStyle = !darkTheme ? "text-black" : "text-white";

    return (
        <>
            <div className={`w-11 h-[24px] p-0.5 rounded-[30px] ${bgStyle}
             ${textStyle} flex items-center relative group`}
             onClick={handleThemeClick}>
                <div className={`w-[20px] h-[20px] rounded-[50px] absolute bg-white flex items-center
                transition-all duration-300 translate-x-0 ${darkTheme && 'group-only:translate-x-full'}`}>
                    {!darkTheme ? <Sun fill={'#d6dc00'} color={'black'}/> : <Moon fill={'gray'} color={'black'}/>}
                </div>
            </div>
        </>
    )
}