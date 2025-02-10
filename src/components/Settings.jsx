import { useTicketContext } from "../context/TicketContext";

export default function Settings(){
    const { outputPath, setOutputPath } = useTicketContext();
    const handleOutputLocation = () => {
        window.pywebview.api.set_output().then(res => setOutputPath(res.output_folder));
    }

    const handleUploadLogo = () => {
        window.pywebview.api.upload_logo();
    }

    return (
        <>
        <div className="w-[inherit] h-[inherit] bg-white/30 absolute flex justify-center items-center z-999 text-black">
            <div className="w-90 h-50 bg-blue-100 border-2 rounded-[20px]">
                <p>{outputPath}</p>
                <button className="hover:bg-white/50" onClick={handleOutputLocation}>what the hell</button>
                <button className="hover:bg-white/50" onClick={handleUploadLogo}>what the hell<sup>2</sup></button>
            </div>
        </div>
        </>
    )
}