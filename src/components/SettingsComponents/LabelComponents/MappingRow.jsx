import ResetButton from "./ResetButton";

export default function MappingRow({style, setShowMapPage}){
    return (
        <>
            <div className="flex">
                <div className="flex justify-center items-center w-[50%] px-3">
                    <p><strong>Column Mapping</strong></p>
                </div>
                <div className="flex gap-1 justify-center items-center">
                    <button className={style}
                    onClick={() => setShowMapPage(prev => !prev)}>
                        <span>Edit</span>
                    </button>
                    <ResetButton dataType={'columnMapping'} />
                </div>
            </div>
        </>
    )
}