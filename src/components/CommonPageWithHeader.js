import React, { useEffect, useState, useContext } from 'react'
import { View, ScrollView, Text, StyleSheet, Pressable, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome6'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F3F3',
        // minHeight: '100%',
    },
    header: {
        backgroundColor: '#E46B6B',
        paddingTop: 40,
        paddingLeft: 40,
        paddingRight: 40,
        paddingBottom: 20
    },
    headerText: {
        color: '#000000',
    },
    body: {
        padding: 20
    },
    title: {
        fontSize: 20,
        color: '#F3F3F3',
        fontFamily: 'Poppins-Bold',
    },
    headerTitle: {
        // alignItems: 'center',
        flexDirection: 'row',
    },
    headerBackground: {
        backgroundColor: '#E46B6B',
        borderBottomLeftRadius: 50,
        borderBottomRightRadius: 50,
        height: 300,
        overflow: 'hidden',
        position: 'absolute',
        width: 400,
    },
    card: {
        padding: 20,
        borderRadius: 20,
        marginBottom: 20,
        backgroundColor: '#E46B6B',
        overflow: 'hidden',
        width: '100%',
    },
    setting: {
        marginTop: 5,
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
    buttonStyle: {
        backgroundColor: '#E4916A',
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginLeft: 35,
        height: 55,
        width: 315,
        marginTop: 15,
        borderRadius: 8,
    },
    buttonText: {
        color: '#ffff',
        textAlign: 'center',
        fontSize: 16,
        fontFamily: 'Poppins-SemiBold',
        padding: 5
    },
})

const CommonPageWithHeader = ({ children, showBackIcon, backIconAction, showBackground, title = "History Presensi" }) => {
    return (
        <View style={styles.container}>
            {showBackground ? (
                <View style={styles.headerBackground} />
            ) : ''}
            <View style={styles.header}>
                <View style={styles.headerTitle} >
                    {showBackIcon && (
                        <TouchableOpacity style={styles.setting} onPress={backIconAction}>
                            <Icon name="chevron-left" size={20} color="white" />
                        </TouchableOpacity>
                    )}
                    <Text style={styles.title}>{title}</Text>
                </View>
            </View>
            <ScrollView style={styles.body}>
                {children}
            </ScrollView>
        </View>
    )
}

export default CommonPageWithHeader