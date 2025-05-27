import QuarterArrow from "../../../svgs/QuarterArrow";
import { useSettingsContext } from "../../../context/SettingsContext";
import { useModalContext } from "../../../context/ModalContext";
import { useDataContext } from "../../../context/DataContext";

// very cheesy but whatever. my next project will not do this... maybe...
// since i am close to finishing im just gonna do hacks.
export default function ResetButton({ dataType, uploadExcelFile = null }){
    const {setResetDefaultType, setWordFilters, setColumnFilters} = useSettingsContext();
    const {uploadedFileInfo} = useDataContext();
    const {confirmModal} = useModalContext();

    const handleClick = async () => {
        const confirmChoice = await confirmModal();
        
        if(confirmChoice){
            setResetDefaultType(dataType);
            
            // only these 3 require updates... for some reason. column mappings isn't.
            switch(dataType){
                case 'wordFilter':
                    setWordFilters([]);
                    break;
                case 'softwareId':
                    setColumnFilters(prev => ({...prev, software: []}));
                    uploadExcelFile(uploadedFileInfo, false);
                    break;
                case 'hardwareId':
                    setColumnFilters(prev => ({...prev, hardware: []}));
                    uploadExcelFile(uploadedFileInfo, false);
                    break;
                default:
                    break;
            }
        }
    }

    return (
        <>
            <div className="hover:bg-gray-400 flex justify-center 
            items-center p-1 rounded-[5px]"
            onClick={handleClick}>
                <button
                title="Reset to Default"><QuarterArrow /></button>
            </div>
        </>
    )
}