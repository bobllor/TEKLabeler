import { useState, useEffect } from "react"
import FileInput from "./components/FileInput"
import TicketBox from "./components/TicketBox";
import Search from "./components/Search";
import Settings from "./components/Settings";
import SettingsCog from "./svgs/SettingsCog";
import { useTicketContext } from "./context/TicketContext";
import { useSettingsContext } from "./context/SettingsContext";
import { useThemeContext } from "./context/ThemeContext";
import LoadSpinner from "./components/LoadSpinner";
import SelectInput from "./components/SelectInput";

export default function App() {
  const { 
    file, 
    setFile, 
    ticketNumbers, 
    loading,
    setLoading
  } = useTicketContext();

  const { darkTheme } = useThemeContext();

  const { settings, setSettings } = useSettingsContext();

  const [ dataRes, setDataRes ] = useState({});

  // receive file input to send to the backend, returning a response made from the file input
  const handleChange = (e) => {
    const targetFile = e.target.files[0];

    const extType = targetFile.name.split('.')[1];

    if(extType != 'xlsx' && extType != 'csv'){
        alert('Incorrect file.');

        return;
    }

    setLoading(true);
    
    const reader = new FileReader();

    reader.onload = () => {
      pywebview.api.read_content(reader.result)
      .then(res => setDataRes(res))
      .finally(setLoading(false))
    }

    reader.readAsDataURL(targetFile);

    setFile(targetFile.name);
  }

  useEffect(() => {
    if(dataRes.status === 'success'){
      dataRes.data.forEach(element => {
        ticketNumbers.current[element.number] = element;
      });
    }
  }, [dataRes])

  const handleSettingsClick = () => {
    setSettings(true);
  }

  const themeStyles = darkTheme ? 'bg-[#171617] text-white' : 'bg-white text-black';

  return (
    <>
      <div className={`h-screen w-screen flex flex-col items-center justify-center font-mono ${themeStyles}`}>
        {settings && <Settings />}
        <div className="w-full max-h-42 min-h-42 border-b-1 border-[#2b2a2c] p-3 flex flex-col text-white">
            <div className="h-100 w-full flex justify-center pt-5">
              <Search file={file} />
            </div>
            <div className="flex justify-between">
                <SelectInput file={file} />
              <div onClick={handleSettingsClick} className="h-7 w-7 hover:bg-gray-600/40 rounded-[9px] flex justify-center items-center">
                <SettingsCog />
              </div>
            </div>
        </div>
        <main className={`${!loading && 'animate-fade-in'} flex justify-center ${loading && 'items-center'} w-full h-full
          min-h-[calc(100vh-10.5rem)] max-h-[calc(100vh-10.5rem)] 
          flex-wrap overflow-y-auto gap-5 p-10`}>
          {loading ? <LoadSpinner /> : 
          <>
          {!file && <FileInput onFileChange={handleChange} />}
          {file && <TicketBox props={dataRes}/>}
          </>}
        </main>
      </div>
    </>
  )
}