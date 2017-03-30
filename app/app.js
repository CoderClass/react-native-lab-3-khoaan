/**
 * Created by AnTran on 3/30/17.
 */
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Navigator,
    Image,
    TouchableOpacity,
    TextInput
} from 'react-native';

import MapView from 'react-native-maps';
import ImagePicker from 'react-native-image-picker';
import Lightbox from 'react-native-lightbox'
import {api} from './api/api'


var image
const flag = require('./resource/flag.png')

export default class App extends Component {

    constructor(props) {
        super(props)

        this.state = {
            position: {},
            longitude: 0,
            latitude: 0,
            listMaker: [],
            // pickedImage: []
        }

        navigator.geolocation.getCurrentPosition((position) => {
            /*{
             coords:
             {
             speed: -1,
             longitude: -122.406417,
             latitude: 37.785834,
             accuracy: 5,
             heading: -1,
             altitude: 0,
             altitudeAccuracy: -1
             },
             timestamp: 1490794016532.687
             }*/
            console.log('position', position);
            this.setState({
                longitude: position.coords.longitude,
                latitude: position.coords.latitude,
                position: position,
                // pickedImage: []
            })
        }, (error) => {
            console.log('error', error);
        });
    }

    addPosition = (position, image) => {
        var maker = (<MapView.Marker
            image={flag}
            coordinate={position}
            title={'Current position'}>

        <MapView.Callout
            style={{
                alignItems: 'center', justifyContent: 'center',
            }}
        >
            { /*<TouchableOpacity onPress={this.pickImage()} style={{
                flex: 1,
            }}>*/}
                <Lightbox
                    renderContent={() => {
                        return (<Image source={image}
                                       style={{
                                           flex: 1,
                                       }}
                        />);
                    }}
                >
                <Image source={image}
                       style={{
                           width: 60, height: 60,
                           margin: 4,
                       }}
                />
                </Lightbox>
            {/*</TouchableOpacity>*/}
            <Text
                style={{
                    fontSize: 12,
                }}
            >
                Marker {this.state.listMaker.length}
            </Text>

        </MapView.Callout>
        </MapView.Marker>)

        this.setState({
            listMaker: [...this.state.listMaker, maker],
        })
    }

    pickImage = () => {
        return new Promise((resolve, reject) =>
        {
            ImagePicker.showImagePicker({
                storageOptions: {
                    skipBackup: true, path: 'images'
                }
            }, (response) => {

                if (response.didCancel) {
                    console.log('User cancelled image picker');
                }
                else if (response.error) {
                    console.log('ImagePicker Error: ', response.error);
                }
                else if (response.customButton) {
                    console.log('User tapped custom button: ', response.customButton);
                }
                else {
                    let source = {uri: response.uri};    // You can also display the image using data:
                    // let source = { uri: 'data:image/jpeg;base64,' + response.data };
                    console.log(source)
                    resolve(source);
                    // this.setState({
                    //     pickedImage: [...this.state.pickedImage, source],
                    //     //pickedImage: source
                    // })
                }
            })
        });
    }

    async searchYelp() {
        let category = await Yelp.getCategories().then((item) => {
            console.log(item)
            return item;
        })
    }

    render() {

        const region = {
            latitude: 10.770971,
            longitude: 106.692035,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        }

        // const coordinate = {
        //     latitude: this.state.latitude,
        //     longitude: this.state.longitude
        // }

        return (
            <View>
                <TextInput style={{height: 50, margin: 10}}
                           placeholder="Search"/>
                <MapView
                    onLongPress={async (e) => {
                        const { coordinate } = e.nativeEvent;
                        const image = await this.pickImage();
                        this.addPosition(coordinate, image);
                        console.log('coordinate', coordinate);
                    }}
                    region={region}
                    style={{
                        width: '100%',
                        height: '100%'
                    }}
                >
                    {this.state.listMaker}
                </MapView>
            </View>
        )
    }
}