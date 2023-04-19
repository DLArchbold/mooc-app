import axios from "axios";
import { REMOTE_API_URL, LOCAL_API_URL, FLAG } from '../../Constants'

class EnrolledDataService{

    urlType = FLAG;
    //  API_URL = LOCAL_API_URL;

     getUrl(urlType){
        if (urlType ==="l"){
            return LOCAL_API_URL;
        }else if (urlType === "r"){
            return REMOTE_API_URL;
        }
     }




    // retrieveAllCourses(){
    //     let API_URL = this.getUrl(this.urlType)
    //     return axios.get(`${API_URL}/course/get/all`);
    // }

    // retrieveComment(name, id){
    //     let API_URL = this.getUrl(this.urlType)
    //     return axios.get(`${API_URL}/users/${name}/comments/${id}`);
        
        
    // }

    retrieveCommentsByUsername(lessonId){
        let API_URL = this.getUrl(this.urlType);
        return axios.get(`${API_URL}/users/comments/${lessonId}/all`)
  
    }

    // retrieveTopLevelCommentsByLessonId(lessonId){
    //     let API_URL = this.getUrl(this.urlType);
    //     return axios.get(`${API_URL}/users/comments/${lessonId}/all/toplevel`)
  
    // }

    // retrieveTopLevelCommentsByLessonIdByEmail(email, inResponseTo, lessonId){
    //     let API_URL = this.getUrl(this.urlType);
    //     return axios.get(`${API_URL}/users/comments/${lessonId}/${email}/all/toplevel`)
    // }


    retrieveEnrolledByCourseIdAndUsername(enrolled){
        let API_URL = this.getUrl(this.urlType);
        return axios.get(`${API_URL}/enrolled/get/byCourseIdByUsername/${enrolled['courseId']}/${enrolled['username']}`)
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
    retrieveEnrolledByUsername(username){
        let API_URL = this.getUrl(this.urlType);
        return axios.get(`${API_URL}/enrolled/get/byUsername/${username}`)
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



    deleteEnrolled(enrolledId){
        let API_URL = this.getUrl(this.urlType)
        return axios.delete(`${API_URL}/enrolled/delete/${enrolledId}`);
        
        
    }

    // updateComment(name, id, comment){
    //     let API_URL = this.getUrl(this.urlType)
    //     return axios.put(`${API_URL}/users/${name}/comments/${id}`, comment);
        
        
    // }

     createEnrolled(enrolled){
        let API_URL = this.getUrl(this.urlType)
        return axios.post(`${API_URL}/enrolled/create`, enrolled);
        
       
    }
}

export default new EnrolledDataService()
