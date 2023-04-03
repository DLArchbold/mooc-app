
import axios from "axios";
import { REMOTE_API_URL, LOCAL_API_URL } from '../../Constants'


class AuthenticationService {


    urlType = "l";
    //  API_URL = LOCAL_API_URL;

    getUrl(urlType) {
        if (urlType === "l") {
            return LOCAL_API_URL;
        } else if (urlType === "r") {
            return REMOTE_API_URL;
        }

    }

    checkIfApplicationUserExists(applicationUser) {

        // var headers = {
        //     'Content-Type': 'application/json',
        //         'Access-Control-Allow-Origin': '*',
        //         'Access-Control-Allow-Methods': 'POST',
        // };
        console.log("test")
        let API_URL = this.getUrl(this.urlType)
        // return axios.get(`${API_URL}/application_user/get`, applicationUser);
        return axios.get(`${API_URL}/application_user/get/usingEmail/${applicationUser['email']}`)
            .catch(function(error) {
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    console.log(error.response.data);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                } else if (error.request) {
                    // The request was made but no response was received
                    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                    // http.ClientRequest in node.js
                    console.log(error.request);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log('Error', error.message);
                }
                console.log(error.config);
            });

        // return axios.get(`${API_URL}/application_user/get/${applicationUserId}`);
    }

    authenticateApplicationUser(applicationUser){
        console.log("test")
        let API_URL = this.getUrl(this.urlType)
        // return axios.get(`${API_URL}/application_user/get`, applicationUser);
        return axios.get(`${API_URL}/application_user/get/authenticate/${applicationUser['email']}/${applicationUser['password']}`)
            .catch(function(error) {
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    console.log(error.response.data);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                } else if (error.request) {
                    // The request was made but no response was received
                    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                    // http.ClientRequest in node.js
                    console.log(error.request);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log('Error', error.message);
                }
                console.log(error.config);
            });

    }

    createUser(applicationUser){
        let API_URL = this.getUrl(this.urlType)
        return axios.post(`${API_URL}/application_user/create`, applicationUser);
        
    }
    


    
    registerSuccessfulLogin(username, password) {
        console.log("registerSuccessfulLogin")
        sessionStorage.setItem('authenticatedUser', username);


    }
    logout() {
        sessionStorage.removeItem('authenticatedUser');
    }

    isUserLoggedIn() {
        let user = sessionStorage.getItem('authenticatedUser');
        if (user === null) return false;
        return true;
    }

    getLoggedInUserName() {
        let user = sessionStorage.getItem('authenticatedUser');
        if (user == null) return '';
        return user;
    }

}

export default new AuthenticationService()