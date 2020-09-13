export function createGetter(path) {
    const pathToArray = path.split('.')

    return function valueFromPath (obj){
        return pathToArray.reduce((obj, val) => {
            return (obj ? obj[val] : undefined)
        }, obj)
    }
}
