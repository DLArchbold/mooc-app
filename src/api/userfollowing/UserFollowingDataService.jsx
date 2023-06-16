import axios from "axios";
import { REMOTE_API_URL, LOCAL_API_URL, FLAG, reqInstance } from '../../Constants'

class UserFollowingDataService{
    constructor(){
        this.urlType = FLAG;
        this.API_URL = this.getUrl(this.urlType);
        this.request = reqInstance;
    }
    //  urlType = FLAG;
    //  API_URL = LOCAL_API_URL;

     getUrl(urlType){
        if (urlType ==="l"){
            return LOCAL_API_URL;
        }else if (urlType === "r"){
            return REMOTE_API_URL;
        }
     }
    createUserFollow(userFollow){
        //let API_URL = this.getUrl(this.urlType);
        return this.request.post(this.API_URL+ `/user_follow/create`, userFollow)
        .catch(function(error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(error.response.data);
                console.log(error.reponse.status);
                console.log(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
            }
            console.log(error.config);
        });
    }

    getUserFollowUsingEmailAndLessonId(email, lessonId){
        //let API_URL = this.getUrl(this.urlType);
        return this.request.get(this.API_URL+ `/user_follow/get/usingEmailAndLessonId/${email}/${lessonId}`)
        .catch(function(error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(error.response.data);
                // console.log(error.reponse.status);
                // console.log(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
            }
            console.log(error.config);
        });
    }

    deleteUserFollowUsingEmailAndLessonIdAndCommentId(email, lessonId, commentId){
        //let API_URL = this.getUrl(this.urlType);
        return this.request.delete(this.API_URL+ `/user_follow/delete/${email}/${lessonId}/${commentId}`)
        .catch(function(error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(error.response.data);
                console.log(error.reponse.status);
                console.log(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
            }
            console.log(error.config);
        });
    }
    




    // deleteComment(name, id){
    //     let API_URL = this.getUrl(this.urlType)
    //     return this.request.delete(this.API_URL+ `/users/${name}/comments/${id}`);
        
        
    // }

    // updateComment(name, id, comment){
    //     let API_URL = this.getUrl(this.urlType)
    //     return this.request.put(this.API_URL+ `/users/${name}/comments/${id}`, comment);
        
        
    // }

    //  createComment(name,  comment){
    //     let API_URL = this.getUrl(this.urlType)
    //     return this.request.post(this.API_URL+ `/users/${name}/comments`, comment);
// }
       
    
}

export default new UserFollowingDataService()
