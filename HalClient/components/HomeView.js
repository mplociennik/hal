import React, { Component } from 'react';
import {Text, View, Image, TextInput, StyleSheet, Dimensions, TouchableWithoutFeedback, Keyboard} from 'react-native';
import SpeechAndroid from 'react-native-android-voice';

var windowWidth = Dimensions.get('window').width;
var windowHeight = Dimensions.get('window').height;


export default class HomeView extends Component {
  constructor(props){
    super(props);
    this.state= {questionText: null};
  }
  
  async _speechRecognize(){
    try{
        //More Locales will be available upon release.
        var spokenText = await SpeechAndroid.startSpeech("Speak command", SpeechAndroid.US);
        console.log('spoken text: ', spokenText);
        this.sendSpeechCommand(spokenText);
    }catch(error){
        switch(error){
            case SpeechAndroid.E_VOICE_CANCELLED:
                console.log('Voice Recognizer cancelled');
                break;
            case SpeechAndroid.E_NO_MATCH:
                console.log('No match for what you said');
                break;
            case SpeechAndroid.E_SERVER_ERROR:
                console.log('Google Server Error');
                break;
            /*And more errors that will be documented on Docs upon release*/
        }
    }
  }

  getRequestByCommand(command){
      const commandMap = [
        {
          command: 'kitchen light on', request: {from: 'halClient', to: 'kitchenLight', event: 'toggleKitchenLight', date: Date.now(), data:{state: true}}
        },        
        {
          command: 'kitchen lights on', request: {from: 'halClient', to: 'kitchenLight', event: 'toggleKitchenLight', date: Date.now(), data:{state: true}}
        },        
        {
          command: 'kitchen light off', request: {from: 'halClient', to: 'kitchenLight', event: 'toggleKitchenLight', date: Date.now(), data:{state: false}}
        },        
        {
          command: 'kitchen lights off', request: {from: 'halClient', to: 'kitchenLight', event: 'toggleKitchenLight', date: Date.now(), data:{state: false}}
        },
      ];
      var request = null;
      commandMap.forEach((item)=>{
        if (item.command === command) {
          request = item.request;
        }
      });

      return request;
  }

  sendSpeechCommand(command){
      const request = this.getRequestByCommand(command);
      if(request){
        this.props.socketStream.send(JSON.stringify(request));
      }else{
        console.log('not found command!');
      }
      Keyboard.dismiss();
  }

  getHalImage(){
    if (this.props.socketConnected) {
      return(<Image source={require('./img/HAL9000_active.png')} style={{width: 200, height: 200, alignItems:'center'}}/>);
    }else{
      return(<Image source={require('./img/HAL9000_disabled.png')} style={{width: 200, height: 200, alignItems:'center'}}/>);
    }

  }

  render(){
    return(
        <View>
          <View style={styles.pageHeader}>
            <Text style={styles.pageText}>HAL9000</Text>
          </View>
          <View style={styles.halEye}>
              <TouchableWithoutFeedback onPressIn={()=>this._speechRecognize()} disabled={!this.props.socketConnected}>
                {this.getHalImage()}
              </TouchableWithoutFeedback>
          </View>
          <View style={styles.halNetInfo}>
            <Text style={styles.pageText}>Connection info: {this.props.netInfoState}</Text>
          </View>          
        </View>
      );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#000',
  },
  viewPager:{
    flex:1
  },
  homeView:{
    flex:1
  },
  pageHeader:{
    flex:0.04,
    alignItems:'center'
  },
  halEye:{
    flex:0.3,
    flexDirection:'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  halTextInput:{
    flex:0.2,
    flexDirection:'row'
  },
  halNetInfo:{
    flex:0.2,
    flexDirection:'row'
  },
  pageStyle: {
    flex:1,
    marginTop: 20,
    alignItems: 'center',
    padding:20,
  },
  pageContent:{
    flex:0.97,
    borderWidth:1,
    borderColor:'#fff',
    width: windowWidth
  },
  pageText: {
    color: 'white'
  },
  button:{
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#fff',
    padding: 20,
    width: 90, 
    height: 90,
    backgroundColor: '#fff',
  },
  buttonUp:{
    marginBottom:40,
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#fff',
    padding: 20,
    width: 90, 
    height: 90,
    backgroundColor: '#fff',
  },
  buttonDown:{
    marginTop:40,
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#fff',
    padding: 20,
    width: 90, 
    height: 90,
    backgroundColor: '#fff',
  },
  buttonLeft:{
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#fff',
    padding: 20,
    width: 90, 
    height: 90,
    backgroundColor: '#fff',
  },
  buttonRight:{
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#fff',
    padding: 20,
    width: 90, 
    height: 90,
    backgroundColor: '#fff',
  },
  robotViewStyle:{
    alignItems: 'center',
    justifyContent: 'center',
  },
  robotSwitches:{
    marginTop:20,
    flex:0.4,
    flexDirection:'row',
    justifyContent: 'center'
  },
  robotControlArrows:{
    flex:0.6,
    flexDirection:'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  kitchenControlViewStyle:{
    alignItems: 'center',
    justifyContent: 'center',
  },
  kitchenControlButtons:{
    marginTop:20,
    flexDirection:'row',
    justifyContent: 'center'
  },
  buttonMedium:{
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#fff',
    padding: 30,
    backgroundColor: '#fff'
  },
  buttonMediumOn:{
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'green',
    padding: 30,
    backgroundColor: '#fff'
  },
  buttonMediumOff:{
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'green',
    padding: 30,
    backgroundColor: '#fff'
  },
});