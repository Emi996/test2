export function showMessage(text, color, duration, parent = document.getElementById('app')) {
    const msg = document.createElement('div');
    msg.className = 'message';
    msg.style.color = color;
    msg.textContent = text;
    parent.appendChild(msg);
    setTimeout(() => {
        msg.style.opacity = '0';
        setTimeout(() => msg.remove(), 500);
    }, duration);
}

export function clearScreen() {
    document.getElementById('app').innerHTML = '';
}

export function validateRequired(data, requiredFields) {
    for (let field of requiredFields) {
        if (!data[field]) {
            throw new Error(`${field} es obligatorio`);
        }
    }
}

