import React, { Component } from 'react';
import {Image, Text} from 'react-native';

export default class CameraImage extends Component {
    constructor(props){
        super(props);
    }

    render(){
        if(this.props.image !== null){
          const renderedImage = 'data:image//png;base64,' + this.props.image;
          return(
            <Image source={{uri: renderedImage}} style={{width:350, height:250}}/>
            );
        }else{
          return (
            <Text>Receiving image...</Text>
            );
        }
    }
}