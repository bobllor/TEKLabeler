import { useAlertContext } from "../../context/AlertsContext";
import { useState } from "react";

export default function MappingBox(){
    const { addAlertMessage } = useAlertContext();

    const [formElements, setFormElements] = useState([
        {name: 'Number', id: 'numberID', isValid: true,
            value: ''},
        {name: 'Short Description', id: 'shortDescriptionID', isValid: true, 
            value: ''},
        {name: 'Customer Name', id: 'customerNameID', isValid: true, 
            value: ''},
        {name: 'Full Name', id: 'fullNameID', isValid: true, 
            value: ''},
        {name: 'First Name', id: 'firstNameID', isValid: true, 
            value: ''},
        {name: 'Last Name', id: 'lastNameID', isValid: true, 
            value: ''},
    ])

    const submitMapElements = (e) => {
        e.preventDefault();

        // function for the name property by formatting it as "str str" to make
        // the backend parsing easier. this is used for the internal variable name for the backend.
        const formatString = (str) => {
            let upperPattern = /([A-Z])/;

            str = str.replace('ID', '').replace(upperPattern, c => ' ' + c.toLowerCase());

            return str;
        }

        const generateRes = (arrEle) => {
            let res = {};

            for(let i = 0; i < arrEle.length; i++){
                let currEle = arrEle[i];

                if(currEle.tagName != 'INPUT'){
                    continue
                }
                
                // empty strings will just be ignored on the backend.
                let keyValue = currEle.value.trim();

                res[formatString(currEle.name)] = keyValue;
            }

            return res;
        }
        
        const validateRes = (arrEle) => {
            let arrKeys = new Array();
            let countMap = new Map();

            for(let i = 0; i < arrEle.length; i++){
                let currEle = arrEle[i];

                if(currEle.tagName != 'INPUT'){
                    continue
                }

                arrKeys.push(currEle.value);
                
                // used to deal with empty strings in the input.
                let placeholder = Date.now() + i;

                if(!countMap.has(currEle.value)){
                    // empty values are valid, they are ignored in the backend.
                    // this is a random placeholder to fill the array up.
                    if(currEle.value == ''){
                        countMap.set(placeholder, 1);
                        continue;
                    }

                    countMap.set(currEle.value, 1);
                }else{
                    countMap.set(currEle.value, countMap.get(currEle.value) + 1);
                }
            }
            
            let invalidArr = new Array();
            
            countMap.forEach((freq, input) => {
                if(freq > 1 && input != ''){
                    invalidArr.push(input);
                }
            })

            return {status: countMap.size === arrKeys.length, invalidArray: invalidArr};
        }

        const formData = e.target.elements;

        let validateStatus = validateRes(formData);

        if(!validateStatus.status){
            addAlertMessage('Submitted data must contain unique values.');
            return;
        }

        let dataResponse = generateRes(formData);
        
        window.pywebview.api.set_important_column_map(dataResponse).then(res => {
            addAlertMessage(res.message);
        });
    }

    // updates the values in the objects, it checks for duplicates and has conditional disabling.
    // if duplicates are found, then isValid key is set to false for the objects.
    const updateObjValue = (e) => {
        setFormElements((prev) => {
            const newObjArray = prev.map((item) => {
                if(item.id == e.target.name){
                    return {...item, value: e.target.value};
                }

                return {...item};
            })
            
            // took me 4 hours to figure and make this...
            // derived state that dynamically handles the isValid for
            // input validation.
            const countDuplicates = (arr) => {
                let tempObj = {};
                arr.forEach(item => {
                    if(!Object.hasOwn(tempObj, item.value)){
                        tempObj[item.value] = 1;
                    }else{
                        tempObj[item.value] = tempObj[item.value] + 1;
                    }
                })

                return tempObj;
            }

            let objArrayCount = countDuplicates(newObjArray);
            
            const finalObjArray = newObjArray.map(item => {
                return {...item, 
                    isValid: objArrayCount[item.value] <= 1 || item.value == '',
                };
            })

            return finalObjArray;
        })
    }

    return (
        <>
            <div className="flex flex-col bg-white h-100 w-100 absolute z-99">
                <form onSubmit={submitMapElements}>
                    {formElements.map((ele, i) => (
                        <span key={i}>
                            <div className="flex justify-center items-center">
                                <div className="w-[50%]">   
                                    <label htmlFor={ele.id}>{ele.name}</label>
                                </div>
                                <div className="w-[50%]">
                                    <input
                                    className={`p-2 rounded-[8px] border-1 
                                        ${!ele.isValid && "border-red-500"}
                                    outline-hidden bg-white text-black`}
                                    type="text" name={ele.id}
                                    onChange={updateObjValue}
                                    spellCheck={false}/>
                                </div>
                            </div>
                        </span>
                    ))}
                        <div>
                            <button className="p-2 rounded-[8px] w-50 
                            shadow-[0_2px_8px_0_rgba(0,0,0,.15)] bg-blue-400 hover:bg-blue-500" 
                            tabIndex={-1}
                            type="submit"
                            disable="false">Submit</button>
                        </div>
                </form>
            </div>
        </>
    )
}