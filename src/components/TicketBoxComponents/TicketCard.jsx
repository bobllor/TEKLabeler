export default function TicketCard({ props, tracker, throttleFlag, showDrag }){
    const handleClick = () => {
        if(!tracker.ticketsClicked.has(props.number)){
            tracker.setTicketsClicked(t => (
                new Set([...t, props.number])
            ))
        }
        
        window.pywebview.api.create_label(props);
    }

    const useThrottle = (func, delay) => {
        return function (...args) {
            if(!throttleFlag.current){
                func(...args);
                throttleFlag.current = true;
    
                setTimeout(() => {
                    throttleFlag.current = false;
                }, delay)
            }
        }
    }

    const throttleClick = useThrottle(handleClick, 500)

    return (
        <>
            <div className={`animate-wipe-down border-1 border-[rgba(255,255,255,0.15)] flex flex-col
            rounded-[20px] h-50 w-40 p-2 shadow-[0_3px_8px_1px_rgba(0,0,0,.15)]
            transform hover:scale-125 hover:z-60 transition duration-150 overflow-y-scroll 
            hide-scroll light-background ${showDrag && 'pointer-events-none'}`} 
            onClick={throttleClick}>
                <div className="relative w-full flex justify-center">
                    <div className={`after:content-[''] after:absolute after:w-full after:h-[2px] after:bottom-0 after:left-0
                    after:rounded-[20px] after:transition-background-colors after:duration-400
                    ${!tracker.ticketsClicked.has(props.number) ? 'after:bg-red-600' : 'after:bg-green-600'}`}>
                        {props.number.toUpperCase()}
                    </div>
                </div>
                <div className="text-[15px]">
                    {props.short_description}
                </div>
                <span className="pt-1">
                    {`${props.full_name}`}
                </span>
                <span className="text-[13px] pt-2">
                    <p>{`Hardware amount: ${props.hardware_requested.length}`}</p>
                    <p>{`Software amount: ${props.software_requested.length}`}</p>
                </span>
            </div>
        </>
    )
}