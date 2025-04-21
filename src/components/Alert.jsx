import { useAlertContext } from '../context/AlertsContext'
import AlertBox from "./AlertComponents/AlertBox"

export default function Alert() {
    // object {id: Any (i use Date.now()), message: string}
    const {alerts, setAlerts} = useAlertContext();

    return (
        <>
            <div className="h-screen w-screen bg-white/0 absolute flex justify-center pointer-events-none">
                <div className="h-fit flex flex-col gap-3 pt-2">
                    {alerts.length > 0 && alerts.map((ele) => 
                        (<AlertBox message={ele.message} key={ele.id} setAlerts={setAlerts} />)
                    )}
                </div>
            </div>
        </>
    )
}