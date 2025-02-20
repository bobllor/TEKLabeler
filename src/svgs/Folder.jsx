export default function Folder({color = "white", fill = "none"}){
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={fill} stroke={color}
        strokeLinecap="round" strokeLinejoin="round" width={24} height={24}  strokeWidth={2}> 
            <path d="M5 4h4l3 3h7a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2"></path> 
        </svg> 
    )
}