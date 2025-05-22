export default function WordFilterRow({style}){
    return (
        <>
            <div className="flex">
                <div className="px-3 w-[50%]">
                    <p className="flex justify-center items-center"><strong>Word Filters</strong></p>
                </div>
                <div className="flex flex-col w-[50%]">
                    <button className={style}>
                        Edit
                    </button>
                </div>
            </div>
        </>
    )
}