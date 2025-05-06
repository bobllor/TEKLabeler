export default function Tab({tabData, setTabData}){
    const activeClick = (e) => {
        if(!tabData.active){
            setTabData(prev => {
                const newArray = prev.map(item => {
                    return {
                        ...item,
                        active: item.title === e.target.id
                    }
                })
    
                return newArray;
            })
        }
    }

    return (
        <>
            <div className={`${!tabData.active ? 'hover:bg-gray-500' : 'bg-gray-400/75'} 
            px-3 h-[77%] rounded-[5px] flex justify-center items-center`}
                onClick={e => activeClick(e)}
                id={tabData.title}>
                {tabData.title.replace('.md', '').toUpperCase()}
            </div>
        </>
    )
}