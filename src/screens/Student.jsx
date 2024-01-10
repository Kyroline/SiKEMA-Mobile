import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
// import { StudentBottomStack } from '../navigation/BottomStack'
import { StudentBottomStack } from '../navigation/BottomStack'
import CustomDrawer from '../components/CustomDrawer'
import Setting from './Settings'
import TestingApp from '../TestingApp'

const Drawer = createDrawerNavigator();

const Student = () => {
    return (
        <Drawer.Navigator drawerContent={props => <CustomDrawer {...props} />} screenOptions={{ headerShown: false }}>
            <Drawer.Screen name="MainPage" component={StudentStack} />
            <Drawer.Screen name="Settings" component={TestingApp} />
        </Drawer.Navigator>
    )
}

const StudentStack = () => {
    return (
        <StudentBottomStack />
    )
}

export default Student