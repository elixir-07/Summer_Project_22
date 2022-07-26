// <script type="module">
   
  // Import the functions you need from the SDKs you need
//   import  { initializeApp }  from "https://www.gstatic.com/firebasejs/9.9.0/firebase-app.js";
//   import  { getAnalytics }  from "https://www.gstatic.com/firebasejs/9.9.0/firebase-analytics.js"

  import firebase from "firebase/app";
  // import { getFirestore }  from "firebase/firestore";
  import 'firebase/firestore';
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  // eslint-disable-next-line
  const firebaseConfig = {
    apiKey: "AIzaSyDU1ZLvCD5IuhlKe52KHSzfnMV0CGgMDNY",
    authDomain: "proctor-8a641.firebaseapp.com",
    projectId: "proctor-8a641",
    storageBucket: "proctor-8a641.appspot.com",
    messagingSenderId: "1043234175064",
    appId: "1:1043234175064:web:60ee409874041ea7c8b22d",
    measurementId: "G-74XN650L52"
  };

  // Initialize Firebase
  // Firebase App.initializeApp()
  // eslint-disable-next-line
  firebase.initializeApp(firebaseConfig);
//   export {app};
  // export const db = getFirestore(app);
  

// </script>