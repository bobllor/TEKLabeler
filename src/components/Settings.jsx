import { useSettingsContext } from "../context/SettingsContext";
import { useRef } from "react";
import SettingsCog from "../svgs/SettingsCog";
import X from "../svgs/X";
import { useEffect, useState } from "react";
import ColumnFilter from "./SettingsComponents/ColumnFilter";

export default function Settings(){
    const { outputPath, setOutputPath, 
        setSettings } = useSettingsContext();

    const divRef = useRef();

    const [show, setShow] = useState(false);
    const [showColumnPage, setShowColumnPage] = useState(false);

    const handleOutputLocation = () => {
        window.pywebview.api.set_output().then(res => {
            if(res.output_folder){
                setOutputPath(res.output_folder);
            }
        });
    }

    // focuses on first load and if the new page for the column filters is displayed.
    useEffect(() => {
        if(divRef.current && !showColumnPage){
            divRef.current.focus();
        }
    }, [showColumnPage])

    const buttonStyle = "bg-white border-1 rounded-[5px] w-35 max-h-8 hover:bg-gray-500/30";

    const filterInfo = [
        {id: 'hardwareId', label: 'Hardware'},
        {id: 'softwareId', label: 'Software'}
    ]

    let column = useRef();

    const handleColumnFilter = (e) => {
        column.current = e.target.id;

        setShowColumnPage(prev => !prev);
    }

    return (
        <>
        <div className="w-[inherit] h-[inherit] bg-gray-400/30 absolute outline-0 
        flex justify-center items-center z-999 text-black backdrop-blur-xs" 
        ref={divRef} tabIndex={1} onKeyDown={e => e.key === 'Escape' && !showColumnPage && setSettings(false)}>
            {showColumnPage && <ColumnFilter columnType={column.current} setShow={setShowColumnPage}/>}
            <div className="animate-scale-in relative w-92 h-90 max-h-90 bg-white flex flex-col items-center rounded-[4px]">
                <div className={`${'bg-blue-500'} w-full min-h-20 max-h-20 rounded-t-[4px]`}></div>
                <div className="absolute">
                    <div className="pt-2 h-10 w-full text-center text-white">
                        <span className="flex flex-row-reverse justify-between relative">
                            <div className="flex gap-1 justify-center items-center w-full absolute pointer-events-none">
                                <SettingsCog color={'black'} fill={'gray'} />
                                <p className="font-sans"><strong>Settings</strong></p>
                            </div>
                            <div className="hover:bg-gray-400 w-5 h-5 flex justify-center items-center rounded-[4px]" 
                            onClick={() => setSettings(prev => !prev)}>
                                <X />
                            </div>
                        </span>
                    </div>
                    <div className="w-90 h-79 bg-white border-1 rounded-[20px] grid grid-cols-2 relative">
                        <div className="col-start-1 content-center text-center">
                            <div className="px-3">
                                <p><strong>Output Folder</strong></p>
                            </div>
                        </div>
                        <div className="col-start-2 content-center relative">
                                <button className={buttonStyle}
                                onClick={handleOutputLocation}
                                onMouseEnter={() => setShow(prev => !prev)}
                                onMouseLeave={() => setShow(prev => !prev)}>
                                    <span>Select Folder</span>
                                </button>
                                <div className={`${!show && 'hidden'} mt-2 px-2 rounded-[5px] 
                                absolute animate-wipe-down bg-white border-1`}>
                                    <span>{outputPath}</span>
                                </div>
                        </div>
                        <div className="w-full col-start-1 text-center content-center">
                            <div className="w-full px-3">
                                <p><strong>Upload Logo</strong></p>
                            </div>
                        </div>
                        <div className="col-start-2 content-center">
                            <button className={buttonStyle} 
                            onClick={() => window.pywebview.api.upload_logo()}>Select</button>
                            <p>(minimum 932x207)</p>
                        </div>
                        <div className="col-span-2 border-t-1 flex-col justify-between items-center gap-2 px-1">
                            <div className="w-full h-[30%] flex items-center justify-center">
                                <p><strong>Column Filters</strong></p>
                            </div>
                            <div className="flex gap-2 justify-center items-center px-1 h-[50%]">
                                {filterInfo.map(ele => (
                                    <button className={buttonStyle} 
                                    id={ele.id}
                                    key={ele.id}
                                    onClick={e => handleColumnFilter(e)}>
                                        {ele.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}