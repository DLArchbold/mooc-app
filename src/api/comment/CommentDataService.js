import axios from "axios";
import { REMOTE_API_URL, LOCAL_API_URL, FLAG, reqInstance} from '../../Constants'

class CommentDataService {

    constructor(){
        this.urlType = FLAG;
        this.API_URL = this.getUrl(this.urlType);
        this.request = reqInstance;
    }
    
    //  API_URL = LOCAL_API_URL;

    getUrl(urlType) {
        if (urlType === "l") {
            return LOCAL_API_URL;
        } else if (urlType === "r") {
            return REMOTE_API_URL;
        }
    }

    
  


    retrieveAllComments() {
        // let API_URL = this.getUrl(this.urlType)
        // let reqInstance = axios.create({
        //     headers: {
        //         Authorization: "Bearer " + sessionStorage.getItem("accessToken")
        //     }
        // })
        // console.log(this.API_URL)
        return this.request.get(this.API_URL+ `/users/comments`);
    }

    retrieveComment(name, id) {
        // let API_URL = this.getUrl(this.urlType)
        return this.request.get(this.API_URL+ `/users/${name}/comments/${id}`);


    }

    retrieveCommentsByLessonId(lessonId) {
        // let API_URL = this.getUrl(this.urlType);
        return this.request.get(this.API_URL+ `/users/comments/${lessonId}/all`)

    }

    retrieveTopLevelCommentsByLessonId(lessonId) {
        // let API_URL = this.getUrl(this.urlType);
        return this.request.get(this.API_URL+ `/users/comments/${lessonId}/all/toplevel`)

    }

    retrieveTopLevelCommentsByLessonIdByEmail(email, inResponseTo, lessonId) {
        // let API_URL = this.getUrl(this.urlType);
        return this.request.get(this.API_URL+ `/users/comments/${lessonId}/${email}/all/toplevel`)
    }


    retrieveTopLevelCommentsByLessonIdByEmailToRespond(email, lessonId) {
        // let API_URL = this.getUrl(this.urlType);
        return this.request.get(this.API_URL+ `/users/comments/${lessonId}/${email}/all/toplevel/ToRespond`)
    }




    deleteComment(name, id) {
        // let API_URL = this.getUrl(this.urlType)
        return this.request.delete(this.API_URL+ `/users/${name}/comments/${id}`);


    }

    updateComment(name, id, comment) {
        // let API_URL = this.getUrl(this.urlType)
        return this.request.put(this.API_URL+ `/users/${name}/comments/${id}`, comment);


    }

    createComment(name, comment) {
        // let API_URL = this.getUrl(this.urlType)
        return this.request.post(this.API_URL+ `/users/${name}/comments`, comment);


    }
}

export default new CommentDataService()
