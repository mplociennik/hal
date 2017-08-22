import React, { Component } from 'react';
import {Image, Text, View, Modal, TouchableHighlight} from 'react-native';
import { CameraImage } from '../components/CameraImage';

export default class CameraModal extends Component {
    constructor(props){
        super(props);
        console.log(props);
    }

    pressHideModal(){
        this.props.setCameraModalVisible(false);
    }

    render(){
        return(
          <View style={{marginTop: 22}}>
            <Modal
              animationType={"slide"}
              transparent={false}
              visible={this.props.cameraModalVisible}
              onRequestClose={() => {alert("Modal has been closed.")}}
              >
             <View style={{marginTop: 22}}>
              <View>
                <CameraImage image={this.props.receivedImage}></CameraImage>
                <TouchableHighlight onPress={() => {
                  this.pressHideModal();
                }}>
                  <Text>Hide Modal</Text>
                </TouchableHighlight>
              </View>
             </View>
            </Modal>
          </View>
          )
    }
}