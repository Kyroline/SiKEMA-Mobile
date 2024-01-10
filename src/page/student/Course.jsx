import React, { useEffect, useState, useContext } from 'react'
import { View, ScrollView, Text, StyleSheet, Pressable, TouchableOpacity } from 'react-native'
import CommonPageWithHeader from '../../components/CommonPageWithHeader'
import { APIClient } from '../../api/backend'
import { AuthContext } from '../../context/AuthContext'

const styles = StyleSheet.create({
    card: {
        padding: 20,
        borderRadius: 20,
        marginBottom: 20,
        backgroundColor: '#E46B6B',
        overflow: 'hidden',
        width: '100%',
    },
    parameter: {
        alignItems: 'center',
        color: '#fff',
        fontSize: 18,
        fontFamily: 'Poppins-Bold',
    },
    parameterValue: {
        alignItems: 'center',
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
    },
})

const Course = ({ navigation }) => {
    const [course, setCourse] = useState([])

    const { jwtToken, userInfo } = useContext(AuthContext)

    const getCourseData = async () => {
        let courseRes = await APIClient(jwtToken).get('api/student/' + userInfo.student.ID + '/course')
        setCourse(courseRes.data.data)
    }
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getCourseData()
        });

        // Return the function to unsubscribe from the event so it gets removed on unmount
        return unsubscribe;
    }, [navigation]);
    useEffect(() => {
        getCourseData()
    }, []);

    return (
        <CommonPageWithHeader showBackIcon={false}>
            {course.map((item) => (
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate('Student.Event', {
                            courseId: item.course_id,
                            classId: item.class_id
                        });
                    }}>
                    <View key={item.course_id + item.class_id} style={styles.card}>
                        <View style={{ flex: 1, flexDirection: 'column' }}>
                            <View style={{ marginBottom: 5 }}>
                                <Text style={styles.parameter}>Mata Kuliah</Text>
                                <Text style={styles.parameterValue}>{item.course.name}</Text>
                            </View>
                            <View style={{ marginBottom: 5 }}>
                                <Text style={styles.parameter}>Dosen</Text>
                                {item.lecturers.map((lecturer) => (
                                    <Text style={styles.parameterValue}>{lecturer.name}</Text>
                                ))}
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            ))}

        </CommonPageWithHeader>

    )
}

export default Course