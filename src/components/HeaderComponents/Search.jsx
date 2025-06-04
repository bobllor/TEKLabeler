import { useRef } from 'react';
import { useTicketContext } from '../../context/TicketContext';
import { useAlertContext } from '../../context/AlertsContext';
import { useSettingsContext } from '../../context/SettingsContext';
import SearchIcon from '../../svgs/SearchIcon';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

export default function Search({ file, setLoading, showGuide }){
    const searchValue = useRef();
    const { ticketsClicked, setTicketsClicked, ticketNumbers } = useTicketContext();
    const { settings } = useSettingsContext();
    const { addAlertMessage } = useAlertContext();

    const navigate = useNavigate();

    const handleKeyDown = (e) => {  
        const value = searchValue.current.value.toUpperCase().trim();

        // only used for incidents or custom routes, returns a boolean if the current url matches the route.
        const checkUrl = (url) => {
            return window.location.pathname === url;
        }

        if(e.key === 'Enter' && value.trim() != ''){
            if(value in ticketNumbers.current && value.includes('RITM')){
                if(!ticketsClicked.has(value)){
                    setTicketsClicked(t => (
                        new Set([...t, value])
                    ))
                }
                
                window.pywebview.api.create_label(ticketNumbers.current[value]);
            }else if(value.includes('INC')){
                let url = '/incidents';

                if(!checkUrl(url)){
                    setLoading(true);
                }
                
                setTimeout(() => {
                    navigate(url, {state: {value: value}});
                }, !checkUrl(url) ? 500 : 0)
            }else if(value.includes('MAN')){
                let url = '/custom';
                
                // i tried not to do DRY, but the function doesn't work properly.
                // maybe i am just too dumb for this!
                if(!checkUrl(url)){
                    setLoading(true);
                }
                
                setTimeout(() => {
                    navigate(url, {state: {value: value}});
                }, !checkUrl(url) ? 500 : 0)
            }
            else{
                addAlertMessage(`Unable to find ${value}.`);
            }

            searchValue.current.value = '';
        }
    }

    useEffect(() => {
        const handleFocus = () => {
            const endPath = window.location.href.split('/').pop();

            const htmlFile = 'index.html';

            // handles prod (htmlFile & '') and dev ('/').
            if(endPath == htmlFile || endPath == '' || endPath == '/'){
                if(!showGuide){
                    searchValue.current.focus();
                }
            }
        }

        document.addEventListener('click', handleFocus);
        document.addEventListener('keydown', handleFocus);
    }, [showGuide])
        
    return (
        <>
            <div className="flex justify-center rounded-[18px] w-275 h-11 border-1
            shadow-[0_2px_8px_0_rgba(0,0,0,.15)] border-[#dfe1e5] bg-white">
                <div className="flex items-center w-full">
                    <div className='pl-3.5'>
                        <SearchIcon color={'black'} />
                    </div>
                    <div className='px-3 flex justify-center h-full w-full'>
                        <input type="search" className='text-black w-full outline-0' ref={searchValue}
                        placeholder={file ? 'Enter a RITM number' : 'Enter a file'}
                        disabled={settings ? true : false}
                        maxLength={15}
                        onKeyDown={e => handleKeyDown(e)}
                        spellCheck={false} />
                    </div>
                </div>
            </div>
        </>
    )
}