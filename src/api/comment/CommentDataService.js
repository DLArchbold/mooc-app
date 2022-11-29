// import axios from "axios";


// class CommentDataService{

//     retrieveAllComments(name){

//         return axios.get(`http://moocappjar.eba-if84mhyz.us-east-1.elasticbeanstalk.com/users/${name}/comments`);
//     }

//     retrieveComment(name, id){

//         return axios.get(`http://moocappjar.eba-if84mhyz.us-east-1.elasticbeanstalk.com/users/${name}/comments/${id}`);
//     }

//     deleteComment(name, id){

//         return axios.delete(`http://moocappjar.eba-if84mhyz.us-east-1.elasticbeanstalk.com/${name}/comments/${id}`);
//     }

//     updateComment(name, id, comment){

//         return axios.put(`http://moocappjar.eba-if84mhyz.us-east-1.elasticbeanstalk.com/users/${name}/comments/${id}`, comment);
//     }

//      createComment(name,  comment){

//         return axios.post(`http://moocappjar.eba-if84mhyz.us-east-1.elasticbeanstalk.com/${name}/comments`, comment);
//     }


// }

// export default new CommentDataService()




import axios from "axios";


class CommentDataService{

    retrieveAllComments(name){

        return axios.get(`http://localhost:8080/users/${name}/comments`);
    }

    retrieveComment(name, id){

        return axios.get(`http://localhost:8080/users/${name}/comments/${id}`);
    }

    deleteComment(name, id){

        return axios.delete(`http://localhost:8080/users/${name}/comments/${id}`);
    }

    updateComment(name, id, comment){

        return axios.put(`http://localhost:8080/users/${name}/comments/${id}`, comment);
    }

     createComment(name,  comment){

        return axios.post(`http://localhost:8080/users/${name}/comments`, comment);
    }


}

export default new CommentDataService()