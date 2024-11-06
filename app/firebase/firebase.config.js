const { initializeApp } = require("firebase/app")

const firebaseConfig = {
  apiKey: "AIzaSyBfrdfJ6pfQysYYvFy4wA3kujCCvZa580Q",
  authDomain: "prof-d1cc3.firebaseapp.com",
  projectId: "prof-d1cc3",
  storageBucket: "prof-d1cc3.appspot.com",
  messagingSenderId: "407306171924",
  appId: "1:407306171924:web:b47360b285c7330e865901"
};

const app = initializeApp(firebaseConfig);

exports.default = app
