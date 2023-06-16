

import axios from "axios";
import { REMOTE_API_URL, LOCAL_API_URL, FLAG, reqInstance } from '../../Constants'
class FeedbackDataService{
    constructor(){
        this.urlType = FLAG;
        this.API_URL = this.getUrl(this.urlType);
        this.request = reqInstance;
    }
    // urlType = FLAG;

    
    getUrl(urlType){
        if (urlType ==="l"){
            return LOCAL_API_URL;
        }else if (urlType === "r"){
            return REMOTE_API_URL;
        }
     }
    retrieveAllFeedback(){
        //let API_URL = this.getUrl(this.urlType)
            return this.request.get(this.API_URL+ `/feedback`);
        
       
    }

    retrieveAllFeedbackForALesson(lessonId){
        //let API_URL = this.getUrl(this.urlType)
            return this.request.get(this.API_URL+ `/${lessonId}/feedback`);
        
        
    }

    retreieveFeedbackByCourseGroupedByLesson(courseId){
        //let API_URL = this.getUrl(this.urlType)
        return this.request.get(this.API_URL+ `/feedback/getFeedbackForEachLessonInCourse/${courseId}`)
    }

    // retreieveFeedbackByCourseGroupedByLessonByDates(courseId, startDate, endDate){
    //     let API_URL = this.getUrl(this.urlType)

    //     if(startDate === ""){
    //         startDate = "undefined"
    //     }
    //     if(endDate===""){
    //         endDate = "undefined"
    //     }
    //     return this.request.get(this.API_URL+ `/feedback/getFeedbackForEachLessonInCourse/${courseId}/${startDate}/${endDate}`)
    // }



    deleteFeedback(lessonId, feedbackId){
        //let API_URL = this.getUrl(this.urlType)
            return this.request.delete(this.API_URL+ `/${lessonId}/feedback/${feedbackId}`);
        
       
    }

     createFeedback(lessonId, feedback){
        //let API_URL = this.getUrl(this.urlType)
            return this.request.post(this.API_URL+ `/${lessonId}/feedback`, feedback);
        
        
    }



}

export default new FeedbackDataService()
