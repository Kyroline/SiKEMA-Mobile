import * as React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { AppRegistry } from 'react-native'
import { name as appName } from './app.json'
import { AuthProvider } from './src/context/AuthContext'
import App from './src/App'

export default function Main() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <App />
      </AuthProvider>
    </NavigationContainer>
  );
}

AppRegistry.registerComponent(appName, () => Main);