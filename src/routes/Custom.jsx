import { useLocation } from "react-router";
import { useMemo } from "react";
import CustomTemplate from "./RoutesComponents/CustomTemplate";

export default function Custom({ handleSubmit }){
    const location = useLocation();

    const value = useMemo(() => {
        return location.state ? location.state.value : '';
    }, [location.state])
 
    return (
        <>  
            <form 
            className="flex-col w-full justify-center items-center"
            onSubmit={handleSubmit}>
                <CustomTemplate type={'MAN'} defaultValue={value}/>
                <div className="flex w-full justify-center items-center">
                    <button type="submit">Click me</button>
                </div>
            </form>
        </>
    )
}