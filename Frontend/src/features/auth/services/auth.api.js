import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
console.log("[Auvora API] Connecting to:", API_URL);

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true
})

export async function register({username,email,password}){
    try {
        const response = await api.post('/api/auth/register', { username, email, password });
        return response.data;
    } catch(err) {
        console.error("Registration error:", err);
        throw err;
    }
}

export async function login({email,password}){
    try {
        const response = await api.post('/api/auth/login', { email, password });
        return response.data;
    } catch(err) {
        console.error("Login error:", err);
        throw err;
    }
}

export async function logout(){
    try {
        const response = await api.get('/api/auth/logout');
        return response.data;
    } catch(err) {
        console.error("Logout error:", err);
        throw err;
    }
}

export async function getme(){
    try {
        const response = await api.get('/api/auth/get-me');
        return response.data;
    } catch(err) {
        // A 401 Unauthorized is expected if the user isn't logged in yet
        if (err.response && err.response.status === 401) {
            return { user: null };
        }
        console.error("Get-me error:", err);
        return { user: null };
    }
}