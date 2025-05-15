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
            <div className="col-start-1 content-center text-center">
                <div className="px-3">
                    <p><strong>Output Folder</strong></p>
                </div>
            </div>
            <div className="col-start-2 content-center relative">
                    <button className={style}
                    onClick={handleOutputLocation}
                    onMouseEnter={() => setShow(prev => !prev)}
                    onMouseLeave={() => setShow(prev => !prev)}>
                        <span>Select Folder</span>
                    </button>
                    <div className={`${!show && 'hidden'} mt-1 px-2 rounded-[5px] 
                    absolute animate-fade-in bg-white border-1`}>
                        <span>{outputPath}</span>
                    </div>
            </div>
            <div className="w-full col-start-1 text-center content-center">
                <div className="w-full px-3">
                    <p><strong>Upload Logo</strong></p>
                </div>
            </div>
            <div className="col-start-2 content-center">
                <button className={style} 
                onClick={handleLogoUpload}>Select</button>
                <p>(minimum 932x207)</p>
            </div>
        </>
    )
}