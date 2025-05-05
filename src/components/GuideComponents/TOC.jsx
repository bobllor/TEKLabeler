
/**
 * Creates the Table of Contents (TOC) for the TOC drop down.
 * @param tabData {Array.<string>} - Array of ids for the headers.
 */
export default function TOC({tabData}){
    const scrollToHeader = (e) => {
        const scrollTarget = document.querySelector(e.target.id);
        
        scrollTarget.scrollIntoView({behavior: "smooth"});
    }
    
    return (
        <>
            {tabData.toc.map((ele, i) => (
                <div className="hover:bg-gray-400 w-[inherit] h-[inherit] p-1 flex items-center rounded-[5px]"
                id={'#' + ele.id}
                key={i}
                onClick={(e) => scrollToHeader(e)}>
                    {ele.label}
                </div>
            ))}
        </>
    )
}