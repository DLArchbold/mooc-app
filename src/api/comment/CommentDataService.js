import axios from "axios";
import { API_URL, LOCAL_API_URL } from '../../Constants'

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


// class CommentDataService{

//     retrieveAllComments(name){

//         return axios.get(`${LOCAL_API_URL}/users/${name}/comments`);
//     }

//     retrieveComment(name, id){

//         return axios.get(`${LOCAL_API_URL}/users/${name}/comments/${id}`);
//     }

//     deleteComment(name, id){

//         return axios.delete(`${LOCAL_API_URL}/users/${name}/comments/${id}`);
//     }

//     updateComment(name, id, comment){

//         return axios.put(`${LOCAL_API_URL}/users/${name}/comments/${id}`, comment);
//     }

//      createComment(name,  comment){

//         return axios.post(`${LOCAL_API_URL}/users/${name}/comments`, comment);
//     }
// }

// export default new CommentDataService()


// import axios from "axios";


// class CommentDataService{

//     retrieveAllComments(name){

//         return axios.get(`http://localhost:5000/users/${name}/comments`);
//     }

//     retrieveComment(name, id){

//         return axios.get(`http://localhost:5000/users/${name}/comments/${id}`);
//     }

//     deleteComment(name, id){

//         return axios.delete(`http://localhost:5000/users/${name}/comments/${id}`);
//     }

//     updateComment(name, id, comment){

//         return axios.put(`http://localhost:5000/users/${name}/comments/${id}`, comment);
//     }

//      createComment(name,  comment){

//         return axios.post(`http://localhost:5000/users/${name}/comments`, comment);
//     }

    


// }

// export default new CommentDataService()