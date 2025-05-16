import { useState } from "react"
import { useAlertContext } from "../../context/AlertsContext";

export default function Advanced({ style }){
    const { addAlertMessage } = useAlertContext();

    const updatePassword = (e) => {
        e.preventDefault();

        const target = e.target.elements[0];

        const password = target.value;
        target.value = '';

        window.pywebview.api.set_password(password).then(res => {
            addAlertMessage(res.message);
        })
    }

    return (
        <>
            <div className="flex">
                <div className="flex justify-center items-center w-[50%] px-3">
                    <p><strong>Change Mapping</strong></p>
                </div>
                <div className="flex justify-center items-center w-[50%]">
                    <button className={style}>
                        <span>Open</span>
                    </button>
                </div>
            </div>
            <div className="flex">
                <div className="flex justify-center items-center w-[50%] px-3">
                    <p><strong>Default Password</strong></p>
                </div>
                <div className="flex justify-center items-center w-[50%]">
                    <form onSubmit={updatePassword}>
                        <input type="password" className="px-2 outline-0 rounded-[5px]
                         bg-gray-100 border-1 w-40"/>
                    </form>
                </div>
            </div>
        </>
    )
}