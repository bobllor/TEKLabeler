import DOMPurify from 'dompurify';

export default function TextContent({textContent}){
    const html = DOMPurify.sanitize(textContent)
    return (
        <> 
            <div dangerouslySetInnerHTML={{__html: html}}></div>
        </>
    )
}