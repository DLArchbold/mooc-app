
#docker
Run this command once Docker has started: 

docker run --detach --env MYSQL_ROOT_PASSWORD=dummypassword  --env MYSQL_USER=todos-user --env MYSQL_PASSWORD=dummytodos --env MYSQL_DATABASE=todos --name mysql --publish 3306:3306 mysql:5.7

Runs at port 3306


#spring boot API server
Using JDK 17
Run RestfulWebServicesApplication.java as a Java application
DB settings should be at src/main/resources/application.properties
SQL commands to auto-fill dummy data is at data.sql in same directory.

Runs at port 5000

Send a GET request to this http://localhost:5000/users/Student%201/comments HTTP endpoint to test it out using a HTTP client, output should be something like that:

[
    {
        "id": 1,
        "description": "description 1",
        "urgencyLevel": "3",
        "inResponseTo": 0,
        "targetDate": "2023-03-02T03:01:24.000+0000",
        "username": "Student 1",
        "votes": 1
    },
    {
        "id": 2,
        "description": "description 2",
        "urgencyLevel": "2",
        "inResponseTo": 1,
        "targetDate": "2023-03-02T03:01:24.000+0000",
        "username": "Student 2",
        "votes": 1
    },
    {
        "id": 3,
        "description": "description 3",
        "urgencyLevel": "1",
        "inResponseTo": 2,
        "targetDate": "2023-03-02T03:01:24.000+0000",
        "username": "Student 3",
        "votes": 1
    }
]

When building JAR/WAR, please:
use ${project_loc:05-restful-web-services-full-stack-bankend} as Base 
package as Goals
Check "Skip Tests"

#react front end
delete node_modules folder first, then run "npm install" with admin privileges, then "npm audit fix", then "npm run start". Should be able to start properly after that.

Login:
Username: Student 1 
Password :  
(able to set comment urgency level)
OR 
Username: Instructor 1
Password :  weijin

Edit/comment out/paste relevant code in CommentDataService or FeedbackDataService in src/api depending on whether you're sending HTTP requests to localhost or remote URL, constants defined in src/Constants.js

Runs at port 4200
