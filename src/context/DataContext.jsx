import { useContext, createContext, useState, useEffect } from "react";

const DataContext = createContext();

export const useDataContext = () => useContext(DataContext);

/**
 * Global data of the entire program.
 * @param {*} children - Components wrapped by the provider.
 */
export const DataProvider = ({ children }) => {
    // sets the file buffer after uploading the file.
    // only used for when the filter is updated.
    const [uploadedFileInfo, setUploadedFileInfo] = useState('');

    const [tabs, setTabs] = useState([]);

    useEffect(() => {
        setTimeout(() => {
            window.pywebview.api.on_load_guide_content().then(res => {
                setTabs(res.data);
            })
        }, 500);
    }, [])

    const data = {
        uploadedFileInfo,
        setUploadedFileInfo,
        tabs,
        setTabs
    }

    return (
        <DataContext.Provider value={data}>
            { children }
        </DataContext.Provider>
    )
}