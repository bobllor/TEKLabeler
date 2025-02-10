import WhiteX from '/x-symbol-white.svg';
import BlackX from '/x-symbol-black.svg';

export default function LoadSpinner(){
    return (
        <> 
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
        </>
    )
}