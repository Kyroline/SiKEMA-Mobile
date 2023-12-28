import React, { createContext, useState } from 'react'
import { APIClient } from '../api/backend'
import axios from 'axios'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState(null)
    const [jwtToken, setJwtToken] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const login = (creds, password) => {
        setIsLoading(true)
        
        APIClient().post("/api/auth/login", {
            'nim': '43321001',
            'password': "secret"
        }).then(res => {
            let resp = res.data.data
            setUserInfo(resp.user_data)
            setJwtToken(resp.access_token)
            setIsLoading(false)
        }).catch(res => {
            console.log(`Login error : ${res.message}`)
            setIsLoading(false)
        })
    }

    const logout = () => {
        setIsLoading(true)
        setUserInfo(null)
        setJwtToken(null)
        setIsLoading(false)
        console.log('Logout done')
    }

    const validate = () => {
        setIsLoading(true)
        APIClient(jwtToken).get("/api/auth/validate")
            .then(res => {
                let userInfo = res.data.data
                setUserInfo(userInfo)
                setIsLoading(false)
            })
    }

    return (
        <AuthContext.Provider value={{ userInfo, jwtToken, isLoading, login, logout, validate, setIsLoading }}>
            {children}
        </AuthContext.Provider>
    )
}