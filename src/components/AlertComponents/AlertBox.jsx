import { useEffect } from "react";
import { useState } from "react";

export default function AlertBox({ message, uKey, setAlerts }){
    const [showAlert, setShowAlert] = useState(true);

    useEffect(() => {
        const timeId = setTimeout(() => {
            setShowAlert(false);
            setAlerts(prevAlert => prevAlert.filter(alert => alert.id !== uKey));
        }, 3000)

        return () => {
            clearTimeout(timeId);
        }
    }, [])

    if(!showAlert){
        return;
    }

    return (
        <>
            <div className="flex justify-center items-center" key={uKey}>
                <div className="bg-white w-15 h-14 flex justify-center items-center rounded-l-xl
                border-1 shadow-[0_3px_8px_1px_rgba(0,0,0,.15)]">
                    <span>ICON</span>
                </div>
                <div className="bg-white w-fit h-14 flex items-center px-3 rounded-r-xl
                border-t-1 border-r-1 border-b-1 shadow-[0_3px_8px_1px_rgba(0,0,0,.15)]">
                    <span>{message}</span>
                </div>
            </div>
        </>
    )
}