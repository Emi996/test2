import { db } from './database.js';
import { clearScreen, showMessage } from './utils.js';
import { showInitialMenu } from './views.js';

export function showUserHistory() {
    clearScreen();
    document.body.style.background = '#FFFFFF';
    const app = document.getElementById('app');

    app.innerHTML = `
        <div class="header">Historial de Usuarios</div>
        <div class="search-bar">
            <input type="text" id="search-input" placeholder="Buscar por nombre, DNI o Afiliado">
            <select id="search-type">
                <option value="nombre">Nombre</option>
                <option value="dni">DNI</option>
                <option value="afiliado">Afiliado</option>
            </select>
            <button class="btn btn-blue" id="search-btn">Buscar</button>
        </div>
        <div class="data-card">
            <h3>Usuarios Registrados:</h3>
            <div id="user-list-container">
                <p>Cargando usuarios...</p>
            </div>
            <button class="btn btn-blue" id="back-to-menu-btn">Volver al Menú Principal</button>
        </div>
    `;

    const userListContainer = document.getElementById('user-list-container');
    const searchInput = document.getElementById('search-input');
    const searchType = document.getElementById('search-type');
    const searchButton = document.getElementById('search-btn');
    const backToMenuButton = document.getElementById('back-to-menu-btn');

    // Function to populate the user list
    function populateUserList(users) {
        userListContainer.innerHTML = ''; // Clear existing list
        if (!users || Object.keys(users).length === 0) {
            userListContainer.innerHTML = '<p>No hay usuarios registrados.</p>';
            return;
        }

        let userListHTML = '';
        for (const userId in users) {
            const user = users[userId];
            userListHTML += `
                <div class="user-data">
                    <p><strong>Nombre:</strong> ${user['Nombre completo']}</p>
                    <p><strong>DNI:</strong> ${user['DNI']}</p>
                    <p><strong>Numero de afiliado:</strong> ${user['Numero de afiliado']}</p>
                    <button class="btn btn-red delete-user-btn" data-dni="${user['DNI']}">Eliminar</button>
                </div>
            `;
        }
        userListContainer.innerHTML = userListHTML;

        // Attach event listeners to delete buttons
        const deleteButtons = document.querySelectorAll('.delete-user-btn');
        deleteButtons.forEach(button => {
            button.addEventListener('click', () => {
                const dni = button.dataset.dni;
                deleteUser(dni);
            });
        });
    }

    // Initial population of user list
    populateUserList(db.data.users);

    // Event listener for going back to the main menu
    backToMenuButton.onclick = showInitialMenu;

    // Event listener for the search button
    searchButton.addEventListener('click', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const searchTypeValue = searchType.value;
        const filteredUsers = {};

        for (const userId in db.data.users) {
            const user = db.data.users[userId];
            let match = false;

            switch (searchTypeValue) {
                case 'nombre':
                    match = user['Nombre completo'].toLowerCase().includes(searchTerm);
                    break;
                case 'dni':
                    match = user['DNI'].includes(searchTerm);
                    break;
                case 'afiliado':
                    match = user['Numero de afiliado'].includes(searchTerm);
                    break;
            }

            if (match) {
                filteredUsers[userId] = user;
            }
        }
        populateUserList(filteredUsers);
    });

    // Function to delete a user
    function deleteUser(dni) {
        if (confirm("¿Estás seguro de que quieres eliminar este usuario?")) {
            delete db.data.users[dni];
            db.save();
            showMessage(`Usuario con DNI ${dni} eliminado`, "#10B981", 2000);
            populateUserList(db.data.users); // Refresh the user list
        }
    }
}