import { useLocation } from "react-router";
import CustomTemplate from "./RoutesComponents/CustomTemplate";
import { useAlertContext } from "../context/AlertsContext";
import { useState, useEffect } from "react";
import { includesCheck } from "./utils";

export default function Custom({ showDrag }){
    const location = useLocation();

    const { addAlertMessage } = useAlertContext();

    const [defaultTicketValue, setDefaultTicketValue] = useState('');

    // used as a prop for routing components
    const submitCustomLabelData = (e) => {
        const resetFields = (fieldArray) => {
            for(let i = 0; i < fieldArray.length; i++){
                if(i === 0){
                    setDefaultTicketValue('');
                }else{
                    fieldArray[i].value = '';
                }
            }
        }
        e.preventDefault();

        const formData = e.target.elements;
        const ticketTypeArr = ["ritm", "inc"];
        const ticketValue = formData[0].value;

        const isValidInput = includesCheck(ticketValue, ticketTypeArr)

        if(!isValidInput){
            addAlertMessage('Incorrect format used for the ticket number, it must start with RITM or INC.')
            resetFields(formData);
            return;
        }

        let formObject = {};
        const labelDataArr = ["hardware", "password"];

        for(let i = 0; i < formData.length; i++){
            if(formData[i].tagName != 'BUTTON'){
            // ensure no empty fields are entered
            if(formData[i].value.trim() === '' && !includesCheck(formData[i].name, labelDataArr)){
                addAlertMessage(`Form fields cannot be empty.`)
                resetFields(formData);
                return
            }
            
            // removes input from the idName of the labelData of the formData.
            formObject[formData[i].name.replace('Input', '')] = formData[i].value;
            formData[i].value = '';
            }
        }

        setDefaultTicketValue('');

        // used for the correct template in the label in the label creation
        const isIncident = ticketValue.toLowerCase().includes('inc') ? true : false;
        
        window.pywebview.api.create_custom_label(formObject, isIncident).catch(res => {
            let resStr = String(res);
            let colon = resStr.indexOf(':');
            // i don't remember what this was...
            addAlertMessage(resStr.slice(colon + 1));
            
            return;
        });
    }
    
    useEffect(() => {
        let newValue = location.state ? location.state.value : '';
        
        if(newValue && newValue.includes('MAN')){
            newValue = newValue.replace('MAN', 'RITM');
        }

        setDefaultTicketValue(newValue);
    }, [location.state])

    return (
        <>  
            <div className={`flex justify-center items-center ${showDrag && "pointer-events-none"}`}>
                <form 
                className={`flex-col w-full justify-center items-center
                shadow-[0_3px_8px_1px_rgba(0,0,0,.4)] light-background py-4 rounded-[10px]`}
                onSubmit={submitCustomLabelData}>
                    <CustomTemplate 
                    defaultValue={defaultTicketValue}
                    setTicketValue={setDefaultTicketValue}/>
                    <div className="flex w-full justify-center items-center pt-6">
                    <button className="p-2 rounded-[8px] w-50 
                        shadow-[0_2px_8px_0_rgba(0,0,0,.15)] bg-blue-400 hover:bg-blue-500" 
                        tabIndex={-1}
                        type="submit">Submit</button>
                    </div>
                </form>
            </div>
        </>
    )
}