import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Text, View, TouchableOpacity } from 'react-native'
import Dashboard from '../page/Dashboard'
import Event from '../page/lecturer/Event'
import Icon from 'react-native-vector-icons/FontAwesome6'
import TestingApp from '../TestingApp'
import Excuse from '../page/student/Excuse'

const Tab = createBottomTabNavigator();

const QRButton = ({ children, onPress }) => (
    <TouchableOpacity
        style={{
            top: -20,
            justifyContent: 'center',
            alignItems: 'center'
        }}
        onPress={() => console.log('Pressed')}>
        <View style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: '#E46B6B'
        }}>{children}</View>
    </TouchableOpacity>
)

export const LecturerBottomStack = () => {
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
                component={Event}
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
                component={Event}
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
                        <QRButton {...props} />
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
                component={Event}
                options={{
                    tabBarLabel: "",
                    tabBarIcon: ({ color, size }) => (
                        <View style={{ alignItems: 'center' }}>
                            <Icon name="bars" size={size} color={color} />
                        </View>
                    )
                }} />
        </Tab.Navigator>
    );
}

export const StudentBottomStack = () => {
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
                component={Excuse}
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
                component={Event}
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
                            <Icon name="qrcode" size={50} color='#fff' />
                        </View>
                    ),
                    tabBarButton: (props) => (
                        <QRButton {...props} />
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
                component={Event}
                options={{
                    tabBarLabel: "",
                    tabBarIcon: ({ color, size }) => (
                        <View style={{ alignItems: 'center' }}>
                            <Icon name="bars" size={size} color={color} />
                        </View>
                    )
                }} />
        </Tab.Navigator>
    );
}