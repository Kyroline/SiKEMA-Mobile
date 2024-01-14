import React, { useEffect, useState, useContext } from 'react'
import { View } from 'react-native'
import { AuthContext } from '../../context/AuthContext'
import Select from '../../components/Select'

const NewEvent = ({ navigation }) => {
    const {jwtToken, userInfo} = useContext(AuthContext)
    const [courses, setCourses] = useState([])
    const [classes, setClasses] = useState([])
    const meetA = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
    const meet = [...new Set(meetA.map(item => ({ 'value': item, 'label': item })))]

    const refreshClass = async () => {
        let courseRes = await APIClient(jwtToken).get('api/lecturer/' + userInfo.lecturer.ID + '/course')
        const uniqueClasses = [...new Set(courseRes.data.data.map(item => ({ 'value': item.class_id, 'label': item.class.name })))];
        setClasses(uniqueClasses)
        setNewEventState(true)
    }

    const onClassSelect = async (value, label) => {
        let courseRes = await APIClient(jwtToken).get('api/lecturer/' + userInfo.lecturer.ID + '/course?class_id=' + value)
        const uniqueCourses = [...new Set(courseRes.data.data.map(item => ({ 'value': item.course_id, 'label': item.course.name })))];
        setCourses(uniqueCourses)
        setSelectedClass(value)
    }

    const onCourseSelect = (value, label) => {
        setSelectedCourse(value)
    }

    return (
        <View>
            <Text>Pilih kelas</Text>
            <Select
                data={classes}
                onSelect={onClassSelect}
            />
            <Text>Pilih mata kuliah</Text>
            <Select
                data={courses}
                onSelect={onCourseSelect}

            />
            <Text>Pertemuan Ke-</Text>
            <Select
                data={meet}
                onSelect={(value, label) => {
                    setSelectedMeet(value)
                }}
            />
            <TouchableOpacity style={buttonStyle.button} onPress={createNewEvent}>
                <Text style={buttonStyle.buttonText}>Buat</Text>
            </TouchableOpacity>
        </View>
    )
}