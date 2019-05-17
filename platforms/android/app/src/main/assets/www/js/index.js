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

//binding home button
document.getElementById('home-btn').addEventListener('click',goHome);

//binding camera button
document.getElementById('cam-btn').addEventListener('click',takePicture);

//binding return button
document.getElementById('back-btn').addEventListener('click',function(){
    var res = confirm("Leave Canaria Snap ?");
    if(res){
        navigator.app.exitApp();
    }
});

//binding more info button
document.getElementById('info').addEventListener('click',getInfo);

/**
 * FUNCTIONS
 */

//go to home view
function goHome(){

}

//get camera stream and take picture
function takePicture(){
    navigator.camera.getPicture(success,function(error){
        
    },{
        cameraDirection : 1,
        quality:70,
        correctOrientation: true,
        destinationType:Camera.DestinationType.FILE_URI
        //cameraDirection: Camera.Direction.BACK
    });
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
    // ft.upload(imageData, "http://192.168.56.1/canariasnap/upload.php", function(result){ //running on localhost
    ft.upload(imageData, "http://10.22.147.180/canariasnap/upload.php", function(result){ //running on private ip

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

        this.fillInfo(topFive);

    }, function(error){
        //show error 
        alert('Error : ' + JSON.stringify(error));
    }, options,true);
}
 
//open info panel 
function getInfo(){
    // Get the modal
    var modal = document.getElementById('myModal');
    // Get the button that opens the modal
    var btn = document.getElementById('info');
    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName('popup-close')[0];
    modal.style.display = "block";
    // When the user clicks the button, open the modal 
    btn.addEventListener('click',function() {
        modal.style.display = "block";
    });

    // When the user clicks on <span> (x), close the modal
    span.addEventListener('click',function() {
        modal.style.display = "none";
    });

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
        }
    }
}

//fill info panel
function fillInfo(array){
    var top1,top2,top3,top4,top5;
    var node;

    top1 = array[0].replace(/_/g, " ");
    top2 = array[1].replace(/_/g, " ");
    top3 = array[2].replace(/_/g, " ");
    top4 = array[3].replace(/_/g, " ");
    top5 = array[4].replace(/_/g, " ");

    node = document.getElementById('species');
    node.textContent = "Most likely : " + top1 + "\n";
    node.textContent += "2nd most likely : " + top2 + "\n";
    node.textContent += "3rd most likely : " + top3 + "\n";
    node.textContent += "4th most likely : " + top4 + "\n";
    node.textContent += "5th most likely : " + top5 + "\n";

}

app.initialize();