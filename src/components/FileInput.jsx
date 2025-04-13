import { useRef, useState } from "react";
import DragDropOverlay from "./FileInputComponents/DragDropOverlay";

export default function FileInput({onFileChange}){
    const inputFile = useRef();
    
    const [showDrag, setShowDrag] = useState(false);

    const handleDrop = (e) => {
        e.preventDefault();
        
        // in an event of an error, this ensures the drag is always shut off.
        if(showDrag){
            setShowDrag(false);
        }

        onFileChange(e.dataTransfer.files[0]);
    }

    const handleDragOver = (e) => {
        e.preventDefault();

        if(!showDrag){
            setShowDrag(true);
        }
    }

    const handleDragLeave = (e) => {
        e.preventDefault();

        if(showDrag){
            setShowDrag(false);
        }
    }
    
    return (
        <>  
            {showDrag && <DragDropOverlay />}
            <div className="w-140 h-75 overflow-hidden rounded-3xl flex flex-col justify-center items-center
            shadow-[0_3px_8px_1px_rgba(0,0,0,.15)]" 
            onDragOver={e => handleDragOver(e)}
            onDragLeave={e => handleDragLeave(e)}
            onDrop={e => handleDrop(e)}>
                    <div 
                    className={`bg-blue-500 overflow-x-clip h-20 w-60 rounded-[15px] flex justify-center 
                    items-center hover:bg-blue-400 group transition duration-150 text-white text-2xl
                    shadow-[0_3px_8px_1px_rgba(0,0,0,.15)] ${showDrag && 'pointer-events-none'}`}>
                        <input className="absolute opacity-0 w-[inherit] h-[inherit]"
                        ref={inputFile} 
                        type="file" 
                        accept=".csv,.xlsx"
                        onChange={e => onFileChange(e.target.files[0])}/>
                        <span className="flex-col text-center text-nowrap justify-center p-1">
                            <p>Choose a file</p>
                        </span>
                    </div>
                    <span className="text-s pt-4 w-[50%] h-10 text-center pointer-events-none">Select or drag an Excel file to get started!</span>
                    <span className="text-nowrap text-[12px] pt-6 pointer-events-none">{"(or press CTRL + F)"}</span>
            </div>
        </>
    )
}