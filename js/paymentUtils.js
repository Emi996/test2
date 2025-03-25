// paymentUtils.js
import { db } from './database.js';
import { showMessage } from './utils.js';

export async function sendPaymentDetails(amount) {
    const user = db.getUser(db.getCurrentUser());
    const phoneNumber = user['Teléfono'];

    if (!phoneNumber) {
        showMessage("No hay número de teléfono vinculado a esta cuenta.", "#EF4444", 3000);
        return;
    }

    const cvu = "0000003100055667146402";
    const name = "EMILIO FERNANDEZ BERRIOS";

    const message = `
Detalles de Pago:
CVU: ${cvu}
Nombre: ${name}
Monto: ${amount}
Método de Pago: Débito/Crédito/Tarjeta Virtual
    `;

    // Replace with your actual SMS sending logic - This is a placeholder
    // You would typically use an API to send the SMS
    // Example: await sendSMS(phoneNumber, message);

    showMessage(`Detalles de pago enviados al número ${phoneNumber}`, "#10B981", 3000);
}