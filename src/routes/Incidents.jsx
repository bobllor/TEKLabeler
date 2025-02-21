import { useLocation } from "react-router";

export default function Incidents(){
    const location = useLocation();

    const value = location.state ? location.state.value : null;

    return (
        <>
            {value} REPLACE_ME_LATER
        </>
    )
}