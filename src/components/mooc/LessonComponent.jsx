import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Formik, Field, Form, ErrorMessage } from 'formik'
import moment from 'moment/moment'
import AuthenticationService from './AuthenticationService'
import CommentDataService from '../../api/comment/CommentDataService.js'
import parse from 'html-react-parser';
import CommentComponent from './CommentComponent'

class LessonComponent extends Component {

    constructor(props) {
        super(props)
        this.retrieveWelcomeMessage = this.retrieveWelcomeMessage.bind(this)
        this.state = {
            welcomeMessage: '',
            addComment: Boolean(false),
            addCommentReply: Boolean(false),
            inResponseTo: '',
            description: "",
            targetDate: moment(new Date()).format('YYYY-MM-DD'),
            username: "",
            successMessage: "",
            comments: [],
            hasReplies: Boolean(false)
        }
        this.handleSuccessfulResponse = this.handleSuccessfulResponse.bind(this)
        this.handleError = this.handleError.bind(this)
        this.enableCommentForm = this.enableCommentForm.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.validate = this.validate.bind(this)
        this.displayNestedReplies = this.displayNestedReplies.bind(this)
    }

    render() {

        let { description } = this.state
        let currentTopLevelCommentID = 0
        let hasReplies = false
        return (
            <>
                <h1>Lesson</h1>
                <div className="container">
                    <img src={require('../../document.PNG')} height={700} width={600} align="center" />

                </div>
                <div className="container">

                    <button onClick={() =>
                        this.enableCommentForm(null)} className="btn ">Comment on this video</button>
                </div>

                <div className="container" >
                    <br></br>
                </div>


                {this.state.successMessage !== "" && (<div className="alert alert-success">
                    {this.state.successMessage}
                </div>)}



                {/* {Comment form to reply to lesson} */}
                {this.state.addComment === true && (<div className="container">


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
                                    <button className="btn btn-success" type="submit">Add comment to lesson</button>
                                </Form>
                            )
                        }

                    </Formik>
                </div>
                )}

                <div>
                    {/* Unpack each comment on this video to a div card  */}

                    {
                        this.state.comments.map(
                            comment =>
                                <>
                                    {/* Only display comments for lesson for top level  */}
                                    {comment.inResponseTo === 0 &&
                                        (<div className="card-body" align="center" key={comment.id}>
                                            {/* {console.log("inResponseTo: " + comment.inResponseTo)} */}
                                            <br></br><br></br><br></br>
                                            {(currentTopLevelCommentID = comment.id)}
                                            <h5 className="card-title"> {comment.username} - (comment id: {comment.id})</h5>
                                            <p className="card-text">{comment.description}</p>
                                            <button className="btn btn-primary btn-sm" onClick={() =>
                                                this.enableCommentForm(comment.id)}>Reply to above comment</button>
                                            <div>
                                                <br></br>
                                            </div>

                                            {(this.state.addCommentReply === true && this.state.inResponseTo == comment.id) &&
                                                (<div className="container">

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
                                                                    <button className="btn btn-success" type="submit">Reply</button>
                                                                </Form>
                                                            )
                                                        }

                                                    </Formik>
                                                </div>
                                                )
                                            }





                                        </div>






                                        )

                                    }


                                    {/*Displaying only 2nd level comments that reply to top-level comments */}
                                    {(() => {
                                        if(comment.id == currentTopLevelCommentID){
                                            return this.displayNestedReplies(comment.id, 10);
                                        }
                                        
                                        //                                 if (comment.id == currentTopLevelCommentID) {
                                        //                                     var secondLevelComments = this.displayNestedReplies(currentTopLevelCommentID)
                                        //                                     // var combinedReplies = this.displayNestedReplies(comment.id)
                                        //                                     if (secondLevelComments.length > 0) {
                                        //                                         hasReplies = true
                                        //                                     } else {
                                        //                                         hasReplies = false
                                        //                                     }


                                        //                                     return (secondLevelComments.map(comment =>
                                        //                                         <>
                                        //                                             <h5 className="card-title"> {comment.username} - (comment id: {comment.id}) replied to top-level comment id: {currentTopLevelCommentID} </h5>
                                        //                                             <p className="card-text">{comment.description}</p>
                                        //                                             <button className="btn btn-primary btn-sm" onClick={() =>
                                        //                                                 this.enableCommentForm(comment.id)}>Reply to above comment</button>


                                        //                                             {(this.state.addCommentReply === true && this.state.inResponseTo == comment.id) &&
                                        //                                                 (<div className="container">

                                        //                                                     <Formik
                                        //                                                         initialValues={{ description }}
                                        //                                                         onSubmit={this.onSubmit}
                                        //                                                         validateOnBlur={false}
                                        //                                                         validateOnChange={false}
                                        //                                                         // validate={this.validate}
                                        //                                                         enableReinitialize={true}
                                        //                                                     >
                                        //                                                         {
                                        //                                                             (props) => (
                                        //                                                                 <Form>
                                        //                                                                     <ErrorMessage name="description" component="div"
                                        //                                                                         className="alert alert-warning" />
                                        //                                                                     {/* <ErrorMessage name="inResponseTo" component="div"
                                        // className="alert alert-warning" /> */}


                                        //                                                                     <fieldset className="form-group">
                                        //                                                                         <label>Comment Description</label>
                                        //                                                                         <Field className="form-control" type="text" name="description" />
                                        //                                                                     </fieldset>

                                        //                                                                     {/* <fieldset className="form-group">
                                        // <label>In response to</label>
                                        // <Field className="form-control" type="number" name="inResponseTo" />
                                        // </fieldset> */}
                                        //                                                                     <button className="btn btn-success" type="submit">Reply</button>
                                        //                                                                 </Form>
                                        //                                                             )
                                        //                                                         }

                                        //                                                     </Formik>
                                        //                                                 </div>
                                        //                                                 )
                                        //                                             }
                                        //                                         </>
                                        //                                     ))
                                        //                                 }



                                    })()}

                                    {/*line breaks between top-level comments*/}
                                    {/* {(() => {

                                        if (hasReplies) {
                                            return <div> <br></br><br></br><br></br></div>
                                        }
                                    })()} */}



                                </>

                        )


                    }
                </div>
            </>

        )
    }

    displayNestedReplies(commentIDToBeRepliedTo, spacing) {
        //commentIDToBeRepliedTo

        var comments = this.state.comments
        //terminating recursive condition: when no more comments are replies to any upper level comments


        var commentReplies = []
        console.log("commentIDToBeRepliedTo: " + commentIDToBeRepliedTo )
        for (var i = 0; i < comments.length; i++) {
            var singleComment = comments[i]

            if (singleComment.inResponseTo == commentIDToBeRepliedTo) {

                commentReplies.push(singleComment)
                console.log("singleComment.id: " + singleComment.id)
            }
        }

        

        if (commentReplies.length > 0) {
            let { description } = this.state;
        return (commentReplies.map(comment =>
            <div style = {{marginLeft: spacing +'rem'}}>

                {/* initially style = margin-right: 1rem 
                https://getbootstrap.com/docs/4.0/layout/utilities-for-layout/*/}
                <h5 className="card-title"> {comment.username} - (comment id: {comment.id}) replied to  comment id: {commentIDToBeRepliedTo} </h5>
                <p className="card-text">{comment.description}</p>
                <button className="btn btn-primary btn-sm" onClick={() =>
                    this.enableCommentForm(comment.id)}>Reply to above comment</button>


                {(this.state.addCommentReply === true && this.state.inResponseTo == comment.id) &&
                    (<div className="container">

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
                                        <button className="btn btn-success" type="submit">Reply</button>
                                    </Form>
                                )
                            }

                        </Formik>
                    </div>
                    )
                }



                {(() => {
                    return this.displayNestedReplies(comment.id, spacing +2)
                })()}
            </div>

        
        ))
        } else {
            return
        }

        




        //recurse over 2nd secondLevelComments to get nested replies
        // if (secondLevelComments.length != 0) {
        //     for (var i = 0; i < secondLevelComments.length; i++) {
        //         this.displayNestedReplies(secondLevelComments[i].id)
        //     }
        // }



        // return secondLevelComments

    }


    // displayNestedReplies(commentIDToBeRepliedTo) {
    //     //commentIDToBeRepliedTo

    //     var comments = this.state.comments
    //     //terminating recursive condition: when no more comments are replies to any upper level comments


    //     var secondLevelComments = []
    //     var combinedReplies = ""
    //     for (var i = 0; i < comments.length; i++) {
    //         var singleComment = comments[i]
    //         // console.log("in displayNestedReplies " + obj.description)
    //         // console.log("potential second level comment .inResponseTo: " + singleComment.inResponseTo + " singleComment id: " + singleComment.id + " commentIDToBeRepliedTo: " + commentIDToBeRepliedTo)
    //         // console.log("still in first loop")
    //         if (singleComment.inResponseTo == commentIDToBeRepliedTo) {
    //             // console.log(" singleComment id: " + singleComment.id + " second level comment .inResponseTo: " + singleComment.inResponseTo)
    //             // console.log("in second loop")
    //             // var singleCommentDescription = "<div>" + singleComment.description + "</div><br/>"
    //             // combinedReplies += singleCommentDescription
    //             secondLevelComments.push(singleComment)
    //         }
    //     }

    //     //recurse over 2nd secondLevelComments to get nested replies
    //     if (secondLevelComments.length != 0) {
    //         for (var i = 0; i < secondLevelComments.length; i++) {
    //             this.displayNestedReplies(secondLevelComments[i].id)
    //         }
    //     }

    //     return secondLevelComments

    // }

    enableCommentForm(commentID) {

        if (commentID === null) {
            //Creating comment for video
            this.setState({
                addComment: !this.state.addComment
            })
        } else {
            //Creating reply to comment
            console.log("in enableCommentForm " + commentID)
            this.setState({
                addCommentReply: !this.state.addCommentReply,
                inResponseTo: parseInt(commentID)
            })


        }
        console.log("addCommentReply " + this.state.addCommentReply)
        // console.log("inResponseTo" + this.state.inResponseTo)
    }

    componentDidMount() {

        //Hide comment form when refreshing/first landing on this page
        this.setState({
            addComment: false,
            addCommentReply: false
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
        if (this.state.addComment === true && this.state.addCommentReply === false) {
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

        if (this.state.addComment === false && this.state.addCommentReply === true) {
            console.log("replying to comment")
            console.log("username: " + username)
            CommentDataService.createComment(username, {
                //Use state values for those which are carried over from ListComments
                //Use values. if obtained from Formik.
                //
                id: -1,
                description: values.description,
                inResponseTo: this.state.inResponseTo, //Set inResponseTo to 0 for all top-level replies to a lesson; vary when replying to a comment
                targetDate: this.state.targetDate,
                username: this.state.username
            }).then(
                //When successfully replied to comment
                () => {
                    // this.props.navigate("/comments")
                    console.log("replying to comment success")
                    this.setState({
                        successMessage: "replying to comment success"
                    })
                    this.componentDidMount()
                }

            ).catch(
                error => this.setState({
                    successMessage: error.response.data.message
                })
            )
        }
        console.log("in onSubmit")
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