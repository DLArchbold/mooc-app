import React, { Component } from 'react'
//import { Route, Redirect } from 'react-router-dom' //REACT-5
import CommentDataService from '../../api/comment/CommentDataService.js'
import AuthenticationService from './AuthenticationService.js'
import moment from 'moment/moment'

class ListCommentsComponent extends Component{
    constructor(props){
        super(props)
        this.state={
            comments:
            [
                // {id:1, description: 'Learn React', inResponseTo:0, targetDate:new Date, username: "instructor 1"},
                // {id:2, description: 'Test comment 2',  inResponseTo:1, targetDate:new Date, username: "instructor 1"},
                // {id:3, description: 'Test comment 3', inResponseTo:2, targetDate:new Date, username: "instructor 1"}
            ],
            message: null
        
        }
        this.deleteCommentClicked = this.deleteCommentClicked.bind(this)
        this.updateCommentClicked = this.updateCommentClicked.bind(this)
        this.refreshComments = this.refreshComments.bind(this)
        this.updateCommentClicked = this.updateCommentClicked.bind(this)
        this.addCommentClicked = this.addCommentClicked.bind(this)
    }


    componentDidMount(){
        // let username = AuthenticationService.getLoggedInUserName()
        // CommentDataService.retrieveAllComments(username)
        // .then(
        //     response=>{
        //         // console.log(response)
        //         this.setState({comments:response.data})
        //     }

        // )   
        console.log("componentDidMount")
        this.refreshComments();
        console.log(this.state)
    }

    refreshComments(){
        let username = AuthenticationService.getLoggedInUserName()
        CommentDataService.retrieveAllComments(username)
        .then(
            response=>{
                // console.log(response)
                this.setState({comments:response.data})
            }

        )   
    }


    //When deleting comments
    deleteCommentClicked(id){
        let username = AuthenticationService.getLoggedInUserName()
        // console.log(id + " " + username)
        CommentDataService.deleteComment(username, id)
        .then(
            response=>{
                this.setState({message:`Delete of todo ${id} successful.`})
                this.refreshComments()
            }
        )
    }
    addCommentClicked(){
        console.log("create ") 
        let id = -1
        this.props.navigate(`/comments/${id}`)
      
    }

    updateCommentClicked(id){
        console.log("update " + id) 
        this.props.navigate(`/comments/${id}`)
        // let username = AuthenticationService.getLoggedInUserName()
        // // console.log(id + " " + username)
        // CommentDataService.deleteComment(username, id)
        // .then(
        //     response=>{
        //         this.setState({message:`Delete of todo ${id} successful.`})
        //         this.refreshComments()
        //     }
        // )
    }

    render(){
        return(
        
        <div>
            <h1>List Comments</h1>
            {this.state.message && <div className ="alert alert-success">{this.state.message}</div>}
            <div className="container">
            <table className="table">
                <thead>
                    <tr>
                        <th>id</th>
                        <th>description</th>
                        <th>in response to comment</th>
                        <th>Target Date</th>
                        <th>Commenter</th>
                        <th>Lesson ID</th>
                        <th>Update</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        this.state.comments.map(
                            comment =>
                            <tr key = {comment.id}>
                        <td>{comment.id}</td>
                        <td>{comment.description}</td>
                        <td>{comment.inResponseTo}</td>
                        <td>{moment(comment.targetDate).format('YYYY-MM-DD')}</td>
                        <td>{comment.username}</td>
                        <td>{comment.lessonId}</td>
                        <td><button className = "btn btn-success" onClick={()=> this.updateCommentClicked(comment.id)}>Update</button></td>
                        <td><button className = "btn btn-warning" onClick={()=> this.deleteCommentClicked(comment.id)}>Delete</button></td>
                    </tr>
                        )
                    }
                </tbody>
            </table>
            <div className="row">
                <button className='btn btn-success' onClick={this.addCommentClicked}>Add comment</button>
            </div>
            </div>
        </div>
        )
    }
    
}

export default ListCommentsComponent