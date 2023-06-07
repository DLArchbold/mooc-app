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
import Modal from 'react-modal'
import "../../LessonComponent.css"
import UserFollowingDataService from '../../api/userfollowing/UserFollowingDataService'
import HelloWorldService from '../../api/comment/HelloWorldService'
// toast.configure()


//**https://stackoverflow.com/questions/41446560/react-setstate-not-updating-state */
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
            targetDate: moment(new Date()).format('YYYY-MM-DDTHH:mm:ss.sssZ'),
            username: AuthenticationService.getLoggedInUserName(),
            successMessage: "",

            comments: [],

            hasReplies: Boolean(false),
            satisfactionLevel: "1",
            satisfactionFeedback: "",
            intervalIDs: [],
            currentTopLevelCommentId: 0,
            lessonId: 1,
            submittedFeedback: false,
            modalIsOpen: false,
            expandMenu: false,

            userFollow: [],
            followedCommentsId: [],

            filterParameters: { filterBy: "none" },
            masterComments: [],
            sortParameters: { sortBy: "none" }
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
        this.getAndParseFollowedComments = this.getAndParseFollowedComments.bind(this)
        this.handleChecked = this.handleChecked.bind(this)
        // this.loadIframePlayer = this.loadIframePlayer.bind(this)
        // this.onYouTubeIframeAPIReady = this.onYouTubeIframeAPIReady.bind(this)
        // this.onPlayerReady = this.onPlayerReady.bind(this)
        // this.onPlayerStateChange = this.onPlayerStateChange(this)
        // this.stopVideo = this.stopVideo.bind(this)







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

        const modalStyles = {
            content: {
                top: "50%",
                left: "50%",
                right: "auto",
                bottom: "auto",
                marginRight: "-50%",
                transform: "translate(-50%, -50%)"
            }
        };
        // const [modalIsOpen, setModalIsOpen] = React.useState(false);
        const handleExerciseComplete = () => console.log("Do something");

        const handleMenuOpen = () => {
            this.setState(
                { expandMenu: !this.state.expandMenu })
        }


        const handleFilter = (event) => {
            console.log("test filter" + event.target.value)
            var selectedFilter = event.target.value;




            if (selectedFilter === "none") {
                this.setState({ filterParameters: { filterBy: "none" } }, () => {
                    this.refreshComments(this.state.filterParameters, this.state.sortParameters)
                })

            }
            else if (selectedFilter === "following") {
                this.setState({ filterParameters: { filterBy: "following" } }, () => {
                    this.refreshComments(this.state.filterParameters, this.state.sortParameters)
                })

            } else if (selectedFilter === "asked") {
                this.setState({ filterParameters: { filterBy: "asked", email: AuthenticationService.getLoggedInUserName(), inResponseTo: 0 } }, () => {
                    this.refreshComments(this.state.filterParameters, this.state.sortParameters)
                })

            } else if (selectedFilter === "to_respond") {
                this.setState({ filterParameters: { filterBy: "to_respond" } }, () => {
                    this.refreshComments(this.state.filterParameters, this.state.sortParameters)
                })

            }
        }

        const handleSort = (event) => {
            console.log("test filter" + event.target.value)
            var selectedFilter = event.target.value;

            if (selectedFilter === "none") {
                this.setState({ sortParameters: { sortBy: "none" } }, () => {
                    this.refreshComments(this.state.filterParameters, this.state.sortParameters)
                })

            }
            else if (selectedFilter === "mostRecent") {
                this.setState({ sortParameters: { sortBy: "mostRecent" } }, () => {
                    this.refreshComments(this.state.filterParameters, this.state.sortParameters)
                })

            } else if (selectedFilter === "upvotes") {
                this.setState({ sortParameters: { sortBy: "upvotes" } }, () => {
                    this.refreshComments(this.state.filterParameters, this.state.sortParameters)
                })

            }
        }



        // <Modal
        //     isOpen={this.state.modalIsOpen}
        //     onRequestClose={this.setState({ modalIsOpen: false })}
        //     contentLabel="Exercise Completed"
        //     style={modalStyles}
        // >
        //     <div>
        //         <h3>Completed the exercise?</h3>
        //         <button
        //             onClick={handleExerciseComplete}
        //         >
        //             Complete exercise
        //         </button>
        //     </div>
        // </Modal>

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





                <br></br>

                {/* <div className="container">

                    <button onClick={() =>
                        this.enableCommentForm(null)} className="btn ">Add bookmark at this timestamp</button>
                </div> */}

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


                {/* <div>
                    <button onClick={() => handleMenuOpen()}>
                        Dropdown
                    </button>
                    {this.state.expandMenu ?
                        (
                            <ul className="menu">
                                <li className="menu-item">
                                    <button>Menu 1</button>
                                </li>
                                <li className="menu-item">
                                    <button>Menu 2</button>
                                </li>
                            </ul>
                        ) : null}
                </div> */}


                <br></br>
                <div className="filterForm">
                    <select onChange={handleFilter} className="form-select" defaultValue={"none"}>

                        <option value="none"  >Filter top-level comments</option>

                        <option value="asked">Asked</option>

                        <option value="following">Following</option>

                        <option value="to_respond">To respond</option>

                    </select>
                </div>
                <br></br>
                <div className="sortForm">
                    <select onChange={handleSort} className="form-select" defaultValue={"none"}>

                        <option value="none"  >Sort top-level comments</option>

                        <option value="mostRecent">Most Recent</option>

                        <option value="upvotes">Upvotes</option>

                    </select>
                </div>









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
                                            <hr></hr>
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
                                            <h5 className="card-title" align="left"> {comment.username} - (comment id: {comment.id})
                                                {(comment.commentType == 'question') && (<span className='marker'><span className='markerText'>Question</span></span>)}
                                                {(comment.commentType == 'question') && (<span style={{ marginLeft: "5px" }}>Answered:</span>)}
                                                {(comment.commentType == 'question') &&
                                                    (<input onClick={() => this.checkAnswered(comment.username, comment.id, comment.description,
                                                        comment.urgencyLevel, comment.inResponseTo, comment.votes,
                                                        comment.commentType, !comment.answered)}
                                                        checked={this.handleChecked(comment.id)}
                                                        // style={{ defaultChecked: this.state.checked }}
                                                        type="checkbox"
                                                        class="answeredCheck"
                                                        id={`exampleCheck${comment.id}`} />
                                                    )}
                                            </h5>


                                            {!this.state.followedCommentsId.includes(comment.id)
                                                &&
                                                (<button style={{ display: "inline-block" }} className="btn btn-primary btn-sm" onClick={() =>
                                                    this.followQuestionThread(this.state.username, this.state.lessonId, comment.id)}>
                                                    Follow question thread
                                                </button>)
                                            }
                                            {this.state.followedCommentsId.includes(comment.id)
                                                &&
                                                (<button style={{ display: "inline-block" }} className="btn btn-primary btn-sm" onClick={() =>
                                                    this.unFollowQuestionThread(this.state.username, this.state.lessonId, comment.id)}>
                                                    Unfollow question thread
                                                </button>
                                                )
                                            }


                                            {comment.urgencyLevel != "" && comment.urgencyLevel == "3" && (<p className="card-text" align="left" style={{ color: "DarkRed" }}>Urgency level: {comment.urgencyLevel}</p>)}
                                            {comment.urgencyLevel != "" && comment.urgencyLevel == "2" && (<p className="card-text" align="left" style={{ color: "DarkOrange" }}>Urgency level: {comment.urgencyLevel}</p>)}
                                            {comment.urgencyLevel != "" && comment.urgencyLevel == "1" && (<p className="card-text" align="left" style={{ color: "Chartreuse" }}>Urgency level: {comment.urgencyLevel}</p>)}
                                            <p className="card-text" align="left">{comment.description}</p>
                                            <button style={{ display: "inline-block" }} className="btn btn-primary btn-sm" onClick={() => this.enableCommentForm(comment.id)}>
                                                Reply to above comment
                                            </button>

                                            <button style={{ display: "inline-block", marginLeft: '1rem' }}
                                                className="btn btn-primary btn-sm"
                                                onClick={() => this.upvote(comment.username, comment.id, comment.description, comment.urgencyLevel, comment.inResponseTo, comment.votes + 1)}>
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
                                        if (comment.inResponseTo == 0) {
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
                <div className="card-body" align="left"  >
                    {/* {console.log("inResponseTo: " + comment.inResponseTo)} */}
                    <br></br><br></br><br></br>
                    {/* {currentTopLevelCommentID =comment.id} */}
                    <hr></hr>

                    <h3 align="left">Response times for urgency level</h3>
                    <div><span align="left" className="card-text" style={{ color: "Crimson" }}>High </span> <span>: within 24 hours</span></div>
                    <div><span align="left" className="card-text" style={{ color: "DarkOrange" }}>Medium </span> <span>: within 3 days</span></div>
                    <div><span align="left" className="card-text" style={{ color: "Chartreuse" }}>Low </span> <span>: within 1 week</span></div>

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
                    {/* (comment.commentType == "question") && (<div>question</div>) */}
                    <h5 align="left" className="card-title"> {comment.username} - (comment id: {comment.id}) replied to  comment id: {commentIDToBeRepliedTo}
                        {(comment.commentType == 'question') && (<span className='marker'><span className='markerText'>Question</span></span>)}
                        {(comment.commentType == 'question') && (<span style={{ marginLeft: "5px" }}>Answered:</span>)}
                        {(comment.commentType == 'question') &&
                            (<input onClick={
                                () => this.checkAnswered(comment.username, comment.id, comment.description,
                                    comment.urgencyLevel, comment.inResponseTo, comment.votes,
                                    comment.commentType, !comment.answered)
                            }
                                checked={this.handleChecked(comment.id)}
                                // style={{ defaultChecked: this.state.checked }}
                                type="checkbox"
                                class="answeredCheck"
                                id={`exampleCheck${comment.id}`} />
                            )}
                    </h5>
                    {comment.urgencyLevel != "" && comment.urgencyLevel == "3" && (<p align="left" className="card-text" style={{ color: "Crimson" }}>Urgency level: {comment.urgencyLevel}</p>)}
                    {comment.urgencyLevel != "" && comment.urgencyLevel == "2" && (<p align="left" className="card-text" style={{ color: "DarkOrange" }}>Urgency level: {comment.urgencyLevel}</p>)}
                    {comment.urgencyLevel != "" && comment.urgencyLevel == "1" && (<p align="left" className="card-text" style={{ color: "Chartreuse" }}>Urgency level: {comment.urgencyLevel}</p>)}
                    <p align="left" className="card-text">{comment.description}</p>
                    <button style={{ display: "inline-block" }} className="btn btn-primary btn-sm" onClick={() =>
                        this.enableCommentForm(comment.id)}>Reply to above comment
                    </button>


                    <button style={{ display: "inline-block", marginLeft: '1rem' }}
                        className="btn btn-primary btn-sm"
                        onClick={() => this.upvote(comment.username, comment.id, comment.description, comment.urgencyLevel, comment.inResponseTo, comment.votes + 1)}>
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
        this.refreshComments({ filterBy: this.state.filterParameters['filterBy'] }, this.state.sortParameters);
        this.getAndParseFollowedComments(this.state.username, this.state.lessonId);
        // console.log(this.state)


        //If there are more than 1 feedback forms to be displayed, remove first one.
        //Remove first interval.
        this.counterForFeedbackForm()


    }

    handleChecked(commentId) {
        for (var i = 0; i < this.state.comments.length; i++) {
            if (this.state.comments[i]['id'] == commentId) {
                console.log(this.state.comments[i])
                if (this.state.comments[i]['answered'] != undefined) {
                    return this.state.comments[i]['answered']
                } else {
                    return
                }

            }

        }
    }

    checkAnswered(commentUsername, commentId, commentDescription,
        commentUrgencyLevel, commentInResponseTo, commentVotes,
        commentType, answered) {

        var date;
        for (var i = 0; i < this.state.masterComments.length; i++) {
            if (this.state.masterComments[i]['id'] == commentId) {
                date = this.state.masterComments[i]['targetDate']
            }
        }

        console.log("Answered: " + answered)


        CommentDataService.updateComment(commentUsername, commentId, {
            //Use state values for those which are carried over from ListComments
            //Use values. if obtained from Formik.
            //
            id: commentId,
            description: commentDescription,
            urgencyLevel: commentUrgencyLevel,
            inResponseTo: commentInResponseTo,
            targetDate: date,
            username: commentUsername,
            votes: commentVotes,
            lessonId: this.state.lessonId,
            commentType: commentType,
            answered: answered


        }).then(

            // console.log("successfully updates votes of a comment")
            // this.refreshComments()
            response => {
                this.refreshComments(this.state.filterParameters, this.state.sortParameters);
            }

        )
    }

    upvote(commentUsername, commentId, commentDescription, commentUrgencyLevel, commentInResponseTo, commentVotes) {
        var date;
        for (var i = 0; i < this.state.masterComments.length; i++) {
            if (this.state.masterComments[i]['id'] == commentId) {
                date = this.state.masterComments[i]['targetDate']
            }
        }

        CommentDataService.updateComment(commentUsername, commentId, {
            //Use state values for those which are carried over from ListComments
            //Use values. if obtained from Formik.
            //
            id: commentId,
            description: commentDescription,
            urgencyLevel: commentUrgencyLevel,
            inResponseTo: commentInResponseTo,
            targetDate: date,
            username: commentUsername,
            votes: commentVotes,
            lessonId: this.state.lessonId

        }).then(

            // console.log("successfully updates votes of a comment")
            // this.refreshComments()
            response => {
                this.refreshComments(this.state.filterParameters, this.state.sortParameters);
            }

        )
        // this.refreshComments(this.state.filterParameters);
        //     this.forceUpdate();
        // this.refreshComments(this.state.filterParameters)
    }

    sortComments(sortBy) {

        var comments = [...this.state.comments]
        var sortedComments = []
        if (this.state.sortParameters['sortBy'] == "none") {


            this.setState({ comments: comments }, () => {
                for (var i = 0; i < this.state.comments.length; i++) {
                    // console.log("this.state.comments[i] " + JSON.stringify(this.state.comments[i]));
                }
                console.log("sorted by none")
            })
        } else if (this.state.sortParameters['sortBy'] == "mostRecent") {

            sortedComments = comments.sort(
                (p1, p2) =>
                    (Date.parse(p1.targetDate) < Date.parse(p2.targetDate)) ? 1 : (Date.parse(p1.targetDate) > Date.parse(p2.targetDate)) ? -1 : 0


            );
            this.setState({ comments: sortedComments }, () => {
                for (var i = 0; i < this.state.comments.length; i++) {
                    console.log("this.state.comments[i] " + JSON.stringify(this.state.comments[i]));
                    console.log(Date.parse(comments[i]['targetDate']))
                }
                console.log("sorted by mostRecent")
            })


        } else if (this.state.sortParameters['sortBy'] == "upvotes") {
            sortedComments = comments.sort(
                (p1, p2) => (p1.votes < p2.votes) ? 1 : (p1.votes > p2.votes) ? -1 : 0
            );
            this.setState({ comments: sortedComments }, () => {
                for (var i = 0; i < this.state.comments.length; i++) {
                    // console.log("this.state.comments[i] " + JSON.stringify(this.state.comments[i]));
                }
                console.log("sorted by upvotes")
                this.forceUpdate()
            })
        }
    }

    refreshComments(filterParams, sortParams) {
        console.log("in refresh comments x")
        let username = filterParams['email'];
        let email = filterParams['email'];
        let filterBy = filterParams['filterBy'];
        let inResponseTo = filterParams['inResponseTo']
        let sortBy = sortParams['sortBy']


        if (filterBy == "none") {
            CommentDataService.retrieveCommentsByLessonId(this.state.lessonId)
                .then(
                    response => {

                        if (response != undefined) {
                            // console.log("response " + response.data)
                            this.setState({ comments: response.data }, () => {
                                console.log("printing retrieved comments")
                                for (var i = 0; i < this.state.comments.length; i++) {
                                    // console.log("comments: " + JSON.stringify(this.state.comments[i]))
                                }

                                this.setState({ masterComments: response.data }, () => {
                                    // console.log("setting masterComments")
                                    // for (var i = 0; i < this.state.masterComments.length; i++) {
                                    //     console.log("masterComments: " + JSON.stringify(this.state.masterComments[i]))
                                    // }
                                    this.sortComments(sortBy);
                                })

                                //    this.doUpdate()
                            })
                        } else {
                            console.log("No comments in this lesson")
                            var temp = [...this.state.masterComments]
                            this.setState({ comments: temp }, () => {
                                this.sortComments(sortBy);
                            });
                        }


                    }

                )
        } else if (filterBy == "following") {
            // var yourCallback = function() {
            //     console.log("this.state.followedCommentsId: " + this.state.followedCommentsId);
            // }
            // this.getAndParseFollowedComments(this.state.username, this.state.lessonId);
            UserFollowingDataService.getUserFollowUsingEmailAndLessonId(this.state.username, this.state.lessonId)
                .then(

                    response => {
                        if (response !== undefined) {
                            // console.log("in getAndParseFollowedComments")
                            var uf = response.data
                            // console.log("uf: " + JSON.stringify(uf))


                            this.setState({ userFollow: uf }, () => {
                                // console.log("userFollow:" + this.state.userFollow)
                                var followedCommentsIdArr = [];
                                let userFollowArr = [...this.state.userFollow];

                                for (var i = 0; i < userFollowArr.length; i++) {
                                    // console.log("userFollowArr[i]: " + userFollowArr[i])
                                    followedCommentsIdArr.push(userFollowArr[i]['commentId'])
                                    // console.log("followedCommentsIdArr: " + followedCommentsIdArr[i])
                                }

                                CommentDataService.retrieveTopLevelCommentsByLessonId(this.state.lessonId)
                                    .then(
                                        response => {

                                            this.setState({ masterComments: response.data }, () => {
                                                var temp = []

                                                for (var i = 0; i < this.state.masterComments.length; i++) {
                                                    // console.log("this.state.masterComments[i]['id']: " + this.state.masterComments[i]['id'])
                                                    // console.log()
                                                    if (followedCommentsIdArr.includes(this.state.masterComments[i]['id'])) {
                                                        temp.push(this.state.masterComments[i]['id']);
                                                    }
                                                }
                                                // console.log(temp)
                                                var tempCommentThread = []
                                                var commentThreads = []
                                                for (var i = 0; i < temp.length; i++) {
                                                    tempCommentThread = this.getNestedThreadOfComments(temp[i]);
                                                    commentThreads = [...commentThreads, ...tempCommentThread];
                                                    // console.log("commentThreads: "+ commentThreads);
                                                }

                                                var filteredCommentThreads = this.state.masterComments.filter(
                                                    comment => commentThreads.includes(comment.id)
                                                )

                                                // var tempCommentThread = this.getNestedThreadOfComments(temp);


                                                //Change in this.state.comments will re-render whole page
                                                this.setState({ comments: [...filteredCommentThreads] }, () => {
                                                    this.sortComments(sortBy);
                                                });


                                                //Leads to infinite loop because updates "Follow this comment" button conditional render
                                                // this.setState({ followedCommentsId: [...followedCommentsIdArr] }, () => {
                                                //     console.log("this.state.followedCommentsId: " + this.state.followedCommentsId)
                                                // });
                                            })

                                        }
                                    )

                            })


                        } else {
                            console.log("User not following any comments in this lesson")
                            var temp = []
                            this.setState({ comments: temp }, () => {
                                this.sortComments(sortBy);
                            });
                        }

                    }
                )


        } else if (filterBy == "asked") {
            //Get top level comments, then thread of comments from that, not just top-level comments
            CommentDataService.retrieveTopLevelCommentsByLessonIdByEmail(email, inResponseTo, this.state.lessonId)
                .then(
                    response => {


                        if (response != undefined) {
                            // console.log("response " + response.data)

                            var c = response.data;
                            // for (var i = 0; i < c.length; i++) {
                            //     console.log("c: " + JSON.stringify(c[i]))
                            // }

                            this.setState({ comments: [] }, () => {
                                // console.log("in filter asked");

                                var commentThreads = []
                                // console.log("commentThreads: "+ commentThreads);

                                for (var i = 0; i < c.length; i++) {
                                    let temp = this.getNestedThreadOfComments(response.data[i]['id']);
                                    for (var j = 0; j < temp.length; j++) {
                                        commentThreads.push(temp[j]);
                                    }
                                    // commentThreads = [...commentThreads, ...temp];
                                    // console.log("commentThreads: "+ commentThreads);
                                }

                                // for (var i = 0; i < tempComments.length; i++) {
                                //     console.log("tempComments[i]: " + tempComments[i]);
                                //     console.log("commentThreads: " + commentThreads);
                                //     var temp = this.getNestedThreadOfComments(tempComments[i]['id']);
                                //     for (var j = 0; j < temp.length; j++) {
                                //         commentThreads.push(temp[j]);
                                //     }
                                //     // commentThreads = [...commentThreads, this.getNestedThreadOfComments(tempComments[i]['id'])];
                                //     // commentThreadFull = 
                                // }

                                CommentDataService.retrieveCommentsByLessonId(this.state.lessonId)
                                    .then(
                                        response => {

                                            this.setState({ masterComments: response.data }, () => {

                                                var commentArr = [];

                                                // console.log("this.state.masterComments.length: "+ this.state.masterComments.length);
                                                for (var i = 0; i < this.state.masterComments.length; i++) {
                                                    // console.log("this.state.masterComments[i]: " + JSON.stringify(this.state.masterComments[i]));
                                                    // console.log("commentThreads[i]: " + commentThreads[i]);
                                                    // if (this.state.masterComments[i]['id'].includes(commentThreads[i])){
                                                    //     commentArr.push(this.state.masterComments[i]);
                                                    //     console.log("commentArr: "+ commentArr);
                                                    // }


                                                    if (commentThreads.includes(this.state.masterComments[i]['id'])) {
                                                        commentArr.push(this.state.masterComments[i]);
                                                        // console.log("commentArr: "+ commentArr);
                                                    }
                                                }

                                                this.setState({ comments: commentArr }, () => {
                                                    // for (var i = 0; i < this.state.comments.length; i++) {
                                                    //     console.log("comment Threads: " + JSON.stringify(this.state.comments[i]))
                                                    // }
                                                    console.log("in asked");
                                                    this.sortComments(this.state.sortParameters);
                                                });
                                            })

                                        }
                                    )


                            });





                            // this.setState({ comments: commentThreads }, () => {
                            //     // console.log("comment Threads")
                            //     console.log("comment threads:" + this.state.comments);
                            //     for (var i = 0; i < this.state.comments.length; i++) {
                            //         console.log("comment Threads: " + JSON.stringify(this.state.comments[i]))
                            //     }
                            // })
                        } else {
                            console.log("User has not asked any questions in this lesson")
                            var temp = [...this.state.masterComments]
                            this.setState({ comments: temp }, () => {
                                this.sortComments(sortBy);
                            });
                        }


                    }

                )

        } else if (filterBy == "to_respond") {

            //get top level comments by lessonId
            //for each of those comments, see if there's any other comments with same lessonId, and 
            //has a username/email of mine, do not display them
            //else, 
            //further filter retain and display them as ones that I'm yet to respond 
            //determine by searching through and seeing if any of my comment's inResponseTo has 
            // a value of one of those top-level comments retrieved earlier, do remove them
            //setState({comments:}) to those who are remainingy
            CommentDataService.retrieveTopLevelCommentsByLessonIdByEmailToRespond(this.state.username, this.state.lessonId)
                .then(
                    response => {

                        if (response != undefined) {
                            var cIds = response.data;
                            for (var i = 0; i < this.state.masterComments.length; i++) {
                                if (cIds.includes(this.state.masterComments[i]['inResponseTo'])
                                    && this.state.masterComments[i]['username'] === this.state.username) {
                                        cIds = cIds.filter(id => {
                                            if(id != this.state.masterComments[i]['inResponseTo']){
                                                return id;
                                            }
                                        })
                                }
                            }
                            console.log("cIds : " + cIds);

                            //Top level comments who have no other comments by current user who respond to it.
                            let tempComments = this.state.masterComments.filter(
                                a => cIds.includes(a['id'])
                            )

                            console.log("tempComments: " + tempComments);
                            let commentThreads = []

                            for (var i = 0; i < tempComments.length; i++) {
                                console.log("tempComments[i]: " + tempComments[i]);
                                console.log("commentThreads: " + commentThreads);
                                var temp = this.getNestedThreadOfComments(tempComments[i]['id']);
                                for (var j = 0; j < temp.length; j++) {
                                    commentThreads.push(temp[j]);
                                }
                                // commentThreads = [...commentThreads, this.getNestedThreadOfComments(tempComments[i]['id'])];
                                // commentThreadFull = 
                            }

                            for (var i = 0; i < commentThreads.length; i++) {
                                console.log("commentThread[i]: " + commentThreads[i]);
                            }
                            // console.log("commentThreads.length: "+ commentThreads.length);
                            console.log("this.state.masterComments: " + this.state.masterComments.length);


                            CommentDataService.retrieveTopLevelCommentsByLessonId(this.state.lessonId)
                                .then(
                                    response => {

                                        this.setState({ masterComments: response.data }, () => {

                                            let commentThreadFull = []
                                            var t = [...this.state.masterComments]
                                            for (var i = 0; i < t.length; i++) {
                                                // console.log("this.state.masterComments[i]['id']: " + this.state.masterComments[i]['id'])
                                                // if(commentThreads.includes(this.state.masterComments[i]['id'])){
                                                //     console.log("this.state.masterComments[i]['id']: " + this.state.masterComments[i]['id'])
                                                //     commentThreadFull.push(this.state.masterComments[i]);
                                                // }
                                                console.log("t[i]['id']: " + JSON.stringify(t[i]['id']))


                                                for (var j = 0; j < commentThreads.length; j++) {
                                                    console.log("commentsThread[j]: " + commentThreads[j])
                                                    console.log(t[i]['id'] == commentThreads[j]);
                                                    if (t[i]['id'] == commentThreads[j]) {
                                                        commentThreadFull.push(t[i])
                                                    }
                                                }
                                            }
                                            // let commentThreadFull = this.state.masterComments.filter(
                                            //     a=>commentThreads.includes(a['id'])
                                            // )


                                            console.log("commentThreadFull: " + commentThreadFull);
                                            this.setState({ comments: commentThreadFull }, () => {
                                                console.log("filter ToRespond")
                                                console.log("this.state.comments: " + this.state.comments);
                                                // this.forceUpdate()
                                                this.sortComments(sortBy);
                                            });

                                            // this.setState({ comments: commentArr }, () => {
                                            //     // for (var i = 0; i < this.state.comments.length; i++) {
                                            //     //     console.log("comment Threads: " + JSON.stringify(this.state.comments[i]))
                                            //     // }
                                            // });
                                        })
                                    }
                                )

                        } else {
                            console.log("No comments to respond to, or have yet to repsond to")
                            var temp = [...this.state.masterComments]
                            this.setState({ comments: temp }, () => {
                                this.sortComments(sortBy);
                            });
                        }

                    }
                )

        }

    }


    getNestedThreadOfComments(commentIDToBeRepliedTo) {
        //commentIDToBeRepliedTo

        var comments = this.state.masterComments
        //terminating recursive condition: when no more comments are replies to any upper level comments
        var replies = []
        var repliesToReturn = []

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

            for (var i = 0; i < commentReplies.length; i++) {
                replies = this.getNestedThreadOfComments(commentReplies[i]['id']);
                repliesToReturn = [...repliesToReturn, ...replies]

            }
            repliesToReturn = [...repliesToReturn, commentIDToBeRepliedTo]

            return repliesToReturn;

        } else {
            return [commentIDToBeRepliedTo];
        }
    }



    followQuestionThread(username, lessonId, commentId) {
        var userFollow = {
            "username": username,
            "lessonId": lessonId,
            "commentId": commentId
        }

        UserFollowingDataService.createUserFollow(userFollow)
            .then(
                response => {
                    console.log("username" + username + " " + "lessonId: " + lessonId + " " + "commentId" + " " + commentId)
                    console.log("in followQuestionThread : response: " + response.data['username'] + " " + response.data['lessonId'] + " " + response.data['commentId'])

                    this.getAndParseFollowedComments(username, lessonId);
                    // this.setState({followedCommentsId: this.getAndParseFollowedComments(username, lessonId)});
                    // this.setState({followedCommentsId:followedCommentsIdArr})
                    // this.setState({userFollow:response.data})
                }
            )
        // this.getAndParseFollowedComments(username, lessonId);
        // this.refreshComments(this.state.filterParameters);
        // this.render();
        // this.forceUpdate();
        // this.forceUpdate();
    }

    unFollowQuestionThread(username, lessonId, commentId) {
        // var userFollow = {
        //     "username": username,
        //     "lessonId": lessonId,
        //     "commentId": commentId
        // }

        UserFollowingDataService.deleteUserFollowUsingEmailAndLessonIdAndCommentId(username, lessonId, commentId)
            .then(
                response => {
                    console.log("username" + username + " " + "lessonId: " + lessonId + " " + "commentId" + " " + commentId)
                    console.log("in unfollowQuestionThread : response: " + response.data['username'] + " " + response.data['lessonId'] + " " + response.data['commentId'])
                    this.getAndParseFollowedComments(username, lessonId);
                }
            )


        // this.refreshComments(this.state.filterParameters);
        // this.render();
        // let followedCommentsArr = this.state.followedCommentsId;
        // followedCommentsArr = followedCommentsArr(x=>x!==commentId);
        // this.setState(
        //     {followedCommentsId:followedCommentsArr}
        // )
        // this.forceUpdate();
        // this.forceUpdate();

    }

    getAndParseFollowedComments(email, lessonId) {
        UserFollowingDataService.getUserFollowUsingEmailAndLessonId(email, lessonId)
            .then(

                response => {
                    if (response !== undefined) {
                        console.log("in getAndParseFollowedComments")
                        var uf = response.data
                        console.log("uf: " + JSON.stringify(uf))


                        this.setState({ userFollow: uf }, () => {
                            console.log("userFollow:" + this.state.userFollow)
                            var followedCommentsIdArr = [];
                            let userFollowArr = [...this.state.userFollow];

                            for (var i = 0; i < userFollowArr.length; i++) {
                                // console.log("userFollowArr[i]: " + userFollowArr[i])
                                followedCommentsIdArr.push(userFollowArr[i]['commentId'])
                                console.log("followedCommentsIdArr: " + followedCommentsIdArr[i])
                            }
                            this.setState({ followedCommentsId: [...followedCommentsIdArr] }, () => {
                                console.log("this.state.followedCommentsId: " + this.state.followedCommentsId)
                            });
                        })

                        // this.setState({ userFollow: uf })
                        // console.log("userFollow: " + this.state.userFollow)




                        // for (var i = 0; i < userFollowArr.length; i++) {
                        //     // console.log("userFollowArr[i]: " + userFollowArr[i])
                        //     // followedCommentsIdArr.push(userFollowArr[i]['commentId'])
                        //     console.log("this.state.followedCommentsId: " + this.state.followedCommentsId[i])
                        // }
                        // return followedCommentsIdArr;
                        // this.setState({ followedCommentsId: followedCommentsIdArr });
                        // console.log("followed comments" + followedCommentsIdArr)
                        // this.forceUpdate();
                    } else {

                        console.log("in getAndParseFollowedComments")
                        var uf = []


                        this.setState({ userFollow: uf }, () => {
                            console.log("userFollow:" + this.state.userFollow)
                            var followedCommentsIdArr = [];
                            let userFollowArr = [...this.state.userFollow];

                            for (var i = 0; i < userFollowArr.length; i++) {
                                // console.log("userFollowArr[i]: " + userFollowArr[i])
                                followedCommentsIdArr.push(userFollowArr[i]['commentId'])
                                console.log("followedCommentsIdArr: " + followedCommentsIdArr[i])
                            }
                            this.setState({ followedCommentsId: [...followedCommentsIdArr] }, () => {
                                console.log("this.state.followedCommentsId: " + this.state.followedCommentsId)
                            });
                        })
                        console.log("User not following any comments in this lesson")
                    }

                }
            )
        // this.forceUpdate();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.followedCommentsId !== this.state.followedCommentsId) {
            console.log('pokemons state has changed.')
            this.refreshComments(this.state.filterParameters, this.state.sortParameters);
        }
    }

    //When Updating(PUT) or Creating(POST) comments
    onSubmit(values) {
        console.log("Urgency level: " + values.urgencyLevel)
        let username = AuthenticationService.getLoggedInUserName()
        let desc = new String(values.description);
        let commentType = "";
        let answered = false;
        if (desc.indexOf('?') != -1) {
            commentType = "question";
            answered = false;

        } else {
            commentType = "statement";
            answered = null;
        }


        // let test = desc.replaceAll("’", "\\’");
        // test =  test.replaceAll("'", "\\'");
        // console.log("this is description " + test)
        // console.log("state.id" + this.state.id);

        this.setState({ targetDate: moment(new Date()).format('YYYY-MM-DDTHH:mm:ss.sssZ') }, () => {

            if (this.state.addComment === true && this.state.addCommentReply === false) {
                console.log("username: " + username)
                console.log("replying to lesson")
                // console.log("comment type:" + commentType);
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
                    username: this.state.username,
                    lessonId: this.state.lessonId,
                    commentType: commentType,
                    answered: answered
                }).then(
                    //When successfully update redirect user to list all Comments
                    () => {
                        // this.props.navigate("/comments")
                        console.log("add lesson comment success")
                        this.setState({
                            successMessage: "Add lesson comment success"
                        }, () => {
                            console.log("comment type:" + commentType);
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
                // console.log("comment type:" + commentType);
                CommentDataService.createComment(username, {
                    //Use state values for those which are carried over from ListComments
                    //Use values. if obtained from Formik.
                    //
                    id: -1,
                    description: desc,
                    urgencyLevel: values.urgencyLevel,
                    inResponseTo: this.state.inResponseTo, //Set inResponseTo to 0 for all top-level replies to a lesson; vary when replying to a comment
                    targetDate: this.state.targetDate,
                    username: this.state.username,
                    lessonId: this.state.lessonId,
                    commentType: commentType,
                    answered: answered
                }).then(
                    //When successfully replied to comment
                    () => {
                        // this.props.navigate("/comments")
                        console.log("replying to comment success")
                        this.setState({
                            successMessage: "replying to comment success"
                        }, () => {
                            console.log("comment type:" + commentType);
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
        })

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
        //counterForFeedbackForm() runs >1 time, remove previous timers for feedback form, only leave 1
        for (var i = 0; i < this.state.intervalIDs.length; i++) {
            console.log("removing intervalID")
            clearInterval(this.state.intervalIDs.pop());

        }

        // let intervalID = setTimeout(this.displayFeedbackForm, 3000);
        //Store intervalID for removal if counterForFeedbackForm() called again
        if (this.state.submittedFeedback === false) {
            this.setState({
                submittedFeedback: true
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



    onSubmitFeedback(values) {
        toast.dismiss()
        this.forceUpdate()
        this.componentDidMount()


        console.log(values.satisfactionLevel + "x" + values.satisfactionFeedback)
        FeedbackDataService.createFeedback(this.state.lessonId, {
            id: -1,
            feedbackRating: values.satisfactionLevel,
            feedbackComment: values.satisfactionFeedback,
            lessonId: this.state.lessonId,
            feedbackDate: moment(new Date()).format('YYYY-MM-DDTHH:mm:ss.sssZ'),
            instructorId: "",

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