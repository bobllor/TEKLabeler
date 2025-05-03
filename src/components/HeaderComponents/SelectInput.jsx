import { useState, useRef } from "react";
import Folder from "../../svgs/Folder";

export default function SelectInput({ file, fileInputRef, uploadExcelFile }){
    const [ width, setWidth ] = useState(32);
    const wrapDiv = useRef(null);
    
    return (
        <>
            <div ref={wrapDiv}
            className={`pl-2 h-fit rounded-[10px] hover:bg-gray-600/50 transition-all duration-200 overflow-hidden`}
            onMouseEnter={() => setWidth(wrapDiv.current.scrollWidth + 4)}
            onMouseLeave={() => setWidth(32)}
            style={{ width: `${width}px` }}>
                <div className="text-nowrap relative flex">
                    <div>
                        <Folder />
                    </div>
                    <p className="pl-1 pr-1 dark-element">{file ? file : 'No file selected!'}</p>
                    <input type="file" className="opacity-0 absolute left-0 border-2 w-[inherit]" 
                    tabIndex={-1}
                    title={file ? file : ''}
                    style={{ width: `${width}px` }}
                    onChange={e => uploadExcelFile(e.target.files[0])}
                    accept=".csv,.xlsx"
                    ref={fileInputRef}/>
                </div>
            </div>
        </>
    )
}