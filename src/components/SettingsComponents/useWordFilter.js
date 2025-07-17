import { useSettingsContext } from "../../context/SettingsContext";
import { useAlertContext } from "../../context/AlertsContext";
import { useDataContext } from "../../context/DataContext";
import { useMemo } from "react";

export function useWordFilter(csvType, uploadExcelFile){
    const {wordFilters, setWordFilters} = useSettingsContext();

    const { addAlertMessage } = useAlertContext();
    const { uploadedFileInfo } = useDataContext();

    const filters = useMemo(() => {
        let arr = [];

        if(csvType.includes('wordFilter')){
            arr = wordFilters;
        }
        
        return arr;
    }, [csvType, wordFilters])

    // yes, i copied this straight from useColumnFilters. this is my last (hopefully) function before
    // i am finally complete with my program (hopefully).
    const updateFunc = (arr, textAreaRef) => {
        const currString = wordFilters.join('|');

        let newArr = arr.split('|');
        newArr = newArr.filter(entry => entry.trim() != '');

        for(let i = 0; i < newArr.length; i++){
            newArr[i] = newArr[i].trim();
        }

        let newString = newArr.join('|');

        if(newString != currString){
            textAreaRef.current.value = newString;
            
            addAlertMessage('Updated word filters.');
            setWordFilters(newArr);

            window.pywebview.api.set_word_filters(newArr);

            uploadExcelFile(uploadedFileInfo, false);
        }else{
            textAreaRef.current.value = currString;
        }
    }

    const text = 'Filters that are used to remove words from a column header.';

    return {filters, updateFunc, text}
}