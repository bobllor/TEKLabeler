import { useNavigate } from "react-router"
import delayFunc  from "../../utils.js"

export default function NavGroup({setLoading}){
    const navigate = useNavigate();

    const navNames = [
        {name: 'Incidents', url: '/incidents'},
        {name: 'Home', url: '/'},
        {name: 'Custom', url: '/custom'}
    ];

    const handleRedirect = (url) => {
        const path = window.location.pathname;

        if(path != url){
            setLoading(true);

            delayFunc(navigate, 500, url);
        }       
    }
    
    return (
        <>
            {navNames.map((data, i) => (
                <div 
                className='hover:bg-gray-400 rounded-[9px] px-2 py-1'
                onClick={() => {handleRedirect(data.url)}}
                key={i}>
                    <span>{data.name}</span>
                </div>
            ))}
        </>
    )
}