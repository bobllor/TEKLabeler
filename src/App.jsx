import { useState, useEffect, useRef } from "react"
import Settings from "./components/Settings";
import { useTicketContext } from "./context/TicketContext";
import { useSettingsContext } from "./context/SettingsContext";
import { useThemeContext } from "./context/ThemeContext";
import LoadScreen from "./components/LoadScreen";
import { Routes, Route, useNavigate } from 'react-router'
import Home from "./routes/home";
import Incidents from "./routes/Incidents";
import Custom from './routes/Custom';
import Header from "./components/Header";
import delayFunc from "./utils";

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

  const navigate = useNavigate();

  // receive file input to send to the backend, returning a response made from the file input
  const handleChange = (e) => {
    const targetFile = e.target.files[0];
    
    if(!targetFile){
      return;
    }

    const extType = targetFile.name.split('.')[1];

    if(targetFile.name == file){
      return;
    }

    if(extType != 'xlsx' && extType != 'csv'){
        alert('Incorrect file.');

        return;
    }

    setLoading(true);
    
    const reader = new FileReader();

    reader.onload = () => {
      pywebview.api.read_content(reader.result)
      .then(res => setDataRes(res)).finally(
        delayFunc(navigate, 500, '/')
      ).catch(() => {
          setError(true);
          alert('Unable to read selected file. Try selecting another file.')
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

  // used as a prop for routing components
  const handleCustomSubmit = (e) => {
      e.preventDefault();

      const formData = e.target.elements;

      const isIncident = formData[0].value.includes('INC') ? true : false;
      let formObject = {};

      for(let i = 0; i < formData.length; i++){
          if(formData[i].tagName != 'BUTTON'){
            formObject[formData[i].name.replace('Input', '')] = formData[i].value;
            formData[i].value = '';
          }
      }

      window.pywebview.api.create_custom_label(formObject, isIncident);
  }

  return (
    <>
      <div className={`h-screen w-screen flex flex-col items-center justify-center ${themeStyles}`}>
        {error && <div className={`h-screen w-screen absolute z-999 ${themeStyles}`} />}
        {<LoadScreen loading={loading}/>}
        {settings && <Settings />}
        <Header 
        fileData={{file, fileInputRef}} 
        theme={{darkTheme, setDarkTheme}}
        setLoading={setLoading}
        utils={{handleChange, handleSettingsClick}} />
        <main className={`${!loading && 'animate-fade-in'} flex justify-center ${loading && 'items-center'} 
          w-full h-full min-h-[calc(100vh-10.5rem)] max-h-[calc(100vh-10.5rem)] flex-wrap overflow-y-auto gap-5 p-10`}>
            <Routes>
              <Route path='/' element={<Home handleChange={handleChange} file={file} loading={loading} dataRes={dataRes} />} />
              <Route path='/incidents' element={<Incidents handleSubmit={handleCustomSubmit}/>}/>
              <Route path='/custom' element={<Custom handleSubmit={handleCustomSubmit} />}/>
            </Routes>
        </main>
      </div>
    </>
  )
}