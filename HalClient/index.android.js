import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  TouchableHighlight,
  Button,
  Switch,
  Vibration,
  Alert,
  Image,
  Modal
} from 'react-native';
import CameraModal from './components/CameraModal';


export default class HalClient extends Component {

  constructor(props){
    super(props);
    this.state = {
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
      cameraModalVisible: false,
      robotModalVisible: false,
    };
    this.socketStream = null;
  }

  componentDidMount(){
    this._connectSocket();
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

  receiveImageStream(data){
    if (data.in_progress) {
      this.setState({streamImageBuffer: this.state.streamImageBuffer + data.photo_data});
    }else{
      this.setState({receivedImage: this.state.streamImageBuffer, cameraModalVisible: true, streamImageBuffer: null});
    }
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

  _protectHome(state){
    console.log('Sending ProtectHome state: ', state);
    const requestData = {client: 'halClient', event: 'protectHome', date: Date.now(), data:{state: state}};
    this.socketStream.send(JSON.stringify(requestData));
    this.setState({protectHomeState: state});
  }

  _toggleKitchenLight(state){
    console.log('Sending kitchenLight state: ', state);
    const requestData = {client: 'halClient', event: 'toggleKitchenLight', date: Date.now(), data:{state: state}};
    this.socketStream.send(JSON.stringify(requestData));
    this.setState({kitchenLightState: state});
  }
  
  
  _autopilot(state){
    console.log('Sending Autopilot state: ', state);
    const requestData = {client: 'halClient', event: 'autopilot', date: Date.now(), data:{state: state}};
    this.socketStream.send(JSON.stringify(requestData));
    this.setState({autopilotState: state});
  }

  _protectHomeAlarm(message){
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

  _getCameraImage = function(){
    console.log('Sending camera image request...');
    var requestData = {client: 'halClient', event: 'getRobotCameraImage', date: Date.now(), data:{}};
    this.socketStream.send(JSON.stringify(requestData));
  }

  setCameraModalVisible(visible) {
    this.setState({cameraModalVisible: visible});
  }

  setRobotaModalVisible(visible) {
    this.setState({robotModalVisible: visible});
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Hal Client</Text>
        </View>
        <View style={{flex: .25, marginTop:20}}>
          <View style={{flexDirection:'row'}}>
            <View>
              <Text>Home Protection: </Text>
            </View>
            <View>
              <Switch onValueChange={(value)=>{this._protectHome(value);}} value = {this.state.protectHomeState} disabled={!this.state.socketConnected}/>
            </View>
            <View>
              <Text>Autopilot: </Text>
            </View>
            <View>
              <Switch onValueChange={(value)=>{this._autopilot(value);}} value = {this.state.autopilotState} disabled={!this.state.socketConnected}/>
            </View>            
          </View>
          <View style={{flexDirection:'row'}}>
            <View>
              <Text>Kitchen Light: </Text>
            </View>
            <View>
              <Switch onValueChange={(value)=>{this._toggleKitchenLight(value);}} value = {this.state.kitchenLightState} disabled={!this.state.socketConnected}/>
            </View>
          </View>
          <View style={{flexDirection:'row'}}>
            <Text>
            Messages: { this.state.socketResponse }
            </Text>
          </View>          
          <View style={{flexDirection:'row'}}>
            
          </View>
          <View style={{flexDirection:'column'}}>
            <Text>Move direction: {this.state.moveDirection}, Move state: {String(this.state.moveState)}</Text>
            <Button onPress={()=>this._getCameraImage()} title="Get camera image"/>
          </View>
        </View>
        <CameraModal cameraModalVisible={this.state.cameraModalVisible} setCameraModalVisible={this.setCameraModalVisible.bind(this)} receivedImage={this.state.receivedImage}></CameraModal>
        <RobotModal socketStream={this.socketStream} socketConnected={this.state.socketConnected} setRobotModalVisible={this.setRobotModalVisible.bind(this)}></RobotModal>
      </View>
      );
}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
  },
  header:{
    flex: 0.08, 
    backgroundColor: '#4f4f4f', 
    paddingTop: 15,
    alignSelf: 'stretch',
    alignItems: 'center'
  },
  headerText:{
    color: '#fff', 
    marginTop:20, 
    alignSelf: 'center'
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#34495e',
  },
});

AppRegistry.registerComponent('HalClient', () => HalClient);
