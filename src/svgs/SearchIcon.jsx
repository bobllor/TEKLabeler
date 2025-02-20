export default function SearchIcon({color = 'white', fill = 'none'}){
    return (
        <svg xmlns="http://www.w3.org/2000/svg"   viewBox="0 0 24 24" fill={fill} stroke={color}
        strokeLinecap="round" strokeLinejoin="round" width={24} height={24}  strokeWidth={2}> 
            <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"></path> <path d="M21 21l-6 -6"></path> 
        </svg> 
    )
}