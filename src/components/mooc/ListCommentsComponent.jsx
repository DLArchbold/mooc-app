import React, { Component } from 'react'
//import { Route, Redirect } from 'react-router-dom' //REACT-5


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
                            <tr key = {comment.id}>
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

export default ListCommentsComponent