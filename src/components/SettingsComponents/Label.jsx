import { useSettingsContext } from "../../context/SettingsContext"
import { useRef, useState } from "react";

export default function Label({ style, setShowColumnPage, columnRef }){
    const { splitName, setSplitName } = useSettingsContext();

    const filterInfo = [
        {id: 'hardwareId', label: 'Hardware'},
        {id: 'softwareId', label: 'Software'}
    ]

    const handleColumnFilter = (e) => {
        columnRef.current = e.target.id;

        setShowColumnPage(prev => !prev);
    }

    return (
        <>
            <div className="col-start-1 flex justify-center items-center">
                <p className="text-center"><strong>First & Last Name Support</strong></p>
            </div>
            <div className="col-start-2 content-center"
            onClick={() => setSplitName(prev => !prev)}>
                <div className="bg-white border-1 
                rounded-[5px] w-35 max-h-8 flex items-center justify-between">
                    <span className={`flex justify-center items-center 
                    rounded-l-[4px] w-full ${splitName ? "bg-blue-300" : "bg-gray-400"}`}>
                        On
                    </span>
                    <span className={`flex justify-center items-center 
                    rounded-r-[4px] w-full ${splitName ? "bg-gray-400" : "bg-blue-300"}`}>
                        Off
                    </span>
                </div>
            </div>
            <div className="col-span-2 flex-col justify-between items-center gap-2 px-1">
                <div className="w-full h-[30%] flex items-center justify-center">
                    <p><strong>Column Filters</strong></p>
                </div>
                <div className="flex gap-2 justify-center items-center px-1 h-[50%]">
                    {filterInfo.map(ele => (
                        <button className={style} 
                        id={ele.id}
                        key={ele.id}
                        onClick={e => handleColumnFilter(e)}>
                            {ele.label}
                        </button>
                    ))}
                </div>
            </div>
        </>
    )
}