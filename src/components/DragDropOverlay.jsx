export default function DragDropOverlay(){
    return (
        <>
        <div className="w-[98%] h-[81%] rounded-[30px] bg-[rgb(107,108,220,.65)]
        absolute pointer-events-none z-1001">
            <div className="h-full w-full flex justify-center items-center pointer-events-none">
                <span className="text-white text-3xl pointer-events-none">
                    <strong className="pointer-events-none">Drop file here</strong>
                </span>
            </div>
        </div>
        </>
    )
}