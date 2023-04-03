import React, { Component } from 'react'
//import { Route, Redirect } from 'react-router-dom' //REACT-5
import AuthenticationService from './AuthenticationService.js'


class LoginComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: 'student1@gmail.com',
            password: 'student1',
            hasLoginFailed: false,
            showSuccessMessage: false,
            noUserFound: false,
            authenticated: false
        }

        // this.handleEmailChange = this.handleEmailChange.bind(this)
        // this.handlePasswordChange = this.handlePasswordChange.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.loginClicked = this.loginClicked.bind(this)

    }


    loginClicked() {

        let applicationUser = {

            email: this.state.email,
            password: this.state.password
        }

        AuthenticationService.checkIfApplicationUserExists(applicationUser)
            .then(
                response => {
                    if (response != undefined) {
                        console.log("User found!")
                        // console.log(response.data['email'])

                        AuthenticationService.authenticateApplicationUser(applicationUser)
                            .then(
                                response => {
                                    if (response != undefined) {
                                        console.log("Authenticated")
                                        this.setState({ showSuccessMessage: true })
                                        // this.setState({ hasLoginFailed: false })
                                        this.setState({authenticated:true})

                                        AuthenticationService.registerSuccessfulLogin(this.state.email, this.state.password)
                                        // this.props.history.push("/welcome")
                                        //use ticks not single quotes
                                        this.props.navigate(`/welcome/${this.state.email}`)
                                    } else {
                                        console.log("Incorrect email or password")
                                        this.setState({ showSuccessMessage: false })
                                        this.setState({ hasLoginFailed: true })
                                        this.setState({authenticated:true})
                                    }
                                }

                            )


                    } else {
                        console.log("User not found, create new user!")
                        this.setState({ showSuccessMessage: false })
                        this.setState({ hasLoginFailed: true })
                        this.setState({ noUserFound: true })
                        this.setState({authenticated:true})
                    }


                }

            )
  

        // if(this.state.authenticated == true){
        //    AuthenticationService.registerSuccessfulLogin(this.state.email, this.state.password)
        //     // this.props.history.push("/welcome")
        //     //use ticks not single quotes
        //     this.props.navigate(`/welcome/${this.state.email}`)
        //     // console.log('Successful')
        //     // this.setState({showSuccessMessage:true})
        //     // this.setState({hasLoginFailed:false})


        // }
        // else{
        //     //  console.log('Failed') 
        //     this.setState({showSuccessMessage:false})
        //     this.setState({hasLoginFailed:true})
        // }
        console.log(this.state);
    }

    handleChange(event) {
        //console.log(this.state);
        this.setState(
            {
                [event.target.name]: event.target.value
            }
        )
    }
    // handlePasswordChange(event){
    //     console.log(event.target.value);
    //     this.setState({password :event.target.value})    
    // }
    render() {
        return (
            <div>
                <h1>Login</h1>
                <div className="container"></div>
                {/* <ShowInvalidCredentials hasLoginFailed={this.state.hasLoginFailed} /> */}
                {this.state.hasLoginFailed && <div className="alert alert-warning">Invalid Credentials</div>}
                {this.state.noUserFound && <div className="alert alert-warning">No user found, please register</div>}
                {/* <ShowLoginSuccessMessage showSuccessMesage={this.state.showSuccessMessage}/> */}
                {this.state.showSuccessMessage && <div>Login Succesful</div>}
                User Name:<input type="text" name="email" value={this.state.email} onChange={this.handleChange} />
                <br></br>
                <br></br>
                Password:<input type="password" name="password" value={this.state.password} onChange={this.handleChange} />
                <button className="btn btn-success" onClick={this.loginClicked}>Login</button>
            </div>
        )
    }



}

export default LoginComponent