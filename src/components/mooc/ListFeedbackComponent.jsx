import React, { Component } from 'react'
//import { Route, Redirect } from 'react-router-dom' //REACT-5
import CommentDataService from '../../api/comment/CommentDataService.js'
import AuthenticationService from './AuthenticationService.js'
import moment from 'moment/moment'
import FeedbackDataService from '../../api/feedback/FeedbackDataService.js'
import { Formik, Field, Form, ErrorMessage } from 'formik'
import "../../ListFeedbackComponent.css"


class ListFeedbackComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            feedback:
                [
                    // {id:1, description: 'Learn React', inResponseTo:0, targetDate:new Date, username: "instructor 1"},
                    // {id:2, description: 'Test comment 2',  inResponseTo:1, targetDate:new Date, username: "instructor 1"},
                    // {id:3, description: 'Test comment 3', inResponseTo:2, targetDate:new Date, username: "instructor 1"}
                ],
            message: null,
            test: "",
            lesson: -1
        }
        this.deleteFeedbackClicked = this.deleteFeedbackClicked.bind(this)
        // this.updateCommentClicked = this.updateCommentClicked.bind(this)
        this.refreshFeedback = this.refreshFeedback.bind(this)
        this.displayFeedbackForALesson = this.displayFeedbackForALesson.bind(this)
        // this.updateCommentClicked = this.updateCommentClicked.bind(this)
        // this.addCommentClicked = this.addCommentClicked.bind(this)
        this.filterFeedback = this.filterFeedback.bind(this)
    }


    componentDidMount() {
        // let username = AuthenticationService.getLoggedInUserName()
        // CommentDataService.retrieveAllComments(username)
        // .then(
        //     response=>{
        //         // console.log(response)
        //         this.setState({comments:response.data})
        //     }

        // )   
        // if(selectedValue!=null){

        // }
        console.log("componentDidMount")
        // console.log(selectedValue)
        if (this.state.feedback.length == 0) {
            this.refreshFeedback();
        }

        // console.log(this.state)
    }

    refreshFeedback() {
        let username = AuthenticationService.getLoggedInUserName()
        FeedbackDataService.retrieveAllFeedback()
            .then(
                response => {
                    // console.log(response)
                    this.setState({ feedback: response.data })
                }

            )
    }


    //When deleting comments
    deleteFeedbackClicked(id) {
        let username = AuthenticationService.getLoggedInUserName()
        // console.log(id + " " + username)
        FeedbackDataService.deleteFeedback(1, id)
            .then(
                response => {
                    this.setState({ message: `Delete of todo ${id} successful.` })
                    this.refreshFeedback()
                }
            )
    }
    // addCommentClicked(){
    //     console.log("create ") 
    //     let id = -1
    //     this.props.navigate(`/comments/${id}`)

    // }

    // updateCommentClicked(id){
    //     console.log("update " + id) 
    //     this.props.navigate(`/comments/${id}`)
    //     // let username = AuthenticationService.getLoggedInUserName()
    //     // // console.log(id + " " + username)
    //     // CommentDataService.deleteComment(username, id)
    //     // .then(
    //     //     response=>{
    //     //         this.setState({message:`Delete of todo ${id} successful.`})
    //     //         this.refreshComments()
    //     //     }
    //     // )
    // }
    displayFeedbackForALesson() {
        // FeedbackDataService.retrieveAllFeedbackForALesson(lessonId)
        // .then(
        //     response => {
        //         // console.log(response)
        //         this.setState({ feedback: response.data })
        //     }
        // )
        console.log("x")
        // this.setState({
        //     test:" " 
        // })

    }

    // componentDidUpdate(prevProps) {
    //     // Typical usage (don't forget to compare props):
    //     if (this.props.feedback !== prevProps.feedback) {
    //         FeedbackDataService.retrieveAllFeedbackForALesson(lessonId)
    //             .then(
    //                 response => {
    //                     // console.log(response)
    //                     this.setState({ feedback: response.data })
    //                 }
    //             )

    //     }
    // }


    filterFeedback(values){
        // FeedbackDataService.retrieveAllFeedbackForALesson(values.lesson)
        // .then(
        //     // response=>{
        //     //     this.setState({
        //     //         feedback: response.data,
        //     //         lesson: values.lesson
        //     //     })

        //         response => this.setState({
        //             description: response.data.description,
        //             inResponseTo: response.data.inResponseTo,
        //             username: retrievedUsername
        //         }
        //         )
            
        // )

        FeedbackDataService.retrieveAllFeedbackForALesson(values.lesson)
        .then(
            response => {
                // console.log(response)
                this.setState({ feedback: response.data })
            }

        )
    }

    render() {

        let { lesson} = this.state
        return (

            <div className='filterMain'>
                <h1>List Feedback for lesson</h1>
                <div className='actualFilterForm'>
                <Formik 
                    initialValues={{ lesson }}
                    onSubmit={this.filterFeedback}
                    validateOnBlur={false}
                    validateOnChange={false}
                    // validate={this.validate}
                    enableReinitialize={true}
                >
                    {
                        (props) => (
                            <Form className='filterFeedbackForm'>
                                <ErrorMessage name="description" component="div"
                                    className="alert alert-warning" />
                                {/* <ErrorMessage name="inResponseTo" component="div"
className="alert alert-warning" /> */}
                                <fieldset className="form-group">
                                    <label>List feedback for lesson</label>
                                    <Field className="form-control" type="text" name="lesson" />
                                </fieldset>
                                <button className="btn btn-success filter" type="submit">Filter feedback</button>
                            </Form>
                        )
                    }

                </Formik>


                </div>
                {/* <select name="lesson" id="plan">
                    <option >Lesson</option>
                    <option value="1">Lesson 1</option>
                    <option value="2">Lesson 2</option>
                </select> */}
                {this.state.message && <div className="alert alert-success">{this.state.message}</div>}
                <div className="container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Lesson ID</th>
                                <th>Feedback rating</th>
                                <th>Feedback comment</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.feedback.map(
                                    feedback =>
                                        <tr key={feedback.id}>
                                            <td>{feedback.lessonId}</td>
                                            <td>{feedback.feedbackRating}</td>
                                            <td>{feedback.feedbackComment}</td>
                                            {/* <td><button className = "btn btn-success" onClick={()=> this.updateCommentClicked(comment.id)}>Update</button></td> */}
                                            <td><button className="btn btn-warning" onClick={() => this.deleteFeedbackClicked(feedback.id)}>Delete</button></td>
                                        </tr>
                                )
                            }
                        </tbody>
                    </table>
                    {/* <div className="row">
                <button className='btn btn-success' onClick={this.addFeedbackClicked}>Add comment</button>
            </div> */}
                </div>
            </div>
        )
    }

}

export default ListFeedbackComponent