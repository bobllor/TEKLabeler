import { useContext, createContext, useState, useEffect } from "react";
import { useTicketContext } from "./TicketContext";
import { useAlertContext } from "./AlertsContext";

const SettingsContext = createContext();

export const useSettingsContext = () => useContext(SettingsContext);

export const SettingsProvider = ({children}) => {
    const [settings, setSettings] = useState(false);

    const [outputPath, setOutputPath] = useState('');

    const [columnFilters, setColumnFilters] = useState(null);

    const [wordFilters, setWordFilters] = useState(null);

    const [splitName, setSplitName] = useState(false);

    // i moved this over to TicketContext because:
    // 1. TicketContext uses it to dynamically update the loading time, which only matters for the first
    // load due to some issues i had with Settings.jsx.
    // 2. SettingsContext is the child of TicketContext in main.jsx- i didn't want to update it.
    const { firstLoad } = useTicketContext();

    // TODO: maybe move this out and add a loading bar. this is because of a potential future async
    // call i am doing to fetch from github for dynamic updates. something to keep in mind.
    useEffect(() => {
        setTimeout(() => {
          window.pywebview.api.on_load().then(res => {
            setOutputPath(res.output_folder);
            setColumnFilters(res.column_filters);
            setSplitName(res.split_name);
        })
        }, 150)

        // LOL
        setTimeout(() => {
            window.pywebview.api.load_word_filters().then(res => {
                if(res.status == 'success'){
                    setWordFilters(res.data);
                }
            })
        }, 150)
    }, [])
    
    // handles column support for two names (first and last) instead of a single full name in the report.
    useEffect(() => {
        // prevents an overwrite on the backend by delaying this slightly.
        if(!firstLoad.current){
            setTimeout(() => {
                window.pywebview.api.set_split_name(splitName);
            }, 150)
        }
    }, [splitName, firstLoad])

    // used to reset the default values of user input:
    // columnFilters (hardware/software), wordFilters, and columnMapping
    const [resetDefaultType, setResetDefaultType] = useState(null);

    const { addAlertMessage } = useAlertContext();

    useEffect(() => {
        if(resetDefaultType != null){
            window.pywebview.api.reset_defaults(resetDefaultType).then(res => {
                if(res.status == 'success'){
                    addAlertMessage(res.message);
                }
            }).finally(() => {
                setResetDefaultType(null);
            });
        }
    }, [resetDefaultType])
    
    const value = {
        settings,
        setSettings,
        outputPath,
        setOutputPath,
        columnFilters,
        setColumnFilters,
        splitName,
        setSplitName,
        firstLoad,
        wordFilters,
        setWordFilters,
        setResetDefaultType
    }

    return (
        <SettingsContext.Provider value={value}>
            { children }
        </SettingsContext.Provider>
    )
}
