import FileInput from "../components/FileInput"
import TicketBox from "../components/TicketBox"

export default function Home({handleChange, file, loading, dataRes, showDrag}){
    return (
        <>
            {!loading &&
            <>
            {!file && <FileInput onFileChange={handleChange} showDrag={showDrag} />}
            {file && <TicketBox props={dataRes} showDrag={showDrag}/>}
            </>}
        </>
    )
}