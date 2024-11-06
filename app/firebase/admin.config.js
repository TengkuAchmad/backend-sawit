// ENVIRONTMENT
require('dotenv').config();

// LIBRARIES
const admin             = require('firebase-admin');
const { initializeApp } = require("firebase/app");

// SERVICE ACCOUNT KEY
const serviceAccount    = require("../../credentials/certificate-firebase.json");

// CONSTANTS
const { BUCKET_URL } = process.env;

// APP
let firebaseConfig = {
   credentiatls: admin.credential.cert(serviceAccount),
   storageBucket: BUCKET_URL,
}

const app = initializeApp(firebaseConfig);

exports.default = app;