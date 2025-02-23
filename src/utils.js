export default function delayFunc(callback, delay = 500, ...args){
    setTimeout(() => {
        callback(...args);
    }, delay)
}