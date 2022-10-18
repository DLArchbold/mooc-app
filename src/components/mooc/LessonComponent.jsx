import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Formik, Field, Form, ErrorMessage } from 'formik'
import moment from 'moment/moment'
import AuthenticationService from './AuthenticationService'
import CommentDataService from '../../api/comment/CommentDataService.js'


class LessonComponent extends Component {

    constructor(props) {
        super(props)
        this.retrieveWelcomeMessage = this.retrieveWelcomeMessage.bind(this)
        this.state = {
            welcomeMessage: '',
            addComment: new Boolean(false),
            description: "",
            targetDate: moment(new Date()).format('YYYY-MM-DD'),
            username: "",
            successMessage: "",
            comments: []
        }
        this.handleSuccessfulResponse = this.handleSuccessfulResponse.bind(this)
        this.handleError = this.handleError.bind(this)
        this.enableCommentForm = this.enableCommentForm.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.validate = this.validate.bind(this)
    }

    render() {

        let { description } = this.state

        return (
            <>
                <h1>Lesson</h1>
                <div className="container">
                    <img src={require('../../document.PNG')} height={700} width={600} />

                </div>
                <div className="container">

                    <button onClick={this.enableCommentForm} className="btn ">Add Comment</button>
                </div>

                <div className="container" >
                    <br></br>
                </div>


                {this.state.successMessage !== "" && (<div className="alert alert-success">
                    {this.state.successMessage}
                </div>)}




                {this.state.addComment !== false && (<div className="container">


                    <Formik
                        initialValues={{ description }}
                        onSubmit={this.onSubmit}
                        validateOnBlur={false}
                        validateOnChange={false}
                        // validate={this.validate}
                        enableReinitialize={true}
                    >
                        {
                            (props) => (
                                <Form>
                                    <ErrorMessage name="description" component="div"
                                        className="alert alert-warning" />
                                    {/* <ErrorMessage name="inResponseTo" component="div"
                                        className="alert alert-warning" /> */}


                                    <fieldset className="form-group">
                                        <label>Comment Description</label>
                                        <Field className="form-control" type="text" name="description" />
                                    </fieldset>

                                    {/* <fieldset className="form-group">
                                        <label>In response to</label>
                                        <Field className="form-control" type="number" name="inResponseTo" />
                                    </fieldset> */}
                                    <button className="btn btn-success" type="submit">Save</button>
                                </Form>
                            )
                        }

                    </Formik>
                </div>
                )}

                <div>
                    {
                        this.state.comments.map(
                            comment =>
                                <div className="card-body" align="left">
                                     <h5 className="card-title"> {comment.username} </h5>
                                    

                                    <p className="card-text">{comment.description}</p>
                                    <button className="btn btn-primary btn-sm">Reply to comment</button>
                                   <div>
                                    <br></br>
                                    </div>
                                </div>


                        )
                    }
                </div>
            </>

        )
    }

    enableCommentForm() {
        this.setState({
            addComment: !this.state.addComment
        })
    }

    componentDidMount() {

        //Hide comment form when refreshing/first landing on this page
        this.setState({
            addComment: false
        })

        // //If it's adding a Comment then no need retrieve
        // if (this.state.id === -1) {
        //     return
        // }

        // let username = AuthenticationService.getLoggedInUserName()
        // CommentDataService.retrieveComment(username, this.state.id)
        //     .then(
        //         response => this.setState({
        //             description: response.data.description,
        //             inResponseTo: response.data.inResponseTo
        //         }
        //         ))

        console.log("componentDidMount")
        this.refreshComments();
        console.log(this.state)
    }

    refreshComments() {
        let username = AuthenticationService.getLoggedInUserName()
        CommentDataService.retrieveAllComments(username)
            .then(
                response => {
                    // console.log(response)
                    this.setState({ comments: response.data })
                }

            )
    }



    //When Updating(PUT) or Creating(POST) comments
    onSubmit(values) {
        let username = AuthenticationService.getLoggedInUserName()
        // console.log("state.id" + this.state.id);
        if (true) {
            console.log("username: " + username)
            console.log("replying to lesson")
            CommentDataService.createComment(username, {
                //Use state values for those which are carried over from ListComments
                //Use values. if obtained from Formik.
                //
                id: -1,
                description: values.description,
                inResponseTo: 0, //Set inResponseTo to 0 for all top-level replies to a lesson; vary when replying to a comment
                targetDate: this.state.targetDate,
                username: this.state.username
            }).then(
                //When successfully update redirect user to list all Comments
                () => {
                    // this.props.navigate("/comments")
                    console.log("add lesson comment success")
                    this.setState({
                        successMessage: "Add lesson comment success"
                    })
                    this.componentDidMount()
                }

            ).catch(
                error => this.setState({
                    successMessage: error.response.data.message
                })
            )
        }
        // else {
        //     //implement later
        //     console.log("replying to comment")
        //     CommentDataService.updateComment(username, this.state.id, {
        //         //Use state values for those which are carried over from ListComments
        //         //Use values. if obtained from Formik.
        //         //
        //         id: this.state.id,
        //         description: values.description,
        //         inResponseTo: values.inResponseTo,
        //         targetDate: this.state.targetDate,
        //         username: this.state.username
        //     }).then(
        //         //When successfully update redirect user to list all Comments
        //         () => {
        //             this.props.navigate("/comments")
        //         }

        //     )
        // }
        console.log("in onValidate")
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







    retrieveWelcomeMessage() {
        // HelloWorldService.executeHelloWorldService()
        // .then(response => this.handleSuccessfulResponse(response))
        // HelloWorldService.executeHelloWorldBeanService()
        // .then(response => this.handleSuccessfulResponse(response))
        HelloWorldService.executeHelloWorldPathVariableService(this.props.params.name)
            .then(response => this.handleSuccessfulResponse(response))
            .catch(error => this.handleError(error))
    }

    handleSuccessfulResponse(response) {
        console.log(response)
        this.setState({ welcomeMessage: response.data.message })
    }

    handleError(error) {
        console.log(error.response)
        this.setState({ welcomeMessage: error.response.data.message })
    }

}
export default LessonComponent