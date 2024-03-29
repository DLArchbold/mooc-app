
import axios from "axios";
import { REMOTE_API_URL, LOCAL_API_URL, FLAG } from '../../Constants'
import queryString from 'qs';

class AuthenticationService {


    urlType = FLAG;
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
            .catch(function (error) {
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

    authenticateApplicationUser(applicationUser) {
        console.log("test")
        let API_URL = this.getUrl(this.urlType)
        // return axios.get(`${API_URL}/application_user/get`, applicationUser);
        return axios.get(`${API_URL}/application_user/get/authenticate/${applicationUser['email']}/${applicationUser['password']}`)
            .catch(function (error) {
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


    findUserByApplicationUserId(applicationUserId) {
        let API_URL = this.getUrl(this.urlType)
        return axios.get(`${API_URL}/application_user/get/${applicationUserId}`);
    }


    createUser(applicationUser) {
        let API_URL = this.getUrl(this.urlType)
        return axios.post(`${API_URL}/application_user/create`, applicationUser);

    }




    registerSuccessfulLogin(response) {
        console.log("registerSuccessfulLogin")

        //To check response values, after logging in using Keycloak SSO
        //go to developer console-> Network top tab -> token side tab under name column-> Response sub-top tab

        sessionStorage.setItem('accessToken', response.data.access_token);
        sessionStorage.setItem('refreshToken', response.data.refresh_token);
        sessionStorage.setItem('idToken', response.data.id_token);
        sessionStorage.setItem('sessionState', response.data.session_state);
        sessionStorage.setItem('scope', response.data.scope);

        var reqInstance = axios.create({
            headers: {
                Authorization: "Bearer " + response.data.access_token
            }
        })

        reqInstance.get("http://localhost:8080/auth/realms/mooc-app/protocol/openid-connect/userinfo")
            .then(
                response => {
                    sessionStorage.setItem('authenticatedUser', response.data.preferred_username)
                    return response.data.preferred_username
                   
                }
            );
        // return sessionStorage.getItem('authenticatedUser');

    }


    logout() {

        // https://stackoverflow.com/questions/46689034/logout-user-via-keycloak-rest-api-doesnt-work

        // let reqInstance = axios.create({
        //     headers: {
        //       Authorization: "Bearer " + sessionStorage.getItem("accessToken"),
        //       "Access-Control-Allow-Origin": "*"
        //     }
        //   })
        var request_data = {

            "client_id": "mooc-app-PKCE-client",
            "refresh_token": sessionStorage.getItem('refreshToken')
        };


        axios.post('http://localhost:8080/auth/realms/mooc-app/protocol/openid-connect/logout', queryString.stringify(request_data))
            .then(
                response => {

                    // this.setState({ accessToken: response.data.access_token }, () => {
                    //   // console.log("this.state.accessToken: " + this.state.accessToken)

                    //   AuthenticationService.registerSuccessfulLogin(this.state.email, this.state.password, response)
                    //   // this.props.history.push("/welcome")
                    //   //use ticks not single quotes
                    //   this.props.navigate(`/welcome/${this.state.email}`)
                    // })


                }
            );

        sessionStorage.removeItem('authenticatedUser');
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('refreshToken');
        sessionStorage.removeItem('idToken');
        sessionStorage.removeItem('sessionState');
        sessionStorage.removeItem('scope');
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