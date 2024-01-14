import React, { createContext, useEffect, useState } from 'react'
import { APIClient } from '../api/backend'
import { PaperProvider } from 'react-native-paper'
import AsyncStorage from '@react-native-async-storage/async-storage'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState(null)
    const [jwtToken, setJwtToken] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const login = async (creds, password) => {
        setIsLoading(true)
        try {
            let res = await APIClient({}).post("/api/auth/login", {
                'email': creds,
                'password': "secret"
            })
            let resp = res.data.data
            setUserInfo(resp.user_data)
            setJwtToken(resp.access_token)
            await AsyncStorage.setItem('@user_info', JSON.stringify(resp.user_data))

            await AsyncStorage.setItem('@user_token', resp.access_token)
            setIsLoading(false)
        } catch (error) {
            setIsLoading(false)
            return
        }
    }

    const logout = () => {
        setIsLoading(true)
        setUserInfo(null)
        setJwtToken(null)
        AsyncStorage.removeItem('@user_token')
        AsyncStorage.removeItem('@user_info')
        setIsLoading(false)
        console.log('Logout done')
    }

    const validate = () => {
        setIsLoading(true)
        APIClient({token: jwtToken}).get("/api/auth/validate")
            .then(res => {
                let userInfo = res.data.data
                setUserInfo(userInfo)
                setIsLoading(false)
            })
    }

    useEffect(() => {
        const getLocalToken = async () => {
            setIsLoading(true);
            try {
                let token = await AsyncStorage.getItem('@user_token');
                let userInfoString = await AsyncStorage.getItem('@user_info');
                setJwtToken(token);
                setUserInfo(JSON.parse(userInfoString));
            } catch (error) {
                console.error('Error fetching local token:', error);
            } finally {
                setIsLoading(false);
            }
        };

        getLocalToken();
    }, []);

    return (
        <AuthContext.Provider value={{ userInfo, jwtToken, isLoading, login, logout, validate, setIsLoading }}>
            <PaperProvider>
                {children}
            </PaperProvider>
        </AuthContext.Provider>
    )
}