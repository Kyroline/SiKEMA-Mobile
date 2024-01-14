import React, { useContext } from 'react'
import { View, ActivityIndicator } from 'react-native'
import { AuthContext } from './context/AuthContext'
import Routes from './Routes'

const App = () => {
    const { isLoading, jwtToken } = useContext(AuthContext)

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>)
    }

    // if (jwtToken == null) {
    //     return <AuthStack />
    // } else {
    //     return <AppStack />
    // }
    return <Routes/>
}

export default App;