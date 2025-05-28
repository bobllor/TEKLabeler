import { useEffect } from "react";

export default function Modal({confirm, cancel}){
    useEffect(() => {
        const keyListener = (e) => {
            e.preventDefault();

            if(e.key == 'Escape'){
                cancel();
            }
        }

        document.addEventListener('keydown', keyListener);

        return (() => {
            document.removeEventListener('keydown', keyListener);
        })
    }, [])

    return (
        <>
            <div className="flex flex-col h-30 w-fit bg-white outer-shadow rounded-[5px] absolute z-999">
                <div className="flex h-[90%] p-3 justify-center items-center">
                    <p>Are you sure you want to reset to the default values?</p>
                </div>
                <div className="flex justify-center items-center gap-3 pb-3">
                    <button className="bg-white border-1 rounded-[5px] w-35 max-h-8 hover:bg-gray-500/30"
                    onClick={() => cancel()}>
                        Cancel
                    </button>
                    <button className="bg-white border-1 rounded-[5px] w-35 max-h-8 hover:bg-gray-500/30"
                    onClick={() => confirm()}>
                        Yes
                    </button>
                </div>
            </div>
        </>
    )
}