import { useSettingsContext } from "../../context/SettingsContext"
import { useMemo, useRef, useEffect } from "react";

/**
 * 
 * @param {string} columnType - The type of column, only valid options are 'hardwareId' and 'softwareId'.
 * @param {function} setShow - State function used to set the display of the component.
 */
export default function ColumnFilter({ columnType, setShow }){
    const { columnFilters, setColumnFilters } = useSettingsContext();

    const mainContainer = useRef();
    const textAreaRef = useRef();

    useEffect(() => {
        if(mainContainer.current){
            mainContainer.current.focus();
        }
    }, [])

    const columns = useMemo(() => {
        let temp = null;

        if(columnType.includes('immutable')){
            temp = columnFilters.immutable;
        }else if(columnType.includes('hardware')){
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

            setColumnFilters(prev => ({...prev, [category]: newArr}));

            // takes arguments of the new array filter and the filter type (column type).
            window.pywebview.api.set_filter(newArr, columnType);
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

    return (
        <>
            <div tabIndex={1} className="absolute z-99 h-100 w-115 bg-white border-1 rounded-[10px]" 
            ref={mainContainer} onKeyDown={e => e.key === 'Escape' && setShow(prev => !prev)}>
                <div className="w-max-20 flex-col justify-center items-center h-full w-full">
                    <div className="h-[20%] flex flex-col-reverse items-center">
                        <form id="filterForm" onSubmit={e => submitFilterForm(e)}>
                            <input type="submit" />
                        </form>
                    </div>
                    <div className="h-[80%] flex justify-center items-center">
                        <textarea
                        ref={textAreaRef}
                        onKeyDown={e => handleKeyDownSubmit(e)}
                        className="outline-0 border-1 min-h-[80%] w-[90%] p-2 resize-none" 
                        spellCheck={false}
                        defaultValue={columns.length > 0 ? columns.join() : undefined}
                        placeholder={columns.length === 0 ? 'Enter a value' : undefined}
                        form="filterForm">
                        </textarea>
                    </div>
                </div>
            </div>
        </>
    )
}