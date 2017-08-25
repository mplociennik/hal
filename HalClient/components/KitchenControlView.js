import React, { Component } from 'react';
import {Text, View, TouchableWithoutFeedback, StyleSheet, Dimensions} from 'react-native';

var windowWidth = Dimensions.get('window').width;
var windowHeight = Dimensions.get('window').height;

export default class KitchenControlView extends Component{
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