import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const APIClient = (token = "", contentType = 'application/json') => {
    // const {logout} = useContext(AuthContext)
    var instance = axios.create({
        baseURL: 'http://192.168.0.116:8080',
        timeout: 5000,
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': contentType
        }
    })

    // Menambahkan interceptor untuk menangani error 401 secara global
    instance.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response && error.response.status === 401) {
                console.log("Error 401: Unauthorized. Logging out...");
                logout();
            }
            return Promise.reject(error);
        }
    );
    return instance
}