import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Formik, Field, Form, ErrorMessage } from 'formik'
import moment from 'moment/moment'
import AuthenticationService from './AuthenticationService'
import CommentDataService from '../../api/comment/CommentDataService.js'
import parse from 'html-react-parser';
import CommentComponent from './CommentComponent'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import FeedbackDataService from '../../api/feedback/FeedbackDataService.js'

// toast.configure()



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
            urgencyLevel: "1",
            targetDate: moment(new Date()).format('YYYY-MM-DD'),
            username: AuthenticationService.getLoggedInUserName(),
            successMessage: "",
            comments: [],
            hasReplies: Boolean(false),
            satisfactionLevel: "1",
            satisfactionFeedback: "",
            intervalIDs: [],
            currentTopLevelCommentId: 0,
            lessonId: 1,
            submittedFeedback:false
        }



        this.handleSuccessfulResponse = this.handleSuccessfulResponse.bind(this)
        this.handleError = this.handleError.bind(this)
        this.enableCommentForm = this.enableCommentForm.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.validate = this.validate.bind(this)
        this.displayNestedReplies = this.displayNestedReplies.bind(this)
        this.displayFeedbackForm = this.displayFeedbackForm.bind(this)
        this.counterForFeedbackForm = this.counterForFeedbackForm.bind(this)
        this.upvote = this.upvote.bind(this)
        this.setCurrentTopLevelCommentId = this.setCurrentTopLevelCommentId.bind(this)
        this.onSubmitFeedback = this.onSubmitFeedback.bind(this)


    }


    render() {

        let { description, urgencyLevel } = this.state
        let currentTopLevelCommentID = 0
        let hasReplies = false
        let loggedInUserName = AuthenticationService.getLoggedInUserName()
        // intervalID = setInterval(this.displayFeedbackForm, 15000)
        // console.log("interval id: " + intervalID)
        // this.counterForFeedbackForm()
        // toast.configure()






        return (
            <>
                {/* 
                <div className="App">
                    <button onClick={notify}>Notify!</button>
                </div> */}
                {/* Ensure ToastContainer is used in component, remove 
                toast.configure() 
                https://stackoverflow.com/questions/49378743/toast-is-not-rendered-react-toastify-component
                */}
                <ToastContainer />

                <h1>Lesson</h1>
                <div className="container">
                    {/* <img src={require('../../document.PNG')} height={700} width={600} align="center" /> */}

                    <iframe width="640" height="480"
                        src="https://www.youtube.com/embed/L3LMbpZIKhQ?list=PLB7540DEDD482705B"
                        title="Lec 1 | MIT 6.042J Mathematics for Computer Science, Fall 2010" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen>
                    </iframe>

                </div>
                <div className="container">

                    <button onClick={() =>
                        this.enableCommentForm(null)} className="btn ">Comment on this video</button>
                </div>

                {/* <div className="container" >
                    <br></br>
                </div> */}


                {this.state.successMessage !== "" && (<div className="alert alert-success">
                    {this.state.successMessage}
                </div>)}


                {/* {Comment form to reply to lesson} */}
                {this.state.addComment === true && (<div className="container">


                    <Formik
                        initialValues={{ description, urgencyLevel }}
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

                                    {loggedInUserName.includes("Student", 0) &&
                                        (<fieldset className="form-group">
                                            <label>Urgency level</label>
                                            <Field
                                                className="form-control"
                                                as="select"
                                                // onChange={this.onItemTypeDropdownSelected}
                                                name="urgencyLevel"
                                            >
                                                <option value="3">High</option>
                                                <option value="2">Medium</option>
                                                <option value="1">Low</option>
                                            </Field>
                                        </fieldset>
                                        )}
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
                                        (<div className="card-body" align="left" key={comment.id} >
                                            {/* {console.log("inResponseTo: " + comment.inResponseTo)} */}
                                            <br></br><br></br><br></br>
                                            {/* {currentTopLevelCommentID =comment.id} */}
                                            <span>
                                                {/* {(() => {
                                                    this.setCurrentTopLevelCommentId(comment.id);
                                                })()} */}
                                                {
                                                    // () => {
                                                    //     currentTopLevelCommentID = comment.id
                                                    //     console.log("setting comment id")
                                                    //     this.setState({
                                                    //         currentTopLevelCommentId: commentId
                                                    //     }
                                                    //     )
                                                    // }
                                                    
                                                }
                                            </span>
                                            <h5 className="card-title" align="left"> {comment.username} - (comment id: {comment.id})</h5>

                                            {comment.urgencyLevel != "" && comment.urgencyLevel == "3" && (<p className="card-text" align="left" style={{ color: "DarkRed" }}>Urgency level: {comment.urgencyLevel}</p>)}
                                            {comment.urgencyLevel != "" && comment.urgencyLevel == "2" && (<p className="card-text" align="left" style={{ color: "DarkOrange" }}>Urgency level: {comment.urgencyLevel}</p>)}
                                            {comment.urgencyLevel != "" && comment.urgencyLevel == "1" && (<p className="card-text" align="left" style={{ color: "Chartreuse" }}>Urgency level: {comment.urgencyLevel}</p>)}
                                            <p className="card-text" align="left">{comment.description}</p>
                                            <button style={{ display: "inline-block" }} className="btn btn-primary btn-sm" onClick={() => this.enableCommentForm(comment.id)}>
                                                Reply to above comment
                                            </button>

                                            <button style={{ display: "inline-block", marginLeft: '1rem' }} className="btn btn-primary btn-sm" onClick={() => this.upvote(comment.username, comment.id, comment.description, comment.urgencyLevel, comment.inResponseTo, comment.votes + 1)}>
                                                ↑ Votes: {comment.votes}
                                            </button>
                                            <div>
                                                <br></br>
                                            </div>

                                            {(this.state.addCommentReply === true && this.state.inResponseTo == comment.id) &&
                                                (<div className="container">


                                                    <Formik
                                                        initialValues={{ description, urgencyLevel }}
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
                                                                    {this.state.username.includes("Student", 0) &&
                                                                        (<fieldset className="form-group">
                                                                            <label>Urgency level</label>
                                                                            <Field
                                                                                className="form-control"
                                                                                as="select"
                                                                                // onChange={this.onItemTypeDropdownSelected}
                                                                                name="urgencyLevel"
                                                                            >
                                                                                <option value="3">High</option>
                                                                                <option value="2">Medium</option>
                                                                                <option value="1">Low</option>
                                                                            </Field>
                                                                        </fieldset>
                                                                        )}

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
                                        // comment.id == currentTopLevelCommentID
                                        if (comment.inResponseTo==0) {
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

    setCurrentTopLevelCommentId(commentId) {
        this.setState({
            currentTopLevelCommentId: commentId
        }
        )

    }

    

    displayNestedReplies(commentIDToBeRepliedTo, spacing) {


        //commentIDToBeRepliedTo

        var comments = this.state.comments
        //terminating recursive condition: when no more comments are replies to any upper level comments


        var commentReplies = []
        // console.log("commentIDToBeRepliedTo: " + commentIDToBeRepliedTo)
        for (var i = 0; i < comments.length; i++) {
            var singleComment = comments[i]

            if (singleComment.inResponseTo == commentIDToBeRepliedTo) {

                commentReplies.push(singleComment)
                // console.log("singleComment.id: " + singleComment.id)
            }
        }



        if (commentReplies.length > 0) {
            let { description, urgencyLevel } = this.state;
            return (commentReplies.map(comment =>


                <div align="left" className="card-body" style={{ marginLeft: spacing + 'rem' }}>
                    {/* initially style = margin-right: 1rem 
                https://getbootstrap.com/docs/4.0/layout/utilities-for-layout/*/}
                    <h5 align="left" className="card-title"> {comment.username} - (comment id: {comment.id}) replied to  comment id: {commentIDToBeRepliedTo} </h5>
                    {comment.urgencyLevel != "" && comment.urgencyLevel == "3" && (<p align="left" className="card-text" style={{ color: "Crimson" }}>Urgency level: {comment.urgencyLevel}</p>)}
                    {comment.urgencyLevel != "" && comment.urgencyLevel == "2" && (<p align="left" className="card-text" style={{ color: "DarkOrange" }}>Urgency level: {comment.urgencyLevel}</p>)}
                    {comment.urgencyLevel != "" && comment.urgencyLevel == "1" && (<p align="left" className="card-text" style={{ color: "Chartreuse" }}>Urgency level: {comment.urgencyLevel}</p>)}
                    <p align="left" className="card-text">{comment.description}</p>
                    <button style={{ display: "inline-block" }} className="btn btn-primary btn-sm" onClick={() =>
                        this.enableCommentForm(comment.id)}>Reply to above comment
                    </button>


                    <button style={{ display: "inline-block", marginLeft: '1rem' }} className="btn btn-primary btn-sm" onClick={() => this.upvote(comment.username, comment.id, comment.description, comment.urgencyLevel, comment.inResponseTo, comment.votes + 1)}>
                        ↑ Votes: {comment.votes}
                    </button>



                    {(this.state.addCommentReply === true && this.state.inResponseTo == comment.id) &&
                        (<div className="container">

                            <Formik
                                initialValues={{ description, urgencyLevel }}
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

                                            {this.state.username.includes("Student", 0) &&
                                                (<fieldset className="form-group">
                                                    <label>Urgency level</label>
                                                    <Field
                                                        className="form-control"
                                                        as="select"
                                                        // onChange={this.onItemTypeDropdownSelected}
                                                        name="urgencyLevel"
                                                    >
                                                        <option value="3">High</option>
                                                        <option value="2">Medium</option>
                                                        <option value="1">Low</option>
                                                    </Field>
                                                </fieldset>
                                                )}
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
                        return this.displayNestedReplies(comment.id, spacing + 2)
                    })()}
                </div>


            ))
        } else {
            return
        }


    }



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
            addCommentReply: false,
            username: AuthenticationService.getLoggedInUserName()
        })




        console.log("componentDidMount")
        this.refreshComments();
        // console.log(this.state)


        //If there are more than 1 feedback forms to be displayed, remove first one.
        //Remove first interval.
        this.counterForFeedbackForm()
        

    }
    upvote(commentUsername, commentId, commentDescription, commentUrgencyLevel, commentInResponseTo, commentVotes) {
        CommentDataService.updateComment(commentUsername, commentId, {
            //Use state values for those which are carried over from ListComments
            //Use values. if obtained from Formik.
            //
            id: commentId,
            description: commentDescription,
            urgencyLevel: commentUrgencyLevel,
            inResponseTo: commentInResponseTo,
            targetDate: this.state.targetDate,
            username: commentUsername,
            votes: commentVotes

        }).then(
           
            // console.log("successfully updates votes of a comment")
            // this.refreshComments()
            this.refreshComments()
        )
        this.refreshComments()
    }

    
    refreshComments() {
        console.log("in refresh comments x")
        let username = AuthenticationService.getLoggedInUserName()
        CommentDataService.retrieveAllComments(username)
            .then(
                response => {
                    console.log("response " + response.data)
                    this.setState({ comments: response.data })

                }

            )
    }



    //When Updating(PUT) or Creating(POST) comments
    onSubmit(values) {
        console.log("Urgency level: " + values.urgencyLevel)
        let username = AuthenticationService.getLoggedInUserName()
        let desc = new String(values.description);
        // let test = desc.replaceAll("’", "\\’");
        // test =  test.replaceAll("'", "\\'");
        // console.log("this is description " + test)
        // console.log("state.id" + this.state.id);


        if (this.state.addComment === true && this.state.addCommentReply === false) {
            console.log("username: " + username)
            console.log("replying to lesson")

            //Escape single quote characters to prevent gibberish from being inserted into mysql



            CommentDataService.createComment(username, {
                //Use state values for those which are carried over from ListComments
                //Use values. if obtained from Formik.
                //
                id: -1,
                description: desc,
                urgencyLevel: values.urgencyLevel,
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
                description: desc,
                urgencyLevel: values.urgencyLevel,
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

        //Providing feedback
        toast.dismiss()
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



    counterForFeedbackForm() {
        //    if(feedbackFormFlag === true){
        //     feedbackFormFlag = false
        //     console.log("test timer")
        //    }


        //counterForFeedbackForm() runs >1 time, remove previous timers for feedback form, only leave 1
        for (var i = 0; i < this.state.intervalIDs.length; i++) {
            console.log("removing intervalID")
            clearInterval(this.state.intervalIDs.pop());
            
        }

        // let intervalID = setTimeout(this.displayFeedbackForm, 3000);
        //Store intervalID for removal if counterForFeedbackForm() called again
        if(this.state.submittedFeedback === false){
            this.setState({
                submittedFeedback:true
            })
            this.state.intervalIDs.push(setTimeout(this.displayFeedbackForm, 3000));    
        }
        
        // console.log("interval ID: " + intervalID)


        // Need to clear first timeout becuase componentDidMount() runs twice,
        // once when component first mounted and another when state is changed and rendering occurs for 2nd time
        // if (intervalID === 1) {
        //     clearTimeout(intervalID)
        // }
        //    https://www.geeksforgeeks.org/how-to-embed-two-components-in-one-component/
        //implement custom component that has Formik, drop down rating and comment box to submit
        //Based on timeout ID gotten, then only display feedback form
        //n2 find another way since ID will be assigned before everything loads,
        //but can't let it render <30s before everything else is rendered,
        //else not using timer's functionality
        //    render(){
        //     return(
        //         <>
        //         <h1>test</h1>
        //         </>
        //     )
        //    }
    }

    displayFeedbackForm() {
        //Create feedback form
        //render popup?

        //Need to figure out how to make it appear after certain time

        let { satisfactionLevel, satisfactionFeedback } = this.state
        // const notify = () => {
        //     toast(customToast, toastOptions)

        // }


        //For Toast notification
        let toastOptions = {
            // onOpen: props => console.log(props.foo),
            // onClose: props => console.log(props.foo),
            // autoClose: 6000, 
            type: toast.TYPE.INFO,
            hideProgressBar: true,
            position: toast.POSITION.TOP_CENTER,
            pauseOnHover: true,
            // progress: 0.2,
            closeOnClick: false
            // onOpen: this.setSubmittedFeedbackToTrue()
            // and so on ...
        };

        // <ToastContainer/>

        const customToast = ({ closeToast }) => {
            return (
                <>
                    <div>
                        <Formik
                            initialValues={{ satisfactionLevel, satisfactionFeedback }}
                            onSubmit={this.onSubmitFeedback}
                            validateOnBlur={false}
                            validateOnChange={false}
                            // validate={this.validate}
                            enableReinitialize={true}
                        >
                            {
                                (props) => (
                                    <Form>
                                        <ErrorMessage name="satisfactionFeedback" component="div"
                                            className="alert alert-warning" />
                                        {/* <ErrorMessage name="inResponseTo" component="div"
            className="alert alert-warning" /> */}

                                        <fieldset className="form-group">
                                            <label>Satisfaction with UI</label>
                                            <Field
                                                className="form-control"
                                                as="select"
                                                // onChange={this.onItemTypeDropdownSelected}
                                                name="satisfactionLevel"
                                            >
                                                <option value="3">High</option>
                                                <option value="2">Medium</option>
                                                <option value="1">Low</option>
                                            </Field>
                                        </fieldset>


                                        <fieldset className="form-group">
                                            <label>Is there anywhere we can improve?</label>
                                            <Field className="form-control" type="text" name="satisfactionFeedback" />
                                        </fieldset>

                                        <button className="btn btn-success" type="submit">Submit feedback</button>
                                    </Form>
                                )
                            }
                        </Formik>
                    </div>
                </>
            )
        }

        toast(customToast, toastOptions)


        // this.notify
        console.log("test timeout")

    }

    

    onSubmitFeedback(values){
        toast.dismiss()
        this.forceUpdate()
        this.componentDidMount()


        console.log(values.satisfactionLevel + "x" + values.satisfactionFeedback)
        FeedbackDataService.createFeedback(this.state.lessonId, {
            //Use state values for those which are carried over from ListComments
            //Use values. if obtained from Formik.
            //
            id: -1,
            feedbackRating: values.satisfactionLevel,
            feedbackComment: values.satisfactionFeedback,
            lessonId: this.state.lessonId
          
        }).then(
            //When successfully replied to comment
            () => {
                // this.props.navigate("/comments")
                this.forceUpdate()
                
                console.log("Adding feedback success")
                this.setState({
                    successMessage: "Adding feedback success",
                    submittedFeedback: true
                })
                for (var i = 0; i < this.state.intervalIDs.length; i++) {
                    console.log("removing intervalID")
                    clearInterval(this.state.intervalIDs.pop());
                    
                }
                toast.dismiss()
                this.componentDidMount()
            }
            


        ).catch(
            error => this.setState({
                successMessage: error.response.data.message
            })
        )
       toast.dismiss()
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