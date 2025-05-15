import { useState } from "react"

export default function Advanced({ style }){
    

    return (
        <>
            <div className="col-start-1 content-center text-center">
                <div className="px-3">
                    <p><strong>Change Mapping</strong></p>
                </div>
            </div>
            <div className="col-start-2 content-center relative">
                    <button className={style}>
                        <span>Open</span>
                    </button>
            </div>
            <div className="w-full col-start-1 text-center content-center">
                <div className="w-full px-3">
                    <p><strong>Default Password</strong></p>
                </div>
            </div>
            <div className="col-start-2 content-center">
                placeholder
            </div>
        </>
    )
}