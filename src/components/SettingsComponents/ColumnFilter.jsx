import { useSettingsContext } from "../../context/SettingsContext"
import { useMemo, useRef, useEffect } from "react";

export default function ColumnFilter({ columnType, setShow }){
    const { columnFilters, setColumnFilters } = useSettingsContext();

    const mainContainer = useRef();

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

    return (
        <>
            <div tabIndex={1} className="absolute z-99 h-100 w-115 bg-white border-1 rounded-[10px]" 
            ref={mainContainer} onKeyDown={e => e.key === 'Escape' && setShow(prev => !prev)}>
                <div className="w-max-20 flex-col justify-center items-center h-full w-full">
                    <div className="h-[20%]"></div>
                    <div className="h-[80%] flex justify-center items-center">
                        <textarea 
                        className="outline-0 border-1 min-h-[80%] w-[90%] p-2" 
                        spellCheck={false}
                        defaultValue={columns.length > 0 ? columns.join() : undefined}
                        placeholder={columns.length === 0 ? 'Enter a value' : undefined}>
                        </textarea>
                    </div>
                </div>
            </div>
        </>
    )
}