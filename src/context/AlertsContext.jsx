import { useContext, createContext, useState, useEffect } from "react";

const AlertsContext = createContext();

export const useAlertContext = () => useContext(AlertsContext);

export const AlertsProvider = ({ children }) => {
    const [alerts, setAlerts] = useState([]);

    // check AlertBox.jsx for the message resetting.
    const addAlertMessage = (message) => {
        setAlerts([...alerts, {id: Date.now(), message: message}]);
    }

    const data = {
        alerts,
        setAlerts,
        addAlertMessage
    }

    return (
        <AlertsContext.Provider value={data}>
            { children }
        </AlertsContext.Provider>
    )
}