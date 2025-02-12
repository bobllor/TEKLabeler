import { useRef } from "react";
import { useTicketContext } from "../context/TicketContext";

export default function FileInput({onFileChange}){
    const inputFile = useRef();
    const { file } = useTicketContext();
    
    let buttonStyles = `overflow-x-clip h-7 w-45 border-1 rounded-[30px] 
        flex justify-center items-center hover:bg-[#ac2468]/20 group transition duration-150`;
    
    return (
        <>  
            <div className="w-96 h-52 border-2 rounded-3xl flex flex-col justify-center items-center">
                    <div 
                    className="overflow-x-clip h-7 w-45 border-1 rounded-[30px] flex justify-center 
                    items-center hover:bg-gray-600/50 group transition duration-150">
                        <input className="absolute opacity-0 w-max"
                        ref={inputFile} 
                        type="file" 
                        accept=".csv,.xlsx"
                        onChange={e => onFileChange(e)}/>
                        <span className="text-nowrap p-1 pointer-events-none">
                            {!file ? 'Choose a File' : file}
                        </span>
                    </div>
                {!file && <span className="text-s pt-7">Select a csv or excel file to get started.</span>}
            </div>
        </>
    )
}