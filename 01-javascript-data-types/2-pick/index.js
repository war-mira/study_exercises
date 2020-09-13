export const pick = (obj, ...fields) => {
    const result = {}

    for (let [key, value] of Object.entries(obj)) {
        if([...fields].includes(key)){
           result[key] = value
        }
    }
    
    return result
};
