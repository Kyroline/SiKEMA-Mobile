import React from 'react'
import { View, StyleSheet, Pressable, Animated, useWindowDimensions } from 'react-native'
import { useCardAnimation } from '@react-navigation/stack'
import { useNavigation } from '@react-navigation/native'

const styles = StyleSheet.create({
    viewAnimated: {
        width: '100%',
    },
    viewContainer: {
        flex: 1,
        padding: 10,
        backgroundColor: '#E5E5E5',
        borderRadius: 20,
    },
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
})

const Modal = ({ children }) => {
    const navigation = useNavigation()
    const { height } = useWindowDimensions()
    const { current } = useCardAnimation()

    return (
        <View
            style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
            }}>
            <Pressable
                style={[
                    StyleSheet.absoluteFill,
                    { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
                ]}
                onPress={navigation.goBack}
            />
            <Animated.View
                style={[
                    {
                        height: height,
                        transform: [
                            {
                                translateY: current.progress.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [height, height * 0.5],
                                    extrapolate: 'clamp',
                                }),
                            },
                        ],
                    },
                    styles.viewAnimated,
                ]}>
                <View style={styles.viewContainer}>
                    {children}
                </View>
            </Animated.View>
        </View>
    )

}

export default Modal