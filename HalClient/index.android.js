import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Button,
  Switch,
  Vibration,
  Alert
} from 'react-native';

export default class HalClient extends Component {

  constructor(props){
    super(props);
    this.state = {moveDirection: null, moveState: null, socketResponse: null, protectHomeState: false, autopilotState: false};
    this.socketStream = null;
  }

  componentDidMount(){
    this._connectSocket();
  }

  _connectSocket(){
    console.log('Starting connection...');
    var self = this;
    this.socketStream = new WebSocket("ws://192.168.1.151:8083");
    console.log(this.socketStream);

    this.socketStream.onmessage = (request)=>{
      console.log('Received message request: ', request);
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
      }
    };    

    this.socketStream.onclose = (e)=>{
      console.log('Socket connection closed.', e);
      console.log(e.code, e.reason);
      self.setState({socketResponse: 'Socket connection closed.', protectHomeState: false, autopilotState: false});

    };

    this.socketStream.onopen = (evt)=>{ 
      self.setState({socketResponse: 'Socket connection opened.'});
      const requestData = {client: 'halClient', event: 'init', date: Date.now(), data:{message: 'Hello Server!'}};
      self.socketStream.send(JSON.stringify(requestData))
    };
  }

  _disconnectSocket(){
    this.socketStream.close();
  }

  _move(direction, state){
    const requestData = {client: 'halClient', event: 'move', date: Date.now(), data:{direction:direction, state: state}};
    console.log('Move: ',requestData);
    this.socketStream.send(JSON.stringify(requestData));
    this.setState({moveDirection: direction, moveState: state});
  }

  _protectHome(state){
    console.log('Sending ProtectHome state: ', state);
    const requestData = {client: 'halClient', event: 'protectHome', date: Date.now(), data:{state: state}};
    this.socketStream.send(JSON.stringify(requestData));
    this.setState({protectHomeState: state});
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
              <Switch onValueChange={(value)=>{this._protectHome(value);}} value = {this.state.protectHomeState}/>
            </View>
            <View>
              <Text>Autopilot: </Text>
            </View>
            <View>
              <Switch onValueChange={(value)=>{this._autopilot(value);}} value = {this.state.autopilotState}/>
            </View>
          </View>
          <View style={{flexDirection:'row'}}>
            <Text>
            SocketResponse: { this.state.socketResponse }
            </Text>
          </View>
          <View style={{flexDirection:'column'}}>
            <Text>Move direction: {this.state.moveDirection}, Move state: {String(this.state.moveState)}</Text>
            <Button onPress={()=>this._connectSocket()} title="Connect socket"/>
          </View>
        </View>
        <View style={{flex:.5,flexDirection:'column', justifyContent: 'center', alignItems: 'center',}}>
        <View style={{flexDirection:'row'}}>
        <TouchableWithoutFeedback 
        onPressIn={()=>this._move('up', true)} onPressOut={()=>this._move('up', false)}>
        <View style={styles.button}>
        <Text>
        UP
        </Text>
        </View>
        </TouchableWithoutFeedback>
        </View>
        <View style={{flexDirection:'row'}}>
        <TouchableWithoutFeedback 
        onPressIn={()=>this._move('left', true)} onPressOut={()=>this._move('left', false)}>
        <View style={styles.buttonLeft}>
        <Text>
        LEFT
        </Text>
        </View>
        </TouchableWithoutFeedback>      
        <TouchableWithoutFeedback 
        onPressIn={()=>this._move('right', true)} onPressOut={()=>this._move('right', false)}>
        <View style={styles.buttonRight}>
        <Text>
        RIGHT
        </Text>
        </View>
        </TouchableWithoutFeedback>
        </View>
        <View style={{flexDirection:'row'}}>
        <TouchableWithoutFeedback 
        onPressIn={()=>this._move('down', true)} onPressOut={()=>this._move('down', false)}>
        <View style={styles.button}>
        <Text>
        DOWN
        </Text>
        </View>
        </TouchableWithoutFeedback>  
        </View>
        </View>
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
    flex: .08, 
    backgroundColor: '#4f4f4f', 
    paddingTop: 15,
    alignSelf: 'stretch',
    textAlign: 'center'
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
  button:{
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#000',
    padding: 20
  },
  buttonLeft:{
    alignItems: 'center',
    marginBottom: 10,
    marginRight: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#000',
    padding: 20
  },
  buttonRight:{
    alignItems: 'center',
    marginBottom: 10,
    marginLeft: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#000',
    padding: 20
  },
});

AppRegistry.registerComponent('HalClient', () => HalClient);
