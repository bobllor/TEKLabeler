export default function WordFilterRow({style, setShowCSVForm }){
    return (
        <>
            <div className="flex">
                <div className="px-3 w-[50%]">
                    <p className="flex justify-center items-center"><strong>Word Filters</strong></p>
                </div>
                <div className="flex flex-col w-[50%]">
                    <button className={style} onClick={() => setShowCSVForm(prev => !prev)}>
                        Edit
                    </button>
                </div>
            </div>
        </>
    )
}