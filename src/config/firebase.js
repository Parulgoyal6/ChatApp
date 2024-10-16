import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, setDoc,getDocs, doc, Timestamp, collection, query, where} from "firebase/firestore"
import { toast } from "react-toastify";

const firebaseConfig = {
  apiKey: "AIzaSyDy6G-1CNvtu26mVXOSAiiOSQ6FTk9fASc",
  authDomain: "chat-app-gs-ea6fd.firebaseapp.com",
  projectId: "chat-app-gs-ea6fd",
  storageBucket: "chat-app-gs-ea6fd.appspot.com",
  messagingSenderId: "875511677959",
  appId: "1:875511677959:web:5780186db3473f907856a2"
};

const app = initializeApp(firebaseConfig);

const auth =getAuth(app);
const db = getFirestore(app);

const signup = async(username, email , password, name, avatar) =>{
    try{

        const res= await createUserWithEmailAndPassword(auth, email, password);
        const user = res.user;
        await setDoc(doc(db, "users", user.uid), {
            id:user.uid,
            username:username.toLowerCase(),
            email,
            name:"",
            avatar:"",
            bio:"Hey, There I am using chat app",
            lastSeen: Date.now()
        })

        await setDoc(doc(db, "chats", user.uid),{
            chatsData: []
        })
    }catch(error){
        console.error(error)
        toast.error(error.code.split('/')[1].split('-').join(" "));
    }
}

//Login
const login = async (email, password) =>{
    try{
        await signInWithEmailAndPassword(auth, email, password)
    }catch(error){
        console.error(error)
        toast.error(error.code.split('/')[1].split('-').join(" "));
    }
}

//logout
const logout = async()=>{
    try{
    await signOut(auth)
    }
    catch(error){
        console.error(error);
        toast.error(error.code.split('/')[1].split('-').join(" "));
    }
}
const resetPass =async(email) =>{
    if(!email){
        toast.error("Enter your email")
        return null;
    }
    try{
        const userRef = collection(db, 'users');
        const q= query(userRef, where("email","==", email));
        const querySnap = await getDocs(q);

        if(!querySnap.empty){
            await sendPasswordResetEmail(auth, email);
            toast.success("Reset Email Sent");
        }
        else{
            toast.error("Email doesn't exist")
        }
    }catch(error){
        console.error(error);
        toast.error(error.message)
    }
}
export {signup, login, logout, auth, db, resetPass}
