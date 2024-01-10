import React, { useEffect, useState, useContext } from 'react'
import { View, StyleSheet, ScrollView, Text, Image } from 'react-native'
import { APIClient } from '../../api/backend'
import { AuthContext } from '../../context/AuthContext'

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        paddingHorizontal: 20,
        backgroundColor: '#E46B6B',
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
    },
    body: {
        marginTop: 20,
        paddingHorizontal: 20,
        backgroundColor: '#F3F3F3',
    },
    titleText: {
        fontSize: 20,
        marginTop: 20,
        fontFamily: 'Poppins-Bold',
        color: 'white'
    },
    headerContent: {
        paddingHorizontal: 20,
        flexDirection: 'column'
    },
    welcomeTitle: {
        color: 'white',
        fontFamily: 'Poppins-Regular',
    },
    headerCard: {
        padding: 30,
        borderTopRightRadius: 50,
        borderTopLeftRadius: 50,
        minHeight: 200,
        backgroundColor: '#FFC439'
    },
    card: {
        marginBottom: 20,
        padding: 15,
        borderRadius: 20,
        // minHeight: 200,
        backgroundColor: '#FFC439'
    },
    cardTitle: {
        fontSize: 18,
        fontFamily: 'Poppins-Bold',
        color: 'white'
    },
    statisticContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    statisticCard: {
        padding: 5,
        borderRadius: 10,
        width: '30%',
        minHeight: 100,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center'
    },
    statisticText: {
        color: 'black',
        fontFamily: 'Poppins-Regular',
    },
    spContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    rollContainer: {
        flexDirection: 'row'
    },
    spCard: {
        padding: 5,
        borderRadius: 10,
        width: '100%',
        backgroundColor: '#fff',
        // justifyContent: 'center',
        // alignItems: 'center'
    },
    spText: {
        color: 'black',
        fontFamily: 'Poppins-Regular',
    },
})

const StudentDashboard = ({ navigation }) => {
    const { jwtToken, userInfo } = useContext(AuthContext)
    const [recent, setRecent] = useState(null)

    const getRecentEvent = async () => {
        let res = await APIClient(jwtToken).get(`/api/student/${userInfo.student.ID}/event/recent`)
        setRecent(res.data.data)
        console.log(`HEHEHEHE ${res.data.data}`)
    }

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setRecent(null)
            getRecentEvent()
        });

        // Return the function to unsubscribe from the event so it gets removed on unmount
        return unsubscribe;
    }, [navigation]);
    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.titleText}>SiKEMA.</Text>
                <View style={styles.headerContent}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                        <Text style={styles.welcomeTitle}>Selamat Datang, !</Text>
                        <Image source={require('../../images/user_profile.png')} style={{ height: 80, width: 80, borderRadius: 40 }} />
                    </View>
                    <View style={styles.headerCard}>
                        {recent == null ? (
                            <>
                                <Text style={styles.cardTitle}>Belum ada event nih</Text>
                                <View style={{ width: '100%', alignItems: 'center' }}>
                                    <Image source={require('../../images/notfound.png')} style={{ height: 80, width: 80, borderRadius: 40 }} />
                                    <Text style={styles.welcomeTitle}>Tidak ada presensi saat ini!</Text>
                                </View>
                            </>
                        ) : (
                            <>
                                <Text style={styles.cardTitle}>Event berlangsung</Text>
                                <View style={{ width: '100%' }}>
                                    <Text style={styles.welcomeTitle}>{recent.course.name}</Text>
                                    <Text style={styles.welcomeTitle}>{recent.class.name}</Text>
                                    <Text style={styles.welcomeTitle}>Pertemuan {recent.meet}</Text>
                                </View>
                            </>
                        )}
                    </View>
                </View>
            </View>
            <View style={styles.body}>
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Statistik</Text>
                    <View style={styles.statisticContainer}>
                        <View style={styles.statisticCard}>
                            <Image source={require('../../images/present.png')} style={{ height: 60, width: 60 }}></Image>
                            <Text style={styles.statisticText}>Hadir</Text>
                            <Text style={styles.statisticText}>X</Text>
                            <Text style={styles.statisticText}>Kelas</Text>
                        </View>
                        <View style={styles.statisticCard}>
                            <Image source={require('../../images/absent.png')} style={{ height: 60, width: 60 }}></Image>
                            <Text style={styles.statisticText}>Tidak Hadir</Text>
                            <Text style={styles.statisticText}>X</Text>
                            <Text style={styles.statisticText}>Jam</Text>
                        </View>
                        <View style={styles.statisticCard}>
                            <Image source={require('../../images/percentage.png')} style={{ height: 60, width: 60 }}></Image>
                            <Text style={styles.statisticText}>Rata-Rata</Text>
                            <Text style={styles.statisticText}>Kehadiran</Text>
                            <Text style={styles.statisticText}>X%</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Surat Peringatan</Text>
                    <View style={styles.spContainer}>
                        <View style={styles.spCard}>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ flex: 1 }}>
                                    <View>
                                        <Text style={styles.statisticText}>SP</Text>
                                        <Text style={styles.statisticText}>Tgl Terbit</Text>
                                        <Text style={styles.statisticText}>Status</Text>
                                    </View>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <View>
                                        <Text style={styles.statisticText}>: 1</Text>
                                        <Text style={styles.statisticText}>: 14-12-2023</Text>
                                        <Text style={styles.statisticText}>: DILAPORKAN</Text>
                                    </View></View>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>
    )
}

export default StudentDashboard