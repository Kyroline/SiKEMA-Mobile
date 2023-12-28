import React, {useContext} from 'react'
import { View, ActivityIndicator } from 'react-native'
import { PaperProvider } from 'react-native-paper'
import { NavigationContainer } from '@react-navigation/native'
import { AuthContext } from './context/AuthContext'
import AuthStack from './navigation/AuthStack'
import AppStack from './navigation/AppStack'

const App = () => {
  const {isLoading, jwtToken} = useContext(AuthContext)

  if (isLoading) {
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator size="large"/>
    </View>
  }

  return (
      <PaperProvider>
        {jwtToken == null ? <AuthStack/> : <AppStack/>}
      </PaperProvider>
  );
};

export default App;