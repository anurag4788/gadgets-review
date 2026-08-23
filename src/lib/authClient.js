const TOKEN_KEY = "accessToken";

// ==========================================
// SAVE TOKEN
// ==========================================

export function saveToken(token) {

    // Save token in localStorage
    localStorage.setItem(
        TOKEN_KEY,
        token
    );

    // Also save token in cookie
    // so Next.js middleware can read it
    document.cookie =
        `${TOKEN_KEY}=${token}; path=/; max-age=86400`;
}


// ==========================================
// GET TOKEN
// ==========================================

export function getToken() {

    return localStorage.getItem(
        TOKEN_KEY
    );

}


// ==========================================
// REMOVE TOKEN
// ==========================================

export function removeToken() {

    // Remove from localStorage
    localStorage.removeItem(
        TOKEN_KEY
    );

    // Remove from cookie
    document.cookie =
        `${TOKEN_KEY}=; path=/; max-age=0`;
}


// ==========================================
// CHECK AUTHENTICATION
// ==========================================

export function isAuthenticated() {

    return !!getToken();

}