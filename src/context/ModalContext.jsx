import { useContext, createContext, useState } from "react";

const ModalContext = createContext();

export const useModalContext = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
    const [showModal, setShowModal] = useState(false);

    // promise, will resolve later with await.
    const [confirmResolve, setConfirmResolve] = useState(null);

    const confirmModal = () => {
        setShowModal(true);

        return new Promise((resolve) => {
            setConfirmResolve(() => resolve);
        })
    }

    const handleConfirm = () => {
        if(confirmResolve) confirmResolve(true);
        setShowModal(false);
        setConfirmResolve(null);
    }

    const handleCancel = () => {
        if(confirmResolve) confirmResolve(false);
        setShowModal(false);
        setConfirmResolve(null);
    }

    const data = {
        showModal,
        setShowModal,
        confirmModal,
        handleConfirm,
        handleCancel
    }

    return (
        <ModalContext.Provider value={data}>
            { children }
        </ModalContext.Provider>
    )
}