import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Button,
  Switch
} from 'react-native';

export default class HalClient extends Component {

  constructor(props){
    super(props);
    this.state = {moveDirection: null, moveState: null, socketResponse: null, protectHomeState: false};
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
      console.log(request.data);
      self.setState({socketResponse: request.data});
    };    

    this.socketStream.onclose = (e)=>{
      console.log('Socket connection closed.');
      console.log(e.code, e.reason);
      self.setState({socketResponse: 'Socket connection closed.'});
    
    };
  }

  _disconnectSocket(){
    this.socketStream.close();
  }

  _move(direction, state){
    const requestData = {event: 'move', date: Date.now(), data:{direction:direction, state: state}};
    console.log('Move: ',requestData);
    this.socketStream.send(JSON.stringify(requestData));
    this.setState({moveDirection: direction, moveState: state});
  }

  _protectHome(state){
    console.log('ProtectHome state: ', state);
    const requestData = {event: 'protectHome', date: Date.now(), data:{state: state}};
    this.socketStream.send(JSON.stringify(requestData));
    this.setState({protectHomeState: state});
  }

  render() {
    return (
      <View style={styles.container}>
      <Text style={styles.socketInfo}>
      SocketResponse: { this.state.socketResponse }
      </Text>
      <Text>
      Direction: {this.state.moveDirection}
      State: {this.state.moveState}
      </Text>
      <Switch onValueChange={(value)=>{this._protectHome(value)}} value = {this.state.protectHomeState}/>
      <Button onPress={()=>this._connectSocket()} title="Connect socket"/>
      <TouchableWithoutFeedback 
        onPressIn={()=>this._move('up', true)} onPressOut={()=>this._move('up', false)}>
      <View style={styles.button}>
        <Text>
        UP
        </Text>
      </View>
      </TouchableWithoutFeedback>      
      <TouchableWithoutFeedback 
        onPressIn={()=>this._move('down', true)} onPressOut={()=>this._move('down', false)}>
      <View style={styles.button}>
        <Text>
          DOWN
        </Text>
      </View>
      </TouchableWithoutFeedback>      
      <TouchableWithoutFeedback 
        onPressIn={()=>this._move('left', true)} onPressOut={()=>this._move('left', false)}>
      <View style={styles.button}>
      <Text>
        LEFT
      </Text>
      </View>
      </TouchableWithoutFeedback>      
      <TouchableWithoutFeedback 
        onPressIn={()=>this._move('right', true)} onPressOut={()=>this._move('right', false)}>
      <View style={styles.button}>
        <Text>
          RIGHT
        </Text>
      </View>
      </TouchableWithoutFeedback>
      </View>
      );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  socketInfo: {
    fontSize: 20,
    alignItems: 'center',
    margin: 10,
  },
  button: {
    alignItems: 'center',
    marginBottom: 7,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#000',
    padding: 10
  },

});

AppRegistry.registerComponent('HalClient', () => HalClient);
