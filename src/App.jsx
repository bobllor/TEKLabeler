import { useState, useRef, useEffect } from "react"
import FileInput from "./components/FileInput"
import TicketBox from "./components/TicketBox";
import Search from "./components/Search";
import { useTicketContext } from "./context/TicketContext";

export default function App() {
  const { file, setFile, ticketNumbers } = useTicketContext();

  const [ dataRes, setDataRes ] = useState({});

  // receive file input to send to the backend, returning a response made from the file input
  const handleChange = (e) => {
    const targetFile = e.target.files[0];

    const extType = targetFile.name.split('.')[1];

    if(extType != 'xlsx' && extType != 'csv'){
        alert('Incorrect file.');

        return;
    }
    
    const reader = new FileReader();

    reader.onload = () => {
      pywebview.api.read_content(reader.result)
      .then(res => setDataRes(res))
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

  return (
    <>
      <div className='h-screen w-screen flex flex-col items-center justify-center font-mono'>
        <div className="w-full max-h-42 min-h-42 border-b-1 border-[#2b2a2c] p-3 flex flex-col text-white">
            <div className="h-100 w-full flex justify-center pt-5">
              <Search file={file} />
            </div>
            <div className="flex justify-end">
              {file && <FileInput onFileChange={handleChange} />}
            </div>
        </div>
        <main className={`flex justify-center w-full h-full min-h-[calc(100vh-10.5rem)] 
          max-h-[calc(100vh-10.5rem)] flex-wrap overflow-y-auto gap-5 p-10`}>
          {!file && <FileInput onFileChange={handleChange} />}
          {file && <TicketBox props={dataRes}/>}
        </main>
      </div>
    </>
  )
}