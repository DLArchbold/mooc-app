import axios from "axios";
import { REMOTE_API_URL, LOCAL_API_URL } from '../../Constants'

class CourseDataService{

     urlType = "l";
    //  API_URL = LOCAL_API_URL;

     getUrl(urlType){
        if (urlType ==="l"){
            return LOCAL_API_URL;
        }else if (urlType === "r"){
            return REMOTE_API_URL;
        }
     }




    retrieveAllCourses(){
        let API_URL = this.getUrl(this.urlType)
        return axios.get(`${API_URL}/course/get/all`);
    }

    // retrieveComment(name, id){
    //     let API_URL = this.getUrl(this.urlType)
    //     return axios.get(`${API_URL}/users/${name}/comments/${id}`);
        
        
    // }

    retrieveCourseByCourseId(courseId){
        let API_URL = this.getUrl(this.urlType);
        return axios.get(`${API_URL}/course/get/${courseId}`)
  
    }

    // retrieveTopLevelCommentsByLessonId(lessonId){
    //     let API_URL = this.getUrl(this.urlType);
    //     return axios.get(`${API_URL}/users/comments/${lessonId}/all/toplevel`)
  
    // }

    // retrieveTopLevelCommentsByLessonIdByEmail(email, inResponseTo, lessonId){
    //     let API_URL = this.getUrl(this.urlType);
    //     return axios.get(`${API_URL}/users/comments/${lessonId}/${email}/all/toplevel`)
    // }


    retrieveCourseByInstructorApplicationUserId(instructorApplicationUserId){
        let API_URL = this.getUrl(this.urlType);
        return axios.get(`${API_URL}/course/get/usingInstructorApplicationUserId/${instructorApplicationUserId}`)
    }




    // deleteComment(name, id){
    //     let API_URL = this.getUrl(this.urlType)
    //     return axios.delete(`${API_URL}/users/${name}/comments/${id}`);
        
        
    // }

    // updateComment(name, id, comment){
    //     let API_URL = this.getUrl(this.urlType)
    //     return axios.put(`${API_URL}/users/${name}/comments/${id}`, comment);
        
        
    // }

     createCourse(course){
        let API_URL = this.getUrl(this.urlType)
        return axios.post(`${API_URL}/course/create`, course);
        
       
    }
}

export default new CourseDataService()
