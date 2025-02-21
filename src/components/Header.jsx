import SelectInput from "./HeaderComponents/SelectInput"
import SettingsCog from "../svgs/SettingsCog"
import ToggleTheme from "./HeaderComponents/ToggleTheme"
import Search from "./HeaderComponents/Search"
import NavGroup from "./HeaderComponents/NavGroup"

export default function Header({fileData, setLoading, theme, utils}){
    return (
        <>
            <div className={`w-full max-h-42 min-h-42 p-3 flex flex-col text-white 
                ${!theme.darkTheme ? 'border-b-1 border-b-gray-400 shadow-[0_1px_3px_0_rgba(0,0,0,.15)]' : 
                'border-b-1 border-[rgb(112,111,111)]'}`}>
                <div className="h-100 w-full flex justify-center pt-5">
                    <Search file={fileData.file} setLoading={setLoading} />
                </div>
                <div className="w-full h-10 border-2 text-black flex justify-center items-center gap-4">
                    <NavGroup setLoading={setLoading} />
                </div>
                <div className="flex relative">
                    <div className="left-0">
                        <SelectInput file={fileData.file} fileInputRef={fileData.fileInputRef} onFileChange={utils.handleChange} />
                    </div>
                    <div className="flex right-0 absolute justify-center items-center gap-3">
                        <div onClick={utils.handleSettingsClick} className="h-7 w-7 hover:bg-gray-600/40 rounded-[9px] flex justify-center items-center">
                            <SettingsCog color={!theme.darkTheme ? 'black' : 'white'}/>
                        </div>
                        <div>
                            <ToggleTheme darkTheme={theme.darkTheme} setDarkTheme={theme.setDarkTheme} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}