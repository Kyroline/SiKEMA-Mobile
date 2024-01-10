import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native'
import { TextInput } from 'react-native-paper'
import CommonPageWithHeader from '../components/CommonPageWithHeader'
import AsyncStorage from '@react-native-async-storage/async-storage'

const Setting = ({ navigation }) => {
    const [ssid, setSSID] = useState("")
    const [password, setPassword] = useState("")

    const saveSettings = async () => {
        await AsyncStorage.setItem('SSID', ssid)
        await AsyncStorage.setItem('Password', password)
    }

    const getSettings = async () => {
        let SSID = await AsyncStorage.getItem('SSID')
        let Password = await AsyncStorage.getItem('Password')
        setSSID(SSID)
        setPassword(Password)
    }

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getSettings()
        });

        // Return the function to unsubscribe from the event so it gets removed on unmount
        return unsubscribe;
    }, [navigation]);

    return (
        <CommonPageWithHeader
            showBackIcon={false}
            showBackground={true}
            title='Pengaturan'>
            <View style={styles.card}>
                <View style={{ flex: 1, flexDirection: 'column' }}>
                    <View style={{ marginBottom: 5 }}>
                        {/* <Text style={styles.parameter}>SSID</Text> */}
                        <TextInput
                            label="SSID"
                            mode='outlined'
                            value={ssid}
                            onChangeText={text => setSSID(text)}
                        />
                    </View>
                    <View style={{ marginBottom: 5 }}>
                        {/* <Text style={styles.parameter}>Kelas</Text> */}
                        <TextInput
                            label="Password"
                            mode='outlined'
                            value={password}
                            onChangeText={text => setPassword(text)}
                        />
                    </View>
                    <View style={buttonStyle.container}>
                        <View></View>
                        <TouchableOpacity style={buttonStyle.button} onPress={saveSettings}>
                            <Text style={buttonStyle.buttonText}>Simpan</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
        </CommonPageWithHeader>
    )
}

export default Setting

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