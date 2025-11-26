import { useSettingsContext } from "../../../context/SettingsContext";
import RowTemplate from "./RowTemplate";

export default function SplitNameRow(){
    const { splitName, setSplitName } = useSettingsContext();

    return (
        <>
            <RowTemplate headerName={"First & Last Name Support"}>
                <div className="content-center"
                onClick={() => setSplitName(prev => !prev)}>
                    <div className="bg-white border-1
                    rounded-[5px] w-35 max-h-8 flex items-center justify-between">
                        <span className={`flex justify-center items-center
                        rounded-l-[4px] w-full ${splitName ? "bg-blue-300" : "bg-gray-400"}`}>
                            On
                        </span>
                        <span className={`flex justify-center items-center
                        rounded-r-[4px] w-full ${splitName ? "bg-gray-400" : "bg-blue-300"}`}>
                            Off
                        </span>
                    </div>
                </div>
            </RowTemplate>
        </>
    )
}