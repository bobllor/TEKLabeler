import { useContext, createContext, useState, useEffect, useMemo } from "react";
import { useTicketContext } from "./TicketContext";

const SettingsContext = createContext();

export const useSettingsContext = () => useContext(SettingsContext);

export const SettingsProvider = ({children}) => {
    const [settings, setSettings] = useState(false);

    const [outputPath, setOutputPath] = useState('');

    const { setLoading } = useTicketContext();

    const [columnFilters, setColumnFilters] = useState(null);

    const [ splitName, setSplitName ] = useState(false);

    // could be better? this does fix the issue with pywebview being injected late.
    useEffect(() => {
        setTimeout(() => {
          window.pywebview.api.on_load().then(res => {
            setOutputPath(res.output_folder);
            setColumnFilters(res.column_filters);
            setSplitName(res.split_name);
        })
          setLoading(false);
        }, 500)
    }, [])

    // handles column support for two names (first and last) instead of a single full name in the report.
    useEffect(() => {
        setTimeout(() => {
            window.pywebview.api.set_split_name(splitName);
        }, 500)
    }, [splitName])
    
    const value = {
        settings,
        setSettings,
        outputPath,
        setOutputPath,
        columnFilters,
        setColumnFilters,
        splitName,
        setSplitName,
    }

    return (
        <SettingsContext.Provider value={value}>
            { children }
        </SettingsContext.Provider>
    )
}