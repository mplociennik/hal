import React, { Component } from 'react';
import {Text, View, TouchableWithoutFeedback, Switch, Alert, Vibration, StyleSheet, Dimensions, Button} from 'react-native';

var windowWidth = Dimensions.get('window').width;
var windowHeight = Dimensions.get('window').height;


export default class RobotCameraView extends Component{
  constructor(props){
    super(props);
    this.state= {protectHomeState: false, autopilotState:false, moveDirection:null, moveState:false, robotSpeechModalVisible: false};
  }
  
  
  
  render(){
    return(
        <View style={styles.robotViewStyle}>
          <View style={styles.pageHeader}>
            <Text style={styles.pageText}>Robot control</Text>
          </View>
          <View style={styles.pageContent}>
            <Video
              source={{uri: "rtsp://192.168.1.135:8554/x"}} // Can be a URL or a local file.
              rate={1.0}                   // 0 is paused, 1 is normal.
              volume={1.0}                 // 0 is muted, 1 is normal.
              muted={false}                // Mutes the audio entirely.
              paused={false}               // Pauses playback entirely.
              resizeMode="cover"           // Fill the whole screen at aspect ratio.
              repeat={true}                // Repeat forever.
              playInBackground={false}     // Audio continues to play when aentering background.
              playWhenInactive={false}     // [iOS] Video continues to play whcontrol or notification center are shown.
              onLoadStart={this.loadStart} // Callback when video starts to load
              onLoad={this.setDuration}    // Callback when video loads
              onProgress={this.setTime}    // Callback every ~250ms with currentTime
              onEnd={this.onEnd}           // Callback when playback finishes
              onError={this.videoError}    // Callback when video cannot be loaded
              style={styles.backgroundVideo}
            />
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
    flex:0.4,
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
  arrowUp:{
    position:'relative',
    top:140
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
    flex:0.09,
    flexDirection:'row',
    justifyContent: 'center'
  },
  robotControlArrows:{
    flex:0.6,
    flexDirection:'row',
    alignItems: 'center',
    justifyContent: 'space-around',
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
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});