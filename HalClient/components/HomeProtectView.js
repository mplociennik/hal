import React, { Component } from 'react';
import {Text, View, StyleSheet} from 'react-native';

export default class HomeProtectView extends Component{
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