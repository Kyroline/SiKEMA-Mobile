import React, { useEffect, useState } from 'react'
import { PermissionsAndroid } from 'react-native'
import { Button } from 'react-native-paper'
import WifiManager from "react-native-wifi-reborn"
import { Camera, useCodeScanner } from 'react-native-vision-camera'
import { NetworkInfo } from 'react-native-network-info'
import TcpSocket from 'react-native-tcp-socket'
import { isLocationEnabled } from 'react-native-android-location-enabler'
import Modal from './Modal'

const QRCode = ({ navigation }) => {

    const onReadSuccess = async (result) => {
        try {
            let wifiInfo = JSON.parse(result)
            await checkLocation()
            await connectToWifi(wifiInfo.ssid, wifiInfo.password)
            setCamera(false)
        } catch (error) {
            console.error(error)
        }
    }

    const checkLocation = async () => {
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
        )
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {

        } else {
            throw new Error('Location permission denied!')
        }

        try {
            await promptForEnableLocationIfNeeded();
            // The user has accepted to enable the location services
            // data can be :
            //  - "already-enabled" if the location services has been already enabled
            //  - "enabled" if user has clicked on OK button in the popup
        } catch (error) {
            console.error(error.message);
            throw new Error(error)
            // The user has not accepted to enable the location services or something went wrong during the process
            // "err" : { "code" : "ERR00|ERR01|ERR02|ERR03", "message" : "message"}
            // codes :
            //  - ERR00 : The user has clicked on Cancel button in the popup
            //  - ERR01 : If the Settings change are unavailable
            //  - ERR02 : If the popup has failed to open
            //  - ERR03 : Internal error
        }
    }

    const connectToWifi = async (ssid, password) => {
        try {
            await WifiManager.connectToProtectedSSID(ssid, password, false, false);
        } catch (error) {
            throw new Error(`Connection failed : ${error.message}`)
        }
    }

    const qrScanner = useCodeScanner({
        codeTypes: ['qr'],
        onCodeScanned: (codes) => onReadSuccess(codes[0].value)
    })

    const [camera, setCamera] = useState(true)
    const [absentIP, setAbsentIP] = useState(null)


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

    return (
        <Modal>
            {
                (camera ? (
                    <Camera
                        codeScanner={qrScanner} />
                    // <QRCodeScanner
                    //     onRead={onSuccess}
                    //     flashMode={RNCamera.Constants.FlashMode.off}
                    //     cameraProps={{ captureAudio: false }}
                    // />
                ) : (
                    <>
                        <Button
                            onPress={toggleCamera}>Hadir</Button>
                    </>
                ))
            }
        </Modal>
    )
}

export default QRCode