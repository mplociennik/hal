import React, { Component } from 'react';
import {Text, View, TouchableWithoutFeedback, Switch, Alert, Vibration, StyleSheet, Dimensions, Button, TextInput} from 'react-native';
import FontAwesome, { Icons } from 'react-native-fontawesome';

var windowWidth = Dimensions.get('window').width;
var windowHeight = Dimensions.get('window').height;


export default class RobotView extends Component{
  constructor(props){
    super(props);
    this.state= {protectHomeState: false, autopilotState:false, moveDirection:null, moveState:false, textToSpeech:'Hi, I am Hal. I am from future and I want to help in human life. I have distributed system who is responsible for speech, move, home protect and control inteligent home. How Can I help You?'};
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

  speechText(){
    console.log('Sending robotSpeech text: ', this.state.textToSpeech);
    const requestData = {client: 'halClient', event: 'robotSpeechText', date: Date.now(), data:{text: this.state.textToSpeech}};
    this.props.socketStream.send(JSON.stringify(requestData));
    this.setState({textToSpeech: ''});
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
            <View>
              <TextInput style={{height: 40, borderColor: 'gray', borderWidth: 1}} onChangeText={(text) => this.setState({textToSpeech: text})} value={this.state.textToSpeech}
              />
              <Button title="Speech text" onPress={()=>this.speechText()}/>
            </View>
            <View style={styles.robotControlArrows}>
              <View>
                <TouchableWithoutFeedback 
                onPressIn={()=>this.move('left', true)} onPressOut={()=>this.move('left', false)} disabled={!this.props.socketConnected}>
                  <View style={styles.buttonLeft}>
                    <Text>
                    <FontAwesome>
                    {Icons.chevronLeft}
                    </FontAwesome>
                    </Text>
                  </View>
                </TouchableWithoutFeedback>      
              </View>
              <View>
                <TouchableWithoutFeedback 
                onPressIn={()=>this.move('up', true)} onPressOut={()=>this.move('up', false)} disabled={!this.props.socketConnected}>
                  <View style={styles.buttonUp}>
                    <Text style={styles.ArrowUp}>
                      <FontAwesome>
                        {Icons.chevronUp}
                      </FontAwesome>
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback 
                onPressIn={()=>this.move('down', true)} onPressOut={()=>this.move('down', false)} disabled={!this.props.socketConnected}>
                  <View style={styles.buttonDown}>
                    <Text>
                      <FontAwesome>
                        {Icons.chevronDown}
                      </FontAwesome>
                    </Text>
                  </View>
                </TouchableWithoutFeedback>  
              </View>
              <View>
                <TouchableWithoutFeedback 
                onPressIn={()=>this.move('right', true)} onPressOut={()=>this.move('right', false)} disabled={!this.props.socketConnected}>
                <View style={styles.buttonRight}>
                  <Text>
                    <FontAwesome>
                      {Icons.chevronRight}
                    </FontAwesome>
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