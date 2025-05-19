import { useSettingsContext } from "../../context/SettingsContext";
import { useAlertContext } from "../../context/AlertsContext";
import { useRef, useState } from "react";
import UploadLogoRow from "./LabelComponents/UploadLogoRow";
import SplitNameRow from "./LabelComponents/SplitNameRow";
import MappingRow from "./LabelComponents/MappingRow"
import PasswordRow from "./LabelComponents/PasswordRow";
import FilterRow from "./LabelComponents/FilterRow";

export default function Label({ style, setShowColumnPage, columnRef, setShowMapPage }){
    const { addAlertMessage } = useAlertContext();

    const componentsRef = useRef([
        <SplitNameRow />,
        <FilterRow style={style} setShowColumnPage={setShowColumnPage} columnRef={columnRef} />,
        <MappingRow style={style} setShowMapPage={setShowMapPage}/>,
        <UploadLogoRow style={style} addAlertMessage={addAlertMessage} />,
        <PasswordRow addAlertMessage={addAlertMessage} />,
    ])

    return (
        <>
            {componentsRef.current.map((ele, i) => (
            <span key={i}>
                {ele}
            </span>
            ))}
        </>
    )
}
