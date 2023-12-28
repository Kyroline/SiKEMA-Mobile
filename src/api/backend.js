import axios from 'axios';

export const APIClient = (token = "", contentType = 'application/json') => {
    var instance = axios.create({
        baseURL: 'http://192.168.0.113:8080',
        timeout: 5000,
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': contentType
        }
    })
    return instance
}