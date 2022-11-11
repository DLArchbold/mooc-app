import React, { Component } from 'react'
import { Link} from 'react-router-dom'
import HelloWorldService from "../../api/comment/HelloWorldService.js"
import AuthenticationService from './AuthenticationService.js'


class WelcomeComponent extends Component{

    constructor(props){
            super(props)
            this.retrieveWelcomeMessage= this.retrieveWelcomeMessage.bind(this) 
            this.state={
                welcomeMessage:''
            }
            this.handleSuccessfulResponse = this.handleSuccessfulResponse.bind(this)
            this.handleError = this.handleError.bind(this)
    }

    render() {
        return (
            <>
                <h1>Welcome!</h1>
                <div className="container">
                Welcome {AuthenticationService.getLoggedInUserName()}. 
                View all instructor comments <Link to="/comments">here</Link>.
                </div>

                <div className="container">
                Click here to get a customized welcome message. 
                <button onClick={this.retrieveWelcomeMessage} className="btn btn-success">Get welcome message</button>
                </div>

                <div className="container">
                    {this.state.welcomeMessage}

                </div>
            </>
            
        )        
    }

    retrieveWelcomeMessage(){
        // HelloWorldService.executeHelloWorldService()
        // .then(response => this.handleSuccessfulResponse(response))
        // HelloWorldService.executeHelloWorldBeanService()
        // .then(response => this.handleSuccessfulResponse(response))
        HelloWorldService.executeHelloWorldPathVariableService(this.props.params.name)
        .then(response => this.handleSuccessfulResponse(response))
        .catch(error => this.handleError(error))
    }

    handleSuccessfulResponse(response){
        console.log(response)
        this.setState({welcomeMessage: response.data.message})
    }

    handleError(error){
        console.log(error.response)
        this.setState({welcomeMessage: error.response.data.message})
    }

}
export default WelcomeComponent