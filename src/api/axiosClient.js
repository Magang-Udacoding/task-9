import axios from "axios";

const axiosClient = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: {
        'Content-type': 'application/json',
        'Accept': 'application/json',
    }
});

axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config;
});

axiosClient.interceptors.response.use (
    (response) => response,

    (error) => {
        if (error.response && error.response.status === 401) 
        {
            localStorage.removeItem('token');
            window.location.href = '/login';
            return Promise.reject(error);
        }
        
        if (!error.response) {
            console.error('Lost Connection to Server');
        }
        return Promise.reject(error);
    }
);

export default axiosClient;