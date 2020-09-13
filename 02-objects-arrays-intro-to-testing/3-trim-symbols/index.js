export function trimSymbols(string, size) {
    let result = ''

    if(size >= 0){
        const letterArr = string.split('')

        let counter = {}

        letterArr.forEach(function(letter){
            counter[letter] = (counter[letter] || 0) + 1;

            if((counter[letter])<= size){
                result +=letter
            }
        })
    }else{
        result = string
    }
    return result
}
