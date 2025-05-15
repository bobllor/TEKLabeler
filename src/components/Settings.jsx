import { useSettingsContext } from "../context/SettingsContext";
import SettingsCog from "../svgs/SettingsCog";
import X from "../svgs/X";
import { useEffect, useState, useRef, useMemo } from "react";
import ColumnFilter from "./SettingsComponents/ColumnFilter";
import General from "./SettingsComponents/General";
import Label from "./SettingsComponents/Label";
import Advanced from "./SettingsComponents/Advanced";

export default function Settings({uploadExcelFile}){
    const { setSettings } = useSettingsContext();

    const divRef = useRef();

    const [showColumnPage, setShowColumnPage] = useState(false);

    // focuses on first load and if the new page for the column filters is displayed.
    useEffect(() => {
        if(divRef.current && !showColumnPage){
            divRef.current.focus();
        }
    }, [showColumnPage])

    const buttonStyle = "bg-white border-1 rounded-[5px] w-35 max-h-8 hover:bg-gray-500/30";

    let columnRef = useRef();

    // tab settings and tab contents are found underneath this comment.
    const settingTabsRef = useRef([
        {name: 'General'},
        {name: 'Label'},
        {name: 'Advanced'}
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
            'Label': <Label style={buttonStyle} setShowColumnPage={setShowColumnPage} columnRef={columnRef}/>,
            'Advanced': <Advanced style={buttonStyle} />
        }

        return mapping[activeTab]
    }, [activeTab])

    return (
        <>
        <div className="w-[inherit] h-[inherit] bg-gray-400/30 absolute outline-0 
        flex justify-center items-center z-999 text-black backdrop-blur-xs" 
        ref={divRef} tabIndex={1} onKeyDown={e => e.key === 'Escape' && !showColumnPage && setSettings(false)}>
            {showColumnPage && <ColumnFilter columnRef={columnRef.current} setShow={setShowColumnPage} 
            uploadExcelFile={uploadExcelFile} />}
            <div className="animate-scale-in relative w-92 h-97 max-h-97 bg-white flex flex-col items-center rounded-[4px]">
                <div className={`${'bg-blue-500'} w-full min-h-20 max-h-20 rounded-t-[4px]`}></div>
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
                    <div className="px-5 flex justif">
                        {settingTabsRef.current.map((tab, i) => (
                            <div className={`min-w-25 px-4 flex rounded-t-[5px] justify-center items-center
                            ${activeTab === tab.name && 'bg-white'}`} key={i}
                            onClick={(e) => changeActiveTab(e)}
                            id={tab.name}>
                                {tab.name}
                            </div>
                        ))}
                    </div>
                    <div className="w-90 h-79 bg-white shadow-[0_10px_8px_1px_rgba(0,0,0,.15)] 
                    rounded-[20px] grid grid-cols-2 relative">
                        {activeTabContent}
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}