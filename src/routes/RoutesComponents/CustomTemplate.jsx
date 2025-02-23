export default function CustomTemplate({ type = 'INC', defaultValue = '' }){
    const labelData = [
        {idName: 'ticketInput', 
        labelText: type === 'INC' ? 'INC number' : 'RITM number',
        value: defaultValue},
        {idName: 'nameInput', labelText: 'Full name', value: ''},
        {idName: 'companyInput', labelText: 'Company name', value: ''}
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
                        <input
                        className="p-2 rounded-[8px] shadow-[0_2px_8px_0_rgba(0,0,0,.15)] mx-8" 
                        type="text" name={ele.idName} defaultValue={ele.value} spellCheck={false} />
                    </div>
                </div>
            ))}
        </>
    )
}