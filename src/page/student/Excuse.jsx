import React, { useEffect, useState } from 'react'
import { View, ScrollView, Text, StyleSheet, Pressable, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome6'
import DocumentPicker from 'react-native-document-picker'
import { APIClient } from '../../api/backend'
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

const Excuse = ({ route, navigation }) => {
    const [excuseFile, setExcuseFile] = useState(null)

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
            ).catch(error => {
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

    useEffect(() => {
        if (excuseFile != null) {
            uploadImage()
            console.log("Excuse file upload attempt")
        }
    }, [excuseFile])

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerBackground} />
                <View style={styles.headerSubcard} />
                <View style={styles.headerTitle} >
                    <Pressable style={styles.setting} onPress={() => { }}>
                        <Icon name="chevron-left" size={20} color="white" />
                    </Pressable>
                    <Text style={styles.title}>Detail Ketidakhadiran</Text>
                </View>
                <View style={styles.card}>
                    <View style={{ flex: 1, flexDirection: 'column' }}>
                        <View style={{ marginBottom: 5 }}>
                            <Text style={styles.points}>Mata Kuliah</Text>
                            <Text style={styles.parameterValue}>Perancangan Sistem Informasi</Text>
                        </View>
                        <View style={{ marginBottom: 5 }}>
                            <Text style={styles.points}>Dosen</Text>
                            <Text style={styles.parameterValue}>Kurnianingsih, S.T.,M.T.,Ph.D., Prof.</Text>
                        </View>
                        <Text style={{ marginBottom: 5 }}>Pertemuan 1</Text>
                        <View style={{ marginBottom: 5 }}>
                            <Text style={styles.points}>Tanggal</Text>
                            <Text style={styles.parameterValue}>15 November 2023</Text>
                        </View>
                        <View style={{ marginBottom: 5 }}>
                            <Text style={styles.points}>Status</Text>
                            <Text style={styles.parameterValue}>TIDAK HADIR</Text>
                        </View>
                        <View>
                            <TouchableOpacity
                                style={styles.buttonStyle}
                                onPress={selectFile}>
                                <Text style={styles.buttonText}>submit</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>
    )
}

export default Excuse