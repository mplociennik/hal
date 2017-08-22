import React, { Component } from 'react';
import {AppState, ViewPagerAndroid, Button, StyleSheet, Dimensions, View} from 'react-native';
import HomeView from './HomeView';
import RobotView from './RobotView';
import KitchenControlView from './KitchenControlView';
import HomeProtectView from './HomeProtectView';

var windowWidth = Dimensions.get('window').width;
var windowHeight = Dimensions.get('window').height;

export default class Main extends Component {

  constructor(props){
    super(props);
    this.state = {
      appState: AppState.currentState,
      moveDirection: null, 
      moveState: null, 
      socketResponse: null, 
      protectHomeState: false, 
      kitchenLightState: false, 
      autopilotState: false, 
      socketConnected: false, 
      messages: [], 
      receivedImage: null, 
      streamImageBuffer: null,
      cameraModalVisible: false
    };
    this.socketStream = null;
  }

  componentDidMount(){
    AppState.addEventListener('change', this._handleAppStateChange);
    this._connectSocket();
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = (nextAppState) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      console.log('App has come to the foreground!')
    }
    this.setState({appState: nextAppState});

    // reconnect websocket if disconnectet internet in background or inactive
    if (this.socketStream.readyState !== 1) {
      this._reconnectSocket();
    }
  }

  _connectSocket(){
    this.renderMessage('Connecting...');
    var self = this;
    this.socketStream = new WebSocket("ws://192.168.1.151:8083");
    this.socketStream.onopen = (evt)=>{ 
      self.setState({socketConnected: true});
      this.renderMessage('Socket connection opened.')
      const requestData = {client: 'halClient', event: 'init', date: Date.now(), data:{message: 'Hello Server!'}};
      self.socketStream.send(JSON.stringify(requestData))
    };
    this.socketStream.onmessage = (request)=>{
      this.renderMessage('Received message request: ' + request);
      var requestData = JSON.parse(request.data);
      switch(requestData.event){
        case 'message':
          self.setState({socketResponse: requestData.data.message});
          break;        
        case 'move':
          self.setState({socketResponse: requestData.data.message});
          break;
        case 'protectHome':
          self.setState({socketResponse: requestData.data.message});
          break;     
        case 'autopilot':
          self.setState({socketResponse: requestData.data.message});
          break;   
        case 'protectHomeAlarm':
          this._protectHomeAlarm(requestData.data.message);
          break;
        case 'stream_photo':
          this.receiveImageStream(requestData.data);
          this.setState({receivedImage: requestData.data.photo_data, cameraModalVisible: true})
          break;
      }
    };    

    this.socketStream.onclose = (e)=>{
      this.renderMessage('Socket connection closed.');
      self.setState({protectHomeState: false, autopilotState: false, socketConnected: false});
      self._reconnectSocket();
    };

  }

  renderMessage(message){
    this.setState({socketResponse: message, messages: [this.state.messages,message]} ); // socketResponse tymczasowo
    console.log(message);
    console.log(this.state.messages);
  }
  

  _reconnectSocket(){
    this.renderMessage('Reconnecting...');
    this._connectSocket();
  }

  _disconnectSocket(){
    this.socketStream.close();
  }


  _getCameraImage = function(){
    console.log('Sending camera image request...');
    var requestData = {client: 'halClient', event: 'getrobotmodaCameraImage', date: Date.now(), data:{}};
    this.socketStream.send(JSON.stringify(requestData));
  }

  setCameraModalVisible(visible) {
    this.setState({cameraModalVisible: visible});
  }

  render(){
    return(
      <View style={styles.container}>
        <View style={{flexDirection:'row', alignSelf: 'flex-end', marginRight:15}}>
            <Button title="Settings" onPress={()=>console.log('dupa')}/>
        </View>
        <ViewPagerAndroid
          initialPage={0}
          style={styles.viewPager}
        >
          <View style={styles.pageStyle}>
            <HomeView></HomeView>
          </View>
          <View style={styles.pageStyle}>
            <RobotView socketConnected={this.state.socketConnected} socketStream={this.socketStream}></RobotView>
          </View>
          <View style={styles.pageStyle}>
            <KitchenControlView socketConnected={this.state.socketConnected} socketStream={this.socketStream}></KitchenControlView> 
          </View>
          <View style={styles.pageStyle}>
            <HomeProtectView></HomeProtectView> 
          </View>
        </ViewPagerAndroid>
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