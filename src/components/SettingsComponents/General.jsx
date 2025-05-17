import { useState, useRef, useEffect } from "react";
import { useSettingsContext } from "../../context/SettingsContext";
import ToggleTheme from "./GeneralComponents/ToggleTheme.jsx"

export default function General({ style }){
    const componentsRef = useRef([
        <ToggleTheme style={style}/>
    ])

    const { outputPath, setOutputPath } = useSettingsContext();

    const [show, setShow] = useState(false);

    const handleOutputLocation = () => {
        window.pywebview.api.set_output().then(res => {
            if(res.status != 'error'){
                setOutputPath(res.output_folder);
            }
        });
    }
    
    return (
        <>
            <div className="flex">
                <div className="px-3 w-[50%]">
                    <p className="flex justify-center items-center"><strong>Output Folder</strong></p>
                </div>
                <div className="relative">
                    <button className={style}
                    onClick={handleOutputLocation}
                    onMouseEnter={() => setShow(prev => !prev)}
                    onMouseLeave={() => setShow(prev => !prev)}>
                            <span>Select Folder</span>
                    </button>
                    <div className={`${!show && 'hidden'} mt-[3px] px-2 rounded-[5px] 
                    absolute animate-fade-in bg-white border-1`}>
                        <span>{outputPath}</span>
                    </div>
                </div>
            </div>
            {componentsRef.current.map((ele, i) => (
                <span key={i}>
                    {ele}
                </span>
            ))}
        </>
    )
}