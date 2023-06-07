import React, { Component } from 'react'
//import { Route, Redirect } from 'react-router-dom' //REACT-5
import AuthenticationService from './AuthenticationService.js'
import axios from "axios";
// import * as queryString from 'qs';
import queryString from 'qs';



class LoginComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: 'student1@gmail.com',
      password: 'student1',
      hasLoginFailed: false,
      showSuccessMessage: false,
      noUserFound: false,
      authenticated: false,
      eventData: [],
      accessToken: "",
      authCode: "",
      stateValue: "",
      codeVerifierValue: "",
      codeChallengeValue: ""
    }

    // this.handleEmailChange = this.handleEmailChange.bind(this)
    // this.handlePasswordChange = this.handlePasswordChange.bind(this)
    this.getAuthCode = this.getAuthCode.bind(this)
    this.postAuthorize = this.postAuthorize.bind(this)
    this.requestTokens = this.requestTokens.bind(this)
    this.getInfoFromResourceServer = this.getInfoFromResourceServer.bind(this)
    this.generateCodeChallenge = this.generateCodeChallenge.bind(this)
    this.base64urlencode = this.base64urlencode.bind(this)

    this.generateCodeVerifier = this.generateCodeVerifier.bind(this)
    this.generateState = this.generateState.bind(this)

    this.loginClicked = this.loginClicked.bind(this)
  }


  componentDidUpdate(prevProps, prevState) {
    if (prevState.authCode !== this.state.authCode) {
      // console.log("in componentDidUpdate")
      console.log("prevState.authCode: " + prevState.authCode + " " + "this.state.authCode: " + this.state.authCode)
      // if(this.state.authCode !== "" && this.state.authCode !== null){
      this.requestTokens("this.state.authCode - componentDidUpdate: " + this.state.authCode)
      // }

    }

    if (prevState.accessToken !== this.state.accessToken) {
      console.log("this.state.accessToken - componentDidUpdate: " + this.state.accessToken)
    }

  }
  componentDidMount() {
    // const h1 = $('h1');
    // console.log(h1);

    window.addEventListener(
      "message",


      (event) => {
        // var d = event.data[0]
        // var x = event.data[1]
        for (var k = 0; k < event.data.length; k++) {
          if (this.state.authCode !== this.state.eventData[0]) {
            this.setState({ authCode: event.data[0] }, () => {
              console.log("event.data[0] - componentDidMount: " + event.data[0]);
              console.log("this.state.authCode- componentDidMount: " + this.state.authCode);
            })
            break;
          }
        }

      }


    );






  }











  render() {

    return (
      <div>
        <h1>Login</h1>
        <div className="container"></div>

        <button className="btn btn-success" onClick={this.loginClicked}>Login</button>
      </div>









    );
  }






  async loginClicked() {
    await this.generateState(30)
    // await this.generateCodeVerifier()
    // await this.generateCodeChallenge()
    // await this.getAuthCode()//Will auto call requestToken() and getInfoFromResourceServer()


  }












  generateState(length) {
    var sv = "";
    var alphaNumericCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var alphaNumericCharactersLength = alphaNumericCharacters.length;
    for (var i = 0; i < length; i++) {
      sv += alphaNumericCharacters.charAt(Math.floor(Math.random() * alphaNumericCharactersLength));
    }

    // document.getElementById("stateValue").innerHTML = sv;

    if (sv !== "") {
      this.setState({ stateValue: sv }, () => {

        this.generateCodeVerifier();

      })
    }

  }

  generateCodeVerifier() {
    var returnValue = "";
    var randomByteArray = new Uint8Array(32);
    window.crypto.getRandomValues(randomByteArray);

    returnValue = this.base64urlencode(randomByteArray);

    // document.getElementById("codeVerifierValue").innerHTML = returnValue;

    if (returnValue !== "") {
      this.setState({ codeVerifierValue: returnValue }, () => {
        this.generateCodeChallenge()
      })
    }

  }


  base64urlencode(sourceValue) {
    var stringValue = String.fromCharCode.apply(null, sourceValue);
    var base64Encoded = btoa(stringValue);
    var base64urlEncoded = base64Encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    return base64urlEncoded;
  }

  async generateCodeChallenge() {
    var cChallengeValue = "";

    // var codeVerifier = document.getElementById("codeVerifierValue").innerHTML;
    var codeVerifier = this.state.codeVerifierValue;

    var textEncoder = new TextEncoder('US-ASCII');
    var encodedValue = textEncoder.encode(codeVerifier);
    var digest = await window.crypto.subtle.digest("SHA-256", encodedValue);

    cChallengeValue = this.base64urlencode(Array.from(new Uint8Array(digest)));

    // document.getElementById("codeChallengeValue").innerHTML = codeChallengeValue;

    if (cChallengeValue !== "") {
      console.log("cChallengeValue before getAuthCode(): " + cChallengeValue)
      this.setState({ codeChallengeValue: cChallengeValue }, () => {
        this.getAuthCode()
      })

    }

  }



  getAuthCode() {
    // var state = document.getElementById("stateValue").innerHTML;
    // var codeChallenge = document.getElementById("codeChallengeValue").innerHTML;
    var state = this.state.stateValue;
    var codeChallenge = this.state.codeChallengeValue;

    // var authorizationURL = "http://localhost:8080/realms/appsdeveloperblog/protocol/openid-connect/auth";
    var authorizationURL = "http://localhost:8080/auth/realms/mooc-app/protocol/openid-connect/auth";
    authorizationURL += "?client_id=mooc-app-PKCE-client";
    authorizationURL += "&response_type=code";
    authorizationURL += "&scope=openid";
    authorizationURL += "&redirect_uri=http://localhost:4200/AuthCodeReader";
    authorizationURL += "&state=" + state;
    authorizationURL += "&code_challenge=" + codeChallenge;
    authorizationURL += "&code_challenge_method=S256";

    window.open(authorizationURL, 'authorizationRequestWindow', 'width=800,height=600,left=200,top=200');
  }

  postAuthorize(authCode, state) {
    // alert("State: " + state + " AuthCode: " + authCode)
    var originalStateValue = document.getElementById("stateValue").innerHTML;



    if (state === originalStateValue) {
      this.requestTokens(authCode);


      // console.log("authCode in postAuthorize: " + authCode)
    } else {
      alert("Invalid state value received");
    }
  }

  requestTokens(authCode) {
    var codeVerifier = this.state.codeVerifierValue;
    // console.log("authCode in requestTokens: " + this.state.authCode)

    if (this.state.authCode !== "") {
      // var request_code = this.state.authCode.toString()
      var request_data = {
        "grant_type": "authorization_code",
        "client_id": "mooc-app-PKCE-client",
        "code": this.state.authCode,
        "code_verifier": codeVerifier,
        "redirect_uri": "http://localhost:4200/AuthCodeReader"
      };


      axios.post('http://localhost:8080/auth/realms/mooc-app/protocol/openid-connect/token', queryString.stringify(request_data))
        .then(
          response => {
            // console.log("response.data.access_token: "+ JSON.stringify(response.data.access_token))
            // document.getElementById("accessToken").innerHTML = response.data.access_token;
            // console.log("Access token1: " + response.data.access_token)

            this.setState({ accessToken: response.data.access_token }, () => {
              // console.log("this.state.accessToken: " + this.state.accessToken)
              this.getInfoFromResourceServer()
              AuthenticationService.registerSuccessfulLogin(this.state.email, this.state.password)
              // this.props.history.push("/welcome")
              //use ticks not single quotes
              this.props.navigate(`/welcome/${this.state.email}`)
            })


          }
        );

    }





  }




  getInfoFromResourceServer() {

    // var accessToken = document.getElementById("accessToken").innerHTML;
    // console.log("accessToken1: " + this.state.accessToken)
    if (this.state.accessToken !== null) {
      console.log("getInfoFromResourceServer")
      console.log("accessToken2: " + this.state.accessToken)
      const ax = require('axios')
      let reqInstance = axios.create({
        headers: {
          Authorization: `Bearer ${this.state.accessToken}`
        }
      })


      reqInstance.get(`http://localhost:8082/user_follow/get/all`)
        .then(
          response => {
            console.log("response.data: " + JSON.stringify(response.data))
          }
        );

    }



  }



}





// import React, { Component } from 'react'
// //import { Route, Redirect } from 'react-router-dom' //REACT-5
// import AuthenticationService from './AuthenticationService.js'
// import axios from "axios";
// // import * as queryString from 'qs';
// import queryString from 'qs';



// class LoginComponent extends Component {
//   constructor(props) {
//     super(props)
//     this.state = {
//       email: 'student1@gmail.com',
//       password: 'student1',
//       hasLoginFailed: false,
//       showSuccessMessage: false,
//       noUserFound: false,
//       authenticated: false,
//       eventData: [],
//       accessToken: "",
//       authCode: "",
//       stateValue: "",
//       codeVerifierValue: "",
//       codeChallengeValue: ""
//     }

//     // this.handleEmailChange = this.handleEmailChange.bind(this)
//     // this.handlePasswordChange = this.handlePasswordChange.bind(this)
//     this.getAuthCode = this.getAuthCode.bind(this)
//     this.postAuthorize = this.postAuthorize.bind(this)
//     this.requestTokens = this.requestTokens.bind(this)
//     this.getInfoFromResourceServer = this.getInfoFromResourceServer.bind(this)
//     this.generateCodeChallenge = this.generateCodeChallenge.bind(this)
//     this.base64urlencode = this.base64urlencode.bind(this)

//     this.generateCodeVerifier = this.generateCodeVerifier.bind(this)
//     this.generateState = this.generateState.bind(this)

//     this.loginClicked = this.loginClicked.bind(this)
//   }


//   componentDidUpdate(prevProps, prevState) {
//     if (prevState.authCode !== this.state.authCode) {
//       // console.log("in componentDidUpdate")
//       console.log("prevState.authCode: " + prevState.authCode + " " + "this.state.authCode: " + this.state.authCode)
//       // if(this.state.authCode !== "" && this.state.authCode !== null){
//       this.requestTokens("this.state.authCode - componentDidUpdate: " + this.state.authCode)
//       // }

//     }

//     if (prevState.accessToken !== this.state.accessToken) {
//       console.log("this.state.accessToken - componentDidUpdate: " + this.state.accessToken)
//     }

//   }
//   componentDidMount() {
//     // const h1 = $('h1');
//     // console.log(h1);

//     window.addEventListener(
//       "message",


//       (event) => {
//         // var d = event.data[0]
//         // var x = event.data[1]
//         for (var k = 0; k < event.data.length; k++) {
//           if (this.state.authCode !== this.state.eventData[0]) {
//             this.setState({ authCode: event.data[0] }, () => {
//               console.log("event.data[0] - componentDidMount: " + event.data[0]);
//               console.log("this.state.authCode- componentDidMount: " + this.state.authCode);
//             })
//             break;
//           }
//         }

//       }


//     );






//   }











//   render() {

//     return (
//       <div className="App">
//         <header className="App-header">
//           {/* <img src={logo} className="App-logo" alt="logo" /> */}
//           <p>
//             Edit <code>src/App.js</code> and save to reload.
//           </p>


//           <h1>Index page</h1>


//           <div id='stateValue'></div>
//           <div className="container">

//             <button onClick={() =>
//               this.generateState(30)} className="btn ">Generate state value</button>

//           </div>



//           <div id='codeVerifierValue'></div>
//           <div className="container">

//             <button onClick={() =>
//               this.generateCodeVerifier()} className="btn ">Generate Code Verifier value</button>

//           </div>

//           <div id='codeChallengeValue'></div>
//           <div className="container">

//             <button onClick={() =>
//               this.generateCodeChallenge()} className="btn ">Generate Code Challenge value</button>

//           </div>

//           <br />
//           <div id='codeChallengeValue'></div>
//           <div className="container">

//             <button onClick={() =>
//               this.getAuthCode()} className="btn ">Get Authorization code</button>

//           </div>


//           <p>Access token: <span id="accessToken"></span></p>

//           <br>
//           </br>

//           <div ></div>
//           <div className="container">

//             <button onClick={() =>
//               this.getInfoFromResourceServer()} className="btn ">Get info from resource server</button>

//           </div>
//           <h1>Login</h1>
//           <div className="container"></div>
//           {/* <ShowInvalidCredentials hasLoginFailed={this.state.hasLoginFailed} /> */}
//           {/* {this.state.hasLoginFailed && <div className="alert alert-warning">Invalid Credentials</div>}
//                  {this.state.noUserFound && <div className="alert alert-warning">No user found, please register</div>} */}
//           {/* <ShowLoginSuccessMessage showSuccessMesage={this.state.showSuccessMessage}/> */}
//           {/* {this.state.showSuccessMessage && <div>Login Succesful</div>} */}
//           {/* User Name:<input type="text" name="email" value={this.state.email} onChange={this.handleChange} />
//                  <br></br>
//                  <br></br>
//                  Password:<input type="password" name="password" value={this.state.password} onChange={this.handleChange} /> */}
//           <button className="btn btn-success" onClick={() =>
//             this.loginClicked()}>Login</button>

//         </header>




//       </div>

//     );
//   }






//   async loginClicked() {
//     await this.generateState(30)
//     // await this.generateCodeVerifier()
//     // await this.generateCodeChallenge()
//     // await this.getAuthCode()//Will auto call requestToken() and getInfoFromResourceServer()


//   }












//   generateState(length) {
//     var sv = "";
//     var alphaNumericCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//     var alphaNumericCharactersLength = alphaNumericCharacters.length;
//     for (var i = 0; i < length; i++) {
//       sv += alphaNumericCharacters.charAt(Math.floor(Math.random() * alphaNumericCharactersLength));
//     }

//     // document.getElementById("stateValue").innerHTML = sv;

//     if(sv!==""){
//       this.setState({ stateValue: sv }, () => {

//         this.generateCodeVerifier();

//       })
//     }

//   }

//   generateCodeVerifier() {
//     var returnValue = "";
//     var randomByteArray = new Uint8Array(32);
//     window.crypto.getRandomValues(randomByteArray);

//     returnValue = this.base64urlencode(randomByteArray);

//     document.getElementById("codeVerifierValue").innerHTML = returnValue;

//     if (returnValue !== "") {
//       this.setState({ codeVerifierValue: returnValue }, () => {
//         this.generateCodeChallenge()
//       })
//     }

//   }


//   base64urlencode(sourceValue) {
//     var stringValue = String.fromCharCode.apply(null, sourceValue);
//     var base64Encoded = btoa(stringValue);
//     var base64urlEncoded = base64Encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
//     return base64urlEncoded;
//   }

//   async generateCodeChallenge() {
//     var cChallengeValue = "";

//     // var codeVerifier = document.getElementById("codeVerifierValue").innerHTML;
//     var codeVerifier = this.state.codeVerifierValue;

//     var textEncoder = new TextEncoder('US-ASCII');
//     var encodedValue = textEncoder.encode(codeVerifier);
//     var digest = await window.crypto.subtle.digest("SHA-256", encodedValue);

//     cChallengeValue = this.base64urlencode(Array.from(new Uint8Array(digest)));

//     // document.getElementById("codeChallengeValue").innerHTML = codeChallengeValue;

//     if (cChallengeValue !== "") {
//       console.log("cChallengeValue before getAuthCode(): " + cChallengeValue)
//       this.setState({ codeChallengeValue: cChallengeValue }, () => {
//         this.getAuthCode()
//       })

//     }

//   }



//   getAuthCode() {
//     // var state = document.getElementById("stateValue").innerHTML;
//     // var codeChallenge = document.getElementById("codeChallengeValue").innerHTML;
//     var state = this.state.stateValue;
//     var codeChallenge = this.state.codeChallengeValue;

//     // var authorizationURL = "http://localhost:8080/realms/appsdeveloperblog/protocol/openid-connect/auth";
//     var authorizationURL = "http://localhost:8080/auth/realms/mooc-app/protocol/openid-connect/auth";
//     authorizationURL += "?client_id=mooc-app-PKCE-client";
//     authorizationURL += "&response_type=code";
//     authorizationURL += "&scope=openid";
//     authorizationURL += "&redirect_uri=http://localhost:4200/AuthCodeReader";
//     authorizationURL += "&state=" + state;
//     authorizationURL += "&code_challenge=" + codeChallenge;
//     authorizationURL += "&code_challenge_method=S256";

//     window.open(authorizationURL, 'authorizationRequestWindow', 'width=800,height=600,left=200,top=200');
//   }

//   postAuthorize(authCode, state) {
//     // alert("State: " + state + " AuthCode: " + authCode)
//     var originalStateValue = document.getElementById("stateValue").innerHTML;



//     if (state === originalStateValue) {
//       this.requestTokens(authCode);


//       // console.log("authCode in postAuthorize: " + authCode)
//     } else {
//       alert("Invalid state value received");
//     }
//   }

//   requestTokens(authCode) {
//     var codeVerifier = this.state.codeVerifierValue;
//     // console.log("authCode in requestTokens: " + this.state.authCode)

//     if (this.state.authCode !== "") {
//       // var request_code = this.state.authCode.toString()
//       var request_data = {
//         "grant_type": "authorization_code",
//         "client_id": "mooc-app-PKCE-client",
//         "code": this.state.authCode,
//         "code_verifier": codeVerifier,
//         "redirect_uri": "http://localhost:4200/AuthCodeReader"
//       };


//       axios.post('http://localhost:8080/auth/realms/mooc-app/protocol/openid-connect/token', queryString.stringify(request_data))
//         .then(
//           response => {
//             // console.log("response.data.access_token: "+ JSON.stringify(response.data.access_token))
//             document.getElementById("accessToken").innerHTML = response.data.access_token;
//             // console.log("Access token1: " + response.data.access_token)

//             this.setState({ accessToken: response.data.access_token }, () => {
//               // console.log("this.state.accessToken: " + this.state.accessToken)
//               this.getInfoFromResourceServer()
//             })


//           }
//         );

//     }





//   }




//   getInfoFromResourceServer() {

//     // var accessToken = document.getElementById("accessToken").innerHTML;
//     // console.log("accessToken1: " + this.state.accessToken)
//     if (this.state.accessToken !== null) {
//       console.log("getInfoFromResourceServer")
//       console.log("accessToken2: " + this.state.accessToken)
//       const ax = require('axios')
//       let reqInstance = axios.create({
//         headers: {
//           Authorization: `Bearer ${this.state.accessToken}`
//         }
//       })


//       reqInstance.get(`http://localhost:8082/user_follow/get/all`)
//         .then(
//           response => {
//             console.log("response.data: " + JSON.stringify(response.data))
//           }
//         );

//     }



//   }



// }









// import React, { Component } from 'react'
// //import { Route, Redirect } from 'react-router-dom' //REACT-5
// import AuthenticationService from './AuthenticationService.js'
// import axios from "axios";
// // import * as queryString from 'qs';
// import queryString from 'qs';



// class LoginComponent extends Component {
//   constructor(props) {
//     super(props)
//     this.state = {
//       email: 'student1@gmail.com',
//       password: 'student1',
//       hasLoginFailed: false,
//       showSuccessMessage: false,
//       noUserFound: false,
//       authenticated: false,
//       eventData: [],
//       accessToken: "",
//       authCode: ""
//     }

//     // this.handleEmailChange = this.handleEmailChange.bind(this)
//     // this.handlePasswordChange = this.handlePasswordChange.bind(this)
//     this.getAuthCode = this.getAuthCode.bind(this)
//     this.postAuthorize = this.postAuthorize.bind(this)
//     this.requestTokens = this.requestTokens.bind(this)
//     this.getInfoFromResourceServer = this.getInfoFromResourceServer.bind(this)
//     this.generateCodeChallenge = this.generateCodeChallenge.bind(this)
//     this.base64urlencode = this.base64urlencode.bind(this)

//     this.generateCodeVerifier = this.generateCodeVerifier.bind(this)
//     this.generateState = this.generateState.bind(this)

//     this.loginClicked = this.loginClicked.bind(this)
//   }


//   componentDidUpdate(prevProps, prevState) {
//     if (prevState.authCode !== this.state.authCode) {
//       // console.log("in componentDidUpdate")
//       console.log("prevState.authCode: " + prevState.authCode + " " + "this.state.authCode: " + this.state.authCode)
//       // if(this.state.authCode !== "" && this.state.authCode !== null){
//         this.requestTokens("this.state.authCode - componentDidUpdate: " + this.state.authCode)
//       // }

//     }

//     if (prevState.accessToken !== this.state.accessToken) {
//       console.log("this.state.accessToken - componentDidUpdate: " + this.state.accessToken)
//     }

//   }
//   componentDidMount() {
//     // const h1 = $('h1');
//     // console.log(h1);

//     window.addEventListener(
//       "message",


//       (event) => {
//         // var d = event.data[0]
//         // var x = event.data[1]
//         for (var k = 0; k < event.data.length; k++) {
//           if (this.state.authCode !== this.state.eventData[0]) {
//             this.setState({ authCode: event.data[0] }, () => {
//               console.log("event.data[0] - componentDidMount: " + event.data[0]);
//               console.log("this.state.authCode- componentDidMount: " + this.state.authCode);
//             })
//             break;
//           }
//         }

//       }


//     );






//   }











//   render() {

//     return (
//       <div className="App">
//         <header className="App-header">
//           {/* <img src={logo} className="App-logo" alt="logo" /> */}
//           <p>
//             Edit <code>src/App.js</code> and save to reload.
//           </p>


//           <h1>Index page</h1>


//           <div id='stateValue'></div>
//           <div className="container">

//             <button onClick={() =>
//               this.generateState(30)} className="btn ">Generate state value</button>

//           </div>



//           <div id='codeVerifierValue'></div>
//           <div className="container">

//             <button onClick={() =>
//               this.generateCodeVerifier()} className="btn ">Generate Code Verifier value</button>

//           </div>

//           <div id='codeChallengeValue'></div>
//           <div className="container">

//             <button onClick={() =>
//               this.generateCodeChallenge()} className="btn ">Generate Code Challenge value</button>

//           </div>

//           <br />
//           <div id='codeChallengeValue'></div>
//           <div className="container">

//             <button onClick={() =>
//               this.getAuthCode()} className="btn ">Get Authorization code</button>

//           </div>


//           <p>Access token: <span id="accessToken"></span></p>

//           <br>
//           </br>

//           <div ></div>
//           <div className="container">

//             <button onClick={() =>
//               this.getInfoFromResourceServer()} className="btn ">Get info from resource server</button>

//           </div>
//           <h1>Login</h1>
//           <div className="container"></div>
//           {/* <ShowInvalidCredentials hasLoginFailed={this.state.hasLoginFailed} /> */}
//           {/* {this.state.hasLoginFailed && <div className="alert alert-warning">Invalid Credentials</div>}
//                  {this.state.noUserFound && <div className="alert alert-warning">No user found, please register</div>} */}
//           {/* <ShowLoginSuccessMessage showSuccessMesage={this.state.showSuccessMessage}/> */}
//           {/* {this.state.showSuccessMessage && <div>Login Succesful</div>} */}
//           {/* User Name:<input type="text" name="email" value={this.state.email} onChange={this.handleChange} />
//                  <br></br>
//                  <br></br>
//                  Password:<input type="password" name="password" value={this.state.password} onChange={this.handleChange} /> */}
//           <button className="btn btn-success" onClick={() =>
//               this.loginClicked()}>Login</button>

//         </header>




//       </div>

//     );
//   }









//   loginClicked() {
//     this.generateState(30)
//     this.generateCodeVerifier()
//     this.generateCodeChallenge()
//     this.getAuthCode()//Will auto call requestToken() and getInfoFromResourceServer()
//     // this.getInfoFromResourceServer()
//   }










//   generateState(length) {
//     var stateValue = "";
//     var alphaNumericCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//     var alphaNumericCharactersLength = alphaNumericCharacters.length;
//     for (var i = 0; i < length; i++) {
//       stateValue += alphaNumericCharacters.charAt(Math.floor(Math.random() * alphaNumericCharactersLength));
//     }

//     document.getElementById("stateValue").innerHTML = stateValue;
//   }

//   generateCodeVerifier() {
//     var returnValue = "";
//     var randomByteArray = new Uint8Array(32);
//     window.crypto.getRandomValues(randomByteArray);

//     returnValue = this.base64urlencode(randomByteArray);

//     document.getElementById("codeVerifierValue").innerHTML = returnValue;
//   }


//   base64urlencode(sourceValue) {
//     var stringValue = String.fromCharCode.apply(null, sourceValue);
//     var base64Encoded = btoa(stringValue);
//     var base64urlEncoded = base64Encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
//     return base64urlEncoded;
//   }

//   async generateCodeChallenge() {
//     var codeChallengeValue = "";

//     var codeVerifier = document.getElementById("codeVerifierValue").innerHTML;

//     var textEncoder = new TextEncoder('US-ASCII');
//     var encodedValue = textEncoder.encode(codeVerifier);
//     var digest = await window.crypto.subtle.digest("SHA-256", encodedValue);

//     codeChallengeValue = this.base64urlencode(Array.from(new Uint8Array(digest)));

//     document.getElementById("codeChallengeValue").innerHTML = codeChallengeValue;
//   }



//   getAuthCode() {
//     var state = document.getElementById("stateValue").innerHTML;
//     var codeChallenge = document.getElementById("codeChallengeValue").innerHTML;

//     // var authorizationURL = "http://localhost:8080/realms/appsdeveloperblog/protocol/openid-connect/auth";
//     var authorizationURL = "http://localhost:8080/auth/realms/mooc-app/protocol/openid-connect/auth";
//     authorizationURL += "?client_id=mooc-app-PKCE-client";
//     authorizationURL += "&response_type=code";
//     authorizationURL += "&scope=openid";
//     authorizationURL += "&redirect_uri=http://localhost:4200/AuthCodeReader";
//     authorizationURL += "&state=" + state;
//     authorizationURL += "&code_challenge=" + codeChallenge;
//     authorizationURL += "&code_challenge_method=S256";

//     window.open(authorizationURL, 'authorizationRequestWindow', 'width=800,height=600,left=200,top=200');
//   }

//   postAuthorize(authCode, state) {
//     // alert("State: " + state + " AuthCode: " + authCode)
//     var originalStateValue = document.getElementById("stateValue").innerHTML;



//     if (state === originalStateValue) {
//       this.requestTokens(authCode);


//       // console.log("authCode in postAuthorize: " + authCode)
//     } else {
//       alert("Invalid state value received");
//     }
//   }

//   requestTokens(authCode) {
//     var codeVerifier = document.getElementById("codeVerifierValue").innerHTML;
//     // console.log("authCode in requestTokens: " + this.state.authCode)

//     if (this.state.authCode !== ) {
//       // var request_code = this.state.authCode.toString()
//       var request_data = {
//         "grant_type": "authorization_code",
//         "client_id": "mooc-app-PKCE-client",
//         "code": this.state.authCode,
//         "code_verifier": codeVerifier,
//         "redirect_uri": "http://localhost:4200/AuthCodeReader"
//       };


//       axios.post('http://localhost:8080/auth/realms/mooc-app/protocol/openid-connect/token', queryString.stringify(request_data))
//         .then(
//           response => {
//             // console.log("response.data.access_token: "+ JSON.stringify(response.data.access_token))
//             document.getElementById("accessToken").innerHTML = response.data.access_token;
//             // console.log("Access token1: " + response.data.access_token)

//             this.setState({ accessToken: response.data.access_token }, () => {
//               // console.log("this.state.accessToken: " + this.state.accessToken)
//               this.getInfoFromResourceServer()
//             })


//           }
//         );

//     }





//   }




//   getInfoFromResourceServer() {

//     // var accessToken = document.getElementById("accessToken").innerHTML;
//     // console.log("accessToken1: " + this.state.accessToken)
//     if (this.state.accessToken !== null) {
//       console.log("getInfoFromResourceServer")
//       console.log("accessToken2: " + this.state.accessToken)
//       const ax = require('axios')
//       let reqInstance = axios.create({
//         headers: {
//           Authorization: `Bearer ${this.state.accessToken}`
//         }
//       })


//       reqInstance.get(`http://localhost:8082/user_follow/get/all`)
//         .then(
//           response => {
//             console.log("response.data: " + JSON.stringify(response.data))
//           }
//         );

//     }



//   }



// }









// import React, { Component } from 'react'
// //import { Route, Redirect } from 'react-router-dom' //REACT-5
// import AuthenticationService from './AuthenticationService.js'
// import axios from "axios";
// // import * as queryString from 'qs';
// import queryString from 'qs';



// class LoginComponent extends Component {
//     constructor(props) {
//         super(props)
//         this.state = {
//             email: 'student1@gmail.com',
//             password: 'student1',
//             hasLoginFailed: false,
//             showSuccessMessage: false,
//             noUserFound: false,
//             authenticated: false,
//             eventData: [],
//       accessToken: "",
//       authCode: ""
//         }

//         // this.handleEmailChange = this.handleEmailChange.bind(this)
//         // this.handlePasswordChange = this.handlePasswordChange.bind(this)
//         this.handleChange = this.handleChange.bind(this)
//         this.loginClicked = this.loginClicked.bind(this)


//         this.getAuthCode = this.getAuthCode.bind(this)
//         // this.postAuthorize = this.postAuthorize.bind(this)
//         this.requestTokens = this.requestTokens.bind(this)
//         this.getInfoFromResourceServer = this.getInfoFromResourceServer.bind(this)
//         this.generateCodeChallenge = this.generateCodeChallenge.bind(this)
//         this.base64urlencode = this.base64urlencode.bind(this)

//         this.generateCodeVerifier = this.generateCodeVerifier.bind(this)
//         this.generateState = this.generateState.bind(this)
//     }


//     componentDidUpdate(prevProps, prevState) {
//                 if (prevState.authCode !== this.state.authCode) {
//           // console.log("in componentDidUpdate")
//           console.log("prevState.authCode: " + prevState.authCode + " " + "this.state.authCode: " + this.state.authCode)
//           this.requestTokens("this.state.authCode - componentDidUpdate: " +  this.state.authCode)
//         }

//         if(prevState.accessToken !== this.state.accessToken){
//           console.log("this.state.accessToken - componentDidUpdate: " + this.state.accessToken)
//         }

//       }
//       componentDidMount() {

//         //   var querystring = require('querystring');

//         // const h1 = $('h1');
//         // console.log(h1);

//         window.addEventListener(
//           "message",    
//         (event) => {
//             // var d = event.data[0]
//             // var x = event.data[1]
//             for (var k = 0; k < event.data.length; k++) {
//               if (this.state.authCode !== this.state.eventData[0]) {
//                 this.setState({ authCode: event.data[0] }, () => {
//                   console.log("event.data[0] - componentDidMount: " + event.data[0]);
//                   console.log("this.state.authCode- componentDidMount: "  +  this.state.authCode);
//                 //   console.log()
//                 })
//                 break;
//               }
//             }

//           }


//         );





//       }


//     loginClicked() {
//         this.getAuthCode();

//     }

//     handleChange(event) {
//         //console.log(this.state);
//         this.setState(
//             {
//                 [event.target.name]: event.target.value
//             }
//         )
//     }
//     // handlePasswordChange(event){
//     //     console.log(event.target.value);
//     //     this.setState({password :event.target.value})    
//     // }

//     generateState(length) {
//         var stateValue = "";
//         var alphaNumericCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//         var alphaNumericCharactersLength = alphaNumericCharacters.length;
//         for (var i = 0; i < length; i++) {
//           stateValue += alphaNumericCharacters.charAt(Math.floor(Math.random() * alphaNumericCharactersLength));
//         }

//         document.getElementById("stateValue").innerHTML = stateValue;
//         // return stateValue;
//       }


//     generateCodeVerifier() {
//         var returnValue = "";
//         var randomByteArray = new Uint8Array(32);
//         window.crypto.getRandomValues(randomByteArray);

//         returnValue = this.base64urlencode(randomByteArray);

//         document.getElementById("codeVerifierValue").innerHTML = returnValue;
//         // return returnValue;
//       }


//       base64urlencode(sourceValue) {
//         var stringValue = String.fromCharCode.apply(null, sourceValue);
//         var base64Encoded = btoa(stringValue);
//         var base64urlEncoded = base64Encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
//         return base64urlEncoded;
//       }

//       async generateCodeChallenge() {
//         var codeChallengeValue = "";

//         var codeVerifier = this.generateCodeVerifier();

//         var textEncoder = new TextEncoder('US-ASCII');
//         var encodedValue = textEncoder.encode(codeVerifier);
//         var digest = await window.crypto.subtle.digest("SHA-256", encodedValue);

//         codeChallengeValue = this.base64urlencode(Array.from(new Uint8Array(digest)));

//         document.getElementById("codeChallengeValue").innerHTML = codeChallengeValue;
//         // console.log("Code challenge value: " + codeChallengeValue)
//         // return codeChallengeValue;
//       }



//       getAuthCode() {
//         var state = document.getElementById("stateValue").innerHTML;
//         var codeChallenge = document.getElementById("codeChallengeValue").innerHTML;

//         // var authorizationURL = "http://localhost:8080/realms/appsdeveloperblog/protocol/openid-connect/auth";
//         var authorizationURL = "http://localhost:8080/auth/realms/mooc-app/protocol/openid-connect/auth";
//         authorizationURL += "?client_id=mooc-app-PKCE-client";
//         authorizationURL += "&response_type=code";
//         authorizationURL += "&scope=openid";
//         authorizationURL += "&redirect_uri=http://localhost:4200/AuthCodeReader";
//         authorizationURL += "&state=" + state;
//         authorizationURL += "&code_challenge=" + codeChallenge;
//         authorizationURL += "&code_challenge_method=S256";

//         window.open(authorizationURL, 'authorizationRequestWindow', 'width=800,height=600,left=200,top=200');
//       }



//       requestTokens(authCode) {
//         var codeVerifier = document.getElementById("codeVerifierValue").innerHTML;
//         // console.log("authCode in requestTokens: " + this.state.authCode)

//         if (this.state.authCode !== "") {
//           // var request_code = this.state.authCode.toString()
//           var request_data = {
//             "grant_type": "authorization_code",
//             "client_id": "mooc-app-PKCE-client",
//             "code": this.state.authCode,
//             "code_verifier": codeVerifier,
//             "redirect_uri": "http://localhost:4200/AuthCodeReader"
//           };


//         //   axios.post('http://localhost:8080/auth/realms/mooc-app/protocol/openid-connect/token', JSON.stringify(request_data))
//         axios.post('http://localhost:8080/auth/realms/mooc-app/protocol/openid-connect/token', queryString.stringify(request_data))
//             .then(
//               response => {
//                 // console.log("response.data.access_token: "+ JSON.stringify(response.data.access_token))
//                 document.getElementById("accessToken").innerHTML = response.data.access_token;
//                 // console.log("Access token1: " + response.data.access_token)

//                 this.setState({accessToken:response.data.access_token}, ()=>{
//                   // console.log("this.state.accessToken: " + this.state.accessToken)
//                   this.getInfoFromResourceServer()
//                 })


//               }
//             );

//         }





//       }




//       getInfoFromResourceServer() {

//         // var accessToken = document.getElementById("accessToken").innerHTML;
//         // console.log("accessToken1: " + this.state.accessToken)
//         if (this.state.accessToken !== null) {
//           console.log("getInfoFromResourceServer")
//           console.log("accessToken2: " + this.state.accessToken)
//           const ax = require('axios')
//           let reqInstance = axios.create({
//             headers: {
//               Authorization: `Bearer ${this.state.accessToken}`
//             }
//           })


//           reqInstance.get(`http://localhost:8082/user_follow/get/all`)
//             .then(
//               response => {
//                 console.log("response.data: " + JSON.stringify(response.data))
//               }
//             );

//         }



//       }

//     render() {
//         return (
//             <div>
//                 <h1>Login</h1>
//                 <div className="container"></div>
//                 {/* <ShowInvalidCredentials hasLoginFailed={this.state.hasLoginFailed} /> */}
//                 {/* {this.state.hasLoginFailed && <div className="alert alert-warning">Invalid Credentials</div>}
//                 {this.state.noUserFound && <div className="alert alert-warning">No user found, please register</div>} */}
//                 {/* <ShowLoginSuccessMessage showSuccessMesage={this.state.showSuccessMessage}/> */}
//                 {/* {this.state.showSuccessMessage && <div>Login Succesful</div>} */}
//                 {/* User Name:<input type="text" name="email" value={this.state.email} onChange={this.handleChange} />
//                 <br></br>
//                 <br></br>
//                 Password:<input type="password" name="password" value={this.state.password} onChange={this.handleChange} /> */}
//                 <div id='stateValue'></div>
//                 <div className="container">

//             <button onClick={() =>
//               this.generateState(30)} className="btn ">Generate state value</button>

//           </div>
//                 <div id='codeVerifierValue'></div>

//                 <div className="container">

// <button onClick={() =>
//   this.generateCodeVerifier()} className="btn ">Generate Code Verifier value</button>

// </div>



//                 <div id='codeChallengeValue'></div>
//                 <div className="container">

//             <button onClick={() =>
//               this.getAuthCode()} className="btn ">Get Authorization code</button>

//           </div>
//           <button className="btn btn-success" onClick={this.loginClicked}>Login</button>
//             </div>


//         )
//     }



// }




// export default LoginComponent


// import React, { Component } from 'react'
// //import { Route, Redirect } from 'react-router-dom' //REACT-5
// import AuthenticationService from './AuthenticationService.js'


// class LoginComponent extends Component {
//     constructor(props) {
//         super(props)
//         this.state = {
//             email: 'student1@gmail.com',
//             password: 'student1',
//             hasLoginFailed: false,
//             showSuccessMessage: false,
//             noUserFound: false,
//             authenticated: false
//         }

//         // this.handleEmailChange = this.handleEmailChange.bind(this)
//         // this.handlePasswordChange = this.handlePasswordChange.bind(this)
//         this.handleChange = this.handleChange.bind(this)
//         this.loginClicked = this.loginClicked.bind(this)

//     }


//     loginClicked() {

//         let applicationUser = {

//             email: this.state.email,
//             password: this.state.password
//         }

//         AuthenticationService.checkIfApplicationUserExists(applicationUser)
//             .then(
//                 response => {
//                     if (response != undefined) {
//                         console.log("User found!")
//                         // console.log(response.data['email'])

//                         AuthenticationService.authenticateApplicationUser(applicationUser)
//                             .then(
//                                 response => {
//                                     if (response != undefined) {
//                                         console.log("Authenticated")
//                                         this.setState({ showSuccessMessage: true })
//                                         // this.setState({ hasLoginFailed: false })
//                                         this.setState({authenticated:true})

//                                         AuthenticationService.registerSuccessfulLogin(this.state.email, this.state.password)
//                                         // this.props.history.push("/welcome")
//                                         //use ticks not single quotes
//                                         this.props.navigate(`/welcome/${this.state.email}`)
//                                     } else {
//                                         console.log("Incorrect email or password")
//                                         this.setState({ showSuccessMessage: false })
//                                         this.setState({ hasLoginFailed: true })
//                                         this.setState({authenticated:true})
//                                     }
//                                 }

//                             )


//                     } else {
//                         console.log("User not found, create new user!")
//                         this.setState({ showSuccessMessage: false })
//                         this.setState({ hasLoginFailed: true })
//                         this.setState({ noUserFound: true })
//                         this.setState({authenticated:true})
//                     }


//                 }

//             )


//         // if(this.state.authenticated == true){
//         //    AuthenticationService.registerSuccessfulLogin(this.state.email, this.state.password)
//         //     // this.props.history.push("/welcome")
//         //     //use ticks not single quotes
//         //     this.props.navigate(`/welcome/${this.state.email}`)
//         //     // console.log('Successful')
//         //     // this.setState({showSuccessMessage:true})
//         //     // this.setState({hasLoginFailed:false})


//         // }
//         // else{
//         //     //  console.log('Failed') 
//         //     this.setState({showSuccessMessage:false})
//         //     this.setState({hasLoginFailed:true})
//         // }
//         console.log(this.state);
//     }

//     handleChange(event) {
//         //console.log(this.state);
//         this.setState(
//             {
//                 [event.target.name]: event.target.value
//             }
//         )
//     }
//     // handlePasswordChange(event){
//     //     console.log(event.target.value);
//     //     this.setState({password :event.target.value})    
//     // }
//     render() {
//         return (
//             <div>
//                 <h1>Login</h1>
//                 <div className="container"></div>
//                 {/* <ShowInvalidCredentials hasLoginFailed={this.state.hasLoginFailed} /> */}
//                 {this.state.hasLoginFailed && <div className="alert alert-warning">Invalid Credentials</div>}
//                 {this.state.noUserFound && <div className="alert alert-warning">No user found, please register</div>}
//                 {/* <ShowLoginSuccessMessage showSuccessMesage={this.state.showSuccessMessage}/> */}
//                 {this.state.showSuccessMessage && <div>Login Succesful</div>}
//                 User Name:<input type="text" name="email" value={this.state.email} onChange={this.handleChange} />
//                 <br></br>
//                 <br></br>
//                 Password:<input type="password" name="password" value={this.state.password} onChange={this.handleChange} />
//                 <button className="btn btn-success" onClick={this.loginClicked}>Login</button>
//             </div>
//         )
//     }

// postAuthorize(authCode, state) {
//     // alert("State: " + state + " AuthCode: " + authCode)
//     var originalStateValue = document.getElementById("stateValue").innerHTML;



//     if (state === originalStateValue) {
//       this.requestTokens(authCode);


//       // console.log("authCode in postAuthorize: " + authCode)
//     } else {
//       alert("Invalid state value received");
//     }
//   }

// }

// export default LoginComponent


export default LoginComponent

