import React, { useEffect, useState } from 'react'
import { View, Pressable, ToastAndroid, Text, Linking } from 'react-native'
import HotspotManager, { Device, TetheringError } from '@react-native-tethering/hotspot';
// import RNWriteSettings from 'rn-write-settings';

// A system window for the user configure this permission should appear.

const App = () => {
    const [state, setState] = useState(false)
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
            await HotspotManager.setHotspotEnabled(!state);
            setState(!state)
            ToastAndroid.show('Hotspot Disabled', ToastAndroid.SHORT)
        } catch (error: any) {
            if (error instanceof TetheringError) {
                ToastAndroid.show(error.message, ToastAndroid.LONG)
            }
            console.log(error);
        }
    }
    return (
        <View style={{padding: 20}}>
            <Pressable
                onPress={turnOnHotspot}
            >
                <Text>Hotspot Enabled</Text>
            </Pressable>
            <Pressable
                onPress={openSetting}
            >
                <Text>Open Setting</Text>
            </Pressable>
        </View>
    )
}

export default App