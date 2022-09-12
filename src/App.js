import React, { Component } from 'react';
import FirstComponent from './components/learning-examples/FirstComponent'
import SecondComponent from './components/learning-examples/SecondComponent'
import ThirdComponent from './components/learning-examples/ThirdComponent'
import Counter from './components/counter/Counter'
import MoocApp from './components/mooc/MoocApp';
import logo from './logo.svg';
import './App.css';
import './bootstrap.css'
 
class App extends Component {
  render() {
    return (
      <div className='App'>
      {/*<Counter/>*/}
         <MoocApp/>
      </div>
    );
  }
} 

class LearningComponents extends Component{
  render() {
    return (
      <div className="LearningComponents">
       My Hello World 
       <FirstComponent></FirstComponent>
       <SecondComponent></SecondComponent>
       <ThirdComponent></ThirdComponent>
      </div>
    );
  }
}



 

export default App;