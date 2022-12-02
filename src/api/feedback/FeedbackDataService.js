// import axios from "axios";


// class CommentDataService{

//     retrieveAllComments(name){

//         return axios.get(`http://appenv.eba-if84mhyz.us-east-1.elasticbeanstalk.com/users/${name}/comments`);
//     }

//     retrieveComment(name, id){

//         return axios.get(`http://appenv.eba-if84mhyz.us-east-1.elasticbeanstalk.com/users/${name}/comments/${id}`);
//     }

//     deleteComment(name, id){

//         return axios.delete(`http://appenv.eba-if84mhyz.us-east-1.elasticbeanstalk.com/users/${name}/comments/${id}`);
//     }

//     updateComment(name, id, comment){

//         return axios.put(`http://appenv.eba-if84mhyz.us-east-1.elasticbeanstalk.com/users/${name}/comments/${id}`, comment);
//     }

//      createComment(name,  comment){

//         return axios.post(`http://appenv.eba-if84mhyz.us-east-1.elasticbeanstalk.com/users/${name}/comments`, comment);
//     }


// }

// export default new CommentDataService()




import axios from "axios";


class FeedbackDataService{

    retrieveAllFeedback(){

        return axios.get(`http://localhost:8080/feedback`);
    }

    retrieveAllFeedbackForALesson(lessonId){

        return axios.get(`http://localhost:8080/${lessonId}/feedback`);
    }

    deleteFeedback(lessonId, feedbackId){

        return axios.delete(`http://localhost:8080/${lessonId}/feedback/${feedbackId}`);
    }

     createFeedback(lessonId, feedback){

        return axios.post(`http://localhost:8080/${lessonId}/feedback`, feedback);
    }

    


}

export default new FeedbackDataService()