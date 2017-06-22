/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

 import React, { Component } from 'react';
 import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Button
} from 'react-native';

export default class HalClient extends Component {

  constructor(props){
    super(props);
    this.state = {socketStream: null, moveDirection: null, moveState: null, socketResponse: null, protectHomeState: false};
  }

  componentDidMount(){
    var self = this;
    this.state.socketStream.onmessage = (request)=>{
      console.log(request.data);
      self.setState({socketResponse: request.data)});
    };    

    this.state.socketStream.onclose = (e)=>{
      console.log('Socket connection closed.');
      console.log(e.code, e.reason);
      self.setState({socketResponse: 'Socket connection closed.'});
    };
  }

  _connectSocket(){
    const socketStream = new WebSocket("ws://127.0.0.1:8083");
    this.setState({socketStream: socketStream});
  }

  _disconnectSocket(){
    this.state.socketStream.close();
  }

  _move(direction, state){
    const requestData = {event: 'move', date: Date.now(), data:{direction:direction, state: state}};
    console.log('Move: ',requestData);
    this.state.socketStream.send(JSON.stringify(requestData));
    this.setState({moveDirection: direction, moveState: state});
  }

  _protectHome(state){
    console.log('ProtectHome state: ', state);
    const requestData = {event: 'protectHome', date: Date.now(), data:{state: state}};
    this.state.socketStream.send(JSON.stringify(requestData));
    this.setState({protectHomeState: state});
  }

  render() {
    return (
      <View style={styles.container}>
      <Text style={styles.socketInfo}>
      SocketInfo: { this.state.socketStream.readyState }
      </Text>
      <Text>
      Direction: {this.state.moveDirection}
      State: {this.state.moveState}
      </Text>
      <Switch onValueChange={()=>{this._protectHome(value)}} value = {this.state.protectHomeState}/>
      <Button onPress={()=>this._connectSocket()} title="Connect socket"/>
      <TouchableWithoutFeedback 
        onPressIn={()=>this._move('up', true)} onPressOut={()=>)this._move('up', false)}>
      <Text>
      UP
      </Text>
      </TouchableWithoutFeedback>      
      <TouchableWithoutFeedback 
        onPressIn={()=>this._move('down', true)} onPressOut={()=>)this._move('down', false)}>
      <Text>
      DOWN
      </Text>
      </TouchableWithoutFeedback>      
      <TouchableWithoutFeedback 
        onPressIn={()=>this._move('left', true)} onPressOut={()=>)this._move('left', false)}>
      <Text>
      LEFT
      </Text>
      </TouchableWithoutFeedback>      
      <TouchableWithoutFeedback 
        onPressIn={()=>this._move('right', true)} onPressOut={()=>)this._move('right', false)}>
      <Text>
      RIGHT
      </Text>
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
    textAlign: 'center',
    margin: 10,
  },

});

AppRegistry.registerComponent('HalClient', () => HalClient);
