
export function parseJSONFromString(str) {
    return JSON.parse(new window.DOMParser().parseFromString(str, "text/xml").documentElement.innerHTML)
}
