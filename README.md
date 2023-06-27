# mooc-app
React frontend for my personal project
Link to Docker image hosted on Docker Hub
https://hub.docker.com/layers/kweijin/mooc-app-front-end/working-front-end/images/sha256-b10c545ecbf89bc341192ff1cf3a572e0e8de23a6fe5f11c07696e8e97e5c604?context=repo

# Spring Boot backend resource server
https://github.com/DLArchbold/mooc-app-backend

# Eureka Server
https://github.com/DLArchbold/DiscoveryService

# Spring Cloud API Gateway
https://github.com/DLArchbold/ApiGateway

# MySQL Database Server
Run Docker command to download image container: 
docker run --detach --env MYSQL_ROOT_PASSWORD=dummypassword  --env MYSQL_USER=todos-user --env MYSQL_PASSWORD=dummytodos --env MYSQL_DATABASE=todos --name mysql --publish 3306:3306 mysql:5.7

# Keycloak server
https://github.com/DLArchbold/KeycloakInstallation

# Amazon EC2 Machine Image (AMI) of CI/CD server with appropriate Jenkins configuration and all of the above installed and configured 
- Please request for link to AMI

# Amazon EC2 Machine Image (AMI) of Tomcat deployment server 
- Please request for link to AMI