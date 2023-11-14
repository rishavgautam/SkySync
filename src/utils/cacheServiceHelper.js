
export function GetCacheValue(key) {
    var cachedUnit = localStorage.getItem(key);
    return cachedUnit
}

export function SetCacheValue(key, val) {
    var cachedUnit = localStorage.setItem(key, val)
    return cachedUnit
}