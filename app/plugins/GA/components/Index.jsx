import React from 'react';
import GA from '../plugin/GA';

let ga = new GA();

console.log(ga.run());


export default class Index extends React.Component { 
  render() {
    return(<div>Welcome to Hell o</div>);
  }
}