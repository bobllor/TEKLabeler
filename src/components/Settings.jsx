import { useSettingsContext } from "../context/SettingsContext";
import { useRef } from "react";
import SettingsCog from "../svgs/SettingsCog";
import XIcon from '/x.svg';
import { useEffect } from "react";

export default function Settings(){
    const { outputPath, setOutputPath, setSettings } = useSettingsContext();
    const divRef = useRef();

    const handleOutputLocation = () => {
        window.pywebview.api.set_output().then(res => {
            if(res.output_folder){
                setOutputPath(res.output_folder);
            }
        });
    }

    useEffect(() => {
        if(divRef.current){
            divRef.current.focus();
        }
    }, [])

    const handleUploadLogo = () => {
        window.pywebview.api.upload_logo();
    }

    const buttonStyle = "bg-white border-1 rounded-[5px] w-35 max-h-8 hover:bg-gray-500/30";

    const handleCloseClick = () => {
        setSettings(false);
    }

    const handleKeyDown = (e) => {
        if(e.key === 'Escape'){
            setSettings(false);
        }
    }

    return (
        <>
        <div className="w-[inherit] h-[inherit] bg-gray-400/30 absolute 
        flex justify-center items-center z-999 text-black backdrop-blur-xs" ref={divRef} tabIndex={1} onKeyDown={e => handleKeyDown(e)}>
            <div className="animate-scale-in relative w-92 h-90 max-h-90 bg-white flex flex-col items-center rounded-[4px]">
                <div className="bg-blue-500 w-full min-h-20 max-h-20 rounded-t-[4px]"></div>
                <div className="absolute">
                    <div className="pt-2 h-10 w-full text-center text-white">
                        <span className="flex flex-row-reverse justify-between relative">
                            <div className="flex gap-2 justify-center items-center w-full absolute pointer-events-none">
                                <SettingsCog />
                                <p>Settings</p>
                            </div>
                            <div className="hover:bg-gray-400 w-5 h-5" onClick={handleCloseClick}>
                                <img src={XIcon}/>
                            </div>
                        </span>
                    </div>
                    <div className="w-90 h-79 bg-white border-1 rounded-[20px]">
                        <div className="w-full h-[30%] flex flex-col justify-center items-center">
                            <div className="w-full flex justify-evenly items-center px-3">
                                <p>Output Folder:</p>
                                <button className={buttonStyle} onClick={handleOutputLocation}>Select</button>
                            </div>
                            <div>
                                <p>{outputPath}</p>
                            </div>
                        </div>
                        <div className="w-full h-[50%] flex flex-row-reverse">
                            <div className="w-full flex justify-evenly items-center px-3">
                                <p>Upload Logo (minimum 932x207):</p>
                                <button className={buttonStyle} 
                                onClick={handleUploadLogo}>Upload Logo</button>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
        </>
    )
}