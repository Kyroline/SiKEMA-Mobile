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
        fontSize: 17,
        fontFamily: 'Poppins-Bold',
    },
    parameterValue: {
        alignItems: 'center',
        color: '#fff',
        fontSize: 15,
        fontFamily: 'Poppins-Regular',
    },
})

const Event = ({ route, navigation }) => {
    const { jwtToken, userInfo } = useContext(AuthContext)
    const { courseId, classId } = route.params;
    const [attendance, setAttendance] = useState([])

    const getAttendanceData = async () => {
        let courseRes = await APIClient({token: jwtToken}).get('api/student/' + userInfo.student.ID + '/course/' + courseId + '/attendance')
        setAttendance(courseRes.data.data)
    }
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getAttendanceData()
        });

        // Return the function to unsubscribe from the event so it gets removed on unmount
        return unsubscribe;
    }, [navigation]);
    useEffect(() => {
        getAttendanceData()
    }, [courseId])

    return (
        <CommonPageWithHeader
            showBackIcon={true}
            backIconAction={() => { navigation.goBack() }}>
            {attendance.map((item) => {
                var dateObject = new Date(item.created_at);
                return (
                    <View key={item.course_id + item.class_id} style={styles.card}>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <View style={{ flex: 2, flexDirection: 'column' }}>
                                <View style={{ marginBottom: 5 }}>
                                    <Text style={styles.parameter}>Tanggal</Text>
                                    <Text style={styles.parameterValue}>{dateObject.toISOString().split('T')[0]}</Text>
                                </View>
                                <View style={{ marginBottom: 5 }}>
                                    <Text style={styles.parameter}>Jam</Text>
                                    <Text style={styles.parameterValue}>{("0" + dateObject.getHours()).slice(-2)}:{("0" + dateObject.getMinutes()).slice(-2)}</Text>
                                </View>
                            </View>
                            <View style={{ flex: 1, flexDirection: 'column' }}>
                                <View style={{ marginBottom: 5 }}>
                                    <Text style={styles.parameter}>Pertemuan</Text>
                                    <Text style={styles.parameterValue}>{item.meet}</Text>
                                </View>
                                <View style={{ marginBottom: 5 }}>
                                    {item.students ? (
                                        <TouchableOpacity>
                                            <Text style={styles.parameter}>Status</Text>
                                            <Text style={styles.parameterValue}>Hadir</Text>
                                        </TouchableOpacity>
                                    ) : (
                                        <TouchableOpacity
                                            onPress={() => { 
                                                navigation.navigate('Student.Excuse', {
                                                    eventId: item.id
                                                }); }}>
                                            <Text style={styles.parameter}>Status</Text>
                                            <Text style={styles.parameterValue}>Tidak Hadir</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>
                        </View>
                    </View>
                )
            })}

        </CommonPageWithHeader>

    )
}

export default Event