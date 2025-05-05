import Tab from "./GuideComponents/Tab"
import { useState } from "react";
import Hamburger from "../svgs/Hamburger";
import TOC from "./GuideComponents/TOC";
import { useDataContext } from "../context/DataContext";
import TextContent from "./GuideComponents/TextContent";

export default function Guide(){
    const {tabs, setTabs} = useDataContext();

    const [showTOC, setShowTOC] = useState(false);

    const handleTOCDisplay = () => {
        if(!showTOC){
            setShowTOC(true);
        }else{
            setShowTOC(false);
        }
    }

    return (
        <>
            <div className="w-[inherit] h-[inherit] bg-gray-400/30 absolute outline-0 
            flex items-center justify-center z-999 text-black backdrop-blur-xs">
                <div className="bg-white h-[90%] w-[90%] rounded-[10px] 
                p-3 pt-5 flex-col justify-items-center relative default-background">
                    <div className="h-10 w-full flex items-center px-2 gap-[2px] overflow-x-auto relative
                    light-background shadow-[0_3px_8px_1px_rgba(0,0,0,.15)] rounded-[5px]">
                        <div className="h-[90%] w-10 rounded-[5px] flex justify-center items-center hover:bg-gray-500"
                        onClick={handleTOCDisplay}>
                            <Hamburger />
                        </div>
                        {
                            tabs.map((ele, i) => (
                                <Tab tabData={ele} setTabData={setTabs} key={i}/>
                            ))
                        }
                    </div>
                    {showTOC && 
                    <div className="bg-white/90 h-70 w-70 absolute shadow-[0_3px_8px_1px_rgba(0,0,0,.15)]
                    rounded-[5px] overflow-y-auto hide-scroll mt-2">
                        <div className="h-[inherit] w-[inherit] p-3">
                            {
                                tabs.map((ele, i) => (
                                    ele.active &&
                                    <span className="flex flex-col" key={i}>
                                        <TOC tabData={ele}/>
                                    </span>
                                ))
                            }
                        </div>
                    </div>
                    }
                    <div className="h-[inherit] prose overflow-y-auto hide-scroll !min-w-150 !max-w-150 
                    lg:!min-w-230 lg:!max-w-230 light-background p-5
                    rounded-[5px] shadow-[0_3px_8px_1px_rgba(0,0,0,.15)] mt-3">
                        {tabs.map((ele, i) => (
                            ele.active &&
                            <div key={i}>
                                <TextContent textContent={ele.content}/>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}