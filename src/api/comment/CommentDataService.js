import axios from "axios";
import { REMOTE_API_URL, LOCAL_API_URL , FLAG} from '../../Constants'

class CommentDataService{

    urlType = FLAG;
    //  API_URL = LOCAL_API_URL;

     getUrl(urlType){
        if (urlType ==="l"){
            return LOCAL_API_URL;
        }else if (urlType === "r"){
            return REMOTE_API_URL;
        }
     }




    retrieveAllComments(){
        let API_URL = this.getUrl(this.urlType)
        return axios.get(`${API_URL}/users/comments`);
    }

    retrieveComment(name, id){
        let API_URL = this.getUrl(this.urlType)
        return axios.get(`${API_URL}/users/${name}/comments/${id}`);
        
        
    }

    retrieveCommentsByLessonId(lessonId){
        let API_URL = this.getUrl(this.urlType);
        return axios.get(`${API_URL}/users/comments/${lessonId}/all`)
  
    }

    retrieveTopLevelCommentsByLessonId(lessonId){
        let API_URL = this.getUrl(this.urlType);
        return axios.get(`${API_URL}/users/comments/${lessonId}/all/toplevel`)
  
    }

    retrieveTopLevelCommentsByLessonIdByEmail(email, inResponseTo, lessonId){
        let API_URL = this.getUrl(this.urlType);
        return axios.get(`${API_URL}/users/comments/${lessonId}/${email}/all/toplevel`)
    }


    retrieveTopLevelCommentsByLessonIdByEmailToRespond(email, lessonId){
        let API_URL = this.getUrl(this.urlType);
        return axios.get(`${API_URL}/users/comments/${lessonId}/${email}/all/toplevel/ToRespond`)
    }




    deleteComment(name, id){
        let API_URL = this.getUrl(this.urlType)
        return axios.delete(`${API_URL}/users/${name}/comments/${id}`);
        
        
    }

    updateComment(name, id, comment){
        let API_URL = this.getUrl(this.urlType)
        return axios.put(`${API_URL}/users/${name}/comments/${id}`, comment);
        
        
    }

     createComment(name,  comment){
        let API_URL = this.getUrl(this.urlType)
        return axios.post(`${API_URL}/users/${name}/comments`, comment);
        
       
    }
}

export default new CommentDataService()
