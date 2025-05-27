import ResetButton from "./ResetButton";
import React from "react";

export default function FilterRow({style, setShowCSVForm, setCsvType, uploadExcelFile}){
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
                <div className="flex flex-col gap-1 justify-center items-center">
                    {filterInfo.map(ele => (
                        <React.Fragment key={ele.id}>
                            <div className="flex gap-1">
                                <button className={style} 
                                id={ele.id}
                                onClick={e => handleColumnFilter(e)}>
                                    {ele.label}
                                </button>
                                <ResetButton dataType={ele.id} uploadExcelFile={uploadExcelFile} />
                            </div>
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </>
    )
}