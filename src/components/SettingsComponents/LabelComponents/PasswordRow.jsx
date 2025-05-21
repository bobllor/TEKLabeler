export default function PasswordRow({addAlertMessage}){
    const updatePassword = (e) => {
        e.preventDefault();

        const target = e.target.elements[0];

        const password = target.value;
        target.value = '';

        window.pywebview.api.set_password(password).then(res => {
            addAlertMessage(res.message);
        })
    }
    
    return (
        <>
            <div className="flex">
                <div className="flex justify-center items-center w-[50%] px-3">
                    <p><strong>Default Password</strong></p>
                </div>
                <div className="flex justify-center items-center">
                    <form onSubmit={updatePassword}>
                        <input type="password" className="px-2 outline-0 rounded-[5px]
                         border-1 w-[140px]"/>
                    </form>
                </div>
            </div>
        </>
    )
}