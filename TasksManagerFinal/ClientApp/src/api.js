import { getToken, setToken } from "./token";

export function refreshToken() {
    const { refreshToken } = getToken();
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    return fetch('/api/Auth/refresh-token',
        {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(refreshToken),
            cache: 'no-cache'
        })
        .then(res => {
            if (res.status !== 200) {
                return Promise.reject(res);
            }
            return res.json();
        })
        .then(token => setToken(JSON.stringify(token)))
        .catch(error => Promise.reject(error));
}

export function fetchApi(url, options) {
    return fetch(url, options);
}