/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import 'react-native-gesture-handler';

global.api_host = 'http://192.168.137.1:8080'

AppRegistry.registerComponent(appName, () => App);
