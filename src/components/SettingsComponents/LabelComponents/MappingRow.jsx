export default function MappingRow({style, setShowMapPage}){
    return (
        <>
            <div className="flex">
                <div className="flex justify-center items-center w-[50%] px-3">
                    <p><strong>Column Mapping</strong></p>
                </div>
                <div className="flex justify-center items-center">
                    <button className={style}
                    onClick={() => setShowMapPage(prev => !prev)}>
                        <span>Edit</span>
                    </button>
                </div>
            </div>
        </>
    )
}