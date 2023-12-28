import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { LecturerBottomStack } from '../navigation/BottomStack'
import CustomDrawer from '../components/CustomDrawer'
import Setting from './Settings'

const Drawer = createDrawerNavigator();

const Lecturer = () => {
    return (
        <Drawer.Navigator drawerContent={props => <CustomDrawer {...props} />} screenOptions={{ headerShown: false }}>
            <Drawer.Screen name="Home" component={LecturerStack} />
            <Drawer.Screen name="Settings" component={Setting} />
        </Drawer.Navigator>
    )
}

const LecturerStack = () => {
    return (
        <LecturerBottomStack />
    )
}

export default Lecturer