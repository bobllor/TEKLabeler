import { useModalContext } from "../../../context/ModalContext"
import ResetButton from "./ResetButton"

export default function UploadLogoRow({ style, addAlertMessage }){
    const { confirmModal } = useModalContext();

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
                    <p className="flex justify-center items-center"><strong>Upload Logo</strong></p>
                </div>
                <div className="flex flex-col w-[50%]">
                    <div className="flex gap-1">
                        <button className={style} 
                        onClick={handleLogoUpload}>Select</button>
                        <ResetButton dataType={"logoID"} />
                    </div>
                    <span className="flex w-full">
                        (minimum 932x207)
                    </span>
                </div>
            </div>
        </>
    )
}