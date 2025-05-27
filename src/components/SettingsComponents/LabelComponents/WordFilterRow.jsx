import ResetButton from "./ResetButton";

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
                    <div className="flex justify-center items-center">
                        <strong>Word Filters</strong>
                    </div>
                </div>
                <div className="flex gap-1 w-[50%]">
                    <button id={idName}
                    className={style} onClick={e => handleButtonClick(e)}>
                        Edit
                    </button>
                    <ResetButton dataType={'wordFilter'} />
                </div>
            </div>
        </>
    )
}