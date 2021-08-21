const uuid = require('uuid');
const chalk = require('chalk')
const firebase = require('firebase');

var firebaseConfig = {
    apiKey: "AIzaSyDuAgwbJmFVFJPYlLx2D0zcW6UTHAb6iEI",
    authDomain: "jaysn-factionsbot.firebaseapp.com",
    databaseURL: "https://jaysn-factionsbot-default-rtdb.firebaseio.com",
    projectId: "jaysn-factionsbot",
    storageBucket: "jaysn-factionsbot.appspot.com",
    messagingSenderId: "445392737870",
    appId: "1:445392737870:web:f5f9117d8966f05b51d51f",
    measurementId: "G-QYPMQ31W9W"
  };
  // Initialize Firebase
  
firebase.initializeApp(firebaseConfig);
let db = firebase.database()
let new_keys = {}
for (let step = 0; step < 10; step++) {
    //let token = Math.random().toString(12).substring(2,12)+uuid.v4()+Math.random().toString(26).substring(2,26)
    //console.log(chalk.hex("#F1C40F")(chalk.bold("Glowstone Token:"), chalk.bold.red(token)))
    new_keys[token] = "brr"
}

db.ref().child("1911ba7b591287502a-d710-46da-996d-50c443b3e406cc686a50-a11d-4d01-948b-855858f76cbac30d4294-02d7-4cf3-9118-d6e57779d6590wxl94vm0iia").update(updates)

//
