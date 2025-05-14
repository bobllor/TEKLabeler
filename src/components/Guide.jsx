import Tab from "./GuideComponents/Tab"
import { useState, useEffect, useRef } from "react";
import Hamburger from "../svgs/Hamburger";
import TOC from "./GuideComponents/TOC";
import { useDataContext } from "../context/DataContext";
import { useThemeContext } from "../context/ThemeContext";
import TextContent from "./GuideComponents/TextContent";
import X from "../svgs/X"
import RightArrow from "../svgs/RightArrow";
import LeftArrow from "../svgs/LeftArrow";

export default function Guide({guide}){
    const {tabs, setTabs} = useDataContext();

    const [showTOC, setShowTOC] = useState(false);

    const { darkTheme } = useThemeContext();

    const handleTOCDisplay = () => {
        if(!showTOC){
            setShowTOC(true);
        }else{
            setShowTOC(false);
        }
    }

    // used to close out table of contents.
    const tocRef = useRef();

    useEffect(() => {
        const keyListener = (e) => {
            if(showTOC && e.key === 'Escape'){
                setShowTOC(false);
            }
        }

        document.addEventListener('keydown', keyListener);

        return () => {
            document.removeEventListener('keydown', keyListener);
        }
    }, [showTOC])

    // used for overflow on the tab header.
    const tabsContainer = useRef(null);
    const [showScrollArrow, setShowScrollArrow] = useState(false);

    const checkScrollWidth = () => {
        const tabScrollWidth = tabsContainer.current.scrollWidth;
        const tabClientWidth = tabsContainer.current.clientWidth;
        
        if(tabScrollWidth > tabClientWidth){
            setShowScrollArrow(true);
        }else{
            setShowScrollArrow(false);
        }
    }

    useEffect(() => {
        if(tabsContainer.current != null){
            checkScrollWidth();
        }
    }, [tabsContainer])

    const scrollTabsContainer = (scrollVal) => {
        if(tabsContainer.current != null){
            tabsContainer.current.scrollBy({
                left: scrollVal,
                behavior: "smooth"
            })
        }
    }
    
    const scrollAmount = 150;

    useEffect(() => {
        if(tabsContainer.current == null) return;

        const observer = new ResizeObserver(() => {
            checkScrollWidth();
        })

        observer.observe(tabsContainer.current);
    
        return () => observer.disconnect();
    }, [])
    
    // scroll to the top of the div whenever new content is loaded.
    const mainContentDiv = useRef(null);
    useEffect(() => {
        if(mainContentDiv.current){
            mainContentDiv.current.scrollTop = 0;
        }
    }, [tabs])

    const fillColor = darkTheme ? "white" : "black";

    return (
        <>
            <div className="w-[inherit] h-[inherit] bg-gray-400/30 absolute outline-0 
            flex items-center justify-center z-999 text-black backdrop-blur-xs">
                <div className="bg-white h-[90%] w-[90%] rounded-[10px] 
                p-3 pt-5 flex-col justify-items-center relative default-background">
                    <div className="h-10 w-full flex items-center px-2 relative
                    light-background shadow-[0_3px_8px_1px_rgba(0,0,0,.15)] rounded-[5px] justify-between">
                        <div className="flex h-[inherit] justify-center items-center gap-[2px] relative
                        overflow-x-auto w-[inherit]">
                            <div className="h-[77%] w-9 rounded-[5px] flex justify-center items-center
                                hover:bg-gray-500"
                                onClick={handleTOCDisplay}>
                                <Hamburger color={darkTheme ? "white" : "black"} />
                            </div>
                            <div className={`${showScrollArrow && `hover:bg-gray-500 rounded-[5px] h-[77%]
                            flex justify-center items-center`}`}
                            onClick={() => scrollTabsContainer(-scrollAmount)}>
                                <LeftArrow fill={showScrollArrow ? fillColor : "gray"}/>
                            </div>
                            <div className="flex h-[inherit] items-center gap-[2px]
                            overflow-x-auto hide-scroll w-full dark-element"
                            ref={tabsContainer}>
                                {
                                    tabs.map((ele, i) => (
                                        <Tab tabData={ele} setTabData={setTabs} key={i}/>
                                    ))
                                }
                            </div>
                            <div className={`${showScrollArrow && `hover:bg-gray-500 rounded-[5px] h-[77%]
                            flex justify-center items-center`}`}
                            onClick={() => scrollTabsContainer(scrollAmount)}>
                                <RightArrow fill={showScrollArrow ? fillColor : "gray"}/>
                            </div>
                            <div className="flex justify-center items-center rounded-[5px] p-1 hover:bg-gray-500"
                            onClick={() => guide.setShowGuide(prev => !prev)}>
                                <X color={fillColor}/>
                            </div>
                        </div>
                    </div>
                    {showTOC && 
                    <div className="bg-white/90 h-70 w-70 absolute shadow-[0_3px_8px_1px_rgba(0,0,0,.15)]
                    rounded-[5px] overflow-y-auto hide-scroll mt-2 lg:min-w-100 lg:min-h-100 flex justify-center"
                    ref={tocRef}>
                        <div className="h-[inherit] w-[inherit] p-3">
                            {
                                tabs.map((ele, i) => (
                                    ele.active &&
                                    <span className="flex flex-col items-center w-full gap-1" key={i}>
                                        <TOC tabData={ele}/>
                                    </span>
                                ))
                            }
                        </div>
                    </div>
                    }
                    <div className={`h-[inherit] prose prose-lg overflow-y-auto hide-scroll !min-w-150 !max-w-150 
                    lg:!min-w-230 lg:!max-w-230 light-background p-5 select-text ${darkTheme && 'dark:prose-invert'}
                    rounded-[5px] shadow-[0_3px_8px_1px_rgba(0,0,0,.15)] mt-3 !dark-element`}
                    ref={mainContentDiv}>
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