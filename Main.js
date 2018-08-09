'use strict';
import React, { Component } from 'react'
import {
  Alert,
  Text,
  View,
  StyleSheet,
  Image,
  ActivityIndicator,
  Button,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Version can be specified in package.json
import { StackNavigator, TabNavigator, TabBarBottom } from 'react-navigation'; // Version can be specified in package.json
import { Card, CardTitle, CardAction, CardButton, CardImage } from 'react-native-material-cards'
import { MapView} from 'expo';
import firebase from 'firebase';

import DetailsScreen from './Details';
import feedBacksScreen from './feedBacksScreen';
import FullInfoScreen from './FullInfoScreen';

//import LoginForm from './LoginForm';

const objectToArr = data => {
  const arr = [];
  data.forEach(snapshot => {
    arr.push(snapshot.val())
  });

  return arr;
}

const objectToArray = data => {
  const arr = [];
  data.forEach(snapshot => {
    arr.push(snapshot.val())
  });

  return arr;
}


class MapScreen extends React.Component {
  static navigationOptions = {
    title: 'Карта "Get Charged"',
    headerStyle: {
      backgroundColor: '#009DDC',
    },
    headerTintColor: 'white',
  };
  state = {
    inProcess:true,
    index:'',
    status:false ,
    selected:'',
    data: [],
  };
  setMarkers() {
    return(
        <MapView.Marker
          key={1}
          coordinate={{latitude: 52.09, longitude: 4.58}}
          title={"Some Title"}
          description={"Hello world"}
        />
    )
  }
  onButtonPress=(email)=>{
    
    this.props.navigation.navigate('Details', {
      getI: this.state.index,
      email2: email,
      data: this.state.data
    })
  }

  onMarkerPress=(i)=>{
    console.log('is it probleem'+this.state.data[i])
    this.setState({
      selected:this.state.data[i],
      index:i,
      status: true
    })
  }

  componentWillMount() {
    this.setState({inProcess: true});
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
        this.setState({
          data: objectToArr(data)
        })
    })

    this.setState({inProcess: false})

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


  delInfo=()=>{
    this.setState({
      selected:'',
      index:'',
      status: false
    })
  }

  render() {
    const { navigation } = this.props;
    const email = navigation.getParam('email');
    console.log('Props navigation', this.props);
    console.log('bullshit emailll '+ email)
    return (
      <View  style={{ flex: 1 }}>
      {this.state.inProcess ?
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
      :<View>
      <View>
      <MapView
        style={{ width:360, height:550 }}
        initialRegion={{
          latitude: 43.2551,
          longitude: 76.9126,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onPress={this.delInfo}
        showsUserLocation={true}
        showsMyLocationButton={true}
        provider="google"
      >{this.state.inProcess !== true && this.state.data.map((marker, i) => (
        <MapView.Marker
          key={i}
          coordinate={{latitude: marker.latitude, longitude: marker.longitude}}
          title={marker.title}
          description={marker.description}
          onPress={()=>this.onMarkerPress(i)}
        />
      ))}
      </MapView>
      </View>
      <View style={styles.secondView}>
      {this.state.status ?<Card style={styles.cardStyle}>
          <CardImage 
            source={{uri: this.state.selected.image[0]}}
          />
          <CardTitle 
            title={this.state.selected.title} 
            subtitle={'Тип зарядного уст-ва: '+this.state.selected.description}
          />
          <CardAction 
            separator={true} 
            inColumn={false}>
            <CardButton
              onPress={() => this.onButtonPress(email)}
              title="Подробнее..."
              color="blue"
            />
          </CardAction>
        </Card>: null }
      </View>
      </View>}
      </View>
    );
  }
}


class InfoScreen extends React.Component {
  static navigationOptions = {
    title: 'Типы зарядных уст-ств',
    headerStyle: {
      backgroundColor: '#009DDC',
    },
    headerTintColor: 'white',
  };

  state = {
    chargerData:'',
  }

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


    firebase.database().ref('chargerData').on('value', (data) => {
      this.setState({
        chargerData: objectToArray(data)
      })
    })
  }


  onButtonPress=(item)=>{
    this.props.navigation.navigate('FullInfo', {
      item: item
    })
  }

  _renderItem = ({ item }) =>{
    return(
        <Card style={styles.cardStyle2}>
        <CardImage 
          source={{uri: item.pictures[1]}}
        />
        <CardTitle 
          title={item.name} 
          subtitle={item.short}
        />
        <CardAction 
          separator={true} 
          inColumn={false}>
          <CardButton
            onPress={() => this.onButtonPress(item)}
            title="Читать..."
            color="blue"
          />
        </CardAction>
      </Card>
    )
  }


  render() {
    return (
      <View style={{flex:1}}>
        <FlatList
            data={this.state.chargerData}
            keyExtractor={(item, index) => index}
            renderItem={this._renderItem}
        />
      </View>
    )
  }
}


//onPress={() => this.props.navigation.navigate('Details')}

const MapStack = StackNavigator({
  Map: { screen: MapScreen },
  Details: { screen: DetailsScreen },
  allFeedbacks: { screen: feedBacksScreen },
});

const InfoStack = StackNavigator({
  Info: { screen: InfoScreen},
  FullInfo: { screen: FullInfoScreen },
});

export default TabNavigator(
  {
    Map: { screen: MapStack},
    Info: { screen: InfoStack}
  },
  {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === 'Map') {
          iconName = `ios-compass${focused ? '' : '-outline'}`;
        } else {
          iconName = `md-battery-charging`;
        }

        // You can return any component that you like here! We usually use an
        // icon component from react-native-vector-icons
        return <Ionicons name={iconName} size={25} color={tintColor} />;
      },
    }),
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    tabBarOptions: {
      activeTintColor: '#EF7C2F',
      inactiveTintColor: 'gray',
    },
    animationEnabled: true,
    swipeEnabled: true,
  }
);

const styles = StyleSheet.create({
  secondView:{ 
    position: 'absolute',
    width: 360,
    bottom: 0,
    left: 0
  },
  cardStyle2:{
    height:305,
  },
  cardStyle:{
    height:230,
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
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 15,
    flexDirection: 'row',
  },
  url: {
    flex: 1,
  },
  urlText: {
    color: '#fff',
    fontSize: 20,
  },
  cancelButton: {
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 18,
  },
});

