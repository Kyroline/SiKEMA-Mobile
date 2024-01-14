import React, { useEffect, useState, useContext } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
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
    const [event, setEvent] = useState([])

    const getEventData = async () => {
        let res = await APIClient({token: jwtToken}).get('api/lecturer/' + userInfo.lecturer.ID + '/event?class_id=' + classId + '&course_id=' + courseId)
        setEvent(res.data.data)
    }

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getEventData()
        });

        // Return the function to unsubscribe from the event so it gets removed on unmount
        return unsubscribe;
    }, [navigation]);

    useEffect(() => {
        getEventData()
    }, [courseId])

    return (
        <CommonPageWithHeader
            showBackIcon={true}
            backIconAction={() => { navigation.goBack() }}>
            {event.map((item) => {
                var dateObject = new Date(item.created_at);
                return (
                    <View key={item.course_id + item.class_id + item.meet} style={styles.card}>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'column' }}>
                                <View style={{ marginBottom: 5, flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={styles.parameter}>Tanggal</Text>
                                    <Text style={styles.parameterValue}> : {dateObject.toISOString().split('T')[0]}</Text>
                                </View>
                                <View style={{ marginBottom: 5, flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={styles.parameter}>Jam</Text>
                                    <Text style={styles.parameterValue}> : {("0" + dateObject.getHours()).slice(-2)}:{("0" + dateObject.getMinutes()).slice(-2)}</Text>
                                </View>
                                <View style={{ marginBottom: 5 }}>
                                    <Text style={styles.parameter}>Pertemuan {item.meet}</Text>
                                </View>
                            </View>
                            <View style={{  flexDirection: 'column' }}>
                                <View style={{ marginBottom: 5, alignItems: 'center' }}>
                                    <TouchableOpacity style={{ alignItems: 'center' }}
                                    onPress={ () => navigation.navigate('Lecturer.Detail', {
                                        eventId: item.id,
                                    }) }>
                                        <Text style={styles.parameter}>Kehadiran</Text>
                                        <Text style={styles.parameterValue}>{item.student_count ?? '0'}/{item.class.student_count}</Text>
                                    </TouchableOpacity>
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