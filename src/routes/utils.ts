export function includesCheck(stringVal: string, checkList: Array<string>): boolean{
    for(const word of checkList){
        const loweredWord: string = word.toLowerCase();
        if(stringVal.toLowerCase().includes(loweredWord)){
            return true;
        }
    }; 

    return false;
}