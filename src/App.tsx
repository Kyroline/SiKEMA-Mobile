import React, { useEffect, useState } from 'react'
import { View, Pressable, ToastAndroid, Text, Linking } from 'react-native'
import HotspotManager, { Device, TetheringError } from '@react-native-tethering/hotspot'
import { NetworkInfo } from 'react-native-network-info'
import TcpSocket from 'react-native-tcp-socket'
// import RNWriteSettings from 'rn-write-settings';

const options = {
    port: 7777,
    host: '127.0.0.1',
    reuseAddress: true,
    // localPort: 20000,
    // interface: "wifi",
};

const App = () => {
    const [state, setState] = useState(false)
    const [ip, setIp] = useState<string | null>(null)
    const [ssid, setSsid] = useState<string | null>(null)
    const [pass, setPass] = useState<string | null>(null)
    const requestWriteSettingsPermission = async () => {
        try {
            await Linking.openSettings();
        } catch (err) {
            console.error('Error opening settings:', err);
        }
    };
    const openSetting = async () => {
        requestWriteSettingsPermission();
    }


    const turnOnHotspot = async () => {
        try {
            // await HotspotManager.setHotspotEnabled(!state);
            await HotspotManager.isHotspotEnabled().then((val) => {
                setState(val)
            })
            await HotspotManager.setLocalHotspotEnabled(!state).then((network) => {
                setSsid(network.ssid)
                setPass(network.password)
            })
            ToastAndroid.show(`Hotspot ${!state ? 'enabled' : 'disabled'}`, ToastAndroid.SHORT)
        } catch (error: any) {
            if (error instanceof TetheringError) {
                ToastAndroid.show(error.message, ToastAndroid.LONG)
            }
            console.log(error);
        }
    }
    const getDefaultGateway = () => {
        NetworkInfo.getGatewayIPAddress().then(ipv4Address => {
            console.log(ipv4Address);
            setIp(ipv4Address)
        });
    }

    useEffect(() => {
        const server = TcpSocket.createServer(function (socket) {
            console.log('Connecting' + socket.address())
            socket.on('data', (data) => {
                socket.write('Echo server ' + data);
                console.log(`New Message: ${data}`)
            });

            socket.on('error', (error) => {
                console.log('An error ocurred with client socket ', error);
            });

            socket.on('close', (error) => {
                console.log('Closed connection with ', socket.address());
            });
        }).listen({ port: 7777, host: '127.0.0.1' });
        const client = TcpSocket.createConnection(options, () => {
            // Write on the socket
            client.write('Hello server!');

            // Close socket
            // client.destroy();
        });
        client.on('data', function (data) {
            console.log('message was received', data);
        });
        client.on('data', function (data) {
            console.log('message was received', data);
        });

        client.on('error', function (error) {
            console.log(error);
        });

        client.on('close', function () {
            console.log('Connection closed!');
        });
        getDefaultGateway()
    })
    return (
        <View style={{ padding: 20 }}>
            <Pressable
                onPress={turnOnHotspot}
            >
                <Text>Hotspot Enabled</Text>
            </Pressable>
            <Pressable
                onPress={openSetting}
            >
                <Text>Open Setting</Text>
                <Text>{ip}</Text>
                <Text>{ssid}</Text>
                <Text>{pass}</Text>
            </Pressable>
        </View>
    )
}

export default App