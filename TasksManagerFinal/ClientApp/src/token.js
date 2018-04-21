import { GWT0 } from "./utils";

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

/**
 * Возвращает true, если токен старый
 * @returns {boolean}
 */
export function checkToken() {
    const token = getToken();
    if (!token) return undefined;

    const { expiresIn: expires } = token;
    const expiresIn = new Date(expires);

    const GWT0Now = GWT0();
    return expiresIn < GWT0Now;
}