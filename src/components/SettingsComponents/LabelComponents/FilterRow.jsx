export default function FilterRow({style, setShowCSVForm, setCsvType}){
    const filterInfo = [
        {id: 'hardwareId', label: 'Hardware'},
        {id: 'softwareId', label: 'Software'}
    ]

    const handleColumnFilter = (e) => {
        setCsvType(e.target.id);

        setShowCSVForm(prev => !prev);
    }

    return (
        <>
            <div className="flex items-center">
                <div className="w-[50%] h-[30%] flex items-center justify-center">
                    <p><strong>Column Filters</strong></p>
                </div>
                <div className="flex flex-col gap-2 justify-center items-center">
                    {filterInfo.map(ele => (
                        <button className={style} 
                        id={ele.id}
                        key={ele.id}
                        onClick={e => handleColumnFilter(e)}>
                            {ele.label}
                        </button>
                    ))}
                </div>
            </div>
        </>
    )
}