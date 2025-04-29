import { useEffect } from "react"

export default function CustomTemplate({ type = 'INC', defaultValue = '', setTicketValue }){
    const labelData = [
        {idName: 'ticketInput', 
        labelText: type === 'INC' ? 'INC number' : 'RITM number',},
        {idName: 'nameInput', labelText: 'Full name', value: ''},
        {idName: 'companyInput', labelText: 'Company name', value: ''},
        {idName: 'hardwareInput', labelText: 'Hardware (optional)', value: ''}
    ]

    return (
        <>
            {labelData.map((ele, i) => (
                <div className="grid grid-cols-2 p-4" key={i}>
                    <div className="flex justify-end items-center">
                        <div className="mx-8">   
                            <label htmlFor={ele.idName}>{ele.labelText}</label>
                        </div>
                    </div>
                    <div>
                        {ele.idName === 'ticketInput' ? <>
                            <input
                            className="p-2 rounded-[8px] shadow-[0_2px_8px_0_rgba(0,0,0,.5)] 
                            mx-8 outline-hidden bg-white text-black" 
                            type="text" name={ele.idName}
                            value={defaultValue}
                            onChange={e => setTicketValue(e.target.value)}
                            spellCheck={false} 
                            autoFocus={ele.idName === 'ticketInput'}/>
                        </>:
                        <input
                        className="p-2 rounded-[8px] shadow-[0_2px_8px_0_rgba(0,0,0,.5)] 
                        mx-8 outline-hidden bg-white text-black" 
                        type="text" name={ele.idName}
                        spellCheck={false}/>
                        }
                    </div>
                </div>
            ))}
        </>
    )
}