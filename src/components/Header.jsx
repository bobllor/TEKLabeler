import SelectInput from "./HeaderComponents/SelectInput"
import SettingsCog from "../svgs/SettingsCog"
import Search from "./HeaderComponents/Search"
import NavGroup from "./HeaderComponents/NavGroup"

export default function Header({fileData, setLoading, utils, guide}){
    return (
        <>
            <div className={`w-full max-h-42 min-h-42 p-3 flex flex-col text-white 
                border-b-1 border-b-gray-400 shadow-[0_1px_3px_0_rgba(0,0,0,.15)]`}>
                <div className="h-100 w-full flex justify-center pt-3">
                    <Search file={fileData.file} setLoading={setLoading} showGuide={guide.showGuide} />
                </div>
                <div className="w-full h-10 flex dark-element justify-center items-center gap-7 pb-4">
                    <NavGroup setLoading={setLoading} />
                </div>
                <div className="flex relative">
                    <div className="left-0">
                        <SelectInput file={fileData.file} fileInputRef={fileData.fileInputRef} uploadExcelFile={utils.uploadExcelFile} />
                    </div>
                    <div className="flex right-0 absolute justify-center items-center gap-3">
                        <div className="w-18 h-8 light-background shadow-[0_1px_3px_0_rgba(0,0,0,.15)]
                        flex justify-center items-center rounded-[5px] relative">
                            <button className="dark-element light-hover w-[inherit] h-[inherit] rounded-[5px]"
                            onClick={() => guide.setShowGuide(prev => !prev)}>
                                Guide
                            </button>
                        </div>
                        <div onClick={utils.handleSettingsClick} 
                        className="h-8 w-8 hover:bg-gray-600/40 rounded-[9px] flex justify-center items-center">
                            <SettingsCog />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}