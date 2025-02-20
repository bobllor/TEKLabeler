import FileInput from "../components/FileInput"
import TicketBox from "../components/TicketBox"

export default function Home({handleChange, file, loading, dataRes}){
    return (
        <>
            {!loading &&
            <>
            {!file && <FileInput onFileChange={handleChange} />}
            {file && <TicketBox props={dataRes}/>}
            </>}
        </>
    )
}