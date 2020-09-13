export function sortStrings(arr, param = 'asc') {
    arr.sort( (a, b) => a.localeCompare(b, 'ru', {ignorePunctuation: true, caseFirst: 'upper'}));

    return param === 'asc' ? arr : arr.reverse()
}
