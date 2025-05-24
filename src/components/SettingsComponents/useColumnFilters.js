import { useSettingsContext } from "../../context/SettingsContext"
import { useAlertContext } from "../../context/AlertsContext";
import { useDataContext } from "../../context/DataContext";
import { useMemo } from "react";

export function useColumnFilters(columnType, uploadExcelFile){
    const { columnFilters, setColumnFilters } = useSettingsContext();
    const { addAlertMessage } = useAlertContext();

    const { uploadedFileInfo } = useDataContext();

    const filters = useMemo(() => {
        return columnType.includes('hardware') ? columnFilters.hardware : columnFilters.software;
    }, [columnFilters, columnType])

    function updateFunc(arr, textAreaRef){
        // removes any unnecessary commas or spaces before the comparisons below.
        const category = columnType.includes('hardware') ? 'hardware' : 'software';
        const currFilter = category === 'hardware' ? columnFilters.hardware : columnFilters.software;
        const currText = currFilter.join();

        let newArr = arr.split(',');
        newArr = newArr.filter(entry => entry.trim() != '');

        for(let i = 0; i < newArr.length; i++){
            newArr[i] = newArr[i].trim();
        }

        let newArrString = newArr.join();
            
        if(newArrString !== currText){
            textAreaRef.current.value = newArrString;
            
            addAlertMessage('Updated column filters.');
            setColumnFilters(prev => ({...prev, [category]: newArr}));

            // takes arguments of the new array filter and the filter type (column type).
            window.pywebview.api.set_filter(newArr, columnType);

            // rerun the report load to reflect the updated filters.
            uploadExcelFile(uploadedFileInfo, false);
        }else{
            // primarily used for invalid inputs, specifically with multiple commas or spaces.
            textAreaRef.current.value = currText;
        }
        
        return;
    }

    let text = columnType.includes('hardware') ? 
    'Filter columns that are the "hardware requested" category. ' :
    'Filter columns that are the "software requested" category. '

    return {filters, updateFunc, text}
}