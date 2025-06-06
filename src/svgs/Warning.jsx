export default function Warning({ color = 'black', fill = 'white' }){
    return (
        <>
        <svg strokeLinecap="round" strokeLinejoin="round" 
        width="34" height="34" strokeWidth="2" 
        viewBox="0 0 24 24" fill={fill} stroke={color} xmlns="http://www.w3.org/2000/svg">
            <path d="M12 16.99V17M12 7V14M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        </>
    )
}