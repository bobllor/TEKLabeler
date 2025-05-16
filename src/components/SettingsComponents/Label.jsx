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
            <div className="flex">
                <p className="w-[50%] flex justify-center items-center text-center">
                    <strong>First & Last Name Support</strong>
                </p>
                <div className="content-center"
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
            </div>
            <div className="flex items-center">
                <div className="w-[50%] h-[30%] flex items-center justify-center">
                    <p><strong>Column Filters</strong></p>
                </div>
                <div className="flex flex-col gap-2 justify-center items-center">
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