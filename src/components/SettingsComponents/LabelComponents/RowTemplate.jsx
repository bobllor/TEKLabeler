export default function RowTemplate({headerName, children}){
    return (
        <>
            <div className="flex">
                <div className="flex justify-center items-center text-center w-[50%] px-3">
                    <p>
                        <strong>{headerName}</strong>
                    </p>
                </div>
                {children}
            </div>
        </>
    )
}