export function GWT0(now = new Date) {
    return new Date(now.valueOf() + now.getTimezoneOffset() * 60000);
}

export function getToken() {
    return localStorage['token'] ? JSON.parse(localStorage['token']) : undefined;
}