// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAllvq9kMlkbaJzWJfACCqQXZfEV0am2k8",
  authDomain: "kershawlawfirm-38dba.firebaseapp.com",
  projectId: "kershawlawfirm-38dba",
  storageBucket: "kershawlawfirm-38dba.appspot.com",
  messagingSenderId: "246887407742",
  appId: "1:246887407742:web:ddb30806ddb2d3390b382f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
