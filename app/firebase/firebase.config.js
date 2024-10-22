// LIBRARIES
const { initializeApp } = require("firebase/app")

const firebaseConfig = {
  apiKey: "AIzaSyB7wEc1tZUSjzUeeX5eIjdUVcjO9pWRyGU",
  authDomain: "eseuramoue.firebaseapp.com",
  databaseURL: "https://eseuramoue-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "eseuramoue",
  storageBucket: "eseuramoue.appspot.com",
  messagingSenderId: "149334571123",
  appId: "1:149334571123:web:f7313af1776ff56835d206",
  measurementId: "G-48N6775PDP"
};

const app = initializeApp(firebaseConfig)

exports.default = app
