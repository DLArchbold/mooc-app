import axios from "axios";
import { API_URL } from '../../Constants'

class CommentDataService{

    retrieveAllComments(name){

        return axios.get(`${API_URL}/users/${name}/comments`);
    }

    retrieveComment(name, id){

        return axios.get(`${API_URL}/users/${name}/comments/${id}`);
    }

    deleteComment(name, id){

        return axios.delete(`${API_URL}/users/${name}/comments/${id}`);
    }

    updateComment(name, id, comment){

        return axios.put(`${API_URL}/users/${name}/comments/${id}`, comment);
    }

     createComment(name,  comment){

        return axios.post(`${API_URL}/users/${name}/comments`, comment);
    }


}

export default new CommentDataService()




// import axios from "axios";


// class CommentDataService{

//     retrieveAllComments(name){

//         return axios.get(`http://localhost:8080/users/${name}/comments`);
//     }

//     retrieveComment(name, id){

//         return axios.get(`http://localhost:8080/users/${name}/comments/${id}`);
//     }

//     deleteComment(name, id){

//         return axios.delete(`http://localhost:8080/users/${name}/comments/${id}`);
//     }

//     updateComment(name, id, comment){

//         return axios.put(`http://localhost:8080/users/${name}/comments/${id}`, comment);
//     }

//      createComment(name,  comment){

//         return axios.post(`http://localhost:8080/users/${name}/comments`, comment);
//     }

    


// }

// export default new CommentDataService()