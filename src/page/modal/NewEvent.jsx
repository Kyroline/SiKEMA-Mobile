import React, { useEffect, useState, useContext, useRef } from 'react'
import { Text, TouchableOpacity, StyleSheet } from 'react-native'
import { AuthContext } from '../../context/AuthContext'
import Select from '../../components/Select'
import { APIClient } from '../../api/backend'
import Modal from './Modal'

const styles = StyleSheet.create({
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

const NewEvent = ({ navigation }) => {
    const { jwtToken, userInfo } = useContext(AuthContext)
    const [courses, setCourses] = useState([])
    const [classes, setClasses] = useState([])
    const [selectedClass, setSelectedClass] = useState(null)
    const [selectedCourse, setSelectedCourse] = useState(null)
    const [selectedMeet, setSelectedMeet] = useState(null)
    const meetA = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
    const meet = [...new Set(meetA.map(item => ({ 'value': item, 'label': item })))]

    const classRef = useRef({})
    const courseRef = useRef({})

    const refreshClass = async () => {
        let courseRes = await APIClient({ token: jwtToken }).get('api/lecturer/' + userInfo.lecturer.ID + '/course')
        const uniqueClasses = [...new Set(courseRes.data.data.map(item => ({ 'value': item.class_id, 'label': item.class.name })))];
        setClasses(uniqueClasses)
    }

    const onClassSelect = async (value, label) => {
        setSelectedCourse(null)
        courseRef.current.reset()
        let courseRes = await APIClient({ token: jwtToken }).get('api/lecturer/' + userInfo.lecturer.ID + '/course?class_id=' + value)
        const uniqueCourses = [...new Set(courseRes.data.data.map(item => ({ 'value': item.course_id, 'label': item.course.name })))];
        setCourses(uniqueCourses)
        setSelectedClass(value)
    }

    const onCourseSelect = (value, label) => {
        setSelectedCourse(value)
    }

    const createNewEvent = async () => {
        if (selectedClass != null && selectedCourse != null && selectedMeet != null) {
            let response = await APIClient({ token: jwtToken }).post('api/lecturer/' + userInfo.lecturer.ID + '/event', {
                'class_id': parseInt(selectedClass),
                'course_id': parseInt(selectedCourse),
                'meet': parseInt(selectedMeet),
            })
            navigation.navigate('Lecturer.Detail', {
                eventId: response.data.data.id
            })
        }
    }

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            refreshClass()
        });

        // Return the function to unsubscribe from the event so it gets removed on unmount
        return unsubscribe;
    }, [navigation]);

    return (
        <Modal>
            <Text>Pilih kelas</Text>
            <Select
                data={classes}
                onSelect={onClassSelect}
                ref={classRef}
            />
            <Text>Pilih mata kuliah</Text>
            <Select
                data={courses}
                onSelect={onCourseSelect}
                ref={courseRef}

            />
            <Text>Pertemuan Ke-</Text>
            <Select
                data={meet}
                onSelect={(value, label) => {
                    setSelectedMeet(value)
                }}
            />
            <TouchableOpacity style={styles.button} onPress={createNewEvent}>
                <Text style={styles.buttonText}>Buat</Text>
            </TouchableOpacity>
        </Modal>
    )
}

export default NewEvent