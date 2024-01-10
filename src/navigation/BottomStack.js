import React, { useContext } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useNavigation } from '@react-navigation/native'
import { Text, View, TouchableOpacity } from 'react-native'
import StudentDashboard from '../page/student/Dashboard'
import Dashboard from '../page/lecturer/Dashboard'
import Icon from 'react-native-vector-icons/FontAwesome6'
import TestingApp from '../TestingApp'
import StudentHistoryStack from './student/HistoryStack'
import { AuthContext } from '../context/AuthContext'
import LecturerHistoryStack from './lecturer/HistoryStack'

const Tab = createBottomTabNavigator();

const QRButton = ({ children, onPress }) => (
    <TouchableOpacity
        style={{
            top: -20,
            justifyContent: 'center',
            alignItems: 'center'
        }}
        onPress={onPress}>
        <View style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: '#E46B6B'
        }}>{children}</View>
    </TouchableOpacity>
)

const DrawerButton = ({ children, onPress }) => (
    <TouchableOpacity
        style={{
            top: -20,
            justifyContent: 'center',
            alignItems: 'center'
        }}
        onPress={onPress}>
        <View style={{
            width: 80,
            height: 80,
        }}>{children}</View>
    </TouchableOpacity>
)

export const LecturerBottomStack = () => {
    const navigation = useNavigation();
    const { showNewEvent } = useContext(AuthContext)
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: {
                    height: 60
                }
            }}>
            <Tab.Screen
                name="Home"
                component={Dashboard}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <View style={{ alignItems: 'center' }}>
                            <Icon name="house" size={size} color={color} />
                            <Text style={{ color: color, fontSize: 12 }}>Home</Text>
                        </View>
                    )
                }} />
            <Tab.Screen
                name="Histori"
                component={LecturerHistoryStack}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <View style={{ alignItems: 'center' }}>
                            <Icon name="clock" size={size} color={color} />
                            <Text style={{ color: color, fontSize: 12 }}>History</Text>
                        </View>
                    )
                }} />
            <Tab.Screen
                name="Add"
                component={Dashboard}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <View style={{ alignItems: 'center' }}>
                            <Icon name="plus" size={50} color='#fff' />
                        </View>
                    ),
                    tabBarButton: (props) => (
                        <QRButton onPress={showNewEvent} >
                            {props.children}
                        </QRButton>
                    )
                }} />
            <Tab.Screen
                name="Profle"
                component={TestingApp}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <View style={{ alignItems: 'center' }}>
                            <Icon name="user" size={size} color={color} />
                            <Text style={{ color: color, fontSize: 12 }}>Profile</Text>
                        </View>
                    )
                }} />
            <Tab.Screen
                name="Ex"
                component={Dashboard}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <View style={{ alignItems: 'center' }}>
                            <Icon name="bars" size={size} color={color} />
                        </View>
                    ),
                    tabBarButton: (props) => (
                        <TouchableOpacity
                            {...props}
                            onPress={() => {
                                navigation.openDrawer();
                            }}>
                            {props.children}
                        </TouchableOpacity>
                    ),
                }} />
        </Tab.Navigator>
    );
}

export const StudentBottomStack = () => {
    const navigation = useNavigation();

    const { showQR } = useContext(AuthContext)
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: {
                    height: 60
                }
            }}>
            <Tab.Screen
                name="Home"
                component={StudentDashboard}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <View style={{ alignItems: 'center' }}>
                            <Icon name="house" size={size} color={color} />
                            <Text style={{ color: color, fontSize: 12, fontFamily: 'Poppins-Bold' }}>Home</Text>
                        </View>
                    )
                }} />
            <Tab.Screen
                name="Histori"
                component={StudentHistoryStack}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <View style={{ alignItems: 'center' }}>
                            <Icon name="clock" size={size} color={color} />
                            <Text style={{ color: color, fontSize: 12, fontFamily: 'Poppins-Bold' }}>History</Text>
                        </View>
                    )
                }} />
            <Tab.Screen
                name="Add"
                component={StudentDashboard}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <View style={{ alignItems: 'center' }}>
                            <Icon name="qrcode" size={50} color='#fff' />
                        </View>
                    ),
                    tabBarButton: (props) => (
                        <QRButton onPress={showQR} >
                            {props.children}
                        </QRButton>
                    )
                }} />
            <Tab.Screen
                name="Profle"
                component={StudentDashboard}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <View style={{ alignItems: 'center' }}>
                            <Icon name="user" size={size} color={color} />
                            <Text style={{ color: color, fontSize: 12, fontFamily: 'Poppins-Bold' }}>Profile</Text>
                        </View>
                    )
                }} />
            <Tab.Screen
                name="Ex"
                component={StudentDashboard}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <View style={{ alignItems: 'center' }}>
                            <Icon name="bars" size={size} color={color} />
                        </View>
                    ),
                    tabBarButton: (props) => (
                        <TouchableOpacity
                            {...props}
                            onPress={() => {
                                navigation.openDrawer();
                            }}>
                            {props.children}
                        </TouchableOpacity>
                    ),
                }} />
        </Tab.Navigator>

    );
}