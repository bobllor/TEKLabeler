import WhiteX from '/x-symbol-white.svg';
import BlackX from '/x-symbol-black.svg';
import { useEffect, useMemo, useState } from 'react';

export default function LoadSpinner({ loading }){
    const [trigger, setTrigger] = useState(false);

    const styleTheme = useMemo(() => {
        let test = '';
        if(!loading){
            test += 'animate-scale-out';
        }

        if(loading && trigger){
            test += 'animate-scale-in';
        }

        return test;
    }, [loading])
    
    useEffect(() => {
        if(!trigger){
            setTrigger(true);
        }
    }, [])

    return (
        <> 
        <div className={`${styleTheme} w-screen h-screen absolute 
        bg-[#171617] flex justify-center items-center z-300`}>
            <div className="w-25 h-25 absolute nikke-spin flex justify-center items-center">
                {loading && <div className='w-20 h-20 flex justify-center items-center'>
                    <div>
                        <img src={WhiteX} className='w-6 h-6'/>
                        <img src={BlackX} className='w-6 h-6'/>
                    </div>
                    <div>
                        <img src={BlackX} className='w-6 h-6'/>
                        <img src={WhiteX} className='w-6 h-6'/>
                    </div>
                </div>}
            </div>
        </div>
        </>
    )
}