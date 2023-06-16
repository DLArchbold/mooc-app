import '../../App.css';
import $ from "jquery"
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Link, Routes } from 'react-router-dom';
import axios from "axios";
function AuthCodeReader() {



    useEffect(() => {
        //Load jquery when mounting component first
        // var querystring = require('querystring');
        const h1 = $('h1');
        console.log(h1);
    }, []);

    return (
        <div className="AuthCodeReader">
            <header className="App-header">
                {authCodeReaderFunction()}


            </header>
            Test
        </div>
    );


}


function authCodeReaderFunction() {
    var urlParams = new URLSearchParams(window.location.search);
    var authCode = urlParams.get('code'),
        state = urlParams.get('state'),
        error = urlParams.get('error'),
        errorDescription = urlParams.get('error_description');

    var details = [authCode, state, error, errorDescription];
    console.log("authcode: " + authCode)
    // window.opener.postMessage("authcode: " + authCode, "http://localhost:3000")
    // window.opener.postMessage("state: " + state, "http://localhost:3000")
    window.opener.postMessage(details, "http://localhost:4200")
    // if (error) {
    //     window.alert("The following error took place:" + error + ". Description of error:" + errorDescription);
    // } else {
    //     window.opener.postAuthorize(state, authCode);
    // }
    window.close();

    // return (
    //     <div>
    //         Authcode: {authCode}
    //     </div>
    // )
}
export default AuthCodeReader;
