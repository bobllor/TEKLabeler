import { useSettingsContext } from "../../../context/SettingsContext";

export default function SplitNameRow(){
    const { splitName, setSplitName } = useSettingsContext();

    return (
        <>
            <div className="flex">
                <p className="w-[50%] flex justify-center items-center text-center">
                    <strong>First & Last Name Support</strong>
                </p>
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
            </div>
        </>
    )
}