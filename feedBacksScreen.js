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

export default class feedBacksScreen extends React.Component {
    static navigationOptions = {
        title: '        Все отзывы',
        headerStyle: {
          backgroundColor: '#009DDC',
        },
        headerTintColor: 'white',
      };



    _renderItem = ({ item }) =>{
        return(
            <View>
                <Text style={styles.feedbackName}>{item.name}</Text>
                <Text style={styles.allFeeds}>{item.feedback}</Text>
            </View>
        )
    }
    
    render() {
        const { navigation } = this.props;
        const dataa = navigation.getParam('dataa');
        const getI = navigation.getParam('getI');
        return (
            <View>
                <FlatList
                    data={dataa[getI].feedBacks}
                    keyExtractor={(item, index) => index}
                    renderItem={this._renderItem}
                />
            </View>
      )
    }
  }


  const styles = StyleSheet.create({
    allFeeds:{
        fontSize: 20,
        paddingTop: 5,
        paddingLeft:10,
        alignItems:'flex-start',
    },
    feedbackName:{
        fontSize: 19,
        paddingTop: 10,
        paddingLeft:10,
        alignItems:'flex-start',
        color:'gray'
    }
  })
