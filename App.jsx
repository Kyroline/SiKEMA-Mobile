import * as React from 'react';
import { AppRegistry } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { name as appName } from './app.json';
import Login from './src/page/Login';
import Dashboard from './src/page/Dashboard';
import Event from './src/page/lecturer/Event';

export default function Main() {
  return (
    <PaperProvider>
      <Event />
    </PaperProvider>
  );
}

AppRegistry.registerComponent(appName, () => Main);