import React, { useState, useEffect, useContext } from 'react'
import { View, ScrollView, StyleSheet, Dimensions, Text, Pressable, TextInput, Button, TouchableOpacity } from 'react-native'
import { Modal, Portal } from 'react-native-paper'
import Icon from 'react-native-vector-icons/FontAwesome6'
import CheckBox from '@react-native-community/checkbox';
import QRCode from 'react-native-qrcode-svg'
import { APIClient } from '../../api/backend'
import { AuthContext } from '../../context/AuthContext'
import CommonPageWithHeader from '../../components/CommonPageWithHeader'
import AsyncStorage from '@react-native-async-storage/async-storage'
import HotspotManager, { Device, TetheringError } from '@react-native-tethering/hotspot'
import TcpSocket from 'react-native-tcp-socket'

const screenHeight = Dimensions.get('window').height
const screenWidth = Dimensions.get('window').width

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F3F3',
        minHeight: '100%',
    },
    header: {
        flex: 1,
        paddingTop: 40,
        paddingLeft: 40,
        paddingRight: 40,
    },
    headerSubcard: {
        height: 100,
        borderRadius: 50,
        backgroundColor: '#AF2655',
        overflow: 'hidden',
        position: 'absolute',
        top: 160,
        left: '14%',
        right: '14%',
        width: '96%',
    },
    headerText: {
        color: '#000000',
    },
    headerBackground: {
        backgroundColor: '#E46B6B',
        borderBottomLeftRadius: 50,
        borderBottomRightRadius: 50,
        height: 300,
        position: 'absolute',
        width: 400,
    },
    title: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#F3F3F3',
    },
    headerTitle: {
        alignItems: 'center',
        flexDirection: 'row',
        marginBottom: 50,
    },
    card: {
        padding: 20,
        borderRadius: 20,
        marginBottom: 20,
        backgroundColor: '#ffffff',
        overflow: 'hidden',
        width: '100%',
        minHeight: 300,
    },
    setting: {
        marginRight: 20
    },
    parameter: {
        alignItems: 'center',
        color: '#000',
        fontSize: 12,
        fontFamily: 'Poppins-SemiBold',
    },
    parameterValue: {
        alignItems: 'center',
        color: '#000',
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
    },
})

const EventDetail = ({ route, navigation }) => {
    const { eventId } = route.params
    const { jwtToken, userInfo } = useContext(AuthContext)
    const [networkInfo, setNetworkInfo] = useState(null)
    const [visible, setVisible] = useState(false)
    const showModal = async () => {
        let state = await HotspotManager.isHotspotEnabled()

        if (!state) {
            await HotspotManager.setHotspotEnabled(true)
        }

        const server = TcpSocket.createServer(function (socket) {
            console.log('Connecting' + socket.address())
            socket.on('data', (data) => {
                APIClient(jwtToken).post('/api/lecturer/' + userInfo.lecturer.ID + '/event/' + eventId + '/student', {
                    "student_id": [data.toString('utf-8')],
                })
                socket.write('Echo server ' + data);
                console.log(`New Message: ${data}`)
                getEventData()
            });

            socket.on('error', (error) => {
                console.log('An error ocurred with client socket ', error);
            });

            socket.on('close', (error) => {
                console.log('Closed connection with ', socket.address());
            });
        }).listen({ port: 7777, host: '0.0.0.0' });

        APIClient(jwtToken).patch('/api/lecturer/' + userInfo.lecturer.ID + '/event/' + eventId, {
            "status": 1,
        })
        let SSID = await AsyncStorage.getItem('SSID')
        let Password = await AsyncStorage.getItem('Password')
        APIClient(jwtToken).post('/api/lecturer/' + userInfo.lecturer.ID + '/event/' + eventId + '/qrcode', {
            "ssid": SSID,
            "password": Password,
        })

        setVisible(true)
    }

    const hideModal = async () => {
        let state = await HotspotManager.isHotspotEnabled()

        if (state) {
            await HotspotManager.setHotspotEnabled(false)
        }
        APIClient(jwtToken).patch('/api/lecturer/' + userInfo.lecturer.ID + '/event/' + eventId, {
            "status": 0,
        })
        setVisible(false)
    }

    const [studentData, setStudentData] = useState([])
    const [eventData, setEventData] = useState([])

    const getEventData = async () => {
        let res1 = await APIClient(jwtToken).get('/api/lecturer/' + userInfo.lecturer.ID + '/event/' + eventId)

        let res2 = await APIClient(jwtToken).get(`/api/class/${res1.data.data.class_id}`)
        getPresent(res2.data.data.students, res1.data.data)
    }

    const getNetworkData = async () => {
        let SSID, Password
        try {
            SSID = await AsyncStorage.getItem('SSID')
            Password = await AsyncStorage.getItem('Password')
        } catch (error) {
            SSID = ""
            Password = ""
        }
        setNetworkInfo(`{"ssid": "${SSID}", "password": "${Password}"}`)
    }

    const checkBoxPressed = async (newState, nim) => {
        if (eventData.status == 2)
            return
        try {
            let res
            if (newState) {
                res = await APIClient(jwtToken).post('/api/lecturer/' + userInfo.lecturer.ID + '/event/' + eventId + '/student', {
                    "student_id": [nim],
                })
            } else {
                res = await APIClient(jwtToken).delete('/api/lecturer/' + userInfo.lecturer.ID + '/event/' + eventId + '/student', {
                    data: {
                        student_id: [nim],
                    }
                })
            }
            const newStudentData = [...studentData];
            const index = studentData.findIndex(item => item.Nim === nim);

            // if request is successful, set the status of said student to be the same as the status sent,
            // if not then revert by inversing the newState
            console.log('Absen berhasil')
            if (index !== -1) {
                newStudentData[index].status = newState ? 1 : 0;
                setStudentData(newStudentData)
            }
        } catch (error) {
            console.log('ERROR : ' + error.response.data.message + ' NIM: ' + nim)
        }
    }

    const getPresent = (allStudent, event) => {
        var presentStudent = event.students
        var student = allStudent
        for (var i = 0, sLen = student.length; i < sLen; i++) {
            student[i].status = 0
            if (presentStudent == null)
                continue
            for (var j = 0, pLen = presentStudent.length; j < pLen; j++) {
                if (student[i].Nim == presentStudent[j].Nim) {
                    student[i].status = 1
                    console.log(`Student ${student[i].Nim} hadir`)
                }
            }
        }

        setEventData(event)
        setStudentData(student)
    }

    const finalizeEvent = async () => {
        let res = await APIClient(jwtToken).patch('/api/lecturer/' + userInfo.lecturer.ID + '/event/' + eventId + '/finalize')
        getEventData()
    }

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getEventData()
            getNetworkData()
        });

        return unsubscribe;
    }, [navigation]);

    return (
        <CommonPageWithHeader
            showBackIcon={true}
            backIconAction={() => { navigation.goBack() }}
            showBackground={true}>
            <View style={styles.card}>
                <View style={{ flex: 1, flexDirection: 'column' }}>
                    <View style={{ marginBottom: 5 }}>
                        <Text style={styles.parameter}>Mata Kuliah</Text>
                        <Text style={styles.parameterValue}>{eventData && eventData.course ? (eventData.course.name) : ('')}</Text>
                    </View>
                    <View style={{ marginBottom: 5 }}>
                        <Text style={styles.parameter}>Kelas</Text>
                        <Text style={styles.parameterValue}>{eventData && eventData.class ? (eventData.class.name) : ('')}</Text>
                    </View>
                    <View style={{ marginBottom: 5 }}>
                        <Text style={styles.parameter}>Pertemuan</Text>
                        <Text style={styles.parameterValue}>{eventData ? (eventData.meet) : ('')}</Text>
                    </View>
                    <View style={{ marginBottom: 5 }}>
                        <Text style={styles.parameter}>Status</Text>
                        <Text style={styles.parameterValue}>{eventData ? (eventData.status == 2 ? 'Final' : 'Dibuka') : ('Dibuka')}</Text>
                    </View>
                    {eventData ? (eventData.status == 2 ? '' : (
                        <View style={buttonStyle.container}>
                            <TouchableOpacity style={buttonStyle.button} onPress={showModal}>
                                <Text style={buttonStyle.buttonText}>QR Code</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={buttonStyle.button} onPress={finalizeEvent}>
                                <Text style={buttonStyle.buttonText}>Finalisasi</Text>
                            </TouchableOpacity>
                        </View>
                    )) : ''}

                </View>
            </View>
            <View style={styles.card}>
                <View style={tableStyles.container}>
                    <View style={tableStyles.headerRow}>
                        <Text style={tableStyles.headerCell}>NIM</Text>
                        <Text style={tableStyles.headerCellName}>Nama</Text>
                        <Text style={tableStyles.headerCellStatus}>Status</Text>
                    </View>
                    {studentData ? studentData.map((item) => (
                        <View key={item.Nim} style={tableStyles.row}>
                            <Text style={tableStyles.cell}>{item.Nim}</Text>
                            <Text style={tableStyles.cellName}>{item.Name}</Text>
                            <CheckBox
                                style={tableStyles.cellStatus}
                                key={item.Nim}
                                disabled={false}
                                value={item.status ? (item.status == 1 ? true : false) : false}
                                onValueChange={(newValue) => checkBoxPressed(newValue, item.Nim)}
                            />
                        </View>
                    )) : []}
                </View>
            </View>
            {eventData ? (eventData.Status == 2 ? '' : (
                <Portal>
                    <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={{ width: '100%', backgroundColor: 'white', padding: 20 }}>
                        <QRCode
                            value={networkInfo}
                            size={300}
                        />
                    </Modal>
                </Portal>
            )) : ''}
        </CommonPageWithHeader>
    )
}

const buttonStyle = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#E46B6B',
        padding: 10,
        borderRadius: 5,
        margin: 10,
    },
    buttonText: {
        color: 'white',
        fontFamily: "Poppins-Bold"
    },
    fileName: {
        marginTop: 20,
        fontSize: 16,
    },
});

const tableStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    headerRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#000000',
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#cccccc',
    },
    headerCell: {
        flex: 2,
        padding: 5,
        fontSize: 12,
        fontWeight: 'bold',
    },
    headerCellName: {
        flex: 3,
        padding: 5,
        fontSize: 12,
        fontWeight: 'bold',
    },
    headerCellStatus: {
        flex: 1,
        padding: 5,
        fontSize: 12,
        fontWeight: 'bold',
    },
    cell: {
        flex: 2,
        fontSize: 12,
        fontFamily: 'Poppins-Regular',
        padding: 5,
    },
    cellName: {
        flex: 4,
        fontSize: 12,
        fontFamily: 'Poppins-Regular',
        padding: 5,
    },
    cellStatus: {
        flex: 1,
        fontSize: 0,
        fontFamily: 'Poppins-Regular',
        alignItems: 'center',
        padding: 0,
    },
});

export default EventDetail