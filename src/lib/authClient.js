// const TOKEN_KEY = "accessToken";

// export function saveToken(token) {
//     localStorage.setItem(TOKEN_KEY, token);
// }

// export function getToken() {
//     return localStorage.getItem(TOKEN_KEY);
// }

// export function removeToken() {
//     localStorage.removeItem(TOKEN_KEY);
// }

// export function isAuthenticated() {
//     return !!getToken();
// }


const TOKEN_KEY = "accessToken";

export function saveToken(token) {
    localStorage.setItem(TOKEN_KEY, token);

    // also set a cookie so Next.js middleware (server-side)
    // can check login status — middleware cannot read localStorage.
    document.cookie = `${TOKEN_KEY}=${token}; path=/; max-age=86400`;
}

export function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

export function removeToken() {
    localStorage.removeItem(TOKEN_KEY);

    // clear the matching cookie on logout
    document.cookie = `${TOKEN_KEY}=; path=/; max-age=0`;
}

export function isAuthenticated() {
    return !!getToken();
}