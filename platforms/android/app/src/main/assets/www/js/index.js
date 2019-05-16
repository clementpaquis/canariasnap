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

/**
 * BINDINGS
 */

//binding camera button
function getCameraStream(){
    document.getElementById('cam-btn').addEventListener('click',takePicture);
}

//binding camera button
document.getElementById('cam-btn').addEventListener('click',takePicture);

//binding return button
document.getElementById('back-btn').addEventListener('click',function(){
    var res = confirm("Leave Canaria Snap ?");
    if(res){
        navigator.app.exitApp();
    }
});

//binding upload button
document.getElementById('home-btn').addEventListener('click',function(){
    var img = document.getElementById('snap');
    console.log(img.src);
    var imageData = img.src;
});


/**
 * FUNCTIONS
 */

//get camera stream and take picture
function takePicture(){
    navigator.camera.getPicture(success,function(error){
        
    },{
        quality:100,
        correctOrientation: true,
        destinationType:Camera.DestinationType.FILE_URI,
        cameraDirection: Camera.Direction.BACK
    });
}

function uploadImage(imageData){
    var ft = new FileTransfer();
    //ft.upload(imageData,)
}

//shows image taken by takePicture() in dom
function success(imageData){
    var img = document.getElementById('snap');
    img.src = imageData; // "data:image/jpeg;base64," if DATA_URL
    document.getElementById('snap').style.display='block';
    document.getElementById('spinner').style.display = "block";

    //options for the file transfer
    var options = new FileUploadOptions();
    options.fileKey = "file";
    options.fileName = imageData.substr(imageData.lastIndexOf('/')+1);
    options.mimeType = "image/jpeg";
    options.headers = {
        Connection: "close"
     };

    var params = {};
    params.value1 = "test";
    params.value2 = "param";
    options.params = params;
    options.chunkedMode = false;

    //transfer to server
    var ft = new FileTransfer();
    ft.upload(imageData, "http://192.168.56.1/canariasnap/upload.php", function(result){

        //get JSON result and get res array from object
        var res = JSON.stringify(result);
        var array = JSON.parse(res);

        //split string to get result top5 as a tab
        var topFive = array.response.split(",");
        
        //get result div and put top1 in
        var node = document.getElementById('result');
        document.getElementById('spinner').style.display = "none";
        node.textContent = node.textContent + topFive[0].replace(/_/g, " ");
        document.getElementById('result').style.display = "block";

    }, function(error){
        //show error 
        alert('error : ' + JSON.stringify(error));
    }, options,true);
}

//if an error occurs with takePicture()
function error(err){
    alert('error : ' + err);
}

this.getCameraStream();
 
app.initialize();