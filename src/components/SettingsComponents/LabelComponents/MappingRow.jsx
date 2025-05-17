export default function MappingRow({style}){
    return (
        <>
            <div className="flex">
                <div className="flex justify-center items-center w-[50%] px-3">
                    <p><strong>Change Mapping</strong></p>
                </div>
                <div className="flex justify-center items-center">
                    <button className={style}>
                        <span>Open</span>
                    </button>
                </div>
            </div>
        </>
    )
}