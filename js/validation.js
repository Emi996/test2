// validation.js
export function isValidName(name) {
    if (!name) return false;
    const words = name.trim().split(/\s+/);
    if (words.length < 2) return false;
    return words.every(word => word[0] === word[0].toUpperCase() && word.length > 0);
}

export function isValidDNI(dni) {
    return /^\d{8}$/.test(dni);
}

export function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPhone(phone) {
    return /^\+\d{1,3}\d{9,10}$/.test(phone);
}

