import { useState } from "react";
import { useSettingsContext } from "../../context/SettingsContext";
import { useAlertContext } from "../../context/AlertsContext";

export default function General({ style }){
    const { outputPath, setOutputPath } = useSettingsContext();

    const [show, setShow] = useState(false);

    const handleOutputLocation = () => {
        window.pywebview.api.set_output().then(res => {
            if(res.status != 'error'){
                setOutputPath(res.output_folder);
            }
        });
    }

    const { addAlertMessage } = useAlertContext();

    const handleLogoUpload = () => {
        window.pywebview.api.upload_logo().then(res => {
            // very cheap hack. sorry not sorry.
            if(res.status != 'misc'){
                addAlertMessage(res.message);
            }
        })
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
            <div className="flex">
                <div className="px-3 w-[50%]">
                    <p className="flex justify-center items-center"><strong>Upload Logo</strong></p>
                </div>
                <div className="flex flex-col w-[50%]">
                    <button className={style} 
                    onClick={handleLogoUpload}>Select</button>
                    <span className="flex w-full">
                        (minimum 932x207)
                    </span>
                </div>
            </div>
        </>
    )
}