import React, { useContext } from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { AuthContext } from './context/AuthContext'
import CustomDrawer from './components/CustomDrawer'
import Login from './page/Login'
import Setting from './screens/Settings'
import { StudentBottomStack } from './navigation/BottomStack'
import { LecturerBottomStack } from './navigation/BottomStack'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { View } from 'react-native'

const Drawer = createDrawerNavigator()
const RootStack = createNativeStackNavigator()

// Pasang ini di src/App
const Routes = () => {
    const { jwtToken, userInfo } = useContext(AuthContext)

    if (jwtToken == null)
        return <Login />
    else {
        if (userInfo.student != null)
            return (
                <RootStack.Navigator screenOptions={{ headerShown: false }}>
                    <RootStack.Group>
                        <RootStack.Screen name='Main.App' component={StudentMainApp} />
                    </RootStack.Group>
                    <RootStack.Group screenOptions={{ presentation: 'modal' }}>
                        <RootStack.Screen name='Modal.QR' component={() => <View />} />
                    </RootStack.Group>
                </RootStack.Navigator>
            )

        if (userInfo.lecturer != null)
            return (
                <RootStack.Navigator screenOptions={{ headerShown: false }}>
                    <RootStack.Group>
                        <RootStack.Screen name='Main.App' component={LecturerMainApp} />
                    </RootStack.Group>
                    <RootStack.Group screenOptions={{ presentation: 'modal' }}>
                        <RootStack.Screen name='Modal.NewEvent' component={() => <View />} />
                    </RootStack.Group>
                </RootStack.Navigator>
            )
    }
}

const StudentMainApp = () => {
    return (
        <Drawer.Navigator drawerContent={props => <CustomDrawer {...props} />} screenOptions={{ headerShown: false }}>
            <Drawer.Screen name='MainPage' component={StudentBottomStack} />
            <Drawer.Screen name='Profile' component={() => <></>} />
        </Drawer.Navigator>
    )
}

const LecturerMainApp = () => {
    return (
        <Drawer.Navigator drawerContent={props => <CustomDrawer {...props} />} screenOptions={{ headerShown: false }}>
            <Drawer.Screen name="MainPage" component={LecturerBottomStack} />
            <Drawer.Screen name="Profile" component={() => <></>} />
            <Drawer.Screen name="Settings" component={Setting} />
        </Drawer.Navigator>
    )
}

export default Routes