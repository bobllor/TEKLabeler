export default function DragDropOverlay(){
    return (
        <>
        <div className="w-[98%] h-[70%] rounded-[30px] bg-[rgb(107,108,220,.65)]
        absolute pointer-events-none z-1001">
            <div className="h-full w-full flex justify-center items-center">
                <span className="text-white text-3xl">
                    <strong>Drop file here</strong>
                </span>
            </div>
        </div>
        </>
    )
}