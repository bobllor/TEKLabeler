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
                <div className="bg-green-500 w-15 h-14 flex justify-center items-center">
                    <span>ICON</span>
                </div>
                <div className="bg-gray-500 w-50 h-14 flex items-center pl-3">
                    <span>{message}</span>
                </div>
            </div>
        </>
    )
}