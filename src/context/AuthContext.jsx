/* eslint-disable react-refresh/only-export-components */
import axiosClient from '../api/axiosClient';
import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({children}) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));

    const register = async (name, email, password) => {
        const response = await axiosClient.post('/register', {name, email, password});

        const receivedToken = response.data.token;
        const receivedUser = response.data.user;

        localStorage.setItem('token', receivedToken);
        setToken(receivedToken);
        setUser(receivedUser);
    }

    const login = async (email, password) => {
        const response = await axiosClient.post('/login', {email, password});

        const receivedToken = response.data.token;
        const receivedUser = response.data.user;

        localStorage.setItem('token', receivedToken);
        setToken(receivedToken);
        setUser(receivedUser);
    }

    const logout = async()=> {
        await axiosClient.post('/logout', {}, {
            headers: {Authorization: 
                `Bearer ${token}`
            },
        });

        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    }

    return (
    <AuthContext.Provider value={{user, token, register, login, logout}}>
    {children}
    </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}

