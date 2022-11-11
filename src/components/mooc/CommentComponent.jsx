import React, { Component } from 'react'
import { Formik, Field, Form, ErrorMessage } from 'formik'
import moment from 'moment/moment'

import AuthenticationService from './AuthenticationService'
import CommentDataService from '../../api/comment/CommentDataService.js'

class CommentComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            id: this.props.params.id,
            description: "",
            inResponseTo: "",
            targetDate: moment(new Date()).format('YYYY-MM-DD'),
            username: ""
        }

        this.onSubmit = this.onSubmit.bind(this)
        this.validate = this.validate.bind(this)
    }

    //When Updating(PUT) or Creating(POST) comments
    onSubmit(values) {
        console.log("in onSubmit")
        

        console.log("state.id " + this.state.id);
        if (this.state.id == -1) {
            console.log("in create " + AuthenticationService.getLoggedInUserName())

            CommentDataService.createComment(this.state.username, {
                //Use state values for those which are carried over from ListComments
                //Use values. if obtained from Formik.
                //
                // id: this.state.id,
                description: values.description,
                urgencyLevel: 3,
                inResponseTo: values.inResponseTo,
                targetDate: this.state.targetDate,
                username: AuthenticationService.getLoggedInUserName()
            }).then(
                //When successfully added redirect user to list all Comments
                () => {
                    this.props.navigate("/comments")
                }

            )
        } else {
            console.log("in update")
            CommentDataService.updateComment(this.state.username, this.state.id, {
                //Use state values for those which are carried over from ListComments
                //Use values. if obtained from Formik.
                //
                id: this.state.id,
                description: values.description,
                inResponseTo: values.inResponseTo,
                targetDate: this.state.targetDate,
                username: AuthenticationService.getLoggedInUserName
            }).then(
                //When successfully update redirect user to list all Comments
                () => {
                    this.props.navigate("/comments")
                }

            )
        }
        
    }

    componentDidMount() {

        this.setState({
            username: AuthenticationService.getLoggedInUserName()
        })
        // console.log("in componentDidMount")
        //If it's adding a Comment then no need retrieve
        if (this.state.id == -1) {
            //remember to use this.props.navigate(`/comments/${id}`) when navigating from elsewhere since 
            //ID will be in this.state will be treated as string "-1" instead of integer -1. Use only ==
            //instead of === operator.
            // console.log("in CommentComponent.componentDidMount(), State id is " + this.state.id  )
            return
        }

        let retrievedUsername = AuthenticationService.getLoggedInUserName()
        CommentDataService.retrieveComment(retrievedUsername, this.state.id)
            .then(
                response => this.setState({
                    description: response.data.description,
                    inResponseTo: response.data.inResponseTo,
                    username: retrievedUsername
                }
                ))


    }

    //Validation on form fields
    validate(values) {
        let errors = {}
        if (!values.description) {
            errors.description = "Enter a description"
        } else if (values.description.length < 5) {
            errors.description = "Enter at least 5 characters in description"
        }

        //IMPORTANT!!!!!!!!!!!!!!!!!
        //DO CHECK FOR NUMBERS FOR INRESPONSETO FIELD


        //
        // if (values.inResponseTo.length < 10) {
        //     errors.inResponseTo = "Enter a valid name of person that you're responding to"

        // }


        return errors
    }

    render() {
        //unpacking feature in javascript, let keys equal to dict name and it will unpack to assign 
        //keys to values individually automatically
        let { description, inResponseTo } = this.state

        return (
            <div>
                <h1>Comment</h1>
                <div className="container">
                    <Formik
                        initialValues={{ description, inResponseTo }}
                        onSubmit={this.onSubmit}
                        validateOnBlur={false}
                        validateOnChange={false}
                        validate={this.validate}
                        enableReinitialize={true}
                    >
                        {
                            (props) => (
                                <Form>
                                    <ErrorMessage name="description" component="div"
                                        className="alert alert-warning" />
                                    <ErrorMessage name="inResponseTo" component="div"
                                        className="alert alert-warning" />


                                    <fieldset className="form-group">
                                        <label>Description</label>
                                        <Field className="form-control" type="text" name="description" />
                                    </fieldset>

                                    <fieldset className="form-group">
                                        <label>In response to</label>
                                        <Field className="form-control" type="number" name="inResponseTo" />
                                    </fieldset>
                                    <button className="btn btn-success" type="submit">Save</button>
                                </Form>
                            )
                        }

                    </Formik>
                </div>
            </div>
        )
    }

}


export default CommentComponent