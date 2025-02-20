import { useState, useEffect, useRef } from "react"
import Search from "./components/Search";
import Settings from "./components/Settings";
import SettingsCog from "./svgs/SettingsCog";
import ToggleTheme from "./components/misc/ToggleTheme";
import { useTicketContext } from "./context/TicketContext";
import { useSettingsContext } from "./context/SettingsContext";
import { useThemeContext } from "./context/ThemeContext";
import LoadScreen from "./components/LoadScreen";
import SelectInput from "./components/SelectInput";
import { Routes, Route } from 'react-router'
import Home from "./routes/home";
import Incidents from "./routes/Incidents";

export default function App() {
  const { 
    file, 
    setFile, 
    ticketNumbers, 
    loading,
    setLoading
  } = useTicketContext();

  const { darkTheme, setDarkTheme } = useThemeContext();

  const { settings, setSettings } = useSettingsContext();

  const [ dataRes, setDataRes ] = useState({});

  const [ error, setError ] = useState(false);

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
      .then(res => setDataRes(res)).finally(
        setTimeout(() => {
          setLoading(false);
        }, 500)
      ).catch(err => {
          setError(true);
          alert(err)
          window.location.reload()
      })
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

  const fileInputRef = useRef(null);

  useEffect(() => {
    const keyEvent = (e) => {
        if(e.ctrlKey){
          switch(e.key){
              case 'f':
                  e.preventDefault();
                  fileInputRef.current.click();
                  break;
          }
      }
    }

    document.addEventListener('keydown', keyEvent);

    return () => {
      document.removeEventListener('keydown', keyEvent);
    }
  }, [])

  return (
    <>
      <div className={`h-screen w-screen flex flex-col items-center justify-center ${themeStyles}`}>
        {error && <div className={`h-screen w-screen absolute z-999 ${themeStyles}`}></div>}
        {<LoadScreen loading={loading}/>}
        {settings && <Settings />}
        <div className={`w-full max-h-42 min-h-42 p-3 flex flex-col text-white 
          ${!darkTheme ? 'border-b-1 border-b-gray-400 shadow-[0_1px_3px_0_rgba(0,0,0,.15)]' : 
          'border-b-1 border-[rgb(112,111,111)]'}`}>
            <div className="h-100 w-full flex justify-center pt-5">
              <Search file={file} />
            </div>
            <div className="flex relative">
              <div className="left-0">
                <SelectInput file={file} fileInputRef={fileInputRef} onFileChange={handleChange} />
              </div>
              <div className="flex right-0 absolute justify-center items-center gap-3">
                <div onClick={handleSettingsClick} className="h-7 w-7 hover:bg-gray-600/40 rounded-[9px] flex justify-center items-center">
                  <SettingsCog color={!darkTheme ? 'black' : 'white'}/>
                </div>
                <div>
                  <ToggleTheme darkTheme={darkTheme} setDarkTheme={setDarkTheme} />
                </div>
              </div>
            </div>
          </div>
        <main className={`${!loading && 'animate-fade-in'} flex justify-center ${loading && 'items-center'} 
          w-full h-full min-h-[calc(100vh-10.5rem)] max-h-[calc(100vh-10.5rem)] flex-wrap overflow-y-auto gap-5 p-10`}>
            <Routes>
              <Route path='/' element={<Home handleChange={handleChange} file={file} loading={loading} dataRes={dataRes} />} />
              <Route path='/incidents' element={<Incidents />}/>
            </Routes>
        </main>
      </div>
    </>
  )
}