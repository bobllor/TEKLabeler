import LoadingX from '../svgs/LoadingX';
import { useEffect, useMemo, useState } from 'react';

export default function LoadScreen({ loading }){
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
                        < LoadingX fill={'white'}/>
                        < LoadingX fill={'gray'}/>
                    </div>
                    <div>
                        < LoadingX fill={'gray'}/>
                        < LoadingX fill={'white'}/>
                    </div>
                </div>}
            </div>
        </div>
        </>
    )
}