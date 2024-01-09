import axios from 'axios';

const AuthService = {
    adminlogin: async (userData) => {
        try {
            const response = await axios.post('http://localhost:5000/admin/login', userData);
            localStorage.setItem('token', response.data.access_token);
            return response.data.access_token;
        } catch (error) {
            console.error('Error logging in:', error);
            throw error;
        }
    },

    adminlogout: () => {
        localStorage.removeItem('token');
    },

    isAuthenticated: () => {
        const token = localStorage.getItem('token');
        return token ? true : false;
    },

    getAuthToken: () => {
        return localStorage.getItem('token');
    }
};

export default AuthService;