import axios from "axios";
import { REMOTE_API_URL, LOCAL_API_URL, FLAG, reqInstance } from '../../Constants'

class CourseDataService{
    constructor(){
        this.urlType = FLAG;
        this.API_URL = this.getUrl(this.urlType);
        this.request = reqInstance;
    }
    // urlType = FLAG;
    //  API_URL = LOCAL_API_URL;

     getUrl(urlType){
        if (urlType ==="l"){
            return LOCAL_API_URL;
        }else if (urlType === "r"){
            return REMOTE_API_URL;
        }
     }




    retrieveAllCourses(){
        //let API_URL = this.getUrl(this.urlType)
        return this.request.get(this.API_URL+ `/course/get/all`);
    }

    // retrieveComment(name, id){
    //     let API_URL = this.getUrl(this.urlType)
    //     return this.request.get(this.API_URL+ `/users/${name}/comments/${id}`);
        
        
    // }

    retrieveCourseByCourseId(courseId){
        //let API_URL = this.getUrl(this.urlType);
        return this.request.get(this.API_URL+ `/course/get/${courseId}`)
  
    }

    // retrieveTopLevelCommentsByLessonId(lessonId){
    //     let API_URL = this.getUrl(this.urlType);
    //     return this.request.get(this.API_URL+ `/users/comments/${lessonId}/all/toplevel`)
  
    // }

    // retrieveTopLevelCommentsByLessonIdByEmail(email, inResponseTo, lessonId){
    //     let API_URL = this.getUrl(this.urlType);
    //     return this.request.get(this.API_URL+ `/users/comments/${lessonId}/${email}/all/toplevel`)
    // }


    retrieveCourseByInstructorApplicationUserId(instructorApplicationUserId){
        //let API_URL = this.getUrl(this.urlType);
        return this.request.get(this.API_URL+ `/course/get/usingInstructorApplicationUserId/${instructorApplicationUserId}`)
        .catch(function (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(error.response.data);
                // console.log(error.reponse.status);
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

     createCourse(course){
        //let API_URL = this.getUrl(this.urlType)
        return this.request.post(this.API_URL+ `/course/create`, course);
        
       
    }
}

export default new CourseDataService()
