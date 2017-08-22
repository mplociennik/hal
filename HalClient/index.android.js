import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import Main from './components/Main';

export default class HalClient extends Component {
  render() {
    return (
      <Main></Main>
    );
  }
}
    
AppRegistry.registerComponent('HalClient', () => HalClient);