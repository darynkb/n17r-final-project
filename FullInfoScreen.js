import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';

import { Card, CardTitle, CardContent, CardImage } from 'react-native-material-cards'
import firebase from 'firebase';

export default class FullInfoScreen extends React.Component {
    static navigationOptions = {
        title: ' О зарядном устройстве',
        headerStyle: {
          backgroundColor: '#009DDC',
        },
        headerTintColor: 'white',
      };
  
    state = {

    }


    _renderItem2 = ({ item }) =>{
        return(
          <View>
            <Image
                style={{ width: 353, height: 280 }}
                source={{ uri: item }}
            />
          </View>  
        )
    }


    render() {
        const { navigation } = this.props;
        const item = navigation.getParam('item');
        return (
            <View style={{flex:1}}>
                <ScrollView>
                    <Card>
                        <FlatList
                            horizontal={true}
                            data={item.pictures}
                            keyExtractor={(item, index) => index}
                            renderItem={this._renderItem2}
                        />
                        <CardTitle 
                        title={item.name}
                        />
                        <CardContent text={item.info} />
                    </Card>
                </ScrollView>
            </View>
        )
    }

}