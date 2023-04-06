import React, { Component } from 'react'
//import { Route, Redirect } from 'react-router-dom' //REACT-5
import AuthenticationService from './AuthenticationService.js'
import { Formik, Field, Form, ErrorMessage } from 'formik'
import '../../RegisterComponent.css'


class RegisterComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: 'student1@gmail.com',
            password: 'student1',
            hasLoginFailed: false,
            showSuccessMessage: false,
            noUserFound: false,
            authenticated: false,
            registerEmail: '',
            defaultPassword: ''
        }

        // this.handleEmailChange = this.handleEmailChange.bind(this)
        // this.handlePasswordChange = this.handlePasswordChange.bind(this)
        this.handleChange = this.handleChange.bind(this)
        
        this.onSubmitRegister = this.onSubmitRegister.bind(this)
        this.displayRegisterForm = this.displayRegisterForm.bind(this)
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
            <div className='RegisterMain'>
                <h1>Please register a new account</h1>
                <div className="container"></div>
               

                {this.state.showSuccessMessage && <div className="alert alert-success register">Successfully registered {this.state.email}</div>}
                {this.displayRegisterForm()}

            </div>

        )
    }

    displayRegisterForm() {
        let { registerEmail, registerPassword } = this.state

        return (


            <div className='actualForm'>

                <Formik

                    initialValues={{ registerEmail, registerPassword }}
                    onSubmit={this.onSubmitRegister}
                    validateOnBlur={false}
                    validateOnChange={false}
                    // validate={this.validate}
                    enableReinitialize={true}
                >
                    {
                        (props) => (
                            <Form className='registerForm'>
                                <ErrorMessage name="registerEmail" component="div"
                                    className="alert alert-warning" />
                                {/* <ErrorMessage name="inResponseTo" component="div"
            className="alert alert-warning" /> */}
                                



                                <fieldset className="form-group">
                                    <label>Email/username</label>
                                    <Field className="form-control" type="text" name="registerEmail" />
                                </fieldset>

                                <fieldset className="form-group">
                                    <label>Password</label>
                                    <Field className="form-control" type="text" name="registerPassword" />
                                </fieldset>

                                <fieldset className="form-group">
                                    <label>User type</label>
                                    <Field
                                        className="form-control"
                                        as="select"
                                        // onChange={this.onItemTypeDropdownSelected}
                                        name="registerUserType"
                                    >
                                        <option value="2">Student</option>
                                        <option value="1">Instructor</option>
                                    </Field>
                                </fieldset> 


                                <button className="btn btn-success register" type="submit">Register account</button>
                            </Form>
                        )
                    }
                </Formik>
            </div>



        )
    }

    onSubmitRegister(values) {

        let applicationUser = {
            email:values.registerEmail,
            password: values.registerPassword,
            userType : values.registerUserType == 1? "instructor":"student"
        }

        // console.log(values.registerEmail + "x" + values.registerPassword)
        AuthenticationService.createUser(applicationUser
        ).then(
            //When successfully created user
            () => {
                // this.props.navigate("/comments")
                this.setState({
                showSuccessMessage:true,
                email:applicationUser['email']});

                console.log("Successfully created user " + applicationUser['email'])

            }



        ).catch(
            error => this.setState({
                successMessage: error.response.data.message
            })
        )
      
    }

}





export default RegisterComponent