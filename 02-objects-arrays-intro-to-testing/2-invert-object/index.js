export function invertObj(obj) {
    if(!obj){
        return
    }
    const newObject = {}

    for(let [key, value] of Object.entries(obj)){
        newObject[value] = key
    }
    
    return newObject
}
