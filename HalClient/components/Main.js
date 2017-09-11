import React, { Component } from 'react';
import {AppState, ViewPagerAndroid, Button, StyleSheet, Dimensions, View, Vibration, Alert, NetInfo} from 'react-native';
import HomeView from './HomeView';
import RobotView from './RobotView';
import KitchenControlView from './KitchenControlView';
import HomeProtectView from './HomeProtectView';
import MessagesLogView from './MessagesLogView';

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
      messagesLog: [], 
      receivedImage: null, 
      streamImageBuffer: null,
      cameraModalVisible: false,
      initialViewPagerPage: 0,
      robotHardwarInterval: null,
      robotHardwareIntervalTime: 3000,

    };
    this.socketStream = null;
  }

  initNetInfo(){
    var self = this;
    NetInfo.fetch().done((reach) => {
      console.log('Initial connection: ' + reach);
      self.setState({netInfoState: reach});
    });
    function handleConnectivityChange(reach) {
      console.log('Changed connection: ' + reach);
      self.setState({netInfoState: reach});
    }
    NetInfo.addEventListener(
      'change',
      handleConnectivityChange
    );
  }

  componentDidMount(){
    this.initNetInfo()
    AppState.addEventListener('change', this._handleAppStateChange);
    this._connectSocket();
    var self = this;
    var robotHardwarInterval = setInterval(()=>{
      self.getRobotHardwareInfo();
    }, this.state.robotHardwareIntervalTime);
    this.setState({robotHardwareInterval: robotHardwarInterval});
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
    clearInterval(this.state.intervalId);
  }

  _handleAppStateChange = (nextAppState) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      console.log('App has come to the foreground!')
    }
    this.setState({appState: nextAppState});

    // reconnect websocket if disconnectet internet in background or inactive
    if (this.socketStream.readyState !== 1) {
      // this._reconnectSocket();
    }
  }

  _connectSocket(){
    this.renderMessage('Connecting...');
    var self = this;
    this.socketStream = new WebSocket("ws://192.168.1.151:8083");

    this.socketStream.onopen = (evt)=>{ 
      self.setState({socketConnected: true});
      this.renderMessage('Socket connection opened.')
      const requestData = {from: 'halClient', to: "server", event: 'init', date: Date.now(), data:{message: 'Hello Server!'}};
      self.socketStream.send(JSON.stringify(requestData))
    };

    this.socketStream.onmessage = (request)=>{
      this.renderMessage('Received message request: ' + request);
      var requestData = JSON.parse(request.data);
      this.writeMessageLog(requestData);
      switch(requestData.event){
        case 'alarm':
          this.protectHomeAlarm(requestData.data.message);
          break;
        case 'robotHardwareInfo':
          this.renderMessage('Hardware info: ' + requestData.data);
          break;
      }
    };    

    this.socketStream.onclose = (e)=>{
      this.renderMessage('Socket connection closed.');
      self.setState({protectHomeState: false, autopilotState: false, socketConnected: false});
      self._reconnectSocket();
    };

  }

  writeMessageLog(data){
    this.setState({messagesLog: this.state.messagesLog.concat([data])});
    this.renderMessage(this.state.messagesLog);
  }

  getRobotHardwareInfo(){
    // const requestData = {client: 'halClient', event: 'robotHardware', date: Date.now(), data:{}};
    // if(this.socketStream.readyState === 1){
    //   this.socketStream.send(JSON.stringify(requestData));
    // }
  }

  renderMessage(message){
    this.setState({socketResponse: message, messages: [this.state.messages,message]} ); // socketResponse tymczasowo
    console.log(message);
    console.log(this.state.messages);
  }
  

  _reconnectSocket(){
    var self = this;
    self.renderMessage('Reconnecting after 2 seconds...');
    setTimeout(()=>{
      if(this.state.netInfoState == 'WIFI'){
        self._connectSocket();
      }else{
        self.renderMessage('WIFI connection disabled! Waiting for WIFI connection...');
        self._reconnectSocket();
      }
    },2000);
  }

  _disconnectSocket(){
    this.socketStream.close();
  }

  protectHomeAlarm(message){
    console.log('Alarm alarm alarm!');
    Vibration.vibrate([0, 500, 200, 500], true);
    Alert.alert(
      'Protect Home Alert!',
      message,
      [
      {text: 'OK', onPress: () => Vibration.cancel()},
      ],
      { cancelable: false }
      )
  }

  render(){
    return(
      <View style={styles.container}>
        <View style={{flexDirection:'row', alignSelf: 'flex-end', marginRight:15}}>
            <Button title="Settings" onPress={()=>console.log('dupa')}/>
        </View>
        <ViewPagerAndroid
          initialPage={this.state.initialViewPagerPage}
          style={styles.viewPager}
        >
          <View style={styles.pageStyle}>
            <HomeView netInfoState={this.state.netInfoState} socketConnected={this.state.socketConnected} socketStream={this.socketStream}></HomeView>
          </View>
          <View style={styles.pageStyle}>
            <MessagesLogView messagesLog={this.state.messagesLog}></MessagesLogView> 
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