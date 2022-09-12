import React, {Component} from 'react'
import {BrowserRouter as Router, Route, Switch, Link, Routes} from 'react-router-dom'
import withNavigation from './WithNavigation.jsx'
import withParams from './WithParams.jsx'
import AuthenticationService from './AuthenticationService.js'


class MoocApp extends Component{
    render(){
        const LoginComponentWithNavigation = withNavigation(LoginComponent);
        const WelcomeComponentWithParams = withParams(WelcomeComponent);
        const HeaderComponentWithNavigation = withNavigation(HeaderComponent);
       
        const isUserLoggedIn= AuthenticationService.isUserLoggedIn();
        console.log(isUserLoggedIn);

        return(
            <div className="MoocApp">
                <Router>
                    
                <HeaderComponentWithNavigation/>
                    <Routes>
                        <Route path="/"  element={<LoginComponentWithNavigation/>}/>
                        <Route path="/login" element={<LoginComponentWithNavigation/>}/>
                        <Route path="/welcome/:name" element={<WelcomeComponentWithParams />} />
                        <Route path="/comments" element={<ListCommentsComponent />} />
                        <Route path="/logout" element={<LogoutComponent />} />
                        <Route path="*" element={<ErrorComponent />} />
                      </Routes>
                      <FooterComponent/>
                </Router>
                
                {/* <LoginComponent/>
                <WelcomeComponent/> */}
            </div>
        )
    }
}

class HeaderComponent extends Component{
    render(){

        const isUserLoggedIn= AuthenticationService.isUserLoggedIn();
        console.log(isUserLoggedIn); 
        return(
            <header>
                <nav className="navbar navbar-expand-md navbar-dark bg-dark">
                    <div><a href="" className="navbar-brand">CS 8803</a></div>
                    <ul className="navbar-nav">
                        {isUserLoggedIn && <li ><Link className="nav-link" to="/welcome/cs8803">Home</Link></li>}
                        {isUserLoggedIn && <li ><Link className="nav-link"to="/comments">Comments</Link></li>}
                    </ul>
                    <ul className="navbar-nav navbar-collapse justify-content-end">
                        {!isUserLoggedIn && <li ><Link className="nav-link" to="/login">Login</Link></li>}
                        {isUserLoggedIn && <li ><Link className="nav-link" to="/logout" onClick={AuthenticationService.logout}>Logout</Link></li>}
                    </ul>
                </nav>
            </header>
        )
    }
}

class LogoutComponent extends Component {
    render() {
        return (
            <>
                <h1>You are logged out</h1>
                <div className="container">
                    Thank You for Using Our Application.
                </div>
            </>
        )
    }
}

class FooterComponent extends Component {
    render() {
        return (
            <footer className="footer">
                <span className="text-muted">CS 8803 - Wei Jin </span>
            </footer>
        )
    }
}

function ErrorComponent() {
    return <div>An Error Occurred, invalid URL.</div>
}

class ListCommentsComponent extends Component{
    constructor(props){
        super(props)
        this.state={
            comments:
            [
                {id:1, description: 'Learn React', inResponse:0, targetDate:new Date},
                {id:2, description: 'Test comment 2',  inResponse:1, targetDate:new Date},
                {id:3, description: 'Test comment 3', inResponse:2, targetDate:new Date}
            ]
        }
    }
    render(){
        return(
        
        <div>
            <h1>List Comments</h1>
            <div className="container">
            <table className="table">
                <thead>
                    <tr>
                        <th>id</th>
                        <th>description</th>
                        <th>in response to comment</th>
                        <th>Target Date</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        this.state.comments.map(
                            comment =>
                            <tr key = {todo.id}>
                        <td>{comment.id}</td>
                        <td>{comment.description}</td>
                        <td>{comment.inResponse}</td>
                        <td>{comment.targetDate.toString()}</td>
                    </tr>
                        )
                    }
                </tbody>
            </table>
            </div>
        </div>
        )
    }
    
}


class WelcomeComponent extends Component{
    render() {
        return (
            <>
                <h1>Welcome!</h1>
                <div className="container">
                Welcome {this.props.params.name}. View all instructor comments <Link to="/comments">here</Link>.
                </div>
            </>
            
        )        
    }
}


class LoginComponent extends Component {
    constructor(props){
        super(props)
        this.state={
            username: 'cs8803',
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

        if(this.state.username==='cs8803' && this.state.password==='weijin'){
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

// function ShowInvalidCredentials(props){
//     if(props.hasLoginFailed){
//         return <div>Invalid Credentials</div>    
//     }
//     return null
// }

// function ShowLoginSuccessMessage(props){
//     if(props.showSuccessMesage){
//         return <div>Login Successful</div>
//     }
//     return null 
// }

export default MoocApp