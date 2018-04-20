import { OrderedMap, Map } from 'immutable';

export function GWT0(now = new Date) {
    return new Date(now.valueOf() + now.getTimezoneOffset() * 60000);
}

export function getToken() {
    return localStorage.getItem('token') !== "undefined" ? JSON.parse(localStorage.getItem('token')) : undefined;
}

export function setToken(token) {
    if (typeof token !== 'string') throw new Error("Token must be string");

    localStorage.setItem('token', token);
}

export function clearToken() {
    return localStorage.setItem('token', undefined);
}

export function arrToMap(arr, DataRecord = Map) {
    return arr.reduce((acc, item) =>
            acc.set(item.id, new DataRecord(item))
        , new OrderedMap({}));
}

export function mapToArr(obj) {
    return obj.valueSeq().toArray();
}