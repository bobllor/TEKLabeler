import X from "../../svgs/X";
import { useRef, useState, useEffect } from "react";

/**
 * Component used to update data to the backend via a CSV form.
 * @param {function} setShow - State function used to set the display of the component. The state should
 * be `true` before this component is mounted.
 * @param {Array} arr - An array of strings representing the input of the form.
 * @param {function} updateFunc - Function used to update state and update data in the backend.
 * The update function has two arguments, 
 * @param {string} infoText - String of text that acts as a tip for the user on how to use the component.
 */
export default function CSVForm({ setShow, arr, updateFunc, infoText}){
    const mainContainer = useRef();
    const textAreaRef = useRef();

    useEffect(() => {
        if(mainContainer.current){
            mainContainer.current.focus();
        }
    }, [])

    const handleKeyDownSubmit = (e) => {
        if(e.key === 'Enter'){
            e.preventDefault();

            updateFunc(e.target.value, textAreaRef);
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
                        <div className="flex justify-center items-center">
                            <p className="text-[15px] text-center">
                                {infoText}
                                <br />
                                The format for the filters follow a CSV-style format.
                                <br />
                                Example: <i>A,CSV,Example,Input</i>
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
                        defaultValue={arr.length > 0 ? arr.join() : undefined}
                        placeholder={arr.length === 0 ? 'Enter any filter' : undefined}>
                        </textarea>
                    </div>
                </div>
            </div>
        </>
    )
}