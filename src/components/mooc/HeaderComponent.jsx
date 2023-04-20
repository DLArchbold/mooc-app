


import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import AuthenticationService from './AuthenticationService.js'
class HeaderComponent extends Component {
    render() {

        const isUserLoggedIn = AuthenticationService.isUserLoggedIn();
        console.log(isUserLoggedIn);
        return (
            <header>
                <nav className="navbar navbar-expand-md navbar-dark bg-dark">
                    <div><a href="" className="navbar-brand">MOOC Application</a></div>
                    <ul className="navbar-nav navbar-collapse justify-content-start">
                        {isUserLoggedIn && <li ><Link className="nav-link" to="/welcome/cs8803">Home</Link></li>}
                        {isUserLoggedIn && <li ><Link className="nav-link" to="/comments">Comments</Link></li>}
                        {isUserLoggedIn && <li ><Link className="nav-link" to="/feedbacks">Feedback</Link></li>}
                        {isUserLoggedIn && <li ><Link className="nav-link" to="/students">Search Students</Link></li>}
                        {isUserLoggedIn && <li ><Link className="nav-link" to="/lesson">Lesson</Link></li>}
                        {isUserLoggedIn && <li ><Link className="nav-link" to="/lesson-2">Lesson 2</Link></li>}
                        {isUserLoggedIn && <li ><Link className="nav-link" to="/listallcourses">List all courses</Link></li>}
                    </ul>
                    <ul className="navbar-nav navbar-collapse justify-content-end">
                        {isUserLoggedIn && <li ><Link className="nav-link" to="/profilepage">Profile Page</Link></li>}
                        {isUserLoggedIn && <li ><Link className="nav-link" to="/createLesson">Create Lesson</Link></li>}
                        {isUserLoggedIn && <li ><Link className="nav-link" to="/createCourse">Create Course</Link></li>}
                        {!isUserLoggedIn && <li ><Link className="nav-link" to="/login">Login</Link></li>}
                        {!isUserLoggedIn && <li ><Link className="nav-link" to="/register">Register</Link></li>}
                        {isUserLoggedIn && <li ><Link className="nav-link" to="/logout" onClick={AuthenticationService.logout}>Logout</Link></li>}
                    </ul>
                </nav>
            </header>
        )
    }
}
export default HeaderComponent