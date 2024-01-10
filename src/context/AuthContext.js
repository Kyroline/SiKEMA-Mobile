import React, { createContext, useEffect, useState } from 'react'
import { Text, StyleSheet, TouchableOpacity, PermissionsAndroid, ToastAndroid } from 'react-native';
import { APIClient } from '../api/backend'
import { Modal, Portal, PaperProvider, Button, View } from 'react-native-paper'
import QRCodeScanner from 'react-native-qrcode-scanner'
import { RNCamera } from 'react-native-camera'
import AsyncStorage from '@react-native-async-storage/async-storage'
import WifiManager from "react-native-wifi-reborn"
import { NetworkInfo } from 'react-native-network-info'
import TcpSocket from 'react-native-tcp-socket'
import Select from '../components/Select'

const styles = StyleSheet.create({
    centerText: {
        flex: 1,
        fontSize: 18,
        padding: 32,
        color: '#777'
    },
    textBold: {
        fontWeight: '500',
        color: '#000'
    },
    buttonText: {
        fontSize: 21,
        color: 'rgb(0,122,255)'
    },
    buttonTouchable: {
        padding: 16
    }
});

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState(null)
    const [jwtToken, setJwtToken] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [selectedClass, setSelectedClass] = useState(null)
    const [selectedCourse, setSelectedCourse] = useState(null)
    const [selectedMeet, setSelectedMeet] = useState(null)

    const [absentIP, setAbsentIP] = useState(null)

    const [qrState, setQrState] = useState(false)
    const [newEventState, setNewEventState] = useState(false)

    const showQR = () => setQrState(true);
    const hideQR = () => setQrState(false);

    const [camera, setCamera] = useState(true)

    const showNewEvent = async () => {
        let courseRes = await APIClient(jwtToken).get('api/lecturer/' + userInfo.lecturer.ID + '/course')
        const uniqueClasses = [...new Set(courseRes.data.data.map(item => ({ 'value': item.class_id, 'label': item.class.name })))];
        setClasses(uniqueClasses)
        setNewEventState(true)
    };

    const hideNewEvent = () => setNewEventState(false);
    const containerStyle = { backgroundColor: 'white', padding: 20 };

    const login = async (creds, password) => {
        setIsLoading(true)
        try {
            let res = await APIClient().post("/api/auth/login", {
                'email': creds,
                'password': "secret"
            })
            let resp = res.data.data
            setUserInfo(resp.user_data)
            setJwtToken(resp.access_token)
            await AsyncStorage.setItem('@user_info', JSON.stringify(resp.user_data))

            await AsyncStorage.setItem('@user_token', resp.access_token)
            setIsLoading(false)
        } catch (error) {
            setIsLoading(false)
            return
        }
    }

    const logout = () => {
        setIsLoading(true)
        setUserInfo(null)
        setJwtToken(null)
        AsyncStorage.removeItem('@user_token')
        AsyncStorage.removeItem('@user_info')
        setIsLoading(false)
        console.log('Logout done')
    }

    const validate = () => {
        setIsLoading(true)
        APIClient(jwtToken).get("/api/auth/validate")
            .then(res => {
                let userInfo = res.data.data
                setUserInfo(userInfo)
                setIsLoading(false)
            })
    }

    const onSuccess = async e => {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                title: 'Location permission is required for WiFi connections',
                message:
                    'This app needs location permission as this is required  ' +
                    'to scan for wifi networks.',
                buttonNegative: 'DENY',
                buttonPositive: 'ALLOW',
            },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            // You can now use react-native-wifi-reborn
        } else {
            // Permission denied
        }
        console.log(e.data)
        let wifiInfo = JSON.parse(e.data)
        try {
            await WifiManager.connectToProtectedSSID(wifiInfo.ssid, wifiInfo.password, false, false);

        } catch (error) {
            console.error("Connection failed!", error);
        }
        setCamera(false)
    }

    const toggleCamera = async () => {
        let gatewayIP = await NetworkInfo.getGatewayIPAddress()
        setAbsentIP(gatewayIP)
        console.log(gatewayIP)
        const client = TcpSocket.createConnection({
            port: 7777,
            host: gatewayIP,
            reuseAddress: true,
        }, () => {
            client.write(userInfo.student.Nim)
            client.destroy()
        });
        client.on('data', function (data) {
            console.log('message was received', data);
        });

        client.on('error', function (error) {
            console.log(`Something error : ${error.message}`);
        });

        client.on('close', function () {
            console.log('Connection closed!');
        });
        setCamera(true)
        hideQR()
    }

    useEffect(() => {
        console.log(absentIP)
    }, [absentIP])

    const onClassSelect = async (value, label) => {
        let courseRes = await APIClient(jwtToken).get('api/lecturer/' + userInfo.lecturer.ID + '/course?class_id=' + value)
        // const uniqueCourses = [...new Set(courseRes.data.data.map(item => `${item.course_id}-${item.course.name}`))];
        const uniqueCourses = [...new Set(courseRes.data.data.map(item => ({ 'value': item.course_id, 'label': item.course.name })))];
        // const enrollments = courseRes.data.data.map(item => `${item.course_id}/${item.class_id} - ${item.course.name} ${item.class.name}`);
        setCourses(uniqueCourses)
        setSelectedClass(value)
    }

    const onCourseSelect = (value, label) => {
        setSelectedCourse(value)
    }

    const createNewEvent = async () => {
        if (selectedClass != null && selectedCourse != null && selectedMeet != null) {
            let response = await APIClient(jwtToken).post('api/lecturer/' + userInfo.lecturer.ID + '/event', {
                'class_id': parseInt(selectedClass),
                'course_id': parseInt(selectedCourse),
                'meet': parseInt(selectedMeet),
            })
            hideNewEvent()
        }
    }

    const [courses, setCourses] = useState([])
    const [classes, setClasses] = useState([])
    const meetA = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
    const meet = [...new Set(meetA.map(item => ({ 'value': item, 'label': item })))];

    useEffect(() => {
        const getLocalToken = async () => {
            setIsLoading(true);
            try {
                let token = await AsyncStorage.getItem('@user_token');
                let userInfoString = await AsyncStorage.getItem('@user_info');
                setJwtToken(token);
                setUserInfo(JSON.parse(userInfoString));
            } catch (error) {
                console.error('Error fetching local token:', error);
            } finally {
                setIsLoading(false);
            }
        };

        getLocalToken();
    }, []);

    return (
        <AuthContext.Provider value={{ absentIP, showQR, showNewEvent, userInfo, jwtToken, isLoading, login, logout, validate, setIsLoading }}>
            <PaperProvider>
                <Portal>
                    <Modal visible={qrState} onDismiss={hideQR} contentContainerStyle={containerStyle}
                    // contentContainerStyle={{
                    //     flex: 1,
                    //     justifyContent: 'center',
                    //     alignItems: 'center',
                    //     width: '100%'
                    // }}
                    >
                        {(camera ? (
                            <QRCodeScanner
                                onRead={onSuccess}
                                flashMode={RNCamera.Constants.FlashMode.off}
                                cameraProps={{ captureAudio: false }}
                            />
                        ) : (
                            <>
                                {/* <Text>Matakuliah A</Text>
                                <Text>Kelas A</Text>
                                <Text>Pertemuan 1</Text> */}
                                <Button
                                    onPress={toggleCamera}>Hadir</Button>
                            </>
                        ))}

                    </Modal>

                    <Modal visible={newEventState} onDismiss={hideNewEvent} contentContainerStyle={containerStyle}>
                        <Text>Pilih kelas</Text>
                        <Select
                            data={classes}
                            onSelect={onClassSelect}
                        />
                        <Text>Pilih mata kuliah</Text>
                        <Select
                            data={courses}
                            onSelect={onCourseSelect}

                        />
                        <Text>Pertemuan Ke-</Text>
                        <Select
                            data={meet}
                            onSelect={(value, label) => {
                                setSelectedMeet(value)
                            }}
                        />
                        <TouchableOpacity style={buttonStyle.button} onPress={createNewEvent}>
                            <Text style={buttonStyle.buttonText}>Buat</Text>
                        </TouchableOpacity>
                    </Modal>
                </Portal>
                {children}
            </PaperProvider>
        </AuthContext.Provider>
    )
}

const buttonStyle = StyleSheet.create({
    button: {
        backgroundColor: '#E46B6B',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        width: '16%'
    },
    buttonText: {
        color: 'white',
        fontFamily: "Poppins-Bold",
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center'
    },
});