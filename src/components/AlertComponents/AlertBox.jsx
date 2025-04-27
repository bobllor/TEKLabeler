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
            <div className="flex justify-center items-center z-800" key={uKey}>
                <div className="bg-white w-15 h-14 flex justify-center items-center rounded-l-xl
                shadow-[0_3px_8px_1px_rgba(0,0,0,.15)]">
                    <span className="dark-text">ICON</span>
                </div>
                <div className="bg-white w-fit h-14 max-w-50 flex 
                px-3 rounded-r-xl justify-center items-center 
                shadow-[0_3px_8px_1px_rgba(0,0,0,.15)]">
                    <span className="dark-text text-center">{message}</span>
                </div>
            </div>
        </>
    )
}