import React, { useContext } from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import Lecturer from '../screens/Lecturer'
import Setting from '../screens/Settings';
import CustomDrawer from '../components/CustomDrawer';
import { AuthContext } from '../context/AuthContext';

const Drawer = createDrawerNavigator();

const DrawerStack = () => {
    const { userInfo } = useContext(AuthContext)

    return (
        <Drawer.Navigator drawerContent={props => <CustomDrawer {...props}/>} screenOptions={{ headerShown: false }}>
            <Drawer.Screen name="MainPage" component={Lecturer} />
            {userInfo.lecturer ? <Drawer.Screen name="Settings" component={Setting} /> : ''}
        </Drawer.Navigator>
    )
}

export default DrawerStack 