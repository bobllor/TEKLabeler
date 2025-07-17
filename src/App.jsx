import { useState, useEffect, useRef } from "react"
import Settings from "./components/Settings";
import { useTicketContext } from "./context/TicketContext";
import { useSettingsContext } from "./context/SettingsContext";
import { useAlertContext } from "./context/AlertsContext";
import LoadScreen from "./components/LoadScreen";
import { Routes, Route } from 'react-router'
import Home from "./routes/Home"; 
import Custom from './routes/Custom';
import Header from "./components/Header";
import { useKeyPresses } from "./utils/useKeyPresses";
import Alert from "./components/Alert";
import DragDropOverlay from "./components/DragDropOverlay";
import Guide from "./components/Guide";
import { useDataContext } from "./context/DataContext";
import { useModalContext } from "./context/ModalContext";
import Modal from "./components/Modal";

export default function App() {
  const { 
    file, 
    setFile, 
    ticketNumbers, 
    loading,
    setLoading
  } = useTicketContext();

  const { settings, setSettings } = useSettingsContext();

  const [ dataRes, setDataRes ] = useState({});

  const [ error, setError ] = useState(false);

  const { addAlertMessage } = useAlertContext();

  const { uploadedFileInfo, setUploadedFileInfo } = useDataContext();

  /**
     * Upload the excel file to the backend for further processing.
     * @param {File} fileData - Uploaded excel file.
     * @param {boolean} loadStatus - Boolean used to start the loading process. By default it is True.
     */
  const uploadExcelFile = (fileData, loadStatus = true) => {
    fileInputRef.current.value = null;

    const targetFile = fileData;
    
    // i don't remember why this was here. i don't think it is a good idea by removing it.
    // 5/3/2025 - i was right.
    // this is good to handle an empty fileData regarding when i update the filters.
    if(!targetFile){
      return;
    }

    // idiot
    const tempArr = targetFile.name.split('.');
    const extType = tempArr[tempArr.length - 1];

    // loadStatus will normally always be true, except when updating filters.
    // is this a hack? yes...
    if(targetFile.name == file && loadStatus){
      addAlertMessage('Submitted file is already open.')
      return;
    }

    if(extType != 'xlsx'){
      addAlertMessage(`Unsupported file type ${extType}. Only type .xlsx is supported.`);
      return;
    }
    
    const reader = new FileReader();
    
    // res will be either false or an object, this is to ensure that incorrect files
    // doesn't force a reload on an error.
    reader.onload = () => {
      pywebview.api.read_content(reader.result)
      .then(res => {
        if(res.status != 'error'){
          // this will be used to reload the file only when the filters are updated.
          if(uploadedFileInfo != fileData){
            setUploadedFileInfo(fileData);
          }
          
          if(loadStatus){
            setLoading(true);
          }

          setDataRes(res);
          setFile(targetFile.name);
        }else{
          addAlertMessage(res.message);
        }
      }).catch(() => {
          // only used for hard errors (hopefully doesn't happen).
          setError(true);
          setUploadedFileInfo('');
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

  const [ showGuide, setShowGuide ] = useState(false);

  // prevents certain key shortcuts from being executed.
  useKeyPresses(fileInputRef, loading, setLoading, setShowGuide, setSettings);

  const { showModal, handleConfirm, handleCancel } = useModalContext();
  
  return (
    <>
      <Alert /> 
      <div 
      className={`z-1 absolute h-full w-full ${showDrag && "pointers-"}`}
      onDragOver={e => e.preventDefault()}
      onDrop={e => e.preventDefault()} />
      <div className={`h-screen w-screen flex flex-col items-center justify-center default-background dark-element`}>
        {error && <div className={`h-screen w-screen absolute z-999`} />}
        {<LoadScreen loading={loading}/>}
        {settings && <Settings uploadExcelFile={uploadExcelFile} />}
        {showGuide && <Guide guide={{setShowGuide}}/>}
        {showModal && <Modal cancel={handleCancel} confirm={handleConfirm} />}
        <Header 
        fileData={{file, fileInputRef}}
        setLoading={setLoading}
        utils={{uploadExcelFile, handleSettingsClick}}
        guide={{showGuide, setShowGuide}} />
        <main className={`${!loading && 'animate-fade-in'} flex justify-center items-center 
          w-full h-full min-h-[calc(100vh-10.5rem)] max-h-[calc(100vh-10.5rem)] 
          z-5 flex-wrap overflow-y-auto gap-5 p-10`}
          onDragOver={e => handleDragOver(e)}
          onDragLeave={e => handleDragLeave(e)}
          onDrop={e => dropZoneUploadExcel(e)}>
            {showDrag && <DragDropOverlay />}
            <Routes>
              <Route path='/' element={<Home uploadExcelFile={uploadExcelFile} file={file} loading={loading} dataRes={dataRes} showDrag={showDrag} />} />
              <Route path='/incidents' element={<Custom incidentTemplate={true} showDrag={showDrag}/>}/>
              <Route path='/custom' element={<Custom incidentTemplate={false} showDrag={showDrag}/>}/>
            </Routes>
        </main>
      </div>
    </>
  )
}