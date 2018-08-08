import React from 'react'
import { StyleSheet, Platform, Image, Text, View } from 'react-native'
import { SwitchNavigator } from 'react-navigation'

// import the different screens
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm'
import Main from './Main'
// create our app's navigation stack


const App = SwitchNavigator(
  {
    LoginForm,
    SignUpForm,
    Main,
  },
  {
    initialRouteName: 'SignUpForm'
  }
)
export default App;