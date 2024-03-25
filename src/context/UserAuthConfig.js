import {createContext, useState, useEffect, useContext} from "react";
import {auth} from "../firebase";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    GoogleAuthProvider,
    signInWithPopup,
    updateProfile,
} from "firebase/auth";

// auth = getAuth();

const userAuthContext = createContext();

export function UserAuthContextProvider({children}){
    const [user,setUser] = useState({});

    function logIn(email,password) {
        return signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log('User logged in:',user);
                return user;
            }).catch((error) => {
               console.error('Login error:', error.message);
               throw error;
            });
    }
    function signUp(email,name,password) {
        return createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            // console.log('User Signed in:',user);
            return updateProfile(user, { displayName: name })
                .then(() => {
                    console.log('User profile updated with name:', name);
                    return user;
                }).catch((error) => {
                    console.error('Error updating user profile:', error.message);
                    throw error;
                });
        }).catch((error)=>{
           console.error('Sign-up error:',error.message);
           throw error;
        });
    }
    function logOut() {
        return signOut(auth);
    }
    function googleSignIn() {
        const googleAuthProvider = new GoogleAuthProvider();
        return signInWithPopup(auth, googleAuthProvider);
    }

    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth, (currentuser)=>{
            // console.log("Auth",currentuser);
            setUser(currentuser);
        });
        return () => {
            unsubscribe();
        };
    },[]);

    return (
        <userAuthContext.Provider value={{user,logIn,signUp,logOut,googleSignIn}}>
            {children}
        </userAuthContext.Provider>
    );
}

export function useUserAuth() {
    return useContext(userAuthContext);
}