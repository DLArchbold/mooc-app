

import axios from "axios";
import { REMOTE_API_URL, LOCAL_API_URL } from '../../Constants'
class FeedbackDataService{
    urlType = "l";

    
    getUrl(urlType){
        if (urlType ==="l"){
            return LOCAL_API_URL;
        }else if (urlType === "r"){
            return REMOTE_API_URL;
        }
     }
    retrieveAllFeedback(){
        let API_URL = this.getUrl(this.urlType)
            return axios.get(`${API_URL}/feedback`);
        
       
    }

    retrieveAllFeedbackForALesson(lessonId){
        let API_URL = this.getUrl(this.urlType)
            return axios.get(`${API_URL}/${lessonId}/feedback`);
        
        
    }

    deleteFeedback(lessonId, feedbackId){
        let API_URL = this.getUrl(this.urlType)
            return axios.delete(`${API_URL}/${lessonId}/feedback/${feedbackId}`);
        
       
    }

     createFeedback(lessonId, feedback){
        let API_URL = this.getUrl(this.urlType)
            return axios.post(`${API_URL}/${lessonId}/feedback`, feedback);
        
        
    }
}

export default new FeedbackDataService()
