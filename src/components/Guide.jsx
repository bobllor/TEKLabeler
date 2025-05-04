import Tab from "./GuideComponents/Tab"
import { useState } from "react";
import Hamburger from "../svgs/Hamburger";
import TOC from "./GuideComponents/TOC";

export default function Guide(){
    // TODO: will be filled by a backend call later.
    const [tabs, setTabs] = useState([
        {id: 'name-1', text: 'example 1', active: true, toc: ['#hello-there', '#example-heading']},
        {id: 'name-2', text: 'example 2', active: false, toc: ['#this-is-a-work-in-progress']}
    ]);

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
                p-3 pt-5 flex-col justify-items-center relative">
                    <div className="border-2 h-10 w-full flex items-center px-2 gap-[2px] overflow-x-auto">
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
                    <div className="bg-white h-40 w-40 absolute border-1">
                        <div className="h-[inherit] w-[inherit] p-3">
                            {
                                tabs.map((ele, i) => (
                                    ele.active &&
                                    <span className="flex flex-col" key={i}>
                                        <TOC eleHrefArr={ele.toc}/>
                                    </span>
                                ))
                            }
                        </div>
                    </div>
                    }
                    <div className="pt-3 h-[inherit] prose overflow-y-auto scroll-smooth">
                        <div>
                            <h1 id="hello-there">Hello There</h1>
                            <p>LONG TEXT TO MAKE THIS OVERFLOW.</p>
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <h2 id="example-heading">Example Heading</h2>
                            <p>Some very long text here. I don't know I just work here.</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}