import { useState, useRef } from "react";
import FolderIcon from '/folder.svg';

export default function SelectInput({ file }){
    const [ width, setWidth ] = useState(32);
    const wrapDiv = useRef(null);
    
    return (
        <>
            <div ref={wrapDiv}
            className={`pl-2 h-fit rounded-[10px] hover:bg-gray-600/50 transition-all duration-200 border-black overflow-hidden`}
            onMouseEnter={() => setWidth(wrapDiv.current.scrollWidth + 4)}
            onMouseLeave={() => setWidth(32)}
            style={{ width: `${width}px` }}>
                <div className="text-black text-nowrap relative flex">
                    <img src={FolderIcon} alt="" />
                    <p className="pl-2">{file ? file : 'No file selected!'}</p>
                    <input type="file" className="opacity-0 absolute left-0 border-2 w-[inherit]" 
                    title={file ? file : ''}
                    style={{ width: `${width}px` }}
                    disabled={file ? false : true}/>
                </div>
            </div>
        </>
    )
}