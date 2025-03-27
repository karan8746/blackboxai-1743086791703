class AuthSystem {
    constructor() {
        this.initAuth();
    }

    initAuth() {
        this.setupEventListeners();
        this.checkAuthState();
    }

    setupEventListeners() {
        // Login form submit handler
        document.getElementById('loginForm')?.addEventListener('submit', (e) => this.handleLogin(e));
    }

    async handleLogin(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const credentials = {
            email: formData.get('email'),
            password: formData.get('password')
        };

        // Simple validation
        if (!credentials.email || !credentials.password) {
            alert('Please enter both email and password');
            return;
        }

        // Mock authentication - replace with real API call in production
        localStorage.setItem('fCruiserAuth', JSON.stringify({
            email: credentials.email,
            loggedIn: true,
            token: 'mock-token-' + Math.random().toString(36).substring(2),
            lastLogin: new Date().toISOString()
        }));
        
        window.location.href = 'index.html';
    }

    checkAuthState() {
        const authData = JSON.parse(localStorage.getItem('fCruiserAuth'));
        if (authData?.loggedIn && window.location.pathname.includes('login')) {
            window.location.href = 'index.html';
        }
    }

    logout() {
        localStorage.removeItem('fCruiserAuth');
        window.location.href = 'login.html';
    }
}

// Initialize auth system
const auth = new AuthSystem();