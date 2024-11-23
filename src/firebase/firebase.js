import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDK5UHV1AwKWeQ4F6TvT8XHzE8n-vDaTmI",
  authDomain: "cnc-manufacturing-report.firebaseapp.com",
  databaseURL: "https://cnc-manufacturing-report-default-rtdb.firebaseio.com",
  projectId: "cnc-manufacturing-report",
  storageBucket: "cnc-manufacturing-report.appspot.com",
  messagingSenderId: "245214675909",
  appId: "1:245214675909:web:73bb554af712d93d9a41ac"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app);

 