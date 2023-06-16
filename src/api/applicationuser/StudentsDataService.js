

import axios from "axios";
import { REMOTE_API_URL, LOCAL_API_URL, AUTH_URL, FLAG, reqInstance } from '../../Constants'
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
    retrieveAllStudents(){
        //let API_URL = this.getUrl(this.urlType)
        // return Promise.resolve({data:[
        //     {'id':1, 'email':'Student1@gatech.edu', 'name': 'Student 1', 'lessonId': 1, 'interests': 'data science, ML, Computer vision'},
        //     {'id':2, 'email':'Student2@gatech.edu', 'name': 'Student 2', 'lessonId': 2, 'interests': 'Web development, IoT'}
        // ]})
            return this.request.get(this.API_URL+ `/students`);
    }

    retrieveAllStudentsForALesson(lessonId){
        //let API_URL = this.getUrl(this.urlType)
            return this.request.get(this.API_URL+ `/students/lessonId/${lessonId}`);
    }

    retrieveAllStudentsForInterest(interest){
        //let API_URL = this.getUrl(this.urlType)
            return this.request.get(this.API_URL+ `/students/interests/${interest}`);
    }
}

export default new FeedbackDataService()
