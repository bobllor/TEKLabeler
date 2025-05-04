
/**
 * Creates the Table of Contents (TOC) for the TOC drop down.
 * @param eleHrefArr {Array.<string>} - Array of strings that represents the header tags for quick access.
 */
export default function TOC({eleHrefArr}){
    return (
        <>
            {eleHrefArr.map((href, i) => (
                <div className="hover:bg-gray-400">
                    <a className="w-[inherit] h-[inherit]"
                    href={href} key={i}>{href.replace('-', ' ').replace('#', ' ')}</a>
                </div>
            ))}
        </>
    )
}