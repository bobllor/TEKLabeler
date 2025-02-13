import WhiteX from '/x-symbol-white.svg';
import BlackX from '/x-symbol-black.svg';

export default function LoadSpinner({ loading }){
    return (
        <> 
        <div className={`${loading ? 'animate-scale-out' : 'animate-scale-in'} w-screen h-screen absolute 
        bg-[#171617] flex justify-center items-center z-9999`}>
            <div className="w-25 h-25 absolute nikke-spin flex justify-center items-center">
                <div className='w-20 h-20 flex justify-center items-center'>
                    <div>
                        <img src={WhiteX} className='w-6 h-6'/>
                        <img src={BlackX} className='w-6 h-6'/>
                    </div>
                    <div>
                        <img src={BlackX} className='w-6 h-6'/>
                        <img src={WhiteX} className='w-6 h-6'/>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}