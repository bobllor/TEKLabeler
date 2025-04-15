import { useContext, createContext, useState, useEffect, useMemo } from "react";
import { useTicketContext } from "./TicketContext";

const SettingsContext = createContext();

export const useSettingsContext = () => useContext(SettingsContext);

export const SettingsProvider = ({children}) => {
    const [settings, setSettings] = useState(false);

    const [outputPath, setOutputPath] = useState('');

    const { setLoading } = useTicketContext();

    const [columnFilters, setColumnFilters] = useState(null);

    // could be better? this does fix the issue with pywebview being injected late.
    useEffect(() => {
        setTimeout(() => {
          window.pywebview.api.on_load().then(res => {
            setOutputPath(res.output_folder);
            setColumnFilters(res.column_filters);
        })
          setLoading(false);
        }, 500)
    }, [])
    
    const value = {
        settings,
        setSettings,
        outputPath,
        setOutputPath,
        columnFilters,
        setColumnFilters
    }

    return (
        <SettingsContext.Provider value={value}>
            { children }
        </SettingsContext.Provider>
    )
}