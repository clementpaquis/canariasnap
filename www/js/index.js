/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },
};

//binding camera button
function getCameraStream(){
    document.getElementById('cam-btn').addEventListener('click',takePicture);
}

//binding return button
document.getElementById('back-btn').addEventListener('click',function(){
    var res = confirm("Leave Canaria Snap ?");
    if(res){
        navigator.app.exitApp();
    }
});

//get camera stream and take picture
function takePicture(){
    navigator.camera.getPicture(success,error,{
        quality:100,
        correctOrientation: true,
        destinationType:Camera.DestinationType.DATA_URL,
    });
}

//shows image taken by takePicture() in dom
function success(imageData){
    var img = document.getElementById('snap');
    img.src = "data:image/jpeg;base64,"+imageData;
    document.getElementById('snap').style.display='block';
}

//if an error occurs with takePicture()
function error(err){
    console.log('error : ' + err);
}

this.getCameraStream();
 
app.initialize();