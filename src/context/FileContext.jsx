import { useContext, createContext, useState, useEffect } from "react";

const FileContext = createContext();

export const useFileContext = () => useContext(FileContext);

/**
 * Global data of the entire program.
 * @param {*} children - Components wrapped by the provider.
 */
export const FileProvider = ({ children }) => {
    // sets the file buffer after uploading the file.
    // only used for when the filter is updated.
    const [uploadedFileInfo, setUploadedFileInfo] = useState('');

    const data = {
        uploadedFileInfo,
        setUploadedFileInfo,
    }

    return (
        <FileContext.Provider value={data}>
            { children }
        </FileContext.Provider>
    )
}