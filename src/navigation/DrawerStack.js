import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import Lecturer from '../screens/Lecturer'
import Event from '../page/lecturer/Event'
import CustomDrawer from '../components/CustomDrawer';

const Drawer = createDrawerNavigator();

const DrawerStack = () => {
    return (
        <Drawer.Navigator drawerContent={props => <CustomDrawer {...props}/>} screenOptions={{ headerShown: false }}>
            <Drawer.Screen name="Home" component={Lecturer} />
            <Drawer.Screen name="Settings" component={Event} />
        </Drawer.Navigator>
    )
}

export default DrawerStack 