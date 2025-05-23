import { useTicketContext } from "../context/TicketContext";
import TicketCard from "./TicketBoxComponents/TicketCard";
import { useRef } from "react";

export default function TicketBox({props, showDrag}){
    const { ticketsClicked, setTicketsClicked } = useTicketContext();
    const throttleFlag = useRef(false);

    return (
        <>  
            {props.status === 'success' && props.data.sort((a, b) => a.number.localeCompare(b.number)).map((value, id) => (
                <TicketCard props={value} tracker={{ticketsClicked, setTicketsClicked}} 
                throttleFlag={throttleFlag} key={id} showDrag={showDrag} />
            ))}
        </>
    )
}