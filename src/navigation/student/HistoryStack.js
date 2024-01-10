import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Course from '../../page/student/Course';
import Event from '../../page/student/Event';
import Excuse from '../../page/student/Excuse';

const Stack = createNativeStackNavigator();

const StudentHistoryStack = () => {
    return (
        <Stack.Navigator screenOptions={{headerShown:false, animation: 'none'}}>
            <Stack.Screen 
                name="Student.Course" 
                component={Course} 
                options={{title:"Histori Presensi"}}/>
            <Stack.Screen 
                name="Student.Event" 
                component={Event} 
                options={{title:"Presensi"}}/>
            <Stack.Screen name="Student.Excuse" component={Excuse} options={{title:"Ketidakhadiran"}}/>
        </Stack.Navigator>
    )
}

export default StudentHistoryStack