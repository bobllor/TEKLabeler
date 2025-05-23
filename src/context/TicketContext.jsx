import { useEffect } from "react";
import { useContext, createContext, useState, useRef } from "react";
import { useSettingsContext } from "./SettingsContext";

const TicketContext = createContext();

export const useTicketContext = () => useContext(TicketContext);

export const TicketProvider = ({children}) => {
    const [file, setFile] = useState('');
    const [loading, setLoading] = useState(true);

    const ticketNumbers = useRef({});
    
    const [ticketsClicked, setTicketsClicked] = useState(new Set());
    
    // this is a pretty cheap trick i did with settingscontext. i cba so.
    const firstLoad = useRef(true);

    useEffect(() => {
        document.body.addEventListener('contextmenu', e => {e.preventDefault()});
    }, [])

    useEffect(() => {
        if(loading){
            // need this delay for the first initial load due to some issues.
            let time = firstLoad.current ? 1500 : 500;

            setTimeout(() => {
                setLoading(false);
            }, time)

            if(firstLoad.current) {firstLoad.current = false};
        }
    }, [loading])
    
    const value = {
        file,
        setFile,
        loading,
        setLoading,
        ticketNumbers,
        ticketsClicked,
        setTicketsClicked,
        firstLoad
    }

    return (
        <TicketContext.Provider value={value}>
            { children }
        </TicketContext.Provider>
    )
}