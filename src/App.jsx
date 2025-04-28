import { useState, useEffect, useRef } from "react"
import Settings from "./components/Settings";
import { useTicketContext } from "./context/TicketContext";
import { useSettingsContext } from "./context/SettingsContext";
import { useThemeContext } from "./context/ThemeContext";
import { useAlertContext } from "./context/AlertsContext";
import LoadScreen from "./components/LoadScreen";
import { Routes, Route, useNavigate } from 'react-router'
import Home from "./routes/Home"; 
import Custom from './routes/Custom';
import Header from "./components/Header";
import delayFunc from "./utils";
import Alert from "./components/Alert";
import DragDropOverlay from "./components/DragDropOverlay";

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

  const { addAlertMessage } = useAlertContext();

  // receive file input to send to the backend, returning a response made from the file input
  const uploadExcelFile = (fileData) => {
    const targetFile = fileData;
    
    // i don't remember why this was here. i don't think it is a good idea by removing it.
    if(!targetFile){
      return;
    }

    const extType = targetFile.name.split('.')[1];

    if(targetFile.name == file){
      addAlertMessage('Submitted file is already open.')
      return;
    }

    if(extType != 'xlsx'){
      addAlertMessage('Incorrect file submitted.');

      return;
    }
    
    const reader = new FileReader();
    
    // res will be either false or an object, this is to ensure that incorrect files
    // doesn't force a reload on an error.
    reader.onload = () => {
      pywebview.api.read_content(reader.result)
      .then(res => {
        if(res.status != 'error'){
          setLoading(true);
          setDataRes(res);
          setFile(targetFile.name);
        }else{
          addAlertMessage(res.message);
        }
      }).catch(() => {
          // only used for hard errors (hopefully doesn't happen).
          setError(true);
          addAlertMessage('Unable to read selected file. Try selecting another file.');
          window.location.reload();
      })
    }

    reader.readAsDataURL(targetFile);
  }

  // creates the set (or map i forgot which) for searching the ticket numbers
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

  // used to keep track of the file button in the header.
  const fileInputRef = useRef(null);

  // prevent key binds from being used.
  // TODO: add the following:
  // 1. hard reload | 2. help/how to use overlay (documentation)
  useEffect(() => {
    const keyEvent = (e) => {
        const shortcutNavigate = (url) => {
          const path = window.location.pathname;
          if(path != url){
            setLoading(true);
            delayFunc(navigate, 500, url);
          }
        }

        if(e.ctrlKey){
          switch(e.key){
            case 'f':
              e.preventDefault();
              fileInputRef.current.click();
              break;
            case 'o':
              e.preventDefault();
              setSettings(true);
              break;
            case '1':
              shortcutNavigate('/incidents')
              break;
            case '2':
              shortcutNavigate('/')
              break;
            case '3':
              shortcutNavigate('/custom');
              break;
          }
      }
    }

    document.addEventListener('keydown', keyEvent);

    return () => {
      document.removeEventListener('keydown', keyEvent);
    }
  }, [])

  // file drop related variables
  const [showDrag, setShowDrag] = useState(false);

  const dropZoneUploadExcel = (e) => {
      e.preventDefault();
      
      // in an event of an error, this ensures the drag is always shut off.
      if(showDrag){
          setShowDrag(false);
      }

      uploadExcelFile(e.dataTransfer.files[0]);
  }

  const handleDragOver = (e) => {
      let data = e.dataTransfer.items[0];
      e.preventDefault();

      if(data.kind !== 'string'){
          if(!showDrag){
            setShowDrag(true);
        }
      }else{
        e.stopPropagation();
      }
  }

  const handleDragLeave = (e) => {
    let data = e.dataTransfer.items[0];
      e.preventDefault();

      if(data.kind !== 'string'){
        if(showDrag){
          setShowDrag(false);
        }
      }else{
        e.stopPropagation();
      }
  }

  return (
    <>
      <Alert /> 
      <div className={`h-screen w-screen flex flex-col items-center justify-center default-background dark-element`}>
        {error && <div className={`h-screen w-screen absolute z-999`} />}
        {<LoadScreen loading={loading}/>}
        {settings && <Settings />}
        <Header 
        fileData={{file, fileInputRef}} 
        theme={{darkTheme, setDarkTheme}}
        setLoading={setLoading}
        utils={{uploadExcelFile, handleSettingsClick}} />
        <main className={`${!loading && 'animate-fade-in'} flex justify-center items-center 
          w-full h-full min-h-[calc(100vh-10.5rem)] max-h-[calc(100vh-10.5rem)] 
          flex-wrap overflow-y-auto gap-5 p-10`}
          onDragOver={e => handleDragOver(e)}
          onDragLeave={e => handleDragLeave(e)}
          onDrop={e => dropZoneUploadExcel(e)}>
            {showDrag && <DragDropOverlay />}
            <Routes>
              <Route path='/' element={<Home handleChange={uploadExcelFile} file={file} loading={loading} dataRes={dataRes} showDrag={showDrag} />} />
              <Route path='/incidents' element={<Custom incidentTemplate={true} showDrag={showDrag}/>}/>
              <Route path='/custom' element={<Custom incidentTemplate={false} showDrag={showDrag}/>}/>
            </Routes>
        </main>
      </div>
    </>
  )
}