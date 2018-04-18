export function GWT0(now = new Date) {
    return new Date(now.valueOf() + now.getTimezoneOffset() * 60000);
}

export function getToken() {
    // if (localStorage.getItem('token') === "undefined") {
    //     return undefined;
    // }
    //
    // return JSON.parse(localStorage.getItem('token'));
    return localStorage.getItem('token') !== "undefined" ? JSON.parse(localStorage.getItem('token')) : undefined;
}

export function setToken(token) {
    if (typeof token !== 'string') throw new Error("Token must be string");

    localStorage.setItem('token', token);
}

export function clearToken() {
    return localStorage.setItem('token', undefined)
}