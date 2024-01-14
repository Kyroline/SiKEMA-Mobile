import axios from 'axios';

export const APIClient = ({token = '', contentType = 'application/json', abortController = null}) => {
    var instance = axios.create({
        // signal: abortController ?  abortController.signal : undefined,
        // baseURL: 'https://api.carolynn.my.id',
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
                console.log("Error 401: Unauthorized.");
            }
            return Promise.reject(error);
        }
    );
    return instance
}