import { db } from './database.js';
import { showMessage, clearScreen, validateRequired } from './utils.js';
import { FAQS, FAQS_PER_PAGE, REQUIRED_FIELDS } from './config.js';
import { isValidName, isValidDNI, isValidEmail, isValidPhone } from './validation.js';
import { showUserHistory } from './userHistory.js';

let faqPage = 0;

export function showInitialMenu() {
    clearScreen();
    document.body.style.background = 'linear-gradient(to bottom, #1E3A8A, #FFFFFF)';
    const app = document.getElementById('app');

    app.innerHTML = `
        <div style="text-align: center; font-size: 2.5em; font-weight: bold; margin-bottom: 30px; color: #2563EB; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);">MENU PRINCIPAL</div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 20px;">
            <button class="btn btn-blue" id="login-btn">Ingresar Usuario</button>
            <button class="btn btn-green" id="history-btn">Historial</button>
        </div>
        <div style="margin-top: 30px; font-style: italic; color: #555;">
            Gestion sindical simplificada
        </div>
    `;

    document.getElementById('login-btn').onclick = showLoginScreen;
    document.getElementById('history-btn').onclick = showUserHistory;
}

export function showLoginScreen() {
    clearScreen();
    document.body.style.background = 'linear-gradient(to bottom, #1E3A8A, #FFFFFF)';
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="header">Iniciar sesión</div>
        <div class="input-group"><label>DNI o ID de afiliado</label><input id="login-dni" type="number"></div>
        <div class="input-group"><label>Contraseña</label><input id="login-pass" type="password"></div>
        <button class="btn btn-green" id="login-btn">Iniciar sesión</button>
        <div class="link" id="register-link">¿No tienes cuenta? Regístrate aquí</div>
        <button class="btn btn-gray" id="back-to-initial-menu">Volver al Inicio</button>
    `;

    document.getElementById('login-btn').onclick = loginUser;
    document.getElementById('register-link').onclick = showRegisterScreen;
    document.getElementById('back-to-initial-menu').onclick = showInitialMenu;
}

export function showRegisterScreen() {
    clearScreen();
    document.body.style.background = 'linear-gradient(to bottom, #1E3A8A, #FFFFFF)';
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="header">Registro</div>
        <div class="input-group">
            <label>Nombre completo</label>
            <input id="reg-name" type="text">
            <small id="name-error" class="error-message"></small>
        </div>
        <div class="input-group">
            <label>DNI</label>
            <input id="reg-dni" type="number">
            <small id="dni-error" class="error-message"></small>
        </div>
        <div class="input-group">
            <label>Numero de afiliado</label>
            <input id="reg-affiliate-id" type="number">
        </div>
        <div class="input-group">
            <label>Correo electrónico</label>
            <input id="reg-email" type="email">
            <small id="email-error" class="error-message"></small>
        </div>
        <div class="input-group">
            <label>Teléfono</label>
            <div class="phone-input-container">
                <select id="reg-phone-prefix">
                    <option value="+1">USA (+1)</option>
                    <option value="+54">Argentina (+54)</option>
                    <option value="+34">España (+34)</option>
                    <!-- Add more country codes as needed -->
                </select>
                <input id="reg-phone" type="number">
            </div>
            <small id="phone-error" class="error-message"></small>
        </div>
        <div class="input-group">
            <label>Dirección</label>
            <input id="reg-address" type="text">
        </div>
        <div class="input-group">
            <label>Contraseña</label>
            <div class="password-input-container">
                <input id="reg-pass" type="password">
                <span class="password-toggle" id="show-password-btn">&#x1f441;</span>
            </div>
        </div>
        <div class="input-group">
            <label>Confirmar contraseña</label>
            <div class="password-input-container">
                <input id="reg-conf-pass" type="password">
                <span class="password-toggle" id="show-confirm-password-btn">&#x1f441;</span>
            </div>
        </div>
        <button class="btn btn-green" id="register-btn">Registrarse</button>
        <div class="link" id="login-link">¿Ya tienes cuenta? Inicia sesión aquí</div>
        <button class="btn btn-gray" id="back-to-initial-menu">Volver al Inicio</button>
    `;

    const nameInput = document.getElementById('reg-name');
    nameInput.addEventListener('input', () => {
        nameInput.value = capitalizeName(nameInput.value);
    });

    const passwordInput = document.getElementById('reg-pass');
    const confirmPasswordInput = document.getElementById('reg-conf-pass');
    const showPasswordButton = document.getElementById('show-password-btn');
    const showConfirmPasswordButton = document.getElementById('show-confirm-password-btn');

    showPasswordButton.addEventListener('click', function() {
        togglePasswordVisibility(passwordInput, showPasswordButton);
    });

    showConfirmPasswordButton.addEventListener('click', function() {
        togglePasswordVisibility(confirmPasswordInput, showConfirmPasswordButton);
    });

    // Event listeners for real-time validation
    document.getElementById('reg-name').addEventListener('input', validateName);
    document.getElementById('reg-dni').addEventListener('input', validateDNI);
    document.getElementById('reg-email').addEventListener('input', validateEmail);
    document.getElementById('reg-phone').addEventListener('input', validatePhone);

    document.getElementById('register-btn').onclick = registerUser;
    document.getElementById('login-link').onclick = showLoginScreen;
    document.getElementById('back-to-initial-menu').onclick = showInitialMenu;
}

export function registerUser() {
    const name = document.getElementById('reg-name').value;
    const dni = document.getElementById('reg-dni').value;
    const affiliateId = document.getElementById('reg-affiliate-id').value;
    const email = document.getElementById('reg-email').value;
    const phonePrefix = document.getElementById('reg-phone-prefix').value;
    const phone = document.getElementById('reg-phone').value;
    const address = document.getElementById('reg-address').value;
    const pass = document.getElementById('reg-pass').value;
    const confPass = document.getElementById('reg-conf-pass').value;

    try {
        if (!isValidName(name)) {
            throw new Error("El nombre debe contener al menos dos palabras, cada una comenzando con mayúscula");
        }

        if (!isValidDNI(dni)) {
            throw new Error("El DNI ingresado no es válido");
        }

        if (!isValidEmail(email)) {
            throw new Error("El correo electrónico ingresado no es válido");
        }

        if (!isValidPhone(phonePrefix + phone)) {
            throw new Error("El número de teléfono ingresado no es válido");
        }
      
        if (pass !== confPass) {
            throw new Error("Las contraseñas no coinciden");
        }

        const userData = {
            "Nombre completo": name,
            "DNI": dni,
            "Numero de afiliado": affiliateId,
            "Correo electrónico": email,
            "Teléfono": phonePrefix + phone,
            "Dirección": address,
            "Contraseña": pass
        };

        validateRequired(userData, REQUIRED_FIELDS);

        if (db.getUser(dni)) {
            throw new Error("El DNI ya está registrado");
        }

        db.addUser(userData);
        showMessage('Registro exitoso', "#10B981", 2000);
        db.currentUser = dni;
        setTimeout(showMainMenu, 2000);
    } catch (error) {
        showMessage('Error al registrar: ' + error.message, "#EF4444", 3000);
    }
}

export function loginUser() {
    const dni = document.getElementById('login-dni').value;
    const password = document.getElementById('login-pass').value;

    if (!dni || !password) {
        showMessage("Todos los campos son obligatorios", "#EF4444", 3000);
        return;
    }

    const user = db.getUser(dni);
    
    if (user && user["Contraseña"] === password) {
        db.currentUser = dni;
        showMessage("Iniciando sesión...", "#10B981", 1000);
        setTimeout(showMainMenu, 1000);
    } else {
        showMessage("Credenciales incorrectas", "#EF4444", 3000);
    }
}

export function showMainMenu() {
    clearScreen();
    document.body.style.background = '#FFFFFF';
    const user = db.getUser(db.getCurrentUser());
    const app = document.getElementById('app');
    
    app.innerHTML = `
        <div style="background: #2563EB; padding: 15px; display: flex; justify-content: space-between; align-items: center; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.2);">
            <span style="color: #FFFFFF; font-size: 20px; font-weight: bold;">Bienvenido, ${user["Nombre completo"]}</span>
            <button class="btn btn-red" id="logout-btn">Cerrar Sesión</button>
        </div>
        <h2 style="font-size: 28px; font-weight: bold; margin: 40px 0; color: #333; text-shadow: 1px 1px 2px rgba(0,0,0,0.1);">Menú Principal</h2>
        <div class="dashboard">
            <div class="card">
                <h3 style="font-size: 1.4em; color: #2563EB;">Mis Datos</h3>
                <p style="font-size: 1.1em; color: #555;">Ver y editar tus datos personales</p>
                <button class="btn btn-blue" id="mydata-btn">Acceder</button>
            </div>
            <div class="card">
                <h3 style="font-size: 1.4em; color: #22C55E;">Preguntas Frecuentes</h3>
                <p style="font-size: 1.1em; color: #555;">Resuelve tus dudas aquí</p>
                <button class="btn btn-green" id="faq-btn">Acceder</button>
            </div>
            <div class="card">
                <h3 style="font-size: 1.4em; color: #F59E0B;">Realizar Pago</h3>
                <p style="font-size: 1.1em; color: #555;">Paga tus cuotas sindicales</p>
                <button class="btn btn-yellow" id="payment-btn">Acceder</button>
            </div>
        </div>
        <div style="margin-top: 30px; text-align: center; color: #777;">
          Habla con el equipo: <a href="mailto:testsoporte996@gmail.com" style="color: #337ab7; text-decoration: none;">testsoporte996@gmail.com</a>
        </div>
        <div class="footer" style="margin-top: 20px; text-align: center; color: #888;">Sindicato Digital - 2025</div>
    `;

    document.getElementById('logout-btn').onclick = () => {
        db.currentUser = null;
        showMessage("Cerrando sesión...", "#10B981", 1000);
        setTimeout(showLoginScreen, 1000);
    };
    document.getElementById('mydata-btn').onclick = showMyData;
    document.getElementById('faq-btn').onclick = showFaq;
    document.getElementById('payment-btn').onclick = showPayment;
}

export function showMyData() {
    clearScreen();
    document.body.style.background = '#FFFFFF';
    const user = db.getUser(db.getCurrentUser());
    const app = document.getElementById('app');
    
    app.innerHTML = `
        <div class="header">Editar Datos Personales</div>
        <div class="input-group">
            <label>Nombre completo*</label>
            <input id="edit-name" type="text" value="${user["Nombre completo"]}" />
        </div>
        <div class="input-group">
            <label>DNI</label>
            <input id="edit-dni" type="text" value="${user["DNI"]}" disabled />
        </div>
        <div class="input-group">
            <label>Numero de afiliado</label>
            <input id="edit-affiliate-id" type="text" value="${user["Numero de afiliado"]}" disabled />
        </div>
        <div class="input-group">
            <label>Correo electrónico</label>
            <input id="edit-email" type="email" value="${user["Correo electrónico"] || ''}" />
        </div>
        <div class="input-group">
            <label>Teléfono*</label>
            <input id="edit-phone" type="tel" value="${user["Teléfono"]}" />
        </div>
        <div class="input-group">
            <label>Dirección</label>
            <input id="edit-address" type="text" value="${user["Dirección"] || ''}" />
        </div>
        <div style="margin-top: 20px; display: flex; gap: 10px; justify-content: center;">
            <button class="btn btn-green" id="confirm-changes-btn">Confirmar datos</button>
            <button class="btn btn-gray" id="back-to-menu-btn">Volver al Menú Principal</button>
        </div>
    `;

    document.getElementById('confirm-changes-btn').onclick = () => {
        if (confirm("¿Estás seguro que quieres confirmar los datos?")) {
            const updatedData = {
                "Nombre completo": document.getElementById('edit-name').value.trim(),
                "DNI": user['DNI'],
                "Numero de afiliado": user['Numero de afiliado'],
                "Correo electrónico": document.getElementById('edit-email').value.trim(),
                "Teléfono": document.getElementById('edit-phone').value.trim(),
                "Dirección": document.getElementById('edit-address').value.trim(),
                "Contraseña": user['Contraseña']
            };

            if (!updatedData["Nombre completo"] || !updatedData["Teléfono"]) {
                showMessage("Los campos marcados con * son obligatorios", "#EF4444", 3000);
                return;
            }

            db.updateUser(user['DNI'], updatedData);
            showMessage("Datos actualizados correctamente", "#10B981", 2000);
            setTimeout(() => showMainMenu(), 2000);
        }
    };

    document.getElementById('back-to-menu-btn').onclick = () => {
        const name = document.getElementById('edit-name').value.trim();
        const email = document.getElementById('edit-email').value.trim();
        const phone = document.getElementById('edit-phone').value.trim();
        const address = document.getElementById('edit-address').value.trim();

        if (name !== user['Nombre completo'] ||
            email !== user['Correo electrónico'] ||
            phone !== user['Teléfono'] ||
            address !== user['Dirección']) {
            if (confirm("¿Estás seguro de que quieres volver al menú principal? Tus cambios se descartarán.")) {
                showMainMenu();
            }
        } else {
            showMainMenu();
        }
    };
}

export function showFaq() {
    clearScreen();
    document.body.style.background = '#FFFFFF';
    const app = document.getElementById('app');
    
    app.innerHTML = `
        <div style="border-top: 4px solid #2563EB;"></div>
        <h2 style="font-size: 28px; font-weight: bold; margin: 30px 0; color: #333; text-shadow: 1px 1px 2px rgba(0,0,0,0.1);">Preguntas Frecuentes</h2>
        <div id="faq-list"></div>
        <div class="faq-nav">
            <button class="btn btn-gray" onclick="window.faqChangePage(-1)">&lt;</button>
            <span id="faq-page" style="font-size: 1.1em; color: #555;">Página ${faqPage + 1} de ${Math.ceil(FAQS.length / FAQS_PER_PAGE)}</span>
            <button class="btn btn-gray" onclick="window.faqChangePage(1)">&gt;</button>
        </div>
        <div class="btn-container">
            <button class="btn btn-blue" onclick="showMainMenu()">Volver al Menú Principal</button>
        </div>
    `;

    updateFaq();
}

function updateFaq() {
    const faqList = document.getElementById('faq-list');
    faqList.innerHTML = '';
    const start = faqPage * FAQS_PER_PAGE;
    
    FAQS.slice(start, start + FAQS_PER_PAGE).forEach(faq => {
        const item = document.createElement('div');
        item.className = 'faq-item';
        item.innerHTML = `<h3>${faq.q}</h3><p>${faq.a}</p>`;
        item.onclick = () => {
            const p = item.querySelector('p');
            p.style.display = p.style.display === 'block' ? 'none' : 'block';
        };
        faqList.appendChild(item);
    });
}

window.faqChangePage = (delta) => {
    const newPage = faqPage + delta;
    if (newPage >= 0 && newPage < Math.ceil(FAQS.length / FAQS_PER_PAGE)) {
        faqPage = newPage;
        document.getElementById('faq-page').textContent = `Página ${faqPage + 1} de ${Math.ceil(FAQS.length / FAQS_PER_PAGE)}`;
        updateFaq();
    }
};

window.showMainMenu = showMainMenu;

export function showPayment() {
    clearScreen();
    document.body.style.background = '#FFFFFF';
    const app = document.getElementById('app');
    
    app.innerHTML = `
        <div style="border-top: 4px solid #F59E0B;"></div>
        <h2 style="font-size: 28px; font-weight: bold; margin: 30px 0; color: #333; text-shadow: 1px 1px 2px rgba(0,0,0,0.1);">Realizar Pago</h2>
        <div style="font-size: 18px; margin-bottom: 25px; color: #555;">Selecciona el método de pago para tu cuota sindical.</div>
        <div class="input-group">
            <label>Método de pago</label>
            <select id="payment-method" style="font-size: 1.2em; padding: 14px;">
                <option value="sueldo">Sueldo (Descuento directo)</option>
                <option value="debito_credito">Tarjeta de Débito/Crédito</option>
                <option value="tarjeta_virtual">Tarjeta Virtual</option>
            </select>
        </div>
        <div id="payment-description" style="font-size: 16px; margin-bottom: 20px; color: #777;"></div>
        <a id="whatsapp-link" href="#" target="_blank" class="btn btn-green" style="font-size: 1.2em;">Solicitar Enlace</a>
        <div id="payment-message" class="message"></div>
        <button class="btn btn-blue" onclick="showMainMenu()">Regresar al Menú Principal</button>
    `;

    const paymentMethodSelect = document.getElementById('payment-method');
    const paymentDescription = document.getElementById('payment-description');
    const whatsappLink = document.getElementById('whatsapp-link');

    function updatePaymentInfo() {
        const selectedMethod = paymentMethodSelect.value;
        let whatsappMessage = '';
        let descriptionText = '';

        switch (selectedMethod) {
            case 'sueldo':
                whatsappMessage = 'https://wa.me/5492966586523?text=Deseo%20que%20sea%20descontado%20de%20mi%20sueldo.%20Se%20descontar%C3%A1%20directamente%20de%20mi%20salario.';
                descriptionText = "El pago será descontado directamente de su sueldo.";
                break;
            case 'debito_credito':
                whatsappMessage = 'https://wa.me/5492966586523?text=Deseo%20que%20sea%20con%20tarjeta%20de%20d%C3%A9bito%2Fcr%C3%A9dito.';
                descriptionText = "El pago se realizará con tarjeta de débito o crédito.";
                break;
            case 'tarjeta_virtual':
                whatsappMessage = 'https://wa.me/5492966586523?text=Deseo%20que%20sea%20por%20tarjeta%20virtual.';
                descriptionText = "El pago será realizado mediante tarjeta virtual.";
                break;
            default:
                whatsappMessage = '';
                descriptionText = '';
        }

        whatsappLink.href = whatsappMessage;
        paymentDescription.textContent = descriptionText;
    }

    paymentMethodSelect.addEventListener('change', updatePaymentInfo);
    updatePaymentInfo(); // Initialize on page load
}

function validateName() {
    const nameInput = document.getElementById('reg-name');
    const nameError = document.getElementById('name-error');
    if (!isValidName(nameInput.value)) {
        nameError.textContent = "El nombre debe contener al menos dos palabras, cada una comenzando con mayúscula";
        return false;
    } else {
        nameError.textContent = "";
        return true;
    }
}

function validateDNI() {
    const dniInput = document.getElementById('reg-dni');
    const dniError = document.getElementById('dni-error');
    if (!isValidDNI(dniInput.value)) {
        dniError.textContent = "El DNI ingresado no es válido";
        return false;
    } else {
        dniError.textContent = "";
        return true;
    }
}

function validateEmail() {
    const emailInput = document.getElementById('reg-email');
    const emailError = document.getElementById('email-error');
    if (!isValidEmail(emailInput.value)) {
        emailError.textContent = "El correo electrónico ingresado no es válido";
        return false;
    } else {
        emailError.textContent = "";
        return true;
    }
}

function validatePhone() {
    const phoneInput = document.getElementById('reg-phone');
    const phoneError = document.getElementById('phone-error');
    const phonePrefix = document.getElementById('reg-phone-prefix').value;

    if (!isValidPhone(phonePrefix + phoneInput.value)) {
        phoneError.textContent = "El número de teléfono ingresado no es válido";
        return false;
    } else {
        phoneError.textContent = "";
        return true;
    }
}

function capitalizeName(name) {
    return name.split(' ').map(word => {
        if (word.length === 0) return '';
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join(' ');
}

function togglePasswordVisibility(inputElement, buttonElement) {
    if (inputElement.type === "password") {
        inputElement.type = "text";
        buttonElement.textContent = "\uD83D\uDD76"; // Eye with slash
    } else {
        inputElement.type = "password";
        buttonElement.textContent = "\uD83D\uDD77"; // Regular eye
    }
}