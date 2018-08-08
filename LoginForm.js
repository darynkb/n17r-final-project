import React, { Component } from 'react';
import { View, Text, Button, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import firebase from 'firebase';
import TitledInput from './TitledInput';
import { AsyncStorage } from "react-native"

class LoginForm extends Component {
    state = { email: '', password: '', error: '', loading: false };

    componentWillMount() {
        if(firebase.apps.length === 0) {
            firebase.initializeApp({
                apiKey: "AIzaSyAXYsZ8QgRXJ-FinccEwxJK-dZ4y10RYyU",
                authDomain: "database-c58f1.firebaseapp.com",
                databaseURL: "https://database-c58f1.firebaseio.com",
                projectId: "database-c58f1",
                storageBucket: "database-c58f1.appspot.com",
                messagingSenderId: "899548869687"
              });
        }
    };


    storeData = async (email) => {
        try {
          await AsyncStorage.setItem('email', email );
        } catch (error) {
          // Error saving data
        }
    }

    func=(response)=>{
        console.log('response?: '+ response.user.email);
        this.setState({ error: '', loading: false });
        this.props.navigation.navigate('Main',{
            email:response.user.email
        })
        this.storeData(response.user.email)
    }

    onLoginPress() {
        this.setState({ error: '', loading: true });

        const { email, password } = this.state;
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(this.func)
            .catch(() => {this.setState({ error: 'Authentication failed.', loading: false });
            });
    }
    
    renderButtonOrSpinner=()=> {
        if (this.state.loading) {
            return <ActivityIndicator size='small' />;    
        }
        return <Button onPress={this.onLoginPress.bind(this)} title="Log in" />;
    }
    render() {
        return (
            <View >
                    <Image
                        style={{ width: 190, height: 190, alignSelf: 'center', marginTop: 50,}}
                        source={{ uri: 'https://pp.userapi.com/c845416/v845416833/b4c02/OsOxEzsMvmM.jpg' }}
                    />
                    <Text style={styles.just}>Log in</Text>
                    <Text></Text>
                    <TitledInput 
                        label='Email Address'
                        placeholder='you@domain.com'
                        value={this.state.email}
                        onChangeText={email => this.setState({ email })}
                    />
                    <Text></Text>
                    <TitledInput 
                        label='Password'
                        autoCorrect={false}
                        placeholder='*******'
                        secureTextEntry
                        value={this.state.password}
                        onChangeText={password => this.setState({ password })}
                    />
                    <Text style={styles.errorTextStyle}>{this.state.error}</Text>
                    {this.renderButtonOrSpinner()}
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('SignUpForm')}>
                        <Text style={styles.signUp}>Sign in</Text>
                    </TouchableOpacity>
            </View>
        );
    }
}
const styles = {
    errorTextStyle: {
        color: '#E64A19',
        alignSelf: 'center',
        paddingTop: 10,
        paddingBottom: 10
    },
    container:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    signUp:{
        alignSelf: 'center',
        paddingTop: 10,
        paddingBottom: 10
    },
    just:{
        alignSelf: 'center',
        fontSize: 22,
        fontWeight: '200',
    }
};

export default LoginForm;