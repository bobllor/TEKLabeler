import { useSettingsContext } from "../../context/SettingsContext"
import { useAlertContext } from "../../context/AlertsContext";
import { useDataContext } from "../../context/DataContext";
import X from "../../svgs/X";
import { useMemo, useRef, useState, useEffect } from "react";


/**
 * Component used for displaying and updating column filters.
 * @param {string} columnType - The type of column, only valid options are 'hardwareId' and 'softwareId'.
 * @param {function} setShow - State function used to set the display of the component.
 */
export default function ColumnFilter({ columnType, setShow, uploadExcelFile }){
    const { columnFilters, setColumnFilters } = useSettingsContext();
    const { addAlertMessage } = useAlertContext();

    const mainContainer = useRef();
    const textAreaRef = useRef();
    const { uploadedFileInfo } = useDataContext();

    useEffect(() => {
        if(mainContainer.current){
            mainContainer.current.focus();
        }
    }, [])

    const columns = useMemo(() => {
        let temp = null;

        if(columnType.includes('hardware')){
            temp = columnFilters.hardware;
        }else{
            temp = columnFilters.software;
        }

        return temp;
    }, [columnFilters])

    function updateColumnFilter(arr){
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
            
            addAlertMessage('Updated filters.')
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

    const submitFilterForm = (e) => {
        e.preventDefault();
        
        updateColumnFilter(e.target.elements[1].value)
    }

    const handleKeyDownSubmit = (e) => {
        if(e.key === 'Enter'){
            e.preventDefault();

            updateColumnFilter(e.target.value);
        }
    }

    const [ textFocus, setTextFocus ] = useState(false);

    return (
        <>
            <div tabIndex={1} className="absolute z-99 h-100 w-115 bg-white border-1 rounded-[10px]" 
            ref={mainContainer} onKeyDown={e => e.key === 'Escape' && textFocus === false && setShow(false)}>
                <div className="w-max-20 flex-col justify-center items-center h-full w-full">
                    <div className="pt-2 px-2 flex justify-between items-center">
                        <div></div>
                        <span><strong>Filter Options</strong></span>
                        <button 
                        className="hover:bg-gray-400 w-5 h-5 flex justify-center items-center rounded-[4px]"
                        onClick={() => setShow(false)}>
                            <X />
                        </button>
                    </div>
                    <div className="h-[25%] flex flex-col-reverse items-center">
                        <form id="filterForm" onSubmit={e => submitFilterForm(e)}></form>
                        <div className="flex justify-center items-center">
                            <p className="text-[15px] text-center">
                                {
                                columnType.includes('hardware') ? 
                                'Filter columns that are the "hardware requested" category. ' :
                                'Filter columns that are the "software requested" category. '
                                }
                                <br />
                                The format for the filters follow a CSV-style format.
                                <br />
                                Example: <i>Filtering,Out,A,Monitor</i>
                                <br />
                                It is <u><strong>not</strong> case sensitive</u>.
                                Press enter to submit a new filter.
                            </p>
                        </div>
                    </div>
                    <div className="h-[70%] flex justify-center items-center">
                        <textarea
                        ref={textAreaRef}
                        onFocus={() => setTextFocus(true)}
                        onBlur={() => setTextFocus(false)}
                        onKeyDown={e => handleKeyDownSubmit(e)}
                        className="outline-0 border-1 rounded-[5px] min-h-[80%] 
                        w-[90%] p-2 resize-none break-all" 
                        spellCheck={false}
                        defaultValue={columns.length > 0 ? columns.join() : undefined}
                        placeholder={columns.length === 0 ? 'Enter any filter' : undefined}
                        form="filterForm">
                        </textarea>
                    </div>
                </div>
            </div>
        </>
    )
}