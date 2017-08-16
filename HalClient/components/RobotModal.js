import React, { Component } from 'react';
import {Image, Text, View, Modal, TouchableHighlight, TouchableWithoutFeedback} from 'react-native';

export default class RobotModal extends Component {
    constructor(props){
        super(props);
        this.state{moveDirection:null, moveState:null};
    }

    move(direction, state){
      const requestData = {client: 'halClient', event: 'move', date: Date.now(), data:{direction:direction, state: state}};
      console.log('Move: ',requestData);
      this.props.socketStream.send(JSON.stringify(requestData));
      this.setState({moveDirection: direction, moveState: state});
    }
    
    pressHideModal(){
        this.props.setRobotModalVisible(false);
    }

    render(){
        return(
          <View style={{marginTop: 22}}>
            <Modal
              animationType={"slide"}
              transparent={false}
              visible={this.props.robotModalVisible}
              onRequestClose={() => {alert("Modal has been closed.")}}
              >
             <View style={{marginTop: 22}}>
              <View>
                <View style={{flexDirection:'row'}}>
                  <TouchableWithoutFeedback 
                  onPressIn={()=>this.props.move('up', true)} onPressOut={()=>this.move('up', false)} disabled={!this.props.socketConnected}>
                    <View style={styles.button}>
                      <Text>
                        UP
                      </Text>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
                <View style={{flexDirection:'row'}}>
                  <TouchableWithoutFeedback 
                  onPressIn={()=>this._move('left', true)} onPressOut={()=>this.move('left', false)} disabled={!this.props.socketConnected}>
                    <View style={styles.buttonLeft}>
                      <Text>
                        LEFT
                      </Text>
                    </View>
                  </TouchableWithoutFeedback>      
                  <TouchableWithoutFeedback 
                  onPressIn={()=>this._move('right', true)} onPressOut={()=>this.move('right', false)} disabled={!this.props.socketConnected}>
                  <View style={styles.buttonRight}>
                  <Text>
                  RIGHT
                  </Text>
                  </View>
                  </TouchableWithoutFeedback>
                </View>
                <View style={{flexDirection:'row'}}>
                    <TouchableWithoutFeedback 
                    onPressIn={()=>this._move('down', true)} onPressOut={()=>this.move('down', false)} disabled={!this.props.socketConnected}>
                      <View style={styles.button}>
                        <Text>
                          DOWN
                        </Text>
                      </View>
                    </TouchableWithoutFeedback>  
                </View>
                <TouchableHighlight onPress={() => {
                  this.pressHideModal();
                }}>
                  <Text>Hide Modal</Text>
                </TouchableHighlight>
              </View>
             </View>
            </Modal>
          </View>
          )
    }
}

const styles = StyleSheet.create({
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