import React, { Component } from 'react'
import { Link} from 'react-router-dom'



class LessonComponent extends Component{

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
                <h1>Lesson</h1>
                <div className="container">
                    <img src = {require('../../document.PNG')} height= {700} width={600}/>

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
export default LessonComponent