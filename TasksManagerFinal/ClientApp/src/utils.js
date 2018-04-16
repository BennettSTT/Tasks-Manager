export function GWT0(now = new Date) {
    return new Date(now.valueOf() + now.getTimezoneOffset() * 60000);
}