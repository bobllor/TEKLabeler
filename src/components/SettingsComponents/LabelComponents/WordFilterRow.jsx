export default function WordFilterRow({style, setShowCSVForm, setCsvType }){
    const idName = "wordFilterID";

    const handleButtonClick = (e) => {
        setCsvType(e.target.id);

        setShowCSVForm(prev => !prev);
    }

    return (
        <>
            <div className="flex">
                <div className="px-3 w-[50%]">
                    <p className="flex justify-center items-center"><strong>Word Filters</strong></p>
                </div>
                <div className="flex flex-col w-[50%]">
                    <button id={idName}
                    className={style} onClick={e => handleButtonClick(e)}>
                        Edit
                    </button>
                </div>
            </div>
        </>
    )
}