'use strict';
import React from 'react';
import {
  Alert,
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Linking,
  TextInput,
  Button
} from 'react-native';
import { AsyncStorage } from "react-native"
import {Divider} from 'react-native-elements';
import { Rating } from 'react-native-ratings';
import { Card, CardTitle, CardAction, CardButton, CardImage } from 'react-native-material-cards'
import firebase from 'firebase';

const objectToArr = data => {
  const arr = [];
  data.forEach(snapshot => {
    arr.push(snapshot.val())
  });

  return arr;
}

export default class DetailsScreen extends React.Component {
    static navigationOptions = {
      title: '     О зарядной точке',
      headerStyle: {
        backgroundColor: '#009DDC',
      },
      headerTintColor: 'white',
    };

    state = {
      feedBack:'',
      data:'',
      feedBackArr:[],
    };

    componentWillMount() {
      if(firebase.apps.length === 0) {
        var config = {
          apiKey: "AIzaSyAXYsZ8QgRXJ-FinccEwxJK-dZ4y10RYyU",
          authDomain: "database-c58f1.firebaseapp.com",
          databaseURL: "https://database-c58f1.firebaseio.com",
          projectId: "database-c58f1",
          storageBucket: "database-c58f1.appspot.com",
          messagingSenderId: "899548869687"
        };
        firebase.initializeApp(config);
      }
        // To select data from firebase every time data has changed !
        firebase.database().ref('users').on('value', (data) => {
            console.log('here', objectToArr(data));
            this.setState({
              data: objectToArr(data)
            })
        })
    
        // var db = firebase.database();
        // var ref = db.ref('users/003');
        // ref.once("value", function(snapshot) {
        //   console.log(snapshot.val());
        // });
    
        // To Await 5 seconds to insert a new user
        // setTimeout(() => {
        //     firebase.database().ref('users/004').set(
        //         {
        //             name: 'Pheng Sengvuthy 004',
        //             age: 24
        //         }
        //     ).then(() => {
        //         console.log('INSERTED !');
        //     }).catch((error) => {
        //         console.log(error);
        //     });
        // }, 5000);
    
        // To Update a user
        // firebase.database().ref('users/004').update({
        //     name: 'Pheng Sengvuthy'
        // });
    
        // To Remove a user
        // firebase.database().ref('users/004').remove();
    
    }

    filterData=(dataa, getI)=>{
      let filtered = dataa.filter(bsdataa => bsdataa !== dataa[getI]);
      return filtered;
      console.log('filtered '+filtered)

    }

    viewAllfeedbacks=(dataa, getI)=>{
      this.props.navigation.navigate('allFeedbacks', {
        getI: getI,
        dataa: dataa
      })
    }
  
    ratingCompleted=(rating, getI, dataa)=>{
      console.log('rating: '+rating, getI, dataa)
      firebase.database().ref('users/00'+(getI+1)).update({
        rating: (rating+dataa[getI].rating)/2
        });
      alert('Спасибо за оценку!')
    };


    onButtonPress=( item )=>{
      this.props.navigation.navigate('Details2', {
        newitem: item
      })
    }


    _renderItem2 = ({ item }) =>{
        return(
          <View>
            <Image
                style={{ width: 358, height: 200 }}
                source={{ uri: item }}
            />
          </View>  
        )
    }

    _renderItem = ({ item }) =>{
      return(
          <Card style={styles.cardStyle}>
          <CardImage 
            source={{uri: item.image[0]}}
          />
          <CardTitle 
            title={item.title} 
            subtitle={'Charger type: '+item.description}
          />
          
        </Card>
      )
    }

    feedBackUpdate=(getI, value)=>{
      this.setState({
        feedBackArr:[...this.state.feedBackArr,{feedback:this.state.feedBack, name:value}],
        feedBack:''
      },() => {
        console.log('check: '+this.state.feedBackArr)
        firebase.database().ref('users/00'+(getI+1)).update({
          feedBacks: this.state.feedBackArr,
        });
        alert('Ваш отзыв был принят');
        })
      }
    

    onSubmitFeedBack= async ( getI)=>{
      console.log('Your feedback: '+this.state.feedBack)
      console.log('Feedback array: '+this.state.data[getI].feedBacks)
      const value = await AsyncStorage.getItem("email")
      console.log("name:", value)
      if(this.state.feedBack.length !==0) {
        this.setState({
        feedBackArr: this.state.data[getI].feedBacks
        }, () => {this.feedBackUpdate(getI, value)}
        )
      }
      
    }
  
    render() {
      const { navigation } = this.props;
      const dataa = navigation.getParam('data');
      const getI = navigation.getParam('getI');
      
      return (
        <View style={{ flex: 1, backgroundColor:'white' }}>
        <ScrollView>
            <FlatList
            horizontal={true}
            data={dataa[getI].image}
            keyExtractor={(item, index) => index}
            renderItem={this._renderItem2}
            />
            <Text style={styles.titleStyle}>Зарядное уст-во в { dataa[getI].title }</Text>
            <Divider style={{ backgroundColor: '#897C80' }} />
            <Text style={styles.descriptionStyle}>Тип зарядного уст-ва: {dataa[getI].description}</Text>
            <Text style={styles.descriptionStyle}>{dataa[getI].adress}</Text>
            <Text style={styles.descriptionStyle}>Тел: 87770011350</Text>
            <Text style={styles.descriptionStyle}>Часы: {dataa[getI].time}</Text>
            <Text style={styles.linkStyle} onPress={ ()=>{ Linking.openURL('https://www.e-line.kz')}}>Site: https://www.e-line.kz</Text>
            <Divider style={{ backgroundColor: '#897C80' }} />
            <Rating
                showRating
                type="star"
                fractions={1}
                startingValue={dataa[getI].rating}
                imageSize={35}
                onFinishRating={(rating) => this.ratingCompleted(rating, getI, dataa)}
                style={{ paddingVertical: 10, alignItems:'center' }}
            />
            <Divider style={{ backgroundColor: 'gray' }} />
            <Text style={styles.otzyv}>Отзывы</Text>
            <Text style={styles.feedbacksName}>{dataa[getI].feedBacks[0].name}</Text>
            <Text style={styles.feedbacks}>{dataa[getI].feedBacks[0].feedback}</Text>
            <Text style={styles.feedbacksName}>...</Text>
            <TouchableOpacity onPress={()=>this.viewAllfeedbacks(dataa, getI)}>
              <Text style={styles.viewAll}>Показать все отзывы</Text>
            </TouchableOpacity>
            <Text style={{fontSize: 14,paddingTop: 15,paddingLeft:10,alignItems:'flex-start', color:'gray'}}>
              Заряжали здесь устройство? Напишите отзыв
            </Text>
            <TextInput
              underlineColorAndroid="transparent"
              autoCorrect={false}
              placeholder='Напишите отзыв'
              value={this.state.feedBack}
              onChangeText={feedBack => this.setState({feedBack})}
              style={styles.inputStyle}
            />
            <Text></Text>
            <Button  title="Ok" onPress={()=>this.onSubmitFeedBack(getI)} />
            <Text style={styles.others}>Другие точки</Text>
            <Text></Text>
            <FlatList
              horizontal={true}
              data={this.filterData(dataa, getI)}
              keyExtractor={(item, index) => index}
              renderItem={this._renderItem}
            />
        </ScrollView>
        </View>
      );
    }
  }
  //onPress={()=>this.onSubmitFeedBack(getI, email)}

  const styles = StyleSheet.create({
    secondView:{ 
      position: 'absolute',
      width: 360,
      bottom: 0,
      left: 0
    },
    cardStyle:{
      height:230,
      width:250
    },
    feedbacksName:{
      fontSize: 16,
      paddingTop: 5,
      paddingLeft:10,
      alignItems:'flex-start',
      color:'gray'
    },
    inputStyle: {
      marginTop:5,
      paddingRight: 5,
      paddingLeft: 5,
      paddingBottom: 2,
      color: '#262626',
      fontSize: 18,
      fontWeight: '200',
      flex: 1,
      height: 40,
      borderWidth: 1,
      borderColor: '#5F634F',
      borderRadius: 6,
    },
    titleStyle:{
      fontSize: 22,
      paddingTop: 5,
      fontWeight: 'bold',
      color:'#5DB7DE',
      alignItems: 'center',
      paddingLeft:2,
    },
    descriptionStyle:{
      fontSize: 17,
      paddingTop: 5,
      alignItems:'flex-start',
      paddingLeft:4,
    },
    linkStyle:{
      fontSize: 17,
      paddingTop: 5,
      alignItems:'flex-start',
      paddingLeft:4,
      textDecorationLine:'underline',
      color: '#7AC74F'
    },
    otzyv:{
      alignSelf:'center',
      fontSize: 20,
    },
    feedbacks:{
      fontSize: 17,
      paddingTop: 2,
      paddingLeft:10,
      alignItems:'flex-start',
    },
    viewAll:{
      alignSelf:'center',
      fontSize: 17,
      paddingTop: 2,
      textDecorationLine:'underline'
    },
    others:{
      fontSize: 20,
      paddingTop: 20,
      paddingLeft:10,
      alignItems:'flex-start',
    },
  });
  
