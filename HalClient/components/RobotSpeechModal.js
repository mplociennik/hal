import React, { Component } from 'react';
import {StyleSheet, Image, Text, TextInput, View, Modal, TouchableHighlight, TouchableWithoutFeedback, Button, Dimensions, Picker, Keyboard} from 'react-native';

var windowWidth = Dimensions.get('window').width;
var windowHeight = Dimensions.get('window').height;

export default class RobotSpeechModal extends Component {
    constructor(props){
        super(props);
        this.state = {textToSpeech:'', robotLector: 'eva'};
    }

    speechText(textToSpeech){
      console.log('Sending robotSpeech text: ', this.state.textToSpeech);
      const requestData = {client: 'halClient', event: 'robotSpeechText', date: Date.now(), data:{lector: this.state.robotLector ,text: textToSpeech}};
      this.props.socketStream.send(JSON.stringify(requestData));
      this.setState({textToSpeech: ''});
      Keyboard.dismiss();
    }

    pressHideModal(){
      this.props.setRobotSpeechModalVisible(false);
      Keyboard.dismiss();
    }

    render(){
        return(
          <View>
            <Modal
              animationType={"slide"}
              transparent={false}
              visible={this.props.modalVisible}
              onRequestClose={() => {alert("Modal has been closed.")}}
              >
             <View style={styles.modal}>
              <View>
                <View style={{flexDirection:'row'}}>
                  <View style={{flexDirection:'column', alignItems: 'center',alignContent: 'space-around'}}>
                    <View style={styles.formGroup}> 
                      <Picker style={styles.lectorPicker} selectedValue={this.state.robotLector}
                        onValueChange={(itemValue, itemIndex) => this.setState({robotLector: itemValue})}>
                        <Picker.Item label="Eva (ENG)" value="eva" />
                        <Picker.Item label="Dalek (ENG)" value="dalek" />
                      </Picker>
                    </View>
                    <View style={styles.formGroup}> 
                      <TextInput style={styles.robotSpeechTextInput} onChangeText={(text) => this.setState({textToSpeech: text})} value={this.state.textToSpeech}/>
                      <Button title="Speech text" onPress={()=>this.speechText(this.state.textToSpeech)}/>
                    </View>
                    <View style={styles.formGroup}>
                      <Button title="Exterminate" onPress={()=>this.speechText('Exterminate! Exterminate! Exterminate!')}/>
                    </View>
                  </View>
                </View>
                <TouchableHighlight style={styles.buttonCloseModal} onPress={() => {
                  this.pressHideModal();
                }}>
                  <Text style={styles.buttonCloseModalText}>Hide Modal</Text>
                </TouchableHighlight>
              </View>
             </View>
            </Modal>
          </View>
          )
    }
}

const styles = StyleSheet.create({
  modal:{
    backgroundColor:'#000',
    width:windowWidth,
    height:windowHeight
  },
  formGroup:{
    width: windowWidth - 10,
    marginTop:10,
    marginBottom:10,
    marginLeft:5,
    marginRight:5,
    padding:10

  },
  robotSpeechTextInput:{
    justifyContent: 'space-between',
    marginTop: 10,
    color: 'white', 
    height: 40, 
    borderColor: 'gray', 
    borderWidth: 1
  },
  buttonCloseModal:{
    alignItems: 'center',
    marginTop:10,
    marginBottom: 10,
    marginLeft:5,
    marginRight:5,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#fff',
    padding: 20
  },
  buttonCloseModalText:{
    color: '#fff'
  },
  lectorPicker: {
    backgroundColor: '#fff',
    alignItems: 'center',
    marginTop:10,
    marginBottom: 10,
    marginLeft:5,
    marginRight:5,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#fff',
    padding: 20
  },
  lectorPickerItem: {
    color:'#fff',
    marginTop:10,
    marginBottom: 10,
    marginLeft:5,
    marginRight:5,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#fff',
    padding: 20
  }
});