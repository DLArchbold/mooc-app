import axios from "axios"

/* For Best Practices https://create-react-app.dev/docs/adding-custom-environment-variables/*/
export const REMOTE_API_URL = 'http://ec2-100-26-240-90.compute-1.amazonaws.com:5000'
export const LOCAL_API_URL = "http://localhost:8082"
export const AUTH_URL = "http://localhost:8080"

// export const FLAG = "r"
export const FLAG = "l"



 

export const reqInstance = axios.create({
    headers: {
        Authorization: "Bearer " + sessionStorage.getItem("accessToken")
    }
})




// export const JPA_API_URL = `${API_URL}/jpa`

// export const PREV_API_URL = 'http://Test2-env.eba-8eun5rj8.us-east-1.elasticbeanstalk.com'