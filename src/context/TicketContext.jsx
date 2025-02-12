import { useEffect } from "react";
import { useContext, createContext, useState, useRef } from "react";

const TicketContext = createContext();

export const useTicketContext = () => useContext(TicketContext);

export const TicketProvider = ({children}) => {
    const [file, setFile] = useState('');
    const [loading, setLoading] = useState(true);

    const ticketNumbers = useRef({});
    
    const [ticketsClicked, setTicketsClicked] = useState(new Set());

    useEffect(() => {
        document.body.addEventListener('contextmenu', e => {e.preventDefault()});
    }, [])
    
    const value = {
        file,
        setFile,
        loading,
        setLoading,
        ticketNumbers,
        ticketsClicked,
        setTicketsClicked,
    }

    return (
        <TicketContext.Provider value={value}>
            { children }
        </TicketContext.Provider>
    )
}