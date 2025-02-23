import { useLocation } from "react-router";
import { useMemo } from "react";
import CustomTemplate from "./RoutesComponents/CustomTemplate";

export default function Incidents(){
    const location = useLocation();

    const value = useMemo(() => {
        return location.state ? location.state.value : '';
    }, [location.state])

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = e.target.elements;

        // temp testing
        for(let i = 0; i < formData.length; i++){
            if(formData[i].tagName != 'BUTTON'){
                console.log(formData[i].tagName, formData[i].value);
            }
        }
    }
 
    return (
        <>  
            <form 
            className="flex-col w-full justify-center items-center"
            onSubmit={handleSubmit}>
                <CustomTemplate defaultValue={value}/>
                <div className="flex w-full justify-center items-center">
                    <button type="submit">Click me</button>
                </div>
            </form>
        </>
    )
}