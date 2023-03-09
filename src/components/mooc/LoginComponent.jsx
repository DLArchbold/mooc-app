import React, { Component } from 'react'
//import { Route, Redirect } from 'react-router-dom' //REACT-5
import AuthenticationService from './AuthenticationService.js'


class LoginComponent extends Component {
    constructor(props){
        super(props)
        this.state={
            username: 'Instructor 1',
            password:'',
            hasLoginFailed: false,
            showSuccessMessage:false
        }

        // this.handleUsernameChange = this.handleUsernameChange.bind(this)
        // this.handlePasswordChange = this.handlePasswordChange.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.loginClicked=this.loginClicked.bind(this)
        
    }


    loginClicked(){

        

        if((this.state.username==='Instructor 1' && this.state.password==='') 
        || (this.state.username === 'Student 1' && this.state.password === '')){
           AuthenticationService.registerSuccessfulLogin(this.state.username, this.state.password)
            // this.props.history.push("/welcome")
            //use ticks not single quotes
            this.props.navigate(`/welcome/${this.state.username}`)
            // console.log('Successful')
            // this.setState({showSuccessMessage:true})
            // this.setState({hasLoginFailed:false})
            
            
        }
        else{
            //  console.log('Failed') 
            this.setState({showSuccessMessage:false})
            this.setState({hasLoginFailed:true})
        }
        console.log(this.state);
    }

    handleChange(event){
        //console.log(this.state);
        this.setState(
            {
                [event.target.name]:event.target.value
            }
        )    
    }
    // handlePasswordChange(event){
    //     console.log(event.target.value);
    //     this.setState({password :event.target.value})    
    // }
    render(){
        return(
            <div>
                <h1>Login</h1>
                <div className="container"></div>
                {/* <ShowInvalidCredentials hasLoginFailed={this.state.hasLoginFailed} /> */}
                {this.state.hasLoginFailed && <div className="alert alert-warning">Invalid Credentials</div>}
               {/* <ShowLoginSuccessMessage showSuccessMesage={this.state.showSuccessMessage}/> */}
               {this.state.showSuccessMessage&& <div>Login Succesful</div>}
                User Name:<input type ="text" name ="username" value={this.state.username} onChange={this.handleChange}/>
                Password:<input type ="password" name ="password" value={this.state.password} onChange={this.handleChange}/>
                <button className="btn btn-success" onClick={this.loginClicked}>Login</button>
            </div>
        )
    }


    
}

export default LoginComponent