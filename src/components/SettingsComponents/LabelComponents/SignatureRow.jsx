import { useSettingsContext } from "../../../context/SettingsContext";
import RowTemplate from "./RowTemplate";

export default function SignatureRow(){
    const { enableSigLabel, setEnableSigLabel } = useSettingsContext();

    return (
        <>
            <RowTemplate headerName={"Use Label with Signatures"}>
                <div className="content-center"
                onClick={() => setEnableSigLabel(prev => !prev)}>
                    <div className="bg-white border-1
                    rounded-[5px] w-35 max-h-8 flex items-center justify-between">
                        <span className={`flex justify-center items-center
                        rounded-l-[4px] w-full ${enableSigLabel ? "bg-blue-300" : "bg-gray-400"}`}>
                            On
                        </span>
                        <span className={`flex justify-center items-center
                        rounded-r-[4px] w-full ${enableSigLabel ? "bg-gray-400" : "bg-blue-300"}`}>
                            Off
                        </span>
                    </div>
                </div>
            </RowTemplate>
        </>
    )
}