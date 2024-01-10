import React, { useContext, useState } from "react"
import { View, Text, Image } from "react-native"
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from "@react-navigation/drawer"
import { AuthContext } from "../context/AuthContext"

const CustomDrawer = (props) => {
    const {logout, userInfo} = useContext(AuthContext)
    return (
        <View style={{ flex: 1 }}>
            <DrawerContentScrollView {...props} contentContainerStyle={{ backgroundColor: '#E46B6B' }}>
                <View style={{ padding: 20 }}>
                    <Image source={require('../images/user_profile.png')} style={{ height: 80, width: 80, borderRadius: 40, marginBottom: 10 }} />
                    <Text style={{ marginBottom: 5, color: '#fff', fontFamily: 'Poppins-Bold', fontSize: 20 }}>{userInfo.student ? userInfo.student.Name : userInfo.lecturer.Name}</Text>
                    <Text style={{ marginBottom: 0, color: '#fff', fontFamily: 'Poppins-Regular', fontSize: 16 }}>{userInfo.student ? userInfo.student.Nim : userInfo.lecturer.Nim}</Text>
                    <Text style={{ marginBottom: 0, color: '#fff', fontFamily: 'Poppins-Regular', fontSize: 12 }}>{userInfo.email ?? 'No email'}</Text>
                </View>
                <View style={{ flex: 1, backgroundColor: '#fff' }}>
                    <DrawerItemList {...props} />
                    <DrawerItem
                        label="Logout"
                        onPress={logout}
                    />
                </View>
            </DrawerContentScrollView>
        </View>
    )
}

export default CustomDrawer