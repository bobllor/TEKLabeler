import { useRef } from 'react';
import { useTicketContext } from '../context/TicketContext';
import searchLogo from '/search.svg';

export default function Search({ file }){
    const searchValue = useRef();
    const { ticketsClicked, setTicketsClicked, ticketNumbers } = useTicketContext();

    const handleKeyDown = (e) => {  
        const value = searchValue.current.value.toUpperCase().trim();
        if(e.key === 'Enter' && value.trim() != ''){
            if(value in ticketNumbers.current){
                if(!ticketsClicked.has(value)){
                    setTicketsClicked(t => (
                        new Set([...t, value])
                    ))
                }
                
                window.pywebview.api.create_label(ticketNumbers.current[value]);
            }else{
                alert('RITM is not found.');
            }

            searchValue.current.value = '';
        }
    }

    return (
        <>
            <div className="flex justify-center rounded-[18px] w-275 h-11 border-[#2b2a2c] bg-white">
                <div className="flex items-center w-full">
                    <img src={searchLogo} alt="" className='pl-3.5'/>
                    <div className='px-3 flex justify-center h-full w-full'>
                        <input type="search" className='text-black w-full outline-0' ref={searchValue}
                        placeholder={file ? 'Enter a RITM number' : 'Enter a file'} disabled={file ? false : true}
                        onKeyDown={e => handleKeyDown(e)}/>
                    </div>
                </div>
            </div>
        </>
    )
}