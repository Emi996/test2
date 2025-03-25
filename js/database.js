import { STORAGE_KEY } from './config.js';

class Database {
    constructor() {
        this.data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
            users: {},
            admin_requests: [],
            payment_links: {}
        };
        this.currentUser = null;
    }

    save() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    }

    getUser(dni) {
        return this.data.users[dni];
    }

    addUser(userData) {
        this.data.users[userData["DNI"]] = userData;
        this.save();
    }

    updateUser(dni, userData) {
        this.data.users[dni] = userData;
        this.save();
    }

    addPaymentRequest(userId, amount) {
        const requestId = `${userId}-${Date.now()}`;
        this.data.admin_requests.push({ id: requestId, user: userId, amount });
        this.save();
        return requestId;
    }

    setPaymentLink(requestId, link) {
        this.data.payment_links[requestId] = link;
        this.save();
    }

    getLatestPaymentRequest(userId) {
        return this.data.admin_requests
            .filter(r => r.user === userId)
            .pop();
    }

    getPaymentLink(requestId) {
        return this.data.payment_links[requestId];
    }

    getCurrentUser() {
        return this.currentUser;
    }
}

export const db = new Database();