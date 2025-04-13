import { useState, useEffect, useRef } from "react"
import Settings from "./components/Settings";
import { useTicketContext } from "./context/TicketContext";
import { useSettingsContext } from "./context/SettingsContext";
import { useThemeContext } from "./context/ThemeContext";
import { useAlertContext } from "./context/AlertsContext";
import LoadScreen from "./components/LoadScreen";
import { Routes, Route, useNavigate } from 'react-router'
import Home from "./routes/home"; 
import Custom from './routes/Custom';
import Header from "./components/Header";
import delayFunc from "./utils";
import Alert from "./components/Alert";

export default function App() {
  const { 
    file, 
    setFile, 
    ticketNumbers, 
    loading,
    setLoading
  } = useTicketContext();

  // i am not sure why, but i cannot set dark on the body
  // i have to manually set this up for all dark mode changes.
  // TODO: create a custom class that will be modified this being changed.
  const { darkTheme, setDarkTheme } = useThemeContext();

  const { settings, setSettings } = useSettingsContext();

  const [ dataRes, setDataRes ] = useState({});

  const [ error, setError ] = useState(false);

  const navigate = useNavigate();

  const { addAlertMessage } = useAlertContext();

  // receive file input to send to the backend, returning a response made from the file input
  const uploadExcelFile = (fileData) => {
    const targetFile = fileData;
    
    if(!targetFile){
      return;
    }

    const extType = targetFile.name.split('.')[1];

    if(targetFile.name == file){
      return;
    }

    if(extType != 'xlsx'){
      addAlertMessage('Incorrect file entered.');

      return;
    }

    setLoading(true);
    
    const reader = new FileReader();
    
    // res will be either false or an object, this is to ensure that incorrect files
    // doesn't force a reload on an error.
    reader.onload = () => {
      pywebview.api.read_content(reader.result)
      .then(res => {
        if(res != false){
          setDataRes(res)
          setFile(targetFile.name);
        }else{
          alert('Columns in the file are not supported.')
        }
      }).finally(
        delayFunc(navigate, 500, '/')
      ).catch(() => {
          setError(true);
          alert('Unable to read selected file. Try selecting another file.');
          window.location.reload();
      })
    }

    reader.readAsDataURL(targetFile);
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

  // used to keep track of the file button in the header.
  const fileInputRef = useRef(null);

  // prevent key binds from being used.
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
      <Alert /> 
      <div className={`h-screen w-screen flex flex-col items-center justify-center ${themeStyles}`}>
        {error && <div className={`h-screen w-screen absolute z-999 ${themeStyles}`} />}
        {<LoadScreen loading={loading}/>}
        {settings && <Settings />}
        <Header 
        fileData={{file, fileInputRef}} 
        theme={{darkTheme, setDarkTheme}}
        setLoading={setLoading}
        utils={{uploadExcelFile, handleSettingsClick}} />
        <main className={`${!loading && 'animate-fade-in'} flex justify-center items-center 
          w-full h-full min-h-[calc(100vh-10.5rem)] max-h-[calc(100vh-10.5rem)] flex-wrap overflow-y-auto gap-5 p-10`}>
            <Routes>
              <Route path='/' element={<Home handleChange={uploadExcelFile} file={file} loading={loading} dataRes={dataRes} />} />
              <Route path='/incidents' element={<Custom incidentTemplate={true}/>}/>
              <Route path='/custom' element={<Custom incidentTemplate={false} />}/>
            </Routes>
        </main>
      </div>
    </>
  )
}