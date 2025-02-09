import { useEffect } from "react";
import { useContext, createContext, useState, useRef } from "react";

const TicketContext = createContext();

export const useTicketContext = () => useContext(TicketContext);

export const TicketProvider = ({children}) => {
    const [file, setFile] = useState('');
    const [loading, setLoading] = useState(false);

    const ticketNumbers = useRef({});
    
    const [ticketsClicked, setTicketsClicked] = useState(new Set());

    const [settings, setSettings] = useState(false);

    const outputPath = useRef('');

    useEffect(() => {
        setTimeout(() => {
          window.pywebview.api.on_load().then(res => outputPath.current = res)
        }, 500)
      }, [])
    
    const value = {
        file,
        setFile,
        loading,
        setLoading,
        ticketNumbers,
        ticketsClicked,
        setTicketsClicked,
        settings,
        setSettings,
        outputPath
    }

    return (
        <TicketContext.Provider value={value}>
            { children }
        </TicketContext.Provider>
    )
}