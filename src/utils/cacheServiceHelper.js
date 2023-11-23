
export function GetCacheValue(key) {
    if (typeof localStorage !== 'undefined') {
        var cachedUnit = localStorage.getItem(key);
        return cachedUnit
    }
    else {
        console.log('Web Storage is not supported in this environment.');
    }

}

export function SetCacheValue(key, val) {
    if (typeof localStorage !== 'undefined') {
        var cachedUnit = localStorage.setItem(key, val)
        return cachedUnit
    }
    else {
        console.log('Web Storage is not supported in this environment.');
    }
}