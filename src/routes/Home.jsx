import FileInput from "../components/FileInput"
import TicketBox from "../components/TicketBox"

export default function Home({uploadExcelFile, file, loading, dataRes, showDrag}){
    return (
        <>
            {!loading &&
            <>
            {!file && <FileInput uploadExcelFile={uploadExcelFile} showDrag={showDrag} />}
            {file && <TicketBox props={dataRes} showDrag={showDrag}/>}
            </>}
        </>
    )
}