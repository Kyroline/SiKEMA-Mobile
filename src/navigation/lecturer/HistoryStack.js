import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Course from '../../page/lecturer/Course'
import Event from '../../page/lecturer/Event'
import EventDetail from '../../page/lecturer/EventDetail';

const Stack = createNativeStackNavigator();

const LecturerHistoryStack = () => {
    return (
        <Stack.Navigator screenOptions={{headerShown: false, animation: 'none'}}>
            <Stack.Screen name="Lecturer.Course" component={Course} />
            <Stack.Screen name="Lecturer.Event" component={Event} />
            <Stack.Screen name="Lecturer.Detail" component={EventDetail} />
        </Stack.Navigator>
    )
}

export default LecturerHistoryStack