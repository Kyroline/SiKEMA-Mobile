import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import React from 'react';

const Login = () => {
  return (
    // Main Container //
    <View style={style.mainContainer}>

    {/* Header Text Logo */}

      <Text style={style.mainHeader}>
        SiKEMA.
      </Text>

    {/* Body Login */}

      <View style={style.mainBody}>
        <Text style={style.headerBody}>
          Login to your Account
        </Text>

    {/* Box Email */}
        <TextInput style={style.inputStyle}
          placeholderTextColor={'#978D8D'}
          placeholder='Email or Your NIM/NIP'
        />
    {/* Box Password */}
        <TextInput style={style.inputStyle}
          placeholderTextColor={'#978D8D'}
          placeholder='Password'
          secureTextEntry={true}
        />
    {/* Button Login */}
        <TouchableOpacity style={style.buttonStyle}>
          <Text style={style.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    {/* Footer Login */}
      <Text style={style.footer}>
        Copyright &copy; SiKEMA 2023
      </Text>
    </View>
  )
};

const style = StyleSheet.create({
    mainContainer: {
      backgroundColor: '#ffff',
      height: '100%'
    },
    mainHeader: {
      fontSize: 48,
      textAlign: 'center',
      color: '#E4916A',
      fontFamily: 'Poppins-Bold',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 150
    },
    mainBody: {
      marginTop: 35
    },
    headerBody: {
      fontSize: 19,
      fontFamily: 'Poppins-SemiBold',
      textAlign: 'left',
      color: '#978D8D',
      paddingLeft: 35
    },
    inputStyle: {
      borderWidth: 1,
      borderColor: 'rgba(0,0,0,0.3)',
      paddingHorizontal: 15,
      paddingVertical: 10,
      marginLeft: 35,
      height: 55,
      width: 315,
      marginTop: 15,
      borderRadius: 8,
      fontSize: 16,
      fontFamily: 'Poppins-SemiBold',
      color: 'black'
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
    footer: {
      fontFamily: 'Poppins-Medium',
      marginTop: 250,
      textAlign: 'center',
      fontSize: 13,
      color: '#978D8D',
    }
});

export default Login;