import { useEffect } from "react";
import { useNavigate } from "react-router";
import delayFunc from "../utils";

export function useKeyPresses(fileInputRef, loading, setLoading, setShowGuide, setSettings){
    const navigate = useNavigate();

    // prevent key binds from being used.
    // i am so sorry for this...
    useEffect(() => {
        if(!loading){
            const keyEvent = (e) => {
            const shortcutNavigate = (url) => {
            const path = window.location.pathname;
                if(path != url){
                    setLoading(true);
                    delayFunc(navigate, 500, url);
                }
            }

            if(e.ctrlKey){
                switch(e.key){
                    case 'f':
                        e.preventDefault();
                        fileInputRef.current.click();
                    break;
                    case 'o':
                        e.preventDefault();
                        setSettings(prev => !prev);
                    break;
                    case 'r':
                        // hard reset.
                        e.preventDefault();
                        window.location.reload();
                    break;
                    case 'h':
                        setShowGuide(prev => !prev);
                    break;
                    case 'a':
                    case 'Backspace':
                    case 'v':
                    case 'c':
                    case 'x':
                    break;
                    case 'ArrowDown':
                    case 'ArrowUp':
                    case 'ArrowLeft':
                    case 'ArrowRight':
                    break;
                    case '1':
                        shortcutNavigate('/incidents')
                    break;
                    case '2':
                        shortcutNavigate('/')
                    break;
                    case '3':
                        shortcutNavigate('/custom');
                    break;
                    default:
                    // stop every shortcut but these values.
                        e.preventDefault();
                        break;
                    }
                }
            }

            document.addEventListener('keydown', keyEvent);

            return () => {
                document.removeEventListener('keydown', keyEvent);
            }
        }
    }, [loading])
}