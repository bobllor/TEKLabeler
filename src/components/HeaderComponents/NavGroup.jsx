import { useNavigate } from "react-router"
import delayFunc  from "../../utils.js"

export default function NavGroup({setLoading}){
    const navigate = useNavigate();

    const navNames = [
        {name: 'Home', url: '/'},
        {name: 'Custom', url: '/custom'}
    ];

    const handleRedirect = (url) => {
        // NOTE: if you are in the development environment then BrowserRouter
        // must be used. HashRouter will make this always be / at all times.
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
                className='rounded-[5px] w-30 px-2 py-1 light-background light-hover
                shadow-[0_1px_3px_0_rgba(0,0,0,.15)] flex justify-center items-center'
                onClick={() => {handleRedirect(data.url)}}
                key={i}>
                    <span>{data.name}</span>
                </div>
            ))}
        </>
    )
}