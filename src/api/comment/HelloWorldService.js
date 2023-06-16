import axios from 'axios'


//Call all hellloWorld apis from here
class HelloWorldService{
    executeHelloWorldService(){

        return axios.get("http://localhost:8080/hello-world");
    }

    executeHelloWorldBeanService(){

        return axios.get("http://localhost:8080/hello-world-bean");
    }

    executeHelloWorldPathVariableService(name){

        return axios.get(`http://localhost:8082/user_follow/get/all`);
    }
}

export default new HelloWorldService()