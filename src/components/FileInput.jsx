import { useRef, useMemo } from "react";
import { useTicketContext } from "../context/TicketContext";

export default function FileInput({onFileChange}){
    const inputFile = useRef();
    const divRef = useRef();
    const { file } = useTicketContext();

    const wrapperStyles = !file 
        ? "text-white w-96 h-52 border-2 rounded-3xl flex flex-col justify-center items-center bg-[#ac2468]/10"
        : "rounded-[30px] bg-[#ac2468]/10";
    
    let buttonStyles = `overflow-x-clip h-7 w-45 border-1 rounded-[30px] 
        flex justify-center items-center hover:bg-[#ac2468]/20 group transition duration-150`;

    const createKeyFrame = (toValue) => {
        const stylesheet = document.styleSheets[0];
        const keyframes = `
            @keyframes marquee {
                from {
                    transform: translateX(0%);
                }
                to { 
                    transform: translateX(-${toValue}%); 
                }
            }
        `

        stylesheet.insertRule(keyframes, stylesheet.cssRules.length);
    }

    if(divRef.current != null){
        if(divRef.current.scrollWidth > divRef.current.offsetWidth){
            const offsetValue = divRef.current.scrollWidth - divRef.current.offsetWidth;
            buttonStyles = buttonStyles.replace('justify-center', '')
            buttonStyles += " animate-scroll";

            createKeyFrame(offsetValue);
        };
    }
    
    return (
        <>  
            <div className={wrapperStyles}>
                    <div 
                    className={buttonStyles}
                    ref={divRef}>
                        <input className="absolute opacity-0 w-max"
                        ref={inputFile} 
                        type="file" 
                        accept=".csv,.xlsx"
                        onChange={e => onFileChange(e)}/>
                        <span className="text-nowrap p-1 pointer-events-none">
                            {!file ? 'Choose Files' : file}
                        </span>
                    </div>
                {!file && <span className="text-s pt-7">Select a csv or excel file to get started.</span>}
            </div>
        </>
    )
}