export default function CustomTemplate({ type = 'INC', defaultValue = '' }){
    const labelData = [
        {idName: 'ticketInput', 
        labelText: type === 'INC' ? 'Enter the INC number' : 'Enter the RITM number:',
        value: defaultValue},
        {idName: 'nameInput', labelText: 'Enter the first and last name', value: ''},
        {idName: 'companyInput', labelText: 'Enter the company name', value: ''}
    ]

    return (
        <>
            {labelData.map((ele, i) => (
                <div className="grid grid-cols-2 p-2" key={i}>
                    <label htmlFor={ele.idName}>{ele.labelText}</label>
                    <input
                    className="p-2 rounded-[8px] shadow-[0_2px_8px_0_rgba(0,0,0,.15)]" 
                    type="text" name={ele.idName} defaultValue={ele.value} spellCheck={false} />
                </div>
            ))}
        </>
    )
}