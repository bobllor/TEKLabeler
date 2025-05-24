import { useAlertContext } from "../../context/AlertsContext";
import { useRef } from "react";
import UploadLogoRow from "./LabelComponents/UploadLogoRow";
import SplitNameRow from "./LabelComponents/SplitNameRow";
import MappingRow from "./LabelComponents/MappingRow"
import PasswordRow from "./LabelComponents/PasswordRow";
import FilterRow from "./LabelComponents/FilterRow";
import WordFilterRow from "./LabelComponents/WordFilterRow";

export default function Label({ style, setShowCSVForm, setCsvType, setShowMapPage }){
    const { addAlertMessage } = useAlertContext();

    const componentsRef = useRef([
        <SplitNameRow />,
        <FilterRow style={style} setShowCSVForm={setShowCSVForm} setCsvType={setCsvType} />,
        <MappingRow style={style} setShowMapPage={setShowMapPage}/>,
        <WordFilterRow style={style} setShowCSVForm={setShowCSVForm} setCsvType={setCsvType}/>,
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
