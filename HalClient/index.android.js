import React, { Component } from 'react';
import { AppRegistry, Text, View, StyleSheet, Image, TextInput, Button, ViewPagerAndroid, TouchableWithoutFeedback, TouchableHighlight, Dimensions, Switch, Vibration,  } from 'react-native';
var windowWidth = Dimensions.get('window').width;
var windowHeight = Dimensions.get('window').height;

export default class HalClient extends Component {
  render() {
    return (
      <Main></Main>
    );
  }
}

export class Main extends Component {

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
      cameraModalVisible: false
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
          initialPage={2}
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

export class HomeView extends Component {
  constructor(props){
    super(props);
    this.state= {questionText: null};
  }
  
  render(){
    return(
        <View>
          <View style={styles.pageHeader}>
            <Text style={styles.pageText}>HAL9000</Text>
          </View>
          <View style={styles.halEye}>
              <Image source={{uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/HAL9000.svg/256px-HAL9000.svg.png'}} style={{width: 200, height: 200, alignItems:'center'}}/>
          </View>
          <View style={styles.halTextInput}>
            <TextInput
              style={{height: 50, width:250, borderColor: 'gray', borderWidth: 1, borderRadius: 5, padding: 10, }}
              onChangeText={(questionText) => this.setState({questionText})}
              value={this.state.questionText}
              underlineColorAndroid="transparent"
              placeholder="Type question or command."
            />
          </View>
        </View>
      );
  }
}

export class RobotView extends Component{
  constructor(props){
    super(props);
    this.state= {protectHomeState: false, autopilotState:false, moveDirection:null, moveState:false};
  }
  
  move(direction, state){
    const requestData = {client: 'halClient', event: 'move', date: Date.now(), data:{direction:direction, state: state}};
    console.log('Move: ',requestData);
    this.props.socketStream.send(JSON.stringify(requestData));
    this.setState({moveDirection: direction, moveState: state});
  }
    
  autopilot(state){
    console.log('Sending Autopilot state: ', state);
    const requestData = {client: 'halClient', event: 'autopilot', date: Date.now(), data:{state: state}};
    this.props.socketStream.send(JSON.stringify(requestData));
    this.setState({autopilotState: state});
  }
  
  protectHome(state){
    console.log('Sending ProtectHome state: ', state);
    const requestData = {client: 'halClient', event: 'protectHome', date: Date.now(), data:{state: state}};
    this.props.socketStream.send(JSON.stringify(requestData));
    this.setState({protectHomeState: state});
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
        <View style={styles.robotViewStyle}>
          <View style={styles.pageHeader}>
            <Text style={styles.pageText}>Robot control</Text>
          </View>
          <View style={styles.pageContent}>
            <View style={styles.robotSwitches}>
              <View>
                <Text style={styles.pageText}>Home Protection: </Text>
              </View>
              <View>
                <Switch onValueChange={(value)=>{this.protectHome(value);}} value = {this.state.protectHomeState} disabled={!this.props.socketConnected} thumbTintColor='#fff' tintColor='#fff'/>
              </View>
              <View>
                <Text style={styles.pageText}>Autopilot: </Text>
              </View>
              <View>
                <Switch onValueChange={(value)=>{this.autopilot(value);}} value = {this.state.autopilotState} disabled={!this.props.socketConnected} thumbTintColor='#fff' tintColor='#fff'/>
              </View>            
            </View>
            <View style={styles.robotControlArrows}>
              <View>
                <TouchableWithoutFeedback 
                onPressIn={()=>this.move('left', true)} onPressOut={()=>this.move('left', false)} disabled={!this.props.socketConnected}>
                  <View style={styles.buttonLeft}>
                    <Text>
                      LEFT
                    </Text>
                  </View>
                </TouchableWithoutFeedback>      
              </View>
              <View>
                <TouchableWithoutFeedback 
                onPressIn={()=>this.move('up', true)} onPressOut={()=>this.move('up', false)} disabled={!this.props.socketConnected}>
                  <View style={styles.buttonUp}>
                    <Text>
                      UP
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback 
                onPressIn={()=>this.move('down', true)} onPressOut={()=>this.move('down', false)} disabled={!this.props.socketConnected}>
                  <View style={styles.buttonDown}>
                    <Text>
                      DOWN
                    </Text>
                  </View>
                </TouchableWithoutFeedback>  
              </View>
              <View>
                <TouchableWithoutFeedback 
                onPressIn={()=>this.move('right', true)} onPressOut={()=>this.move('right', false)} disabled={!this.props.socketConnected}>
                <View style={styles.buttonRight}>
                  <Text>
                    RIGHT
                  </Text>
                </View>
                </TouchableWithoutFeedback>
              </View>
            </View>
          </View>
        </View>
      );
  }
}

export class HomeProtectView extends Component{
  constructor(props){
    super(props);
    this.state= {questionText: null};
  }
  
  render(){
    return(
        <View>
          <View style={styles.pageHeader}>
            <Text style={styles.pageText}>Home protect view</Text>
          </View>
          <View style={styles.pageContent}>
            <Text style={styles.pageText}>In progress...</Text>
          </View>
        </View>
      );
  }
}

export class KitchenControlView extends Component{
  constructor(props){
    super(props);
    this.state= {kitchenLightState: false};
  }
  
  changeKitchenLight(state){
    console.log('Sending kitchenLight state: ', state);
    const requestData = {client: 'halClient', event: 'toggleKitchenLight', date: Date.now(), data:{state: state}};
    this.props.socketStream.send(JSON.stringify(requestData));
    this.setState({kitchenLightState: state});
  }
  
  getButtonTitle(){
    return this.state.kitchenLightState ? "Kitchen Light is ON" : "Kitchen Light is OFF";
  }

  getButtonStyle(){
    return this.state.kitchenLightState ? styles.buttonMediumOn : styles.buttonMediumOff;
  }
  
  render(){
    return(
        <View style={styles.kitchenControlViewStyle}>
          <View style={styles.pageHeader}>
            <Text style={styles.pageText}>Kitchen Control</Text>
          </View>
          <View style={styles.pageContent}>
            <View style={styles.kitchenControlButtons}>
              <TouchableWithoutFeedback
                onPress={()=>this.changeKitchenLight(!this.state.kitchenLightState)}
                disabled={!this.props.socketConnected}
              >
                <View style={styles.buttonMedium}>
                  <Text>
                    {this.getButtonTitle()}
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
    
AppRegistry.registerComponent('HalClient', () => HalClient);