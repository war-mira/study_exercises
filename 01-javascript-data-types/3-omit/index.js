export const omit = (obj, ...fields) => {

    const filtered = Object.entries(obj).filter(([key, value], index, array)=>{
        if (![...fields].includes(key)) {
            return array;
        }       
    });

    return filtered.length ? Object.fromEntries(filtered) : {}
};
