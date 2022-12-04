import { API_URL } from '../../Constants'

import axios from "axios";


class FeedbackDataService{

    retrieveAllFeedback(){

        return axios.get(`${API_URL}/feedback`);
    }

    retrieveAllFeedbackForALesson(lessonId){

        return axios.get(`${API_URL}/${lessonId}/feedback`);
    }

    deleteFeedback(lessonId, feedbackId){

        return axios.delete(`${API_URL}/${lessonId}/feedback/${feedbackId}`);
    }

     createFeedback(lessonId, feedback){

        return axios.post(`${API_URL}/${lessonId}/feedback`, feedback);
    }

    


}

export default new FeedbackDataService()




// import axios from "axios";


// class FeedbackDataService{

//     retrieveAllFeedback(){

//         return axios.get(`http://localhost:8080/feedback`);
//     }

//     retrieveAllFeedbackForALesson(lessonId){

//         return axios.get(`http://localhost:8080/${lessonId}/feedback`);
//     }

//     deleteFeedback(lessonId, feedbackId){

//         return axios.delete(`http://localhost:8080/${lessonId}/feedback/${feedbackId}`);
//     }

//      createFeedback(lessonId, feedback){

//         return axios.post(`http://localhost:8080/${lessonId}/feedback`, feedback);
//     }

    


// }

// export default new FeedbackDataService()