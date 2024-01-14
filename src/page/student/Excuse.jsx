import React, { useEffect, useState, useContext } from 'react'
import { View, ScrollView, Text, StyleSheet, Pressable, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome6'
import DocumentPicker from 'react-native-document-picker'
import { APIClient } from '../../api/backend'
import { AuthContext } from '../../context/AuthContext'
import { Linking } from 'react-native'
import CommonPageWithHeader from '../../components/CommonPageWithHeader'

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
        overflow: 'hidden',
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
        fontFamily: 'Poppins-Regular',
    },
    parameterValue: {
        alignItems: 'center',
        color: '#000',
        fontSize: 18,
        fontFamily: 'Poppins-SemiBold',
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

const Excuse = ({ route, navigation }) => {
    const abortController = new AbortController()
    const { eventId } = route.params;
    const [absent, setAbsent] = useState(null)
    const [excuse, setExcuse] = useState(null)
    const { jwtToken, userInfo } = useContext(AuthContext)
    const [excuseFile, setExcuseFile] = useState(null)

    const getAbsentData = async () => {
        try {
            let res = await APIClient({token: jwtToken}).get('api/student/' + userInfo.student.ID + '/event/' + eventId + '/absent')
            setAbsent(res.data.data)

            let res2 = await APIClient({token: jwtToken}).get('api/student/' + userInfo.student.ID + '/absent/' + res.data.data.id + '/excuse')
            setExcuse(res2.data.data)
        } catch (error) {

        }
    }

    const uploadImage = async () => {
        //Check if any file is selected or not
        if (excuseFile != null) {
            //If file selected then create FormData
            const fileToUpload = excuseFile;
            const data = new FormData();
            data.append('name', 'Image Upload');
            data.append('file', fileToUpload[0]);
            console.log(fileToUpload[0].uri)

            APIClient("", 'multipart/form-data').post("/upload", data
            ).then(res => {
                var uploadedFileName = res.data.data
                if (excuse != null) {
                    APIClient(jwtToken).patch('/api/student/' + userInfo.student.ID + '/excuse/' + excuse.id, {
                        'attachment': uploadedFileName,
                        'absent_id': parseInt(absent.id),
                    }).then(() => {
                        getAbsentData()
                    })
                } else {
                    APIClient(jwtToken).post('/api/student/' + userInfo.student.ID + '/excuse', {
                        'attachment': uploadedFileName,
                        'absent_id': parseInt(absent.id),
                    }).then(() => {
                        getAbsentData()
                    })
                }
            })
                .catch(error => {
                    console.log(`Login error : ${error.response.data}`)
                });
        } else {
            alert('Pilih dokumen terlebih dahulu! ');
        }
    };

    const selectFile = async () => {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.pdf],
                // DocumentPicker.types.allFiles
                // DocumentPicker.types.images
                // DocumentPicker.types.plainText
                // DocumentPicker.types.audio
                // DocumentPicker.types.pdf
            });
            console.log('res : ' + JSON.stringify(res))
            setExcuseFile(res)
            uploadImage()
        } catch (err) {
            setExcuseFile(null)
            if (DocumentPicker.isCancel(err)) {
                alert('Dibatalkan')
            } else {
                alert('Unknown Error: ' + JSON.stringify(err))
                throw err;
            }
        }
    }

    const openFile = () => {
        Linking.openURL('http://192.168.0.116:8080/files/' + excuse.attachment);
        // Linking.openURL('https://api.carolynn.my.id/files/' + excuse.attachment);
    }

    // useEffect(() => {
    //     const unsubscribe = navigation.addListener('focus', () => {
    //         getAbsentData()
    //     });

    //     // Return the function to unsubscribe from the event so it gets removed on unmount
    //     return unsubscribe;
    // }, [navigation]);

    useEffect(() => {
        getAbsentData()
    }, [eventId])

    return (
        <CommonPageWithHeader
            showBackIcon={true}
            backIconAction={() => { navigation.goBack() }}
            showBackground={true}>
            <View style={styles.card}>
                <View style={{ flex: 1, flexDirection: 'column' }}>
                    <View style={{ marginBottom: 5 }}>
                        <Text style={styles.parameter}>Mata Kuliah</Text>
                        <Text style={styles.parameterValue}>{absent ? absent.event.course.name : ''}</Text>
                    </View>
                    <View style={{ marginBottom: 5 }}>
                        <Text style={styles.parameter}>Dosen</Text>
                        <Text style={styles.parameterValue}>{absent ? absent.event.lecturer.name : ''}</Text>
                    </View>
                    <View
                        style={{
                            borderBottomColor: 'black',
                            borderBottomWidth: StyleSheet.hairlineWidth,
                        }}
                    />
                    <View style={{ marginBottom: 5 }}>
                        <Text style={styles.parameter}>Pertemuan</Text>
                        <Text style={styles.parameterValue}>{absent ? absent.event.meet : ''}</Text>
                    </View>
                    <View style={{ marginBottom: 5 }}>
                        <Text style={styles.parameter}>Tanggal</Text>
                        <Text style={styles.parameterValue}>{absent ? new Date(absent.event.created_at).toISOString().split('T')[0] : ''}</Text>
                    </View>
                    <View style={{ marginBottom: 5 }}>
                        <Text style={styles.parameter}>Status</Text>
                        <Text style={styles.parameterValue}>TIDAK HADIR {excuse == null ? '/ TIDAK ADA KETERANGAN' : ''}</Text>
                    </View>
                    <View
                        style={{
                            borderBottomColor: 'black',
                            borderBottomWidth: StyleSheet.hairlineWidth,
                        }}
                    />
                    {excuse != null ? (
                        <>
                            <View style={{ marginBottom: 5 }}>
                                <Text style={styles.parameter}>File Surat Izin</Text>
                                <Text style={styles.parameterValue}>{excuse.attachment ?? ''}</Text>
                            </View>
                            <View style={{ marginBottom: 5 }}>
                                <Text style={styles.parameter}>Status Gugatan</Text>
                                <Text style={styles.parameterValue}>{(
                                    (() => {
                                        switch (excuse.status) {
                                            case 1:
                                                return 'Ditolak'
                                            case 2:
                                                return 'Approved'
                                            default:
                                                return 'PENDING'
                                        }
                                    })()
                                )}</Text></View>
                            <View style={{ marginBottom: 5 }}>
                                <Text style={styles.parameter}>Komentar PBM</Text>
                                <Text style={styles.parameterValue}>{excuse.excuse != '' ? excuse.excuse : '-'}</Text>
                            </View>
                        </>
                    ) : ''
                    }

                    <View>
                        <View style={buttonStyle.container}>
                            {excuse != null ? (() => {
                                if (excuse.status == 0)
                                    return (
                                        <>
                                            <TouchableOpacity style={buttonStyle.button} onPress={openFile}>
                                                <Text style={buttonStyle.buttonText}>Cek Surat Izin</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity style={buttonStyle.button} onPress={selectFile}>
                                                <Text style={buttonStyle.buttonText}>Ganti Surat Izin</Text>
                                            </TouchableOpacity>
                                        </>
                                    )
                                else if (excuse.status == 1 || excuse.status == 2)
                                    return (
                                        <TouchableOpacity style={buttonStyle.button} onPress={openFile}>
                                            <Text style={buttonStyle.buttonText}>Cek Surat Izin</Text>
                                        </TouchableOpacity>
                                    )
                            }
                            )() : (
                                <TouchableOpacity style={buttonStyle.button} onPress={selectFile}>
                                    <Text style={buttonStyle.buttonText}>Upload Surat Izin</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </View>
            </View>
        </CommonPageWithHeader>
    )
}
export default Excuse