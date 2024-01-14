import React, { forwardRef, useRef, useImperativeHandle } from 'react';
import SelectDropdown from 'react-native-select-dropdown';
import { StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6'

const Select = forwardRef(({ data, onSelect }, ref) => {
    const dropdownRef = useRef(null);
    const countriesWithKeys = data.map((country, index) => ({ key: index.toString(), ...country }));

    const handleSelect = (selectedItem, index) => {
        onSelect(selectedItem.value, selectedItem.label);
    }

    const reset = () => {
        // Lakukan reset pada SelectDropdown di sini
        dropdownRef.current.reset();
    };

    useImperativeHandle(ref, () => ({
        reset: reset,
    }));

    return (
        <SelectDropdown
            data={countriesWithKeys}
            ref={dropdownRef}
            onSelect={handleSelect}
            buttonTextAfterSelection={(selectedItem, index) => {
                return selectedItem.label
            }}
            rowTextForSelection={(item, index) => {
                return item.label
            }}
            defaultButtonText={'---'}
            buttonStyle={styles.dropdown1BtnStyle}
            buttonTextStyle={styles.dropdown1BtnTxtStyle}
            renderDropdownIcon={isOpened => {
                return <Icon name={isOpened ? 'chevron-up' : 'chevron-down'} color={'#444'} size={18} />;
            }}
            dropdownIconPosition={'right'}
            dropdownStyle={styles.dropdown1DropdownStyle}
            rowStyle={styles.dropdown1RowStyle}
            rowTextStyle={styles.dropdown1RowTxtStyle}
        />
    );
});

const styles = StyleSheet.create({
    shadow: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 10,
    },
    headerTitle: { color: '#000', fontWeight: 'bold', fontSize: 16 },
    saveAreaViewContainer: { flex: 1, backgroundColor: '#FFF' },
    scrollViewContainer: {
        flexGrow: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: '10%',
        paddingBottom: '20%',
    },

    dropdown1BtnStyle: {
        width: '80%',
        height: 50,
        backgroundColor: '#FFF',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#444',
    },
    dropdown1BtnTxtStyle: { color: '#444', textAlign: 'left', fontFamily: 'Poppins-Regular', fontSize: 12 },
    dropdown1DropdownStyle: { backgroundColor: '#EFEFEF' },
    dropdown1RowStyle: { backgroundColor: '#EFEFEF', borderBottomColor: '#C5C5C5' },
    dropdown1RowTxtStyle: { color: '#444', textAlign: 'left', fontFamily: 'Poppins-Regular' },
});

export default Select