import { useSettingsContext } from "../context/SettingsContext";
import SettingsCog from "../svgs/SettingsCog";
import X from "../svgs/X";
import { useEffect, useState, useRef, useMemo } from "react";
import CSVForm from "./SettingsComponents/CSVForm";
import General from "./SettingsComponents/General";
import Label from "./SettingsComponents/Label";
import MappingBox from "./SettingsComponents/MappingBox";
import { useColumnFilters } from "./SettingsComponents/useColumnFilters";

export default function Settings({uploadExcelFile}){
    const { setSettings } = useSettingsContext();

    const divRef = useRef();

    const [showMapPage, setShowMapPage] = useState(false);
    const [showCSVForm, setShowCSVForm] = useState(false);

    // focuses on first load and if the new page for the column filters is displayed.
    useEffect(() => {
        if(divRef.current && !showCSVForm){
            divRef.current.focus();
        }
    }, [showCSVForm])

    const buttonStyle = "bg-white border-1 rounded-[5px] w-35 max-h-8 hover:bg-gray-500/30";

    let [columnType, setColumnType] = useState('hardwareID');

    // tab settings and tab contents are found underneath this comment.
    const settingTabsRef = useRef([
        {name: 'General'},
        {name: 'Label'},
    ])

    const [activeTab, setActiveTab] = useState('General')

    const changeActiveTab = (e) => {
        const tabName = e.target.id;

        if(tabName != activeTab){
            setActiveTab(tabName);
        }
    }

    const activeTabContent = useMemo(() => {
        const mapping = {
            'General': <General style={buttonStyle}/>,
            'Label': <Label style={buttonStyle} 
                setShowCSVForm={setShowCSVForm} 
                setColumnType={setColumnType}
                setShowMapPage={setShowMapPage}/>,
        }

        return mapping[activeTab]
    }, [activeTab])

    const handleKeySettings = (e) => {
        if(e.key == 'Escape'){
            if(showCSVForm || showMapPage){
                return;
            }

            setSettings(false);
        }
    }

    const {filterColumns, updateColumnFilter, infoText} = useColumnFilters(columnType, uploadExcelFile);

    return (
        <>
        <div className="w-[inherit] h-[inherit] bg-gray-400/30 absolute outline-0 
        flex justify-center items-center z-999 text-black backdrop-blur-xs" 
        ref={divRef} tabIndex={1} onKeyDown={handleKeySettings}>
            {showCSVForm && <CSVForm setShow={setShowCSVForm} arr={filterColumns}
            updateFunc={updateColumnFilter} infoText={infoText}/>}
            {showMapPage && <MappingBox setShowMapPage={setShowMapPage}/>}
            <div className="animate-scale-in relative w-92 h-98 max-h-98 bg-white flex flex-col items-center rounded-[4px]">
                <div className={`${'bg-test'} w-full min-h-20 max-h-20 rounded-t-[4px]`}></div>
                <div className="absolute">
                    <div className="pt-2 h-10 w-full text-center text-white">
                        <span className="flex flex-row-reverse justify-between relative">
                            <div className="flex gap-1 justify-center items-center w-full absolute pointer-events-none">
                                <SettingsCog />
                                <p className="font-sans"><strong>Settings</strong></p>
                            </div>
                            <div className="hover:bg-gray-400 w-5 h-5 flex justify-center items-center rounded-[4px]" 
                            onClick={() => setSettings(prev => !prev)}>
                                <X />
                            </div>
                        </span>
                    </div>
                    <div className="px-5 flex justify-content">
                        {settingTabsRef.current.map((tab, i) => (
                            <div className={`min-w-25 px-4 pt-1 flex rounded-t-[6px] justify-center items-center text-[17px]
                            ${activeTab === tab.name ? 'bg-white text-blue-800' : 'hover:bg-gray-300/30 text-white'}
                            select-none`} 
                            key={i}
                            onClick={(e) => changeActiveTab(e)}
                            id={tab.name}>
                                {tab.name}
                            </div>
                        ))}
                    </div>
                    <div className={`w-90 h-79 bg-white shadow-[0_10px_8px_1px_rgba(0,0,0,.15)] 
                    rounded-[20px] flex flex-col gap-8 relative 
                    ${activeTab === 'Label' && 'overflow-y-auto hide-scroll'} py-9`}>
                        {activeTabContent}
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}