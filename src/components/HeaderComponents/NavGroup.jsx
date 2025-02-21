import { useNavigate } from "react-router"

export default function NavGroup({setLoading}){
    const navigate = useNavigate();

    const handleRedirect = (url) => {
        const path = window.location.pathname;

        if(path != url){
            setLoading(true);

            setTimeout(() => {
                navigate(url);
                setLoading(false);
            }, 500)
        }       
    }

    const navStyles = 'hover:bg-gray-400 rounded-[9px] px-2 py-1';

    return (
        <>
            <div 
            className={navStyles}
            onClick={() => {handleRedirect('/incidents')}}>  
                <span>Incident</span>
            </div>
            <div 
            className={navStyles}
            onClick={() => {handleRedirect('/')}}>
                <span>Home</span>
            </div>
            <div
            className={navStyles}
            onClick={() => {console.log('temp hold')}}>
                <span>Custom</span>
            </div>
        </>
    )
}