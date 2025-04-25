import { useLocation } from "react-router";
import CustomTemplate from "./RoutesComponents/CustomTemplate";
import { useAlertContext } from "../context/AlertsContext";
import { useState, useEffect } from "react";

export default function Custom({ incidentTemplate = false }){
    const location = useLocation();

    const { addAlertMessage } = useAlertContext();

    // used as a prop for routing components
    const submitCustomLabelData = (e) => {
        e.preventDefault();

        const formData = e.target.elements;

        const isIncident = formData[0].value.includes('INC') ? true : false;
        let formObject = {};

        for(let i = 0; i < formData.length; i++){
            if(formData[i].tagName != 'BUTTON'){
            // ensure no empty fields are entered
            if(formData[i].value.trim() === '' && !formData[i].name.includes('hardware')){
                addAlertMessage(`Form fields cannot be empty.`)
                return
            }
            
            formObject[formData[i].name.replace('Input', '')] = formData[i].value;
            formData[i].value = '';
            }
        }

        window.pywebview.api.create_custom_label(formObject, isIncident).catch(res => {
            let resStr = String(res);
            let colon = resStr.indexOf(':');
            addAlertMessage(resStr.slice(colon + 1));
            
            return;
        });
    }

    const [defaultTicketValue, setDefaultTicketValue] = useState('');
    
    useEffect(() => {
        setDefaultTicketValue(location.state ? location.state.value : '');
    }, [location.state])

    return (
        <>  
            <form 
            className="flex-col w-full justify-center items-center mb-100 border-1 pb-4 rounded-[5px]"
            onSubmit={submitCustomLabelData}>
                <CustomTemplate type={incidentTemplate ? 'INC' : 'MAN'} defaultValue={defaultTicketValue}/>
                <div className="flex w-full justify-center items-center pt-10">
                <button className="p-2 rounded-[8px] w-50 
                    shadow-[0_2px_8px_0_rgba(0,0,0,.15)] bg-blue-400 hover:bg-blue-500" 
                    type="submit">Submit</button>
                </div>
            </form>
        </>
    )
}