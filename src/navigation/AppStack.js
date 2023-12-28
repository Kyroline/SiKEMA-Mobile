import React, { useContext } from 'react'
import DrawerStack from './DrawerStack'
import { AuthContext } from '../context/AuthContext'
import Lecturer from '../screens/Lecturer'
import Student from '../screens/Student'

const AppStack = () => {
    const { userInfo } = useContext(AuthContext)

    if (userInfo.student !== null) {
        console.log(`User is student`)
        return (
            <Student/>
        )
    }

    if (userInfo.lecturer !== null) {
        console.log(`User is lecturer`)
        return (
            <Lecturer />
        )
    }

    return (
        <DrawerStack />
    )
}

export default AppStack