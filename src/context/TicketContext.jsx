import { useEffect } from "react";
import { useContext, createContext, useState, useRef } from "react";

const TicketContext = createContext();

export const useTicketContext = () => useContext(TicketContext);

export const TicketProvider = ({children}) => {
    const [file, setFile] = useState('');
    const [loading, setLoading] = useState(true);

    const ticketNumbers = useRef({});
    
    const [ticketsClicked, setTicketsClicked] = useState(new Set());

    const [settings, setSettings] = useState(false);

    const [outputPath, setOutputPath] = useState('');

    // could be better? this does fix the issue with pywebview being injected late.
    useEffect(() => {
        setTimeout(() => {
          window.pywebview.api.on_load().then(res => setOutputPath(res.output_folder))
          setLoading(false);
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
        outputPath,
        setOutputPath
    }

    return (
        <TicketContext.Provider value={value}>
            { children }
        </TicketContext.Provider>
    )
}