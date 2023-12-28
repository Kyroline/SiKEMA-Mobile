import React, { useState, useEffect, useContext } from 'react'
import { View, ScrollView, StyleSheet, Dimensions, Text, Pressable, TextInput, Button } from 'react-native'
import { Modal, Portal } from 'react-native-paper'
import Icon from 'react-native-vector-icons/FontAwesome6'
// import CheckBox from 'react-native-check-box'
import QRCode from 'react-native-qrcode-svg'
import { APIClient } from '../../api/backend'
import { AuthContext } from '../../context/AuthContext'

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
        fontWeight: '300',
    },
    parameterValue: {
        alignItems: 'center',
        color: '#000',
        fontSize: 18,
        fontWeight: '100',
    },
})

const Event = ({ route, navigation }) => {
    const { jwtToken } = useContext(AuthContext)
    const [visible, setVisible] = useState(false)
    const showModal = () => setVisible(true)
    const hideModal = () => setVisible(false)
    const [studentData, setStudentData] = useState([])
    const [eventData, setEventData] = useState([])

    const getEventData = async () => {
        let res1 = await APIClient(jwtToken).get('/api/lecturer/1/event/13')

        let res2 = await APIClient(jwtToken).get(`/api/class/${res1.data.data.class_id}`)
        getPresent(res2.data.data.students, res1.data.data)
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

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getEventData()
        });

        return unsubscribe;
    }, [navigation]);

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerBackground} />
                <View style={styles.headerSubcard} />
                <View style={styles.headerTitle} >
                    <Pressable style={styles.setting} onPress={() => { }}>
                        <Icon name="chevron-left" size={20} color="white" />
                    </Pressable>
                    <Text style={styles.title}>Detail Presensi</Text>
                </View>
                <View style={styles.card}>
                    <View style={{ flex: 1, flexDirection: 'column' }}>
                        <View style={{ marginBottom: 5 }}>
                            <Text style={styles.points}>Mata Kuliah</Text>
                            <Text style={styles.parameterValue}>{eventData && eventData.course ? (eventData.course.name) : ('')}</Text>
                        </View>
                        <View style={{ marginBottom: 5 }}>
                            <Text style={styles.points}>Kelas</Text>
                            <Text style={styles.parameterValue}>{eventData && eventData.class ? (eventData.class.name) : ('')}</Text>
                        </View>
                        <View style={{ marginBottom: 5 }}>
                            <Text style={styles.points}>Pertemuan</Text>
                            <Text style={styles.parameterValue}>{eventData ? (eventData.meet) : ('')}</Text>
                        </View>
                        <View style={{ marginBottom: 5 }}>
                            <Text style={styles.points}>Status</Text>
                            <Text style={styles.parameterValue}>{eventData ? (eventData.status) : ('')}</Text>
                        </View>
                        <View style={{ justifyContent: 'space-between', alignItems: 'center', flex: 1, flexDirection: 'row' }}>
                            <Button
                                onPress={showModal}
                                title="QR Code"
                                color="#E46B6B"
                                accessibilityLabel="Learn more about this purple button"
                            />
                            <Button
                                onPress={() => { }}
                                title="Finalisasi"
                                color="#E46B6B"
                                accessibilityLabel="Learn more about this purple button"
                            />
                        </View>
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
                                <Text style={tableStyles.cellStatus}>{item.status ? (item.status == 1 ? 'Hadir' : 'Tidak hadir') : 'Tidak hadir'}</Text>
                            </View>
                        )) : []}
                    </View>
                </View>
            </View>
            <Portal>
                <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={{ width: '100%', backgroundColor: 'white', padding: 20 }}>
                    <QRCode
                        value='{"ssid": "aaaaaa", "password": "12345678"}'
                        size={300}
                    />
                </Modal>
            </Portal>
        </ScrollView>
    )
}

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
        padding: 5,
    },
    cellName: {
        flex: 3,
        fontSize: 12,
        padding: 5,
    },
    cellStatus: {
        flex: 1,
        fontSize: 12,
        padding: 5,
    },
});

export default Event