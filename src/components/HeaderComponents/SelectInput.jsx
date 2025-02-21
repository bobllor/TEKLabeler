import { useState, useRef } from "react";
import Folder from "../../svgs/Folder";

export default function SelectInput({ file, fileInputRef, onFileChange }){
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
                        <Folder color={'black'}/>
                    </div>
                    <p className="pl-2">{file ? file : 'No file selected!'}</p>
                    <input type="file" className="opacity-0 absolute left-0 border-2 w-[inherit]" 
                    title={file ? file : ''}
                    style={{ width: `${width}px` }}
                    onChange={e => onFileChange(e)}
                    accept=".csv,.xlsx"
                    ref={fileInputRef}/>
                </div>
            </div>
        </>
    )
}